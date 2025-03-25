
import { useState } from "react";
import { Link } from "react-router-dom";
import { Book } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AuthForm from "@/components/ui/AuthForm";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Login = () => {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: any) => {
    try {
      setError(null);
      await login(data.email, data.password);
    } catch (err) {
      setError("Invalid email or password. Please try again.");
      toast.error("Login failed. Please check your credentials.");
    }
  };

  const handleAdminLogin = () => {
    login("sarah.williams@example.com", "password");
  };

  const handleStaffLogin = () => {
    login("robert.johnson@example.com", "password");
  };

  const handleMemberLogin = () => {
    login("john.doe@example.com", "password");
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
                onClick={handleAdminLogin}
              >
                Sign in as Admin
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/5"
                onClick={handleStaffLogin}
              >
                Sign in as Staff
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/5"
                onClick={handleMemberLogin}
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
