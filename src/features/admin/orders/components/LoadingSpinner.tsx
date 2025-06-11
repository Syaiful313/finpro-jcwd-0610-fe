export function LoadingSpinner() {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="flex items-center space-x-2">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
        <span className="text-muted-foreground">Loading order detail...</span>
      </div>
    </div>
  );
}
