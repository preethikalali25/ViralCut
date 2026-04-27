import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/constants/config";
import { Zap, Settings, HelpCircle } from "lucide-react";

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-[220px] flex-col border-r border-border bg-[hsl(240_6%_5%)] py-6">
      <Link to="/" className="mb-10 flex items-center gap-2.5 px-6">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary glow-violet">
          <Zap className="size-4 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight text-foreground">
          ViralCut
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        <span className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
          Main
        </span>
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.path === "/"
              ? pathname === "/"
              : pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-primary/12 text-primary"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "size-[18px] transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              {item.label}
              {isActive && (
                <div className="ml-auto size-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-1 px-3">
        <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground">
          <HelpCircle className="size-[18px]" />
          Help
        </button>
        <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground">
          <Settings className="size-[18px]" />
          Settings
        </button>
      </div>
    </aside>
  );
}
