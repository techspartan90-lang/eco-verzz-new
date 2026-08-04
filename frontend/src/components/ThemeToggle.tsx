import React from "react";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { motion } from "motion/react";

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      type="button"
      className={`relative inline-flex items-center justify-center p-2.5 rounded-xl transition-all duration-300 ${
        theme === "dark"
          ? "bg-slate-800/80 hover:bg-slate-700 text-amber-400 border border-slate-700/60 shadow-lg shadow-black/20"
          : "bg-slate-100 hover:bg-slate-200 text-emerald-600 border border-slate-300 shadow-sm"
      } ${className}`}
      title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
      aria-label="Toggle Theme"
    >
      <AnimateIcon isDark={theme === "dark"} />
    </motion.button>
  );
};

const AnimateIcon: React.FC<{ isDark: boolean }> = ({ isDark }) => (
  <motion.div
    key={isDark ? "dark" : "light"}
    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
    animate={{ rotate: 0, opacity: 1, scale: 1 }}
    exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
    transition={{ duration: 0.2 }}
  >
    {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
  </motion.div>
);
