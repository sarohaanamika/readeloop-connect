
import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";
import { useLoans } from "@/hooks/useLoans";
import { useRecommendations } from "@/hooks/useRecommendations";
import DashboardStats from "@/components/dashboard/DashboardStats";
import CurrentLoans from "@/components/dashboard/CurrentLoans";
import BookRecommendations from "@/components/dashboard/BookRecommendations";
import { Loader2 } from "lucide-react";

const Dashboard: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("Dashboard mounted, auth state:", { isAuthenticated, isLoading, user });
    
    if (!isLoading && !isAuthenticated) {
      console.log("User is not authenticated, redirecting to login from Dashboard");
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, user, navigate]);
  
  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Loading authentication...</span>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  const { loans, activeLoans, overdueLoans, isLoading: loansLoading, handleReturnBook } = useLoans();
  const { recommendations, isLoading: recommendationsLoading, error: recommendationsError } = useRecommendations(user?.id || "");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex flex-1 pt-16">
        <Sidebar />
        
        <main className="flex-1 ml-0 md:ml-64 p-6 transition-all duration-300">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-display font-bold">Welcome, {user?.name}!</h1>
              <p className="text-gray-600 mt-1">
                Here's an overview of your library activity
              </p>
            </div>
            
            {/* Stats Grid */}
            <DashboardStats 
              activeLoansCount={activeLoans.length}
              returnedLoansCount={loans.filter(loan => loan.status === "returned").length}
              overdueLoansCount={overdueLoans.length}
              totalLoansCount={loans.length}
            />
            
            {/* Current Loans Section */}
            <CurrentLoans 
              loans={loans}
              activeLoans={activeLoans}
              overdueLoans={overdueLoans}
              isLoading={loansLoading}
              handleReturnBook={handleReturnBook}
            />
            
            {/* Recommendations Section */}
            <BookRecommendations 
              recommendations={recommendations}
              isLoading={recommendationsLoading}
              error={recommendationsError}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
