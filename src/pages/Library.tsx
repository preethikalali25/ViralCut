import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import VideoCard from "@/components/features/VideoCard";
import { useVideoStore } from "@/stores/videoStore";
import type { VideoStatus, Platform } from "@/types";

const STATUS_FILTERS: { value: VideoStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "published", label: "Published" },
  { value: "scheduled", label: "Scheduled" },
  { value: "ready", label: "Ready" },
  { value: "processing", label: "Processing" },
];

const PLATFORM_FILTERS: { value: Platform | "all"; label: string }[] = [
  { value: "all", label: "All Platforms" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.3, ease: "easeOut" },
  }),
};

export default function Library() {
  const videos = useVideoStore((s) => s.videos);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<VideoStatus | "all">("all");
  const [platformFilter, setPlatformFilter] = useState<Platform | "all">(
    "all"
  );

  const filtered = useMemo(() => {
    return videos.filter((v) => {
      if (search && !v.title.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (statusFilter !== "all" && v.status !== statusFilter) return false;
      if (platformFilter !== "all" && !v.platforms.includes(platformFilter))
        return false;
      return true;
    });
  }, [videos, search, statusFilter, platformFilter]);

  return (
    <div className="flex flex-col gap-6">
      <motion.div
        initial="hidden"
        animate="visible"
        custom={0}
        variants={fadeUp}
      >
        <h1 className="text-xl font-bold text-foreground">Content Library</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {videos.length} videos · {filtered.length} shown
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial="hidden"
        animate="visible"
        custom={1}
        variants={fadeUp}
        className="flex flex-wrap items-center gap-4"
      >
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search videos…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-lg border border-border bg-secondary/50 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-0.5">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={cn(
                "rounded-md px-3 py-1.5 text-[12px] font-semibold transition-all",
                statusFilter === f.value
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-0.5">
          {PLATFORM_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setPlatformFilter(f.value)}
              className={cn(
                "rounded-md px-3 py-1.5 text-[12px] font-semibold transition-all",
                platformFilter === f.value
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Video Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((video, i) => (
            <motion.div
              key={video.id}
              initial="hidden"
              animate="visible"
              custom={i + 2}
              variants={fadeUp}
            >
              <VideoCard video={video} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center py-24 text-center">
          <SlidersHorizontal className="mb-4 size-10 text-muted-foreground/30" />
          <h3 className="text-base font-bold text-foreground">
            No videos match your filters
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search or filter criteria.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("all");
              setPlatformFilter("all");
            }}
            className="mt-4 rounded-lg bg-primary/10 px-5 py-2 text-sm font-semibold text-primary"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
