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
        <button
          type="button"
          className="flex flex-1 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
          onClick={onOpenPlants}
          aria-label="Tanaman"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
            <path
              fill="currentColor"
              d="M5 6.75C5 5.784 5.784 5 6.75 5h10.5A1.75 1.75 0 0 1 19 6.75v.5A1.75 1.75 0 0 1 17.25 9H6.75A1.75 1.75 0 0 1 5 7.25v-.5Zm0 5.5c0-.966.784-1.75 1.75-1.75h10.5A1.75 1.75 0 0 1 19 12.25v.5A1.75 1.75 0 0 1 17.25 14H6.75A1.75 1.75 0 0 1 5 12.75v-.5Zm1.75 3.75A1.75 1.75 0 0 0 5 17.75v.5C5 19.216 5.784 20 6.75 20h10.5A1.75 1.75 0 0 0 19 18.25v-.5A1.75 1.75 0 0 0 17.25 16H6.75Z"
            />
          </svg>
        </button>
        <button
          type="button"
          className="flex flex-1 items-center justify-center text-primary-foreground"
          onClick={onCreatePlant}
          aria-label="Tambah tanaman"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm ring-1 ring-primary/60">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
              <path
                fill="currentColor"
                d="M12 4.75a.75.75 0 0 1 .75.75v5.75H18.5a.75.75 0 0 1 0 1.5h-5.75V18.5a.75.75 0 0 1-1.5 0v-5.75H5.5a.75.75 0 0 1 0-1.5h5.75V5.5A.75.75 0 0 1 12 4.75Z"
              />
            </svg>
          </div>
        </button>
        <button
          type="button"
          className="flex flex-1 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
          onClick={onLogout}
          aria-label="Logout"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
            <path
              fill="currentColor"
              d="M4.75 5A2.75 2.75 0 0 1 7.5 2.25h4a.75.75 0 0 1 0 1.5h-4c-.69 0-1.25.56-1.25 1.25v14c0 .69.56 1.25 1.25 1.25h4a.75.75 0 0 1 0 1.5h-4A2.75 2.75 0 0 1 4.75 19V5Zm9.53.97a.75.75 0 0 0-1.06 1.06L15.69 9.5H9a.75.75 0 0 0 0 1.5h6.69l-2.47 2.47a.75.75 0 1 0 1.06 1.06l3.75-3.75a.75.75 0 0 0 0-1.06l-3.75-3.75Z"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
}
