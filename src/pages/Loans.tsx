
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Download, ArrowUpRight, Clock, FileText } from 'lucide-react';
import { toast } from 'sonner';

// Mock loans data
const MOCK_LOANS = [
  { id: 'l1', userId: '2', amount: 15000, purpose: 'Business expansion', duration: 12, status: 'approved', interestRate: 10, applicationDate: '2023-09-15T10:00:00Z', approvalDate: '2023-09-20T14:30:00Z' },
  { id: 'l2', userId: '2', amount: 5000, purpose: 'Emergency funds', duration: 6, status: 'pending', interestRate: 10, applicationDate: '2023-11-05T11:20:00Z' },
  { id: 'l3', userId: '1', amount: 25000, purpose: 'Real estate investment', duration: 24, status: 'approved', interestRate: 12, applicationDate: '2023-08-10T09:15:00Z', approvalDate: '2023-08-15T16:45:00Z' },
  { id: 'l4', userId: '1', amount: 10000, purpose: 'Education funding', duration: 12, status: 'rejected', interestRate: 10, applicationDate: '2023-10-20T13:40:00Z' },
];

const Loans = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [duration, setDuration] = useState('12');
  const [loansData, setLoansData] = useState(MOCK_LOANS);
  const [activeTab, setActiveTab] = useState('applications');
  
  // For admin to update loan status
  const [selectedLoanId, setSelectedLoanId] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [interestRate, setInterestRate] = useState('10');

  // Get user's loans or all loans for admin
  const filteredLoans = user?.isAdmin 
    ? loansData 
    : loansData.filter(loan => loan.userId === user?.$id);

  const handleLoanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !purpose || !duration) {
      toast.error('Please fill all fields');
      return;
    }

    const newLoan = {
      id: `l${loansData.length + 1}`,
      userId: user?.$id || '',
      amount: parseFloat(amount),
      purpose,
      duration: parseInt(duration),
      status: 'pending',
      interestRate: 10,
      applicationDate: new Date().toISOString(),
    };

    setLoansData([...loansData, newLoan]);
    setAmount('');
    setPurpose('');
    setDuration('12');
    toast.success('Loan application submitted successfully');
    setActiveTab('applications');
  };

  const handleStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedLoanId || !newStatus) {
      toast.error('Please select a loan and status');
      return;
    }

    const updatedLoans = loansData.map(loan => {
      if (loan.id === selectedLoanId) {
        const updatedLoan = { 
          ...loan, 
          status: newStatus,
          interestRate: parseInt(interestRate)
        };
        
        if (newStatus === 'approved') {
          updatedLoan.approvalDate = new Date().toISOString();
        }
        
        return updatedLoan;
      }
      return loan;
    });

    setLoansData(updatedLoans);
    setSelectedLoanId('');
    setNewStatus('');
    setInterestRate('10');
    toast.success('Loan status updated successfully');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Approved</span>;
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
      case 'rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejected</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Loans</h1>
          <p className="text-muted-foreground">Apply for loans and view your loan applications</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="applications">Loan Applications</TabsTrigger>
            <TabsTrigger value="apply">Apply for Loan</TabsTrigger>
            {user?.isAdmin && <TabsTrigger value="manage">Manage Loans</TabsTrigger>}
          </TabsList>

          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Loan Applications</CardTitle>
                <CardDescription>View your loan application history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-3 md:grid-cols-6 p-4 bg-muted/50 font-medium">
                    <div>Date</div>
                    <div className="hidden md:block">{user?.isAdmin ? 'User' : 'Purpose'}</div>
                    <div>{user?.isAdmin ? 'Purpose' : 'Amount'}</div>
                    <div className="hidden md:block">Term</div>
                    <div>Status</div>
                    <div className="text-right">Actions</div>
                  </div>
                  <div className="divide-y">
                    {filteredLoans.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">No loan applications found</div>
                    ) : (
                      filteredLoans.map((loan) => (
                        <div key={loan.id} className="grid grid-cols-3 md:grid-cols-6 p-4 items-center">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{formatDate(loan.applicationDate)}</span>
                          </div>
                          <div className="hidden md:block">{user?.isAdmin ? `User ID: ${loan.userId}` : loan.purpose}</div>
                          <div>{user?.isAdmin ? loan.purpose : loan.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
                          <div className="hidden md:block">{loan.duration} months</div>
                          <div>{getStatusBadge(loan.status)}</div>
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

          <TabsContent value="apply">
            <Card>
              <CardHeader>
                <CardTitle>Apply for a Loan</CardTitle>
                <CardDescription>Fill out the form to apply for a new loan</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLoanSubmit}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="loanAmount">Loan Amount</Label>
                      <Input
                        id="loanAmount"
                        placeholder="Enter amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="loanPurpose">Loan Purpose</Label>
                      <Textarea
                        id="loanPurpose"
                        placeholder="Describe the purpose of the loan"
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="loanDuration">Loan Duration (months)</Label>
                      <Select value={duration} onValueChange={setDuration}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select loan term" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 months</SelectItem>
                          <SelectItem value="6">6 months</SelectItem>
                          <SelectItem value="12">12 months</SelectItem>
                          <SelectItem value="24">24 months</SelectItem>
                          <SelectItem value="36">36 months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      <p>Standard interest rate: 10% per annum</p>
                      <p>Processing time: 2-5 business days</p>
                    </div>
                  </div>
                  <Button className="w-full mt-4" type="submit">
                    <FileText className="mr-2 h-4 w-4" />
                    Submit Application
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {user?.isAdmin && (
            <TabsContent value="manage">
              <Card>
                <CardHeader>
                  <CardTitle>Manage Loan Applications</CardTitle>
                  <CardDescription>Review and update loan application statuses</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleStatusUpdate}>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="loanSelect">Select Loan</Label>
                        <Select value={selectedLoanId} onValueChange={setSelectedLoanId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a loan application" />
                          </SelectTrigger>
                          <SelectContent>
                            {loansData.map(loan => (
                              <SelectItem key={loan.id} value={loan.id}>
                                Loan {loan.id} - {loan.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} - {loan.purpose.substring(0, 20)}...
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="statusSelect">Update Status</Label>
                        <Select value={newStatus} onValueChange={setNewStatus}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select new status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {newStatus === 'approved' && (
                        <div className="grid gap-2">
                          <Label htmlFor="interestRate">Interest Rate (%)</Label>
                          <Input
                            id="interestRate"
                            placeholder="Enter interest rate"
                            type="number"
                            value={interestRate}
                            onChange={(e) => setInterestRate(e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                    <Button className="w-full mt-4" type="submit">
                      Update Loan Status
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Loans;
