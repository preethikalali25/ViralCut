import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { PLATFORM_CONFIG } from "@/constants/config";
import type { CalendarEvent } from "@/types";

interface CalendarGridProps {
  events: CalendarEvent[];
  year: number;
  month: number;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function CalendarGrid({
  events,
  year,
  month,
}: CalendarGridProps) {
  const cells = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPad = (firstDay.getDay() + 6) % 7;
    const totalDays = lastDay.getDate();

    const result: {
      day: number | null;
      dateStr: string;
      isToday: boolean;
    }[] = [];

    for (let i = 0; i < startPad; i++) {
      result.push({ day: null, dateStr: "", isToday: false });
    }

    const today = new Date();
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const isToday =
        today.getFullYear() === year &&
        today.getMonth() === month &&
        today.getDate() === d;
      result.push({ day: d, dateStr, isToday });
    }

    return result;
  }, [year, month]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    events.forEach((ev) => {
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    });
    return map;
  }, [events]);

  const monthName = new Date(year, month).toLocaleString("en", {
    month: "long",
  });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">
          {monthName} {year}
        </h3>
        <span className="text-[13px] text-muted-foreground">
          {events.filter((e) => e.status === "scheduled").length} scheduled
        </span>
      </div>

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-border bg-border">
        {DAYS.map((d) => (
          <div
            key={d}
            className="bg-secondary/60 px-2 py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
          >
            {d}
          </div>
        ))}

        {cells.map((cell, i) => {
          const dayEvents = cell.dateStr ? eventsByDate[cell.dateStr] : [];
          return (
            <div
              key={i}
              className={cn(
                "min-h-[72px] bg-card p-1.5 transition-colors",
                cell.day && "hover:bg-secondary/40",
                !cell.day && "bg-card/40"
              )}
            >
              {cell.day && (
                <>
                  <span
                    className={cn(
                      "mb-1 flex size-6 items-center justify-center rounded-full text-[12px] font-medium",
                      cell.isToday
                        ? "bg-primary text-white"
                        : "text-muted-foreground"
                    )}
                  >
                    {cell.day}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    {dayEvents?.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        className="truncate rounded px-1 py-0.5 text-[10px] font-medium leading-tight"
                        style={{
                          backgroundColor:
                            PLATFORM_CONFIG[ev.platform].color + "22",
                          color: PLATFORM_CONFIG[ev.platform].color,
                        }}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents && dayEvents.length > 2 && (
                      <span className="text-[10px] text-muted-foreground">
                        +{dayEvents.length - 2} more
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
