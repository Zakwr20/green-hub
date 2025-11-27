import { FiList, FiPlus, FiLogOut } from "react-icons/fi";
import { Button } from "../ui/button";

export default function MobileNav({
  user,
  onOpenPlants,
  onCreatePlant,
  onLogout,
}) {
  if (!user) return null;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border/60 bg-background/95 backdrop-blur md:hidden"
      aria-label="Aplikasi"
    >
      <div className="mx-auto flex max-w-2xl items-center justify-around gap-2 px-4 py-2.5">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="flex-1 justify-center text-muted-foreground hover:text-foreground"
          onClick={onOpenPlants}
          aria-label="Tanaman"
        >
          <FiList className="h-5 w-5" />
        </Button>
        <Button
          type="button"
          size="icon-lg"
          className="flex-1 justify-center"
          onClick={onCreatePlant}
          aria-label="Tambah tanaman"
        >
          <FiPlus className="h-5 w-5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="flex-1 justify-center text-muted-foreground hover:text-foreground"
          onClick={onLogout}
          aria-label="Logout"
        >
          <FiLogOut className="h-5 w-5" />
        </Button>
      </div>
    </nav>
  );
}
