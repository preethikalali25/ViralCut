import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PROCESSING_STEPS } from "@/constants/config";

interface ProcessingPipelineProps {
  currentStep: number;
  progress: number;
}

export default function ProcessingPipeline({
  currentStep,
  progress,
}: ProcessingPipelineProps) {
  return (
    <div className="spotlight-card rounded-xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">
          AI Processing Pipeline
        </h3>
        <span className="font-mono text-sm font-semibold text-primary">
          {progress}%
        </span>
      </div>

      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-amber transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex flex-col gap-1">
        {PROCESSING_STEPS.map((step, i) => {
          const status =
            i < currentStep
              ? "complete"
              : i === currentStep
                ? "active"
                : "pending";

          return (
            <div
              key={step.id}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200",
                status === "active" && "bg-primary/8",
                status === "complete" && "opacity-60"
              )}
            >
              <div
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                  status === "complete" && "bg-emerald/20 text-emerald",
                  status === "active" && "bg-primary/20 text-primary",
                  status === "pending" && "bg-secondary text-muted-foreground"
                )}
              >
                {status === "complete" ? (
                  <Check className="size-3.5" />
                ) : status === "active" ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  i + 1
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-[13px] font-medium",
                    status === "active"
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </p>
              </div>

              {status === "active" && (
                <span className="text-[11px] font-medium text-primary animate-pulse-glow">
                  Processing
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
