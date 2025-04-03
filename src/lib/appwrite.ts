
import { Account, Client, Databases, Storage, ID, Query, Teams } from 'appwrite';

// Initialize the Appwrite client
export const client = new Client();

// Connect to your Appwrite instance
client
  .setEndpoint('http://localhost:8080/v1') // Your Appwrite API Endpoint
  .setProject('67e4218c000380745d4b'); // Your Appwrite project ID

// Export service instances
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const teams = new Teams(client);

// Constants for database and collections
export const DATABASE_ID = 'sacco-database';
export const USERS_COLLECTION_ID = 'users';
export const SAVINGS_COLLECTION_ID = 'savings';
export const LOANS_COLLECTION_ID = 'loans';
export const EXPENSES_COLLECTION_ID = 'expenses';
export const TRANSACTIONS_COLLECTION_ID = 'transactions';

// Authentication service
export const authService = {
  async createAccount(email: string, password: string, name: string) {
    try {
      const response = await account.create(ID.unique(), email, password, name);
      if (response) {
        await databases.createDocument(
          DATABASE_ID,
          USERS_COLLECTION_ID,
          ID.unique(),
          {
            userId: response.$id,
            name,
            email,
            role: 'user',
            createdAt: new Date().toISOString(),
          }
        );
      }
      return response;
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  },

  async login(email: string, password: string) {
    try {
      return await account.createEmailSession(email, password);
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  async logout() {
    try {
      return await account.deleteSession('current');
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      const user = await account.get();
      const userDoc = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.equal('userId', user.$id)]
      );
      if (userDoc.documents.length > 0) {
        return { ...user, role: userDoc.documents[0].role };
      }
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  async isLoggedIn() {
    try {
      const user = await this.getCurrentUser();
      return !!user;
    } catch (error) {
      return false;
    }
  },
};


export const savingsService = {
  
  async createSavings(userId: string, userName: string, amount: number, description: string, date: string) {
    try {
      if (!userId || !amount) {
        throw new Error('Invalid data: userId or amount is missing.');
      }

      // Optional: Verify user exists in the users collection
      const userCheck = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.equal('userId', userId)]
      );
      if (userCheck.documents.length === 0) {
        throw new Error('User not found in the database.');
      }

      return await databases.createDocument(
        DATABASE_ID,
        SAVINGS_COLLECTION_ID,
        ID.unique(),
        {
          userId, // Ensure this is the selected user's ID
          userName: userName || userCheck.documents[0].name, // Use provided name or fetch from user doc
          amount: Number(amount),
          description,
          date,
        }
      );
    } catch (error) {
      console.error('Error creating savings:', error);
      throw error;
    }
  },

  // Get user savings by user ID
  async getUserSavings(userId: string) {
    try {
      if (!userId) {
        throw new Error('Invalid userId: userId is required to fetch savings.');
      }

      const savings = await databases.listDocuments(
        DATABASE_ID,
        SAVINGS_COLLECTION_ID,
        [Query.equal('userId', userId)]
      );

      console.log('Fetched savings for userId:', userId, savings.documents);
      return savings;
    } catch (error) {
      console.error('Error getting user savings:', error);
      throw error;
    }
  },

  async getAllSavings() {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        SAVINGS_COLLECTION_ID,
        [Query.limit(1000)] // Adjust limit as needed
      );
      //console.log('Total savings records:', response.total);
      return response;
    } catch (error) {
      console.error('Error getting all savings:', error);
      throw error;
    }
  },

  async searchSavings(searchTerm: string) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        SAVINGS_COLLECTION_ID,
        [
          // Use OR condition to search by userId or userName
          Query.search('userId', searchTerm), // Assuming userId is searchable
          Query.search('userName', searchTerm), // Assuming userName is searchable
        ]
      );
      console.log('Search results:', response.documents);
      return response;
    } catch (error) {
      console.error('Error searching savings:', error);
      throw error;
    }
  },

  // Get total savings for a user
  async getUserTotalSavings(userId: string) {
    try {
      const savings = await this.getUserSavings(userId);

      console.log('Savings for total calculation:', savings.documents);

      return savings.documents.reduce((total, saving) => {
        console.log('Adding amount:', saving.amount);
        return total + saving.amount;
      }, 0);
    } catch (error) {
      console.error('Error getting user total savings:', error);
      throw error;
    }
  },
};

export const expensesService = {
  async createExpense(userId: string, amount: number, description: string, category: string) {
    try {
      return await databases.createDocument(
        DATABASE_ID,
        EXPENSES_COLLECTION_ID,
        ID.unique(),
        {
          userId,
          amount,
          description,
          category,
          date: new Date().toISOString(),
        }
      );
    } catch (error) {
      console.error('Error creating expense:', error);
      throw error;
    }
  },

  async getAllExpenses() {
    try {
      return await databases.listDocuments(DATABASE_ID, EXPENSES_COLLECTION_ID);
    } catch (error) {
      console.error('Error fetching all expenses:', error);
      throw error;
    }
  },
};

// Loans service
export const loansService = {
  async getUserLoans(userId: string) {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        LOANS_COLLECTION_ID,
        [Query.equal('userId', userId)]
      );
    } catch (error) {
      console.error('Error getting user loans:', error);
      throw error;
    }
  },

  // async applyForLoan(userId: string, amount: number, purpose: string, duration: number) {
  //   try {
  //     return await databases.createDocument(
  //       DATABASE_ID,
  //       LOANS_COLLECTION_ID,
  //       ID.unique(),
  //       {
  //         userId,
  //         amount,
  //         purpose,          
  //         duration,
  //         status: 'pending',
  //         interestRate: 10,
  //         applicationDate: new Date().toISOString(),
  //       }
  //     );
  //   } catch (error) {
  //     console.error('Error applying for loan:', error);
  //     throw error;
  //   }
  // },

  // async applyForLoan(userId: string, amount: number, purpose: string, duration: number) {
  //   try {
  //     if (!userId || !amount || !purpose || !duration) {
  //       throw new Error('Invalid data: userId, amount, purpose, or duration is missing.');
  //     }

  //     // Fetch userName from the users collection
  //     const userCheck = await databases.listDocuments(
  //       DATABASE_ID,
  //       USERS_COLLECTION_ID,
  //       [Query.equal('userId', userId)]
  //     );
  //     if (userCheck.documents.length === 0) {
  //       throw new Error('User not found in the database.');
  //     }
  //     const userName = userCheck.documents[0].name; // Get userName from the user document

  //     // Create the loan document
  //     return await databases.createDocument(
  //       DATABASE_ID,
  //       LOANS_COLLECTION_ID,
  //       ID.unique(),
  //       {
  //         userId, // Ensure this is the selected user's ID
  //         userName, // Include the userName
  //         amount: Number(amount),
  //         purpose,
  //         duration,
  //         status: 'pending',
  //         interestRate: 10,
  //         applicationDate: new Date().toISOString(),
  //       }
  //     );
  //   } catch (error) {
  //     console.error('Error applying for loan:', error);
  //     throw error;
  //   }
  // },

  async applyForLoan(userId: string, amount: number, purpose: string, duration: number) {
    try {
      if (!userId || !amount || !purpose || !duration) {
        throw new Error('Invalid data: userId, amount, purpose, or duration is missing.');
      }

      // Step 1: Fetch the user's total savings
      const totalSavings = await savingsService.getUserTotalSavings(userId);

      // Step 2: Calculate the maximum loan amount (80% of total savings)
      const maxLoanAmount = totalSavings * 0.8;

      // Step 3: Check if the requested loan amount exceeds the cap
      if (amount > maxLoanAmount) {
        throw new Error(
          `Loan amount exceeds the limit. You can only borrow up to UGX ${maxLoanAmount.toLocaleString('en-US')}.`
        );
      }

      // Step 4: Fetch userName from the users collection
      const userCheck = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.equal('userId', userId)]
      );
      if (userCheck.documents.length === 0) {
        throw new Error('User not found in the database.');
      }
      const userName = userCheck.documents[0].name;

      // Step 5: Create the loan document
      return await databases.createDocument(
        DATABASE_ID,
        LOANS_COLLECTION_ID,
        ID.unique(),
        {
          userId,
          userName,
          amount: Number(amount),
          purpose,
          duration,
          status: 'pending',
          interestRate: 10,
          applicationDate: new Date().toISOString(),
        }
      );
    } catch (error) {
      console.error('Error applying for loan:', error);
      throw error;
    }
  },

  async getAllLoans() {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        LOANS_COLLECTION_ID
      );
    } catch (error) {
      console.error('Error getting all loans:', error);
      throw error;
    }
  },

  async updateLoanStatus(loanId: string, status: 'approved' | 'rejected', interestRate?: number) {
    try {
      const data: { status: string; approvalDate?: string; interestRate?: number } = {
        status,
      };
      if (status === 'approved') {
        data.approvalDate = new Date().toISOString();
        if (interestRate) {
          data.interestRate = interestRate;
        }
      }
      return await databases.updateDocument(
        DATABASE_ID,
        LOANS_COLLECTION_ID,
        loanId,
        data
      );
    } catch (error) {
      console.error('Error updating loan status:', error);
      throw error;
    }
  },

  async calculateRepaymentAmount(amount: number, interestRate: number) {
    try {
      const interest = (amount * interestRate) / 100;
      return amount + interest;
    } catch (error) {
      console.error('Error calculating repayment amount:', error);
      throw error;
    }
  },
};

export const balanceSheetService = {
  async getUserBalanceSheet(userId: string) {
    try {
      // Fetch savings
      const savings = await savingsService.getUserSavings(userId);
      const totalSavings = savings.documents.reduce((sum, saving) => sum + saving.amount, 0);

      // Fetch loans
      const loans = await loansService.getUserLoans(userId);
      const totalLoans = loans.documents
        .filter((loan) => loan.status === 'approved')
        .reduce((sum, loan) => sum + loan.amount, 0);

      // Fetch expenses
      const expenses = await databases.listDocuments(DATABASE_ID, EXPENSES_COLLECTION_ID, [
        Query.equal('userId', userId),
      ]);
      const totalExpenses = expenses.documents.reduce((sum, expense) => sum + expense.amount, 0);

      // Deduct subscription fee
      const subscriptionFee = 10000; // UGX 10,000 annual fee
      const netSavings = totalSavings - subscriptionFee;

      return {
        totalSavings,
        totalLoans,
        totalExpenses,
        subscriptionFee,
        netSavings,
      };
    } catch (error) {
      console.error('Error fetching balance sheet:', error);
      throw error;
    }
  },
};

// User management service
export const userService = {
  async getAllUsers() {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID
      );
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  },

async createUser(userData: { email: string; name: string; password: string; isAdmin: boolean }) {
    try {
      // Step 1: Create the user in the authentication system
      const authUser = await account.create(ID.unique(), userData.email, userData.password, userData.name);
  
      // Step 2: Add the user to the database
      return await databases.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        ID.unique(),
        {
          userId: authUser.$id, // Link the auth user ID
          email: userData.email,
          name: userData.name,
          isAdmin: userData.isAdmin,
          joinDate: new Date().toISOString(),
          status: 'active',
        }
      );
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  async updateUser(userId: string, updates: { name?: string; email?: string; isAdmin?: boolean; status?: string }) {
    try {
      const users = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.equal('userId', userId)]
      );
      if (users.documents.length > 0) {
        return await databases.updateDocument(
          DATABASE_ID,
          USERS_COLLECTION_ID,
          users.documents[0].$id,
          updates
        );
      }
      throw new Error('User not found');
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  async deleteUser(userId: string) {
    try {
      const users = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.equal('userId', userId)]
      );
      if (users.documents.length > 0) {
        return await databases.deleteDocument(
          DATABASE_ID,
          USERS_COLLECTION_ID,
          users.documents[0].$id
        );
      }
      throw new Error('User not found');
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  async updateUserRole(userId: string, role: 'admin' | 'user') {
    try {
      const users = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.equal('userId', userId)]
      );
      if (users.documents.length > 0) {
        return await databases.updateDocument(
          DATABASE_ID,
          USERS_COLLECTION_ID,
          users.documents[0].$id,
          { role }
        );
      }
      throw new Error('User not found');
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  },
};

export const booksService = {
  async getBooksOfAccounts() {
    try {
      // Fetch savings
      const savings = await databases.listDocuments(DATABASE_ID, SAVINGS_COLLECTION_ID);
      const totalSavings = savings.documents.reduce((sum, saving) => sum + saving.amount, 0);

      // Fetch loans
      const loans = await databases.listDocuments(DATABASE_ID, LOANS_COLLECTION_ID);
      const totalLoans = loans.documents
        .filter((loan) => loan.status === 'approved')
        .reduce((sum, loan) => sum + loan.amount, 0);

      // Fetch expenses
      const expenses = await databases.listDocuments(DATABASE_ID, EXPENSES_COLLECTION_ID);
      const totalExpenses = expenses.documents.reduce((sum, expense) => sum + expense.amount, 0);

      // Fetch subscriptions
      const subscriptions = await databases.listDocuments(DATABASE_ID, TRANSACTIONS_COLLECTION_ID, [
        Query.equal('type', 'subscription'),
      ]);
      const totalSubscriptions = subscriptions.documents.reduce((sum, sub) => sum + sub.amount, 0);

      return {
        totalSavings,
        totalLoans,
        totalExpenses,
        totalSubscriptions,
      };
    } catch (error) {
      console.error('Error fetching books of accounts:', error);
      throw error;
    }
  },
};

// Reports service
export const reportsService = {
  async generateSavingsReport(userId?: string) {
    try {
      let savings;
      if (userId) {
        savings = await savingsService.getUserSavings(userId);
      } else {
        savings = await savingsService.getAllSavings();
      }
      return {
        title: userId ? 'User Savings Report' : 'All Savings Report',
        date: new Date().toISOString(),
        data: savings.documents.map(saving => ({
          id: saving.$id,
          userId: saving.userId,
          amount: saving.amount,
          description: saving.description,
          date: saving.date,
        })),
        total: savings.documents.reduce((total, saving) => total + saving.amount, 0),
      };
    } catch (error) {
      console.error('Error generating savings report:', error);
      throw error;
    }
  },

  async generateLoansReport(userId?: string, status?: 'pending' | 'approved' | 'rejected') {
    try {
      let loans;
      let queries = [];
      if (userId) {
        queries.push(Query.equal('userId', userId));
      }
      if (status) {
        queries.push(Query.equal('status', status));
      }
      if (queries.length > 0) {
        loans = await databases.listDocuments(
          DATABASE_ID,
          LOANS_COLLECTION_ID,
          queries
        );
      } else {
        loans = await loansService.getAllLoans();
      }
      return {
        title: `Loans Report${userId ? ' for User' : ''}${status ? ` (${status})` : ''}`,
        date: new Date().toISOString(),
        data: loans.documents.map(loan => ({
          id: loan.$id,
          userId: loan.userId,
          amount: loan.amount,
          purpose: loan.purpose,
          duration: loan.duration,
          status: loan.status,
          interestRate: loan.interestRate,
          applicationDate: loan.applicationDate,
          approvalDate: loan.approvalDate,
        })),
        total: loans.documents.reduce((total, loan) => total + loan.amount, 0),
        totalApproved: loans.documents
          .filter(loan => loan.status === 'approved')
          .reduce((total, loan) => total + loan.amount, 0),
      };
    } catch (error) {
      console.error('Error generating loans report:', error);
      throw error;
    }
  },

  async uploadReportToStorage(reportData: any, fileName: string) {
    try {
      const jsonData = JSON.stringify(reportData, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const file = new File([blob], fileName, { type: 'application/json' });
      return await storage.createFile(
        'reports-bucket',
        ID.unique(),
        file
      );
    } catch (error) {
      console.error('Error uploading report to storage:', error);
      throw error;
    }
  },

  async getReportDownloadLink(fileId: string) {
    try {
      return storage.getFileDownload('reports-bucket', fileId);
    } catch (error) {
      console.error('Error getting report download link:', error);
      throw error;
    }
  },
};
