
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BookDetails from "@/components/ui/BookDetails";
import { books } from "@/lib/data";
import { Book } from "@/lib/types";

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // Simulate API call
      setIsLoading(true);
      setTimeout(() => {
        const foundBook = books.find(b => b.id === id);
        
        if (foundBook) {
          setBook(foundBook);
        } else {
          // Book not found
          navigate("/books", { replace: true });
        }
        
        setIsLoading(false);
      }, 800);
    }
  }, [id, navigate]);

  const handleBackClick = () => {
    navigate("/books");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin-slow mb-4 relative w-16 h-16">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-primary/20 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-primary rounded-full"></div>
              </div>
              <p className="text-gray-500">Loading book details...</p>
            </div>
          ) : book ? (
            <BookDetails book={book} onBack={handleBackClick} />
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-display font-bold mb-2">Book Not Found</h2>
              <p className="text-gray-600 mb-6">
                We couldn't find the book you're looking for.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BookDetail;
