
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface AuthFormProps {
  type: "login" | "register";
  onSubmit: (data: any) => Promise<void>;
}

const AuthForm = ({ type, onSubmit }: AuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      address: "",
      phoneNumber: "",
    },
  });

  const onFormSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      
      if (type === "register" && data.password !== data.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      
      await onSubmit(data);
      navigate(type === "login" ? "/dashboard" : "/login");
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form 
      onSubmit={handleSubmit(onFormSubmit)} 
      className="space-y-6 animate-fade-in"
      noValidate
    >
      {type === "register" && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              className="mt-1.5"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-destructive text-sm mt-1">{errors.name.message as string}</p>
            )}
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          className="mt-1.5"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
        />
        {errors.email && (
          <p className="text-destructive text-sm mt-1">{errors.email.message as string}</p>
        )}
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <div className="relative mt-1.5">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="pr-10"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-destructive text-sm mt-1">{errors.password.message as string}</p>
        )}
      </div>

      {type === "register" && (
        <>
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative mt-1.5">
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className="pr-10"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value, formValues) =>
                    value === formValues.password || "Passwords do not match",
                })}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-destructive text-sm mt-1">
                {errors.confirmPassword.message as string}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="address">Address (Optional)</Label>
            <Input
              id="address"
              placeholder="Enter your address"
              className="mt-1.5"
              {...register("address")}
            />
          </div>

          <div>
            <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
            <Input
              id="phoneNumber"
              placeholder="Enter your phone number"
              className="mt-1.5"
              {...register("phoneNumber")}
            />
          </div>
        </>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {type === "login" ? "Logging in..." : "Creating account..."}
          </>
        ) : (
          <>{type === "login" ? "Log In" : "Create Account"}</>
        )}
      </Button>

      <div className="text-center text-sm">
        {type === "login" ? (
          <p>
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary font-medium hover:underline transition"
            >
              Sign up
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-medium hover:underline transition"
            >
              Log in
            </Link>
          </p>
        )}
      </div>
    </form>
  );
};

export default AuthForm;
