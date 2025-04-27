
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
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
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
      console.log("Formatting user with authUser:", authUser.id);
      
      // If user metadata is not provided, fetch from the database
      if (!userData) {
        // Use the table we know exists in Supabase
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (error) {
          console.error("Error fetching user data:", error);
          return null;
        }
        
        userData = data;
        console.log("Found user data:", userData);
      }

      // If still no user data, return null - we don't want to create a user automatically
      if (!userData) {
        console.log("No user data found");
        return null;
      }

      // Return user with formatted data
      const roleString = userData.role || 'member';
      const role = roleString === 'admin' ? UserRole.ADMIN : 
                  roleString === 'staff' ? UserRole.STAFF : UserRole.MEMBER;
      
      console.log("Formatted user with role:", role);
      
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

  // This function will be used to update the authentication state
  const updateAuthState = async (session: any) => {
    if (session) {
      try {
        const formattedUser = await formatUser(session.user);
        if (formattedUser) {
          console.log("Setting authenticated user:", formattedUser.email, "with role:", formattedUser.role);
          setUser(formattedUser);
          setIsAuthenticated(true);
        } else {
          console.log("Failed to format user data");
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error updating auth state:", error);
        setUser(null);
        setIsAuthenticated(false);
      }
    } else {
      console.log("No session, user is not authenticated");
      setUser(null);
      setIsAuthenticated(false);
    }
    
    setIsLoading(false);
  };

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        console.log("Initializing auth...");
        
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        console.log("Current session:", session ? "Found" : "Not found");
        
        await updateAuthState(session);
      } catch (error) {
        console.error("Auth initialization error:", error);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    // Set up auth state change subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        // Use setTimeout to prevent deadlocks with Supabase auth
        setTimeout(async () => {
          await updateAuthState(session);
        }, 0);
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
      console.log("Attempting to sign in with:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Supabase auth error:", error);
        throw error;
      }

      if (data.user) {
        console.log("Login successful for user:", data.user.email);
        // Auth state will be updated by the onAuthStateChange listener
        toast.success(`Login successful!`);
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
      
      // Auth state will be updated by the onAuthStateChange listener
      toast.success("Logged out successfully");
      navigate('/login');
    } catch (error: any) {
      console.error("Logout error:", error.message);
      toast.error("Error during logout. Please try again.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout }}>
      {children}
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
