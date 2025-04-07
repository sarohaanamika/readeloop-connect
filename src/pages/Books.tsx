
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookFilter, Book as BookType } from '@/lib/types';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BookCard from '@/components/ui/BookCard';
import SearchBar from '@/components/ui/SearchBar';
import { fetchBooks, getGenres } from '@/services/bookService';
import { toast } from 'sonner';

export const Books: React.FC = () => {
  const [books, setBooks] = useState<BookType[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<BookType[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [filters, setFilters] = useState<BookFilter>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch books and genres on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log("Fetching all books...");
        // Fetch all books
        const booksData = await fetchBooks();
        console.log(`Fetched ${booksData.length} books`);
        
        setBooks(booksData);
        setFilteredBooks(booksData);
        
        // Fetch all genres
        console.log("Fetching genres...");
        const genresData = await getGenres();
        console.log(`Fetched ${genresData.length} genres`);
        setGenres(genresData);
      } catch (error) {
        console.error('Error loading data:', error);
        setError(error instanceof Error ? error.message : String(error));
        toast.error("Failed to load books. Check console for details.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    const applyFilters = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log("Applying filters:", filters);
        // Fetch filtered books from Supabase
        const filteredBooksData = await fetchBooks(filters);
        console.log(`Fetched ${filteredBooksData.length} filtered books`);
        setFilteredBooks(filteredBooksData);
      } catch (error) {
        console.error('Error applying filters:', error);
        setError(error instanceof Error ? error.message : String(error));
        toast.error("Failed to filter books");
      } finally {
        setIsLoading(false);
      }
    };
    
    applyFilters();
  }, [filters]);

  const handleSearch = (filterData: BookFilter) => {
    setFilters(prev => ({ ...prev, ...filterData }));
  };

  const handleGenreFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const genre = e.target.value || undefined;
    setFilters(prev => ({ ...prev, genre }));
  };

  const handleAvailabilityFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const available = value === '' ? undefined : value === 'true';
    setFilters(prev => ({ ...prev, available }));
  };

  const handleBookClick = (bookId: string) => {
    navigate(`/books/${bookId}`);
  };

  const handleRetry = () => {
    // Reset error and try loading again
    setError(null);
    setFilters({});
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const booksData = await fetchBooks();
        setBooks(booksData);
        setFilteredBooks(booksData);
        
        const genresData = await getGenres();
        setGenres(genresData);
      } catch (error) {
        console.error('Error loading data:', error);
        setError(error instanceof Error ? error.message : String(error));
        toast.error("Failed to load books");
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Library Catalog</h1>
          
          <div className="mb-8">
            <SearchBar onSearch={handleSearch} placeholder="Search books by title or ISBN" />
            
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="w-full sm:w-auto">
                <label htmlFor="genre-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Genre
                </label>
                <select
                  id="genre-filter"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  onChange={handleGenreFilter}
                  value={filters.genre || ''}
                >
                  <option value="">All Genres</option>
                  {genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>
              
              <div className="w-full sm:w-auto">
                <label htmlFor="availability-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Availability
                </label>
                <select
                  id="availability-filter"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  onChange={handleAvailabilityFilter}
                  value={filters.available === undefined ? '' : String(filters.available)}
                >
                  <option value="">All Books</option>
                  <option value="true">Available Now</option>
                  <option value="false">Not Available</option>
                </select>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin-slow relative w-16 h-16">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-primary/20 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-primary rounded-full"></div>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-red-50 rounded-lg">
              <h2 className="text-2xl font-bold mb-2 text-red-700">Error Loading Books</h2>
              <p className="text-gray-600 mb-6">
                {error}
              </p>
              <button
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                onClick={handleRetry}
              >
                Retry
              </button>
            </div>
          ) : filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map(book => (
                <BookCard
                  key={book.id}
                  book={book}
                  className="cursor-pointer"
                  onClick={() => handleBookClick(book.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <h2 className="text-2xl font-bold mb-2">No Books Found</h2>
              <p className="text-gray-600 mb-6">
                We couldn't find any books matching your search criteria.
              </p>
              <button
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                onClick={() => setFilters({})}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Books;
