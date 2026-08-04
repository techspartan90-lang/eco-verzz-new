import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from "recharts";
import { Layers } from "lucide-react";

const sectorData = [
  { sector: "Clean Energy", allocation: 38, color: "#10b981" },
  { sector: "ESG Tech & AI", allocation: 24, color: "#14b8a6" },
  { sector: "EV Mobility", allocation: 18, color: "#06b6d4" },
  { sector: "Green Bonds", allocation: 12, color: "#3b82f6" },
  { sector: "Circular Waste", allocation: 8, color: "#8b5cf6" },
];

export const SectorAllocationChart: React.FC = () => {
  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 backdrop-blur-xl flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-slate-100">Sector Allocation</h3>
        </div>
        <span className="text-xs text-slate-400">5 Key Sectors</span>
      </div>

      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sectorData} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
            <XAxis type="number" stroke="#64748b" fontSize={11} tickFormatter={(val) => `${val}%`} />
            <YAxis dataKey="sector" type="category" stroke="#94a3b8" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                borderRadius: "12px",
                fontSize: "12px",
              }}
              formatter={(val: any) => [`${val}% Weight`, "Allocation"]}
            />
            <Bar dataKey="allocation" radius={[0, 6, 6, 0]}>
              {sectorData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
