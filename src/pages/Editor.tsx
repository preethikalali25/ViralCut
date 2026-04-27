import { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  Maximize2,
  Calendar,
  Send,
  Hash,
  Type,
  ArrowLeft,
  MonitorPlay,
} from "lucide-react";
import { cn, formatDuration } from "@/lib/utils";
import { useVideoStore } from "@/stores/videoStore";
import { MOCK_TRENDING_AUDIO } from "@/constants/mockData";
import { PLATFORM_CONFIG } from "@/constants/config";
import HookEditor from "@/components/features/HookEditor";
import TrendingAudioList from "@/components/features/TrendingAudioList";
import PlatformBadge from "@/components/features/PlatformBadge";
import type { Platform, Hook, TrendingAudio } from "@/types";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.3, ease: "easeOut" },
  }),
};

type Tab = "hook" | "caption" | "audio" | "platform";

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const videos = useVideoStore((s) => s.videos);
  const updateVideo = useVideoStore((s) => s.updateVideo);

  const video = useMemo(
    () =>
      videos.find((v) => v.id === id) ??
      videos.find(
        (v) =>
          v.status === "ready" ||
          v.status === "published" ||
          v.status === "scheduled"
      ),
    [videos, id]
  );

  const [tab, setTab] = useState<Tab>("hook");
  const [isPlaying, setIsPlaying] = useState(false);
  const [caption, setCaption] = useState(video?.caption ?? "");
  const [hashtags, setHashtags] = useState(
    video?.hashtags?.join(" ") ?? ""
  );

  if (!video) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <MonitorPlay className="mb-4 size-12 text-muted-foreground/30" />
        <h2 className="text-lg font-bold text-foreground">No video selected</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload or select a video from the library to edit.
        </p>
        <Link
          to="/upload"
          className="mt-4 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white"
        >
          Upload Video
        </Link>
      </div>
    );
  }

  const handleHookUpdate = (hook: Hook) => {
    updateVideo(video.id, { hook });
  };

  const handleAudioSelect = (audio: TrendingAudio) => {
    updateVideo(video.id, { audio });
  };

  const handlePlatformToggle = (platform: Platform) => {
    const current = video.platforms;
    const updated = current.includes(platform)
      ? current.filter((p) => p !== platform)
      : [...current, platform];
    if (updated.length > 0) updateVideo(video.id, { platforms: updated });
  };

  const handleSchedule = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(12, 0, 0, 0);
    updateVideo(video.id, {
      status: "scheduled",
      scheduledAt: tomorrow.toISOString(),
      caption,
      hashtags: hashtags.split(/\s+/).filter(Boolean),
    });
    navigate("/library");
  };

  const handlePublish = () => {
    updateVideo(video.id, {
      status: "published",
      publishedAt: new Date().toISOString(),
      caption,
      hashtags: hashtags.split(/\s+/).filter(Boolean),
    });
    navigate("/library");
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "hook", label: "Hook" },
    { id: "caption", label: "Caption" },
    { id: "audio", label: "Audio" },
    { id: "platform", label: "Platforms" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <motion.div
        initial="hidden"
        animate="visible"
        custom={0}
        variants={fadeUp}
        className="flex items-center gap-3"
      >
        <button
          onClick={() => navigate(-1)}
          className="flex size-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground hover:text-foreground"
          aria-label="Go back"
        >
          <ArrowLeft className="size-4" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-bold text-foreground">
            {video.title}
          </h1>
          <div className="flex items-center gap-2">
            {video.platforms.map((p) => (
              <PlatformBadge key={p} platform={p} size="sm" />
            ))}
            <span className="text-[12px] text-muted-foreground">
              · {formatDuration(video.duration)}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-12 gap-5">
        {/* Video Preview */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={1}
          variants={fadeUp}
          className="col-span-7"
        >
          <div className="spotlight-card overflow-hidden rounded-xl">
            <div className="relative aspect-[9/14] max-h-[520px] overflow-hidden bg-black">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="size-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex size-16 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-transform hover:scale-110"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="size-7" />
                  ) : (
                    <Play className="ml-1 size-7" />
                  )}
                </button>
              </div>

              {/* Simulated subtitle */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <div className="rounded-md bg-black/70 px-4 py-2 backdrop-blur-sm">
                  <p className="text-center text-sm font-bold text-white">
                    {video.hook?.text ?? "Preview subtitle overlay"}
                  </p>
                </div>
              </div>

              <div className="absolute bottom-2 left-3 right-3 flex items-center gap-3">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/20">
                  <div className="h-full w-1/3 rounded-full bg-primary" />
                </div>
                <span className="font-mono text-[11px] text-white/60">
                  {formatDuration(Math.round(video.duration * 0.33))} /{" "}
                  {formatDuration(video.duration)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="size-4" />
                  ) : (
                    <Play className="size-4" />
                  )}
                </button>
                <Volume2 className="size-4 text-muted-foreground" />
              </div>
              <button
                className="text-muted-foreground hover:text-foreground"
                aria-label="Fullscreen"
              >
                <Maximize2 className="size-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* AI Controls */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={2}
          variants={fadeUp}
          className="col-span-5 flex flex-col gap-4"
        >
          <div className="spotlight-card flex flex-col overflow-hidden rounded-xl">
            {/* Tabs */}
            <div className="flex border-b border-border">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "flex-1 px-3 py-3 text-[13px] font-semibold transition-colors",
                    tab === t.id
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="max-h-[420px] overflow-y-auto p-5 scrollbar-thin">
              {tab === "hook" && video.hook && (
                <HookEditor hook={video.hook} onUpdate={handleHookUpdate} />
              )}
              {tab === "hook" && !video.hook && (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No hook generated yet. Process this video first.
                </p>
              )}

              {tab === "caption" && (
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Type className="size-4 text-amber" />
                      <h4 className="text-sm font-bold text-foreground">
                        Caption
                      </h4>
                    </div>
                    <textarea
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      rows={4}
                      className="w-full resize-none rounded-lg border border-border bg-secondary/50 p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
                      placeholder="Write or edit your caption…"
                    />
                    <p className="mt-1 text-right text-[11px] text-muted-foreground">
                      {caption.length} / 2200
                    </p>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Hash className="size-4 text-amber" />
                      <h4 className="text-sm font-bold text-foreground">
                        Hashtags
                      </h4>
                    </div>
                    <textarea
                      value={hashtags}
                      onChange={(e) => setHashtags(e.target.value)}
                      rows={2}
                      className="w-full resize-none rounded-lg border border-border bg-secondary/50 p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
                      placeholder="#trending #viral #fyp"
                    />
                  </div>
                </div>
              )}

              {tab === "audio" && (
                <TrendingAudioList
                  audioList={MOCK_TRENDING_AUDIO}
                  selectedId={video.audio?.id}
                  onSelect={handleAudioSelect}
                />
              )}

              {tab === "platform" && (
                <div className="flex flex-col gap-4">
                  <h4 className="text-sm font-bold text-foreground">
                    Target Platforms
                  </h4>
                  {(
                    Object.entries(PLATFORM_CONFIG) as [
                      Platform,
                      (typeof PLATFORM_CONFIG)[Platform],
                    ][]
                  ).map(([key, config]) => {
                    const active = video.platforms.includes(key);
                    return (
                      <button
                        key={key}
                        onClick={() => handlePlatformToggle(key)}
                        className={cn(
                          "flex items-center gap-4 rounded-xl border p-4 text-left transition-all",
                          active
                            ? "border-primary/30 bg-primary/5"
                            : "border-border bg-card hover:border-muted-foreground/30"
                        )}
                      >
                        <div
                          className={cn(
                            "flex size-10 items-center justify-center rounded-lg text-sm font-bold",
                            config.bgClass
                          )}
                        >
                          {config.short.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="text-[13px] font-semibold text-foreground">
                            {config.label}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {config.aspectRatio} · Max{" "}
                            {formatDuration(config.maxDuration)}
                          </p>
                        </div>
                        <div
                          className={cn(
                            "size-5 rounded-full border-2 transition-colors",
                            active
                              ? "border-primary bg-primary"
                              : "border-muted-foreground/30"
                          )}
                        >
                          {active && (
                            <svg
                              viewBox="0 0 20 20"
                              className="size-full text-white"
                            >
                              <path
                                fill="currentColor"
                                d="M8.5 13.3 5.2 10l1.1-1.1 2.2 2.2 4.8-4.8 1.1 1.1z"
                              />
                            </svg>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSchedule}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-secondary py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/80"
            >
              <Calendar className="size-4" />
              Schedule
            </button>
            <button
              onClick={handlePublish}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
            >
              <Send className="size-4" />
              Publish Now
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
