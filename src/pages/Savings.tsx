
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { PlusCircle, Download, ArrowUpRight, Clock, CalendarIcon, BadgeDollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
// Import Appwrite services - uncomment when using Appwrite
// import { savingsService, databases, DATABASE_ID, SAVINGS_COLLECTION_ID, ID } from '@/lib/appwrite';

// Mock users data for admin to select from
const MOCK_USERS = [
  { $id: '1', email: 'admin@sacco.com', name: 'Admin User' },
  { $id: '2', email: 'user@sacco.com', name: 'Regular User' },
  { $id: '3', email: 'john.doe@example.com', name: 'John Doe' },
  { $id: '4', email: 'jane.smith@example.com', name: 'Jane Smith' },
  { $id: '5', email: 'mark.johnson@example.com', name: 'Mark Johnson' },
];

// Mock savings data
const MOCK_SAVINGS = [
  { id: 's1', userId: '2', amount: 5000, description: 'Monthly savings', date: '2023-10-15T10:00:00Z' },
  { id: 's2', userId: '2', amount: 2500, description: 'Emergency fund', date: '2023-11-01T14:30:00Z' },
  { id: 's3', userId: '2', amount: 10000, description: 'Investment savings', date: '2023-11-15T09:45:00Z' },
  { id: 's4', userId: '1', amount: 7500, description: 'Business capital', date: '2023-10-10T11:20:00Z' },
  { id: 's5', userId: '1', amount: 3500, description: 'Education fund', date: '2023-11-05T16:15:00Z' },
];

const Savings = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [savingsData, setSavingsData] = useState(MOCK_SAVINGS);
  const [isLoading, setIsLoading] = useState(false);
  
  // This effect would fetch data from Appwrite when component mounts
  useEffect(() => {
    // Uncomment when using Appwrite
    // const fetchSavings = async () => {
    //   setIsLoading(true);
    //   try {
    //     let data;
    //     if (user?.isAdmin) {
    //       data = await savingsService.getAllSavings();
    //     } else {
    //       data = await savingsService.getUserSavings(user?.$id || '');
    //     }
    //     setSavingsData(data.documents.map(doc => ({
    //       id: doc.$id,
    //       userId: doc.userId,
    //       amount: doc.amount,
    //       description: doc.description,
    //       date: doc.date
    //     })));
    //   } catch (error) {
    //     console.error('Error fetching savings data:', error);
    //     toast.error('Failed to load savings data');
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    
    // fetchSavings();
    
    // Using mock data for now
    setIsLoading(false);
  }, [user]);

  // Get user's savings or all savings for admin
  const filteredSavings = user?.isAdmin 
    ? savingsData 
    : savingsData.filter(saving => saving.userId === user?.$id);

  // Calculate total savings
  const totalSavings = filteredSavings.reduce((total, saving) => total + saving.amount, 0);

  const handleSavingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description) {
      toast.error('Please fill all required fields');
      return;
    }

    // For admin, require a user selection
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
      const newSaving = {
        id: `s${savingsData.length + 1}`,
        userId: user?.isAdmin ? selectedUserId : user?.$id || '',
        amount: parseFloat(amount),
        description,
        date: selectedDate.toISOString()
      };

      // Uncomment when using Appwrite
      // if (user?.isAdmin) {
      //   // Admin creating savings for a user
      //   await databases.createDocument(
      //     DATABASE_ID,
      //     SAVINGS_COLLECTION_ID,
      //     ID.unique(),
      //     {
      //       userId: selectedUserId,
      //       amount: parseFloat(amount),
      //       description,
      //       date: selectedDate.toISOString()
      //     }
      //   );
      // } else {
      //   // User creating their own savings
      //   await savingsService.createSavings(
      //     user?.$id || '',
      //     parseFloat(amount),
      //     description
      //   );
      // }
      
      // Update local state for immediate UI feedback
      setSavingsData([...savingsData, newSaving]);
      setAmount('');
      setDescription('');

      if (user?.isAdmin) {
        // Find user name for the toast message
        const selectedUser = MOCK_USERS.find(u => u.$id === selectedUserId);
        toast.success(`Savings added successfully for ${selectedUser?.name || 'user'}`);
      } else {
        toast.success('Savings added successfully');
      }
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

  // Get user name by ID - useful for admin view
  const getUserName = (userId: string) => {
    // This could use a more efficient lookup in a real app
    const user = MOCK_USERS.find(u => u.$id === userId);
    return user ? user.name : `User ${userId}`;
    
    // With Appwrite, you might fetch user details:
    // const fetchUserName = async (userId) => {
    //   try {
    //     const userDoc = await databases.listDocuments(
    //       DATABASE_ID,
    //       'users',
    //       [Query.equal('userId', userId)]
    //     );
    //     return userDoc.documents[0]?.name || `User ${userId}`;
    //   } catch (error) {
    //     console.error('Error fetching user name:', error);
    //     return `User ${userId}`;
    //   }
    // };
  };

  // Function to export savings data - would integrate with Appwrite's reporting service
  const handleExportData = () => {
    // Uncomment when using Appwrite
    // const exportSavings = async () => {
    //   try {
    //     const userId = user?.isAdmin ? undefined : user?.$id;
    //     const report = await reportsService.generateSavingsReport(userId);
    //     const fileName = `savings_report_${new Date().toISOString().split('T')[0]}.json`;
    //     const fileId = await reportsService.uploadReportToStorage(report, fileName);
    //     const downloadLink = await reportsService.getReportDownloadLink(fileId);
    //     window.open(downloadLink, '_blank');
    //   } catch (error) {
    //     console.error('Error exporting savings data:', error);
    //     toast.error('Failed to export savings data');
    //   }
    // };
    
    // exportSavings();
    
    // For mock data, just show a toast
    toast.success('Savings data would be exported here');
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
              <CardTitle className="text-2xl font-bold">{totalSavings.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</CardTitle>
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
                <div className="rounded-md border">
                  <div className="grid grid-cols-4 md:grid-cols-5 p-4 bg-muted/50 font-medium">
                    <div>Date</div>
                    <div className="hidden md:block">{user?.isAdmin ? 'User' : 'Description'}</div>
                    <div>{user?.isAdmin ? 'Description' : 'Amount'}</div>
                    <div className="text-right">{user?.isAdmin ? 'Amount' : 'Status'}</div>
                    <div className="text-right">Actions</div>
                  </div>
                  <div className="divide-y">
                    {isLoading ? (
                      <div className="p-4 text-center text-muted-foreground">Loading savings data...</div>
                    ) : filteredSavings.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">No savings records found</div>
                    ) : (
                      filteredSavings.map((saving) => (
                        <div key={saving.id} className="grid grid-cols-4 md:grid-cols-5 p-4 items-center">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{formatDate(saving.date)}</span>
                          </div>
                          <div className="hidden md:block">
                            {user?.isAdmin ? getUserName(saving.userId) : saving.description}
                          </div>
                          <div>{user?.isAdmin ? saving.description : saving.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
                          <div className="text-right">
                            {user?.isAdmin ? (
                              saving.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Completed
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <Button variant="ghost" size="icon">
                              <ArrowUpRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" className="w-full sm:w-auto" onClick={handleExportData}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </CardFooter>
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
                    {/* User selection dropdown (admin only) */}
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
                            {MOCK_USERS.map((user) => (
                              <SelectItem key={user.$id} value={user.$id}>
                                {user.name} ({user.email})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Amount input */}
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

                    {/* Date selection */}
                    <div className="grid gap-2">
                      <Label htmlFor="date">Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="date"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !selectedDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Description input */}
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
                        : 'Add Savings'
                    }
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
