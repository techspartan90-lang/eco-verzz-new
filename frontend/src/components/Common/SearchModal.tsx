import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  X,
  TrendingUp,
  PieChart,
  Shield,
  FileText,
  Settings,
  Bell,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QuickSearchItem {
  id: string;
  title: string;
  category: "Navigation" | "Mutual Fund" | "Feature";
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const searchDatabase: QuickSearchItem[] = [
  { id: "1", title: "Overview Dashboard", category: "Navigation", path: "/dashboard", icon: TrendingUp },
  { id: "2", title: "Mutual Funds Screener", category: "Navigation", path: "/mutual-funds", icon: PieChart },
  { id: "3", title: "Portfolio Analytics", category: "Navigation", path: "/portfolio", icon: TrendingUp },
  { id: "4", title: "AI ESG Recommendations", category: "Navigation", path: "/recommendations", icon: Sparkles },
  { id: "5", title: "Compare Mutual Funds", category: "Navigation", path: "/compare", icon: PieChart },
  { id: "6", title: "Financial & Tax Reports", category: "Navigation", path: "/reports", icon: FileText },
  { id: "7", title: "System Settings", category: "Navigation", path: "/settings", icon: Settings },
  { id: "8", title: "Admin Portal", category: "Navigation", path: "/admin", icon: Shield },
  { id: "9", title: "Eco-Tech Green Tech Fund", category: "Mutual Fund", path: "/mutual-funds?symbol=ECOGREEN", icon: PieChart },
  { id: "10", title: "Nifty 50 ESG Index Fund", category: "Mutual Fund", path: "/mutual-funds?symbol=NIFTYESG", icon: PieChart },
  { id: "11", title: "Clean Energy Alpha Growth", category: "Mutual Fund", path: "/mutual-funds?symbol=CLEANALPHA", icon: PieChart },
  { id: "12", title: "Notifications Center", category: "Navigation", path: "/notifications", icon: Bell },
];

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredItems = searchDatabase.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
        />

        {/* Dialog Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10"
        >
          {/* Search Header Input */}
          <div className="flex items-center px-4 py-3.5 border-b border-slate-800 gap-3">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search funds, metrics, reports, settings..."
              className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
              autoFocus
            />
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results List */}
          <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-800/40 scrollbar-none">
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No matching results found for "<span className="text-emerald-400">{query}</span>"
              </div>
            ) : (
              filteredItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.path)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/80 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-emerald-500/20 text-slate-300 group-hover:text-emerald-400 flex items-center justify-center transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-200 group-hover:text-white">
                          {item.title}
                        </p>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="px-4 py-2.5 bg-slate-950/60 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>
              Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">ESC</kbd> to exit
            </span>
            <span className="text-emerald-400 font-medium">EcoVerzz Smart Search</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
