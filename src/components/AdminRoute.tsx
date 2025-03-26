
import ProtectedRoute from './ProtectedRoute';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  return <ProtectedRoute requiresAdmin>{children}</ProtectedRoute>;
};

export default AdminRoute;
