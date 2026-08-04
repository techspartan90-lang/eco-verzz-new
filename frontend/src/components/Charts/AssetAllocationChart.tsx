import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { PieChart as PieIcon } from "lucide-react";

const allocationData = [
  { name: "ESG Green Equity", value: 45, color: "#10b981" },
  { name: "Large Cap Leaders", value: 25, color: "#14b8a6" },
  { name: "Mid Cap Opportunities", value: 15, color: "#06b6d4" },
  { name: "Debt / Liquid Green Bonds", value: 10, color: "#3b82f6" },
  { name: "International Tech ESG", value: 5, color: "#8b5cf6" },
];

export const AssetAllocationChart: React.FC = () => {
  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 backdrop-blur-xl flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-teal-400" />
            <h3 className="text-base font-bold text-slate-100">Asset Allocation</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Distribution across asset classes</p>
        </div>
        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          ESG Concentrated
        </span>
      </div>

      {/* Pie Chart Canvas */}
      <div className="h-64 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                borderRadius: "12px",
                fontSize: "12px",
              }}
              formatter={(value: any) => [`${value}% Allocation`, "Ratio"]}
            />
            <Pie
              data={allocationData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
            >
              {allocationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
              ))}
            </Pie>
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
