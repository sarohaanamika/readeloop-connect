
import React from "react";
import { Navigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";
import { useLoans } from "@/hooks/useLoans";
import { useRecommendations } from "@/hooks/useRecommendations";
import DashboardStats from "@/components/dashboard/DashboardStats";
import CurrentLoans from "@/components/dashboard/CurrentLoans";
import BookRecommendations from "@/components/dashboard/BookRecommendations";

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { loans, activeLoans, overdueLoans, isLoading, handleReturnBook } = useLoans();
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const { recommendations, isLoading: isLoadingRecommendations, error: recommendationsError } = useRecommendations(user?.id || "");

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
              isLoading={isLoading}
              handleReturnBook={handleReturnBook}
            />
            
            {/* Recommendations Section */}
            <BookRecommendations 
              recommendations={recommendations}
              isLoading={isLoadingRecommendations}
              error={recommendationsError}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
