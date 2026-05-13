import { Navigate } from "react-router-dom";
import HomePage from "../../features/main/pages/HomePage";
import { useAuthLoginStore } from "../store/useAuthStore";
import { isAdminRole } from "../utils/auth";

export default function index_role() {
    const role = useAuthLoginStore((state) => state.role);

    if (isAdminRole(role)) {
        return <Navigate to="/admin" replace />;
    }

    return <HomePage />;
}
