export type Platform = "instagram" | "tiktok" | "youtube";

export type VideoStatus =
  | "uploading"
  | "processing"
  | "ready"
  | "scheduled"
  | "published"
  | "failed";

export type HookType =
  | "question"
  | "shock"
  | "relatable"
  | "curiosity"
  | "statistic";

export interface Hook {
  type: HookType;
  text: string;
  alternates: string[];
}

export interface TrendingAudio {
  id: string;
  title: string;
  artist: string;
  platform: Platform;
  usageCount: number;
  trending: boolean;
  category: string;
}

export interface VideoMetrics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  watchTime: number;
  retention: number;
}

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  status: VideoStatus;
  platforms: Platform[];
  hook?: Hook;
  caption?: string;
  hashtags?: string[];
  audio?: TrendingAudio;
  scheduledAt?: string;
  publishedAt?: string;
  metrics?: VideoMetrics;
  processingProgress?: number;
  processingStep?: string;
  createdAt: string;
  category: string;
}

export interface CalendarEvent {
  id: string;
  videoId: string;
  title: string;
  date: string;
  platform: Platform;
  status: "scheduled" | "published";
}

export interface ProcessingStep {
  id: string;
  label: string;
  description: string;
  icon: string;
  status: "pending" | "active" | "complete";
}

export interface AnalyticsData {
  date: string;
  views: number;
  engagement: number;
  shares: number;
}

export interface PlatformStats {
  platform: Platform;
  posts: number;
  views: number;
  engagement: number;
  topHookType: HookType;
}

export type UserRole = "admin" | "editor" | "viewer";
export type UserStatus = "active" | "inactive" | "pending";

export interface DummyUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  status: UserStatus;
  joinedAt: string;
  lastActive: string;
  videosCreated: number;
  totalViews: number;
  connectedPlatforms: Platform[];
  bio: string;
}
