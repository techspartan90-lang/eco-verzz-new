import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { Building2 } from "lucide-react";

const amcData = [
  { name: "EcoVerzz Asset Management", value: 40, color: "#10b981" },
  { name: "SBI ESG Mutual Fund", value: 25, color: "#06b6d4" },
  { name: "HDFC Climate Opportunities", value: 20, color: "#3b82f6" },
  { name: "Axis Sustainable Energy", value: 15, color: "#8b5cf6" },
];

export const AmcDistributionChart: React.FC = () => {
  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 backdrop-blur-xl flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-teal-400" />
          <h3 className="text-base font-bold text-slate-100">AMC Distribution</h3>
        </div>
        <span className="text-xs text-slate-400">4 Fund Houses</span>
      </div>

      <div className="h-60 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                borderRadius: "12px",
                fontSize: "12px",
              }}
              formatter={(val: any) => [`${val}% Weight`, "Exposure"]}
            />
            <Pie
              data={amcData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {amcData.map((entry, index) => (
                <Cell key={`amc-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
