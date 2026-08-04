import React from "react";
import { Activity, AlertTriangle, CheckCircle2, TrendingUp, ShieldCheck } from "lucide-react";

interface PortfolioAnalysisViewProps {
  analysisData?: any;
}

export const PortfolioAnalysisView: React.FC<PortfolioAnalysisViewProps> = ({
  analysisData,
}) => {
  const healthScore = analysisData?.health_score || 88;
  const status = analysisData?.status || "Good";
  const underperforming = analysisData?.underperforming_funds || [];
  const overexposed = analysisData?.overexposed_sectors || [];

  return (
    <div className="space-y-6">
      {/* Health Score Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-slate-100">Portfolio Health Score</h3>
          </div>
          <div className="my-3">
            <h2 className="text-4xl font-extrabold text-emerald-400 font-mono">{healthScore} / 100</h2>
            <span className="text-xs font-semibold text-slate-400 mt-1 block">Rating: {status}</span>
          </div>
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
              style={{ width: `${healthScore}%` }}
            />
          </div>
        </div>

        {/* Underperforming Alert Card */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-slate-100">Underperforming Detection</h3>
            </div>
            <span className="text-xs font-bold text-amber-400">{underperforming.length} Flags</span>
          </div>

          {underperforming.length === 0 ? (
            <div className="my-4 text-xs text-emerald-400 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>All holdings meeting &gt;8% ESG benchmark targets.</span>
            </div>
          ) : (
            <div className="space-y-2 my-2">
              {underperforming.map((u: any, idx: number) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-950/60 border border-amber-500/20 text-xs">
                  <p className="font-bold text-slate-100">{u.fund_name}</p>
                  <p className="text-[10px] text-amber-400 mt-0.5">{u.reason}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Overexposure Alert Card */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-slate-100">Sector Concentration</h3>
            </div>
            <span className="text-xs font-bold text-cyan-400">{overexposed.length} Alerts</span>
          </div>

          {overexposed.length === 0 ? (
            <div className="my-4 text-xs text-emerald-400 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Sectors well diversified under 35% threshold limits.</span>
            </div>
          ) : (
            <div className="space-y-2 my-2">
              {overexposed.map((o: any, idx: number) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-950/60 border border-cyan-500/20 text-xs">
                  <p className="font-bold text-slate-100">{o.sector} ({o.weight_pct}%)</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{o.recommendation}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
