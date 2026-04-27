import { cn } from "@/lib/utils";
import { PLATFORM_CONFIG } from "@/constants/config";
import type { Platform } from "@/types";

interface PlatformBadgeProps {
  platform: Platform;
  size?: "sm" | "md";
}

export default function PlatformBadge({
  platform,
  size = "md",
}: PlatformBadgeProps) {
  const config = PLATFORM_CONFIG[platform];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md font-semibold",
        config.bgClass,
        size === "sm" && "px-1.5 py-0.5 text-[10px]",
        size === "md" && "px-2 py-1 text-[11px]"
      )}
    >
      {config.short}
    </span>
  );
}
