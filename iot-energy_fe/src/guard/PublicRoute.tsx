import type React from "react";
import { useAuthLoginStore, useOtpData } from "../app/store/useAuthStore";
import { Navigate } from "react-router-dom";
import { getDefaultRouteByRole } from "../app/utils/auth";

export default function PublicRoute({ children }: { children: React.ReactNode }) {
    const { token, role } = useAuthLoginStore();
    const otpEmail = useOtpData((state) => state.email);

    if (token) {
        return <Navigate to={getDefaultRouteByRole(role)} replace />;
    }

    if (!token && otpEmail) {
        return <Navigate to="/otp" replace />;
    }

    return <>{children}</>;
}
