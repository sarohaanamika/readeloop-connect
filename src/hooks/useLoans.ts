
import { useState, useEffect } from "react";
import { Loan } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { books } from "@/lib/data";
import { fetchLoans } from "@/services/loan";

export const useLoans = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load loans data
  useEffect(() => {
    if (user?.id) {
      const loadLoans = async () => {
        setIsLoading(true);
        try {
          // Try to fetch real loans from Supabase
          const userLoans = await fetchLoans(user.id);
          setLoans(userLoans);
        } catch (error) {
          console.error("Error fetching loans:", error);
          
          // Fallback to mock data
          setTimeout(() => {
            // Simulate API call with mock data
            const userLoans = [];
            setLoans(userLoans);
          }, 1000);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadLoans();
    }
  }, [user?.id]);

  const activeLoans = loans.filter(loan => loan.status === "active");
  const overdueLoans = loans.filter(loan => loan.status === "overdue");

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

  return {
    loans,
    activeLoans,
    overdueLoans,
    isLoading,
    handleReturnBook
  };
};
