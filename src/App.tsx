import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { useConnectionStore } from "@/stores/connectionStore";

const Onboarding = lazy(() => import("@/pages/Onboarding"));
const ConnectTikTok = lazy(() => import("@/pages/ConnectTikTok"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Upload = lazy(() => import("@/pages/Upload"));
const Editor = lazy(() => import("@/pages/Editor"));
const Library = lazy(() => import("@/pages/Library"));
const Analytics = lazy(() => import("@/pages/Analytics"));
const Team = lazy(() => import("@/pages/Team"));
const Connections = lazy(() => import("@/pages/Connections"));

function LoadingFallback() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="size-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
    </div>
  );
}

export default function App() {
  const onboardingComplete = useConnectionStore((s) => s.onboardingComplete);

  return (
    <Routes>
      {/* Onboarding route */}
      <Route
        path="/connect"
        element={
          onboardingComplete ? (
            <Navigate to="/" replace />
          ) : (
            <Suspense fallback={<LoadingFallback />}>
              <Onboarding />
            </Suspense>
          )
        }
      />
      <Route
        path="/connect/tiktok"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <ConnectTikTok />
          </Suspense>
        }
      />

      <Route element={<AppLayout />}>
        <Route
          index
          element={
            !onboardingComplete ? (
              <Navigate to="/connect" replace />
            ) : (
              <Suspense fallback={<LoadingFallback />}>
                <Dashboard />
              </Suspense>
            )
          }
        />
        <Route
          path="upload"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Upload />
            </Suspense>
          }
        />
        <Route
          path="editor/:id?"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Editor />
            </Suspense>
          }
        />
        <Route
          path="library"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Library />
            </Suspense>
          }
        />
        <Route
          path="analytics"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Analytics />
            </Suspense>
          }
        />
        <Route
          path="team"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Team />
            </Suspense>
          }
        />
        <Route
          path="connections"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Connections />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}
