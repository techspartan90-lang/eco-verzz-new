import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, Award, Coins, Leaf, Trophy, Flame, CheckCircle, Camera, 
  Calendar, ArrowRight, Share2, Download, ShieldCheck, Zap, Heart, 
  Star, Clock, ChevronRight, Lock, Check
} from "lucide-react";
import { UserProfile } from "../types";

interface UserDashboardProps {
  profile: UserProfile;
  onBackToWebsite: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ profile, onBackToWebsite }) => {
  const [activeTab, setActiveTab] = useState<"overview" | "wallet" | "scans" | "badges" | "certificates">("overview");
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShareCert = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans pb-16">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#0a0d14]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBackToWebsite}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all cursor-pointer"
            >
              ← Back to Main Platform
            </button>
            <div className="h-5 w-px bg-slate-800 hidden sm:block" />
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-400" />
              <span className="font-bold tracking-tight text-sm uppercase text-slate-100">Citizen Eco Portal</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>{profile.ecoPoints} EcoPoints</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-xs text-slate-950">
              {profile.username.substring(0, 2).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-emerald-500/20 bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 mb-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-300 p-1 shadow-xl shadow-emerald-500/20 shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <User className="w-8 h-8 text-emerald-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white">{profile.username}</h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
                    {profile.rank}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Member since {profile.joinedAt} • Municipal Citizen ID: #ECO-94821</p>
                <div className="flex items-center gap-4 mt-3 text-xs">
                  <span className="flex items-center gap-1 text-slate-300 font-medium">
                    <Flame className="w-4 h-4 text-amber-400" /> 14 Day Action Streak
                  </span>
                  <span className="flex items-center gap-1 text-slate-300 font-medium">
                    <Trophy className="w-4 h-4 text-emerald-400" /> Rank #4 Municipal Leaderboard
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button className="px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center gap-2">
                <Camera className="w-4 h-4" /> Scan Waste Now
              </button>
              <button 
                onClick={handleShareCert}
                className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition-all cursor-pointer flex items-center gap-2"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                {copiedLink ? "Link Copied!" : "Share Profile"}
              </button>
            </div>
          </div>
        </div>

        {/* Core Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
            <div className="text-xs text-slate-400 font-medium mb-1">Total Waste Segregated</div>
            <div className="text-2xl font-extrabold text-white">{profile.scannedItemsCount} <span className="text-xs font-normal text-slate-400">items</span></div>
            <div className="text-[11px] text-emerald-400 mt-2 font-medium">100% Verified by YOLO AI</div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
            <div className="text-xs text-slate-400 font-medium mb-1">CO₂ Emissions Diverted</div>
            <div className="text-2xl font-extrabold text-emerald-400">184.2 <span className="text-xs font-normal text-slate-400">kg CO₂</span></div>
            <div className="text-[11px] text-slate-400 mt-2">Equivalent to planting 9 trees</div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
            <div className="text-xs text-slate-400 font-medium mb-1">Rainforest Trees Planted</div>
            <div className="text-2xl font-extrabold text-teal-400">4 <span className="text-xs font-normal text-slate-400">trees</span></div>
            <div className="text-[11px] text-teal-400 mt-2">Madagascar Conservation Zone</div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
            <div className="text-xs text-slate-400 font-medium mb-1">Redeemable EcoVault</div>
            <div className="text-2xl font-extrabold text-amber-400">{profile.ecoPoints} <span className="text-xs font-normal text-slate-400">Coins</span></div>
            <div className="text-[11px] text-amber-400 mt-2">Ready for Marketplace</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 mb-6 pb-2 overflow-x-auto">
          {[
            { id: "overview", label: "Dashboard & Missions" },
            { id: "scans", label: "Waste Scan History" },
            { id: "wallet", label: "Rewards Vault" },
            { id: "badges", label: "Badges & Ranks" },
            { id: "certificates", label: "Verified Certificates" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id 
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Daily Missions */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center justify-between">
                  <span>Active Sustainability Missions</span>
                  <span className="text-xs text-emerald-400 font-medium">3 / 4 Completed Today</span>
                </h3>
                <div className="space-y-3 text-xs">
                  {[
                    { title: "Scan 3 Plastic Bottles", xp: "+50 XP", coins: "+15 Coins", completed: true },
                    { title: "Log 1 Surplus Food Package", xp: "+80 XP", coins: "+30 Coins", completed: true },
                    { title: "Complete Daily Decomposition Quiz", xp: "+40 XP", coins: "+10 Coins", completed: true },
                    { title: "Recycle Electronic E-Waste", xp: "+120 XP", coins: "+50 Coins", completed: false }
                  ].map((m, idx) => (
                    <div key={idx} className={`p-3.5 rounded-xl border flex items-center justify-between ${m.completed ? "bg-emerald-500/5 border-emerald-500/20 text-slate-300" : "bg-slate-800/40 border-slate-800 text-slate-400"}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${m.completed ? "bg-emerald-500 text-slate-950 font-bold" : "border border-slate-600"}`}>
                          {m.completed ? "✓" : ""}
                        </div>
                        <span className="font-medium text-slate-200">{m.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono text-[11px]">{m.xp}</span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-mono text-[11px]">{m.coins}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50">
                <h3 className="text-sm font-bold text-white mb-4">Verified Environmental Actions</h3>
                <div className="space-y-3 text-xs">
                  {[
                    { action: "Scanned PET Bottle #104", co2: "0.24 kg CO₂", time: "2 hours ago", status: "Verified" },
                    { action: "Surplus Bread Rescued (Bakers Guild)", co2: "4.80 kg CO₂", time: "Yesterday", status: "Verified" },
                    { action: "Cardboard Packaging Dropped at Center #4", co2: "1.20 kg CO₂", time: "3 days ago", status: "Verified" }
                  ].map((a, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-200">{a.action}</div>
                        <div className="text-[11px] text-slate-500">{a.time}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-emerald-400 font-mono font-semibold">{a.co2}</div>
                        <div className="text-[10px] text-slate-400">{a.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Cards */}
            <div className="space-y-6">
              {/* Leaderboard Card */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" /> Municipal Volunteer Ranks
                </h3>
                <div className="space-y-3 text-xs">
                  {[
                    { rank: 1, name: "Aarav Sharma", pts: "1,420 pts", badge: "🥇 Eco Legend" },
                    { rank: 2, name: "Priya Patel", pts: "1,180 pts", badge: "🥈 Biosphere Champion" },
                    { rank: 3, name: "David Miller", pts: "940 pts", badge: "🥉 Waste Warrior" },
                    { rank: 4, name: profile.username, pts: `${profile.ecoPoints} pts`, badge: "⭐ You", highlight: true }
                  ].map((user) => (
                    <div key={user.rank} className={`p-2.5 rounded-xl flex items-center justify-between ${user.highlight ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold" : "bg-slate-950 text-slate-300"}`}>
                      <div className="flex items-center gap-3">
                        <span className="w-4 text-center font-mono font-bold text-slate-400">#{user.rank}</span>
                        <div>
                          <div>{user.name}</div>
                          <div className="text-[10px] text-slate-500">{user.badge}</div>
                        </div>
                      </div>
                      <span className="font-mono text-emerald-400">{user.pts}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CERTIFICATES TAB */}
        {activeTab === "certificates" && (
          <div className="p-8 rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-slate-900 to-slate-950 text-center max-w-2xl mx-auto">
            <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto mb-4 animate-bounce" />
            <span className="text-xs uppercase tracking-widest font-bold text-emerald-400">UN SDG Verified Certificate</span>
            <h2 className="text-2xl font-black text-white mt-1">Certificate of Climate Stewardship</h2>
            <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto">
              This certifies that <strong className="text-white">{profile.username}</strong> has actively diverted {profile.scannedItemsCount} waste items, preventing 184.2 kg CO₂ emissions.
            </p>
            <div className="my-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-400 text-left space-y-1">
              <div>Certificate Hash: 0x8f4b...39a1</div>
              <div>Issuer: EcoVerzz AI Municipal Node</div>
              <div>Verification Standard: ISO 14064 Carbon Accounting</div>
            </div>
            <button className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer inline-flex items-center gap-2">
              <Download className="w-4 h-4" /> Download Official PDF Certificate
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
