import { Navigate } from "react-router-dom";
import { useAuthLoginStore } from "../store/useAuthStore";
import { isAdminRole } from "../utils/auth";

export default function IndexRole() {
  const role = useAuthLoginStore((state) => state.role);

  if (isAdminRole(role)) {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}