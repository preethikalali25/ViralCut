import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Sparkles,
  ArrowRight,
  BarChart3,
  Music,
  Video,
  Wand2,
  Clock,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useConnectionStore } from "@/stores/connectionStore";
import connectBg from "@/assets/connect-tiktok-bg.jpg";

type OnboardingStep = "welcome" | "features" | "connect";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.41a8.16 8.16 0 0 0 4.77 1.52V7.56a4.85 4.85 0 0 1-1.01-.87Z" />
    </svg>
  );
}

const fadeSlide = {
  hidden: { opacity: 0, x: 40 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
  exit: { opacity: 0, x: -40, transition: { duration: 0.3 } },
};

const PLATFORM_FEATURES = [
  {
    icon: Video,
    title: "Smart Video Processing",
    desc: "AI auto-edits, reframes, and optimizes your raw footage for maximum engagement",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    icon: Music,
    title: "Trending Audio Matching",
    desc: "Automatically pairs your content with the hottest sounds on TikTok",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    icon: Wand2,
    title: "Hook & Caption Engine",
    desc: "AI generates scroll-stopping hooks and viral captions tailored to your niche",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    desc: "Track views, retention, and FYP performance in real-time",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: Clock,
    title: "Smart Scheduling",
    desc: "Post at the optimal time based on your audience activity",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Zap,
    title: "Batch Processing",
    desc: "Upload multiple videos and let AI optimize them all simultaneously",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { completeOnboarding } = useConnectionStore();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");

  const handleContinueToFeatures = () => setCurrentStep("features");
  const handleContinueToConnect = () => setCurrentStep("connect");

  const handleConnectTikTok = () => {
    navigate("/connect/tiktok");
  };

  const handleSkip = () => {
    completeOnboarding();
    navigate("/");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={connectBg}
          alt=""
          className="size-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/85" />
      </div>

      {/* Gradient orbs */}
      <div className="absolute left-1/4 top-1/3 size-[500px] rounded-full bg-[hsl(270_80%_50%/0.06)] blur-[140px]" />
      <div className="absolute bottom-1/3 right-1/4 size-[400px] rounded-full bg-[hsl(180_80%_50%/0.06)] blur-[120px]" />

      {/* Step indicators */}
      <div className="absolute left-1/2 top-8 z-20 flex -translate-x-1/2 items-center gap-2">
        {(["welcome", "features", "connect"] as OnboardingStep[]).map(
          (s, idx) => (
            <div
              key={s}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                currentStep === s
                  ? "w-8 bg-primary"
                  : idx < ["welcome", "features", "connect"].indexOf(currentStep)
                    ? "w-4 bg-primary/50"
                    : "w-4 bg-muted-foreground/20"
              )}
            />
          )
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl px-6">
        <AnimatePresence mode="wait">
          {/* ── STEP 1: Welcome ── */}
          {currentStep === "welcome" && (
            <motion.div
              key="welcome"
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col items-center text-center"
            >
              <motion.div custom={0} variants={fadeSlide} className="mb-8">
                <div className="mx-auto mb-5 flex size-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/20 to-violet-500/20 shadow-xl shadow-primary/10">
                  <Sparkles className="size-10 text-primary" />
                </div>
              </motion.div>

              <motion.h1
                custom={1}
                variants={fadeSlide}
                className="mb-4 text-4xl font-bold leading-tight tracking-tight text-foreground"
              >
                Welcome to{" "}
                <span className="bg-gradient-to-r from-primary via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  ViralCut
                </span>
              </motion.h1>

              <motion.p
                custom={2}
                variants={fadeSlide}
                className="mb-6 max-w-md text-lg text-muted-foreground"
              >
                Turn raw videos into viral content with AI-powered editing,
                trending audio, and smart publishing.
              </motion.p>

              <motion.div
                custom={3}
                variants={fadeSlide}
                className="mb-10 flex items-center gap-6 text-sm text-muted-foreground"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-400" />
                  <span>No editing skills needed</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-400" />
                  <span>2-minute processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-400" />
                  <span>Multi-platform</span>
                </div>
              </motion.div>

              <motion.button
                custom={4}
                variants={fadeSlide}
                onClick={handleContinueToFeatures}
                className="group flex items-center gap-3 rounded-2xl bg-primary px-10 py-4 text-base font-bold text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:shadow-xl hover:shadow-primary/35 active:scale-[0.98]"
              >
                Get Started
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              </motion.button>

              <motion.button
                custom={5}
                variants={fadeSlide}
                onClick={handleSkip}
                className="mt-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Skip onboarding
              </motion.button>
            </motion.div>
          )}

          {/* ── STEP 2: Features Overview ── */}
          {currentStep === "features" && (
            <motion.div
              key="features"
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col items-center"
            >
              <motion.h2
                custom={0}
                variants={fadeSlide}
                className="mb-2 text-center text-2xl font-bold text-foreground"
              >
                Everything you need to go viral
              </motion.h2>
              <motion.p
                custom={1}
                variants={fadeSlide}
                className="mb-8 text-center text-sm text-muted-foreground"
              >
                ViralCut handles the hard work so you can focus on creating
              </motion.p>

              <motion.div
                custom={2}
                variants={fadeSlide}
                className="mb-10 grid w-full grid-cols-2 gap-3"
              >
                {PLATFORM_FEATURES.map((feature, idx) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + idx * 0.08, duration: 0.4 }}
                    className="flex items-start gap-3 rounded-xl border border-border/50 bg-card/60 p-4 backdrop-blur-sm transition-colors hover:border-border hover:bg-card/80"
                  >
                    <div
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-lg",
                        feature.bg
                      )}
                    >
                      <feature.icon className={cn("size-4.5", feature.color)} />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-foreground">
                        {feature.title}
                      </p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                        {feature.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.button
                custom={3}
                variants={fadeSlide}
                onClick={handleContinueToConnect}
                className="group flex items-center gap-3 rounded-2xl bg-primary px-10 py-4 text-base font-bold text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:shadow-xl hover:shadow-primary/35 active:scale-[0.98]"
              >
                Connect Your Account
                <ChevronRight className="size-5 transition-transform group-hover:translate-x-1" />
              </motion.button>

              <motion.button
                custom={4}
                variants={fadeSlide}
                onClick={handleSkip}
                className="mt-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Skip for now
              </motion.button>
            </motion.div>
          )}

          {/* ── STEP 3: Connect TikTok ── */}
          {currentStep === "connect" && (
            <motion.div
              key="connect"
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col items-center text-center"
            >
              <motion.div custom={0} variants={fadeSlide} className="mb-6">
                <div className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500/20 to-pink-500/20 shadow-xl shadow-cyan-500/10">
                  <TikTokIcon className="size-10 text-cyan-400" />
                </div>
              </motion.div>

              <motion.h2
                custom={1}
                variants={fadeSlide}
                className="mb-3 text-2xl font-bold text-foreground"
              >
                Connect TikTok to get started
              </motion.h2>
              <motion.p
                custom={2}
                variants={fadeSlide}
                className="mb-8 max-w-md text-sm text-muted-foreground"
              >
                Link your TikTok account so ViralCut can match trending sounds,
                optimize hooks for the FYP, and auto-publish your content.
              </motion.p>

              {/* Benefits list */}
              <motion.div
                custom={3}
                variants={fadeSlide}
                className="mb-8 flex w-full max-w-sm flex-col gap-3"
              >
                {[
                  {
                    icon: Music,
                    text: "Access trending sounds & audio",
                    color: "text-cyan-400",
                  },
                  {
                    icon: BarChart3,
                    text: "Track FYP performance & analytics",
                    color: "text-violet-400",
                  },
                  {
                    icon: Clock,
                    text: "Auto-publish at optimal times",
                    color: "text-amber-400",
                  },
                ].map((item) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-3 rounded-xl border border-border/40 bg-card/50 px-4 py-3 text-left backdrop-blur-sm"
                  >
                    <item.icon className={cn("size-5 shrink-0", item.color)} />
                    <span className="text-[13px] font-medium text-foreground">
                      {item.text}
                    </span>
                  </div>
                ))}
              </motion.div>

              <motion.div
                custom={4}
                variants={fadeSlide}
                className="flex w-full flex-col items-center gap-4"
              >
                <button
                  onClick={handleConnectTikTok}
                  className="group flex w-full max-w-sm items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-pink-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-cyan-500/35 active:scale-[0.98]"
                >
                  <TikTokIcon className="size-5" />
                  Connect TikTok
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={handleSkip}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  I'll do this later
                </button>
              </motion.div>

              <motion.p
                custom={5}
                variants={fadeSlide}
                className="mt-8 text-[11px] text-muted-foreground/50"
              >
                Secure OAuth 2.0 connection · We never store your password ·
                Revoke anytime in Settings
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
