import React, { useState, useEffect } from 'react';
import { expensesService } from '@/lib/appwrite';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const Expenses = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all expenses
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setIsLoading(true);
        const data = await expensesService.getAllExpenses();
        setExpenses(data.documents);
      } catch (error) {
        console.error('Error fetching expenses:', error);
        toast.error('Failed to load expenses.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // Handle form submission to add a new expense
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !description || !category) {
      toast.error('Please fill in all fields.');
      return;
    }

    try {
      await expensesService.createExpense('', parseFloat(amount), description, category);
      toast.success('Expense added successfully!');
      setAmount('');
      setDescription('');
      setCategory('');

      // Refresh the expenses list
      const data = await expensesService.getAllExpenses();
      setExpenses(data.documents);
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Failed to add expense.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-8">
        {/* Add Expense Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter expense amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter expense description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  type="text"
                  placeholder="Enter expense category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Add Expense
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Expenses List */}
        <Card>
          <CardHeader>
            <CardTitle>All Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center">Loading expenses...</p>
            ) : expenses.length === 0 ? (
              <p className="text-center">No expenses recorded yet.</p>
            ) : (
              <div className="rounded-md border">
                <div className="grid grid-cols-4 p-4 bg-muted/50 font-medium">
                  <div>Date</div>
                  <div>Amount</div>
                  <div>Category</div>
                  <div>Description</div>
                </div>
                <div className="divide-y">
                  {expenses.map((expense) => (
                    <div key={expense.$id} className="grid grid-cols-4 p-4">
                      <div>{new Date(expense.date).toLocaleDateString()}</div>
                      <div>UGX {expense.amount.toLocaleString('en-US')}</div>
                      <div>{expense.category}</div>
                      <div>{expense.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Expenses;