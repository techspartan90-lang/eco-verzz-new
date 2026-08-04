import React from "react";
import { ShieldAlert, Compass, Sparkles } from "lucide-react";

interface PortfolioRiskMeterProps {
  riskScore?: number;
  diversificationScore?: number;
}

export const PortfolioRiskMeter: React.FC<PortfolioRiskMeterProps> = ({
  riskScore = 4.2,
  diversificationScore = 8.5,
}) => {
  const getRiskLabel = (score: number) => {
    if (score < 3.5) return { label: "Conservative / Low Risk", color: "text-emerald-400" };
    if (score < 6.5) return { label: "Moderate Risk", color: "text-amber-400" };
    return { label: "Aggressive / High Risk", color: "text-rose-400" };
  };

  const riskInfo = getRiskLabel(riskScore);

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 backdrop-blur-xl flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-slate-100">Risk & Diversification</h3>
        </div>
        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          AI Evaluated
        </span>
      </div>

      <div className="space-y-4 my-2">
        {/* Risk Score Bar */}
        <div>
          <div className="flex justify-between items-center text-xs font-semibold mb-1">
            <span className="text-slate-400">Risk Score</span>
            <span className={`font-bold ${riskInfo.color}`}>{riskScore} / 10 ({riskInfo.label})</span>
          </div>
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 rounded-full transition-all duration-500"
              style={{ width: `${(riskScore / 10) * 100}%` }}
            />
          </div>
        </div>

        {/* Diversification Score Bar */}
        <div>
          <div className="flex justify-between items-center text-xs font-semibold mb-1">
            <span className="text-slate-400">Diversification Index</span>
            <span className="font-bold text-teal-300">{diversificationScore} / 10 (Highly Diversified)</span>
          </div>
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${(diversificationScore / 10) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>Your portfolio is 85% allocated into zero-carbon & ESG certified instruments.</span>
      </div>
    </div>
  );
};
