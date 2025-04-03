import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Book } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AuthForm from "@/components/ui/AuthForm";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      console.log("User already authenticated, redirecting to dashboard");
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Attempting login with:", data.email);
      await login(data.email, data.password);
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Attempting demo login with:", email);
      await login(email, password);
    } catch (err) {
      console.error("Demo login error:", err);
      setError("Could not log in with demo account. Please try again.");
      toast.error("Login failed. Please try again with the regular login form.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
        <div className="w-full max-w-md space-y-8">
          <div>
            <div className="flex justify-center">
              <Link to="/" className="flex items-center gap-2">
                <Book className="h-8 w-8 text-primary" />
                <span className="text-xl font-display font-bold">Athenaeum</span>
              </Link>
            </div>
            
            <h2 className="mt-6 text-center text-3xl font-display font-bold tracking-tight">
              Sign in to your account
            </h2>
            
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{" "}
              <Link
                to="/register"
                className="font-medium text-primary hover:text-primary/80"
              >
                create a new account
              </Link>
            </p>
          </div>
          
          <div className="bg-white shadow rounded-xl p-6 space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}
            
            <AuthForm type="login" onSubmit={handleSubmit} />
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  Demo Accounts
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-3 text-sm">
              <Button
                type="button"
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/5"
                onClick={() => handleDemoLogin("admin@athenaeum.com", "password123")}
                disabled={isLoading}
              >
                Sign in as Admin
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/5"
                onClick={() => handleDemoLogin("staff@athenaeum.com", "password123")}
                disabled={isLoading}
              >
                Sign in as Staff
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/5"
                onClick={() => handleDemoLogin("member@athenaeum.com", "password123")}
                disabled={isLoading}
              >
                Sign in as Member
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
