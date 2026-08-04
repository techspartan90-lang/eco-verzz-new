import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, Check, Sparkles, DollarSign, Activity, AlertTriangle, ShieldCheck, X } from "lucide-react";
import { api } from "../services/api";

export const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const loadNotifications = () => {
    api.getNotifications()
      .then(res => {
        setNotifications(res.notifications || []);
        setUnreadCount(res.unread_count || 0);
      })
      .catch(console.warn);
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {
      console.warn("Mark read error", e);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === "All") return true;
    return n.category?.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <div className="relative font-sans">
      {/* Bell Icon Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer relative shadow-md"
        title="In-App & Investment Notifications"
      >
        <Bell className="w-4 h-4 text-emerald-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center animate-bounce shadow-md">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl bg-[#0d121d] border border-slate-800 shadow-2xl z-50 p-4 space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-sm text-white">Notifications & Alerts</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                    {unreadCount} Unread
                  </span>
                )}
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px]">
              {["All", "NAV", "AI", "Investment", "Alert"].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    activeFilter === cat ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Notifications Feed */}
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {filteredNotifications.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">No notifications in this filter category.</div>
              ) : (
                filteredNotifications.map(n => (
                  <div
                    key={n.id}
                    className={`p-3 rounded-2xl border transition-all flex items-start gap-3 text-xs ${
                      n.is_read ? "bg-slate-950/40 border-slate-800/60 opacity-70" : "bg-slate-900 border-slate-700 shadow-sm"
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {n.category === "NAV" ? (
                        <Activity className="w-4 h-4 text-cyan-400" />
                      ) : n.category === "AI" ? (
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                      ) : n.category === "Alert" ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                      ) : (
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-[11px]">{n.title}</span>
                        <span className="text-[9px] text-slate-500">{n.created_at}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug">{n.message}</p>
                    </div>
                    {!n.is_read && (
                      <button
                        onClick={() => handleMarkRead(n.id)}
                        className="p-1 rounded bg-slate-800 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-300 shrink-0"
                        title="Mark read"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
