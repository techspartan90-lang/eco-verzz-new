import React from "react";
import { Sparkles, Trophy, ShieldAlert, DollarSign, Clock, Compass } from "lucide-react";

interface CompareAiInsightsProps {
  insights?: any;
}

export const CompareAiInsights: React.FC<CompareAiInsightsProps> = ({ insights }) => {
  if (!insights || !insights.best_performer) return null;

  const {
    best_performer,
    lowest_expense,
    highest_risk,
    best_short_term,
    best_long_term,
    confidence_score,
    explanation,
    diversification_advice,
  } = insights;

  return (
    <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 border border-emerald-500/30 p-6 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-100">AI Side-by-Side Fund Analysis</h3>
            <p className="text-xs text-slate-400">Evaluated by EcoVerzz AI Multi-Factor Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Confidence Score:</span>
          <span className="text-sm font-extrabold text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            {confidence_score}%
          </span>
        </div>
      </div>

      {/* 5 AI Winner Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
        <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
            <Trophy className="w-3.5 h-3.5" />
            <span>Best Performer</span>
          </div>
          <p className="font-bold text-slate-100 truncate">{best_performer.name}</p>
          <span className="text-[10px] text-emerald-400 font-mono">+{best_performer.cagr_3y}% 3Y CAGR</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center gap-1.5 text-teal-400 font-bold mb-1">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Lowest Expense</span>
          </div>
          <p className="font-bold text-slate-100 truncate">{lowest_expense.name}</p>
          <span className="text-[10px] text-teal-300 font-mono">{lowest_expense.expense_ratio}% ER</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Highest Risk</span>
          </div>
          <p className="font-bold text-slate-100 truncate">{highest_risk.name}</p>
          <span className="text-[10px] text-amber-400 font-mono">Score {highest_risk.volatility_score}/10</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Best Short-Term</span>
          </div>
          <p className="font-bold text-slate-100 truncate">{best_short_term.name}</p>
          <span className="text-[10px] text-cyan-300 font-mono">+{best_short_term.return_1m}% 1M Return</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center gap-1.5 text-indigo-400 font-bold mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Best Long-Term</span>
          </div>
          <p className="font-bold text-slate-100 truncate">{best_long_term.name}</p>
          <span className="text-[10px] text-indigo-300 font-mono">+{best_long_term.cagr_5y}% 5Y CAGR</span>
        </div>
      </div>

      {/* Explanation & Diversification Advice */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
        <p className="text-slate-200 leading-relaxed font-medium">{explanation}</p>
        {diversification_advice && (
          <p className="text-emerald-400 font-semibold flex items-center gap-2">
            <span>💡 Recommendation:</span>
            <span>{diversification_advice}</span>
          </p>
        )}
      </div>
    </div>
  );
};
