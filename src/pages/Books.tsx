
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BookCard from "@/components/ui/BookCard";
import BookDetails from "@/components/ui/BookDetails";
import SearchBar from "@/components/ui/SearchBar";
import { filterBooks, books } from "@/lib/data";
import { Book, BookFilter } from "@/lib/types";
import { Separator } from "@/components/ui/separator";

const Books = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<BookFilter>({});

  // Parse search params from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get("search") || "";
    const genre = searchParams.get("genre") || "";
    const available = searchParams.get("available") === "true";
    
    setFilters({
      search: searchQuery,
      genre,
      available: searchParams.has("available") ? available : undefined,
    });
    
    // Apply filters
    const filtered = filterBooks({
      search: searchQuery,
      genre,
      available: searchParams.has("available") ? available : undefined,
    });
    
    // Simulate API loading
    setIsLoading(true);
    setTimeout(() => {
      setFilteredBooks(filtered);
      setIsLoading(false);
    }, 800);
  }, [location.search]);

  // Check if a specific book is requested in the URL
  useEffect(() => {
    const pathParts = location.pathname.split("/");
    if (pathParts.length === 3 && pathParts[1] === "books") {
      const bookId = pathParts[2];
      const book = books.find(b => b.id === bookId);
      if (book) {
        setSelectedBook(book);
      }
    } else {
      setSelectedBook(null);
    }
  }, [location.pathname]);

  const handleSearch = (newFilters: BookFilter) => {
    // Convert filters to URL search params
    const searchParams = new URLSearchParams();
    
    if (newFilters.search) {
      searchParams.set("search", newFilters.search);
    }
    
    if (newFilters.genre) {
      searchParams.set("genre", newFilters.genre);
    }
    
    if (newFilters.available !== undefined) {
      searchParams.set("available", String(newFilters.available));
    }
    
    navigate(`/books?${searchParams.toString()}`);
  };

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    navigate(`/books/${book.id}`);
  };

  const handleBackClick = () => {
    setSelectedBook(null);
    navigate("/books");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-4">
          {selectedBook ? (
            <BookDetails book={selectedBook} onBack={handleBackClick} />
          ) : (
            <>
              <div className="max-w-4xl mx-auto mb-10">
                <h1 className="text-3xl md:text-4xl font-display font-bold text-center mb-3">
                  Library Catalog
                </h1>
                <p className="text-gray-600 text-center mb-8">
                  Search our collection of books by title, author, genre, or ISBN
                </p>
                
                <SearchBar 
                  initialFilters={filters}
                  onSearch={handleSearch}
                  className="mb-4"
                />
              </div>
              
              <Separator className="mb-8" />
              
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="animate-spin-slow mb-4 relative w-16 h-16">
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-primary/20 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-primary rounded-full"></div>
                  </div>
                  <p className="text-gray-500">Searching for books...</p>
                </div>
              ) : filteredBooks.length === 0 ? (
                <div className="text-center py-16">
                  <h2 className="text-2xl font-display font-bold mb-2">No Books Found</h2>
                  <p className="text-gray-600 mb-6">
                    We couldn't find any books matching your search criteria.
                  </p>
                  <p className="text-gray-500">
                    Try adjusting your filters or search with different keywords.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredBooks.map((book) => (
                    <div key={book.id} className="animate-fade-in" onClick={() => handleBookClick(book)}>
                      <BookCard book={book} />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Books;
