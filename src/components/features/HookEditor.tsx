import { useState } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { HOOK_TYPE_CONFIG } from "@/constants/config";
import type { Hook, HookType } from "@/types";

interface HookEditorProps {
  hook: Hook;
  onUpdate: (hook: Hook) => void;
}

export default function HookEditor({ hook, onUpdate }: HookEditorProps) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(hook.text);

  const hookTypes = Object.entries(HOOK_TYPE_CONFIG) as [
    HookType,
    (typeof HOOK_TYPE_CONFIG)[HookType],
  ][];

  const handleSave = () => {
    onUpdate({ ...hook, text });
    setEditing(false);
  };

  const cycleAlternate = () => {
    const currentIdx = hook.alternates.indexOf(text);
    const nextIdx = (currentIdx + 1) % hook.alternates.length;
    const newText = hook.alternates[nextIdx] ?? hook.alternates[0];
    setText(newText);
    onUpdate({ ...hook, text: newText });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-amber" />
        <h4 className="text-sm font-bold text-foreground">
          Hook Optimization
        </h4>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {hookTypes.map(([type, config]) => (
          <button
            key={type}
            onClick={() => onUpdate({ ...hook, type })}
            className={cn(
              "rounded-lg px-2.5 py-1.5 text-[12px] font-semibold transition-all",
              hook.type === type
                ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            {config.emoji} {config.label}
          </button>
        ))}
      </div>

      <div className="spotlight-card rounded-lg p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Opening Hook — First 3 Seconds
          </span>
          <button
            onClick={cycleAlternate}
            className="flex items-center gap-1 text-[12px] font-medium text-primary hover:text-primary/80"
          >
            <RefreshCw className="size-3" />
            Alternate
          </button>
        </div>

        {editing ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[60px] w-full resize-none rounded-lg border border-border bg-secondary/50 p-3 text-sm text-foreground focus:border-primary/50 focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditing(false)}
                className="rounded-md px-3 py-1.5 text-[12px] font-medium text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="rounded-md bg-primary px-3 py-1.5 text-[12px] font-semibold text-white"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="w-full text-left text-base font-semibold italic leading-relaxed text-foreground transition-colors hover:text-primary"
          >
            "{text}"
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Alternates
        </span>
        {hook.alternates.map((alt, i) => (
          <button
            key={i}
            onClick={() => {
              setText(alt);
              onUpdate({ ...hook, text: alt });
            }}
            className={cn(
              "rounded-lg border px-3 py-2 text-left text-[13px] transition-all",
              alt === text
                ? "border-primary/30 bg-primary/8 text-foreground"
                : "border-border bg-card text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground"
            )}
          >
            "{alt}"
          </button>
        ))}
      </div>
    </div>
  );
}
