import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Eye,
  Heart,
  Share2,
  Clock,
  TrendingUp,
  Zap,
  BarChart3,
} from "lucide-react";
import StatsCard from "@/components/features/StatsCard";
import PerformanceChart from "@/components/features/PerformanceChart";
import PlatformBadge from "@/components/features/PlatformBadge";
import { useVideoStore } from "@/stores/videoStore";
import {
  MOCK_ANALYTICS_DATA,
  MOCK_PLATFORM_STATS,
} from "@/constants/mockData";
import { HOOK_TYPE_CONFIG, PLATFORM_CONFIG } from "@/constants/config";
import { formatNumber } from "@/lib/utils";
import type { Platform } from "@/types";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.3, ease: "easeOut" },
  }),
};

export default function Analytics() {
  const videos = useVideoStore((s) => s.videos);

  const published = videos.filter((v) => v.status === "published");

  const totals = useMemo(() => {
    let views = 0,
      likes = 0,
      shares = 0,
      watchTime = 0;
    published.forEach((v) => {
      if (v.metrics) {
        views += v.metrics.views;
        likes += v.metrics.likes;
        shares += v.metrics.shares;
        watchTime += v.metrics.watchTime;
      }
    });
    const avgWatch =
      published.length > 0 ? Math.round(watchTime / published.length) : 0;
    return { views, likes, shares, avgWatch };
  }, [published]);

  const hookPerformance = useMemo(() => {
    const map: Record<string, { count: number; totalViews: number; totalRetention: number }> = {};
    published.forEach((v) => {
      if (v.hook && v.metrics) {
        if (!map[v.hook.type])
          map[v.hook.type] = { count: 0, totalViews: 0, totalRetention: 0 };
        map[v.hook.type].count++;
        map[v.hook.type].totalViews += v.metrics.views;
        map[v.hook.type].totalRetention += v.metrics.retention;
      }
    });
    return Object.entries(map)
      .map(([type, data]) => ({
        type,
        count: data.count,
        avgViews: Math.round(data.totalViews / data.count),
        avgRetention: Math.round(data.totalRetention / data.count),
      }))
      .sort((a, b) => b.avgViews - a.avgViews);
  }, [published]);

  const topVideos = useMemo(
    () =>
      [...published]
        .sort((a, b) => (b.metrics?.views ?? 0) - (a.metrics?.views ?? 0))
        .slice(0, 5),
    [published]
  );

  return (
    <div className="flex flex-col gap-6">
      <motion.div
        initial="hidden"
        animate="visible"
        custom={0}
        variants={fadeUp}
      >
        <h1 className="text-xl font-bold text-foreground">
          Analytics Overview
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Performance insights across {published.length} published videos.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: "Total Views",
            value: formatNumber(totals.views),
            change: "+28% vs last period",
            changeType: "up" as const,
            icon: Eye,
            accentClass: "text-primary",
          },
          {
            label: "Total Likes",
            value: formatNumber(totals.likes),
            change: "+34% vs last period",
            changeType: "up" as const,
            icon: Heart,
            accentClass: "text-rose",
          },
          {
            label: "Total Shares",
            value: formatNumber(totals.shares),
            change: "+42% vs last period",
            changeType: "up" as const,
            icon: Share2,
            accentClass: "text-amber",
          },
          {
            label: "Avg. Watch Time",
            value: `${totals.avgWatch}s`,
            change: "+5s vs last period",
            changeType: "up" as const,
            icon: Clock,
            accentClass: "text-sky",
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

      {/* Charts + Sidebar */}
      <div className="grid grid-cols-12 gap-6">
        {/* Engagement Chart */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={5}
          variants={fadeUp}
          className="col-span-8 spotlight-card rounded-xl p-5"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">
              Views Over Time
            </h3>
            <span className="text-[12px] text-muted-foreground">
              Last 15 data points
            </span>
          </div>
          <PerformanceChart
            data={MOCK_ANALYTICS_DATA}
            dataKey="views"
            label="Views"
            color="hsl(263, 70%, 55%)"
            gradientId="viewsGrad"
          />
        </motion.div>

        {/* Top Videos */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={6}
          variants={fadeUp}
          className="col-span-4 spotlight-card rounded-xl p-5"
        >
          <h3 className="mb-4 text-sm font-bold text-foreground">
            Top Performing Videos
          </h3>
          <div className="flex flex-col gap-2.5">
            {topVideos.map((v, i) => (
              <Link
                to={`/editor/${v.id}`}
                key={v.id}
                className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-secondary/50"
              >
                <span className="font-mono text-[13px] font-bold text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <img
                  src={v.thumbnail}
                  alt={v.title}
                  className="size-9 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-foreground">
                    {v.title}
                  </p>
                  <div className="flex items-center gap-2">
                    {v.platforms.slice(0, 1).map((p) => (
                      <PlatformBadge key={p} platform={p} size="sm" />
                    ))}
                    <span className="font-mono text-[11px] text-emerald">
                      {v.metrics!.retention}% ret.
                    </span>
                  </div>
                </div>
                <span className="font-mono text-[13px] font-bold text-foreground">
                  {formatNumber(v.metrics!.views)}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Platform + Hook Insights */}
      <div className="grid grid-cols-12 gap-6">
        {/* Platform Breakdown */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={7}
          variants={fadeUp}
          className="col-span-6 spotlight-card rounded-xl p-5"
        >
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="size-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">
              Platform Breakdown
            </h3>
          </div>
          <div className="flex flex-col gap-3">
            {MOCK_PLATFORM_STATS.map((ps) => {
              const config = PLATFORM_CONFIG[ps.platform];
              const maxViews = Math.max(
                ...MOCK_PLATFORM_STATS.map((p) => p.views)
              );
              const pct = (ps.views / maxViews) * 100;

              return (
                <div key={ps.platform} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PlatformBadge platform={ps.platform} size="md" />
                      <span className="text-[12px] text-muted-foreground">
                        {ps.posts} posts
                      </span>
                    </div>
                    <span className="font-mono text-sm font-bold text-foreground">
                      {formatNumber(ps.views)} views
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: config.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Hook Performance */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={8}
          variants={fadeUp}
          className="col-span-6 spotlight-card rounded-xl p-5"
        >
          <div className="mb-4 flex items-center gap-2">
            <Zap className="size-4 text-amber" />
            <h3 className="text-sm font-bold text-foreground">
              Hook Performance — AI Insights
            </h3>
          </div>
          <div className="flex flex-col gap-2.5">
            {hookPerformance.map((hp, i) => {
              const config =
                HOOK_TYPE_CONFIG[hp.type as keyof typeof HOOK_TYPE_CONFIG];
              return (
                <div
                  key={hp.type}
                  className="flex items-center gap-4 rounded-lg border border-border bg-card p-3"
                >
                  <span className="text-xl">{config?.emoji ?? "🔗"}</span>
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold text-foreground">
                      {config?.label ?? hp.type} Hook
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Used {hp.count} time{hp.count > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[13px] font-bold text-foreground">
                      {formatNumber(hp.avgViews)}
                    </p>
                    <p className="font-mono text-[11px] text-emerald">
                      {hp.avgRetention}% avg ret.
                    </p>
                  </div>
                  {i === 0 && (
                    <span className="rounded-md bg-amber/15 px-2 py-0.5 text-[10px] font-bold text-amber">
                      BEST
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <p className="mt-4 rounded-lg bg-primary/5 p-3 text-[12px] text-muted-foreground">
            <span className="font-semibold text-primary">AI Insight:</span>{" "}
            Statistic-based hooks drive the highest retention. Consider using
            more data-driven openings in your next videos.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
