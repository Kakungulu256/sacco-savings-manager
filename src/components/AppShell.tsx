
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Home,
  LogOut,
  Menu,
  PieChart,
  Plus,
  Search,
  Settings,
  Users,
  FileText,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Navigation items
  const navItems = [
    {
      label: 'Dashboard',
      icon: <Home size={20} />,
      href: '/dashboard',
      isActive: location.pathname === '/dashboard',
    },
    {
      label: 'Savings',
      icon: <Plus size={20} />,
      href: '/savings',
      isActive: location.pathname.startsWith('/savings'),
    },
    {
      label: 'Loans',
      icon: <FileText size={20} />,
      href: '/loans',
      isActive: location.pathname.startsWith('/loans'),
    },
    {
      label: 'Reports',
      icon: <PieChart size={20} />,
      href: '/reports',
      isActive: location.pathname.startsWith('/reports'),
    },
  ];

  // Admin-only navigation items
  const adminNavItems = [
    {
      label: 'Users',
      icon: <Users size={20} />,
      href: '/users',
      isActive: location.pathname.startsWith('/users'),
    },
    {
      label: 'Settings',
      icon: <Settings size={20} />,
      href: '/settings',
      isActive: location.pathname.startsWith('/settings'),
    },
  ];

  // Combine navigation items based on user role
  const combinedNavItems = isAdmin 
    ? [...navItems, ...adminNavItems] 
    : navItems;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card shadow-lg transform transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <div className="text-xl font-semibold">Sacco App</div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <Menu size={20} />
          </Button>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              {user?.name.charAt(0).toUpperCase() || <User size={18} />}
            </div>
            <div>
              <div className="font-medium">{user?.name}</div>
              <div className="text-xs text-muted-foreground">
                {isAdmin ? 'Administrator' : 'Member'}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-2">
          <ul className="space-y-1">
            {combinedNavItems.map((item) => (
              <li key={item.label}>
                <Button
                  variant={item.isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    item.isActive && "bg-secondary/50"
                  )}
                  onClick={() => navigate(item.href)}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-destructive" 
            onClick={logout}
          >
            <LogOut size={20} className="mr-3" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        sidebarOpen ? "ml-64" : "ml-0"
      )}>
        {/* Top Bar */}
        <header className="h-16 bg-card border-b flex items-center justify-between px-4 sticky top-0 z-10">
          <div className="flex items-center">
            {!sidebarOpen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="mr-2"
              >
                <Menu size={20} />
              </Button>
            )}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-full bg-secondary/50 text-sm focus:outline-none focus:ring-1 focus:ring-primary w-[200px] md:w-[300px]"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Calendar size={20} />
            </Button>
            <Button variant="ghost" size="icon">
              <User size={20} />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppShell;
