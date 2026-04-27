import { Link } from "react-router-dom";
import { Clock, Eye, Heart, MoreVertical } from "lucide-react";
import { cn, formatDuration, formatNumber } from "@/lib/utils";
import { PLATFORM_CONFIG } from "@/constants/config";
import type { Video } from "@/types";
import PlatformBadge from "./PlatformBadge";

interface VideoCardProps {
  video: Video;
  compact?: boolean;
}

const STATUS_STYLES: Record<string, string> = {
  uploading: "bg-sky/15 text-sky",
  processing: "bg-amber/15 text-amber",
  ready: "bg-emerald/15 text-emerald",
  scheduled: "bg-violet-light/15 text-violet-light",
  published: "bg-primary/15 text-primary",
  failed: "bg-rose/15 text-rose",
};

export default function VideoCard({ video, compact }: VideoCardProps) {
  const isEditable =
    video.status === "ready" ||
    video.status === "published" ||
    video.status === "scheduled";

  return (
    <Link
      to={isEditable ? `/editor/${video.id}` : "#"}
      className={cn(
        "spotlight-card group block overflow-hidden rounded-xl transition-all duration-200",
        !isEditable && "pointer-events-none opacity-70"
      )}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        <div className="absolute left-2.5 top-2.5 flex gap-1.5">
          {video.platforms.map((p) => (
            <PlatformBadge key={p} platform={p} size="sm" />
          ))}
        </div>

        <span
          className={cn(
            "absolute right-2.5 top-2.5 rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
            STATUS_STYLES[video.status]
          )}
        >
          {video.status}
        </span>

        <div className="absolute bottom-2.5 left-2.5 right-2.5">
          <div className="flex items-center gap-2 text-[11px] text-white/70">
            <Clock className="size-3" />
            <span className="font-mono">{formatDuration(video.duration)}</span>
          </div>
        </div>

        {video.status === "processing" && video.processingProgress != null && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
            <div
              className="h-full bg-gradient-to-r from-primary to-amber transition-all duration-500"
              style={{ width: `${video.processingProgress}%` }}
            />
          </div>
        )}
      </div>

      {!compact && (
        <div className="p-3.5">
          <h3 className="text-sm font-semibold leading-tight text-foreground line-clamp-2">
            {video.title}
          </h3>

          {video.metrics && (
            <div className="mt-2.5 flex items-center gap-3 text-[12px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="size-3" />
                {formatNumber(video.metrics.views)}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="size-3" />
                {formatNumber(video.metrics.likes)}
              </span>
              <span className="ml-auto font-mono text-emerald">
                {video.metrics.retention}%
              </span>
            </div>
          )}

          {video.hook && (
            <p className="mt-2 truncate text-[12px] italic text-muted-foreground">
              "{video.hook.text}"
            </p>
          )}
        </div>
      )}
    </Link>
  );
}
