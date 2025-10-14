export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-card p-8 shadow-2xl border border-border">
        {/* Simple spinning circle */}
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
        {/* Loading text */}
        <p className="text-sm font-medium text-foreground">Loading...</p>
      </div>
    </div>
  );
}
