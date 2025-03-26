
import React, { useState } from 'react';
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

// Mock users data
const MOCK_USERS = [
  { $id: '1', email: 'admin@sacco.com', name: 'Admin User', isAdmin: true, joinDate: '2023-01-15T10:00:00Z', status: 'active' },
  { $id: '2', email: 'user@sacco.com', name: 'Regular User', isAdmin: false, joinDate: '2023-02-20T15:30:00Z', status: 'active' },
  { $id: '3', email: 'john.doe@example.com', name: 'John Doe', isAdmin: false, joinDate: '2023-03-10T11:45:00Z', status: 'active' },
  { $id: '4', email: 'jane.smith@example.com', name: 'Jane Smith', isAdmin: false, joinDate: '2023-04-05T09:15:00Z', status: 'inactive' },
  { $id: '5', email: 'mark.johnson@example.com', name: 'Mark Johnson', isAdmin: false, joinDate: '2023-05-18T14:20:00Z', status: 'active' },
];

const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // For editing user
  const [editingUser, setEditingUser] = useState<null | {
    $id: string;
    email: string;
    name: string;
    isAdmin: boolean;
    status: string;
  }>(null);
  
  // For creating new user
  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    isAdmin: false,
    password: '',
  });

  // Redirect non-admin users
  if (!user?.isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  // Filter and search users
  const filteredUsers = users.filter(u => {
    const matchesSearch = searchTerm === '' || 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || 
      (filterRole === 'admin' && u.isAdmin) || 
      (filterRole === 'user' && !u.isAdmin);
    
    const matchesStatus = filterStatus === 'all' || u.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleCreateUser = () => {
    // Validate inputs
    if (!newUser.email || !newUser.name || !newUser.password) {
      toast.error('Please fill in all fields');
      return;
    }

    // Check if email already exists
    if (users.some(u => u.email === newUser.email)) {
      toast.error('A user with this email already exists');
      return;
    }

    // Create new user
    const createdUser = {
      $id: `${users.length + 1}`,
      email: newUser.email,
      name: newUser.name,
      isAdmin: newUser.isAdmin,
      joinDate: new Date().toISOString(),
      status: 'active'
    };

    setUsers([...users, createdUser]);
    
    // Reset form
    setNewUser({
      email: '',
      name: '',
      isAdmin: false,
      password: '',
    });
    
    toast.success('User created successfully');
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;
    
    // Update user in the list
    const updatedUsers = users.map(u => 
      u.$id === editingUser.$id ? editingUser : u
    );
    
    setUsers(updatedUsers);
    setEditingUser(null);
    toast.success('User updated successfully');
  };

  const handleDeleteUser = (userId: string) => {
    // Don't allow deleting yourself
    if (userId === user?.$id) {
      toast.error('You cannot delete your own account');
      return;
    }

    // Remove user from the list
    const updatedUsers = users.filter(u => u.$id !== userId);
    setUsers(updatedUsers);
    toast.success('User deleted successfully');
  };

  const toggleUserStatus = (userId: string) => {
    // Don't allow deactivating yourself
    if (userId === user?.$id) {
      toast.error('You cannot change your own status');
      return;
    }

    // Update user status
    const updatedUsers = users.map(u => {
      if (u.$id === userId) {
        return {
          ...u,
          status: u.status === 'active' ? 'inactive' : 'active'
        };
      }
      return u;
    });
    
    setUsers(updatedUsers);
    toast.success('User status updated successfully');
  };

  const toggleUserRole = (userId: string) => {
    // Don't allow changing your own role
    if (userId === user?.$id) {
      toast.error('You cannot change your own role');
      return;
    }

    // Update user role
    const updatedUsers = users.map(u => {
      if (u.$id === userId) {
        return {
          ...u,
          isAdmin: !u.isAdmin
        };
      }
      return u;
    });
    
    setUsers(updatedUsers);
    toast.success('User role updated successfully');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
                <Button type="submit" onClick={handleCreateUser}>Create User</Button>
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
                            <div className="text-sm text-muted-foreground flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {user.email}
                            </div>
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
                          <Badge variant="success" className="bg-green-500">Active</Badge>
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
                                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <label htmlFor="edit-email">Email</label>
                                  <Input
                                    id="edit-email"
                                    type="email"
                                    value={editingUser.email}
                                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <label htmlFor="edit-role">Role</label>
                                  <Select
                                    value={editingUser.isAdmin ? 'admin' : 'user'}
                                    onValueChange={(value) => setEditingUser({ ...editingUser, isAdmin: value === 'admin' })}
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
                                    onValueChange={(value) => setEditingUser({ ...editingUser, status: value })}
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
                                <Button type="submit" onClick={handleUpdateUser}>Update User</Button>
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
