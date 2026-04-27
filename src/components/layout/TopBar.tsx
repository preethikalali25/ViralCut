import { Search, Bell, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function TopBar() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md">
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search videos, hooks, audio…"
          className="h-9 w-full rounded-lg border border-border bg-secondary/50 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/upload"
          className="flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white transition-all duration-150 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
        >
          <Plus className="size-4" />
          Upload
        </Link>

        <button
          aria-label="Notifications"
          className="relative flex size-9 items-center justify-center rounded-lg border border-border bg-secondary/50 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Bell className="size-4" />
          <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-amber" />
        </button>

        <div className="ml-1 flex items-center gap-2.5">
          <div className="size-8 overflow-hidden rounded-full bg-gradient-to-br from-primary to-amber">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop"
              alt="User avatar"
              className="size-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
