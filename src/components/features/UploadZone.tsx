import { useState, useCallback } from "react";
import { Upload, Film, CloudUpload } from "lucide-react";
import { cn } from "@/lib/utils";
import emptyUpload from "@/assets/empty-upload.jpg";

interface UploadZoneProps {
  onUpload: (files: FileList) => void;
}

export default function UploadZone({ onUpload }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent, entering: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(entering);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files.length) onUpload(e.dataTransfer.files);
    },
    [onUpload]
  );

  return (
    <div
      onDragOver={(e) => handleDrag(e, true)}
      onDragEnter={(e) => handleDrag(e, true)}
      onDragLeave={(e) => handleDrag(e, false)}
      onDrop={handleDrop}
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed p-12 transition-all duration-200",
        isDragging
          ? "border-primary bg-primary/5 glow-violet"
          : "border-border bg-card/50 hover:border-muted-foreground/30"
      )}
    >
      <div className="absolute inset-0 opacity-[0.06]">
        <img
          src={emptyUpload}
          alt=""
          className="size-full object-cover"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <div
          className={cn(
            "mb-5 flex size-16 items-center justify-center rounded-2xl transition-colors",
            isDragging ? "bg-primary/20" : "bg-secondary"
          )}
        >
          <CloudUpload
            className={cn(
              "size-7 transition-colors",
              isDragging ? "text-primary" : "text-muted-foreground"
            )}
          />
        </div>

        <h3 className="mb-2 text-lg font-bold text-foreground">
          Drop your videos here
        </h3>
        <p className="mb-6 max-w-xs text-sm text-muted-foreground text-pretty">
          Upload MP4, MOV, or WebM files. AI will auto-detect orientation,
          duration, and face/voice presence.
        </p>

        <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20">
          <Upload className="size-4" />
          Browse Files
          <input
            type="file"
            className="hidden"
            accept="video/*"
            multiple
            onChange={(e) => e.target.files && onUpload(e.target.files)}
          />
        </label>

        <div className="mt-4 flex items-center gap-4 text-[12px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Film className="size-3" /> Batch upload supported
          </span>
          <span>Max 500MB per file</span>
        </div>
      </div>
    </div>
  );
}
