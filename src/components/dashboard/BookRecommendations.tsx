
import React from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookCard from "@/components/ui/BookCard";
import { Book } from "@/lib/types";

interface BookRecommendationsProps {
  recommendations: Book[];
}

const BookRecommendations: React.FC<BookRecommendationsProps> = ({ recommendations }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-display font-bold">Recommended For You</h2>
        <Button variant="ghost" size="sm" className="text-primary gap-1" asChild>
          <a href="/books">
            More Books <ArrowUpRight className="h-4 w-4" />
          </a>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default BookRecommendations;
