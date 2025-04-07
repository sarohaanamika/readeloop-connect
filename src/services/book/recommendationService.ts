
import { supabase } from "@/lib/supabase";
import { Book } from "@/lib/types";

/**
 * Fetches popular books from the database
 */
export const getPopularBooks = async (count: number): Promise<any[]> => {
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

/**
 * Generates book recommendations based on user's reading history
 */
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
