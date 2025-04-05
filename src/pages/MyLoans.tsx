
import { useEffect, useState } from "react";
import { BookOpen, Calendar, Clock } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

// Mock data for loans
const mockLoans = [
  {
    id: "1",
    bookTitle: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    loanDate: "2025-03-15",
    dueDate: "2025-04-05", 
    status: "active",
    coverImage: "/placeholder.svg"
  },
  {
    id: "2",
    bookTitle: "To Kill a Mockingbird",
    author: "Harper Lee",
    loanDate: "2025-03-20",
    dueDate: "2025-04-10",
    status: "active",
    coverImage: "/placeholder.svg"
  }
];

const MyLoans = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState(mockLoans);
  
  useEffect(() => {
    console.log("My Loans page loaded for user:", user?.id);
    // In a real app, this would fetch the user's loans from the backend
  }, [user]);

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <AppLayout>
      <div className="container py-8 max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">My Loans</h1>
            <p className="text-muted-foreground">Manage your current book loans</p>
          </div>
          <Button>
            <Clock className="mr-2 h-4 w-4" />
            Request Extension
          </Button>
        </div>
        
        <Separator className="my-6" />
        
        <div className="grid gap-6">
          {loans.map((loan) => (
            <Card key={loan.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-32 h-40 bg-muted flex-shrink-0">
                    <img 
                      src={loan.coverImage} 
                      alt={loan.bookTitle} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{loan.bookTitle}</h3>
                        <p className="text-muted-foreground">{loan.author}</p>
                      </div>
                      <Badge variant={getDaysRemaining(loan.dueDate) < 3 ? "destructive" : "outline"}>
                        {loan.status === "active" ? "Active" : "Returned"}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">
                          Borrowed: <span className="font-medium">{new Date(loan.loanDate).toLocaleDateString()}</span>
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">
                          Due: <span className="font-medium">{new Date(loan.dueDate).toLocaleDateString()}</span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">Renew</Button>
                      <Button variant="outline" size="sm">Mark as Returned</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default MyLoans;
