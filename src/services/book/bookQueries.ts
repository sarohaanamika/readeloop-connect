
import { supabase } from "@/lib/supabase";
import { Book, BookFilter } from "@/lib/types";

/**
 * Fetches books from the database with optional filtering
 */
export const fetchBooks = async (filters?: BookFilter): Promise<Book[]> => {
  try {
    console.log("Starting fetchBooks with filters:", filters || "none");
    
    let query = supabase
      .from('books')
      .select(`
        *,
        publisher:publishers(*),
        authors:book_authors(author:authors(*))
      `);
    
    // Apply filters if provided
    if (filters) {
      if (filters.search) {
        const searchTerm = `%${filters.search.toLowerCase()}%`;
        query = query.or(`title.ilike.${searchTerm},isbn.ilike.${searchTerm}`);
      }
      
      if (filters.genre) {
        query = query.eq('genre', filters.genre);
      }
      
      if (filters.available !== undefined) {
        query = filters.available 
          ? query.gt('available_copies', 0)
          : query.eq('available_copies', 0);
      }
      
      if (filters.year) {
        query = query.eq('publication_year', filters.year);
      }
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Supabase query error:", error);
      throw new Error(`Error fetching books: ${error.message}`);
    }
    
    if (!data) {
      console.log("No books data returned from query");
      return [];
    }
    
    console.log(`Successfully fetched ${data.length} books`);
    
    // Transform the Supabase response to match our Book type
    return data.map(book => {
      // Get authors from the nested book_authors array
      const bookAuthors = book.authors?.map((ba: any) => ba.author) || [];
      
      return {
        id: book.id,
        title: book.title,
        isbn: book.isbn,
        coverImage: book.cover_image,
        description: book.description,
        genre: book.genre,
        publicationYear: book.publication_year,
        publisherId: book.publisher_id,
        publisher: book.publisher,
        authors: bookAuthors,
        available: book.available_copies > 0,
        rating: book.rating,
        totalCopies: book.total_copies,
        availableCopies: book.available_copies
      };
    });
  } catch (error) {
    console.error("Error in fetchBooks:", error);
    throw error; // Rethrow to handle in UI components
  }
};

/**
 * Fetches a single book by its ID
 */
export const fetchBookById = async (id: string): Promise<Book | null> => {
  try {
    const { data, error } = await supabase
      .from('books')
      .select(`
        *,
        publisher:publishers(*),
        authors:book_authors(author:authors(*))
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      throw new Error(`Error fetching book: ${error.message}`);
    }
    
    if (!data) return null;
    
    // Transform the Supabase response to match our Book type
    const bookAuthors = data.authors.map((ba: any) => ba.author);
    
    return {
      id: data.id,
      title: data.title,
      isbn: data.isbn,
      coverImage: data.cover_image,
      description: data.description,
      genre: data.genre,
      publicationYear: data.publication_year,
      publisherId: data.publisher_id,
      publisher: data.publisher,
      authors: bookAuthors,
      available: data.available_copies > 0,
      rating: data.rating,
      totalCopies: data.total_copies,
      availableCopies: data.available_copies
    };
  } catch (error) {
    console.error("Error in fetchBookById:", error);
    return null;
  }
};
