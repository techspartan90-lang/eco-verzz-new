import React from "react";
import { Grid } from "lucide-react";

interface PerformanceHeatmapProps {
  funds: any[];
}

export const PerformanceHeatmap: React.FC<PerformanceHeatmapProps> = ({ funds }) => {
  if (!funds || funds.length === 0) return null;

  const timeframes = [
    { key: "1m", label: "1 Month" },
    { key: "3m", label: "3 Months" },
    { key: "6m", label: "6 Months" },
    { key: "1y", label: "1 Year" },
    { key: "3y", label: "3Y CAGR" },
    { key: "5y", label: "5Y CAGR" },
    { key: "since_inception", label: "Inception" },
  ];

  const getHeatmapColor = (ret: number) => {
    if (ret > 25) return "bg-emerald-500/30 text-emerald-300 border-emerald-500/40 font-extrabold";
    if (ret > 15) return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-bold";
    if (ret > 8) return "bg-teal-500/20 text-teal-300 border-teal-500/30 font-semibold";
    if (ret > 0) return "bg-cyan-500/15 text-cyan-400 border-cyan-500/20";
    return "bg-rose-500/20 text-rose-400 border-rose-500/30 font-bold";
  };

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Grid className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-slate-100">Performance Heatmap Matrix</h3>
        </div>
        <span className="text-xs text-slate-400">Color-coded Return Intensities</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <th className="py-2.5 px-3">Fund Name</th>
              {timeframes.map((tf) => (
                <th key={tf.key} className="py-2.5 px-3 text-center">{tf.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {funds.map((f) => (
              <tr key={f.symbol} className="hover:bg-slate-800/30">
                <td className="py-3 px-3">
                  <p className="font-bold text-slate-100">{f.name}</p>
                  <span className="text-[10px] text-slate-400 font-mono">{f.symbol}</span>
                </td>
                {timeframes.map((tf) => {
                  const val = f.returns?.[tf.key] || 0.0;
                  return (
                    <td key={tf.key} className="py-3 px-2 text-center">
                      <div className={`py-1.5 px-2 rounded-xl border font-mono text-xs ${getHeatmapColor(val)}`}>
                        +{val}%
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
