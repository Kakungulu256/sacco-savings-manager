
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
                {savingsData.reduce((sum, saving) => sum + saving.amount, 0).toLocaleString('en-US', { style: 'currency', currency: 'UGX' })}
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
                {loansData.filter(loan => loan.status === 'approved').reduce((sum, loan) => sum + loan.amount, 0).toLocaleString('en-US', { style: 'currency', currency: 'UGX' })}
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
                         <Tooltip formatter={(value) => value.toLocaleString('en-US', { style: 'currency', currency: 'UGX' })} />
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
                      <Tooltip formatter={(value) => value.toLocaleString('en-US', { style: 'currency', currency: 'UGX' })} />
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
