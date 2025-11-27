import { Link, NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { Logo } from "../logo";

export default function AppHeader({ user, loading, onLogout }) {
  return (
    <header className="w-full">
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-5 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground md:flex">
          {loading ? (
            <div className="flex items-center gap-3">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-20" />
            </div>
          ) : (
            user && (
              <>
                <NavItem to="/dashboard">Dashboard</NavItem>
                <NavItem to="/plants">Tanaman</NavItem>
                <NavItem to="/settings">Pengaturan</NavItem>
              </>
            )
          )}
        </nav>
        <div className="flex flex-1 items-center justify-end gap-3 md:flex-none">
          {loading ? (
            <Skeleton className="h-7 w-24 rounded" />
          ) : (
            user && (
              <>
                <span className="hidden max-w-40 truncate text-[0.7rem] text-muted-foreground sm:inline">
                  {user.email}
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={onLogout}
                >
                  Logout
                </Button>
              </>
            )
          )}
        </div>
      </div>
    </header>
  );
}

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "inline-flex items-center pb-px text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground",
          isActive && "text-foreground"
        )
      }
    >
      {children}
    </NavLink>
  );
}
