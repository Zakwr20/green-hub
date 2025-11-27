import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import AppHeader from "@/components/layout/app-header";
import MobileNav from "@/components/layout/mobile-nav";

export default function Layout() {
  const { user, logout, initializing } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();

    navigate("/login");
  };

  return (
    <div className="min-h-screen font-sans bg-background text-foreground flex flex-col">
      <AppHeader user={user} loading={initializing} onLogout={handleLogout} />
      <main className="flex-1 w-full flex flex-col">
        <Outlet />
      </main>
      <MobileNav
        user={user}
        onOpenPlants={() => navigate("/plants")}
        onCreatePlant={() => navigate("/plants/new")}
        onLogout={handleLogout}
      />
    </div>
  );
}
