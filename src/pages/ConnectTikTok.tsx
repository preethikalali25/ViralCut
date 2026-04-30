import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  CheckCircle2,
  ArrowRight,
  Shield,
  RefreshCw,
  Users,
  BarChart3,
  Video,
  Music,
  Loader2,
  ChevronRight,
  AlertCircle,
  ExternalLink,
  WifiOff,
  KeyRound,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useConnectionStore } from "@/stores/connectionStore";
import { supabase } from "@/lib/supabase";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { toast } from "sonner";
import connectBg from "@/assets/connect-tiktok-bg.jpg";

type FlowStep = "welcome" | "connecting" | "done" | "error";
type ErrorType = "network" | "auth" | "config" | "timeout" | "unknown";

const FEATURES = [
  {
    icon: Music,
    title: "Trending Sounds",
    desc: "Auto-match viral audio to your clips",
  },
  {
    icon: Zap,
    title: "Hook Engine",
    desc: "TikTok-optimized scroll stoppers",
  },
  {
    icon: BarChart3,
    title: "FYP Analytics",
    desc: "Track what lands on the For You page",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
  exit: { opacity: 0, y: -12, transition: { duration: 0.25 } },
};

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.41a8.16 8.16 0 0 0 4.77 1.52V7.56a4.85 4.85 0 0 1-1.01-.87Z" />
    </svg>
  );
}

/**
 * Parse TikTok error messages into user-friendly messages with error type classification
 */
function parseErrorMessage(raw: string): { message: string; type: ErrorType } {
  const lower = raw.toLowerCase();

  if (lower.includes("client_key") || lower.includes("client key") || lower.includes("invalid client")) {
    return {
      message: "TikTok rejected the app credentials. The Client Key may be invalid or the app isn't properly configured in TikTok Developer Portal.",
      type: "config",
    };
  }
  if (lower.includes("redirect_uri") || lower.includes("redirect uri") || lower.includes("callback")) {
    return {
      message: "The redirect URL isn't registered in TikTok Developer Portal. Contact the developer to fix the Login Kit configuration.",
      type: "config",
    };
  }
  if (lower.includes("access_denied") || lower.includes("user_cancelled") || lower.includes("denied")) {
    return {
      message: "You cancelled the TikTok authorization. You'll need to accept the permissions to connect your account.",
      type: "auth",
    };
  }
  if (lower.includes("scope") || lower.includes("permission")) {
    return {
      message: "The requested permissions aren't approved for this TikTok app. Contact the developer to verify scope configuration.",
      type: "config",
    };
  }
  if (lower.includes("network") || lower.includes("failed to fetch") || lower.includes("econnrefused")) {
    return {
      message: "Unable to reach the server. Check your internet connection and try again.",
      type: "network",
    };
  }
  if (lower.includes("timeout") || lower.includes("timed out")) {
    return {
      message: "The request took too long. The server may be temporarily slow — try again in a moment.",
      type: "timeout",
    };
  }
  if (lower.includes("token") || lower.includes("expired")) {
    return {
      message: "Authentication token issue. Please try connecting again from the start.",
      type: "auth",
    };
  }

  return {
    message: raw || "Something went wrong while connecting to TikTok. Please try again.",
    type: "unknown",
  };
}

export default function ConnectTikTok() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { connectAccount, completeOnboarding, isConnected } =
    useConnectionStore();

  const [step, setStep] = useState<FlowStep>("welcome");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorType, setErrorType] = useState<ErrorType>("unknown");
  const [connectingStatus, setConnectingStatus] = useState("Preparing secure connection...");
  const connectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [profile, setProfile] = useState<{
    displayName: string;
    username: string;
    avatarUrl: string;
    followers: number;
  } | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (connectTimeoutRef.current) clearTimeout(connectTimeoutRef.current);
    };
  }, []);

  // Handle callback params from TikTok OAuth redirect
  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    const openId = searchParams.get("open_id");

    if (success === "true" && openId) {
      const displayName = searchParams.get("display_name") || "TikTok User";
      const username = searchParams.get("username") || openId;
      const avatarUrl = searchParams.get("avatar_url") || "";
      const followerCount = parseInt(searchParams.get("follower_count") || "0", 10);

      setProfile({
        displayName,
        username,
        avatarUrl,
        followers: followerCount,
      });

      connectAccount({
        platform: "tiktok",
        username,
        displayName,
        avatarUrl,
        followers: followerCount,
        connectedAt: new Date().toISOString(),
      });

      toast.success("TikTok connected successfully!");
      setStep("done");
      // Clean URL params
      window.history.replaceState({}, "", "/connect/tiktok");
    } else if (error) {
      const decodedError = decodeURIComponent(error);
      const { message, type } = parseErrorMessage(decodedError);
      setErrorMessage(message);
      setErrorType(type);
      setStep("error");
      window.history.replaceState({}, "", "/connect/tiktok");
    }
  }, [searchParams, connectAccount]);

  const handleStartConnect = useCallback(async () => {
    setStep("connecting");
    setConnectingStatus("Preparing secure connection...");

    // Set a timeout for the initial request (15s)
    connectTimeoutRef.current = setTimeout(() => {
      setErrorMessage("Connection timed out. The server took too long to respond.");
      setErrorType("timeout");
      setStep("error");
    }, 15000);

    try {
      setConnectingStatus("Contacting ViralCut servers...");

      const { data, error } = await supabase.functions.invoke("tiktok-auth", {
        body: {
          action: "get-auth-url",
          redirect_uri: window.location.origin,
          state: crypto.randomUUID(),
        },
      });

      // Clear timeout on response
      if (connectTimeoutRef.current) {
        clearTimeout(connectTimeoutRef.current);
        connectTimeoutRef.current = null;
      }

      if (error) {
        console.error("Failed to get auth URL:", error);
        let errorMsg = "Failed to initiate TikTok connection.";
        if (error instanceof FunctionsHttpError) {
          try {
            const statusCode = error.context?.status ?? 500;
            const textContent = await error.context?.text();
            errorMsg = `[Code: ${statusCode}] ${textContent || error.message || "Unknown error"}`;
          } catch {
            errorMsg = error.message || "Failed to read response";
          }
        }
        const { message, type } = parseErrorMessage(errorMsg);
        setErrorMessage(message);
        setErrorType(type);
        setStep("error");
        return;
      }

      if (data?.auth_url) {
        setConnectingStatus("Redirecting to TikTok...");
        console.log("Redirecting to TikTok auth:", data.auth_url);
        // Small delay so user sees the status change
        await new Promise((r) => setTimeout(r, 500));
        window.location.href = data.auth_url;
      } else {
        setErrorMessage("Invalid response from server. No authorization URL received.");
        setErrorType("config");
        setStep("error");
      }
    } catch (err: any) {
      if (connectTimeoutRef.current) {
        clearTimeout(connectTimeoutRef.current);
        connectTimeoutRef.current = null;
      }
      console.error("Error starting TikTok auth:", err);

      // Detect network errors
      if (err.message?.includes("Failed to fetch") || err.message?.includes("NetworkError")) {
        setErrorMessage("Unable to reach the server. Check your internet connection and try again.");
        setErrorType("network");
      } else {
        const { message, type } = parseErrorMessage(err.message || "An unexpected error occurred.");
        setErrorMessage(message);
        setErrorType(type);
      }
      setStep("error");
    }
  }, []);

  const handleFinish = () => {
    completeOnboarding();
    navigate("/");
  };

  const handleSkip = () => {
    completeOnboarding();
    navigate("/");
  };

  const handleRetry = () => {
    setErrorMessage("");
    setErrorType("unknown");
    setStep("welcome");
  };

  const handleRetryDirect = () => {
    setErrorMessage("");
    setErrorType("unknown");
    handleStartConnect();
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={connectBg}
          alt=""
          className="size-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/80" />
      </div>

      {/* Gradient orbs */}
      <div className="absolute left-1/4 top-1/4 size-[400px] rounded-full bg-[hsl(180_80%_50%/0.08)] blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 size-[350px] rounded-full bg-[hsl(340_80%_55%/0.08)] blur-[120px]" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-xl px-6">
        <AnimatePresence mode="wait">
          {/* ── STEP: Welcome ── */}
          {step === "welcome" && (
            <motion.div
              key="welcome"
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col items-center text-center"
            >
              <motion.div custom={0} variants={fadeUp} className="mb-8">
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-cyan-500 shadow-lg shadow-cyan-500/25">
                  <TikTokIcon className="size-7 text-white" />
                </div>
                <h2 className="text-sm font-semibold tracking-widest text-muted-foreground">
                  VIRALCUT
                </h2>
              </motion.div>

              <motion.h1
                custom={1}
                variants={fadeUp}
                className="mb-3 text-3xl font-bold leading-tight tracking-tight text-foreground"
              >
                Connect your TikTok
                <br />
                <span className="bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                  to unlock viral reach
                </span>
              </motion.h1>

              <motion.p
                custom={2}
                variants={fadeUp}
                className="mb-10 max-w-md text-base text-muted-foreground"
              >
                Link your TikTok account so ViralCut can match trending sounds,
                optimize hooks for the FYP, and auto-publish your best content.
              </motion.p>

              <motion.div
                custom={3}
                variants={fadeUp}
                className="mb-10 flex flex-wrap justify-center gap-3"
              >
                {FEATURES.map((f) => (
                  <div
                    key={f.title}
                    className="flex items-center gap-2.5 rounded-full border border-border bg-card/60 px-4 py-2.5 backdrop-blur-sm"
                  >
                    <f.icon className="size-4 text-cyan-400" />
                    <div className="text-left">
                      <p className="text-[13px] font-semibold text-foreground">
                        {f.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {f.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>

              <motion.div
                custom={4}
                variants={fadeUp}
                className="flex w-full flex-col items-center gap-4"
              >
                <button
                  onClick={handleStartConnect}
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
                  Skip for now
                </button>
              </motion.div>

              <motion.div
                custom={5}
                variants={fadeUp}
                className="mt-10 flex items-center gap-2 text-[12px] text-muted-foreground/60"
              >
                <Shield className="size-3.5" />
                <span>
                  Secure OAuth 2.0 · We never store your password · Revoke
                  anytime
                </span>
              </motion.div>
            </motion.div>
          )}

          {/* ── STEP: Connecting (loading) ── */}
          {step === "connecting" && (
            <motion.div
              key="connecting"
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col items-center text-center"
            >
              <motion.div custom={0} variants={fadeUp} className="mb-8">
                <div className="relative mx-auto size-20">
                  <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-cyan-400" style={{ animationDuration: '1.5s' }} />
                  <div className="absolute inset-1 animate-spin rounded-full border-2 border-transparent border-b-pink-400" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
                  <div className="absolute inset-3 flex items-center justify-center rounded-full bg-card">
                    <TikTokIcon className="size-7 text-cyan-400" />
                  </div>
                </div>
              </motion.div>

              <motion.h2
                custom={1}
                variants={fadeUp}
                className="mb-2 text-xl font-bold text-foreground"
              >
                Connecting to TikTok…
              </motion.h2>
              <motion.p
                custom={2}
                variants={fadeUp}
                className="mb-2 text-sm text-muted-foreground"
              >
                {connectingStatus}
              </motion.p>
              <motion.div custom={3} variants={fadeUp} className="flex flex-col items-center gap-3">
                <Loader2 className="mx-auto size-5 animate-spin text-cyan-400" />
                <p className="text-[11px] text-muted-foreground/60">
                  You'll be redirected to TikTok to authorize access
                </p>
              </motion.div>

              {/* Cancel button */}
              <motion.div custom={4} variants={fadeUp} className="mt-8">
                <button
                  onClick={() => setStep("welcome")}
                  className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Cancel
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* ── STEP: Error ── */}
          {step === "error" && (
            <motion.div
              key="error"
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col items-center text-center"
            >
              <motion.div
                custom={0}
                variants={fadeUp}
                className="mb-6 flex size-20 items-center justify-center rounded-full bg-red-500/10"
              >
                {errorType === "network" ? (
                  <WifiOff className="size-10 text-red-400" />
                ) : errorType === "timeout" ? (
                  <Clock className="size-10 text-amber-400" />
                ) : errorType === "config" ? (
                  <KeyRound className="size-10 text-orange-400" />
                ) : (
                  <AlertCircle className="size-10 text-red-400" />
                )}
              </motion.div>

              <motion.h2
                custom={1}
                variants={fadeUp}
                className="mb-2 text-xl font-bold text-foreground"
              >
                {errorType === "network"
                  ? "No Connection"
                  : errorType === "timeout"
                    ? "Request Timed Out"
                    : errorType === "config"
                      ? "Configuration Error"
                      : "Connection Failed"}
              </motion.h2>
              <motion.p
                custom={2}
                variants={fadeUp}
                className="mb-4 max-w-sm text-sm text-muted-foreground"
              >
                {errorMessage || "Something went wrong while connecting to TikTok."}
              </motion.p>

              {/* Troubleshooting tips */}
              <motion.div
                custom={3}
                variants={fadeUp}
                className="mb-8 w-full max-w-sm rounded-xl border border-border bg-card/60 p-4 text-left"
              >
                <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Troubleshooting
                </p>
                <ul className="space-y-2 text-[13px] text-muted-foreground">
                  {errorType === "network" && (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                        Check your internet connection
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                        Disable VPN or proxy if active
                      </li>
                    </>
                  )}
                  {errorType === "timeout" && (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                        The server may be temporarily overloaded
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                        Wait a moment and try again
                      </li>
                    </>
                  )}
                  {errorType === "config" && (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                        Verify your TikTok Client Key is correct
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                        Ensure the redirect URI is registered in TikTok Developer Portal
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                        Check Login Kit is enabled for your TikTok app
                      </li>
                    </>
                  )}
                  {errorType === "auth" && (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                        You may have denied access — try again and accept permissions
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                        Ensure your TikTok account is in good standing
                      </li>
                    </>
                  )}
                  {errorType === "unknown" && (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                        Try again — this may be a temporary issue
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                        Clear your browser cache and retry
                      </li>
                    </>
                  )}
                </ul>
              </motion.div>

              <motion.div
                custom={4}
                variants={fadeUp}
                className="flex flex-col items-center gap-3"
              >
                <button
                  onClick={errorType === "network" || errorType === "timeout" ? handleRetryDirect : handleRetry}
                  className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-pink-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-cyan-500/35 active:scale-[0.98]"
                >
                  <RefreshCw className="size-5" />
                  Try Again
                </button>
                <button
                  onClick={handleSkip}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Skip for now
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* ── STEP: Done ── */}
          {step === "done" && (
            <motion.div
              key="done"
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col items-center text-center"
            >
              <motion.div
                custom={0}
                variants={fadeUp}
                className="mb-6 flex size-20 items-center justify-center rounded-full bg-emerald/10"
              >
                <CheckCircle2 className="size-10 text-emerald" />
              </motion.div>

              <motion.h2
                custom={1}
                variants={fadeUp}
                className="mb-2 text-2xl font-bold text-foreground"
              >
                TikTok Connected!
              </motion.h2>
              <motion.p
                custom={2}
                variants={fadeUp}
                className="mb-8 text-sm text-muted-foreground"
              >
                Your account is linked and ready for viral content.
              </motion.p>

              {profile && (
                <motion.div
                  custom={3}
                  variants={fadeUp}
                  className="mb-8 w-full max-w-sm rounded-2xl border border-border bg-card/80 p-6 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-4">
                    {profile.avatarUrl ? (
                      <img
                        src={profile.avatarUrl}
                        alt={profile.displayName}
                        className="size-14 rounded-full border-2 border-cyan-500/40 object-cover"
                      />
                    ) : (
                      <div className="flex size-14 items-center justify-center rounded-full border-2 border-cyan-500/40 bg-cyan-500/10">
                        <TikTokIcon className="size-7 text-cyan-400" />
                      </div>
                    )}
                    <div className="text-left">
                      <p className="text-base font-bold text-foreground">
                        {profile.displayName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        @{profile.username}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between rounded-xl bg-secondary/60 px-4 py-3">
                    <div className="text-center">
                      <p className="font-mono text-lg font-bold text-foreground">
                        {profile.followers >= 1000
                          ? `${(profile.followers / 1000).toFixed(1)}K`
                          : profile.followers}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Followers
                      </p>
                    </div>
                    <div className="h-8 w-px bg-border" />
                    <div className="text-center">
                      <p className="font-mono text-lg font-bold text-foreground">
                        0
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Optimized
                      </p>
                    </div>
                    <div className="h-8 w-px bg-border" />
                    <div className="flex items-center gap-1.5">
                      <div className="size-2 rounded-full bg-emerald" />
                      <span className="text-[12px] font-semibold text-emerald">
                        Connected
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              <motion.div custom={4} variants={fadeUp}>
                <button
                  onClick={handleFinish}
                  className="group flex items-center gap-2 rounded-2xl bg-primary px-10 py-4 text-base font-bold text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:shadow-xl hover:shadow-primary/35 active:scale-[0.98]"
                >
                  Go to Dashboard
                  <ChevronRight className="size-5 transition-transform group-hover:translate-x-1" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
