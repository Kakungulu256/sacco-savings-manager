
// import React, { useState } from 'react';
// import { useAuth } from '@/contexts/AuthContext';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Download, PieChart, BarChart, LineChart } from 'lucide-react';
// import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart as RechartsLineChart, Line } from 'recharts';
// import { toast } from 'sonner';

// // Mock data for reports
// const MOCK_SAVINGS_DATA = [
//   { id: 's1', userId: '2', amount: 5000, description: 'Monthly savings', date: '2023-10-15T10:00:00Z' },
//   { id: 's2', userId: '2', amount: 2500, description: 'Emergency fund', date: '2023-11-01T14:30:00Z' },
//   { id: 's3', userId: '2', amount: 10000, description: 'Investment savings', date: '2023-11-15T09:45:00Z' },
//   { id: 's4', userId: '1', amount: 7500, description: 'Business capital', date: '2023-10-10T11:20:00Z' },
//   { id: 's5', userId: '1', amount: 3500, description: 'Education fund', date: '2023-11-05T16:15:00Z' },
// ];

// const MOCK_LOANS_DATA = [
//   { id: 'l1', userId: '2', amount: 15000, purpose: 'Business expansion', duration: 12, status: 'approved', interestRate: 10, applicationDate: '2023-09-15T10:00:00Z', approvalDate: '2023-09-20T14:30:00Z' },
//   { id: 'l2', userId: '2', amount: 5000, purpose: 'Emergency funds', duration: 6, status: 'pending', interestRate: 10, applicationDate: '2023-11-05T11:20:00Z' },
//   { id: 'l3', userId: '1', amount: 25000, purpose: 'Real estate investment', duration: 24, status: 'approved', interestRate: 12, applicationDate: '2023-08-10T09:15:00Z', approvalDate: '2023-08-15T16:45:00Z' },
//   { id: 'l4', userId: '1', amount: 10000, purpose: 'Education funding', duration: 12, status: 'rejected', interestRate: 10, applicationDate: '2023-10-20T13:40:00Z' },
// ];

// // Month names for x-axis
// const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// // Generate monthly data for timeline charts
// const generateMonthlyData = () => {
//   const currentYear = new Date().getFullYear();
//   return monthNames.map((month, index) => {
//     return {
//       name: month,
//       savings: Math.floor(Math.random() * 15000) + 5000,
//       loans: Math.floor(Math.random() * 20000) + 10000,
//     };
//   });
// };

// // Colors for charts
// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// const Reports = () => {
//   const { user } = useAuth();
//   const [reportType, setReportType] = useState('savings');
//   const [timeRange, setTimeRange] = useState('year');
  
//   // Monthly data for timeline charts
//   const monthlyData = generateMonthlyData();
  
//   // Filter data based on user role
//   const userSavings = user?.isAdmin 
//     ? MOCK_SAVINGS_DATA 
//     : MOCK_SAVINGS_DATA.filter(saving => saving.userId === user?.$id);
    
//   const userLoans = user?.isAdmin 
//     ? MOCK_LOANS_DATA 
//     : MOCK_LOANS_DATA.filter(loan => loan.userId === user?.$id);
  
//   // Generate data for pie charts
//   const savingsDistribution = [
//     { name: 'Monthly', value: userSavings.filter(s => s.description.includes('Monthly')).reduce((sum, s) => sum + s.amount, 0) },
//     { name: 'Emergency', value: userSavings.filter(s => s.description.includes('Emergency')).reduce((sum, s) => sum + s.amount, 0) },
//     { name: 'Investment', value: userSavings.filter(s => s.description.includes('Investment')).reduce((sum, s) => sum + s.amount, 0) },
//     { name: 'Business', value: userSavings.filter(s => s.description.includes('Business')).reduce((sum, s) => sum + s.amount, 0) },
//     { name: 'Education', value: userSavings.filter(s => s.description.includes('Education')).reduce((sum, s) => sum + s.amount, 0) },
//   ].filter(item => item.value > 0);

//   const loanStatusDistribution = [
//     { name: 'Approved', value: userLoans.filter(l => l.status === 'approved').reduce((sum, l) => sum + l.amount, 0) },
//     { name: 'Pending', value: userLoans.filter(l => l.status === 'pending').reduce((sum, l) => sum + l.amount, 0) },
//     { name: 'Rejected', value: userLoans.filter(l => l.status === 'rejected').reduce((sum, l) => sum + l.amount, 0) },
//   ].filter(item => item.value > 0);

//   const handleExportReport = () => {
//     toast.success(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report exported successfully.`);
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <div className="flex flex-col space-y-8">
//         <div>
//           <h1 className="text-3xl font-bold mb-2">Reports</h1>
//           <p className="text-muted-foreground">View and export financial reports</p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//           <Card>
//             <CardHeader className="pb-2">
//               <CardTitle className="text-lg">Total Savings</CardTitle>
//               <CardDescription>Current savings balance</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="text-3xl font-bold">
//                 {userSavings.reduce((sum, saving) => sum + saving.amount, 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
//               </div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader className="pb-2">
//               <CardTitle className="text-lg">Total Loans</CardTitle>
//               <CardDescription>Outstanding loan amount</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="text-3xl font-bold">
//                 {userLoans.filter(loan => loan.status === 'approved').reduce((sum, loan) => sum + loan.amount, 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         <div className="flex flex-col md:flex-row gap-4 mb-6">
//           <div className="w-full md:w-1/2">
//             <Select value={reportType} onValueChange={setReportType}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select report type" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="savings">Savings Report</SelectItem>
//                 <SelectItem value="loans">Loans Report</SelectItem>
//                 <SelectItem value="combined">Combined Financial Report</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <div className="w-full md:w-1/2">
//             <Select value={timeRange} onValueChange={setTimeRange}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select time range" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="month">Last Month</SelectItem>
//                 <SelectItem value="quarter">Last Quarter</SelectItem>
//                 <SelectItem value="year">Last Year</SelectItem>
//                 <SelectItem value="all">All Time</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         <Tabs defaultValue="summary" className="w-full">
//           <TabsList className="mb-4">
//             <TabsTrigger value="summary">Summary</TabsTrigger>
//             <TabsTrigger value="charts">Charts</TabsTrigger>
//             <TabsTrigger value="timeline">Timeline</TabsTrigger>
//           </TabsList>

//           <TabsContent value="summary">
//             <Card>
//               <CardHeader>
//                 <CardTitle>{reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report Summary</CardTitle>
//                 <CardDescription>Overview of your financial data</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {reportType === 'savings' && (
//                   <div className="space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <h3 className="text-lg font-medium mb-2">Savings Statistics</h3>
//                         <div className="space-y-2">
//                           <div className="flex justify-between">
//                             <span>Total Savings:</span>
//                             <span className="font-medium">{userSavings.reduce((sum, saving) => sum + saving.amount, 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span>Number of Deposits:</span>
//                             <span className="font-medium">{userSavings.length}</span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span>Average Deposit:</span>
//                             <span className="font-medium">
//                               {(userSavings.reduce((sum, saving) => sum + saving.amount, 0) / (userSavings.length || 1)).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="h-64">
//                         <h3 className="text-lg font-medium mb-2">Savings Distribution</h3>
//                         <ResponsiveContainer width="100%" height="100%">
//                           <RechartsPieChart>
//                             <Pie
//                               data={savingsDistribution}
//                               cx="50%"
//                               cy="50%"
//                               labelLine={false}
//                               outerRadius={80}
//                               fill="#8884d8"
//                               dataKey="value"
//                               label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                             >
//                               {savingsDistribution.map((entry, index) => (
//                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                               ))}
//                             </Pie>
//                             <Tooltip formatter={(value) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} />
//                           </RechartsPieChart>
//                         </ResponsiveContainer>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {reportType === 'loans' && (
//                   <div className="space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <h3 className="text-lg font-medium mb-2">Loan Statistics</h3>
//                         <div className="space-y-2">
//                           <div className="flex justify-between">
//                             <span>Total Loans (Approved):</span>
//                             <span className="font-medium">
//                               {userLoans.filter(loan => loan.status === 'approved').reduce((sum, loan) => sum + loan.amount, 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
//                             </span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span>Number of Loan Applications:</span>
//                             <span className="font-medium">{userLoans.length}</span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span>Approval Rate:</span>
//                             <span className="font-medium">
//                               {(userLoans.filter(loan => loan.status === 'approved').length / (userLoans.length || 1) * 100).toFixed(1)}%
//                             </span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span>Average Loan Amount:</span>
//                             <span className="font-medium">
//                               {(userLoans.reduce((sum, loan) => sum + loan.amount, 0) / (userLoans.length || 1)).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="h-64">
//                         <h3 className="text-lg font-medium mb-2">Loan Status Distribution</h3>
//                         <ResponsiveContainer width="100%" height="100%">
//                           <RechartsPieChart>
//                             <Pie
//                               data={loanStatusDistribution}
//                               cx="50%"
//                               cy="50%"
//                               labelLine={false}
//                               outerRadius={80}
//                               fill="#8884d8"
//                               dataKey="value"
//                               label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                             >
//                               {loanStatusDistribution.map((entry, index) => (
//                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                               ))}
//                             </Pie>
//                             <Tooltip formatter={(value) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} />
//                           </RechartsPieChart>
//                         </ResponsiveContainer>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {reportType === 'combined' && (
//                   <div className="space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <h3 className="text-lg font-medium mb-2">Financial Overview</h3>
//                         <div className="space-y-2">
//                           <div className="flex justify-between">
//                             <span>Total Savings:</span>
//                             <span className="font-medium">
//                               {userSavings.reduce((sum, saving) => sum + saving.amount, 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
//                             </span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span>Total Loans (Approved):</span>
//                             <span className="font-medium">
//                               {userLoans.filter(loan => loan.status === 'approved').reduce((sum, loan) => sum + loan.amount, 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
//                             </span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span>Net Financial Position:</span>
//                             <span className="font-medium">
//                               {(userSavings.reduce((sum, saving) => sum + saving.amount, 0) - 
//                                 userLoans.filter(loan => loan.status === 'approved').reduce((sum, loan) => sum + loan.amount, 0)
//                               ).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="h-64">
//                         <h3 className="text-lg font-medium mb-2">Savings vs Loans</h3>
//                         <ResponsiveContainer width="100%" height="100%">
//                           <RechartsBarChart data={[
//                             { name: 'Financial Position', 
//                               savings: userSavings.reduce((sum, saving) => sum + saving.amount, 0),
//                               loans: userLoans.filter(loan => loan.status === 'approved').reduce((sum, loan) => sum + loan.amount, 0)
//                             }
//                           ]}>
//                             <CartesianGrid strokeDasharray="3 3" />
//                             <XAxis dataKey="name" />
//                             <YAxis />
//                             <Tooltip formatter={(value) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} />
//                             <Legend />
//                             <Bar dataKey="savings" fill="#0088FE" name="Total Savings" />
//                             <Bar dataKey="loans" fill="#FF8042" name="Total Loans" />
//                           </RechartsBarChart>
//                         </ResponsiveContainer>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//               <CardFooter>
//                 <Button onClick={handleExportReport}>
//                   <Download className="mr-2 h-4 w-4" />
//                   Export Report
//                 </Button>
//               </CardFooter>
//             </Card>
//           </TabsContent>

//           <TabsContent value="charts">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Financial Charts</CardTitle>
//                 <CardDescription>Visual representation of your financial data</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                   <div className="h-80">
//                     <h3 className="text-lg font-medium mb-4 text-center">Savings Distribution</h3>
//                     <ResponsiveContainer width="100%" height="90%">
//                       <RechartsPieChart>
//                         <Pie
//                           data={savingsDistribution}
//                           cx="50%"
//                           cy="50%"
//                           labelLine={false}
//                           outerRadius={100}
//                           fill="#8884d8"
//                           dataKey="value"
//                           label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                         >
//                           {savingsDistribution.map((entry, index) => (
//                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                           ))}
//                         </Pie>
//                         <Tooltip formatter={(value) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} />
//                       </RechartsPieChart>
//                     </ResponsiveContainer>
//                   </div>
                  
//                   <div className="h-80">
//                     <h3 className="text-lg font-medium mb-4 text-center">Loan Status</h3>
//                     <ResponsiveContainer width="100%" height="90%">
//                       <RechartsBarChart data={[
//                         { name: 'Approved', value: userLoans.filter(l => l.status === 'approved').length },
//                         { name: 'Pending', value: userLoans.filter(l => l.status === 'pending').length },
//                         { name: 'Rejected', value: userLoans.filter(l => l.status === 'rejected').length },
//                       ]}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="name" />
//                         <YAxis />
//                         <Tooltip />
//                         <Bar dataKey="value" fill="#8884d8" name="Number of Loans">
//                           {[
//                             <Cell key="approved" fill="#00C49F" />,
//                             <Cell key="pending" fill="#FFBB28" />,
//                             <Cell key="rejected" fill="#FF8042" />
//                           ]}
//                         </Bar>
//                       </RechartsBarChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="timeline">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Financial Timeline</CardTitle>
//                 <CardDescription>Financial trends over time</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="h-80">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <RechartsLineChart data={monthlyData}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="name" />
//                       <YAxis />
//                       <Tooltip formatter={(value) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} />
//                       <Legend />
//                       <Line type="monotone" dataKey="savings" stroke="#0088FE" name="Savings" activeDot={{ r: 8 }} />
//                       <Line type="monotone" dataKey="loans" stroke="#FF8042" name="Loans" />
//                     </RechartsLineChart>
//                   </ResponsiveContainer>
//                 </div>
//               </CardContent>
//               <CardFooter>
//                 <Button onClick={handleExportReport}>
//                   <Download className="mr-2 h-4 w-4" />
//                   Export Timeline Data
//                 </Button>
//               </CardFooter>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// };

// export default Reports;

//============================================================================================================================================

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, PieChart, BarChart, LineChart } from 'lucide-react';
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart as RechartsLineChart, Line } from 'recharts';
import { toast } from 'sonner';
import { reportsService } from '@/lib/appwrite'; // Import reportsService for Appwrite integration

// Month names for x-axis
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Reports = () => {
  const { user } = useAuth();
  const [reportType, setReportType] = useState('savings');
  const [timeRange, setTimeRange] = useState('year');
  const [savingsData, setSavingsData] = useState([]);
  const [loansData, setLoansData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  // Fetch data from Appwrite
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const savingsReport = await reportsService.generateSavingsReport(user?.isAdmin ? undefined : user?.$id);
        const loansReport = await reportsService.generateLoansReport(user?.isAdmin ? undefined : user?.$id);

        setSavingsData(savingsReport.data);
        setLoansData(loansReport.data);

        // Generate monthly data for timeline charts
        const generatedMonthlyData = monthNames.map((month, index) => {
          const savingsForMonth = savingsReport.data
            .filter((saving) => new Date(saving.date).getMonth() === index)
            .reduce((sum, saving) => sum + saving.amount, 0);

          const loansForMonth = loansReport.data
            .filter((loan) => new Date(loan.applicationDate).getMonth() === index)
            .reduce((sum, loan) => sum + loan.amount, 0);

          return {
            name: month,
            savings: savingsForMonth,
            loans: loansForMonth,
          };
        });

        setMonthlyData(generatedMonthlyData);
      } catch (error) {
        console.error('Error fetching reports:', error);
        toast.error('Failed to fetch reports. Please try again later.');
      }
    };

    fetchReports();
  }, [user]);

  // Generate data for pie charts
  const savingsDistribution = [
    { name: 'Monthly', value: savingsData.filter(s => s.description.includes('Monthly')).reduce((sum, s) => sum + s.amount, 0) },
    { name: 'Emergency', value: savingsData.filter(s => s.description.includes('Emergency')).reduce((sum, s) => sum + s.amount, 0) },
    { name: 'Investment', value: savingsData.filter(s => s.description.includes('Investment')).reduce((sum, s) => sum + s.amount, 0) },
    { name: 'Business', value: savingsData.filter(s => s.description.includes('Business')).reduce((sum, s) => sum + s.amount, 0) },
    { name: 'Education', value: savingsData.filter(s => s.description.includes('Education')).reduce((sum, s) => sum + s.amount, 0) },
  ].filter(item => item.value > 0);

  const loanStatusDistribution = [
    { name: 'Approved', value: loansData.filter(l => l.status === 'approved').reduce((sum, l) => sum + l.amount, 0) },
    { name: 'Pending', value: loansData.filter(l => l.status === 'pending').reduce((sum, l) => sum + l.amount, 0) },
    { name: 'Rejected', value: loansData.filter(l => l.status === 'rejected').reduce((sum, l) => sum + l.amount, 0) },
  ].filter(item => item.value > 0);

  const handleExportReport = () => {
    toast.success(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report exported successfully.`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Reports</h1>
          <p className="text-muted-foreground">View and export financial reports</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Savings</CardTitle>
              <CardDescription>Current savings balance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {savingsData.reduce((sum, saving) => sum + saving.amount, 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Loans</CardTitle>
              <CardDescription>Outstanding loan amount</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {loansData.filter(loan => loan.status === 'approved').reduce((sum, loan) => sum + loan.amount, 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Summary, Charts, and Timeline */}
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <Card>
              <CardHeader>
                <CardTitle>{reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report Summary</CardTitle>
                <CardDescription>Overview of your financial data</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Render summary based on reportType */}
              </CardContent>
              <CardFooter>
                <Button onClick={handleExportReport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="charts">
            <Card>
              <CardHeader>
                <CardTitle>Financial Charts</CardTitle>
                <CardDescription>Visual representation of your financial data</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Render charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="h-80">
                     <h3 className="text-lg font-medium mb-4 text-center">Savings Distribution</h3>
                     <ResponsiveContainer width="100%" height="90%">
                       <RechartsPieChart>
                         <Pie
                           data={savingsDistribution}
                           cx="50%"
                           cy="50%"
                           labelLine={false}
                           outerRadius={100}
                           fill="#8884d8"
                           dataKey="value"
                           label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                         >
                           {savingsDistribution.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                           ))}
                         </Pie>
                         <Tooltip formatter={(value) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} />
                       </RechartsPieChart>
                     </ResponsiveContainer>
                   </div>
                  
                   <div className="h-80">
                     <h3 className="text-lg font-medium mb-4 text-center">Loan Status</h3>
                     <ResponsiveContainer width="100%" height="90%">
                      <RechartsBarChart data={[
                        { name: 'Approved', value: loansData.filter(l => l.status === 'approved').length },
                        { name: 'Pending', value: loansData.filter(l => l.status === 'pending').length },
                        { name: 'Rejected', value: loansData.filter(l => l.status === 'rejected').length },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" name="Number of Loans">
                          {[
                            <Cell key="approved" fill="#00C49F" />,
                            <Cell key="pending" fill="#FFBB28" />,
                            <Cell key="rejected" fill="#FF8042" />
                          ]}
                        </Bar>
                      </RechartsBarChart>
                    </ResponsiveContainer>
                   </div>
                 </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle>Financial Timeline</CardTitle>
                <CardDescription>Financial trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} />
                      <Legend />
                      <Line type="monotone" dataKey="savings" stroke="#0088FE" name="Savings" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="loans" stroke="#FF8042" name="Loans" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleExportReport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Timeline Data
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reports;
