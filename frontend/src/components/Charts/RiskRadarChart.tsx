import React from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from "recharts";
import { ShieldAlert } from "lucide-react";

interface RiskRadarChartProps {
  funds: any[];
}

const COLOR_PALETTE = ["#10b981", "#06b6d4", "#3b82f6", "#8b5cf6", "#f59e0b"];

export const RiskRadarChart: React.FC<RiskRadarChartProps> = ({ funds }) => {
  if (!funds || funds.length === 0) return null;

  // Build Radar dataset normalized 0-100 across 5 risk dimensions
  const metricsList = [
    { key: "sharpe", label: "Sharpe Ratio" },
    { key: "sortino", label: "Sortino Ratio" },
    { key: "alpha", label: "Jensen Alpha" },
    { key: "treynor", label: "Treynor Ratio" },
    { key: "volatility", label: "Low Volatility Score" },
  ];

  const data = metricsList.map((m) => {
    const point: any = { metric: m.label };
    funds.forEach((f) => {
      const rm = f.risk_metrics || {};
      let val = 50;
      if (m.key === "sharpe") val = Math.min(100, (rm.sharpe_ratio || 2.0) * 35);
      else if (m.key === "sortino") val = Math.min(100, (rm.sortino_ratio || 2.5) * 30);
      else if (m.key === "alpha") val = Math.min(100, (rm.alpha || 5.0) * 12);
      else if (m.key === "treynor") val = Math.min(100, (rm.treynor_ratio || 20.0) * 3);
      else if (m.key === "volatility") val = Math.max(10, 100 - (rm.volatility_score || 5.0) * 9);

      point[f.symbol] = Math.round(val);
    });
    return point;
  });

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 backdrop-blur-xl flex flex-col justify-between h-full space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-slate-100">Risk Metrics Radar Overlay</h3>
        </div>
        <span className="text-xs text-slate-400">5 Risk Vectors</span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#1e293b" />
            <PolarAngleAxis dataKey="metric" stroke="#94a3b8" fontSize={10} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={9} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                borderRadius: "12px",
                fontSize: "11px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }} />
            {funds.map((f, idx) => (
              <Radar
                key={f.symbol}
                name={f.name}
                dataKey={f.symbol}
                stroke={COLOR_PALETTE[idx % COLOR_PALETTE.length]}
                fill={COLOR_PALETTE[idx % COLOR_PALETTE.length]}
                fillOpacity={0.25}
              />
            ))}
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
