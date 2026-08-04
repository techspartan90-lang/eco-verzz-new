import React from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from "recharts";
import { ShieldAlert } from "lucide-react";

const riskData = [
  { subject: "ESG Score", score: 92, fullMark: 100 },
  { subject: "Liquidity", score: 85, fullMark: 100 },
  { subject: "Volatility Risk", score: 42, fullMark: 100 },
  { subject: "Concentration", score: 38, fullMark: 100 },
  { subject: "Credit Risk", score: 25, fullMark: 100 },
  { subject: "Market Beta", score: 65, fullMark: 100 },
];

export const RiskDistributionChart: React.FC = () => {
  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 backdrop-blur-xl flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-slate-100">Risk & ESG Distribution</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Multi-dimensional risk factor analysis</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-emerald-400">Moderate Risk (4.2/10)</span>
        </div>
      </div>

      <div className="h-64 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={riskData}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={10} />
            <Radar
              name="Portfolio Rating"
              dataKey="score"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.4}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                borderRadius: "12px",
                fontSize: "12px",
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
