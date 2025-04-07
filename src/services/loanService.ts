
import { supabase } from "@/lib/supabase";
import { Loan, Book, User, UserRole, getRolePermissions } from "@/lib/types";

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
    return data.map(loan => {
      // Ensure status is one of the allowed values
      let status: "active" | "returned" | "overdue" = "active";
      if (loan.status === "returned") status = "returned";
      else if (loan.status === "overdue") status = "overdue";
      
      // Transform book data to match Book interface
      let book: Book | undefined;
      if (loan.book) {
        const bookData = loan.book;
        book = {
          id: bookData.id,
          title: bookData.title,
          isbn: bookData.isbn,
          coverImage: bookData.cover_image || '/placeholder.svg',
          description: bookData.description || '',
          genre: bookData.genre || '',
          publicationYear: bookData.publication_year || 0,
          publisherId: bookData.publisher_id || '',
          publisher: {
            id: bookData.publisher_id || '',
            name: '', // We don't have publisher data here
            address: '',
            contactInfo: ''
          },
          authors: [], // We don't have authors data here
          available: bookData.available_copies > 0,
          rating: bookData.rating,
          totalCopies: bookData.total_copies,
          availableCopies: bookData.available_copies
        };
      }
      
      // Transform member data to match User interface
      let member: User | undefined;
      if (loan.member) {
        const memberData = loan.member;
        const role = (memberData.role || 'member') as UserRole;
        member = {
          id: memberData.id,
          name: memberData.name,
          email: memberData.email,
          role: role,
          permissions: getRolePermissions(role),
          membershipStartDate: memberData.membership_start_date,
          address: memberData.address,
          phoneNumber: memberData.phone_number,
          profile: {
            joinDate: memberData.membership_start_date || new Date().toISOString(),
            membershipType: memberData.membership_type
          }
        };
      }

      return {
        id: loan.id,
        memberId: loan.member_id,
        bookId: loan.book_id,
        loanDate: loan.loan_date,
        dueDate: loan.due_date,
        returnDate: loan.return_date,
        status,
        book,
        member
      };
    });
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
    
    // Ensure status is one of the allowed values
    let status: "active" | "returned" | "overdue" = "active";
    if (data.status === "returned") status = "returned";
    else if (data.status === "overdue") status = "overdue";
    
    // Transform book data to match Book interface
    let book: Book | undefined;
    if (data.book) {
      const bookData = data.book;
      book = {
        id: bookData.id,
        title: bookData.title,
        isbn: bookData.isbn,
        coverImage: bookData.cover_image || '/placeholder.svg',
        description: bookData.description || '',
        genre: bookData.genre || '',
        publicationYear: bookData.publication_year || 0,
        publisherId: bookData.publisher_id || '',
        publisher: {
          id: bookData.publisher_id || '',
          name: '', // We don't have publisher data here
          address: '',
          contactInfo: ''
        },
        authors: [], // We don't have authors data here
        available: bookData.available_copies > 0,
        rating: bookData.rating,
        totalCopies: bookData.total_copies,
        availableCopies: bookData.available_copies
      };
    }
    
    // Transform member data to match User interface
    let member: User | undefined;
    if (data.member) {
      const memberData = data.member;
      const role = (memberData.role || 'member') as UserRole;
      member = {
        id: memberData.id,
        name: memberData.name,
        email: memberData.email,
        role: role,
        permissions: getRolePermissions(role),
        membershipStartDate: memberData.membership_start_date,
        address: memberData.address,
        phoneNumber: memberData.phone_number,
        profile: {
          joinDate: memberData.membership_start_date || new Date().toISOString(),
          membershipType: memberData.membership_type
        }
      };
    }
    
    return {
      id: data.id,
      memberId: data.member_id,
      bookId: data.book_id,
      loanDate: data.loan_date,
      dueDate: data.due_date,
      returnDate: data.return_date,
      status,
      book,
      member
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
