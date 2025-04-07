
import { supabase } from "@/lib/supabase";
import { Loan } from "@/lib/types";
import { transformLoanData } from "./loanTransformers";

/**
 * Creates a new loan for a book to a member
 */
export const createLoan = async (
  memberId: string, 
  bookId: string, 
  dueDate: string
): Promise<Loan | null> => {
  try {
    console.log(`Creating loan for member ${memberId}, book ${bookId}, due ${dueDate}`);
    
    // First check if book is available
    const { data: bookData, error: bookError } = await supabase
      .from('books')
      .select('available_copies')
      .eq('id', bookId)
      .single();
    
    if (bookError) {
      console.error("Error checking book availability:", bookError);
      throw new Error(`Error checking book availability: ${bookError.message}`);
    }
    
    if (!bookData || bookData.available_copies <= 0) {
      console.error("Book is not available for loan");
      throw new Error('Book is not available for loan');
    }
    
    console.log("Book is available, creating loan");
    
    // Create the loan
    const { data, error } = await supabase
      .from('loans')
      .insert({
        member_id: memberId,
        book_id: bookId,
        due_date: dueDate,
        status: 'active'
      })
      .select(`
        *,
        book:books(*),
        member:users(*)
      `)
      .single();
    
    if (error) {
      console.error("Error creating loan:", error);
      throw new Error(`Error creating loan: ${error.message}`);
    }
    
    if (!data) {
      console.log("No data returned from loan creation");
      return null;
    }
    
    console.log("Loan created successfully");
    
    // Transform the data to match our Loan type
    return transformLoanData(data);
  } catch (error) {
    console.error("Error in createLoan:", error);
    return null;
  }
};

/**
 * Marks a loan as returned
 */
export const returnLoan = async (loanId: string): Promise<boolean> => {
  try {
    console.log(`Returning loan ${loanId}`);
    
    const { error } = await supabase
      .from('loans')
      .update({
        status: 'returned',
        return_date: new Date().toISOString()
      })
      .eq('id', loanId)
      .eq('status', 'active');
    
    if (error) {
      console.error("Error returning loan:", error);
      throw new Error(`Error returning loan: ${error.message}`);
    }
    
    console.log("Loan returned successfully");
    return true;
  } catch (error) {
    console.error("Error in returnLoan:", error);
    return false;
  }
};
