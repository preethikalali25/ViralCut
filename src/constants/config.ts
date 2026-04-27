import {
  LayoutDashboard,
  Upload,
  Film,
  FolderOpen,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Upload", path: "/upload", icon: Upload },
  { label: "Editor", path: "/editor", icon: Film },
  { label: "Library", path: "/library", icon: FolderOpen },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
];

export const PLATFORM_CONFIG = {
  instagram: {
    label: "Instagram Reels",
    short: "Reels",
    color: "hsl(330 80% 55%)",
    bgClass: "bg-pink-500/15 text-pink-400",
    maxDuration: 90,
    aspectRatio: "9:16",
  },
  tiktok: {
    label: "TikTok",
    short: "TikTok",
    color: "hsl(180 80% 50%)",
    bgClass: "bg-cyan-500/15 text-cyan-400",
    maxDuration: 180,
    aspectRatio: "9:16",
  },
  youtube: {
    label: "YouTube Shorts",
    short: "Shorts",
    color: "hsl(0 80% 55%)",
    bgClass: "bg-red-500/15 text-red-400",
    maxDuration: 60,
    aspectRatio: "9:16",
  },
} as const;

export const HOOK_TYPE_CONFIG = {
  question: { label: "Question", emoji: "❓", color: "text-sky" },
  shock: { label: "Shock", emoji: "⚡", color: "text-amber" },
  relatable: { label: "Relatable", emoji: "🤝", color: "text-emerald" },
  curiosity: { label: "Curiosity", emoji: "🔍", color: "text-violet-light" },
  statistic: { label: "Statistic", emoji: "📊", color: "text-rose" },
} as const;

export const PROCESSING_STEPS = [
  {
    id: "analyze",
    label: "Content Analysis",
    description: "Detecting faces, scenes, and audio",
  },
  {
    id: "trim",
    label: "Smart Trimming",
    description: "Removing silence and dead time",
  },
  {
    id: "reframe",
    label: "Auto Reframing",
    description: "Face tracking & vertical focus",
  },
  {
    id: "enhance",
    label: "Enhancement",
    description: "Noise reduction & lighting fix",
  },
  {
    id: "subtitles",
    label: "Subtitle Generation",
    description: "Multi-style caption overlay",
  },
  {
    id: "hook",
    label: "Hook Optimization",
    description: "Generating viral opening hooks",
  },
  {
    id: "audio",
    label: "Audio Matching",
    description: "Finding trending audio matches",
  },
];
