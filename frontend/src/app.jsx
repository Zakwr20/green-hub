import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/layout";
import LoginPage from "@/pages/login-page";
import RegisterPage from "@/pages/register-page";
import PlantsPage from "@/pages/plants-page";
import PlantFormPage from "@/pages/plant-form-page";
import PlantDetailPage from "@/pages/plant-detail-page";
import DashboardPage from "@/pages/dashboard-page";
import ProfilePage from "@/pages/profile-page";
import SettingsPage from "@/pages/settings-page";
import PWABadge from "@/pwa-badge.jsx";
import { useAuth } from "@/context/auth-context";
import SplashScreen from "@/components/splash-screen";
import { Toaster } from "@/components/ui/sonner";
import "./index.css";

function PrivateRoute({ children }) {
  const { user, initializing } = useAuth();

  if (initializing) {
    return <SplashScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/plants"
            element={
              <PrivateRoute>
                <PlantsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/plants/new"
            element={
              <PrivateRoute>
                <PlantFormPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/plants/:id"
            element={
              <PrivateRoute>
                <PlantDetailPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/plants/:id/edit"
            element={
              <PrivateRoute>
                <PlantFormPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <SettingsPage />
              </PrivateRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <Toaster />
      <PWABadge />
    </>
  );
}

export default App;
