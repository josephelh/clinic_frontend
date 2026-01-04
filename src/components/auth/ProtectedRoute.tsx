import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "src/store/useAuthStore";

const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;