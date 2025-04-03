
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '@/contexts/AuthContext';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { Badge } from '@/components/ui/badge';
// import { Search, UserPlus, Edit2, Trash2, UserCheck, UserX, Mail, UserCog } from 'lucide-react';
// import { toast } from 'sonner';
// import { Navigate } from 'react-router-dom';
// import { userService } from '@/lib/appwrite';

// const Users = () => {
//   const { user } = useAuth();
//   const [users, setUsers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterRole, setFilterRole] = useState('all');
//   const [filterStatus, setFilterStatus] = useState('all');

//   const [editingUser, setEditingUser] = useState(null);
//   const [newUser, setNewUser] = useState({
//     email: '',
//     name: '',
//     isAdmin: false,
//     password: '',
//   });

//   if (!user?.isAdmin) {
//     return <Navigate to="/dashboard" />;
//   }

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await userService.getAllUsers();
//         setUsers(response.documents.map(doc => ({
//           $id: doc.$id,
//           email: doc.email,
//           name: doc.name,
//           isAdmin: doc.isAdmin,
//           joinDate: doc.joinDate,
//           status: doc.status,
//         })));
//       } catch (error) {
//         console.error('Error fetching users:', error);
//         toast.error('Failed to load users');
//       }
//     };

//     fetchUsers();
//   }, []);

//   const filteredUsers = users.filter((u) => {
//     const matchesSearch =
//       searchTerm === '' ||
//       u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       u.email.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesRole =
//       filterRole === 'all' ||
//       (filterRole === 'admin' && u.isAdmin) ||
//       (filterRole === 'user' && !u.isAdmin);

//     const matchesStatus = filterStatus === 'all' || u.status === filterStatus;

//     return matchesSearch && matchesRole && matchesStatus;
//   });

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//     });
//   };

//   // const handleCreateUser = async () => {
//   //   if (!newUser.email || !newUser.name || !newUser.password) {
//   //     toast.error('Please fill in all fields');
//   //     return;
//   //   }

//   //   try {
//   //     const createdUser = await userService.createUser(newUser);
//   //     setUsers([...users, { ...createdUser, joinDate: new Date().toISOString(), status: 'active' }]);
//   //     setNewUser({ email: '', name: '', isAdmin: false, password: '' });
//   //     toast.success('User created successfully');
//   //   } catch (error) {
//   //     console.error('Error creating user:', error);
//   //     toast.error('Failed to create user');
//   //   }
//   // };

//   const handleCreateUser = async () => {
//     if (!newUser.email || !newUser.name || !newUser.password) {
//       toast.error('Please fill in all fields');
//       return;
//     }
  
//     try {
//       // Call the updated userService.createUser method
//       const createdUser = await userService.createUser(newUser);
  
//       // Update the local state with the new user
//       setUsers([
//         ...users,
//         {
//           $id: createdUser.$id,
//           email: createdUser.email,
//           name: createdUser.name,
//           isAdmin: createdUser.isAdmin,
//           joinDate: createdUser.joinDate,
//           status: createdUser.status,
//         },
//       ]);
  
//       // Reset the form
//       setNewUser({ email: '', name: '', isAdmin: false, password: '' });
  
//       toast.success('User created successfully');
//     } catch (error) {
//       console.error('Error creating user:', error);
//       toast.error('Failed to create user');
//     }
//   };

//   const handleUpdateUser = async () => {
//     if (!editingUser) return;

//     try {
//       await userService.updateUser(editingUser.$id, editingUser);
//       setUsers(users.map(u => (u.$id === editingUser.$id ? editingUser : u)));
//       setEditingUser(null);
//       toast.success('User updated successfully');
//     } catch (error) {
//       console.error('Error updating user:', error);
//       toast.error('Failed to update user');
//     }
//   };

//   const handleDeleteUser = async (userId) => {
//     if (userId === user?.$id) {
//       toast.error('You cannot delete your own account');
//       return;
//     }

//     try {
//       await userService.deleteUser(userId);
//       setUsers(users.filter(u => u.$id !== userId));
//       toast.success('User deleted successfully');
//     } catch (error) {
//       console.error('Error deleting user:', error);
//       toast.error('Failed to delete user');
//     }
//   };

//   const toggleUserStatus = async (userId) => {
//     const userToUpdate = users.find(u => u.$id === userId);
//     if (!userToUpdate) return;

//     const updatedStatus = userToUpdate.status === 'active' ? 'inactive' : 'active';

//     try {
//       await userService.updateUser(userId, { status: updatedStatus });
//       setUsers(users.map(u => (u.$id === userId ? { ...u, status: updatedStatus } : u)));
//       toast.success('User status updated successfully');
//     } catch (error) {
//       console.error('Error updating user status:', error);
//       toast.error('Failed to update user status');
//     }
//   };

//   const toggleUserRole = async (userId) => {
//     const userToUpdate = users.find(u => u.$id === userId);
//     if (!userToUpdate) return;

//     const updatedRole = !userToUpdate.isAdmin;

//     try {
//       await userService.updateUser(userId, { isAdmin: updatedRole });
//       setUsers(users.map(u => (u.$id === userId ? { ...u, isAdmin: updatedRole } : u)));
//       toast.success('User role updated successfully');
//     } catch (error) {
//       console.error('Error updating user role:', error);
//       toast.error('Failed to update user role');
//     }
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <div className="flex flex-col space-y-8">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//           <div>
//             <h1 className="text-3xl font-bold mb-2">User Management</h1>
//             <p className="text-muted-foreground">Manage users and their permissions</p>
//           </div>
//           <Dialog>
//             <DialogTrigger asChild>
//               <Button>
//                 <UserPlus className="mr-2 h-4 w-4" />
//                 Create User
//               </Button>
//             </DialogTrigger>
//             <DialogContent>
//               <DialogHeader>
//                 <DialogTitle>Create New User</DialogTitle>
//                 <DialogDescription>
//                   Add a new user to the system. They will receive an email to set up their account.
//                 </DialogDescription>
//               </DialogHeader>
//               <div className="grid gap-4 py-4">
//                 <div className="grid gap-2">
//                   <label htmlFor="name">Full Name</label>
//                   <Input
//                     id="name"
//                     value={newUser.name}
//                     onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
//                   />
//                 </div>
//                 <div className="grid gap-2">
//                   <label htmlFor="email">Email</label>
//                   <Input
//                     id="email"
//                     type="email"
//                     value={newUser.email}
//                     onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
//                   />
//                 </div>
//                 <div className="grid gap-2">
//                   <label htmlFor="password">Initial Password</label>
//                   <Input
//                     id="password"
//                     type="password"
//                     value={newUser.password}
//                     onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
//                   />
//                 </div>
//                 <div className="grid gap-2">
//                   <label htmlFor="role">Role</label>
//                   <Select
//                     value={newUser.isAdmin ? 'admin' : 'user'}
//                     onValueChange={(value) => setNewUser({ ...newUser, isAdmin: value === 'admin' })}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select role" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="user">Regular User</SelectItem>
//                       <SelectItem value="admin">Administrator</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//               <DialogFooter>
//                 <Button type="submit" onClick={handleCreateUser}>
//                   Create User
//                 </Button>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>
//         </div>

//         <Card>
//           <CardHeader>
//             <CardTitle>Users</CardTitle>
//             <CardDescription>View and manage all users in the system</CardDescription>
//             <div className="flex flex-col md:flex-row gap-4 mt-4">
//               <div className="relative flex-1">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//                 <Input
//                   placeholder="Search users..."
//                   className="pl-10"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//               <Select value={filterRole} onValueChange={setFilterRole}>
//                 <SelectTrigger className="w-full md:w-[180px]">
//                   <SelectValue placeholder="Filter by role" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Roles</SelectItem>
//                   <SelectItem value="admin">Administrators</SelectItem>
//                   <SelectItem value="user">Regular Users</SelectItem>
//                 </SelectContent>
//               </Select>
//               <Select value={filterStatus} onValueChange={setFilterStatus}>
//                 <SelectTrigger className="w-full md:w-[180px]">
//                   <SelectValue placeholder="Filter by status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Statuses</SelectItem>
//                   <SelectItem value="active">Active</SelectItem>
//                   <SelectItem value="inactive">Inactive</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="rounded-md border">
//               <div className="grid grid-cols-5 md:grid-cols-6 p-4 bg-muted/50 font-medium">
//                 <div className="col-span-2">User</div>
//                 <div className="hidden md:block">Joined</div>
//                 <div>Role</div>
//                 <div>Status</div>
//                 <div className="text-right">Actions</div>
//               </div>
//               <div className="divide-y">
//                 {filteredUsers.length === 0 ? (
//                   <div className="p-4 text-center text-muted-foreground">No users found</div>
//                 ) : (
//                   filteredUsers.map((user) => (
//                     <div key={user.$id} className="grid grid-cols-5 md:grid-cols-6 p-4 items-center">
//                       <div className="col-span-2">
//                         <div className="flex items-center gap-3">
//                           <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
//                             {user.name.charAt(0).toUpperCase()}
//                           </div>
//                           <div>
//                             <div className="font-medium">{user.name}</div>
//                             <div className="text-sm text-muted-foreground flex items-center">
//                               <Mail className="h-3 w-3 mr-1" />
//                               {user.email}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="hidden md:block text-muted-foreground">
//                         {formatDate(user.joinDate)}
//                       </div>
//                       <div>
//                         {user.isAdmin ? (
//                           <Badge variant="default">Admin</Badge>
//                         ) : (
//                           <Badge variant="outline">User</Badge>
//                         )}
//                       </div>
//                       <div>
//                         {user.status === 'active' ? (
//                           <Badge variant="secondary" className="bg-green-500 text-white">
//                             Active
//                           </Badge>
//                         ) : (
//                           <Badge variant="destructive">Inactive</Badge>
//                         )}
//                       </div>
//                       <div className="flex justify-end gap-2">
//                         <Dialog>
//                           <DialogTrigger asChild>
//                             <Button variant="ghost" size="icon" onClick={() => setEditingUser(user)}>
//                               <Edit2 className="h-4 w-4" />
//                             </Button>
//                           </DialogTrigger>
//                           {editingUser && (
//                             <DialogContent>
//                               <DialogHeader>
//                                 <DialogTitle>Edit User</DialogTitle>
//                                 <DialogDescription>
//                                   Update user information and permissions
//                                 </DialogDescription>
//                               </DialogHeader>
//                               <div className="grid gap-4 py-4">
//                                 <div className="grid gap-2">
//                                   <label htmlFor="edit-name">Full Name</label>
//                                   <Input
//                                     id="edit-name"
//                                     value={editingUser.name}
//                                     onChange={(e) =>
//                                       setEditingUser({ ...editingUser, name: e.target.value })
//                                     }
//                                   />
//                                 </div>
//                                 <div className="grid gap-2">
//                                   <label htmlFor="edit-email">Email</label>
//                                   <Input
//                                     id="edit-email"
//                                     type="email"
//                                     value={editingUser.email}
//                                     onChange={(e) =>
//                                       setEditingUser({ ...editingUser, email: e.target.value })
//                                     }
//                                   />
//                                 </div>
//                                 <div className="grid gap-2">
//                                   <label htmlFor="edit-role">Role</label>
//                                   <Select
//                                     value={editingUser.isAdmin ? 'admin' : 'user'}
//                                     onValueChange={(value) =>
//                                       setEditingUser({ ...editingUser, isAdmin: value === 'admin' })
//                                     }
//                                     disabled={editingUser.$id === user?.$id}
//                                   >
//                                     <SelectTrigger>
//                                       <SelectValue placeholder="Select role" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                       <SelectItem value="user">Regular User</SelectItem>
//                                       <SelectItem value="admin">Administrator</SelectItem>
//                                     </SelectContent>
//                                   </Select>
//                                 </div>
//                                 <div className="grid gap-2">
//                                   <label htmlFor="edit-status">Status</label>
//                                   <Select
//                                     value={editingUser.status}
//                                     onValueChange={(value) =>
//                                       setEditingUser({ ...editingUser, status: value })
//                                     }
//                                     disabled={editingUser.$id === user?.$id}
//                                   >
//                                     <SelectTrigger>
//                                       <SelectValue placeholder="Select status" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                       <SelectItem value="active">Active</SelectItem>
//                                       <SelectItem value="inactive">Inactive</SelectItem>
//                                     </SelectContent>
//                                   </Select>
//                                 </div>
//                               </div>
//                               <DialogFooter>
//                                 <Button type="submit" onClick={handleUpdateUser}>
//                                   Update User
//                                 </Button>
//                               </DialogFooter>
//                             </DialogContent>
//                           )}
//                         </Dialog>
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           onClick={() => toggleUserStatus(user.$id)}
//                           disabled={user.$id === user?.$id}
//                         >
//                           {user.status === 'active' ? (
//                             <UserX className="h-4 w-4 text-destructive" />
//                           ) : (
//                             <UserCheck className="h-4 w-4 text-green-500" />
//                           )}
//                         </Button>
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           onClick={() => toggleUserRole(user.$id)}
//                           disabled={user.$id === user?.$id}
//                         >
//                           <UserCog className="h-4 w-4" />
//                         </Button>
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           onClick={() => handleDeleteUser(user.$id)}
//                           disabled={user.$id === user?.$id}
//                         >
//                           <Trash2 className="h-4 w-4 text-destructive" />
//                         </Button>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           </CardContent>
//           <CardFooter className="flex justify-between">
//             <div className="text-sm text-muted-foreground">
//               Showing {filteredUsers.length} of {users.length} users
//             </div>
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Users;

//=====================================================================================================

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, Edit2, Trash2, UserCheck, UserX, Mail, UserCog } from 'lucide-react';
import { toast } from 'sonner';
import { Navigate } from 'react-router-dom';
import { userService } from '@/lib/appwrite';

const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    isAdmin: false,
    password: '',
  });

  if (!user?.isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userService.getAllUsers();
        setUsers(response.documents.map(doc => ({
          $id: doc.$id,
          email: doc.email,
          name: doc.name,
          isAdmin: doc.isAdmin,
          joinDate: doc.joinDate,
          status: doc.status,
        })));
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users');
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      searchTerm === '' ||
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      filterRole === 'all' ||
      (filterRole === 'admin' && u.isAdmin) ||
      (filterRole === 'user' && !u.isAdmin);

    const matchesStatus = filterStatus === 'all' || u.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.name || !newUser.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const createdUser = await userService.createUser(newUser);

      setUsers([
        ...users,
        {
          $id: createdUser.$id,
          email: createdUser.email,
          name: createdUser.name,
          isAdmin: createdUser.isAdmin,
          joinDate: createdUser.joinDate,
          status: createdUser.status,
        },
      ]);

      setNewUser({ email: '', name: '', isAdmin: false, password: '' });

      toast.success('User created successfully');
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user');
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      await userService.updateUser(editingUser.$id, editingUser);
      setUsers(users.map(u => (u.$id === editingUser.$id ? editingUser : u)));
      setEditingUser(null);
      toast.success('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (userId === user?.$id) {
      toast.error('You cannot delete your own account');
      return;
    }

    try {
      await userService.deleteUser(userId);
      setUsers(users.filter(u => u.$id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const toggleUserStatus = async (userId) => {
    const userToUpdate = users.find(u => u.$id === userId);
    if (!userToUpdate) return;

    const updatedStatus = userToUpdate.status === 'active' ? 'inactive' : 'active';

    try {
      await userService.updateUser(userId, { status: updatedStatus });
      setUsers(users.map(u => (u.$id === userId ? { ...u, status: updatedStatus } : u)));
      toast.success('User status updated successfully');
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const toggleUserRole = async (userId) => {
    const userToUpdate = users.find(u => u.$id === userId);
    if (!userToUpdate) return;

    const updatedRole = !userToUpdate.isAdmin;

    try {
      await userService.updateUser(userId, { isAdmin: updatedRole });
      setUsers(users.map(u => (u.$id === userId ? { ...u, isAdmin: updatedRole } : u)));
      toast.success('User role updated successfully');
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">User Management</h1>
            <p className="text-muted-foreground">Manage users and their permissions</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Create User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Add a new user to the system. They will receive an email to set up their account.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="name">Full Name</label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="email">Email</label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="password">Initial Password</label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="role">Role</label>
                  <Select
                    value={newUser.isAdmin ? 'admin' : 'user'}
                    onValueChange={(value) => setNewUser({ ...newUser, isAdmin: value === 'admin' })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Regular User</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleCreateUser}>
                  Create User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>View and manage all users in the system</CardDescription>
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Administrators</SelectItem>
                  <SelectItem value="user">Regular Users</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-5 md:grid-cols-6 p-4 bg-muted/50 font-medium">
                <div className="col-span-2">User</div>
                <div className="hidden md:block">Joined</div>
                <div>Role</div>
                <div>Status</div>
                <div className="text-right">Actions</div>
              </div>
              <div className="divide-y">
                {filteredUsers.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">No users found</div>
                ) : (
                  filteredUsers.map((user) => (
                    <div key={user.$id} className="grid grid-cols-5 md:grid-cols-6 p-4 items-center">
                      <div className="col-span-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            {/* <div className="text-sm text-muted-foreground flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {user.email}
                            </div> */}
                          </div>
                        </div>
                      </div>
                      <div className="hidden md:block text-muted-foreground">
                        {formatDate(user.joinDate)}
                      </div>
                      <div>
                        {user.isAdmin ? (
                          <Badge variant="default">Admin</Badge>
                        ) : (
                          <Badge variant="outline">User</Badge>
                        )}
                      </div>
                      <div>
                        {user.status === 'active' ? (
                          <Badge variant="secondary" className="bg-green-500 text-white">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="destructive">Inactive</Badge>
                        )}
                      </div>
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setEditingUser(user)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          {editingUser && (
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit User</DialogTitle>
                                <DialogDescription>
                                  Update user information and permissions
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <label htmlFor="edit-name">Full Name</label>
                                  <Input
                                    id="edit-name"
                                    value={editingUser.name}
                                    onChange={(e) =>
                                      setEditingUser({ ...editingUser, name: e.target.value })
                                    }
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <label htmlFor="edit-email">Email</label>
                                  <Input
                                    id="edit-email"
                                    type="email"
                                    value={editingUser.email}
                                    onChange={(e) =>
                                      setEditingUser({ ...editingUser, email: e.target.value })
                                    }
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <label htmlFor="edit-role">Role</label>
                                  <Select
                                    value={editingUser.isAdmin ? 'admin' : 'user'}
                                    onValueChange={(value) =>
                                      setEditingUser({ ...editingUser, isAdmin: value === 'admin' })
                                    }
                                    disabled={editingUser.$id === user?.$id}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="user">Regular User</SelectItem>
                                      <SelectItem value="admin">Administrator</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid gap-2">
                                  <label htmlFor="edit-status">Status</label>
                                  <Select
                                    value={editingUser.status}
                                    onValueChange={(value) =>
                                      setEditingUser({ ...editingUser, status: value })
                                    }
                                    disabled={editingUser.$id === user?.$id}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="active">Active</SelectItem>
                                      <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button type="submit" onClick={handleUpdateUser}>
                                  Update User
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          )}
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleUserStatus(user.$id)}
                          disabled={user.$id === user?.$id}
                        >
                          {user.status === 'active' ? (
                            <UserX className="h-4 w-4 text-destructive" />
                          ) : (
                            <UserCheck className="h-4 w-4 text-green-500" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleUserRole(user.$id)}
                          disabled={user.$id === user?.$id}
                        >
                          <UserCog className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteUser(user.$id)}
                          disabled={user.$id === user?.$id}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {filteredUsers.length} of {users.length} users
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Users;