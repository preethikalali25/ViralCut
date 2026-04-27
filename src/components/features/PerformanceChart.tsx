import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { AnalyticsData } from "@/types";

interface PerformanceChartProps {
  data: AnalyticsData[];
  dataKey: keyof AnalyticsData;
  label: string;
  color?: string;
  gradientId?: string;
}

export default function PerformanceChart({
  data,
  dataKey,
  label,
  color = "hsl(263, 70%, 55%)",
  gradientId = "chartGradient",
}: PerformanceChartProps) {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(240, 5%, 14%)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(240, 5%, 55%)", fontSize: 11 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(240, 5%, 55%)", fontSize: 11 }}
            tickFormatter={(v: number) =>
              v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)
            }
          />
          <Tooltip
            contentStyle={{
              background: "hsl(240, 6%, 10%)",
              border: "1px solid hsl(240, 5%, 16%)",
              borderRadius: "8px",
              fontSize: "12px",
              color: "hsl(240, 5%, 92%)",
            }}
            labelStyle={{ color: "hsl(240, 5%, 55%)", marginBottom: 4 }}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            name={label}
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
