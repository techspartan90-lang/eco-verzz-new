import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { ThemeToggle } from "../components/ThemeToggle";
import { NotificationCenter } from "../components/NotificationCenter";
import { Breadcrumbs } from "../components/Common/Breadcrumbs";
import {
  Menu,
  Search,
  User as UserIcon,
  LogOut,
  Settings,
  Shield,
  Sparkles,
  ChevronDown,
} from "lucide-react";

interface NavbarProps {
  onOpenMobileMenu: () => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMobileMenu,
  onOpenSearch,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-slate-900/80 dark:bg-slate-900/80 light:bg-white/80 backdrop-blur-md border-b border-slate-800 dark:border-slate-800 light:border-slate-200 px-4 sm:px-6 flex items-center justify-between">
      {/* Left Area: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <Breadcrumbs />
        </div>
      </div>

      {/* Center: Search Trigger Button */}
      <div className="flex-1 max-w-md mx-4">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-100 hover:bg-slate-950/90 text-xs text-slate-400 border border-slate-800 dark:border-slate-800 light:border-slate-300 transition-all shadow-inner group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            <span className="truncate">Search funds, metrics, reports...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 dark:bg-slate-800 light:bg-slate-200 border border-slate-700/60 rounded">
            <span>⌘</span>K
          </kbd>
        </button>
      </div>

      {/* Right Area: Controls & Profile Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notification Center Bell */}
        <NotificationCenter />

        {/* Theme Toggle Button */}
        <ThemeToggle />

        {/* User Profile Menu Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-700/60"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md shadow-emerald-500/10">
              <div className="w-full h-full bg-slate-950 dark:bg-slate-950 light:bg-white rounded-[6px] flex items-center justify-center font-bold text-xs text-emerald-400">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-100 dark:text-slate-100 light:text-slate-900 leading-tight">
                {user?.name || "User Account"}
              </span>
              <span className="text-[10px] text-emerald-400 font-medium">
                {user?.role || "Investor"}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {profileOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setProfileOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-2xl shadow-xl z-40 p-2 divide-y divide-slate-800/80 dark:divide-slate-800/80 light:divide-slate-200"
                >
                  <div className="px-3 py-2.5">
                    <p className="text-xs font-bold text-slate-100 dark:text-slate-100 light:text-slate-900 truncate">
                      {user?.name || user?.email}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {user?.email}
                    </p>
                    <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
                      <Sparkles className="w-3 h-3" />
                      <span>{user?.role || "Investor"} Role</span>
                    </div>
                  </div>

                  <div className="py-1 space-y-0.5">
                    <Link
                      to="/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>Account Settings</span>
                    </Link>
                    {user?.role === "Admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-amber-300 hover:bg-amber-500/10 transition-colors"
                      >
                        <Shield className="w-4 h-4 text-amber-400" />
                        <span>Admin Console</span>
                      </Link>
                    )}
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
