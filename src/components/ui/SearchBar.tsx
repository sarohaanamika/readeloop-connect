
import { useState, useRef, useEffect } from "react";
import { Search, X, Book, Filter, ChevronDown, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BookFilter } from "@/lib/types";
import { getGenres } from "@/lib/data";

interface SearchBarProps {
  initialFilters?: BookFilter;
  onSearch: (filters: BookFilter) => void;
  className?: string;
}

const SearchBar = ({ initialFilters = {}, onSearch, className }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState(initialFilters.search || "");
  const [selectedGenre, setSelectedGenre] = useState(initialFilters.genre || "");
  const [isAvailableOnly, setIsAvailableOnly] = useState(initialFilters.available || false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const genres = getGenres();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSearch({
      search: searchQuery,
      genre: selectedGenre,
      available: isAvailableOnly,
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedGenre("");
    setIsAvailableOnly(false);
    
    onSearch({
      search: "",
      genre: "",
      available: false,
    });
  };

  const toggleFilter = () => {
    setIsAnimating(true);
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className={cn("relative", className)}>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            type="search"
            placeholder="Search by title, author, or ISBN..."
            className="pl-10 py-6 rounded-xl shadow-sm bg-white focus-visible:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          
          {searchQuery && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <div className="relative flex-shrink-0" ref={filterRef}>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "gap-2 py-6 px-4 border bg-white hover:bg-gray-50",
              (selectedGenre || isAvailableOnly) && "border-primary text-primary"
            )}
            onClick={toggleFilter}
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform duration-200",
              isFilterOpen && "rotate-180"
            )} />
          </Button>
          
          {isFilterOpen && (
            <div 
              className={cn(
                "absolute right-0 top-full mt-2 bg-white shadow-lg rounded-lg p-4 border border-border z-10 min-w-[16rem]",
                isAnimating && "animate-scale-in"
              )}
              onAnimationEnd={() => setIsAnimating(false)}
            >
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Genre</h4>
                  <div className="max-h-48 overflow-y-auto grid grid-cols-1 gap-1 pr-2">
                    <Button
                      type="button"
                      variant="ghost"
                      className={cn(
                        "justify-start px-2 h-8 font-normal",
                        selectedGenre === "" ? "bg-primary/10 text-primary" : "text-gray-700"
                      )}
                      onClick={() => setSelectedGenre("")}
                    >
                      <Check className={cn("mr-2 h-4 w-4", selectedGenre === "" ? "opacity-100" : "opacity-0")} />
                      All Genres
                    </Button>
                    
                    {genres.map((genre) => (
                      <Button
                        key={genre}
                        type="button"
                        variant="ghost"
                        className={cn(
                          "justify-start px-2 h-8 font-normal",
                          selectedGenre === genre ? "bg-primary/10 text-primary" : "text-gray-700"
                        )}
                        onClick={() => setSelectedGenre(genre)}
                      >
                        <Check className={cn("mr-2 h-4 w-4", selectedGenre === genre ? "opacity-100" : "opacity-0")} />
                        {genre}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Availability</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    className={cn(
                      "justify-start w-full px-2 h-8 font-normal",
                      isAvailableOnly ? "bg-primary/10 text-primary" : "text-gray-700"
                    )}
                    onClick={() => setIsAvailableOnly(!isAvailableOnly)}
                  >
                    <div className={cn(
                      "mr-2 h-4 w-4 rounded border flex items-center justify-center",
                      isAvailableOnly ? "bg-primary border-primary" : "border-gray-300"
                    )}>
                      {isAvailableOnly && <Check className="h-3 w-3 text-white" />}
                    </div>
                    Available Books Only
                  </Button>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-gray-700"
                    onClick={clearFilters}
                  >
                    Clear All
                  </Button>
                  
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      handleSubmit({ preventDefault: () => {} } as React.FormEvent);
                      setIsFilterOpen(false);
                    }}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <Button type="submit" className="py-6 px-5">
          <Search className="h-5 w-5 sm:mr-2" />
          <span className="hidden sm:inline">Search</span>
        </Button>
      </form>
      
      {(selectedGenre || isAvailableOnly) && (
        <div className="flex items-center gap-2 mt-3 text-sm">
          <span className="text-gray-500">Active filters:</span>
          
          {selectedGenre && (
            <div className="bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1">
              <Book className="h-3 w-3 text-primary" />
              <span>{selectedGenre}</span>
              <button
                type="button"
                className="ml-1 text-gray-400 hover:text-gray-600"
                onClick={() => {
                  setSelectedGenre("");
                  onSearch({
                    search: searchQuery,
                    genre: "",
                    available: isAvailableOnly,
                  });
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          
          {isAvailableOnly && (
            <div className="bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1">
              <Check className="h-3 w-3 text-green-500" />
              <span>Available Only</span>
              <button
                type="button"
                className="ml-1 text-gray-400 hover:text-gray-600"
                onClick={() => {
                  setIsAvailableOnly(false);
                  onSearch({
                    search: searchQuery,
                    genre: selectedGenre,
                    available: false,
                  });
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          
          <button
            type="button"
            className="text-primary hover:text-primary/80 text-xs underline"
            onClick={clearFilters}
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
