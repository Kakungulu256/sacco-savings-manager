
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, ShieldCheck, CreditCard, Users } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-semibold">
              Sacco App
            </Link>
            <nav className="ml-10 hidden md:flex gap-6">
              <Link to="#features" className="text-sm font-medium transition-colors hover:text-primary">
                Features
              </Link>
              <Link to="#testimonials" className="text-sm font-medium transition-colors hover:text-primary">
                Testimonials
              </Link>
              <Link to="#faq" className="text-sm font-medium transition-colors hover:text-primary">
                FAQ
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium transition-colors hover:text-primary">
              Login
            </Link>
            <Button asChild className="button-hover">
              <Link to="/register">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary/20 -z-10" />
        
        <div className="container flex flex-col items-center justify-center py-24 text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Modern Savings & Credit <br className="hidden md:block" />for Cooperative Organizations
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Empower your financial future with our cutting-edge Sacco platform. Manage savings, apply for loans, and track your financial progress with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="h-12 px-8 button-hover" asChild>
                <Link to="/register">
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 button-hover" asChild>
                <Link to="/login">
                  Sign In
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl w-full animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-bold">5K+</span>
              <span className="text-sm text-muted-foreground mt-1">Active Members</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-bold">$2M+</span>
              <span className="text-sm text-muted-foreground mt-1">Total Savings</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-bold">$1M+</span>
              <span className="text-sm text-muted-foreground mt-1">Loans Disbursed</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-bold">12%</span>
              <span className="text-sm text-muted-foreground mt-1">Average Return</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-card">
        <div className="container">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Sacco Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform provides all the tools you need to manage your Sacco efficiently and securely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass p-6 rounded-xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
                <CreditCard size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Savings Management</h3>
              <p className="text-muted-foreground">
                Track your contributions, view transaction history, and manage your savings goals with real-time updates.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass p-6 rounded-xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="bg-green-100 text-green-600 p-3 rounded-full w-fit mb-4">
                <CheckCircle size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Loan Applications</h3>
              <p className="text-muted-foreground">
                Apply for loans easily, track approval status, and manage repayments all from a single dashboard.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass p-6 rounded-xl animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full w-fit mb-4">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
              <p className="text-muted-foreground">
                Bank-level security ensures your financial data is always protected and encrypted.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="glass p-6 rounded-xl animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="bg-purple-100 text-purple-600 p-3 rounded-full w-fit mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Member Management</h3>
              <p className="text-muted-foreground">
                Administrators can easily manage members, approve loans, and generate reports.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="glass p-6 rounded-xl animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="bg-orange-100 text-orange-600 p-3 rounded-full w-fit mb-4">
                <CreditCard size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Financial Reports</h3>
              <p className="text-muted-foreground">
                Generate detailed reports on savings, loans, and interest for better financial planning.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="glass p-6 rounded-xl animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="bg-red-100 text-red-600 p-3 rounded-full w-fit mb-4">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Mobile Access</h3>
              <p className="text-muted-foreground">
                Access your Sacco account anytime, anywhere with our responsive mobile application.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary/90 to-blue-600/90 text-white">
        <div className="container text-center animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to transform your Sacco experience?</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Join thousands of members who are already benefiting from our platform.
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="h-12 px-8 button-hover"
            asChild
          >
            <Link to="/register">
              Get Started Today
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Sacco App</h3>
              <p className="text-sm text-muted-foreground">
                Modern financial management for Savings and Credit Cooperative Organizations.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Products</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:text-primary">Savings</Link></li>
                <li><Link to="#" className="hover:text-primary">Loans</Link></li>
                <li><Link to="#" className="hover:text-primary">Analytics</Link></li>
                <li><Link to="#" className="hover:text-primary">Reports</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:text-primary">Documentation</Link></li>
                <li><Link to="#" className="hover:text-primary">Guides</Link></li>
                <li><Link to="#" className="hover:text-primary">Support</Link></li>
                <li><Link to="#" className="hover:text-primary">API</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:text-primary">About</Link></li>
                <li><Link to="#" className="hover:text-primary">Blog</Link></li>
                <li><Link to="#" className="hover:text-primary">Careers</Link></li>
                <li><Link to="#" className="hover:text-primary">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Sacco App. All rights reserved.
            </div>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="#" className="text-muted-foreground hover:text-primary">
                Terms
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-primary">
                Privacy
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-primary">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
