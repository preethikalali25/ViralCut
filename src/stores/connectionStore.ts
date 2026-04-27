import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Platform } from "@/types";

export interface ConnectedAccount {
  platform: Platform;
  username: string;
  displayName: string;
  avatarUrl: string;
  followers: number;
  connectedAt: string;
}

interface ConnectionStore {
  connectedAccounts: ConnectedAccount[];
  onboardingComplete: boolean;
  connectAccount: (account: ConnectedAccount) => void;
  disconnectAccount: (platform: Platform) => void;
  isConnected: (platform: Platform) => boolean;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export const useConnectionStore = create<ConnectionStore>()(
  persist(
    (set, get) => ({
      connectedAccounts: [],
      onboardingComplete: false,

      connectAccount: (account) =>
        set((state) => ({
          connectedAccounts: [
            ...state.connectedAccounts.filter(
              (a) => a.platform !== account.platform
            ),
            account,
          ],
        })),

      disconnectAccount: (platform) =>
        set((state) => ({
          connectedAccounts: state.connectedAccounts.filter(
            (a) => a.platform !== platform
          ),
        })),

      isConnected: (platform) =>
        get().connectedAccounts.some((a) => a.platform === platform),

      completeOnboarding: () => set({ onboardingComplete: true }),

      resetOnboarding: () =>
        set({ onboardingComplete: false, connectedAccounts: [] }),
    }),
    { name: "viralcut-connections" }
  )
);
