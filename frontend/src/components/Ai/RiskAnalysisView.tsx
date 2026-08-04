import React from "react";
import { ShieldAlert, Activity, TrendingUp, Zap } from "lucide-react";

interface RiskAnalysisViewProps {
  riskData?: any;
}

export const RiskAnalysisView: React.FC<RiskAnalysisViewProps> = ({ riskData }) => {
  const riskProfile = riskData?.risk_profile || "Moderate";
  const riskScore = riskData?.risk_score || 4.2;
  const volatility = riskData?.volatility_pct || 12.8;
  const scenarios = riskData?.stress_test_scenarios || [
    { scenario: "Market Rally (+20%)", projected_gain: "+24.5%" },
    { scenario: "Market Correction (-15%)", projected_impact: "-7.8%" },
    { scenario: "Green Policy Booster", projected_gain: "+31.2%" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Profile & Volatility Card */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-slate-100">Risk Profiling & Volatility</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 my-2">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Risk Category</span>
              <h4 className="text-xl font-extrabold text-amber-400 mt-1">{riskProfile}</h4>
              <span className="text-[11px] text-slate-500 font-mono">Score: {riskScore} / 10</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Annual Volatility</span>
              <h4 className="text-xl font-extrabold text-teal-300 font-mono mt-1">{volatility}%</h4>
              <span className="text-[11px] text-teal-400">Standard Deviation</span>
            </div>
          </div>
        </div>

        {/* Stress Testing Scenarios */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100">Portfolio Stress Testing Scenarios</h3>
          </div>

          <div className="space-y-2.5">
            {scenarios.map((s: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs"
              >
                <span className="font-semibold text-slate-200">{s.scenario}</span>
                <span
                  className={`font-mono font-bold ${
                    s.projected_gain ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {s.projected_gain || s.projected_impact}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
