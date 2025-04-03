
import { supabase } from "@/lib/supabase";
import { authors, books, publishers, loans } from "@/lib/data";
import { Author, Book, Loan, Publisher } from "@/lib/types";

/**
 * Seed the database with initial data
 * This function should only be called once or when resetting the database
 */
export const seedDatabase = async () => {
  try {
    console.log("Starting database seeding...");
    
    // 1. Insert publishers
    console.log("Seeding publishers...");
    const { error: publishersError } = await supabase
      .from('publishers')
      .upsert(
        publishers.map(pub => ({
          id: pub.id,
          name: pub.name,
          address: pub.address || null,
          contact_info: pub.contactInfo || null
        })),
        { onConflict: 'id' }
      );
    
    if (publishersError) {
      throw new Error(`Error seeding publishers: ${publishersError.message}`);
    }
    
    // 2. Insert authors
    console.log("Seeding authors...");
    const { error: authorsError } = await supabase
      .from('authors')
      .upsert(
        authors.map(author => ({
          id: author.id,
          name: author.name,
          bio: author.bio || null
        })),
        { onConflict: 'id' }
      );
    
    if (authorsError) {
      throw new Error(`Error seeding authors: ${authorsError.message}`);
    }
    
    // 3. Insert books
    console.log("Seeding books...");
    const { error: booksError } = await supabase
      .from('books')
      .upsert(
        books.map(book => ({
          id: book.id,
          title: book.title,
          isbn: book.isbn,
          cover_image: book.coverImage,
          description: book.description,
          genre: book.genre,
          publication_year: book.publicationYear,
          publisher_id: book.publisherId,
          total_copies: book.totalCopies,
          available_copies: book.availableCopies,
          rating: book.rating || null
        })),
        { onConflict: 'id' }
      );
    
    if (booksError) {
      throw new Error(`Error seeding books: ${booksError.message}`);
    }
    
    // 4. Insert book-author relationships
    console.log("Seeding book-author relationships...");
    
    // Prepare book-author relationships
    const bookAuthors = books.flatMap(book => 
      book.authors.map(author => ({
        book_id: book.id,
        author_id: author.id
      }))
    );
    
    const { error: bookAuthorsError } = await supabase
      .from('book_authors')
      .upsert(
        bookAuthors,
        { onConflict: 'book_id,author_id' }
      );
    
    if (bookAuthorsError) {
      throw new Error(`Error seeding book_authors: ${bookAuthorsError.message}`);
    }
    
    // 5. Insert loans
    // We'll only insert this if we have user data
    console.log("Seeding loans...");
    
    // Check if we have any users first
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (usersError) {
      console.warn(`Warning: Couldn't check for users: ${usersError.message}`);
    } else if (users && users.length > 0) {
      // We have users, so we can seed loans
      const { error: loansError } = await supabase
        .from('loans')
        .upsert(
          loans.map(loan => ({
            id: loan.id,
            member_id: loan.memberId,
            book_id: loan.bookId,
            loan_date: loan.loanDate,
            due_date: loan.dueDate,
            return_date: loan.returnDate || null,
            status: loan.status
          })),
          { onConflict: 'id' }
        );
      
      if (loansError) {
        console.warn(`Warning: Error seeding loans: ${loansError.message}`);
      }
    } else {
      console.log("No users found. Skipping loan seeding.");
    }
    
    console.log("Database seeding completed successfully!");
    return { success: true };
  } catch (error) {
    console.error("Database seeding failed:", error);
    return { success: false, error };
  }
};

// Utility to check if the database has been seeded
export const checkIfDatabaseIsSeeded = async (): Promise<boolean> => {
  try {
    const { count, error } = await supabase
      .from('books')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error("Error checking if database is seeded:", error);
      return false;
    }
    
    return (count !== null && count > 0);
  } catch (error) {
    console.error("Error checking if database is seeded:", error);
    return false;
  }
};
