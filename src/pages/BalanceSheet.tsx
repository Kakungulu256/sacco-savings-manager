import React, { useState, useEffect } from 'react';
import { balanceSheetService } from '@/lib/appwrite';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const BalanceSheet = () => {
  const { user } = useAuth();
  const [balanceSheet, setBalanceSheet] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBalanceSheet = async () => {
      try {
        setIsLoading(true);
        const data = await balanceSheetService.getUserBalanceSheet(user?.$id || '');
        setBalanceSheet(data);
      } catch (error) {
        console.error('Error fetching balance sheet:', error);
        toast.error('Failed to load balance sheet.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalanceSheet();
  }, [user]);

  if (isLoading) {
    return <p className="text-center mt-6">Loading balance sheet...</p>;
  }

  if (!balanceSheet) {
    return <p className="text-center mt-6">No balance sheet data available.</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Balance Sheet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <strong>Total Savings:</strong> UGX {balanceSheet.totalSavings.toLocaleString('en-US')}
            </div>
            <div>
              <strong>Total Loans:</strong> UGX {balanceSheet.totalLoans.toLocaleString('en-US')}
            </div>
            <div>
              <strong>Total Expenses:</strong> UGX {balanceSheet.totalExpenses.toLocaleString('en-US')}
            </div>
            <div>
              <strong>Subscription Fee:</strong> UGX {balanceSheet.subscriptionFee.toLocaleString('en-US')}
            </div>
            <div>
              <strong>Net Savings:</strong> UGX {balanceSheet.netSavings.toLocaleString('en-US')}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BalanceSheet;