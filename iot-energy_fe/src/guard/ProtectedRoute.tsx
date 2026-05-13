import { Navigate } from "react-router-dom";
import { useAuthLoginStore, useOtpData } from "../app/store/useAuthStore";
import { getDefaultRouteByRole, isAdminRole } from "../app/utils/auth";


type ProtectedRouteProps = {
    children: React.ReactNode;
    requireAdmin?: boolean;
};

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
    const { token, role } = useAuthLoginStore();
    const otpEmail = useOtpData((state) => state.email);


    if (!token && !otpEmail) {
        return <Navigate to="/login" replace />;
    }
    
    if (!token && otpEmail) {
        return <Navigate to="/otp" replace />;
    }

    if (requireAdmin && !isAdminRole(role)) {
        return <Navigate to={getDefaultRouteByRole(role)} replace />;
    }

    return <>{children}</>;
}
