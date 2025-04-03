import React, { useState, useEffect } from 'react';
import { booksService } from '@/lib/appwrite';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const BooksOfAccounts = () => {
  const [books, setBooks] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        const data = await booksService.getBooksOfAccounts();
        setBooks(data);
      } catch (error) {
        console.error('Error fetching books of accounts:', error);
        toast.error('Failed to load books of accounts.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (isLoading) {
    return <p className="text-center mt-6">Loading books of accounts...</p>;
  }

  if (!books) {
    return <p className="text-center mt-6">No books of accounts data available.</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Books of Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <strong>Total Savings:</strong> UGX {books.totalSavings.toLocaleString('en-US')}
            </div>
            <div>
              <strong>Total Loans:</strong> UGX {books.totalLoans.toLocaleString('en-US')}
            </div>
            <div>
              <strong>Total Expenses:</strong> UGX {books.totalExpenses.toLocaleString('en-US')}
            </div>
            <div>
              <strong>Total Subscriptions:</strong> UGX {books.totalSubscriptions.toLocaleString('en-US')}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BooksOfAccounts;