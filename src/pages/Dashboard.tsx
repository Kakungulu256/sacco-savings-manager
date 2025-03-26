
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { savingsService, loansService } from '@/lib/appwrite';
import { PieChart, BarChart, AreaChart, Tooltip, ResponsiveContainer, Pie, Bar, XAxis, YAxis, CartesianGrid, Area, Cell } from 'recharts';
import { ArrowUp, ArrowDown, Users, FileText, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [totalSavings, setTotalSavings] = useState(0);
  const [totalLoans, setTotalLoans] = useState(0);
  const [loanApplications, setLoanApplications] = useState([]);
  const [recentSavings, setRecentSavings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch user-specific or admin data based on role
        if (isAdmin) {
          // Admin sees all data
          const savingsRes = await savingsService.getAllSavings();
          const loansRes = await loansService.getAllLoans();
          
          const totalSavingsAmount = savingsRes.documents.reduce(
            (total, saving) => total + saving.amount, 
            0
          );
          
          const totalLoansAmount = loansRes.documents
            .filter(loan => loan.status === 'approved')
            .reduce((total, loan) => total + loan.amount, 0);
            
          const pendingLoans = loansRes.documents
            .filter(loan => loan.status === 'pending')
            .sort((a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime());
          
          // Get recent savings
          const recent = savingsRes.documents
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5);
            
          setTotalSavings(totalSavingsAmount);
          setTotalLoans(totalLoansAmount);
          setLoanApplications(pendingLoans);
          setRecentSavings(recent);
        } else {
          // Regular user sees only their data
          const userSavings = await savingsService.getUserSavings(user?.$id || '');
          const userLoans = await loansService.getUserLoans(user?.$id || '');
          
          const totalUserSavings = userSavings.documents.reduce(
            (total, saving) => total + saving.amount, 
            0
          );
          
          const totalUserLoans = userLoans.documents
            .filter(loan => loan.status === 'approved')
            .reduce((total, loan) => total + loan.amount, 0);
          
          const pendingUserLoans = userLoans.documents
            .filter(loan => loan.status === 'pending');
            
          setTotalSavings(totalUserSavings);
          setTotalLoans(totalUserLoans);
          setLoanApplications(pendingUserLoans);
          setRecentSavings(userSavings.documents
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, isAdmin]);

  // Sample data for charts
  const savingsData = [
    { name: 'Jan', amount: 2000 },
    { name: 'Feb', amount: 3000 },
    { name: 'Mar', amount: 2500 },
    { name: 'Apr', amount: 4500 },
    { name: 'May', amount: 5000 },
    { name: 'Jun', amount: 3500 },
  ];

  const loanData = [
    { name: 'Applied', value: 35 },
    { name: 'Approved', value: 45 },
    { name: 'Rejected', value: 20 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FF8042'];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">{isAdmin ? 'Admin Dashboard' : 'Member Dashboard'}</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center justify-between">
              Total Savings
              <span className="p-2 rounded-full bg-primary/10 text-primary">
                <ArrowUp size={18} />
              </span>
            </CardTitle>
            <CardDescription>
              {isAdmin ? 'Across all members' : 'Your current balance'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-16 flex items-center justify-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              </div>
            ) : (
              <>
                <div className="text-3xl font-bold">{formatCurrency(totalSavings)}</div>
                <div className="text-sm text-green-600 mt-1 flex items-center">
                  <ArrowUp size={14} className="mr-1" />
                  12% from last month
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center justify-between">
              Total Loans
              <span className="p-2 rounded-full bg-destructive/10 text-destructive">
                <ArrowDown size={18} />
              </span>
            </CardTitle>
            <CardDescription>
              {isAdmin ? 'Total disbursed' : 'Your active loans'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-16 flex items-center justify-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              </div>
            ) : (
              <>
                <div className="text-3xl font-bold">{formatCurrency(totalLoans)}</div>
                <div className="text-sm text-red-600 mt-1 flex items-center">
                  <ArrowUp size={14} className="mr-1" />
                  8% from last month
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center justify-between">
              {isAdmin ? 'Total Members' : 'Pending Applications'}
              <span className="p-2 rounded-full bg-blue-100 text-blue-600">
                {isAdmin ? <Users size={18} /> : <FileText size={18} />}
              </span>
            </CardTitle>
            <CardDescription>
              {isAdmin ? 'Active members' : 'Awaiting approval'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-16 flex items-center justify-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              </div>
            ) : (
              <>
                <div className="text-3xl font-bold">{isAdmin ? 120 : loanApplications.length}</div>
                <div className="text-sm text-blue-600 mt-1 flex items-center">
                  <ArrowUp size={14} className="mr-1" />
                  5 new this month
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle>Savings Overview</CardTitle>
            <CardDescription>Monthly savings trend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={savingsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#3b82f6" 
                    fillOpacity={1} 
                    fill="url(#colorSavings)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle>Loan Distribution</CardTitle>
            <CardDescription>Status of loan applications</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={loanData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {loanData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle>Recent Savings</CardTitle>
            <CardDescription>Latest savings transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-52 flex items-center justify-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              </div>
            ) : recentSavings.length > 0 ? (
              <div className="space-y-4">
                {recentSavings.map((saving: any) => (
                  <div key={saving.$id} className="flex items-center justify-between pb-4 border-b">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
                        <ArrowUp size={16} />
                      </div>
                      <div>
                        <div className="font-medium">{saving.description || 'Deposit'}</div>
                        <div className="text-sm text-muted-foreground">{formatDate(saving.date)}</div>
                      </div>
                    </div>
                    <div className="font-semibold text-green-600">{formatCurrency(saving.amount)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-52 flex flex-col items-center justify-center text-muted-foreground">
                <AlertCircle size={24} className="mb-2" />
                <p>No recent savings found</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle>Pending Loan Applications</CardTitle>
            <CardDescription>Loans awaiting approval</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-52 flex items-center justify-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              </div>
            ) : loanApplications.length > 0 ? (
              <div className="space-y-4">
                {loanApplications.map((loan: any) => (
                  <div key={loan.$id} className="flex items-center justify-between pb-4 border-b">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-orange-100 text-orange-600 mr-3">
                        <FileText size={16} />
                      </div>
                      <div>
                        <div className="font-medium">{loan.purpose || 'Loan Application'}</div>
                        <div className="text-sm text-muted-foreground">{formatDate(loan.applicationDate)}</div>
                      </div>
                    </div>
                    <div className="font-semibold">{formatCurrency(loan.amount)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-52 flex flex-col items-center justify-center text-muted-foreground">
                <AlertCircle size={24} className="mb-2" />
                <p>No pending loan applications</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
