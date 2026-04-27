import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";

const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Upload = lazy(() => import("@/pages/Upload"));
const Editor = lazy(() => import("@/pages/Editor"));
const Library = lazy(() => import("@/pages/Library"));
const Analytics = lazy(() => import("@/pages/Analytics"));

function LoadingFallback() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="size-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route
          index
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Dashboard />
            </Suspense>
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
      </Route>
    </Routes>
  );
}
