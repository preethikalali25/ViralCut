import { Music, TrendingUp, Play } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { PLATFORM_CONFIG } from "@/constants/config";
import type { TrendingAudio, Platform } from "@/types";

interface TrendingAudioListProps {
  audioList: TrendingAudio[];
  selectedId?: string;
  onSelect: (audio: TrendingAudio) => void;
  filterPlatform?: Platform;
}

export default function TrendingAudioList({
  audioList,
  selectedId,
  onSelect,
  filterPlatform,
}: TrendingAudioListProps) {
  const filtered = filterPlatform
    ? audioList.filter((a) => a.platform === filterPlatform)
    : audioList;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Music className="size-4 text-amber" />
        <h4 className="text-sm font-bold text-foreground">Trending Audio</h4>
      </div>

      <div className="flex flex-col gap-1.5">
        {filtered.map((audio) => (
          <button
            key={audio.id}
            onClick={() => onSelect(audio)}
            className={cn(
              "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-all",
              selectedId === audio.id
                ? "border-primary/30 bg-primary/8"
                : "border-border bg-card hover:border-muted-foreground/30"
            )}
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
              <Play className="size-3.5 text-muted-foreground" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-foreground">
                {audio.title}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {audio.artist}
              </p>
            </div>

            <div className="flex flex-col items-end gap-0.5">
              <span
                className={cn(
                  "rounded px-1.5 py-0.5 text-[10px] font-semibold",
                  PLATFORM_CONFIG[audio.platform].bgClass
                )}
              >
                {PLATFORM_CONFIG[audio.platform].short}
              </span>
              {audio.trending && (
                <span className="flex items-center gap-0.5 text-[10px] font-medium text-amber">
                  <TrendingUp className="size-2.5" />
                  {formatNumber(audio.usageCount)}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
