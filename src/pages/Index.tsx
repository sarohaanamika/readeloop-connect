
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { books, getRecommendations } from "@/lib/data";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BookCard from "@/components/ui/BookCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Search, BookOpen, Clock, BookMarked, Users } from "lucide-react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [animateElements, setAnimateElements] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const featuredBooks = books.slice(0, 4);
  const recommendedBooks = isAuthenticated ? getRecommendations(user!.id) : books.slice(4, 8);

  // Trigger animations after component mounts
  useEffect(() => {
    setAnimateElements(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/books?search=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-blue-50 to-white py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
            <div className="absolute top-1/4 -right-24 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
            <div className="absolute top-3/4 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
          </div>
          
          <div className="container px-4 mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center staggered-fade-in">
              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6 transition-all duration-1000 ${
                animateElements ? "opacity-100 transform-none" : "opacity-0 translate-y-8"
              }`}>
                Discover, Borrow, and Return <span className="text-primary">Books Seamlessly</span>
              </h1>
              
              <p className={`text-lg md:text-xl text-gray-700 mb-8 transition-all duration-1000 delay-100 ${
                animateElements ? "opacity-100 transform-none" : "opacity-0 translate-y-8"
              }`}>
                Our library management system helps you explore new worlds through literature with an intuitive and beautiful experience.
              </p>
              
              <div className={`max-w-2xl mx-auto transition-all duration-1000 delay-200 ${
                animateElements ? "opacity-100 transform-none" : "opacity-0 translate-y-8"
              }`}>
                <form onSubmit={handleSearch} className="flex gap-2">
                  <div className="relative flex-grow">
                    <Input
                      type="search"
                      placeholder="Search for books, authors, or genres..."
                      className="pl-10 py-6 rounded-xl shadow-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  </div>
                  
                  <Button type="submit" className="py-6 px-6">
                    <span className="hidden sm:inline mr-2">Search</span>
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </form>
              </div>
              
              <div className={`flex flex-wrap justify-center gap-4 mt-12 transition-all duration-1000 delay-300 ${
                animateElements ? "opacity-100 transform-none" : "opacity-0 translate-y-8"
              }`}>
                <Link to="/books">
                  <Button variant="outline" size="lg" className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    Browse Catalog
                  </Button>
                </Link>
                
                <Link to={isAuthenticated ? "/dashboard" : "/login"}>
                  <Button size="lg" className="gap-2">
                    {isAuthenticated ? (
                      <>
                        <BookMarked className="h-4 w-4" />
                        My Dashboard
                      </>
                    ) : (
                      <>
                        <Users className="h-4 w-4" />
                        Join Now
                      </>
                    )}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
        </section>
        
        {/* Featured Books Section */}
        <section className="py-16 bg-white">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
              <div>
                <h2 className="text-3xl font-display font-bold">Featured Books</h2>
                <p className="text-gray-600 mt-2">Explore our curated selection of must-read books</p>
              </div>
              
              <Link to="/books">
                <Button variant="outline" className="flex items-center gap-2">
                  View All Books
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredBooks.map((book, index) => (
                <div 
                  key={book.id}
                  className={`transition-all duration-700 delay-${index * 100} ${
                    animateElements ? "opacity-100 transform-none" : "opacity-0 translate-y-8"
                  }`}
                >
                  <BookCard book={book} />
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 bg-gray-50">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold">How It Works</h2>
              <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                Our library management system is designed to make borrowing and returning books as seamless as possible
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="relative flex flex-col items-center text-center p-6 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-16 h-16 flex items-center justify-center bg-primary/10 rounded-full mb-4">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-display font-bold mb-2">Browse</h3>
                <p className="text-gray-600">
                  Search our extensive catalog of books by title, author, genre, or ISBN
                </p>
                <div className="absolute -right-4 top-1/2 hidden md:block">
                  <ArrowRight className="h-6 w-6 text-gray-300" />
                </div>
              </div>
              
              <div className="relative flex flex-col items-center text-center p-6 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-16 h-16 flex items-center justify-center bg-primary/10 rounded-full mb-4">
                  <BookMarked className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-display font-bold mb-2">Borrow</h3>
                <p className="text-gray-600">
                  Check out books with a single click and manage your loans from your dashboard
                </p>
                <div className="absolute -right-4 top-1/2 hidden md:block">
                  <ArrowRight className="h-6 w-6 text-gray-300" />
                </div>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-16 h-16 flex items-center justify-center bg-primary/10 rounded-full mb-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-display font-bold mb-2">Return</h3>
                <p className="text-gray-600">
                  Return books on time to avoid fines and keep track of your borrowing history
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Recommendations Section */}
        <section className="py-16 bg-white">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
              <div>
                <h2 className="text-3xl font-display font-bold">
                  {isAuthenticated ? "Recommended For You" : "Popular Books"}
                </h2>
                <p className="text-gray-600 mt-2">
                  {isAuthenticated
                    ? "Books we think you might enjoy based on your reading history"
                    : "Top picks that readers are loving right now"}
                </p>
              </div>
              
              <Link to="/books">
                <Button variant="outline" className="flex items-center gap-2">
                  Explore More
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedBooks.map((book, index) => (
                <div 
                  key={book.id}
                  className={`transition-all duration-700 delay-${index * 100} ${
                    animateElements ? "opacity-100 transform-none" : "opacity-0 translate-y-8"
                  }`}
                >
                  <BookCard book={book} />
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-primary/90 to-primary">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Ready to Start Your Reading Journey?
              </h2>
              
              <p className="text-white/80 mb-8 text-lg">
                Join our library today and get access to thousands of books, personalized recommendations, and more.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/register">
                  <Button size="lg" variant="secondary" className="font-medium">
                    Create an Account
                  </Button>
                </Link>
                
                <Link to="/books">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-medium">
                    Browse Books
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
