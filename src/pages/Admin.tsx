
import { useState, useEffect } from "react";
import { Navigate, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Library, Users, BookOpen, BookMarked, ClipboardList, Plus, Search } from "lucide-react";
import { books, loans, users, authors, publishers } from "@/lib/data";
import { toast } from "sonner";

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
  if (!isAuthenticated || (user?.role !== "admin" && user?.role !== "staff")) {
    return <Navigate to="/login" />;
  }

  const totalBooks = books.length;
  const totalMembers = users.filter(u => u.role === "member").length;
  const totalLoans = loans.length;
  const activeLoans = loans.filter(loan => loan.status === "active").length;
  const overdueLoans = loans.filter(loan => loan.status === "overdue").length;

  return (
    <div className="container p-6 mx-auto">
      <h1 className="text-3xl font-display font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mr-4">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Books</p>
              <h3 className="text-2xl font-bold">{totalBooks}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 mr-4">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Members</p>
              <h3 className="text-2xl font-bold">{totalMembers}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600 mr-4">
              <BookMarked className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Active Loans</p>
              <h3 className="text-2xl font-bold">{activeLoans}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-600 mr-4">
              <ClipboardList className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Overdue Books</p>
              <h3 className="text-2xl font-bold">{overdueLoans}</h3>
            </div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="books" className="w-full">
        <TabsList className="w-full justify-start mb-6 bg-white border">
          <TabsTrigger value="books" className="flex-1 md:flex-none">Books</TabsTrigger>
          <TabsTrigger value="members" className="flex-1 md:flex-none">Members</TabsTrigger>
          <TabsTrigger value="loans" className="flex-1 md:flex-none">Loans</TabsTrigger>
          <TabsTrigger value="publishers" className="flex-1 md:flex-none">Publishers</TabsTrigger>
          <TabsTrigger value="authors" className="flex-1 md:flex-none">Authors</TabsTrigger>
        </TabsList>
        
        {/* Books Tab */}
        <TabsContent value="books">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-xl font-display font-bold">Manage Books</h2>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search books..."
                    className="pl-9 pr-4 h-9"
                  />
                </div>
                
                <Button size="sm" className="gap-1 whitespace-nowrap">
                  <Plus className="h-4 w-4" />
                  Add Book
                </Button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Title</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Author</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Genre</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Available</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {books.slice(0, 5).map((book) => (
                    <tr key={book.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">{book.id}</td>
                      <td className="py-3 px-4 font-medium">{book.title}</td>
                      <td className="py-3 px-4">
                        {book.authors.map(a => a.name).join(", ")}
                      </td>
                      <td className="py-3 px-4">{book.genre}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          book.availableCopies > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {book.availableCopies} / {book.totalCopies}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="h-8 px-2">Edit</Button>
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50">Delete</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-center mt-6">
              <Button variant="outline" size="sm">View All Books</Button>
            </div>
          </div>
        </TabsContent>
        
        {/* Members Tab */}
        <TabsContent value="members">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-xl font-display font-bold">Manage Members</h2>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search members..."
                    className="pl-9 pr-4 h-9"
                  />
                </div>
                
                <Button size="sm" className="gap-1 whitespace-nowrap">
                  <Plus className="h-4 w-4" />
                  Add Member
                </Button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Join Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Role</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">{user.id}</td>
                      <td className="py-3 px-4 font-medium">{user.name}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">{user.membershipStartDate || "N/A"}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.role === "admin" 
                            ? "bg-purple-100 text-purple-800" 
                            : user.role === "staff"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="h-8 px-2">Edit</Button>
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50">Delete</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        {/* Loans Tab */}
        <TabsContent value="loans">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-xl font-display font-bold">Manage Loans</h2>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search loans..."
                    className="pl-9 pr-4 h-9"
                  />
                </div>
                
                <Button size="sm" className="gap-1 whitespace-nowrap">
                  <Plus className="h-4 w-4" />
                  Add Loan
                </Button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Member</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Book</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Borrow Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Due Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {loans.map((loan) => {
                    const member = users.find(u => u.id === loan.memberId);
                    const book = books.find(b => b.id === loan.bookId);
                    
                    return (
                      <tr key={loan.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">{loan.id}</td>
                        <td className="py-3 px-4 font-medium">{member?.name || "Unknown"}</td>
                        <td className="py-3 px-4">{book?.title || "Unknown"}</td>
                        <td className="py-3 px-4">{new Date(loan.loanDate).toLocaleDateString()}</td>
                        <td className="py-3 px-4">{new Date(loan.dueDate).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            loan.status === "active" 
                              ? "bg-green-100 text-green-800" 
                              : loan.status === "overdue"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                          }`}>
                            {loan.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 px-2"
                              onClick={() => {
                                if (loan.status === "active" || loan.status === "overdue") {
                                  loan.status = "returned";
                                  loan.returnDate = new Date().toISOString().split('T')[0];
                                  
                                  // Update book availability
                                  const book = books.find(b => b.id === loan.bookId);
                                  if (book) {
                                    book.availableCopies += 1;
                                  }
                                  
                                  toast.success("Book marked as returned!");
                                }
                              }}
                            >
                              {loan.status === "returned" ? "View" : "Return"}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        {/* Publishers Tab */}
        <TabsContent value="publishers">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-xl font-display font-bold">Manage Publishers</h2>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search publishers..."
                    className="pl-9 pr-4 h-9"
                  />
                </div>
                
                <Button size="sm" className="gap-1 whitespace-nowrap">
                  <Plus className="h-4 w-4" />
                  Add Publisher
                </Button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Address</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Contact</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Books</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {publishers.map((publisher) => {
                    const publisherBooks = books.filter(b => b.publisherId === publisher.id);
                    
                    return (
                      <tr key={publisher.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">{publisher.id}</td>
                        <td className="py-3 px-4 font-medium">{publisher.name}</td>
                        <td className="py-3 px-4">{publisher.address || "N/A"}</td>
                        <td className="py-3 px-4">{publisher.contactInfo || "N/A"}</td>
                        <td className="py-3 px-4">{publisherBooks.length}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="h-8 px-2">Edit</Button>
                            <Button variant="ghost" size="sm" className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50">Delete</Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        {/* Authors Tab */}
        <TabsContent value="authors">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-xl font-display font-bold">Manage Authors</h2>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search authors..."
                    className="pl-9 pr-4 h-9"
                  />
                </div>
                
                <Button size="sm" className="gap-1 whitespace-nowrap">
                  <Plus className="h-4 w-4" />
                  Add Author
                </Button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Biography</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Books</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {authors.map((author) => {
                    const authorBooks = books.filter(b => b.authors.some(a => a.id === author.id));
                    
                    return (
                      <tr key={author.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">{author.id}</td>
                        <td className="py-3 px-4 font-medium">{author.name}</td>
                        <td className="py-3 px-4">
                          <div className="truncate max-w-xs">
                            {author.bio || "No biography available"}
                          </div>
                        </td>
                        <td className="py-3 px-4">{authorBooks.length}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="h-8 px-2">Edit</Button>
                            <Button variant="ghost" size="sm" className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50">Delete</Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Admin = () => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || (user?.role !== "admin" && user?.role !== "staff")) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex flex-1 pt-16">
        <Sidebar />
        
        <main className="flex-1 ml-0 md:ml-64 transition-all duration-300">
          <AdminDashboard />
        </main>
      </div>
    </div>
  );
};

export default Admin;
