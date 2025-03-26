
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center animate-fade-in">
        <div className="mb-8">
          <div className="text-7xl font-bold mb-2 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">404</div>
          <h1 className="text-2xl font-semibold mb-2">Page not found</h1>
          <p className="text-muted-foreground mb-6">
            Sorry, we couldn't find the page you're looking for.
          </p>
          <Button className="button-hover" asChild>
            <Link to="/" className="inline-flex items-center">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
        <div className="relative">
          <div className="h-0.5 w-full bg-border absolute top-1/2 left-0"></div>
          <span className="relative px-4 bg-background text-sm text-muted-foreground">
            or try another page
          </span>
        </div>
        <div className="flex justify-center space-x-4 mt-6">
          <Button variant="outline" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/register">Register</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
