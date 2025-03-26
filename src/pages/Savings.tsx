
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Download, ArrowUpRight, Clock } from 'lucide-react';
import { toast } from 'sonner';

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
  const [savingsData, setSavingsData] = useState(MOCK_SAVINGS);

  // Get user's savings or all savings for admin
  const filteredSavings = user?.isAdmin 
    ? savingsData 
    : savingsData.filter(saving => saving.userId === user?.$id);

  // Calculate total savings
  const totalSavings = filteredSavings.reduce((total, saving) => total + saving.amount, 0);

  const handleSavingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description) {
      toast.error('Please fill all fields');
      return;
    }

    const newSaving = {
      id: `s${savingsData.length + 1}`,
      userId: user?.$id || '',
      amount: parseFloat(amount),
      description,
      date: new Date().toISOString()
    };

    setSavingsData([...savingsData, newSaving]);
    setAmount('');
    setDescription('');
    toast.success('Savings added successfully');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
                    {filteredSavings.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">No savings records found</div>
                    ) : (
                      filteredSavings.map((saving) => (
                        <div key={saving.id} className="grid grid-cols-4 md:grid-cols-5 p-4 items-center">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{formatDate(saving.date)}</span>
                          </div>
                          <div className="hidden md:block">{user?.isAdmin ? `User ID: ${saving.userId}` : saving.description}</div>
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
                <Button variant="outline" className="w-full sm:w-auto">
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
                <CardDescription>Add funds to your savings account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSavingsSubmit}>
                  <div className="grid gap-4">
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
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        placeholder="Purpose of savings"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button className="w-full mt-4" type="submit">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Savings
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
