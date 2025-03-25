
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Book, Loan, User } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ArrowLeft, Book as BookIcon, Clock, Calendar, User as UserIcon, Star, Check, BookMarked } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { loans } from "@/lib/data";
import { cn } from "@/lib/utils";

interface BookDetailsProps {
  book: Book;
  onBack: () => void;
}

const BookDetails = ({ book, onBack }: BookDetailsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Calculate due date (14 days from now)
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);
  const formattedDueDate = dueDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Check if user has already borrowed this book
  const hasActiveLoan = isAuthenticated && user ? 
    loans.some(loan => 
      loan.bookId === book.id && 
      loan.memberId === user.id && 
      loan.status === 'active'
    ) : false;

  const handleBorrow = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to borrow books");
      navigate("/login");
      return;
    }

    if (user?.role !== 'member') {
      toast.error("Only members can borrow books");
      return;
    }

    if (hasActiveLoan) {
      toast.error("You have already borrowed this book");
      return;
    }

    setShowConfirmDialog(true);
  };

  const confirmBorrow = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Create a new loan
      const newLoan: Loan = {
        id: `loan${loans.length + 1}`,
        memberId: user!.id,
        bookId: book.id,
        loanDate: new Date().toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        status: 'active'
      };
      
      // Add to loans array (in real app, this would be a DB call)
      loans.push(newLoan);
      
      // Update available copies
      book.availableCopies -= 1;
      
      setIsLoading(false);
      setShowConfirmDialog(false);
      
      toast.success("Book borrowed successfully!");
      navigate("/dashboard");
    }, 1500);
  };

  // Rating stars
  const renderRating = () => {
    const rating = book.rating || 0;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        <div className="flex">
          {[...Array(fullStars)].map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          ))}
          
          {hasHalfStar && (
            <div className="relative">
              <Star className="h-5 w-5 text-gray-300" />
              <div className="absolute inset-0 overflow-hidden w-1/2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              </div>
            </div>
          )}
          
          {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
            <Star key={i} className="h-5 w-5 text-gray-300" />
          ))}
        </div>
        
        <span className="ml-2 text-sm font-medium text-gray-600">
          {rating.toFixed(1)} ({Math.floor(Math.random() * 100) + 50} reviews)
        </span>
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      <Button
        variant="ghost"
        className="mb-6 pl-0 gap-2 hover:bg-transparent hover:text-primary"
        onClick={onBack}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to results
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="relative aspect-[2/3] bg-gray-100 rounded-xl overflow-hidden book-cover-shadow mb-4">
            <img
              src={book.coverImage}
              alt={book.title}
              className="object-cover w-full h-full"
            />
            
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/20 via-transparent to-black/30" />
            
            {!book.available && (
              <div className="absolute top-3 right-3 bg-destructive/90 text-white text-xs px-3 py-1 rounded-full">
                Unavailable
              </div>
            )}
            
            <div className="absolute bottom-3 right-3 bg-white/90 text-primary text-xs px-3 py-1 rounded-full backdrop-blur-sm">
              {book.genre}
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm">
                <BookIcon className="h-4 w-4 text-primary mr-2" />
                <span>Availability</span>
              </div>
              <div className="text-sm font-medium">
                <span className={book.availableCopies > 0 ? "text-green-600" : "text-red-500"}>
                  {book.availableCopies}
                </span> / {book.totalCopies}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 text-primary mr-2" />
                <span>Publication Year</span>
              </div>
              <div className="text-sm font-medium">{book.publicationYear}</div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm">
                <BookMarked className="h-4 w-4 text-primary mr-2" />
                <span>ISBN</span>
              </div>
              <div className="text-sm font-medium">{book.isbn}</div>
            </div>
            
            <Button
              onClick={handleBorrow}
              disabled={book.availableCopies === 0 || hasActiveLoan || isLoading}
              className="w-full mt-2"
              size="lg"
            >
              {hasActiveLoan ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Already Borrowed
                </>
              ) : (
                "Borrow Book"
              )}
            </Button>
            
            {hasActiveLoan && (
              <p className="text-xs text-center text-muted-foreground mt-2">
                You have already borrowed this book.
                <br />
                Check your <span className="text-primary font-medium">Dashboard</span> for details.
              </p>
            )}
          </div>
        </div>
        
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-display font-bold">{book.title}</h1>
            <p className="text-lg text-gray-600 mt-1">
              by {book.authors.map(a => a.name).join(", ")}
            </p>
            
            <div className="mt-3">
              {renderRating()}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h2 className="font-display text-xl mb-3">Description</h2>
            <p className="text-gray-700 leading-relaxed">{book.description}</p>
          </div>
          
          <Separator />
          
          <div>
            <h2 className="font-display text-xl mb-4">About the Author</h2>
            
            <div className="space-y-4">
              {book.authors.map(author => (
                <div key={author.id} className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      <UserIcon className="h-6 w-6" />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">{author.name}</h3>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                      {author.bio || "No biography available."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h2 className="font-display text-xl mb-3">Publisher Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Publisher</div>
                <div className="font-medium">{book.publisher.name}</div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Contact</div>
                <div className="font-medium">
                  {book.publisher.contactInfo || "No contact information"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Confirm Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Borrowing</DialogTitle>
            <DialogDescription>
              You are about to borrow "{book.title}". The book will be due on {formattedDueDate}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-start space-x-4 pt-4">
            <div className="h-20 w-14 overflow-hidden rounded border bg-muted">
              <img 
                src={book.coverImage} 
                alt={book.title} 
                className="h-full w-full object-cover" 
              />
            </div>
            <div>
              <h4 className="font-medium">{book.title}</h4>
              <p className="text-sm text-muted-foreground">
                by {book.authors.map(a => a.name).join(", ")}
              </p>
              <div className="mt-2 flex items-center text-sm">
                <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Due date: {formattedDueDate}</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmBorrow} disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                  Processing...
                </>
              ) : (
                "Confirm Borrowing"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookDetails;
