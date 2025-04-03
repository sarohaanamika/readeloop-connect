
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/hooks/useAuth';
import { Loan } from '@/lib/types';
import { fetchLoans, returnLoan } from '@/services/loanService';
import AppLayout from '@/components/layout/AppLayout';
import { toast } from 'sonner';

const ManageLoans: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadLoans = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const loansData = await fetchLoans();
        setLoans(loansData);
      } catch (error) {
        console.error('Failed to fetch loans', error);
        toast.error('Failed to load loans');
      } finally {
        setIsLoading(false);
      }
    };

    loadLoans();
  }, [user]);

  const handleReturnLoan = async (loanId: string) => {
    try {
      const success = await returnLoan(loanId);
      
      if (success) {
        setLoans(loans.map(loan => 
          loan.id === loanId 
            ? { ...loan, status: 'returned', returnDate: new Date().toISOString() } 
            : loan
        ));
        toast.success('Book returned successfully');
      } else {
        toast.error('Failed to return book');
      }
    } catch (error) {
      console.error('Failed to return loan', error);
      toast.error('Failed to return book');
    }
  };

  return (
    <AppLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Manage Loans</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin-slow relative w-12 h-12">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-primary/20 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-primary rounded-full"></div>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loan ID</TableHead>
                <TableHead>Member ID</TableHead>
                <TableHead>Book Title</TableHead>
                <TableHead>Loan Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loans.length > 0 ? (
                loans.map((loan) => (
                  <TableRow key={loan.id}>
                    <TableCell>{loan.id.substring(0, 8)}</TableCell>
                    <TableCell>{loan.memberId.substring(0, 8)}</TableCell>
                    <TableCell>{loan.book?.title || 'Unknown Book'}</TableCell>
                    <TableCell>{new Date(loan.loanDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(loan.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span 
                        className={`
                          px-2 py-1 rounded-full text-xs font-medium
                          ${loan.status === 'active' ? 'bg-green-100 text-green-800' : 
                            loan.status === 'overdue' ? 'bg-red-100 text-red-800' : 
                            'bg-gray-100 text-gray-800'}
                        `}
                      >
                        {loan.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            disabled={loan.status !== 'active'}
                            onClick={() => setSelectedLoan(loan)}
                          >
                            Return Book
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Return Book</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to mark this loan as returned?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => selectedLoan && handleReturnLoan(selectedLoan.id)}
                            >
                              Confirm Return
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No loans found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </AppLayout>
  );
};

export default ManageLoans;
