import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ShieldAlert,
  Users,
  Cpu,
  Activity,
  CheckCircle2,
  Lock,
  Sparkles,
  RefreshCw,
  Sliders,
} from "lucide-react";
import { toast } from "sonner";

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [temperature, setTemperature] = useState(0.2);
  const [modelName, setModelName] = useState("EcoVerzz-LLM-v4.2-ESG");

  // Strict Role Check Guard: Only Admin users allowed
  if (user && user.role !== "Admin") {
    toast.error("Access Denied", {
      description: "Admin panel requires elevated administrator privileges.",
    });
    return <Navigate to="/dashboard" replace />;
  }

  const handleTuneModel = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("AI Model Tuned", {
      description: `Hyperparameters updated: ${modelName} set to temperature ${temperature}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Admin Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 p-6 rounded-3xl border border-amber-500/30">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold mb-2">
            <Lock className="w-3 h-3" />
            <span>Administrator Restricted Access</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-amber-400" />
            <span>Admin Control Panel</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            System administration, user access management, and AI engine hyperparameter tuning
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
            System Health: 100%
          </span>
        </div>
      </div>

      {/* Admin Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <span className="text-xs font-semibold text-slate-400 uppercase">Total Users</span>
          <h3 className="text-xl font-extrabold text-slate-100 font-mono mt-1">1,420</h3>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">+42 this week</span>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <span className="text-xs font-semibold text-slate-400 uppercase">Active AI Models</span>
          <h3 className="text-xl font-extrabold text-teal-300 font-mono mt-1">4 Engines</h3>
          <span className="text-[11px] text-slate-400 mt-1 block">FastAPI Connected</span>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <span className="text-xs font-semibold text-slate-400 uppercase">Daily API Requests</span>
          <h3 className="text-xl font-extrabold text-cyan-300 font-mono mt-1">84,500</h3>
          <span className="text-[11px] text-cyan-400 mt-1 block">Avg Response: 42ms</span>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <span className="text-xs font-semibold text-slate-400 uppercase">ESG Audit Verifications</span>
          <h3 className="text-xl font-extrabold text-amber-300 font-mono mt-1">100% Verified</h3>
          <span className="text-[11px] text-amber-400 mt-1 block">SEBI & Green Audit</span>
        </div>
      </div>

      {/* AI Hyperparameters Form & System Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Engine Tuning */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <span>AI Model Hyperparameter Tuning</span>
          </h3>

          <form onSubmit={handleTuneModel} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Active AI Model</label>
              <input
                type="text"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-slate-400 font-semibold">Model Temperature</label>
                <span className="font-mono text-amber-400 font-bold">{temperature}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-md shadow-amber-500/20"
            >
              Apply AI Hyperparameters
            </button>
          </form>
        </div>

        {/* User Roles Table */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-400" />
            <span>System User Accounts</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold">
                  <th className="py-2.5 px-3">User</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 font-medium">
                {[
                  { name: "Guruprasanth (Admin)", email: "admin@ecoverzz.ai", role: "Admin", status: "Active" },
                  { name: "Sarah Jenkins", email: "analyst@ecoverzz.ai", role: "Analyst", status: "Active" },
                  { name: "Rahul Sharma", email: "investor@ecoverzz.ai", role: "Investor", status: "Active" },
                ].map((u, i) => (
                  <tr key={i} className="hover:bg-slate-800/40">
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-100">{u.name}</p>
                      <p className="text-[10px] text-slate-500">{u.email}</p>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="text-emerald-400 font-bold text-[10px]">● {u.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
