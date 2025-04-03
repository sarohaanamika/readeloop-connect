
import { supabase } from "@/lib/supabase";
import { Loan } from "@/lib/types";

export const fetchLoans = async (memberId?: string): Promise<Loan[]> => {
  try {
    let query = supabase
      .from('loans')
      .select(`
        *,
        book:books(*),
        member:users(*)
      `);
    
    if (memberId) {
      query = query.eq('member_id', memberId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Error fetching loans: ${error.message}`);
    }
    
    if (!data) return [];
    
    // Transform the Supabase response to match our Loan type
    return data.map(loan => ({
      id: loan.id,
      memberId: loan.member_id,
      bookId: loan.book_id,
      loanDate: loan.loan_date,
      dueDate: loan.due_date,
      returnDate: loan.return_date,
      status: loan.status,
      book: loan.book,
      member: loan.member
    }));
  } catch (error) {
    console.error("Error in fetchLoans:", error);
    return [];
  }
};

export const createLoan = async (
  memberId: string, 
  bookId: string, 
  dueDate: string
): Promise<Loan | null> => {
  try {
    // First check if book is available
    const { data: bookData, error: bookError } = await supabase
      .from('books')
      .select('available_copies')
      .eq('id', bookId)
      .single();
    
    if (bookError) {
      throw new Error(`Error checking book availability: ${bookError.message}`);
    }
    
    if (!bookData || bookData.available_copies <= 0) {
      throw new Error('Book is not available for loan');
    }
    
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
      throw new Error(`Error creating loan: ${error.message}`);
    }
    
    if (!data) return null;
    
    // Transform the Supabase response to match our Loan type
    return {
      id: data.id,
      memberId: data.member_id,
      bookId: data.book_id,
      loanDate: data.loan_date,
      dueDate: data.due_date,
      returnDate: data.return_date,
      status: data.status,
      book: data.book,
      member: data.member
    };
  } catch (error) {
    console.error("Error in createLoan:", error);
    return null;
  }
};

export const returnLoan = async (loanId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('loans')
      .update({
        status: 'returned',
        return_date: new Date().toISOString()
      })
      .eq('id', loanId)
      .eq('status', 'active');
    
    if (error) {
      throw new Error(`Error returning loan: ${error.message}`);
    }
    
    return true;
  } catch (error) {
    console.error("Error in returnLoan:", error);
    return false;
  }
};
