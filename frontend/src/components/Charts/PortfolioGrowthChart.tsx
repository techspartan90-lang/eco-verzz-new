import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { TrendingUp, Calendar } from "lucide-react";

const performanceData: Record<string, Array<{ month: string; portfolio: number; benchmark: number }>> = {
  "1M": [
    { month: "Week 1", portfolio: 1210000, benchmark: 1190000 },
    { month: "Week 2", portfolio: 1225000, benchmark: 1202000 },
    { month: "Week 3", portfolio: 1238000, benchmark: 1210000 },
    { month: "Week 4", portfolio: 1248500, benchmark: 1218000 },
  ],
  "6M": [
    { month: "Mar", portfolio: 1050000, benchmark: 1040000 },
    { month: "Apr", portfolio: 1090000, benchmark: 1075000 },
    { month: "May", portfolio: 1125000, benchmark: 1100000 },
    { month: "Jun", portfolio: 1180000, benchmark: 1145000 },
    { month: "Jul", portfolio: 1215000, benchmark: 1180000 },
    { month: "Aug", portfolio: 1248500, benchmark: 1218000 },
  ],
  "1Y": [
    { month: "Aug '25", portfolio: 980000, benchmark: 970000 },
    { month: "Oct '25", portfolio: 1020000, benchmark: 1000000 },
    { month: "Dec '25", portfolio: 1080000, benchmark: 1050000 },
    { month: "Feb '26", portfolio: 1140000, benchmark: 1110000 },
    { month: "May '26", portfolio: 1200000, benchmark: 1160000 },
    { month: "Aug '26", portfolio: 1248500, benchmark: 1218000 },
  ],
};

export const PortfolioGrowthChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState<"1M" | "6M" | "1Y">("6M");
  const data = performanceData[timeframe];

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 backdrop-blur-xl flex flex-col justify-between h-full">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-slate-100">Portfolio Growth</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Portfolio performance vs Nifty 50 ESG Benchmark Index
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          {(["1M", "6M", "1Y"] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                timeframe === tf
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorBenchmark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                borderRadius: "12px",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
                fontSize: "12px",
              }}
              formatter={(value: any) => [`₹${Number(value).toLocaleString("en-IN")}`, ""]}
            />
            <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "12px", color: "#94a3b8" }} />
            <Area
              type="monotone"
              dataKey="portfolio"
              name="My Eco Portfolio"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorPortfolio)"
            />
            <Area
              type="monotone"
              dataKey="benchmark"
              name="Nifty 50 ESG"
              stroke="#06b6d4"
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#colorBenchmark)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
