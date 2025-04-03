
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '@/contexts/AuthContext';
// import { loansService, userService } from '@/lib/appwrite';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Textarea } from '@/components/ui/textarea';
// import { Download, ArrowUpRight, Clock, FileText } from 'lucide-react';
// import { toast } from 'sonner';

// const Loans = () => {
//   const { user } = useAuth();
//   const [amount, setAmount] = useState('');
//   const [purpose, setPurpose] = useState('');
//   const [duration, setDuration] = useState('12');
//   const [loansData, setLoansData] = useState([]);
//   const [usersMap, setUsersMap] = useState<Record<string, string>>({});
//   const [activeTab, setActiveTab] = useState('applications');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [currentLoan, setCurrentLoan] = useState<any>(null);

//   // For admin to update loan status
//   const [selectedLoanId, setSelectedLoanId] = useState('');
//   const [newStatus, setNewStatus] = useState('');
//   const [interestRate, setInterestRate] = useState('10');

//   // Fetch loans and user data
//   useEffect(() => {
//     const fetchLoansAndUsers = async () => {
//       try {
//         const loans = user?.isAdmin
//           ? await loansService.getAllLoans()
//           : await loansService.getUserLoans(user?.$id);
//         setLoansData(loans.documents);

//         if (user?.isAdmin) {
//           const users = await userService.getAllUsers();
//           const userMap = users.documents.reduce((map, userDoc) => {
//             map[userDoc.userId] = userDoc.name;
//             return map;
//           }, {} as Record<string, string>);
//           setUsersMap(userMap);
//         }
//       } catch (error) {
//         console.error('Error fetching loans or users:', error);
//         toast.error('Failed to fetch loans or users. Please try again later.');
//       }
//     };

//     fetchLoansAndUsers();
//   }, [user]);

//   const handleLoanSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!amount || !purpose || !duration) {
//       toast.error('Please fill all fields');
//       return;
//     }

//     try {
//       await loansService.applyForLoan(
//         user?.$id || '',
//         parseFloat(amount),
//         purpose,
//         parseInt(duration)
//       );

//       toast.success('Loan application submitted successfully');
//       setAmount('');
//       setPurpose('');
//       setDuration('12');
//       setActiveTab('applications');

//       const updatedLoans = await loansService.getUserLoans(user?.$id);
//       setLoansData(updatedLoans.documents);
//     } catch (error) {
//       console.error('Error submitting loan application:', error);
//       toast.error('Failed to submit loan application. Please try again.');
//     }
//   };

//   const handleStatusUpdate = async (loanId: string, status: string, interestRate?: number) => {
//     try {
//       await loansService.updateLoanStatus(
//         loanId,
//         status as 'approved' | 'rejected',
//         status === 'approved' ? interestRate : undefined
//       );

//       toast.success('Loan status updated successfully');

//       const updatedLoans = user?.isAdmin
//         ? await loansService.getAllLoans()
//         : await loansService.getUserLoans(user?.$id);
//       setLoansData(updatedLoans.documents);
//     } catch (error) {
//       console.error('Error updating loan status:', error);
//       toast.error('Failed to update loan status. Please try again.');
//     }
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//     });
//   };

//   const filteredLoans = user?.isAdmin
//     ? loansData
//     : loansData.filter((loan) => loan.userId === user?.$id);

//   return (
//     <div className="container mx-auto p-6">
//       <div className="flex flex-col space-y-8">
//         <div>
//           <h1 className="text-3xl font-bold mb-2">Loans</h1>
//           <p className="text-muted-foreground">Apply for loans and view your loan applications</p>
//         </div>

//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="mb-4">
//             <TabsTrigger value="applications">Loan Applications</TabsTrigger>
//             <TabsTrigger value="apply">Apply for Loan</TabsTrigger>
//             {user?.isAdmin && <TabsTrigger value="manage">Manage Loans</TabsTrigger>}
//           </TabsList>

//           <TabsContent value="applications">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Loan Applications</CardTitle>
//                 <CardDescription>View your loan application history</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="rounded-md border">
//                   <div className="grid grid-cols-3 md:grid-cols-6 p-4 bg-muted/50 font-medium">
//                     <div>Date</div>
//                     <div className="hidden md:block">{user?.isAdmin ? 'User' : 'Purpose'}</div>
//                     <div>{user?.isAdmin ? 'Purpose' : 'Amount'}</div>
//                     <div className="hidden md:block">Term</div>
//                     <div>Status</div>
//                     <div className="text-right">Actions</div>
//                   </div>
//                   <div className="divide-y">
//                     {filteredLoans.length === 0 ? (
//                       <div className="p-4 text-center text-muted-foreground">No loan applications found</div>
//                     ) : (
//                       filteredLoans.map((loan) => (
//                         <div key={loan.$id} className="grid grid-cols-3 md:grid-cols-6 p-4 items-center">
//                           <div className="flex items-center gap-2">
//                             <Clock className="h-4 w-4 text-muted-foreground" />
//                             <span>{formatDate(loan.applicationDate)}</span>
//                           </div>
//                           <div className="hidden md:block">
//                             {user?.isAdmin ? usersMap[loan.userId] || 'Unknown User' : loan.purpose}
//                           </div>
//                           <div>
//                             {user?.isAdmin
//                               ? loan.purpose
//                               : loan.amount.toLocaleString('en-US', { style: 'currency', currency: 'UGX' })}
//                           </div>
//                           <div className="hidden md:block">{loan.duration} months</div>
//                           <div>{loan.status}</div>
//                           <div className="text-right">
//                             {user?.isAdmin && (
//                               <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 onClick={() => {
//                                   setCurrentLoan(loan);
//                                   setIsModalOpen(true);
//                                 }}
//                               >
//                                 <ArrowUpRight className="h-4 w-4" />
//                               </Button>
//                             )}
//                           </div>
//                         </div>
//                       ))
//                     )}
//                   </div>
//                 </div>
//               </CardContent>
//               <CardFooter className="flex justify-between">
//                 <Button variant="outline" className="w-full sm:w-auto">
//                   <Download className="mr-2 h-4 w-4" />
//                   Export Data
//                 </Button>
//               </CardFooter>
//             </Card>
//           </TabsContent>

//           <TabsContent value="apply">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Apply for a Loan</CardTitle>
//                 <CardDescription>Fill out the form to apply for a new loan</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <form onSubmit={handleLoanSubmit}>
//                   <div className="grid gap-4">
//                     <div className="grid gap-2">
//                       <Label htmlFor="loanAmount">Loan Amount</Label>
//                       <Input
//                         id="loanAmount"
//                         placeholder="Enter amount"
//                         type="number"
//                         value={amount}
//                         onChange={(e) => setAmount(e.target.value)}
//                       />
//                     </div>
//                     <div className="grid gap-2">
//                       <Label htmlFor="loanPurpose">Loan Purpose</Label>
//                       <Textarea
//                         id="loanPurpose"
//                         placeholder="Describe the purpose of the loan"
//                         value={purpose}
//                         onChange={(e) => setPurpose(e.target.value)}
//                       />
//                     </div>
//                     <div className="grid gap-2">
//                       <Label htmlFor="loanDuration">Loan Duration (months)</Label>
//                       <Select value={duration} onValueChange={setDuration}>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select loan term" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="3">3 months</SelectItem>
//                           <SelectItem value="6">6 months</SelectItem>
//                           <SelectItem value="12">12 months</SelectItem>
//                           <SelectItem value="24">24 months</SelectItem>
//                           <SelectItem value="36">36 months</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     <div className="mt-2 text-sm text-muted-foreground">
//                       <p>Standard interest rate: 10% per annum</p>
//                       <p>Processing time: 2-5 business days</p>
//                     </div>
//                   </div>
//                   <Button className="w-full mt-4" type="submit">
//                     <FileText className="mr-2 h-4 w-4" />
//                     Submit Application
//                   </Button>
//                 </form>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {user?.isAdmin && (
//             <TabsContent value="manage">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Manage Loan Applications</CardTitle>
//                   <CardDescription>Review and update loan application statuses</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <form
//                     onSubmit={(e) => {
//                       e.preventDefault();
//                       handleStatusUpdate(selectedLoanId, newStatus, parseInt(interestRate));
//                     }}
//                   >
//                     <div className="grid gap-4">
//                       <div className="grid gap-2">
//                         <Label htmlFor="loanSelect">Select Loan</Label>
//                         <Select value={selectedLoanId} onValueChange={setSelectedLoanId}>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select a loan application" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {loansData
//                               .filter((loan) => loan.status === 'pending')
//                               .map((loan) => (
//                                 <SelectItem key={loan.$id} value={loan.$id}>
//                                   {usersMap[loan.userId] || 'Unknown User'} - {loan.amount.toLocaleString('en-US', { style: 'currency', currency: 'UGX' })} - {loan.purpose.substring(0, 20)}...
//                                 </SelectItem>
//                               ))}
//                           </SelectContent>
//                         </Select>
//                       </div>
//                       <div className="grid gap-2">
//                         <Label htmlFor="statusSelect">Update Status</Label>
//                         <Select value={newStatus} onValueChange={setNewStatus}>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select new status" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="pending">Pending</SelectItem>
//                             <SelectItem value="approved">Approved</SelectItem>
//                             <SelectItem value="rejected">Rejected</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </div>
//                       {newStatus === 'approved' && (
//                         <div className="grid gap-2">
//                           <Label htmlFor="interestRate">Interest Rate (%)</Label>
//                           <Input
//                             id="interestRate"
//                             placeholder="Enter interest rate"
//                             type="number"
//                             value={interestRate}
//                             onChange={(e) => setInterestRate(e.target.value)}
//                           />
//                         </div>
//                       )}
//                     </div>
//                     <Button className="w-full mt-4" type="submit">
//                       Update Loan Status
//                     </Button>
//                   </form>
//                 </CardContent>
//               </Card>
//             </TabsContent>
//           )}
//         </Tabs>
//       </div>

//       {isModalOpen && currentLoan && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
//             <h2 className="text-lg font-bold mb-4">Update Loan Status</h2>
//             <p className="mb-4">
//               Update the status for <strong>{usersMap[currentLoan.userId] || 'Unknown User'}</strong>'s loan of{' '}
//               <strong>{currentLoan.amount.toLocaleString('en-US', { style: 'currency', currency: 'UGX' })}</strong>.
//             </p>
//             <div className="grid gap-4">
//               <div className="grid gap-2">
//                 <Label htmlFor="statusSelect">Select New Status</Label>
//                 <Select value={newStatus} onValueChange={setNewStatus}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select new status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="pending">Pending</SelectItem>
//                     <SelectItem value="approved">Approved</SelectItem>
//                     <SelectItem value="rejected">Rejected</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               {newStatus === 'approved' && (
//                 <div className="grid gap-2">
//                   <Label htmlFor="interestRate">Interest Rate (%)</Label>
//                   <Input
//                     id="interestRate"
//                     placeholder="Enter interest rate"
//                     type="number"
//                     value={interestRate}
//                     onChange={(e) => setInterestRate(e.target.value)}
//                   />
//                 </div>
//               )}
//             </div>
//             <div className="flex justify-end mt-6">
//               <Button
//                 variant="outline"
//                 className="mr-2"
//                 onClick={() => {
//                   setIsModalOpen(false);
//                   setCurrentLoan(null);
//                 }}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 onClick={() => {
//                   handleStatusUpdate(currentLoan.$id, newStatus, parseInt(interestRate));
//                   setIsModalOpen(false);
//                   setCurrentLoan(null);
//                 }}
//               >
//                 Update Status
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Loans;

//======================================================================================================================================

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { loansService, savingsService, userService } from '@/lib/appwrite';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const Loans = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [duration, setDuration] = useState('12');
  const [maxLoanAmount, setMaxLoanAmount] = useState(0);
  const [repaymentAmount, setRepaymentAmount] = useState(0);
  const [loansData, setLoansData] = useState([]);
  const [usersMap, setUsersMap] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('applications');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLoan, setCurrentLoan] = useState<any>(null);

  // For admin to update loan status
  const [selectedLoanId, setSelectedLoanId] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [interestRate, setInterestRate] = useState('10');

  // Fetch loans and user data
  useEffect(() => {
    const fetchLoansAndUsers = async () => {
      try {
        const loans = user?.isAdmin
          ? await loansService.getAllLoans()
          : await loansService.getUserLoans(user?.$id);
        setLoansData(loans.documents);

        if (user?.isAdmin) {
          const users = await userService.getAllUsers();
          const userMap = users.documents.reduce((map, userDoc) => {
            map[userDoc.userId] = userDoc.name;
            return map;
          }, {} as Record<string, string>);
          setUsersMap(userMap);
        }
      } catch (error) {
        console.error('Error fetching loans or users:', error);
        toast.error('Failed to fetch loans or users. Please try again later.');
      }
    };

    fetchLoansAndUsers();
  }, [user]);

  // Fetch the user's total savings and calculate the max loan amount
  useEffect(() => {
    const fetchMaxLoanAmount = async () => {
      try {
        const totalSavings = await savingsService.getUserTotalSavings(user?.$id || '');
        setMaxLoanAmount(totalSavings * 0.8); // 80% of total savings
      } catch (error) {
        console.error('Error fetching total savings:', error);
        toast.error('Failed to fetch your total savings.');
      }
    };

    if (!user?.isAdmin) {
      fetchMaxLoanAmount();
    }
  }, [user]);

  // Calculate repayment amount whenever amount or duration changes
  useEffect(() => {
    const calculateRepayment = async () => {
      try {
        const repayment = await loansService.calculateRepaymentAmount(
          parseFloat(amount) || 0,
          parseFloat(interestRate) || 10
        );
        setRepaymentAmount(repayment);
      } catch (error) {
        console.error('Error calculating repayment amount:', error);
        toast.error('Failed to calculate repayment amount.');
      }
    };

    calculateRepayment();
  }, [amount, interestRate]);

  const handleLoanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !purpose || !duration) {
      toast.error('Please fill all fields');
      return;
    }

    if (parseFloat(amount) > maxLoanAmount) {
      toast.error(`Loan amount exceeds the limit. You can only borrow up to UGX ${maxLoanAmount.toLocaleString('en-US')}.`);
      return;
    }

    try {
      await loansService.applyForLoan(
        user?.$id || '',
        parseFloat(amount),
        purpose,
        parseInt(duration)
      );

      toast.success('Loan application submitted successfully');
      setAmount('');
      setPurpose('');
      setDuration('12');
      setActiveTab('applications');

      const updatedLoans = await loansService.getUserLoans(user?.$id);
      setLoansData(updatedLoans.documents);
    } catch (error) {
      console.error('Error submitting loan application:', error);
      toast.error('Failed to submit loan application. Please try again.');
    }
  };

  const handleStatusUpdate = async (loanId: string, status: string, interestRate?: number) => {
    try {
      await loansService.updateLoanStatus(
        loanId,
        status as 'approved' | 'rejected',
        status === 'approved' ? interestRate : undefined
      );

      toast.success('Loan status updated successfully');

      const updatedLoans = user?.isAdmin
        ? await loansService.getAllLoans()
        : await loansService.getUserLoans(user?.$id);
      setLoansData(updatedLoans.documents);
    } catch (error) {
      console.error('Error updating loan status:', error);
      toast.error('Failed to update loan status. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredLoans = user?.isAdmin
    ? loansData
    : loansData.filter((loan) => loan.userId === user?.$id);

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

          {/* Loan Applications Tab */}
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
                        <div key={loan.$id} className="grid grid-cols-3 md:grid-cols-6 p-4 items-center">
                          <div className="flex items-center gap-2">
                            <span>{formatDate(loan.applicationDate)}</span>
                          </div>
                          <div className="hidden md:block">
                            {user?.isAdmin ? usersMap[loan.userId] || 'Unknown User' : loan.purpose}
                          </div>
                          <div>
                            {user?.isAdmin
                              ? loan.purpose
                              : loan.amount.toLocaleString('en-US', { style: 'currency', currency: 'UGX' })}
                          </div>
                          <div className="hidden md:block">{loan.duration} months</div>
                          <div>{loan.status}</div>
                          <div className="text-right">
                            {user?.isAdmin && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setCurrentLoan(loan);
                                  setIsModalOpen(true);
                                }}
                              >
                                Manage
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Apply for Loan Tab */}
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
                        placeholder={`Maximum: UGX ${maxLoanAmount.toLocaleString('en-US')}`}
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
                      <p>Standard interest rate: {interestRate}%</p>
                      <p>Total repayment: UGX {repaymentAmount.toLocaleString('en-US')}</p>
                    </div>
                  </div>
                  <Button className="w-full mt-4" type="submit">
                    Submit Application
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manage Loans Tab (Admin Only) */}
          {user?.isAdmin && (
            <TabsContent value="manage">
              <Card>
                <CardHeader>
                  <CardTitle>Manage Loan Applications</CardTitle>
                  <CardDescription>Review and update loan application statuses</CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleStatusUpdate(selectedLoanId, newStatus, parseInt(interestRate));
                    }}
                  >
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="loanSelect">Select Loan</Label>
                        <Select value={selectedLoanId} onValueChange={setSelectedLoanId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a loan application" />
                          </SelectTrigger>
                          <SelectContent>
                            {loansData
                              .filter((loan) => loan.status === 'pending')
                              .map((loan) => (
                                <SelectItem key={loan.$id} value={loan.$id}>
                                  {usersMap[loan.userId] || 'Unknown User'} - {loan.amount.toLocaleString('en-US', { style: 'currency', currency: 'UGX' })} - {loan.purpose.substring(0, 20)}...
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