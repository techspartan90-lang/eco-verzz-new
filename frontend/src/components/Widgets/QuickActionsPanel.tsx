import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  PlusCircle,
  Scale,
  FileText,
  Sparkles,
  Wallet,
  Zap,
} from "lucide-react";

interface QuickActionsPanelProps {
  onAddInvestment?: () => void;
  onAiAnalysis?: () => void;
}

export const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({
  onAddInvestment,
  onAiAnalysis,
}) => {
  const navigate = useNavigate();

  const actions = [
    {
      id: "add-investment",
      title: "Add Investment",
      description: "Start SIP or Lumpsum",
      icon: PlusCircle,
      color: "from-emerald-600 to-teal-500",
      textColor: "text-emerald-400",
      onClick: () => {
        if (onAddInvestment) onAddInvestment();
        else navigate("/mutual-funds");
      },
    },
    {
      id: "compare-funds",
      title: "Compare Funds",
      description: "Side-by-side metrics",
      icon: Scale,
      color: "from-teal-600 to-cyan-500",
      textColor: "text-teal-400",
      onClick: () => navigate("/compare"),
    },
    {
      id: "generate-report",
      title: "Generate Report",
      description: "Tax & ESG statements",
      icon: FileText,
      color: "from-cyan-600 to-blue-500",
      textColor: "text-cyan-400",
      onClick: () => navigate("/reports"),
    },
    {
      id: "ai-analysis",
      title: "AI Analysis",
      description: "ESG model recommendation",
      icon: Sparkles,
      color: "from-purple-600 to-indigo-500",
      textColor: "text-purple-400",
      onClick: () => {
        if (onAiAnalysis) onAiAnalysis();
        else navigate("/recommendations");
      },
    },
    {
      id: "view-portfolio",
      title: "View Portfolio",
      description: "Full holdings breakdown",
      icon: Wallet,
      color: "from-amber-600 to-orange-500",
      textColor: "text-amber-400",
      onClick: () => navigate("/portfolio"),
    },
  ];

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 backdrop-blur-xl">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-amber-400" />
        <h3 className="text-base font-bold text-slate-100">Quick Actions</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <motion.button
              key={act.id}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={act.onClick}
              className="flex flex-col items-center text-center p-3.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-emerald-500/30 transition-all group"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${act.color} p-0.5 mb-2.5 shadow-md shadow-emerald-500/10`}>
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${act.textColor} group-hover:scale-110 transition-transform`} />
                </div>
              </div>
              <span className="text-xs font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                {act.title}
              </span>
              <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                {act.description}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
