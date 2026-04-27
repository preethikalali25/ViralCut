import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Video } from "@/types";
import { MOCK_VIDEOS } from "@/constants/mockData";

interface VideoStore {
  videos: Video[];
  selectedVideoId: string | null;
  selectVideo: (id: string | null) => void;
  addVideo: (video: Video) => void;
  updateVideo: (id: string, updates: Partial<Video>) => void;
  removeVideo: (id: string) => void;
  getVideoById: (id: string) => Video | undefined;
}

export const useVideoStore = create<VideoStore>()(
  persist(
    (set, get) => ({
      videos: MOCK_VIDEOS,
      selectedVideoId: null,

      selectVideo: (id) => set({ selectedVideoId: id }),

      addVideo: (video) =>
        set((state) => ({ videos: [video, ...state.videos] })),

      updateVideo: (id, updates) =>
        set((state) => ({
          videos: state.videos.map((v) =>
            v.id === id ? { ...v, ...updates } : v
          ),
        })),

      removeVideo: (id) =>
        set((state) => ({
          videos: state.videos.filter((v) => v.id !== id),
        })),

      getVideoById: (id) => get().videos.find((v) => v.id === id),
    }),
    { name: "viralcut-videos" }
  )
);
