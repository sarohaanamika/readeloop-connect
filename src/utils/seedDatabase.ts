
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
    
    // Convert string IDs to valid UUIDs if needed
    const ensureUUID = (id: string): string => {
      // Check if the id is already a valid UUID
      const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidPattern.test(id)) {
        return id;
      }
      
      // Generate a new UUID using crypto.randomUUID() if available, or a fallback
      return crypto.randomUUID ? crypto.randomUUID() : 
             `${Math.random().toString(36).substring(2, 15)}-${Date.now().toString(36)}`;
    };
    
    // Create a mapping of original IDs to new UUIDs
    const publisherIdMap = new Map<string, string>();
    const authorIdMap = new Map<string, string>();
    const bookIdMap = new Map<string, string>();
    
    // 1. Insert publishers with valid UUIDs
    console.log("Seeding publishers...");
    const processedPublishers = publishers.map(pub => {
      const newId = ensureUUID(pub.id);
      publisherIdMap.set(pub.id, newId);
      
      return {
        id: newId,
        name: pub.name,
        address: pub.address || null,
        contact_info: pub.contactInfo || null
      };
    });
    
    const { error: publishersError } = await supabase
      .from('publishers')
      .upsert(processedPublishers, { onConflict: 'id' });
    
    if (publishersError) {
      throw new Error(`Error seeding publishers: ${publishersError.message}`);
    }
    
    // 2. Insert authors with valid UUIDs
    console.log("Seeding authors...");
    const processedAuthors = authors.map(author => {
      const newId = ensureUUID(author.id);
      authorIdMap.set(author.id, newId);
      
      return {
        id: newId,
        name: author.name,
        bio: author.bio || null
      };
    });
    
    const { error: authorsError } = await supabase
      .from('authors')
      .upsert(processedAuthors, { onConflict: 'id' });
    
    if (authorsError) {
      throw new Error(`Error seeding authors: ${authorsError.message}`);
    }
    
    // 3. Insert books with valid UUIDs and mapped publisher IDs
    console.log("Seeding books...");
    const processedBooks = books.map(book => {
      const newId = ensureUUID(book.id);
      bookIdMap.set(book.id, newId);
      
      return {
        id: newId,
        title: book.title,
        isbn: book.isbn,
        cover_image: book.coverImage,
        description: book.description,
        genre: book.genre,
        publication_year: book.publicationYear,
        publisher_id: publisherIdMap.get(book.publisherId) || null,
        total_copies: book.totalCopies,
        available_copies: book.availableCopies,
        rating: book.rating || null
      };
    });
    
    const { error: booksError } = await supabase
      .from('books')
      .upsert(processedBooks, { onConflict: 'id' });
    
    if (booksError) {
      throw new Error(`Error seeding books: ${booksError.message}`);
    }
    
    // 4. Insert book-author relationships with mapped IDs
    console.log("Seeding book-author relationships...");
    
    // Prepare book-author relationships
    const bookAuthors = [];
    for (const book of books) {
      for (const author of book.authors) {
        const mappedBookId = bookIdMap.get(book.id);
        const mappedAuthorId = authorIdMap.get(author.id);
        
        if (mappedBookId && mappedAuthorId) {
          bookAuthors.push({
            book_id: mappedBookId,
            author_id: mappedAuthorId,
            id: ensureUUID(`${book.id}-${author.id}`)
          });
        }
      }
    }
    
    if (bookAuthors.length > 0) {
      const { error: bookAuthorsError } = await supabase
        .from('book_authors')
        .upsert(bookAuthors, { onConflict: 'book_id,author_id' });
      
      if (bookAuthorsError) {
        throw new Error(`Error seeding book_authors: ${bookAuthorsError.message}`);
      }
    }
    
    // 5. Insert loans with mapped IDs
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
      const processedLoans = loans.map(loan => ({
        id: ensureUUID(loan.id),
        member_id: loan.memberId,
        book_id: bookIdMap.get(loan.bookId) || loan.bookId,
        loan_date: loan.loanDate,
        due_date: loan.dueDate,
        return_date: loan.returnDate || null,
        status: loan.status
      }));
      
      const { error: loansError } = await supabase
        .from('loans')
        .upsert(processedLoans, { onConflict: 'id' });
      
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
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
};

// Utility to check if the database has been seeded
export const checkIfDatabaseIsSeeded = async (): Promise<boolean> => {
  try {
    console.log("Checking if database is seeded...");
    // Test the connection first to provide clearer error messages
    const { error: connectionError } = await supabase.from('books').select('count').limit(1);
    if (connectionError) {
      console.error("Database connection error:", connectionError);
      throw new Error(`Database connection error: ${connectionError.message}`);
    }
    
    const { count, error } = await supabase
      .from('books')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error("Error checking if database is seeded:", error);
      throw new Error(`Error checking if database is seeded: ${error.message}`);
    }
    
    console.log(`Database check: Found ${count} books.`);
    return (count !== null && count > 0);
  } catch (error) {
    console.error("Error checking if database is seeded:", error);
    throw error; // Re-throw to allow proper error handling in the UI
  }
};
