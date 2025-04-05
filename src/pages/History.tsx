
import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, Clock, X } from "lucide-react";

// Mock history data
const mockLoanHistory = [
  {
    id: "101",
    bookTitle: "The Hobbit",
    author: "J.R.R. Tolkien",
    loanDate: "2024-12-10",
    returnDate: "2025-01-05",
    status: "returned",
  },
  {
    id: "102",
    bookTitle: "Pride and Prejudice",
    author: "Jane Austen",
    loanDate: "2025-01-15",
    returnDate: "2025-02-10",
    status: "returned",
  },
  {
    id: "103",
    bookTitle: "1984",
    author: "George Orwell",
    loanDate: "2025-02-20",
    returnDate: null,
    status: "overdue",
  }
];

const mockReadingLists = [
  {
    id: "201",
    name: "Summer Reading",
    created: "2025-01-15",
    books: ["The Alchemist", "Dune", "The Road"]
  },
  {
    id: "202",
    name: "Classics",
    created: "2024-11-05",
    books: ["War and Peace", "Crime and Punishment", "Anna Karenina"]
  }
];

const History = () => {
  const [activeTab, setActiveTab] = useState("loans");

  return (
    <AppLayout>
      <div className="container py-8 max-w-5xl">
        <h1 className="text-3xl font-bold mb-6">Activity History</h1>
        
        <Tabs defaultValue="loans" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="loans">Loan History</TabsTrigger>
            <TabsTrigger value="lists">Reading Lists</TabsTrigger>
          </TabsList>
          
          <TabsContent value="loans" className="space-y-6">
            {mockLoanHistory.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{item.bookTitle}</h3>
                      <p className="text-muted-foreground">{item.author}</p>
                    </div>
                    <Badge variant={item.status === "returned" ? "outline" : "destructive"}>
                      {item.status === "returned" ? "Returned" : "Overdue"}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-6 mt-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">
                        Borrowed: <span className="font-medium">{new Date(item.loanDate).toLocaleDateString()}</span>
                      </span>
                    </div>
                    <div className="flex items-center">
                      {item.status === "returned" ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          <span className="text-sm">
                            Returned: <span className="font-medium">{new Date(item.returnDate!).toLocaleDateString()}</span>
                          </span>
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4 mr-2 text-red-500" />
                          <span className="text-sm">Not yet returned</span>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="lists" className="space-y-6">
            {mockReadingLists.map((list) => (
              <Card key={list.id}>
                <CardHeader>
                  <CardTitle>{list.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Created on {new Date(list.created).toLocaleDateString()}
                  </p>
                  <div className="space-y-2">
                    {list.books.map((book, idx) => (
                      <div key={idx} className="flex items-center py-2 px-3 bg-muted rounded-md">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{book}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default History;
