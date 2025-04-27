
import { useState, useEffect } from "react";
import { Book } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useRecommendations = (userId: string) => {
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!userId) {
        setRecommendations([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        console.log("Fetching book recommendations from Supabase...");
        
        // Fetch books with limit 4 for recommendations
        const { data, error } = await supabase
          .from('books')
          .select(`
            id,
            title,
            isbn,
            cover_image,
            description,
            genre,
            publication_year,
            publisher_id,
            rating,
            total_copies,
            available_copies,
            publishers(name)
          `)
          .limit(4)
          .order('rating', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        if (data) {
          // Transform data to match Book type
          const bookData: Book[] = data.map((book) => ({
            id: book.id,
            title: book.title,
            isbn: book.isbn,
            coverImage: book.cover_image || "/placeholder.svg",
            description: book.description || "",
            genre: book.genre || "",
            publicationYear: book.publication_year || 0,
            publisherId: book.publisher_id || "",
            publisher: {
              id: book.publisher_id || "",
              name: book.publishers?.name || "Unknown Publisher",
            },
            authors: [], // We'll need to fetch these separately if needed
            available: book.available_copies > 0,
            rating: book.rating || 0,
            totalCopies: book.total_copies || 0,
            availableCopies: book.available_copies || 0
          }));
          
          setRecommendations(bookData);
          console.log("Recommendations fetched successfully:", bookData);
        }
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError(err instanceof Error ? err.message : String(err));
        toast.error("Failed to load book recommendations");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [userId]);

  return { recommendations, isLoading, error };
};
