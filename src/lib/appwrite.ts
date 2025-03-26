
// import { Account, Client, Databases, Storage, ID, Query, Teams } from 'appwrite';

// // Initialize the Appwrite client
// export const client = new Client();

// // Connect to your Appwrite instance
// client
//   .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite API Endpoint
//   .setProject('67d2debd002398872001'); // Your Appwrite project ID

// // Export service instances
// export const account = new Account(client);
// export const databases = new Databases(client);
// export const storage = new Storage(client);
// export const teams = new Teams(client);

// // Constants for database and collections
// export const DATABASE_ID = 'sacco-database';
// export const USERS_COLLECTION_ID = 'users';
// export const SAVINGS_COLLECTION_ID = 'savings';
// export const LOANS_COLLECTION_ID = 'loans';

// // Authentication service
// export const authService = {
//   // Create a new account
//   async createAccount(email: string, password: string, name: string) {
//     try {
//       // Create the user account
//       const response = await account.create(ID.unique(), email, password, name);
      
//       // Create a user record in the database
//       if (response) {
//         await databases.createDocument(
//           DATABASE_ID,
//           USERS_COLLECTION_ID,
//           ID.unique(),
//           {
//             userId: response.$id,
//             name,
//             email,
//             role: 'user',
//             createdAt: new Date().toISOString(),
//           }
//         );
//       }
      
//       return response;
//     } catch (error) {
//       console.error('Error creating account:', error);
//       throw error;
//     }
//   },

//   // Login with email and password
//   async login(email: string, password: string) {
//     try {
//       return await account.createEmailSession(email, password);
//     } catch (error) {
//       console.error('Error logging in:', error);
//       throw error;
//     }
//   },

//   // Logout the current session
//   async logout() {
//     try {
//       return await account.deleteSession('current');
//     } catch (error) {
//       console.error('Error logging out:', error);
//       throw error;
//     }
//   },

//   // Get the current user
//   async getCurrentUser() {
//     try {
//       const user = await account.get();
      
//       // Get the user's role from the database
//       const userDoc = await databases.listDocuments(
//         DATABASE_ID,
//         USERS_COLLECTION_ID,
//         [Query.equal('userId', user.$id)]
//       );
      
//       if (userDoc.documents.length > 0) {
//         return { ...user, role: userDoc.documents[0].role };
//       }
      
//       return user;
//     } catch (error) {
//       console.error('Error getting current user:', error);
//       return null;
//     }
//   },

//   // Check if the user is logged in
//   async isLoggedIn() {
//     try {
//       const user = await this.getCurrentUser();
//       return !!user;
//     } catch (error) {
//       return false;
//     }
//   },
// };

// // Savings service
// export const savingsService = {
//   // Get user savings by user ID
//   async getUserSavings(userId: string) {
//     try {
//       return await databases.listDocuments(
//         DATABASE_ID,
//         SAVINGS_COLLECTION_ID,
//         [Query.equal('userId', userId)]
//       );
//     } catch (error) {
//       console.error('Error getting user savings:', error);
//       throw error;
//     }
//   },

//   // Create a new savings entry
//   async createSavings(userId: string, amount: number, description: string) {
//     try {
//       return await databases.createDocument(
//         DATABASE_ID,
//         SAVINGS_COLLECTION_ID,
//         ID.unique(),
//         {
//           userId,
//           amount,
//           description,
//           date: new Date().toISOString(),
//         }
//       );
//     } catch (error) {
//       console.error('Error creating savings:', error);
//       throw error;
//     }
//   },

//   // Get all savings (admin only)
//   async getAllSavings() {
//     try {
//       return await databases.listDocuments(
//         DATABASE_ID,
//         SAVINGS_COLLECTION_ID
//       );
//     } catch (error) {
//       console.error('Error getting all savings:', error);
//       throw error;
//     }
//   },

//   // Get total savings for a user
//   async getUserTotalSavings(userId: string) {
//     try {
//       const savings = await this.getUserSavings(userId);
//       return savings.documents.reduce((total, saving) => total + saving.amount, 0);
//     } catch (error) {
//       console.error('Error getting user total savings:', error);
//       throw error;
//     }
//   },
// };

// // Loans service
// export const loansService = {
//   // Get user loans by user ID
//   async getUserLoans(userId: string) {
//     try {
//       return await databases.listDocuments(
//         DATABASE_ID,
//         LOANS_COLLECTION_ID,
//         [Query.equal('userId', userId)]
//       );
//     } catch (error) {
//       console.error('Error getting user loans:', error);
//       throw error;
//     }
//   },

//   // Create a new loan application
//   async applyForLoan(userId: string, amount: number, purpose: string, duration: number) {
//     try {
//       return await databases.createDocument(
//         DATABASE_ID,
//         LOANS_COLLECTION_ID,
//         ID.unique(),
//         {
//           userId,
//           amount,
//           purpose,
//           duration,
//           status: 'pending', // pending, approved, rejected
//           interestRate: 10, // default interest rate
//           applicationDate: new Date().toISOString(),
//         }
//       );
//     } catch (error) {
//       console.error('Error applying for loan:', error);
//       throw error;
//     }
//   },

//   // Get all loans (admin only)
//   async getAllLoans() {
//     try {
//       return await databases.listDocuments(
//         DATABASE_ID,
//         LOANS_COLLECTION_ID
//       );
//     } catch (error) {
//       console.error('Error getting all loans:', error);
//       throw error;
//     }
//   },

//   // Update loan status (admin only)
//   async updateLoanStatus(loanId: string, status: 'approved' | 'rejected', interestRate?: number) {
//     try {
//       const data: { status: string; approvalDate?: string; interestRate?: number } = {
//         status,
//       };

//       if (status === 'approved') {
//         data.approvalDate = new Date().toISOString();
//         if (interestRate) {
//           data.interestRate = interestRate;
//         }
//       }

//       return await databases.updateDocument(
//         DATABASE_ID,
//         LOANS_COLLECTION_ID,
//         loanId,
//         data
//       );
//     } catch (error) {
//       console.error('Error updating loan status:', error);
//       throw error;
//     }
//   },
// };

// // User management service (admin only)
// export const userService = {
//   // Get all users
//   async getAllUsers() {
//     try {
//       return await databases.listDocuments(
//         DATABASE_ID,
//         USERS_COLLECTION_ID
//       );
//     } catch (error) {
//       console.error('Error getting all users:', error);
//       throw error;
//     }
//   },

//   // Update user role
//   async updateUserRole(userId: string, role: 'admin' | 'user') {
//     try {
//       // Find the user document by userId
//       const users = await databases.listDocuments(
//         DATABASE_ID,
//         USERS_COLLECTION_ID,
//         [Query.equal('userId', userId)]
//       );

//       if (users.documents.length > 0) {
//         return await databases.updateDocument(
//           DATABASE_ID,
//           USERS_COLLECTION_ID,
//           users.documents[0].$id,
//           { role }
//         );
//       }
      
//       throw new Error('User not found');
//     } catch (error) {
//       console.error('Error updating user role:', error);
//       throw error;
//     }
//   },
// };

// // Reports service
// export const reportsService = {
//   // Generate a savings report
//   async generateSavingsReport(userId?: string) {
//     try {
//       let savings;
      
//       if (userId) {
//         // Get savings for a specific user
//         savings = await savingsService.getUserSavings(userId);
//       } else {
//         // Get all savings (admin only)
//         savings = await savingsService.getAllSavings();
//       }
      
//       // Format report data
//       return {
//         title: userId ? 'User Savings Report' : 'All Savings Report',
//         date: new Date().toISOString(),
//         data: savings.documents.map(saving => ({
//           id: saving.$id,
//           userId: saving.userId,
//           amount: saving.amount,
//           description: saving.description,
//           date: saving.date,
//         })),
//         total: savings.documents.reduce((total, saving) => total + saving.amount, 0),
//       };
//     } catch (error) {
//       console.error('Error generating savings report:', error);
//       throw error;
//     }
//   },

//   // Generate a loans report
//   async generateLoansReport(userId?: string, status?: 'pending' | 'approved' | 'rejected') {
//     try {
//       let loans;
//       let queries = [];
      
//       if (userId) {
//         queries.push(Query.equal('userId', userId));
//       }
      
//       if (status) {
//         queries.push(Query.equal('status', status));
//       }
      
//       if (queries.length > 0) {
//         loans = await databases.listDocuments(
//           DATABASE_ID,
//           LOANS_COLLECTION_ID,
//           queries
//         );
//       } else {
//         loans = await loansService.getAllLoans();
//       }
      
//       // Format report data
//       return {
//         title: `Loans Report${userId ? ' for User' : ''}${status ? ` (${status})` : ''}`,
//         date: new Date().toISOString(),
//         data: loans.documents.map(loan => ({
//           id: loan.$id,
//           userId: loan.userId,
//           amount: loan.amount,
//           purpose: loan.purpose,
//           duration: loan.duration,
//           status: loan.status,
//           interestRate: loan.interestRate,
//           applicationDate: loan.applicationDate,
//           approvalDate: loan.approvalDate,
//         })),
//         total: loans.documents.reduce((total, loan) => total + loan.amount, 0),
//         totalApproved: loans.documents
//           .filter(loan => loan.status === 'approved')
//           .reduce((total, loan) => total + loan.amount, 0),
//       };
//     } catch (error) {
//       console.error('Error generating loans report:', error);
//       throw error;
//     }
//   },

//   // Upload a report to storage
//   async uploadReportToStorage(reportData: any, fileName: string) {
//     try {
//       // Convert report data to JSON
//       const jsonData = JSON.stringify(reportData, null, 2);
      
//       // Create a Blob from the JSON data
//       const blob = new Blob([jsonData], { type: 'application/json' });
      
//       // Create a File from the Blob
//       const file = new File([blob], fileName, { type: 'application/json' });
      
//       // Upload the file to Appwrite storage
//       return await storage.createFile(
//         'reports-bucket', // Your storage bucket ID
//         ID.unique(),
//         file
//       );
//     } catch (error) {
//       console.error('Error uploading report to storage:', error);
//       throw error;
//     }
//   },

//   // Get a download link for a report
//   async getReportDownloadLink(fileId: string) {
//     try {
//       return storage.getFileDownload('reports-bucket', fileId);
//     } catch (error) {
//       console.error('Error getting report download link:', error);
//       throw error;
//     }
//   },
// };

//==============================================================================================================

import { Account, Client, Databases, Storage, ID, Query, Teams } from 'appwrite';

// Initialize the Appwrite client
export const client = new Client();

// Connect to your Appwrite instance
client
  .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite API Endpoint
  .setProject('67d2debd002398872001'); // Your Appwrite project ID

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

// Savings service
export const savingsService = {
  async getUserSavings(userId: string) {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        SAVINGS_COLLECTION_ID,
        [Query.equal('userId', userId)]
      );
    } catch (error) {
      console.error('Error getting user savings:', error);
      throw error;
    }
  },

  async createSavings(userId: string, amount: number, description: string) {
    try {
      return await databases.createDocument(
        DATABASE_ID,
        SAVINGS_COLLECTION_ID,
        ID.unique(),
        {
          userId,
          amount,
          description,
          date: new Date().toISOString(),
        }
      );
    } catch (error) {
      console.error('Error creating savings:', error);
      throw error;
    }
  },

  async getAllSavings() {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        SAVINGS_COLLECTION_ID
      );
    } catch (error) {
      console.error('Error getting all savings:', error);
      throw error;
    }
  },

  async getUserTotalSavings(userId: string) {
    try {
      const savings = await this.getUserSavings(userId);
      return savings.documents.reduce((total, saving) => total + saving.amount, 0);
    } catch (error) {
      console.error('Error getting user total savings:', error);
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

  async applyForLoan(userId: string, amount: number, purpose: string, duration: number) {
    try {
      return await databases.createDocument(
        DATABASE_ID,
        LOANS_COLLECTION_ID,
        ID.unique(),
        {
          userId,
          amount,
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
      return await databases.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        ID.unique(),
        {
          ...userData,
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
