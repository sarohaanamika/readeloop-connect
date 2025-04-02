import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { AuthContextType, User, UserRole } from "@/lib/types";
import { users } from "@/lib/data";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check for stored user data on initial load
    const storedUser = localStorage.getItem("libraryUser");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("libraryUser");
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Find user with matching email and password
        const foundUser = users.find(
          u => u.email === email && u.password === password
        );
        
        if (foundUser) {
          // Remove password before storing
          const { password: _, ...userWithoutPassword } = foundUser;
          
          setUser(userWithoutPassword);
          setIsAuthenticated(true);
          localStorage.setItem("libraryUser", JSON.stringify(userWithoutPassword));
          toast.success(`Welcome back, ${userWithoutPassword.name}!`);
          resolve();
        } else {
          toast.error("Invalid email or password");
          reject(new Error("Invalid credentials"));
        }
      }, 800); // Simulate network delay
    });
  };

  const register = async (userData: Partial<User>, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if email already exists
        const existingUser = users.find(u => u.email === userData.email);
        
        if (existingUser) {
          toast.error("Email already in use");
          reject(new Error("Email already in use"));
          return;
        }

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
        
        // Create new user
        const newUser: User = {
          id: `user${users.length + 1}`,
          name: userData.name || "New User",
          email: userData.email || "",
          password: password,
          role: UserRole.MEMBER,
          permissions: getDefaultPermissions(UserRole.MEMBER), // Dynamically assign permissions
          membershipStartDate: new Date().toISOString().split('T')[0],
          address: userData.address,
          phoneNumber: userData.phoneNumber,
          profile: {
            avatarUrl: "/images/avatars/default.jpg",
            membershipType: "Standard",
            joinDate: new Date().toISOString().split('T')[0]
          }
        };
        
        // Add to mock data (in a real app, this would be saved to DB)
        users.push(newUser);
        
        // Set as current user
        setUser(newUser);
        setIsAuthenticated(true);
        localStorage.setItem("libraryUser", JSON.stringify(newUser));
        
        toast.success("Registration successful!");
        resolve();
      }, 800); // Simulate network delay
    });
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("libraryUser");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
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