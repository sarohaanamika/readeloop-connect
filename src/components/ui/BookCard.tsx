
import { useState } from "react";
import { Link } from "react-router-dom";
import { Book } from "@/lib/types";
import { ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookCardProps {
  book: Book;
  className?: string;
  featured?: boolean;
  onClick?: () => void;  // Added onClick prop
}

const BookCard = ({ book, className, featured = false, onClick }: BookCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Rating stars
  const renderRating = () => {
    const rating = book.rating || 0;
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      const starFill = i <= rating ? "text-yellow-400" : "text-gray-300";
      stars.push(
        <Star
          key={i}
          className={cn("h-3.5 w-3.5 fill-current", starFill)}
        />
      );
    }
    
    return (
      <div className="flex items-center space-x-0.5">
        {stars}
        <span className="text-xs ml-1 text-gray-600">({rating.toFixed(1)})</span>
      </div>
    );
  };

  // If onClick is provided, use a button instead of a Link
  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (onClick) {
      return (
        <button
          onClick={onClick}
          className={cn(
            "group flex flex-col rounded-xl overflow-hidden transition-all duration-500 bg-white border border-border hover:shadow-lg text-left w-full",
            featured ? "md:flex-row" : "h-full",
            className
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {children}
        </button>
      );
    }
    
    return (
      <Link
        to={`/books/${book.id}`}
        className={cn(
          "group flex flex-col rounded-xl overflow-hidden transition-all duration-500 bg-white border border-border hover:shadow-lg",
          featured ? "md:flex-row" : "h-full",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children}
      </Link>
    );
  };

  return (
    <CardWrapper>
      <div 
        className={cn(
          "relative overflow-hidden bg-gray-100",
          featured ? "w-full md:w-1/3 aspect-[2/3] md:aspect-auto" : "aspect-[2/3]"
        )}
      >
        <img
          src={book.coverImage}
          alt={book.title}
          className={cn(
            "object-cover w-full h-full transition-all duration-700 ease-in-out book-cover-shadow",
            isHovered && "scale-105"
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <span className="inline-block px-2 py-1 bg-primary/90 text-white text-xs rounded-full">
            {book.genre}
          </span>
        </div>
        
        {!book.available && (
          <div className="absolute top-3 right-3 bg-destructive text-white text-xs px-2 py-1 rounded-full">
            Unavailable
          </div>
        )}
      </div>
      
      <div className={cn(
        "flex flex-col p-4",
        featured ? "md:w-2/3" : "flex-grow"
      )}>
        <div className="space-y-2 mb-auto">
          <h3 className="font-medium text-lg leading-tight group-hover:text-primary transition-colors duration-200">
            {book.title}
          </h3>
          
          <p className="text-sm text-gray-500">
            by {book.authors.map(a => a.name).join(", ")}
          </p>
          
          <div className="flex items-center justify-between">
            {renderRating()}
            <span className="text-sm text-gray-600">{book.publicationYear}</span>
          </div>
          
          {featured && (
            <p className="text-muted-foreground line-clamp-3 text-sm mt-2">
              {book.description}
            </p>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
          <div className="text-sm">
            <span className={book.availableCopies > 0 ? "text-green-600" : "text-red-500"}>
              {book.availableCopies} / {book.totalCopies}
            </span> available
          </div>
          
          <span className="flex items-center text-sm font-medium text-primary group-hover:gap-1.5 gap-1 transition-all">
            View details <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </CardWrapper>
  );
};

export default BookCard;
