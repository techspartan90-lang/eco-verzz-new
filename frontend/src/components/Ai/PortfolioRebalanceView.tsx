import React from "react";
import { RefreshCw, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface PortfolioRebalanceViewProps {
  rebalanceData?: any;
}

export const PortfolioRebalanceView: React.FC<PortfolioRebalanceViewProps> = ({
  rebalanceData,
}) => {
  const comparison = rebalanceData?.comparison || [
    { category: "Equity ESG", target_pct: 45.0, actual_pct: 52.4, delta_pct: +7.4 },
    { category: "Sectoral ESG", target_pct: 25.0, actual_pct: 28.1, delta_pct: +3.1 },
    { category: "Index Fund", target_pct: 15.0, actual_pct: 10.2, delta_pct: -4.8 },
    { category: "Debt ESG", target_pct: 15.0, actual_pct: 9.3, delta_pct: -5.7 },
  ];

  const actions = rebalanceData?.suggested_actions || [
    "TRIM Equity ESG by +7.4% (Reduce overexposure in Equity ESG)",
    "BUY/ACCUMULATE Debt ESG by -5.7% (Boost capital preservation buffer)",
  ];

  const handleExecuteRebalance = () => {
    toast.success("Rebalance Orders Triggered!", {
      description: "Portfolio asset reallocation executed according to target ratios.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-emerald-400" />
              <span>Target Asset Rebalancing</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Compare actual asset weights vs AI target allocation
            </p>
          </div>

          <button
            onClick={handleExecuteRebalance}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Execute 1-Click Rebalance</span>
          </button>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold">
                <th className="py-3 px-3">Asset Class</th>
                <th className="py-3 px-3 font-bold text-teal-400">Target Weight %</th>
                <th className="py-3 px-3 font-bold text-slate-200">Actual Weight %</th>
                <th className="py-3 px-3 text-right">Allocation Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-slate-200 font-medium">
              {comparison.map((row: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-bold text-slate-100">{row.category}</td>
                  <td className="py-3 px-3 font-mono text-teal-300">{row.target_pct}%</td>
                  <td className="py-3 px-3 font-mono text-slate-200">{row.actual_pct}%</td>
                  <td
                    className={`py-3 px-3 text-right font-mono font-bold ${
                      row.delta_pct > 0 ? "text-amber-400" : "text-cyan-400"
                    }`}
                  >
                    {row.delta_pct > 0 ? "+" : ""}
                    {row.delta_pct}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Suggested Steps */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-3">
        <h4 className="text-sm font-bold text-slate-100">Step-by-Step Rebalance Instructions</h4>
        <div className="space-y-2">
          {actions.map((act: string, i: number) => (
            <div key={i} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                {i + 1}
              </span>
              <span className="text-slate-200 font-semibold">{act}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
