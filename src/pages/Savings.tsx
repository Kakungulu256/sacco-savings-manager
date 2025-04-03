import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { PlusCircle, Clock, CalendarIcon, BadgeDollarSign, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { savingsService, userService } from '@/lib/appwrite';

const Savings = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedUserId, setSelectedUserId] = useState<string>(''); // Tracks the selected user for admin
  const [savingsData, setSavingsData] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchSavings = async () => {
      setIsLoading(true);
      try {
        let data;
        if (user?.isAdmin) {
          data = await savingsService.getAllSavings();
        } else {
          data = await savingsService.getUserSavings(user?.$id || '');
        }
        const mappedData = data.documents.map(doc => ({
          id: doc.$id,
          userId: doc.userId,
          userName: doc.userName,
          amount: Number(doc.amount),
          description: doc.description,
          date: doc.date,
        }));
        setSavingsData(mappedData);
      } catch (error) {
        console.error('Error fetching savings data:', error);
        toast.error('Failed to load savings data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavings();

    if (user?.isAdmin) {
      const fetchUsers = async () => {
        try {
          const usersData = await userService.getAllUsers();
          setUsers(usersData.documents.map(doc => ({
            $id: doc.userId, // Use userId from the document, not $id of the document itself
            name: doc.name,
            email: doc.email,
          })));
        } catch (error) {
          console.error('Error fetching users:', error);
          toast.error('Failed to load users');
        }
      };
      fetchUsers();
    }
  }, [user]);

  // const filteredSavings = user?.isAdmin
  //   ? savingsData.filter(saving =>
  //       searchTerm
  //         ? saving.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //           saving.userId.toLowerCase().includes(searchTerm.toLowerCase())
  //         : true
  //     )
  //   : savingsData.filter(saving => saving.userId === user?.$id);
  const filteredSavings = user?.isAdmin
  ? savingsData.filter(saving =>
      searchTerm
        ? saving.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          saving.userId.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    )
  : savingsData.filter(saving => saving.userId === user?.$id);

  const paginatedSavings = filteredSavings.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalSavings = filteredSavings.reduce((total, saving) => total + (saving.amount || 0), 0);

  // const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchTerm(e.target.value);
  //   setCurrentPage(1);
  // };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    console.log('Search Term:', value); // Debugging
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // const handlePrint = () => {
  //   const printContent = `
  //     <html>
  //       <head>
  //         <title>Savings Report</title>
  //         <style>
  //           body { font-family: Arial, sans-serif; }
  //           table { width: 100%; border-collapse: collapse; }
  //           th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
  //           th { background-color: #f2f2f2; }
  //           .total { font-weight: bold; margin-top: 10px; }
  //         </style>
  //       </head>
  //       <body>
  //         <h1>${user?.isAdmin && searchTerm ? `Savings for "${searchTerm}"` : 'All Savings'}</h1>
  //         <table>
  //           <thead>
  //             <tr>
  //               <th>Date</th>
  //               ${user?.isAdmin ? '<th>User</th>' : ''}
  //               <th>Description</th>
  //               <th>Amount</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             ${filteredSavings
  //               .map(
  //                 saving => `
  //                   <tr>
  //                     <td>${formatDate(saving.date)}</td>
  //                     ${user?.isAdmin ? `<td>${saving.userName}</td>` : ''}
  //                     <td>${saving.description}</td>
  //                     <td>${saving.amount.toLocaleString('en-US', { style: 'currency', currency: 'UGX' })}</td>
  //                   </tr>
  //                 `
  //               )
  //               .join('')}
  //           </tbody>
  //         </table>
  //         <p class="total">Total: ${totalSavings.toLocaleString('en-US', { style: 'currency', currency: 'UGX' })}</p>
  //       </body>
  //     </html>
  //   `;
  //   const printWindow = window.open('', '_blank');
  //   printWindow.document.write(printContent);
  //   printWindow.document.close();
  //   printWindow.print();
  // };

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Savings Report</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .total { font-weight: bold; margin-top: 10px; }
          </style>
        </head>
        <body>
          <h1>${user?.isAdmin && searchTerm ? `Savings for "${searchTerm}"` : 'All Savings'}</h1>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                ${user?.isAdmin ? '<th>User</th>' : ''}
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${filteredSavings
                .map(
                  saving => `
                    <tr>
                      <td>${formatDate(saving.date)}</td>
                      ${user?.isAdmin ? `<td>${saving.userName}</td>` : ''}
                      <td>${saving.description}</td>
                      <td>${saving.amount.toLocaleString('en-US', { style: 'currency', currency: 'UGX' })}</td>
                    </tr>
                  `
                )
                .join('')}
            </tbody>
          </table>
          <p class="total">Total: ${totalSavings.toLocaleString('en-US', { style: 'currency', currency: 'UGX' })}</p>
        </body>
      </html>
    `;
  
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  
    // Restore focus to the search input field after printing
    const searchInput = document.getElementById('search');
    if (searchInput) {
      searchInput.focus();
    }
  };

  const handleSavingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !description) {
      toast.error('Please fill all required fields');
      return;
    }

    if (user?.isAdmin && !selectedUserId) {
      toast.error('Please select a user');
      return;
    }

    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }

    setIsLoading(true);

    try {
      // Determine the userId and userName based on whether it's an admin or regular user
      let targetUserId: string;
      let targetUserName: string;

      if (user?.isAdmin) {
        const selectedUser = users.find(u => u.$id === selectedUserId);
        if (!selectedUser) {
          throw new Error('Selected user not found');
        }
        targetUserId = selectedUser.$id; // Use the selected user's ID
        targetUserName = selectedUser.name;
      } else {
        targetUserId = user?.$id || ''; // Use the logged-in user's ID
        targetUserName = user?.name || 'Unknown User';
      }

      const newSaving = {
        userId: targetUserId,
        userName: targetUserName,
        amount: parseFloat(amount),
        description,
        date: selectedDate.toISOString(),
      };

      // Create savings with the correct userId
      await savingsService.createSavings(
        newSaving.userId,
        newSaving.userName,
        newSaving.amount,
        newSaving.description,
        newSaving.date
      );

      // Refresh savings data
      const updatedSavings = user?.isAdmin
        ? await savingsService.getAllSavings()
        : await savingsService.getUserSavings(user?.$id || '');
      setSavingsData(updatedSavings.documents.map(doc => ({
        id: doc.$id,
        userId: doc.userId,
        userName: doc.userName,
        amount: Number(doc.amount),
        description: doc.description,
        date: doc.date,
      })));

      setAmount('');
      setDescription('');
      setSelectedDate(new Date());
      setSelectedUserId(''); // Reset the dropdown after submission

      toast.success(`Savings added successfully for ${newSaving.userName}`);
    } catch (error) {
      console.error('Error adding savings:', error);
      toast.error('Failed to add savings');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getUserName = (saving) => {
    return saving.userName || `Unknown User`;
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Savings</h1>
            <p className="text-muted-foreground">Manage your savings and contributions</p>
          </div>
          <Card className="w-full md:w-64 bg-primary text-primary-foreground">
            <CardHeader className="pb-2">
              <CardDescription className="text-primary-foreground/70">Total Savings</CardDescription>
              <CardTitle className="text-2xl font-bold">
                {totalSavings.toLocaleString('en-US', { style: 'currency', currency: 'UGX' })}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Tabs defaultValue="history" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="history">Savings History</TabsTrigger>
            <TabsTrigger value="deposit">Make a Deposit</TabsTrigger>
          </TabsList>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Savings History</CardTitle>
                <CardDescription>View your savings transaction history</CardDescription>
              </CardHeader>
              <CardContent>
                {user?.isAdmin && (
                  <div className="mb-4">
                    <Label htmlFor="search">Search by User</Label>
                    <Input
                      id="search"
                      placeholder="Enter user name or ID"
                      value={searchTerm}
                      onChange={handleSearch}
                      className="max-w-md"
                    />
                  </div>
                )}
                <div className="rounded-md border">
                  <div className="grid grid-cols-4 md:grid-cols-5 p-4 bg-muted/50 font-medium">
                    <div>Date</div>
                    <div className="hidden md:block">{user?.isAdmin ? 'User' : 'Description'}</div>
                    <div>{user?.isAdmin ? 'Description' : 'Amount'}</div>
                    <div className="text-right">{user?.isAdmin ? 'Amount' : 'Status'}</div>
                  </div>
                  <div className="divide-y">
                    {isLoading ? (
                      <div className="p-4 text-center text-muted-foreground">Loading savings data...</div>
                    ) : paginatedSavings.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">No savings records found</div>
                    ) : (
                      paginatedSavings.map((saving) => (
                        <div key={saving.id} className="grid grid-cols-4 md:grid-cols-5 p-4 items-center">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{formatDate(saving.date)}</span>
                          </div>
                          <div className="hidden md:block">
                            {user?.isAdmin ? getUserName(saving) : saving.description}
                          </div>
                          <div>
                            {user?.isAdmin
                              ? saving.description
                              : saving.amount.toLocaleString('en-US', { style: 'currency', currency: 'UGX' })}
                          </div>
                          <div className="text-right">
                            {saving.amount.toLocaleString('en-US', { style: 'currency', currency: 'UGX' })}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <Button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span>
                    Page {currentPage} of {Math.ceil(filteredSavings.length / rowsPerPage)}
                  </span>
                  <Button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredSavings.length / rowsPerPage)))}
                    disabled={currentPage === Math.ceil(filteredSavings.length / rowsPerPage)}
                  >
                    Next
                  </Button>
                </div>
                <Button onClick={handlePrint} className="mt-4">
                  <Printer className="mr-2 h-4 w-4" />
                  Print Savings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deposit">
            <Card>
              <CardHeader>
                <CardTitle>Make a Deposit</CardTitle>
                <CardDescription>
                  {user?.isAdmin
                    ? 'Add savings for a specific user'
                    : 'Add funds to your savings account'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSavingsSubmit}>
                  <div className="grid gap-4">
                    {user?.isAdmin && (
                      <div className="grid gap-2">
                        <Label htmlFor="user">User</Label>
                        <Select
                          value={selectedUserId}
                          onValueChange={setSelectedUserId}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a user" />
                          </SelectTrigger>
                          <SelectContent>
                            {users.map((u) => (
                              <SelectItem key={u.$id} value={u.$id}>
                                {u.name} ({u.email})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <div className="grid gap-2">
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        placeholder="Enter amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="date">Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="date"
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !selectedDate && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            initialFocus
                            className={cn('p-3 pointer-events-auto')}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        placeholder="Purpose of savings"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button className="w-full mt-4" type="submit" disabled={isLoading}>
                    <BadgeDollarSign className="mr-2 h-4 w-4" />
                    {isLoading
                      ? 'Processing...'
                      : user?.isAdmin
                      ? 'Add Savings for User'
                      : 'Add Savings'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Savings;