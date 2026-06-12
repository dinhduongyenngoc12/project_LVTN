import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../../features/auth/pages/LoginPage";
import RegisterPage from "../../features/auth/pages/RegisterPage";
import OTPPage from "../../features/auth/pages/OTPPage";
import DashboardPage from "../../features/main/pages/DashboardPage";
import DevicePage from "../../features/main/pages/DevicePage";
import ThresholdPage from "../../features/main/pages/ThresholdPage";
import StatisticsPage from "../../features/main/pages/StatisticsPage";
import AlertsPage from "../../features/main/pages/AlertsPage";
import UtilitiesPage from "../../features/main/pages/UtilitiesPage";
import PublicRoute from "../../guard/PublicRoute";
import ProtectedRoute from "../../guard/ProtectedRoute";
import OtpGuard from "../../guard/OtpGuard";
import AdminDashboardPage from "../../features/admin/pages/AdminDashboardPage";
import LandingPage from "../../features/public/pages/LandingPage";
import DeviceDetailPage from "../../features/main/pages/DeviceDetailPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },

  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },

  {
    path: "/admin",
    element: (
      <ProtectedRoute requireAdmin>
        <AdminDashboardPage />
      </ProtectedRoute>
    ),
  },

  {
    path: "/devices",
    element: (
      <ProtectedRoute>
        <DevicePage />
      </ProtectedRoute>
    ),
  },

  {
    path: "/thresholds",
    element: (
      <ProtectedRoute>
        <ThresholdPage />
      </ProtectedRoute>
    ),
  },

  {
    path: "/statistics",
    element: (
      <ProtectedRoute>
        <StatisticsPage />
      </ProtectedRoute>
    ),
  },

  {
    path: "/alerts",
    element: (
      <ProtectedRoute>
        <AlertsPage />
      </ProtectedRoute>
    ),
  },

  {
    path: "/utilities",
    element: (
      <ProtectedRoute>
        <UtilitiesPage />
      </ProtectedRoute>
    ),
  },

  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },

  {
    path: "/register",
    element: (
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    ),
  },

  {
    path: "/otp",
    element: (
      <OtpGuard>
        <OTPPage />
      </OtpGuard>
    ),
  },
  {
    path: "/devices/:id",
    element: <DeviceDetailPage />,
  }
]);
