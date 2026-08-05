import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  PieChart,
  Wallet,
  Sparkles,
  Scale,
  FileSpreadsheet,
  Bookmark,
  Bell,
  Settings,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Leaf,
  LogOut,
  AlertTriangle,
  Camera,
  Zap,
  Target,
  ShoppingBag,
  Heart,
  Users,
  Activity,
  Award,
  Cpu,
  Globe,
  User,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  onCloseMobile,
}) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isNavActive = (path: string) => location.pathname === path;

  const adminItems = user?.role === "Admin" ? [{
    name: "Admin Portal",
    path: "/admin",
    icon: ShieldAlert,
    badge: "Admin",
  }] : [];

  const navigationGroups = [
    {
      title: "ESG Investment",
      items: [
        { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { name: "Mutual Funds", path: "/mutual-funds", icon: PieChart },
        { name: "Portfolio", path: "/portfolio", icon: Wallet },
        { name: "AI Recommendations", path: "/recommendations", icon: Sparkles, badge: "AI" },
        { name: "Compare Funds", path: "/compare", icon: Scale },
        { name: "Reports", path: "/reports", icon: FileSpreadsheet },
      ],
    },
    {
      title: "Civic & Community",
      items: [
        { name: "EcoScan AI Guide", path: "/citizen/ai_scan", icon: Camera },
        { name: "EcoPulse Hub", path: "/citizen/awareness", icon: Zap },
        { name: "Eco Missions", path: "/citizen/missions", icon: Target },
        { name: "Circular Exchange", path: "/citizen/marketplace", icon: ShoppingBag },
        { name: "Food Rescue Network", path: "/citizen/food_rescue", icon: Heart },
        { name: "Community Cleanup", path: "/citizen/waste_reports", icon: Users },
        { name: "Intel & Live GPS", path: "/citizen/telemetry", icon: Activity },
        { name: "Rewards & Recognition", path: "/citizen/rewards", icon: Award },
        { name: "AI Insights Advisor", path: "/citizen/eco_ai", icon: Cpu },
        { name: "EcoLink Social Network", path: "/citizen/eco_social", icon: Globe },
        { name: "User Passport", path: "/citizen/passport", icon: User },
      ],
    },
    {
      title: "Identity & System",
      items: [
        ...adminItems,
        { name: "Watchlist", path: "/watchlist", icon: Bookmark },
        { name: "Notifications", path: "/notifications", icon: Bell },
        { name: "Settings", path: "/settings", icon: Settings },
      ],
    },
  ];

  return (
    <aside
      className={`relative flex flex-col h-full bg-slate-900/90 dark:bg-slate-900/90 light:bg-white border-r border-slate-800 dark:border-slate-800 light:border-slate-200 backdrop-blur-xl transition-all duration-300 z-30 select-none ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800/80 dark:border-slate-800/80 light:border-slate-200">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20 shrink-0">
            <div className="w-full h-full bg-slate-950 dark:bg-slate-950 light:bg-white rounded-[10px] flex items-center justify-center">
              <Leaf className="w-5 h-5 text-emerald-400" />
            </div>
          </div>

          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex flex-col"
            >
              <span className="font-extrabold text-base tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
                EcoVerzz AI
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                ESG Platform
              </span>
            </motion.div>
          )}
        </div>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex items-center justify-center w-7 h-7 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700/50"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 scrollbar-none">
        {navigationGroups.map((group, groupIdx) => (
          <div key={group.title} className="space-y-1.5">
            {!collapsed ? (
              <div className={`text-[9px] font-bold text-slate-500 tracking-wider uppercase px-3 select-none ${groupIdx > 0 ? "pt-2" : ""}`}>
                {group.title}
              </div>
            ) : groupIdx > 0 ? (
              <div className="border-t border-slate-850 dark:border-slate-800/50 my-2 mx-2" />
            ) : null}

            {group.items.map((item) => {
              const Icon = item.icon;
              const active = isNavActive(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  state={(item as any).state}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                      isActive
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-md shadow-emerald-500/5"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                    }`
                  }
                >
                  {active && (
                    <motion.div
                      layoutId="activeSideBarTab"
                      className="absolute left-0 w-1 h-6 bg-emerald-400 rounded-r-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                      active ? "text-emerald-400" : "text-slate-400 group-hover:text-slate-200"
                    }`}
                  />

                  {!collapsed && (
                    <div className="flex items-center justify-between w-full overflow-hidden">
                      <span className="truncate">{item.name}</span>
                      {item.badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-full font-extrabold uppercase tracking-wide bg-emerald-500/20 text-emerald-300 border border-emerald-500/30`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* User Profile Footer Card */}
      <div className="p-3 border-t border-slate-800/80 dark:border-slate-800/80 light:border-slate-200">
        {!user ? (
          !collapsed ? (
            <NavLink
              to="/login"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 hover:from-emerald-400 hover:to-teal-500 font-bold text-xs shadow-md shadow-emerald-500/10 transition-all cursor-pointer"
            >
              <User className="w-4 h-4 shrink-0" />
              <span>Sign In / Register</span>
            </NavLink>
          ) : (
            <NavLink
              to="/login"
              className="w-full flex items-center justify-center py-2.5 rounded-xl bg-slate-800/60 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 border border-slate-800 transition-all cursor-pointer"
              title="Sign In / Register"
            >
              <User className="w-5 h-5 shrink-0" />
            </NavLink>
          )
        ) : !collapsed ? (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-300">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-slate-100 dark:text-slate-100 light:text-slate-900 truncate">
                  {user?.name || user?.email}
                </p>
                <p className="text-[10px] text-emerald-400 font-medium truncate">
                  {user?.role} Mode
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={logout}
            className="w-full flex items-center justify-center py-2.5 rounded-xl bg-slate-800/60 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors border border-slate-800"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </aside>
  );
};
