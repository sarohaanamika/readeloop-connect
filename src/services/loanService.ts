
import { supabase } from "@/lib/supabase";
import { Loan, Book, User, UserRole, getRolePermissions } from "@/lib/types";

export const fetchLoans = async (memberId?: string): Promise<Loan[]> => {
  try {
    console.log("Fetching loans", memberId ? `for member: ${memberId}` : "for all members");
    
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
      console.error("Error fetching loans:", error);
      throw new Error(`Error fetching loans: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      console.log("No loans found");
      return [];
    }
    
    console.log(`Found ${data.length} loans`);
    
    // Transform the Supabase response to match our Loan type
    return data.map(loan => {
      // Ensure status is one of the allowed values
      let status: "active" | "returned" | "overdue";
      if (loan.status === "returned") status = "returned";
      else if (loan.status === "overdue") status = "overdue";
      else status = "active";
      
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
      if (loan.member && typeof loan.member !== 'string' && !('error' in loan.member)) {
        const memberData = loan.member;
        const role = (memberData.role as UserRole) || UserRole.MEMBER;
        member = {
          id: memberData.id,
          name: memberData.name,
          email: memberData.email,
          role: role,
          permissions: getRolePermissions(role),
          membershipStartDate: memberData.membership_start_date,
          address: memberData.address || '',
          phoneNumber: memberData.phone_number || '',
          profile: {
            joinDate: memberData.membership_start_date || new Date().toISOString(),
            membershipType: memberData.membership_type || 'standard'
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
    
    // Ensure status is one of the allowed values
    let status: "active" | "returned" | "overdue";
    if (data.status === "returned") status = "returned";
    else if (data.status === "overdue") status = "overdue";
    else status = "active";
    
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
    if (data.member && typeof data.member !== 'string' && !('error' in data.member)) {
      const memberData = data.member;
      const role = (memberData.role as UserRole) || UserRole.MEMBER;
      member = {
        id: memberData.id,
        name: memberData.name,
        email: memberData.email,
        role: role,
        permissions: getRolePermissions(role),
        membershipStartDate: memberData.membership_start_date,
        address: memberData.address || '',
        phoneNumber: memberData.phone_number || '',
        profile: {
          joinDate: memberData.membership_start_date || new Date().toISOString(),
          membershipType: memberData.membership_type || 'standard'
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
