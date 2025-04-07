import { supabase } from "@/lib/supabase";
import { Book, BookFilter } from "@/lib/types";

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

export const getGenres = async (): Promise<string[]> => {
  try {
    console.log("Fetching unique genres...");
    const { data, error } = await supabase
      .from('books')
      .select('genre')
      .not('genre', 'is', null);
    
    if (error) {
      throw new Error(`Error fetching genres: ${error.message}`);
    }
    
    // Extract unique genres
    const genres = new Set<string>();
    data?.forEach(book => {
      if (book.genre) genres.add(book.genre);
    });
    
    const uniqueGenres = Array.from(genres);
    console.log(`Found ${uniqueGenres.length} unique genres`);
    return uniqueGenres;
  } catch (error) {
    console.error("Error in getGenres:", error);
    throw error; // Rethrow to handle in UI
  }
};

export const getRecommendations = async (userId: string, count: number = 4): Promise<Book[]> => {
  try {
    // Get user's loan history
    const { data: loanData, error: loanError } = await supabase
      .from('loans')
      .select('book_id')
      .eq('member_id', userId);
    
    if (loanError) {
      throw new Error(`Error fetching user loans: ${loanError.message}`);
    }
    
    // If user has no loan history, return popular books
    if (!loanData || loanData.length === 0) {
      return getPopularBooks(count);
    }
    
    const userBookIds = loanData.map(loan => loan.book_id);
    
    // Get genres the user has previously read
    const { data: userBookData, error: userBookError } = await supabase
      .from('books')
      .select('genre')
      .in('id', userBookIds);
    
    if (userBookError) {
      throw new Error(`Error fetching user books: ${userBookError.message}`);
    }
    
    const userGenres = new Set<string>();
    userBookData?.forEach(book => {
      if (book.genre) userGenres.add(book.genre);
    });
    
    // If no genres found, return popular books
    if (userGenres.size === 0) {
      return getPopularBooks(count);
    }
    
    // Find books in those genres that the user hasn't read yet
    const { data: recommendedBooks, error: recommendedError } = await supabase
      .from('books')
      .select(`
        *,
        publisher:publishers(*),
        authors:book_authors(author:authors(*))
      `)
      .in('genre', Array.from(userGenres))
      .not('id', 'in', userBookIds)
      .gt('available_copies', 0)
      .order('rating', { ascending: false })
      .limit(count);
    
    if (recommendedError) {
      throw new Error(`Error fetching recommendations: ${recommendedError.message}`);
    }
    
    // If not enough recommendations, add some popular books
    if (!recommendedBooks || recommendedBooks.length < count) {
      const popularBooks = await getPopularBooks(count - (recommendedBooks?.length || 0));
      
      // Combine recommendations with popular books
      const allRecommendations = [
        ...(recommendedBooks || []),
        ...popularBooks.filter(book => 
          !recommendedBooks?.some(rec => rec.id === book.id) && 
          !userBookIds.includes(book.id)
        )
      ].slice(0, count);
      
      // Transform to Book type
      return allRecommendations.map(book => {
        const bookAuthors = book.authors.map((ba: any) => ba.author);
        
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
    }
    
    // Transform to Book type
    return recommendedBooks.map(book => {
      const bookAuthors = book.authors.map((ba: any) => ba.author);
      
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
    console.error("Error in getRecommendations:", error);
    return [];
  }
};

const getPopularBooks = async (count: number): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('books')
      .select(`
        *,
        publisher:publishers(*),
        authors:book_authors(author:authors(*))
      `)
      .gt('available_copies', 0)
      .order('rating', { ascending: false })
      .limit(count);
    
    if (error) {
      throw new Error(`Error fetching popular books: ${error.message}`);
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getPopularBooks:", error);
    return [];
  }
};
