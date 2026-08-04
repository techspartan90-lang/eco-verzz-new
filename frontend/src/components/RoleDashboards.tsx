import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Building2, Shield, Activity, TrendingUp, DollarSign, PieChart, BarChart3, 
  FileSpreadsheet, Lock, AlertOctagon, CheckCircle2, ArrowRight, ShieldCheck 
} from "lucide-react";
import { api } from "../services/api";
import { UserProfile } from "../context/AuthContext";
import { AdminDashboard } from "./AdminDashboard";

interface RoleDashboardProps {
  profile: UserProfile;
  onBackToWebsite: () => void;
}

import { AnalyticsModule } from "./AnalyticsModule";

// ----------------------------------------------------
// ANALYST DASHBOARD VIEW
// ----------------------------------------------------
export const AnalystDashboardView: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getAnalystReports()
      .then((res) => setData(res))
      .catch((err) => setError(err.detail || "Failed to fetch analyst report"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <AnalyticsModule />
    </div>
  );
};

// ----------------------------------------------------
// INVESTOR DASHBOARD VIEW
// ----------------------------------------------------
export const InvestorDashboardView: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getInvestorPortfolio()
      .then((res) => setData(res))
      .catch((err) => setError(err.detail || "Failed to fetch investor portfolio"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <AnalyticsModule />
    </div>
  );
};

// ----------------------------------------------------
// ROLE-BASED CONTAINER WRAPPER
// ----------------------------------------------------
export const RoleBasedDashboardContainer: React.FC<RoleDashboardProps> = ({ profile, onBackToWebsite }) => {
  const [activeRoleView, setActiveRoleView] = useState<string>(profile.role || "Investor");
  const [accessDeniedMessage, setAccessDeniedMessage] = useState<string | null>(null);

  const userRole = (profile.role || "Investor").capitalize ? profile.role : "Investor";

  const handleSwitchRoleView = (targetRole: "Investor" | "Analyst" | "Admin") => {
    setAccessDeniedMessage(null);
    if (userRole === "Admin") {
      setActiveRoleView(targetRole);
      return;
    }
    if (userRole === "Analyst" && (targetRole === "Analyst" || targetRole === "Investor")) {
      setActiveRoleView(targetRole);
      return;
    }
    if (userRole === "Investor" && targetRole === "Investor") {
      setActiveRoleView(targetRole);
      return;
    }

    setAccessDeniedMessage(`Access Restricted: Your role '${userRole}' does not have permission for '${targetRole}' endpoints.`);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans pb-12">
      {/* Role Navigation Bar */}
      <div className="bg-slate-950/90 border-b border-slate-800 px-6 py-3 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="text-slate-400">AUTHENTICATED ROLE:</span>
          <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
            {userRole}
          </span>
          <span className="text-slate-500">• {profile.email}</span>
        </div>

        {/* Role View Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 mr-1">View Dashboard:</span>
          {(["Investor", "Analyst", "Admin"] as const).map((r) => (
            <button
              key={r}
              onClick={() => handleSwitchRoleView(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeRoleView === r
                  ? "bg-emerald-500 text-slate-950 shadow-md"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {r} View
            </button>
          ))}
        </div>
      </div>

      {accessDeniedMessage && (
        <div className="max-w-7xl mx-auto mt-4 px-6">
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-rose-400" />
              <span>{accessDeniedMessage}</span>
            </div>
            <button
              onClick={() => setActiveRoleView(userRole)}
              className="px-3 py-1 rounded-lg bg-rose-500/20 text-rose-200 hover:bg-rose-500/30 transition-all cursor-pointer"
            >
              Return to My {userRole} Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Render Active View */}
      {activeRoleView === "Admin" ? (
        <AdminDashboard profile={profile} onBackToWebsite={onBackToWebsite} />
      ) : activeRoleView === "Analyst" ? (
        <AnalystDashboardView profile={profile} />
      ) : (
        <InvestorDashboardView profile={profile} />
      )}
    </div>
  );
};
