import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  icon: LucideIcon;
  accentClass?: string;
}

export default function StatsCard({
  label,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  accentClass = "text-primary",
}: StatsCardProps) {
  return (
    <div className="spotlight-card group rounded-xl p-5 transition-all duration-200">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[13px] font-medium text-muted-foreground">
          {label}
        </span>
        <div
          className={cn(
            "flex size-9 items-center justify-center rounded-lg bg-secondary/80",
            accentClass
          )}
        >
          <Icon className="size-[18px]" />
        </div>
      </div>
      <p className="font-mono text-3xl font-bold tracking-tight text-foreground">
        {value}
      </p>
      {change && (
        <p
          className={cn(
            "mt-1.5 text-[13px] font-medium",
            changeType === "up" && "text-emerald",
            changeType === "down" && "text-rose",
            changeType === "neutral" && "text-muted-foreground"
          )}
        >
          {changeType === "up" && "↑ "}
          {changeType === "down" && "↓ "}
          {change}
        </p>
      )}
    </div>
  );
}
