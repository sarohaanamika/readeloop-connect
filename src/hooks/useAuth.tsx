import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { UserRole } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

// Define user type that works with Supabase
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: {
    canManageBooks: boolean;
    canManageUsers: boolean;
    canBorrowBooks: boolean;
  };
  membershipStartDate?: string;
  address?: string;
  phoneNumber?: string;
  membershipType?: string;
  profile?: {
    avatarUrl?: string;
    membershipType?: string;
    joinDate: string;
  };
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Function to get default permissions based on role
  const getDefaultPermissions = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return {
          canManageBooks: true,
          canManageUsers: true,
          canBorrowBooks: true
        };
      case UserRole.STAFF:
        return {
          canManageBooks: true,
          canManageUsers: false,
          canBorrowBooks: true
        };
      case UserRole.MEMBER:
      default:
        return {
          canManageBooks: false,
          canManageUsers: false,
          canBorrowBooks: true
        };
    }
  };

  // Transform Supabase user data to our application's user format
  const formatUser = async (authUser: any, userData?: any): Promise<User | null> => {
    if (!authUser) return null;

    try {
      // If user metadata is not provided, fetch from the database
      if (!userData) {
        // Use the table we know exists in Supabase
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (error) throw error;
        userData = data;
      }

      // If still no user data, create a basic user record
      if (!userData) {
        const defaultRole = UserRole.MEMBER;
        return {
          id: authUser.id,
          email: authUser.email || '',
          name: authUser.user_metadata?.name || 'User',
          role: defaultRole,
          permissions: getDefaultPermissions(defaultRole),
          membershipStartDate: new Date().toISOString().split('T')[0],
          membershipType: 'standard',
          profile: {
            avatarUrl: "/images/avatars/default.jpg",
            membershipType: "Standard",
            joinDate: new Date().toISOString().split('T')[0]
          }
        };
      }

      // Return user with formatted data
      const role = (userData.role as UserRole) || UserRole.MEMBER;
      return {
        id: authUser.id,
        email: authUser.email || userData.email,
        name: userData.name || authUser.user_metadata?.name || 'User',
        role: role,
        permissions: getDefaultPermissions(role),
        membershipStartDate: userData.membership_start_date || new Date().toISOString().split('T')[0],
        address: userData.address,
        phoneNumber: userData.phone_number,
        membershipType: userData.membership_type || 'standard',
        profile: {
          avatarUrl: userData.avatar_url || "/images/avatars/default.jpg",
          membershipType: userData.membership_type ? 
            userData.membership_type.charAt(0).toUpperCase() + userData.membership_type.slice(1) : 
            "Standard",
          joinDate: userData.created_at || new Date().toISOString().split('T')[0]
        }
      };
    } catch (error) {
      console.error("Error formatting user:", error);
      return null;
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Get user data from the users table
          const formattedUser = await formatUser(session.user);
          
          if (formattedUser) {
            setUser(formattedUser);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    // Set up auth state change subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const formattedUser = await formatUser(session.user);
          if (formattedUser) {
            setUser(formattedUser);
            setIsAuthenticated(true);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    );

    initAuth();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        const formattedUser = await formatUser(data.user);
        if (formattedUser) {
          setUser(formattedUser);
          setIsAuthenticated(true);
          toast.success(`Welcome back, ${formattedUser.name}!`);
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      console.error("Login error:", error.message);
      toast.error(error.message || "Login failed. Please check your credentials.");
      throw error;
    }
  };

  const register = async (userData: Partial<User>, password: string): Promise<void> => {
    try {
      // Sign up user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email || '',
        password: password,
        options: {
          data: {
            name: userData.name
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("User registration failed");

      // Create user record in the users table
      const { error: dbError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          name: userData.name || 'New User',
          email: userData.email || '',
          role: UserRole.MEMBER,
          address: userData.address || '',
          phone_number: userData.phoneNumber || '',
          membership_type: 'standard',
          membership_start_date: new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString()
        });

      if (dbError) throw dbError;

      toast.success("Registration successful! You can now log in.");
      navigate('/login');
    } catch (error: any) {
      console.error("Registration error:", error.message);
      toast.error(error.message || "Registration failed. Please try again.");
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setIsAuthenticated(false);
      toast.success("Logged out successfully");
      navigate('/login');
    } catch (error: any) {
      console.error("Logout error:", error.message);
      toast.error("Error during logout. Please try again.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
