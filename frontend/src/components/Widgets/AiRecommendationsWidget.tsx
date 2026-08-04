import React from "react";
import { Sparkles, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export interface AiRecommendation {
  id: string;
  fundName: string;
  matchScore: number;
  expectedReturn: string;
  riskLevel: "Low" | "Moderate" | "High";
  reason: string;
}

const aiRecommendationsList: AiRecommendation[] = [
  {
    id: "rec-1",
    fundName: "EcoVerzz Climate Impact Fund",
    matchScore: 98,
    expectedReturn: "24.5% p.a.",
    riskLevel: "Moderate",
    reason: "Fits aggressive ESG profile with zero carbon footprint allocation",
  },
  {
    id: "rec-2",
    fundName: "Solar & Clean Tech Leaders",
    matchScore: 94,
    expectedReturn: "28.0% p.a.",
    riskLevel: "High",
    reason: "Strong momentum in solar grid expansion with high alpha rating",
  },
  {
    id: "rec-3",
    fundName: "Green Bond Sovereign Yield",
    matchScore: 89,
    expectedReturn: "9.2% p.a.",
    riskLevel: "Low",
    reason: "Capital preservation with guaranteed ESG green bond coupon",
  },
];

export const AiRecommendationsWidget: React.FC = () => {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-emerald-950/30 border border-emerald-500/20 p-5 backdrop-blur-xl flex flex-col justify-between h-full relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">AI Recommendations</h3>
            <p className="text-xs text-slate-400">Personalized ESG Fund Matches</p>
          </div>
        </div>
        <Link
          to="/recommendations"
          className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
        >
          <span>Run AI Engine</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-3 relative z-10">
        {aiRecommendationsList.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-emerald-500/40 transition-all group"
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <h4 className="text-xs font-bold text-slate-100 group-hover:text-emerald-300 transition-colors truncate">
                {item.fundName}
              </h4>
              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                {item.matchScore}% Match
              </span>
            </div>

            <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2">
              {item.reason}
            </p>

            <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-800/50">
              <span className="text-slate-400">
                Exp. Return: <strong className="text-emerald-400">{item.expectedReturn}</strong>
              </span>
              <span className="text-slate-400">
                Risk: <strong className="text-teal-300">{item.riskLevel}</strong>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
