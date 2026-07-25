import React from "react";
import { Bell, Users, Trophy } from "lucide-react";
import { EcoMessages, ChatMessage } from "./EcoMessages";
import { EarthVisualizer } from "../EarthVisualizer";
import { audioEngine } from "../AudioEngine";

export interface NotificationItem {
  id: number;
  text: string;
  read: boolean;
  time: string;
}

export interface RightSidebarProps {
  activeView: string;
  chatsData: Record<string, ChatMessage[]>;
  activeChatPartner: string | null;
  onSelectChatPartner: (name: string) => void;
  notifications: NotificationItem[];
  onClearNotifications: () => void;
  followingList: string[];
  onFollowFriend: (name: string, e: React.MouseEvent) => void;
  xp: number;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  activeView,
  chatsData,
  activeChatPartner,
  onSelectChatPartner,
  notifications,
  onClearNotifications,
  followingList,
  onFollowFriend,
  xp,
}) => {
  // Hide right sidebar in full-screen telemetry views
  if (activeView === "telemetry") return null;

  return (
    <aside className="hidden lg:block w-[340px] shrink-0 space-y-5">
      {/* 1. Eco Messages Module */}
      <EcoMessages
        chatsData={chatsData}
        activeChatPartner={activeChatPartner}
        onSelectPartner={onSelectChatPartner}
      />

      {/* 2. Alerts Ledger Panel */}
      <div className="bg-[#09090b]/80 border border-white/5 p-4.5 rounded-3xl backdrop-blur-md text-left transition-all hover:border-emerald-500/20">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5 animate-pulse" /> Alerts Ledger
          </h4>
          {notifications.length > 0 && (
            <button
              onClick={() => {
                audioEngine.playTick();
                onClearNotifications();
              }}
              className="text-[8px] uppercase tracking-widest font-mono text-gray-500 hover:text-white transition-colors cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
          {notifications.length === 0 ? (
            <p className="text-[10px] text-gray-500 text-center py-2">
              Ecosystem ledger is synced! 🌿
            </p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className="p-2.5 bg-white/[0.01] border border-white/5 rounded-xl text-[10px] text-gray-300 leading-normal"
              >
                <p>{n.text}</p>
                <span className="text-[8px] text-gray-500 font-mono mt-0.5 block">
                  {n.time}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 3. Nearby Volunteers Panel */}
      <div className="bg-[#09090b]/80 border border-white/5 p-4.5 rounded-3xl backdrop-blur-md text-left transition-all hover:border-emerald-500/20">
        <h4 className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase mb-3 flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5" /> Nearby Volunteers
        </h4>
        <div className="space-y-3">
          {[
            { name: "Sarah Moon", icon: "🌱", role: "Tree Planter" },
            { name: "GreenRoots NGO", icon: "🏢", role: "Verified partner" },
            { name: "Aria Rivers", icon: "👩‍🚀", role: "Ocean Guard" },
          ].map((item) => {
            const isFollowing = followingList.includes(item.name);
            return (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 bg-white/5 border border-white/5 rounded-lg flex items-center justify-center text-xs shrink-0">
                    {item.icon}
                  </span>
                  <div className="text-left">
                    <span className="text-xs font-bold text-white block leading-tight">
                      {item.name}
                    </span>
                    <span className="text-[8px] text-gray-500 block">
                      {item.role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => onFollowFriend(item.name, e)}
                  className={`text-[9px] uppercase tracking-wider px-2 py-1 rounded-lg font-black transition-all cursor-pointer ${
                    isFollowing
                      ? "bg-white/5 text-gray-400"
                      : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Leaderboard Summary Widget */}
      <div className="bg-[#09090b]/80 border border-white/5 p-4.5 rounded-3xl backdrop-blur-md text-left space-y-3 transition-all hover:border-emerald-500/20">
        <h4 className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5" /> Leaderboard
        </h4>
        <div className="space-y-2 text-[11px]">
          <div className="flex justify-between p-2 bg-[#d97706]/5 border border-[#d97706]/10 rounded-xl">
            <span className="font-bold text-amber-400">1. Elena G.</span>
            <span className="font-mono text-gray-400">2,450 XP</span>
          </div>
          <div className="flex justify-between p-2 bg-[#94a3b8]/5 border border-[#94a3b8]/10 rounded-xl">
            <span className="font-bold text-slate-300">2. Marcus A.</span>
            <span className="font-mono text-gray-400">1,920 XP</span>
          </div>
          <div className="flex justify-between p-2 bg-white/[0.01] border border-white/5 rounded-xl">
            <span className="font-bold text-gray-300">3. Dave K.</span>
            <span className="font-mono text-gray-400">1,680 XP</span>
          </div>
          <div className="flex justify-between p-2 bg-emerald-500/15 border border-emerald-500/20 rounded-xl font-bold">
            <span className="text-emerald-400">4. You</span>
            <span className="font-mono text-emerald-400">{xp + 650} XP</span>
          </div>
        </div>
      </div>

      {/* 5. Local Weather Coordinates */}
      <div className="bg-[#09090b]/80 border border-white/5 p-4 rounded-3xl text-left transition-all hover:border-emerald-500/20">
        <span className="text-[8px] font-mono text-emerald-400 block uppercase">
          TODAY'S WEATHER COORDINATES
        </span>
        <p className="text-xs font-bold text-white mt-1">☀️ 22°C Clear & Sunny</p>
        <p className="text-[9px] text-gray-400 mt-0.5 font-light">
          Terrific atmospheric stability for active tree planting and composting!
        </p>
      </div>

      {/* 6. Ecosystem Health Mini Globe */}
      <div className="bg-[#09090b]/80 border border-white/5 p-4 rounded-3xl text-left relative overflow-hidden transition-all hover:border-emerald-500/20">
        <span className="text-[8px] font-mono text-emerald-400 block uppercase">
          Ecosystem Health
        </span>
        <div className="flex justify-between items-center mt-2">
          <div>
            <span className="text-sm font-bold text-white font-mono block">
              12.4 Tons CO2
            </span>
            <span className="text-[8px] text-gray-500 uppercase font-mono">
              Verified Communal Offsets
            </span>
          </div>
          <div className="w-12 h-12 relative shrink-0 overflow-hidden rounded-full border border-emerald-500/30">
            <EarthVisualizer scene="dashboard" healingStage={5} zoomLevel="far" />
          </div>
        </div>
      </div>
    </aside>
  );
};
