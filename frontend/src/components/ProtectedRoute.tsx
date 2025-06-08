// components/ProtectedRoute.tsx
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectPath?: string;
}

const ProtectedRoute = ({
  children,
  redirectPath = "/admin/login",
}: ProtectedRouteProps) => {
  if (redirectPath === "/admin/login") {
    const isAuthenticated = !!Cookies.get("adminToken");
    if (!isAuthenticated) {
      return <Navigate to={redirectPath} replace />;
    }
  }
  if (redirectPath === "/login") {
    const isAuthenticated = !!Cookies.get("token");
    if (!isAuthenticated) {
      return <Navigate to={redirectPath} replace />;
    }
  }
  return <>{children}</>;
};

export default ProtectedRoute;
