import React from "react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface RiskScatterPlotProps {
  funds: any[];
}

const COLOR_PALETTE = ["#10b981", "#06b6d4", "#3b82f6", "#8b5cf6", "#f59e0b"];

export const RiskScatterPlot: React.FC<RiskScatterPlotProps> = ({ funds }) => {
  if (!funds || funds.length === 0) return null;

  const data = funds.map((f, idx) => ({
    name: f.name,
    symbol: f.symbol,
    xRisk: f.risk_metrics?.standard_deviation || 12.0,
    yReturn: f.returns?.["3y"] || 20.0,
    zSize: f.aum_cr || 3000,
    color: COLOR_PALETTE[idx % COLOR_PALETTE.length],
  }));

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 backdrop-blur-xl flex flex-col justify-between h-full space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-teal-400" />
          <h3 className="text-base font-bold text-slate-100">Risk vs Return Scatter Matrix</h3>
        </div>
        <span className="text-xs text-slate-400">X: Volatility | Y: 3Y CAGR</span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 15, right: 20, bottom: 15, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              type="number"
              dataKey="xRisk"
              name="Std Deviation (%)"
              stroke="#64748b"
              fontSize={11}
              unit="%"
            />
            <YAxis
              type="number"
              dataKey="yReturn"
              name="3Y CAGR (%)"
              stroke="#64748b"
              fontSize={11}
              unit="%"
            />
            <ZAxis type="number" dataKey="zSize" range={[100, 500]} name="AUM (Cr)" />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                borderRadius: "12px",
                fontSize: "11px",
              }}
              formatter={(value: any, name: any) => [
                `${value}%`,
                name === "xRisk" ? "Std Dev (Risk)" : "3Y CAGR (Return)",
              ]}
            />
            <Scatter name="Funds" data={data}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
