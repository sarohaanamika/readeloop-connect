
import { supabase } from "@/lib/supabase";

/**
 * Fetches all unique genres from the books table
 */
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
