import { Link } from "react-router-dom";
import {
  Film,
  CalendarDays,
  Eye,
  TrendingUp,
  ArrowRight,
  Clock,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import StatsCard from "@/components/features/StatsCard";
import CalendarGrid from "@/components/features/CalendarGrid";
import PlatformBadge from "@/components/features/PlatformBadge";
import { useVideoStore } from "@/stores/videoStore";
import {
  MOCK_CALENDAR_EVENTS,
  MOCK_ANALYTICS_DATA,
} from "@/constants/mockData";
import { formatNumber, getRelativeTime } from "@/lib/utils";
import heroImg from "@/assets/hero-bg.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.35, ease: "easeOut" },
  }),
};

export default function Dashboard() {
  const videos = useVideoStore((s) => s.videos);

  const published = videos.filter((v) => v.status === "published");
  const scheduled = videos.filter((v) => v.status === "scheduled");
  const processing = videos.filter(
    (v) => v.status === "processing" || v.status === "uploading"
  );
  const ready = videos.filter((v) => v.status === "ready");

  const publishedWithMetrics = published.filter((v) => v.metrics);
  const totalViews = publishedWithMetrics.reduce(
    (sum, v) => sum + (v.metrics?.views ?? 0),
    0
  );
  const avgRetention =
    publishedWithMetrics.length > 0
      ? Math.round(
          publishedWithMetrics.reduce(
            (sum, v) => sum + (v.metrics?.retention ?? 0),
            0
          ) / publishedWithMetrics.length
        )
      : 0;

  const recentPublished = publishedWithMetrics
    .sort(
      (a, b) =>
        new Date(b.publishedAt!).getTime() -
        new Date(a.publishedAt!).getTime()
    )
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Banner */}
      <motion.div
        initial="hidden"
        animate="visible"
        custom={0}
        variants={fadeUp}
        className="relative overflow-hidden rounded-2xl"
      >
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt=""
            className="size-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />
        </div>
        <div className="relative flex items-center justify-between px-8 py-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Welcome back, Creator
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {processing.length > 0
                ? `${processing.length} video${processing.length > 1 ? "s" : ""} processing · `
                : ""}
              {ready.length} ready to publish · {scheduled.length} scheduled
              this week
            </p>
          </div>
          <Link
            to="/upload"
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
          >
            <Sparkles className="size-4" />
            New Video
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: "Videos Processed",
            value: String(published.length + ready.length),
            change: "+4 this week",
            changeType: "up" as const,
            icon: Film,
            accentClass: "text-primary",
          },
          {
            label: "Scheduled Posts",
            value: String(scheduled.length),
            change: "Next: Tomorrow",
            changeType: "neutral" as const,
            icon: CalendarDays,
            accentClass: "text-amber",
          },
          {
            label: "Total Views",
            value: formatNumber(totalViews),
            change: "+28% vs last week",
            changeType: "up" as const,
            icon: Eye,
            accentClass: "text-sky",
          },
          {
            label: "Avg. Retention",
            value: `${avgRetention}%`,
            change: "+3.2% vs last week",
            changeType: "up" as const,
            icon: TrendingUp,
            accentClass: "text-emerald",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial="hidden"
            animate="visible"
            custom={i + 1}
            variants={fadeUp}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Calendar + Sidebar */}
      <div className="grid grid-cols-12 gap-6">
        {/* Calendar */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={5}
          variants={fadeUp}
          className="col-span-8 spotlight-card rounded-xl p-5"
        >
          <CalendarGrid
            events={MOCK_CALENDAR_EVENTS}
            year={2025}
            month={6}
          />
        </motion.div>

        {/* Right sidebar */}
        <div className="col-span-4 flex flex-col gap-5">
          {/* Upcoming */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={6}
            variants={fadeUp}
            className="spotlight-card rounded-xl p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">
                Upcoming Posts
              </h3>
              <Link
                to="/library"
                className="flex items-center gap-1 text-[12px] font-medium text-primary hover:text-primary/80"
              >
                View all <ArrowRight className="size-3" />
              </Link>
            </div>
            <div className="flex flex-col gap-2.5">
              {scheduled.slice(0, 4).map((v) => (
                <Link
                  to={`/editor/${v.id}`}
                  key={v.id}
                  className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-secondary/50"
                >
                  <img
                    src={v.thumbnail}
                    alt={v.title}
                    className="size-10 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-foreground">
                      {v.title}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Clock className="size-2.5" />
                      {v.scheduledAt &&
                        new Date(v.scheduledAt).toLocaleDateString("en", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {v.platforms.map((p) => (
                      <PlatformBadge key={p} platform={p} size="sm" />
                    ))}
                  </div>
                </Link>
              ))}
              {scheduled.length === 0 && (
                <p className="py-4 text-center text-[13px] text-muted-foreground">
                  No upcoming posts. Upload a video to get started.
                </p>
              )}
            </div>
          </motion.div>

          {/* Recent Performance */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={7}
            variants={fadeUp}
            className="spotlight-card rounded-xl p-5"
          >
            <h3 className="mb-4 text-sm font-bold text-foreground">
              Top Performers
            </h3>
            <div className="flex flex-col gap-2.5">
              {recentPublished.slice(0, 4).map((v) => (
                <Link
                  to={`/editor/${v.id}`}
                  key={v.id}
                  className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-secondary/50"
                >
                  <img
                    src={v.thumbnail}
                    alt={v.title}
                    className="size-10 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-foreground">
                      {v.title}
                    </p>
                    <span className="text-[11px] text-muted-foreground">
                      {getRelativeTime(v.publishedAt!)}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[13px] font-bold text-foreground">
                      {formatNumber(v.metrics?.views ?? 0)}
                    </p>
                    <p className="font-mono text-[11px] text-emerald">
                      {v.metrics?.retention ?? 0}%
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
