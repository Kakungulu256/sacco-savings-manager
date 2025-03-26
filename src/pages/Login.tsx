
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Label } from '@/components/ui/label';
// import { LogIn, User, Key } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';

// // Mock user data for testing login
// const MOCK_USERS = [
//   { email: 'admin@sacco.com', password: 'admin123', isAdmin: true },
//   { email: 'user@sacco.com', password: 'user123', isAdmin: false },
// ];

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const { login, isLoading } = useAuth();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!email || !password) {
//       toast({
//         title: "Validation Error",
//         description: "Please fill in all fields",
//         variant: "destructive",
//       });
//       return;
//     }
    
//     // For demo purposes, using mock data
//     const user = MOCK_USERS.find(
//       (user) => user.email === email && user.password === password
//     );
    
//     if (user) {
//       // Use the actual login function from context
//       // In production, this would be replaced with real authentication
//       try {
//         await login(email, password);
        
//         toast({
//           title: "Login Successful",
//           description: "Welcome to Sacco App",
//         });
        
//         navigate('/dashboard');
//       } catch (error) {
//         console.error("Error during login:", error);
//       }
//     } else {
//       toast({
//         title: "Login Failed",
//         description: "Invalid email or password",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-accent/30">
//       <div className="w-full max-w-md animate-fade-in">
//         <Card className="glass border-0 shadow-xl">
//           <CardHeader className="space-y-1 text-center">
//             <div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
//               <User className="h-8 w-8 text-primary" />
//             </div>
//             <CardTitle className="text-3xl font-semibold">Welcome to Sacco</CardTitle>
//             <CardDescription className="text-base">
//               Sign in to access your account
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleLogin} className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="email" className="text-base">Email</Label>
//                 <div className="relative">
//                   <Input
//                     id="email"
//                     type="email"
//                     placeholder="name@example.com"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                     className="h-12 pl-10 text-base input-focus"
//                   />
//                   <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <div className="flex items-center justify-between">
//                   <Label htmlFor="password" className="text-base">Password</Label>
//                   <Link to="/forgot-password" className="text-sm text-primary hover:underline">
//                     Forgot password?
//                   </Link>
//                 </div>
//                 <div className="relative">
//                   <Input
//                     id="password"
//                     type="password"
//                     placeholder="••••••••"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                     className="h-12 pl-10 text-base input-focus"
//                   />
//                   <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
//                 </div>
//               </div>
//               <Button 
//                 type="submit" 
//                 className="w-full h-12 text-base font-medium button-hover mt-4" 
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <span className="flex items-center gap-2">
//                     <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
//                     Signing in...
//                   </span>
//                 ) : (
//                   <span className="flex items-center gap-2">
//                     <LogIn className="h-5 w-5" />
//                     Sign In
//                   </span>
//                 )}
//               </Button>
//             </form>
            
//             <div className="mt-4 pt-2 border-t border-border">
//               <div className="text-sm text-center text-muted-foreground">
//                 <span>Mock Login Credentials:</span>
//                 <div className="mt-2 grid grid-cols-1 gap-1 text-xs">
//                   <div className="bg-muted p-2 rounded">
//                     <div className="font-medium">Admin User</div>
//                     <div>Email: admin@sacco.com</div>
//                     <div>Password: admin123</div>
//                   </div>
//                   <div className="bg-muted p-2 rounded">
//                     <div className="font-medium">Regular User</div>
//                     <div>Email: user@sacco.com</div>
//                     <div>Password: user123</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//           <CardFooter className="flex flex-col space-y-4">
//             <div className="text-sm text-muted-foreground text-center">
//               Don't have an account?{' '}
//               <Link to="/register" className="text-primary hover:underline font-medium">
//                 Create account
//               </Link>
//             </div>
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Login;

//=============================================================================================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { LogIn, User, Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // Use the actual login function from AuthContext
      await login(email, password);

      toast({
        title: "Login Successful",
        description: "Welcome to Sacco App",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error("Error during login:", error);
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-accent/30">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="glass border-0 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
              <User className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-semibold">Welcome to Sacco</CardTitle>
            <CardDescription className="text-base">
              Sign in to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 pl-10 text-base input-focus"
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-base">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 pl-10 text-base input-focus"
                  />
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-medium button-hover mt-4" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="h-5 w-5" />
                    Sign In
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-muted-foreground text-center">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Create account
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
