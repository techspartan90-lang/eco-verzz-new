import React, { useState, useEffect } from "react";
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, 
  Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from "recharts";
import { ArrowLeftRight, Check, Sparkles, Trophy, ShieldAlert, BarChart2 } from "lucide-react";
import { api } from "../services/api";

const ALL_FUNDS = [
  { symbol: "ECO-SOLAR", name: "EcoVerzz Global Solar Infrastructure", nav: 142.50, cagr_3yr: 18.4, returns_1yr: 22.1, expense_ratio: 0.45, sharpe_ratio: 2.65, sortino_ratio: 3.10, volatility: 12.4, risk_level: "Moderate", esg_rating: "AAA" },
  { symbol: "ECO-WIND", name: "EcoVerzz Offshore Wind & Grid Trust", nav: 98.20, cagr_3yr: 15.2, returns_1yr: 17.8, expense_ratio: 0.38, sharpe_ratio: 2.40, sortino_ratio: 2.85, volatility: 10.8, risk_level: "Low", esg_rating: "AAA" },
  { symbol: "CARBON-YIELD", name: "EcoVerzz Verified Carbon Credit Yield", nav: 210.80, cagr_3yr: 24.6, returns_1yr: 29.4, expense_ratio: 0.62, sharpe_ratio: 2.15, sortino_ratio: 2.50, volatility: 18.2, risk_level: "High", esg_rating: "AA" },
  { symbol: "ECO-WASTE", name: "EcoVerzz Circular Waste Index", nav: 74.30, cagr_3yr: 13.8, returns_1yr: 15.4, expense_ratio: 0.32, sharpe_ratio: 2.55, sortino_ratio: 3.05, volatility: 9.2, risk_level: "Low", esg_rating: "AAA" },
  { symbol: "GREEN-HYDRO", name: "NextGen Green Hydrogen ETF", nav: 315.40, cagr_3yr: 28.2, returns_1yr: 34.6, expense_ratio: 0.75, sharpe_ratio: 1.95, sortino_ratio: 2.20, volatility: 24.5, risk_level: "Aggressive", esg_rating: "AA" }
];

export const FundComparisonModule: React.FC = () => {
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>(["ECO-SOLAR", "ECO-WIND", "CARBON-YIELD"]);
  const [comparedData, setComparedData] = useState<any>(null);

  useEffect(() => {
    api.compareFunds(selectedSymbols)
      .then(res => setComparedData(res))
      .catch(() => {
        const filtered = ALL_FUNDS.filter(f => selectedSymbols.includes(f.symbol));
        setComparedData({ funds: filtered });
      });
  }, [selectedSymbols]);

  const toggleFund = (symbol: string) => {
    if (selectedSymbols.includes(symbol)) {
      if (selectedSymbols.length > 1) {
        setSelectedSymbols(selectedSymbols.filter(s => s !== symbol));
      }
    } else {
      if (selectedSymbols.length < 4) {
        setSelectedSymbols([...selectedSymbols, symbol]);
      }
    }
  };

  const selectedFunds = comparedData?.funds || ALL_FUNDS.filter(f => selectedSymbols.includes(f.symbol));

  // Prepare radar metrics
  const radarData = [
    { metric: "3Yr CAGR (%)" },
    { metric: "1Yr Return (%)" },
    { metric: "Sharpe Ratio (x10)" },
    { metric: "Sortino Ratio (x10)" },
    { metric: "Low Volatility (30-Vol)" },
  ].map(item => {
    const res: any = { metric: item.metric };
    selectedFunds.forEach((f: any) => {
      if (item.metric.includes("CAGR")) res[f.symbol] = f.cagr_3yr;
      else if (item.metric.includes("Return")) res[f.symbol] = f.returns_1yr;
      else if (item.metric.includes("Sharpe")) res[f.symbol] = f.sharpe_ratio * 10;
      else if (item.metric.includes("Sortino")) res[f.symbol] = f.sortino_ratio * 10;
      else if (item.metric.includes("Volatility")) res[f.symbol] = Math.max(0, 30 - f.volatility);
    });
    return res;
  });

  const COLORS = ["#10b981", "#06b6d4", "#f59e0b", "#ec4899"];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-3xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              Institutional Fund Comparison Engine
            </span>
            <span className="text-xs text-slate-400">Recharts Radar & Bar Metrics</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-2">Green Fund Performance & Risk Matrix</h1>
          <p className="text-xs text-slate-400 mt-1">Compare Returns, CAGR, NAV, Expense Ratio, Sharpe Ratio, Sortino Ratio, and Volatility.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-2 rounded-2xl border border-emerald-500/20">
          <ArrowLeftRight className="w-4 h-4" /> Compare Up to 4 Funds
        </div>
      </div>

      {/* Fund Selector Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center gap-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Funds to Compare:</span>
        {ALL_FUNDS.map(fund => {
          const isSelected = selectedSymbols.includes(fund.symbol);
          return (
            <button
              key={fund.symbol}
              onClick={() => toggleFund(fund.symbol)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                isSelected
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-md"
                  : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-emerald-400" : "bg-slate-600"}`} />
              <span>{fund.symbol}</span>
            </button>
          );
        })}
      </div>

      {/* Metric Comparison Cards & Recharts Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recharts Radar Chart */}
        <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/50 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Multi-Metric Risk vs Return Radar Chart
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="metric" stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <PolarRadiusAxis stroke="#334155" />
                {selectedFunds.map((f: any, idx: number) => (
                  <Radar
                    key={f.symbol}
                    name={f.symbol}
                    dataKey={f.symbol}
                    stroke={COLORS[idx % COLORS.length]}
                    fill={COLORS[idx % COLORS.length]}
                    fillOpacity={0.3}
                  />
                ))}
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", color: "#fff" }} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recharts Bar Chart Comparison for CAGR & Sharpe Ratio */}
        <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/50 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-emerald-400" /> 3Yr CAGR (%) vs Sharpe Ratio Comparison
          </h3>
          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={selectedFunds} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="symbol" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", color: "#fff" }} />
                <Legend />
                <Bar dataKey="cagr_3yr" name="3Yr CAGR (%)" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="returns_1yr" name="1Yr Return (%)" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comprehensive Comparison Table */}
      <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/50 space-y-4">
        <h3 className="text-base font-bold text-white">Side-by-Side Metric Comparison Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[11px]">
                <th className="py-3 px-4">Fund Name</th>
                <th className="py-3 px-4">NAV ($)</th>
                <th className="py-3 px-4">3Yr CAGR</th>
                <th className="py-3 px-4">1Yr Return</th>
                <th className="py-3 px-4">Expense Ratio</th>
                <th className="py-3 px-4">Sharpe Ratio</th>
                <th className="py-3 px-4">Sortino Ratio</th>
                <th className="py-3 px-4">Volatility</th>
                <th className="py-3 px-4">Risk Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {selectedFunds.map((fund: any) => (
                <tr key={fund.symbol} className="hover:bg-slate-800/30">
                  <td className="py-3.5 px-4 font-bold text-white">
                    <div>{fund.name}</div>
                    <span className="text-[10px] text-emerald-400 font-normal">{fund.symbol} • {fund.esg_rating}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white">${fund.nav}</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-bold">{fund.cagr_3yr}%</td>
                  <td className="py-3.5 px-4 text-cyan-400 font-bold">{fund.returns_1yr}%</td>
                  <td className="py-3.5 px-4 text-slate-300">{fund.expense_ratio}%</td>
                  <td className="py-3.5 px-4 text-amber-400 font-bold">{fund.sharpe_ratio}</td>
                  <td className="py-3.5 px-4 text-purple-400 font-bold">{fund.sortino_ratio}</td>
                  <td className="py-3.5 px-4 text-slate-300">{fund.volatility}%</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      fund.risk_level === "Low" ? "bg-emerald-500/20 text-emerald-300" :
                      fund.risk_level === "Moderate" ? "bg-cyan-500/20 text-cyan-300" :
                      fund.risk_level === "High" ? "bg-amber-500/20 text-amber-300" :
                      "bg-rose-500/20 text-rose-300"
                    }`}>
                      {fund.risk_level}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
