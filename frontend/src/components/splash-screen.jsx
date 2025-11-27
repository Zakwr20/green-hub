export default function SplashScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center gap-4 px-6">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          green-hub
        </span>
        <div className="flex w-40 flex-col gap-2">
          <div className="h-3 rounded bg-muted" />
          <div className="h-3 w-3/4 rounded bg-muted" />
          <div className="h-3 w-1/2 rounded bg-muted" />
        </div>
        <p className="text-xs text-muted-foreground">
          Memuat aplikasi...
        </p>
      </div>
    </div>
  );
}
