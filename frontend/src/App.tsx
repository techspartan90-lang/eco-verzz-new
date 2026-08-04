import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { PublicRoute } from "./routes/PublicRoute";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { EcoVerzzWebsite } from "./components/EcoVerzzWebsite";
import { useAuth } from "./context/AuthContext";
import { Leaf } from "lucide-react";
import { motion } from "motion/react";

// Code Splitting & Lazy Loading of Dashboard & Sub-pages
const DashboardPage = lazy(() => import("./pages/Dashboard"));
const PortfolioPage = lazy(() => import("./pages/Portfolio"));
const MutualFundsPage = lazy(() => import("./pages/MutualFunds"));
const ComparePage = lazy(() => import("./pages/Compare"));
const ReportsPage = lazy(() => import("./pages/Reports"));
const WatchlistPage = lazy(() => import("./pages/Watchlist"));
const NotificationsPage = lazy(() => import("./pages/Notifications"));
const SettingsPage = lazy(() => import("./pages/Settings"));
const AdminPage = lazy(() => import("./pages/Admin"));

// Lazy load AI Recommendation engine module page
const AiDashboardPage = lazy(() => import("./pages/AiDashboard"));

// Loading Fallback Spinner
const PageLoadingSpinner: React.FC = () => (
  <div className="min-h-[400px] w-full flex flex-col items-center justify-center p-8 text-slate-400">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
      className="p-3 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-3"
    >
      <Leaf className="w-6 h-6" />
    </motion.div>
    <p className="text-xs font-semibold tracking-wide">Loading EcoVerzz module...</p>
  </div>
);

const RootIndexRoute: React.FC = () => {
  return <EcoVerzzWebsite />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoadingSpinner />}>
        <Routes>
          {/* Public Landing Website / Index */}
          <Route path="/" element={<RootIndexRoute />} />

          {/* Public Authentication Routes (Redirect to /dashboard if logged in) */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Protected SaaS Application Shell Routes */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/mutual-funds" element={<MutualFundsPage />} />
            <Route path="/recommendations" element={<AiDashboardPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
