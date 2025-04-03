
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
import { supabase } from '@/lib/supabase';

// Loan type based on ER diagram
type Loan = {
  LoanID: string;
  MemberID: string;
  BookID: string;
  LoanDate: string;
  DueDate: string;
  ReturnDate?: string;
  status: 'active' | 'returned' | 'overdue';
};

const ManageLoans: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const { user } = useAuth();

  // Fetch loans - replace with actual API call
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        // Mock data for development until the actual API is implemented
        const mockLoans: Loan[] = [
          {
            LoanID: '1',
            MemberID: '101',
            BookID: '201',
            LoanDate: '2023-10-01',
            DueDate: '2023-10-15',
            status: 'active'
          },
          {
            LoanID: '2',
            MemberID: '102',
            BookID: '202',
            LoanDate: '2023-09-15',
            DueDate: '2023-09-29',
            ReturnDate: '2023-09-28',
            status: 'returned'
          },
          {
            LoanID: '3',
            MemberID: '103',
            BookID: '203',
            LoanDate: '2023-09-01',
            DueDate: '2023-09-15',
            status: 'overdue'
          }
        ];
        
        setLoans(mockLoans);
        
        // Uncomment when Supabase is fully set up
        // const { data, error } = await supabase
        //   .from('loans')
        //   .select('*');
        // if (error) throw error;
        // setLoans(data || []);
      } catch (error) {
        console.error('Failed to fetch loans', error);
      }
    };

    fetchLoans();
  }, [user]);

  // Handle loan return
  const handleReturnLoan = async (loanId: string) => {
    try {
      // Update local state first for immediate UI feedback
      setLoans(loans.map(loan => 
        loan.LoanID === loanId 
          ? { ...loan, status: 'returned', ReturnDate: new Date().toISOString() } 
          : loan
      ));
      
      // Uncomment when Supabase is fully set up
      // const { error } = await supabase
      //   .from('loans')
      //   .update({ 
      //     status: 'returned',
      //     ReturnDate: new Date().toISOString()
      //   })
      //   .eq('LoanID', loanId);
      // if (error) throw error;
    } catch (error) {
      console.error('Failed to return loan', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Loans</h1>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Loan ID</TableHead>
            <TableHead>Member ID</TableHead>
            <TableHead>Book ID</TableHead>
            <TableHead>Loan Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loans.map((loan) => (
            <TableRow key={loan.LoanID}>
              <TableCell>{loan.LoanID}</TableCell>
              <TableCell>{loan.MemberID}</TableCell>
              <TableCell>{loan.BookID}</TableCell>
              <TableCell>{new Date(loan.LoanDate).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(loan.DueDate).toLocaleDateString()}</TableCell>
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
                        onClick={() => selectedLoan && handleReturnLoan(selectedLoan.LoanID)}
                      >
                        Confirm Return
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ManageLoans;
