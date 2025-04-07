
import React from "react";
import { BookMarked, Clock, AlertCircle, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loan } from "@/lib/types";
import { toast } from "sonner";

interface CurrentLoansProps {
  loans: Loan[];
  activeLoans: Loan[];
  overdueLoans: Loan[];
  isLoading: boolean;
  handleReturnBook: (loanId: string) => void;
}

const CurrentLoans: React.FC<CurrentLoansProps> = ({ 
  loans, 
  activeLoans, 
  overdueLoans, 
  isLoading, 
  handleReturnBook 
}) => {
  const calculateDaysLeft = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-display font-bold">Current Loans</h2>
        <Button variant="ghost" size="sm" className="text-primary gap-1">
          View All <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      
      {isLoading ? (
        <div className="py-10 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your loans...</p>
        </div>
      ) : activeLoans.length === 0 && overdueLoans.length === 0 ? (
        <div className="text-center py-10">
          <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
            <BookOpen className="h-6 w-6 text-gray-500" />
          </div>
          <h3 className="text-lg font-medium mb-2">No Active Loans</h3>
          <p className="text-gray-500 mb-6">
            You don't have any books checked out at the moment.
          </p>
          <Button asChild>
            <a href="/books">Browse Books</a>
          </Button>
        </div>
      ) : (
        <div className="divide-y">
          {/* Overdue loans */}
          {overdueLoans.length > 0 && (
            <>
              <div className="bg-red-50 rounded-lg p-3 mb-4 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="text-sm text-red-700">
                  You have {overdueLoans.length} overdue {overdueLoans.length === 1 ? 'book' : 'books'}. Please return them as soon as possible.
                </span>
              </div>
              
              {overdueLoans.map(loan => (
                <div key={loan.id} className="py-4 flex flex-col md:flex-row gap-4 animate-fade-in">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-28 bg-gray-200 rounded overflow-hidden">
                      {loan.book && (
                        <img
                          src={loan.book.coverImage}
                          alt={loan.book.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="font-medium">{loan.book?.title}</h3>
                    <p className="text-sm text-gray-500">
                      {loan.book?.authors.map(a => a.name).join(", ")}
                    </p>
                    
                    <div className="mt-2 flex flex-wrap gap-3 text-sm">
                      <div className="flex items-center">
                        <BookMarked className="h-4 w-4 text-gray-400 mr-1" />
                        <span>Borrowed: {new Date(loan.loanDate).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-red-500 font-medium">
                          Overdue: {Math.abs(calculateDaysLeft(loan.dueDate))} days
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 flex items-start gap-2 md:ml-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleReturnBook(loan.id)}
                    >
                      Return Book
                    </Button>
                  </div>
                </div>
              ))}
            </>
          )}
          
          {/* Active loans */}
          {activeLoans.map(loan => (
            <div key={loan.id} className="py-4 flex flex-col md:flex-row gap-4 animate-fade-in">
              <div className="flex-shrink-0">
                <div className="w-20 h-28 bg-gray-200 rounded overflow-hidden">
                  {loan.book && (
                    <img
                      src={loan.book.coverImage}
                      alt={loan.book.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
              
              <div className="flex-grow">
                <h3 className="font-medium">{loan.book?.title}</h3>
                <p className="text-sm text-gray-500">
                  {loan.book?.authors.map(a => a.name).join(", ")}
                </p>
                
                <div className="mt-2 flex flex-wrap gap-3 text-sm">
                  <div className="flex items-center">
                    <BookMarked className="h-4 w-4 text-gray-400 mr-1" />
                    <span>Borrowed: {new Date(loan.loanDate).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-1" />
                    <span className={`${
                      calculateDaysLeft(loan.dueDate) <= 3 ? "text-amber-500 font-medium" : ""
                    }`}>
                      Due: {new Date(loan.dueDate).toLocaleDateString()} 
                      ({calculateDaysLeft(loan.dueDate)} days left)
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0 flex items-start gap-2 md:ml-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleReturnBook(loan.id)}
                >
                  Return Book
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrentLoans;
