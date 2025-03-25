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
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Member type based on ER diagram
type Member = {
  MemberID: string;
  Name: string;
  Address: string;
  PhoneNumber: string;
  Email: string;
  MembershipStartDate: string;
};

const ManageMembers: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [newMember, setNewMember] = useState<Partial<Member>>({});
  const { user } = useAuth();

  // Fetch members - replace with actual API call
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // Simulated API call - replace with actual endpoint
        const response = await fetch('/api/members', {
          headers: {
            'Authorization': `Bearer ${user?.token}`
          }
        });
        const data = await response.json();
        setMembers(data);
      } catch (error) {
        console.error('Failed to fetch members', error);
      }
    };

    fetchMembers();
  }, [user]);

  // Handle new member creation
  const handleCreateMember = async () => {
    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          ...newMember,
          MembershipStartDate: new Date().toISOString()
        })
      });

      const createdMember = await response.json();
      setMembers([...members, createdMember]);
      setNewMember({}); // Reset form
    } catch (error) {
      console.error('Failed to create member', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Members</h1>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New Member</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Member</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input 
                  id="name" 
                  value={newMember.Name || ''} 
                  onChange={(e) => setNewMember({...newMember, Name: e.target.value})}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input 
                  id="email" 
                  value={newMember.Email || ''} 
                  onChange={(e) => setNewMember({...newMember, Email: e.target.value})}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">Phone</Label>
                <Input 
                  id="phone" 
                  value={newMember.PhoneNumber || ''} 
                  onChange={(e) => setNewMember({...newMember, PhoneNumber: e.target.value})}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">Address</Label>
                <Input 
                  id="address" 
                  value={newMember.Address || ''} 
                  onChange={(e) => setNewMember({...newMember, Address: e.target.value})}
                  className="col-span-3" 
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleCreateMember}>Create Member</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Membership Start Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.MemberID}>
              <TableCell>{member.MemberID}</TableCell>
              <TableCell>{member.Name}</TableCell>
              <TableCell>{member.Email}</TableCell>
              <TableCell>{member.PhoneNumber}</TableCell>
              <TableCell>
                {new Date(member.MembershipStartDate).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ManageMembers;