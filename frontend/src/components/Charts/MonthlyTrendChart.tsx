import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Calendar } from "lucide-react";

const trendData = [
  { month: "Mar '26", investment: 25000 },
  { month: "Apr '26", investment: 30000 },
  { month: "May '26", investment: 30000 },
  { month: "Jun '26", investment: 45000 },
  { month: "Jul '26", investment: 50000 },
  { month: "Aug '26", investment: 65000 },
];

export const MonthlyTrendChart: React.FC = () => {
  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 backdrop-blur-xl flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-slate-100">Monthly Investment Trend</h3>
        </div>
        <span className="text-xs text-slate-400 font-semibold">SIP & Lumpsum (₹)</span>
      </div>

      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => `₹${val / 1000}k`} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                borderRadius: "12px",
                fontSize: "12px",
              }}
              formatter={(val: any) => [`₹${Number(val).toLocaleString("en-IN")}`, "Inflow"]}
            />
            <Bar dataKey="investment" fill="#06b6d4" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
