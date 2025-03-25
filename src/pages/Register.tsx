
import { Link } from "react-router-dom";
import { Book } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AuthForm from "@/components/ui/AuthForm";
import { toast } from "sonner";

const Register = () => {
  const { register } = useAuth();

  const handleSubmit = async (data: any) => {
    try {
      await register(
        {
          name: data.name,
          email: data.email,
          address: data.address,
          phoneNumber: data.phoneNumber,
        },
        data.password
      );
      
      toast.success("Registration successful! You can now log in.");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
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
              Create a new account
            </h2>
            
            <p className="mt-2 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-primary hover:text-primary/80"
              >
                Sign in
              </Link>
            </p>
          </div>
          
          <div className="bg-white shadow rounded-xl p-6 space-y-6">
            <AuthForm type="register" onSubmit={handleSubmit} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
