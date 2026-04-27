import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ArrowRight,
  LinkIcon,
  Unlink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useConnectionStore } from "@/stores/connectionStore";
import type { Platform } from "@/types";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.41a8.16 8.16 0 0 0 4.77 1.52V7.56a4.85 4.85 0 0 1-1.01-.87Z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.53 3.5 12 3.5 12 3.5s-7.53 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.76 31.76 0 0 0 0 12a31.76 31.76 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.85.55 9.38.55 9.38.55s7.53 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.76 31.76 0 0 0 24 12a31.76 31.76 0 0 0-.5-5.81ZM9.75 15.02V8.98L15.5 12l-5.75 3.02Z" />
    </svg>
  );
}

interface PlatformCard {
  platform: Platform;
  name: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  shadowColor: string;
  connectPath: string;
}

const PLATFORMS: PlatformCard[] = [
  {
    platform: "tiktok",
    name: "TikTok",
    description: "Match trending sounds, optimize hooks for the FYP, and auto-publish.",
    icon: <TikTokIcon className="size-7 text-white" />,
    gradient: "from-cyan-500 via-cyan-400 to-pink-500",
    shadowColor: "shadow-cyan-500/20",
    connectPath: "/connect/tiktok",
  },
  {
    platform: "youtube",
    name: "YouTube Shorts",
    description: "Optimize retention, auto-generate titles, and schedule Shorts.",
    icon: <YouTubeIcon className="size-7 text-white" />,
    gradient: "from-red-600 via-red-500 to-orange-500",
    shadowColor: "shadow-red-500/20",
    connectPath: "#",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.35, ease: "easeOut" },
  }),
};

export default function Connections() {
  const navigate = useNavigate();
  const { connectedAccounts, disconnectAccount, isConnected } =
    useConnectionStore();

  const getAccount = (platform: Platform) =>
    connectedAccounts.find((a) => a.platform === platform);

  return (
    <div className="flex flex-col gap-6">
      <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp}>
        <h1 className="text-xl font-bold text-foreground">Connections</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your connected social media accounts.
        </p>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PLATFORMS.map((p, i) => {
          const connected = isConnected(p.platform);
          const account = getAccount(p.platform);

          return (
            <motion.div
              key={p.platform}
              initial="hidden"
              animate="visible"
              custom={i + 1}
              variants={fadeUp}
              className="spotlight-card flex flex-col rounded-xl p-6"
            >
              {/* Platform icon + status */}
              <div className="mb-4 flex items-start justify-between">
                <div
                  className={cn(
                    "flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg",
                    p.gradient,
                    p.shadowColor
                  )}
                >
                  {p.icon}
                </div>
                {connected && (
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-400">
                    <CheckCircle2 className="size-3" />
                    Connected
                  </span>
                )}
              </div>

              {/* Name + description */}
              <h3 className="mb-1 text-base font-bold text-foreground">
                {p.name}
              </h3>
              <p className="mb-5 text-[13px] leading-relaxed text-muted-foreground">
                {p.description}
              </p>

              {/* Connected account info */}
              {connected && account && (
                <div className="mb-5 flex items-center gap-3 rounded-lg border border-border bg-secondary/40 p-3">
                  <img
                    src={account.avatarUrl}
                    alt={account.displayName}
                    className="size-9 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {account.displayName}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      @{account.username} · {(account.followers / 1000).toFixed(1)}K followers
                    </p>
                  </div>
                </div>
              )}

              {/* Action button */}
              <div className="mt-auto">
                {connected ? (
                  <button
                    onClick={() => disconnectAccount(p.platform)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:border-red-500/40 hover:bg-red-500/5 hover:text-red-400"
                  >
                    <Unlink className="size-4" />
                    Disconnect
                  </button>
                ) : p.connectPath === "#" ? (
                  <button
                    disabled
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-2.5 text-sm font-semibold text-muted-foreground opacity-50"
                  >
                    <LinkIcon className="size-4" />
                    Coming Soon
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(p.connectPath)}
                    className={cn(
                      "flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl active:scale-[0.98]",
                      p.gradient,
                      p.shadowColor
                    )}
                  >
                    <LinkIcon className="size-4" />
                    Connect
                    <ArrowRight className="size-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
