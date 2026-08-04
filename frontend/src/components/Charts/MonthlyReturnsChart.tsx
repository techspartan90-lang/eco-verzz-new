import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { BarChart3 } from "lucide-react";

const monthlyReturnsData = [
  { month: "Sep", return: 2.1 },
  { month: "Oct", return: -0.8 },
  { month: "Nov", return: 3.4 },
  { month: "Dec", return: 4.2 },
  { month: "Jan", return: 1.9 },
  { month: "Feb", return: -1.2 },
  { month: "Mar", return: 2.8 },
  { month: "Apr", return: 3.1 },
  { month: "May", return: 0.5 },
  { month: "Jun", return: 4.8 },
  { month: "Jul", return: 2.9 },
  { month: "Aug", return: 3.85 },
];

export const MonthlyReturnsChart: React.FC = () => {
  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 backdrop-blur-xl flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100">Monthly Returns (%)</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Historical monthly return performance</p>
        </div>
        <span className="text-xs font-semibold text-slate-400">Past 12 Months</span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyReturnsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                borderRadius: "12px",
                fontSize: "12px",
              }}
              formatter={(value: any) => [`${value}%`, "Return"]}
            />
            <Bar dataKey="return" radius={[6, 6, 0, 0]}>
              {monthlyReturnsData.map((entry, index) => (
                <Cell
                  key={`bar-${index}`}
                  fill={entry.return >= 0 ? "#10b981" : "#f43f5e"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
