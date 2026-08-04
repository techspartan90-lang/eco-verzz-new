import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { TrendingUp } from "lucide-react";

const timelineData = [
  { date: "Mar '26", invested: 950000, value: 980000, gain: 30000 },
  { date: "Apr '26", invested: 980000, value: 1020000, gain: 40000 },
  { date: "May '26", invested: 1010000, value: 1060000, gain: 50000 },
  { date: "Jun '26", invested: 1050000, value: 1120000, gain: 70000 },
  { date: "Jul '26", invested: 1100000, value: 1190000, gain: 90000 },
  { date: "Aug '26", invested: 1165000, value: 1248500, gain: 83500 },
];

export const GainLossTimelineChart: React.FC = () => {
  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 backdrop-blur-xl flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-slate-100">Gain/Loss Timeline</h3>
        </div>
        <span className="text-xs text-emerald-400 font-bold">+22.4% Net Return</span>
      </div>

      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={timelineData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
            <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                borderRadius: "12px",
                fontSize: "12px",
              }}
              formatter={(val: any) => [`₹${Number(val).toLocaleString("en-IN")}`, ""]}
            />
            <Legend wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }} />
            <Bar dataKey="gain" name="Monthly Gain (₹)" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Line type="monotone" dataKey="value" name="Current Value" stroke="#14b8a6" strokeWidth={3} dot={{ r: 4 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
