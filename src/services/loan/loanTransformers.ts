
import { Loan, Book, User, UserRole, getRolePermissions } from "@/lib/types";

/**
 * Transforms raw loan data from Supabase into the application's Loan type
 */
export const transformLoanData = (data: any): Loan => {
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
  if (data.member && typeof data.member === 'object') {
    const memberData = data.member as any;
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
};
