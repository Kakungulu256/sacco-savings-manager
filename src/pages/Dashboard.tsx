
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { savingsService, loansService } from '@/lib/appwrite';
import { PieChart, AreaChart, Tooltip, ResponsiveContainer, Pie, XAxis, YAxis, CartesianGrid, Area, Cell } from 'recharts';
import { ArrowUp, ArrowDown, Users, FileText, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [totalSavings, setTotalSavings] = useState(0);
  const [totalLoans, setTotalLoans] = useState(0);
  const [loanApplications, setLoanApplications] = useState([]);
  const [recentSavings, setRecentSavings] = useState([]);
  const [savingsData, setSavingsData] = useState([]);
  const [loanData, setLoanData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (isAdmin) {
          // Admin: Fetch all savings and loans
          const savingsRes = await savingsService.getAllSavings();
          const loansRes = await loansService.getAllLoans();

          const totalSavingsAmount = savingsRes.documents.reduce(
            (total, saving) => total + saving.amount,
            0
          );

          const totalLoansAmount = loansRes.documents
            .filter(loan => loan.status === 'approved')
            .reduce((total, loan) => total + loan.amount, 0);

          const pendingLoans = loansRes.documents.filter(loan => loan.status === 'pending');

          const recent = savingsRes.documents
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5);

          const savingsChartData = savingsRes.documents.reduce((acc, saving) => {
            const month = new Date(saving.date).toLocaleString('default', { month: 'short' });
            const existing = acc.find(item => item.name === month);
            if (existing) {
              existing.amount += saving.amount;
            } else {
              acc.push({ name: month, amount: saving.amount });
            }
            return acc;
          }, []);

          const loanChartData = [
            { name: 'Applied', value: loansRes.documents.length },
            { name: 'Approved', value: loansRes.documents.filter(loan => loan.status === 'approved').length },
            { name: 'Rejected', value: loansRes.documents.filter(loan => loan.status === 'rejected').length },
          ];

          setTotalSavings(totalSavingsAmount);
          setTotalLoans(totalLoansAmount);
          setLoanApplications(pendingLoans);
          setRecentSavings(recent);
          setSavingsData(savingsChartData);
          setLoanData(loanChartData);
        } else {
          // Regular user: Fetch user-specific savings and loans
          const userSavings = await savingsService.getUserSavings(user?.$id || '');
          const userLoans = await loansService.getUserLoans(user?.$id || '');

          const totalUserSavings = userSavings.documents.reduce(
            (total, saving) => total + saving.amount,
            0
          );

          const totalUserLoans = userLoans.documents
            .filter(loan => loan.status === 'approved')
            .reduce((total, loan) => total + loan.amount, 0);

          const pendingUserLoans = userLoans.documents.filter(loan => loan.status === 'pending');

          const recent = userSavings.documents
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5);

          const savingsChartData = userSavings.documents.reduce((acc, saving) => {
            const month = new Date(saving.date).toLocaleString('default', { month: 'short' });
            const existing = acc.find(item => item.name === month);
            if (existing) {
              existing.amount += saving.amount;
            } else {
              acc.push({ name: month, amount: saving.amount });
            }
            return acc;
          }, []);

          const loanChartData = [
            { name: 'Applied', value: userLoans.documents.length },
            { name: 'Approved', value: userLoans.documents.filter(loan => loan.status === 'approved').length },
            { name: 'Rejected', value: userLoans.documents.filter(loan => loan.status === 'rejected').length },
          ];

          setTotalSavings(totalUserSavings);
          setTotalLoans(totalUserLoans);
          setLoanApplications(pendingUserLoans);
          setRecentSavings(recent);
          setSavingsData(savingsChartData);
          setLoanData(loanChartData);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, isAdmin]);

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
        <p className="text-muted-foreground">Welcome back, {user?.name}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Savings</CardTitle>
            <CardDescription>{isAdmin ? 'Across all members' : 'Your current balance'}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-16 flex items-center justify-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              </div>
            ) : (
              <div className="text-3xl font-bold">{formatCurrency(totalSavings)}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Loans</CardTitle>
            <CardDescription>{isAdmin ? 'Total disbursed' : 'Your active loans'}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-16 flex items-center justify-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              </div>
            ) : (
              <div className="text-3xl font-bold">{formatCurrency(totalLoans)}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isAdmin ? 'Pending Applications' : 'Pending Applications'}</CardTitle>
            <CardDescription>{isAdmin ? 'Awaiting approval' : 'Awaiting approval'}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-16 flex items-center justify-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              </div>
            ) : (
              <div className="text-3xl font-bold">{loanApplications.length}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Savings Overview</CardTitle>
            <CardDescription>Monthly savings trend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={savingsData}>
                  <defs>
                    <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area type="monotone" dataKey="amount" stroke="#3b82f6" fill="url(#colorSavings)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Loan Distribution</CardTitle>
            <CardDescription>Status of loan applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={loanData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {loanData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
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
                    <div>
                      <div className="font-medium">{saving.description || 'Deposit'}</div>
                      <div className="text-sm text-muted-foreground">{formatDate(saving.date)}</div>
                    </div>
                    <div className="font-semibold">{formatCurrency(saving.amount)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-52 flex items-center justify-center text-muted-foreground">
                <AlertCircle size={24} />
                <p>No recent savings found</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
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
                    <div>
                      <div className="font-medium">{loan.purpose || 'Loan Application'}</div>
                      <div className="text-sm text-muted-foreground">{formatDate(loan.applicationDate)}</div>
                    </div>
                    <div className="font-semibold">{formatCurrency(loan.amount)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-52 flex items-center justify-center text-muted-foreground">
                <AlertCircle size={24} />
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
