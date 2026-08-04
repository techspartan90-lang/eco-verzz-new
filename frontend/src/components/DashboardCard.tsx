import React from "react";
import { motion } from "motion/react";
import { LucideIcon, ArrowUpRight, ArrowDownRight, Sparkles } from "lucide-react";

export interface DashboardCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  badge?: string;
  loading?: boolean;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  change,
  changeType = "positive",
  subtitle,
  icon: Icon,
  iconColor = "emerald",
  badge,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 animate-pulse">
        <div className="flex items-center justify-between mb-3">
          <div className="w-24 h-3 bg-slate-800 rounded-full" />
          <div className="w-9 h-9 rounded-xl bg-slate-800" />
        </div>
        <div className="w-32 h-7 bg-slate-800 rounded-lg mb-2" />
        <div className="w-20 h-3 bg-slate-800 rounded-full" />
      </div>
    );
  }

  const isPositive = changeType === "positive";
  const isNegative = changeType === "negative";

  const getIconBgColor = () => {
    switch (iconColor) {
      case "emerald":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "teal":
        return "bg-teal-500/10 text-teal-400 border-teal-500/20";
      case "cyan":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      case "blue":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "purple":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "amber":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative overflow-hidden rounded-2xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 p-5 backdrop-blur-xl shadow-lg hover:shadow-emerald-500/5 transition-all group"
    >
      {/* Background Subtle Gradient Overlay */}
      <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />

      {/* Header Row */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-400 light:text-slate-500 tracking-wide uppercase">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl border ${getIconBgColor()} transition-transform group-hover:scale-110`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {/* Main Metric Value */}
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-100 dark:text-slate-100 light:text-slate-900 tracking-tight">
          {value}
        </h3>
        {badge && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-2.5 h-2.5" />
            {badge}
          </span>
        )}
      </div>

      {/* Footer Sparkline / Change indicator */}
      {(change || subtitle) && (
        <div className="flex items-center gap-2 text-xs font-medium">
          {change && (
            <span
              className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[11px] font-bold ${
                isPositive
                  ? "bg-emerald-500/15 text-emerald-400"
                  : isNegative
                  ? "bg-rose-500/15 text-rose-400"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              {isPositive && <ArrowUpRight className="w-3 h-3" />}
              {isNegative && <ArrowDownRight className="w-3 h-3" />}
              {change}
            </span>
          )}
          {subtitle && (
            <span className="text-slate-400 text-[11px] truncate">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};
