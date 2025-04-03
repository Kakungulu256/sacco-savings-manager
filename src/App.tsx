
// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { AuthProvider } from "@/contexts/AuthContext";
// import ProtectedRoute from "@/components/ProtectedRoute";
// import AdminRoute from "@/components/AdminRoute";

// // Pages
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
// import Savings from "./pages/Savings";
// import Loans from "./pages/Loans";
// import Reports from "./pages/Reports";
// import Users from "./pages/Users";
// import Settings from "./pages/Settings";
// import NotFound from "./pages/NotFound";

// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <TooltipProvider>
//       <Toaster />
//       <Sonner />
//       <BrowserRouter>
//         <AuthProvider>
//           <Routes>
//             {/* Public Routes */}
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
            
//             {/* Protected Routes (available to all authenticated users) */}
//             <Route path="/dashboard" element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             } />
//             <Route path="/savings" element={
//               <ProtectedRoute>
//                 <Savings />
//               </ProtectedRoute>
//             } />
//             <Route path="/loans" element={
//               <ProtectedRoute>
//                 <Loans />
//               </ProtectedRoute>
//             } />
//             <Route path="/reports" element={
//               <ProtectedRoute>
//                 <Reports />
//               </ProtectedRoute>
//             } />
            
//             {/* Admin Only Routes */}
//             <Route path="/users" element={
//               <AdminRoute>
//                 <Users />
//               </AdminRoute>
//             } />
//             <Route path="/settings" element={
//               <AdminRoute>
//                 <Settings />
//               </AdminRoute>
//             } />
            
//             {/* Default Redirects */}
//             <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
//             {/* 404 Route */}
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </AuthProvider>
//       </BrowserRouter>
//     </TooltipProvider>
//   </QueryClientProvider>
// );

// export default App;

// //====================================================================================================

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Savings from "./pages/Savings";
import Loans from "./pages/Loans";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import BalanceSheet from "./pages/BalanceSheet";
import BooksOfAccounts from "./pages/BooksOfAccounts";
import Expenses from "./pages/Expenses";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/savings" element={
              <ProtectedRoute>
                <Savings />
              </ProtectedRoute>
            } />
            <Route path="/loans" element={
              <ProtectedRoute>
                <Loans />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            } />
            <Route path="/balance-sheet" element={
              <ProtectedRoute>
                <BalanceSheet />
              </ProtectedRoute>
            } />

            {/* Admin-Only Routes */}
            <Route path="/users" element={
              <AdminRoute>
                <Users />
              </AdminRoute>
            } />
            <Route path="/settings" element={
              <AdminRoute>
                <Settings />
              </AdminRoute>
            } />
            <Route path="/books-of-accounts" element={
              <AdminRoute>
                <BooksOfAccounts />
              </AdminRoute>
            } />
            <Route path="/expenses" element={
              <AdminRoute>
                <Expenses />
              </AdminRoute>
            } />

            {/* Default Redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
