import React, { useState } from "react";
import { Bell, CheckCircle2, AlertTriangle, Sparkles, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "system" | "ai" | "transaction" | "security";
  read: boolean;
}

const mockNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "SIP Order Executed Successfully",
    message: "Monthly SIP of ₹15,000 for EcoVerzz Climate Impact Fund completed.",
    time: "2 hours ago",
    type: "transaction",
    read: false,
  },
  {
    id: "notif-2",
    title: "AI ESG Rebalancing Alert",
    message: "EcoVerzz LLM detected +4.8% alpha opportunity in Solar Grid expansion.",
    time: "5 hours ago",
    type: "ai",
    read: false,
  },
  {
    id: "notif-3",
    title: "FastAPI Connection Verified",
    message: "Backend connection status healthy. 256-bit SSL session active.",
    time: "1 day ago",
    type: "system",
    read: true,
  },
  {
    id: "notif-4",
    title: "Security Login from New Device",
    message: "Successful authentication from Chrome Windows client.",
    time: "2 days ago",
    type: "security",
    read: true,
  },
];

export const NotificationsPage: React.FC = () => {
  const [list, setList] = useState(mockNotifications);

  const markAllRead = () => {
    setList(list.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <Bell className="w-6 h-6 text-emerald-400" />
            <span>Notification Center</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time updates on orders, AI signals, and platform alerts
          </p>
        </div>

        <button
          onClick={markAllRead}
          className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          Mark all as read
        </button>
      </div>

      <div className="space-y-3">
        {list.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-2xl border transition-colors flex items-start gap-3.5 ${
              n.read
                ? "bg-slate-900/40 border-slate-800/80"
                : "bg-slate-900/90 border-emerald-500/30 shadow-lg shadow-emerald-500/5"
            }`}
          >
            <div
              className={`p-2 rounded-xl border shrink-0 ${
                n.type === "ai"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : n.type === "transaction"
                  ? "bg-teal-500/10 text-teal-400 border-teal-500/20"
                  : n.type === "security"
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  : "bg-slate-800 text-slate-400 border-slate-700"
              }`}
            >
              {n.type === "ai" ? (
                <Sparkles className="w-4 h-4" />
              ) : n.type === "transaction" ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Bell className="w-4 h-4" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h4 className="text-xs font-bold text-slate-100">{n.title}</h4>
                <span className="text-[10px] text-slate-500">{n.time}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
