import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { X, Film, CheckCircle2, AlertCircle } from "lucide-react";
import { cn, formatDuration } from "@/lib/utils";
import UploadZone from "@/components/features/UploadZone";
import ProcessingPipeline from "@/components/features/ProcessingPipeline";
import { useVideoStore } from "@/stores/videoStore";
import aiProcessingImg from "@/assets/ai-processing.jpg";

interface QueueItem {
  id: string;
  name: string;
  size: string;
  status: "waiting" | "processing" | "done" | "error";
  progress: number;
  step: number;
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.35, ease: "easeOut" },
  }),
};

export default function Upload() {
  const navigate = useNavigate();
  const addVideo = useVideoStore((s) => s.addVideo);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [activeItem, setActiveItem] = useState<QueueItem | null>(null);

  const handleUpload = useCallback((files: FileList) => {
    const newItems: QueueItem[] = Array.from(files).map((f, i) => ({
      id: `upload-${Date.now()}-${i}`,
      name: f.name || `Video ${i + 1}`,
      size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
      status: "waiting" as const,
      progress: 0,
      step: 0,
    }));
    setQueue((prev) => [...prev, ...newItems]);
  }, []);

  // Simulate processing for demo
  useEffect(() => {
    if (queue.length === 0) return;

    const waitingItem = queue.find((q) => q.status === "waiting");
    if (!waitingItem || activeItem) return;

    const item = { ...waitingItem, status: "processing" as const };
    setActiveItem(item);
    setQueue((prev) =>
      prev.map((q) => (q.id === item.id ? { ...q, status: "processing" } : q))
    );

    let progress = 0;
    let step = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 18 + 10;
      if (progress > (step + 1) * 14.3) step = Math.min(step + 1, 6);

      if (progress >= 100) {
        clearInterval(interval);
        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id
              ? { ...q, status: "done", progress: 100, step: 7 }
              : q
          )
        );
        setActiveItem(null);

        addVideo({
          id: `v-new-${Date.now()}`,
          title: item.name.replace(/\.[^/.]+$/, ""),
          thumbnail: `https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=600&fit=crop&random=${Date.now()}`,
          duration: Math.floor(Math.random() * 50) + 20,
          status: "ready",
          platforms: ["instagram"],
          hook: {
            type: "question",
            text: "You won't believe what happens next…",
            alternates: [
              "Wait for it…",
              "This changed everything for me",
            ],
          },
          caption: "AI-generated caption ready for your review ✨",
          hashtags: ["#viral", "#trending", "#fyp"],
          createdAt: new Date().toISOString(),
          category: "general",
        });
        return;
      }

      setActiveItem({
        ...item,
        progress: Math.min(progress, 99),
        step,
      });
      setQueue((prev) =>
        prev.map((q) =>
          q.id === item.id
            ? { ...q, progress: Math.min(progress, 99), step }
            : q
        )
      );
    }, 200);

    return () => clearInterval(interval);
  }, [queue, activeItem, addVideo]);

  const removeItem = (id: string) => {
    setQueue((prev) => prev.filter((q) => q.id !== id));
    if (activeItem?.id === id) setActiveItem(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp}>
        <h1 className="text-xl font-bold text-foreground">Upload Videos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Drop your raw footage — AI handles the rest.
        </p>
      </motion.div>

      <div className="grid grid-cols-12 gap-6">
        {/* Upload zone + Pipeline */}
        <div className="col-span-8 flex flex-col gap-6">
          <motion.div
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeUp}
          >
            <UploadZone onUpload={handleUpload} />
          </motion.div>

          {activeItem && (
            <motion.div
              initial="hidden"
              animate="visible"
              custom={2}
              variants={fadeUp}
            >
              <ProcessingPipeline
                currentStep={activeItem.step}
                progress={Math.round(activeItem.progress)}
              />
            </motion.div>
          )}

          {!activeItem && queue.length === 0 && (
            <motion.div
              initial="hidden"
              animate="visible"
              custom={2}
              variants={fadeUp}
              className="spotlight-card flex items-center gap-6 rounded-xl p-6"
            >
              <img
                src={aiProcessingImg}
                alt="AI Processing"
                className="size-24 rounded-xl object-cover"
              />
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  AI Processing Pipeline
                </h3>
                <p className="mt-1 max-w-md text-[13px] text-muted-foreground text-pretty">
                  Each video goes through 7 AI stages: content analysis, smart
                  trimming, auto-reframing, enhancement, subtitle generation,
                  hook optimization, and trending audio matching.
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Queue sidebar */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={3}
          variants={fadeUp}
          className="col-span-4"
        >
          <div className="spotlight-card rounded-xl p-5">
            <h3 className="mb-4 text-sm font-bold text-foreground">
              Upload Queue
              {queue.length > 0 && (
                <span className="ml-2 rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary">
                  {queue.length}
                </span>
              )}
            </h3>

            {queue.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <Film className="mb-3 size-8 text-muted-foreground/40" />
                <p className="text-[13px] text-muted-foreground">
                  No videos in queue
                </p>
                <p className="mt-1 text-[12px] text-muted-foreground/60">
                  Upload videos to start processing
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {queue.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-3 transition-all",
                      item.status === "processing"
                        ? "border-primary/20 bg-primary/5"
                        : item.status === "done"
                          ? "border-emerald/20 bg-emerald/5"
                          : "border-border bg-card"
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-foreground">
                        {item.name}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span>{item.size}</span>
                        {item.status === "processing" && (
                          <span className="font-mono text-primary">
                            {Math.round(item.progress)}%
                          </span>
                        )}
                      </div>
                      {item.status === "processing" && (
                        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-secondary">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-amber transition-all duration-300"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {item.status === "done" ? (
                      <CheckCircle2 className="size-5 shrink-0 text-emerald" />
                    ) : item.status === "error" ? (
                      <AlertCircle className="size-5 shrink-0 text-rose" />
                    ) : (
                      <button
                        onClick={() => removeItem(item.id)}
                        className="shrink-0 rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                        aria-label="Remove from queue"
                      >
                        <X className="size-4" />
                      </button>
                    )}
                  </div>
                ))}

                {queue.some((q) => q.status === "done") && (
                  <button
                    onClick={() => navigate("/library")}
                    className="mt-2 w-full rounded-lg bg-primary/10 py-2.5 text-[13px] font-semibold text-primary transition-colors hover:bg-primary/20"
                  >
                    View in Library →
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
