import React from "react";
import { Dashboard } from "../components/Dashboard";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { Lock } from "lucide-react";

export const CitizenDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { view } = useParams<{ view: string }>();

  // Retrieve initialView from route parameter, fallback to state or "home"
  const initialView = view || location.state?.initialView || "home";

  const guestProfile = {
    id: "guest",
    name: "Guest Explorer",
    full_name: "Guest Explorer",
    username: "Guest",
    email: "guest@ecoverzz.io",
    phone: "",
    role: "Investor",
    ecoPoints: 0,
    scannedItemsCount: 0,
    rank: "Guest Explorer",
    joinedAt: new Date().toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
  };

  const isAuthRequiredView = ["passport", "rewards", "missions"].includes(initialView);

  if (!user && isAuthRequiredView) {
    return (
      <div className="min-h-[500px] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-3xl p-8 text-center backdrop-blur-xl shadow-2xl relative overflow-hidden"
        >
          <div className="absolute -right-20 -top-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-6 text-amber-400">
            <Lock className="w-8 h-8 animate-pulse" />
          </div>
          
          <h2 className="text-xl font-extrabold text-white tracking-tight mb-3">
            Achievements & Passport Locked
          </h2>
          
          <p className="text-sm text-slate-400 leading-relaxed mb-8">
            You are browsing EcoVerzz as a guest. Please log in or create an account to unlock your Eco Passport, track achievements, earn badges, and redeem sustainability rewards.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => navigate("/login", { state: { redirectTo: `/citizen/${initialView}` } })}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Sign In to Account</span>
            </button>
            <button
              onClick={() => navigate("/register", { state: { redirectTo: `/citizen/${initialView}` } })}
              className="w-full py-3 px-4 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-750 transition-all cursor-pointer"
            >
              <span>Create Free Account</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <Dashboard
      profile={user || guestProfile}
      onLogout={logout}
      initialView={initialView}
      onBackToWebsite={() => navigate("/")}
      hideSidebar={true}
    />
  );
};

export default CitizenDashboard;
