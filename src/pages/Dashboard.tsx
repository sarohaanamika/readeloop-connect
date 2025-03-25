
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import BookCard from "@/components/ui/BookCard";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { books, getLoansWithDetails, getRecommendations } from "@/lib/data";
import { Loan } from "@/lib/types";
import { BookOpen, Clock, BookMarked, AlertCircle, ArrowRight, ArrowUpRight, BookCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      // Simulate API call
      setTimeout(() => {
        const allLoans = getLoansWithDetails();
        const userLoans = allLoans.filter(loan => loan.memberId === user?.id);
        setLoans(userLoans);
        setIsLoading(false);
      }, 1000);
    }
  }, [isAuthenticated, user?.id]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const activeLoans = loans.filter(loan => loan.status === "active");
  const overdueLoans = loans.filter(loan => loan.status === "overdue");
  const recommendations = getRecommendations(user.id);

  const calculateDueDate = (loanDate: string, days: number = 14) => {
    const date = new Date(loanDate);
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculateDaysLeft = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleReturnBook = (loanId: string) => {
    // Simulate API call
    setTimeout(() => {
      // Find the loan
      const loanIndex = loans.findIndex(loan => loan.id === loanId);
      if (loanIndex !== -1) {
        // Update loan status
        const updatedLoans = [...loans];
        updatedLoans[loanIndex] = {
          ...updatedLoans[loanIndex],
          status: "returned",
          returnDate: new Date().toISOString().split('T')[0]
        };
        setLoans(updatedLoans);

        // Update book availability (in a real app, this would be handled by the backend)
        const bookId = updatedLoans[loanIndex].bookId;
        const book = books.find(b => b.id === bookId);
        if (book) {
          book.availableCopies += 1;
        }
        
        toast.success("Book returned successfully!");
      }
    }, 800);
  };

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mr-4">
                    <BookMarked className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Active Loans</p>
                    <h3 className="text-2xl font-bold">{activeLoans.length}</h3>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600 mr-4">
                    <BookCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Books Returned</p>
                    <h3 className="text-2xl font-bold">
                      {loans.filter(loan => loan.status === "returned").length}
                    </h3>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-600 mr-4">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Overdue Books</p>
                    <h3 className="text-2xl font-bold">{overdueLoans.length}</h3>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 text-purple-600 mr-4">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Borrowed</p>
                    <h3 className="text-2xl font-bold">{loans.length}</h3>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Current Loans Section */}
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
            
            {/* Recommendations Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-display font-bold">Recommended For You</h2>
                <Button variant="ghost" size="sm" className="text-primary gap-1" asChild>
                  <a href="/books">
                    More Books <ArrowUpRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendations.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
