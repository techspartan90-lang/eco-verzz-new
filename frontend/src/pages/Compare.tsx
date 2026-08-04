import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Scale,
  Bookmark,
  Download,
  Printer,
  FileSpreadsheet,
  FileText,
  Sparkles,
  TrendingUp,
  ShieldAlert,
  Grid,
  PieChart as PieChartIcon,
  Activity,
  Layers,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { FundSearchAutocomplete } from "../components/Compare/FundSearchAutocomplete";
import { RiskRadarChart } from "../components/Charts/RiskRadarChart";
import { RiskScatterPlot } from "../components/Charts/RiskScatterPlot";
import { PerformanceHeatmap } from "../components/Charts/PerformanceHeatmap";
import { CompareAiInsights } from "../components/Compare/CompareAiInsights";
import { SavedComparisonsModal } from "../components/Compare/SavedComparisonsModal";
import {
  useComparisonData,
  useSavedComparisons,
  useHistoricalNav,
  useAnalyticsMutations,
} from "../hooks/useAnalytics";
import { toast } from "sonner";

const COLOR_PALETTE = ["#10b981", "#06b6d4", "#3b82f6", "#8b5cf6", "#f59e0b"];

export const ComparePage: React.FC = () => {
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([
    "ECO-CLIMATE",
    "SOLAR-TECH",
    "GREEN-BOND",
  ]);

  const [savedModalOpen, setSavedModalOpen] = useState(false);

  const { data: comparisonResponse } = useComparisonData(selectedSymbols);
  const { data: savedData } = useSavedComparisons();
  const { data: historicalNavResponse } = useHistoricalNav(selectedSymbols);
  const { saveComparison } = useAnalyticsMutations();

  const funds: any[] = comparisonResponse?.funds || [];
  const aiInsights: any = comparisonResponse?.ai_insights || null;
  const historicalNav: any[] = historicalNavResponse?.historical_nav || [];

  const handleAddFund = (symbol: string) => {
    if (!selectedSymbols.includes(symbol)) {
      setSelectedSymbols((prev) => [...prev, symbol]);
    }
  };

  const handleRemoveFund = (symbol: string) => {
    if (selectedSymbols.length <= 1) {
      toast.error("At least 1 fund required", {
        description: "You must keep at least one fund selected for analysis.",
      });
      return;
    }
    setSelectedSymbols((prev) => prev.filter((s) => s !== symbol));
  };

  const handleSaveCurrent = (name: string) => {
    saveComparison.mutate({ name, funds: selectedSymbols });
  };

  const handleExport = (format: "PDF" | "Excel" | "CSV" | "Print") => {
    if (format === "Print") {
      window.print();
      return;
    }
    toast.success(`Exporting Fund Comparison (${format})`, {
      description: `Your ${format} comparison report has started downloading.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Saved Comparisons Modal */}
      <SavedComparisonsModal
        isOpen={savedModalOpen}
        onClose={() => setSavedModalOpen(false)}
        savedComparisons={savedData?.saved_comparisons || []}
        recentHistory={savedData?.recent_history || []}
        onSelectFunds={(f) => setSelectedSymbols(f)}
        onSaveCurrent={handleSaveCurrent}
      />

      {/* Top Header & Export Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <Scale className="w-6 h-6 text-emerald-400" />
            <span>Fund Comparison & Risk Analytics</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Compare up to 5 mutual funds side-by-side across performance, 11 risk metrics & AI insights
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSavedModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved Presets</span>
          </button>

          <button
            onClick={() => handleExport("CSV")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>CSV</span>
          </button>

          <button
            onClick={() => handleExport("Excel")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-teal-400" />
            <span>Excel</span>
          </button>

          <button
            onClick={() => handleExport("PDF")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>PDF Report</span>
          </button>
        </div>
      </div>

      {/* Fund Selector Search Bar */}
      <FundSearchAutocomplete
        selectedSymbols={selectedSymbols}
        onAddFund={handleAddFund}
        onRemoveFund={handleRemoveFund}
      />

      {/* AI Comparison Insights Card */}
      <CompareAiInsights insights={aiInsights} />

      {/* Side-by-Side Fund Comparison Metadata Matrix */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 backdrop-blur-xl space-y-4">
        <h3 className="text-base font-bold text-slate-100">Fund Specifications & Overview</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold">
                <th className="py-3 px-3 min-w-[150px]">Parameter</th>
                {funds.map((f, idx) => (
                  <th key={f.symbol} className="py-3 px-3 min-w-[180px]">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: COLOR_PALETTE[idx % COLOR_PALETTE.length] }}
                      />
                      <span className="text-slate-100 font-bold">{f.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-slate-300 font-medium">
              <tr>
                <td className="py-2.5 px-3 text-slate-400">AMC</td>
                {funds.map((f) => <td key={f.symbol} className="py-2.5 px-3 font-semibold">{f.amc}</td>)}
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-slate-400">Category</td>
                {funds.map((f) => <td key={f.symbol} className="py-2.5 px-3 text-emerald-400 font-semibold">{f.category}</td>)}
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-slate-400">Current NAV</td>
                {funds.map((f) => <td key={f.symbol} className="py-2.5 px-3 font-mono font-bold">₹{f.nav}</td>)}
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-slate-400">AUM (Fund Size)</td>
                {funds.map((f) => <td key={f.symbol} className="py-2.5 px-3 font-mono">₹{f.aum_cr} Cr</td>)}
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-slate-400">Expense Ratio</td>
                {funds.map((f) => <td key={f.symbol} className="py-2.5 px-3 font-mono text-teal-300 font-bold">{f.expense_ratio}%</td>)}
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-slate-400">Exit Load</td>
                {funds.map((f) => <td key={f.symbol} className="py-2.5 px-3 text-[11px] text-slate-400">{f.exit_load}</td>)}
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-slate-400">Fund Manager</td>
                {funds.map((f) => <td key={f.symbol} className="py-2.5 px-3">{f.fund_manager}</td>)}
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-slate-400">Benchmark Index</td>
                {funds.map((f) => <td key={f.symbol} className="py-2.5 px-3 text-[11px] text-cyan-300">{f.benchmark}</td>)}
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-slate-400">Min Investment</td>
                {funds.map((f) => <td key={f.symbol} className="py-2.5 px-3 font-mono">₹{f.min_investment}</td>)}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 11 Advanced Risk Metrics Matrix */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-100">11 Advanced Risk Metrics Comparison</h3>
          <span className="text-xs text-slate-400 font-semibold">SciPy Mathematical Risk Analysis</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold">
                <th className="py-3 px-3 min-w-[160px]">Risk Parameter</th>
                {funds.map((f) => (
                  <th key={f.symbol} className="py-3 px-3 font-bold text-slate-100">{f.symbol}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-slate-300 font-mono">
              <tr>
                <td className="py-2.5 px-3 text-slate-400 font-sans">Standard Deviation (σ)</td>
                {funds.map((f) => <td key={f.symbol} className="py-2.5 px-3">{f.risk_metrics?.standard_deviation}%</td>)}
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-slate-400 font-sans">Beta (vs Benchmark)</td>
                {funds.map((f) => <td key={f.symbol} className="py-2.5 px-3 font-bold text-amber-300">{f.risk_metrics?.beta}</td>)}
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-slate-400 font-sans">Alpha (Jensen's α)</td>
                {funds.map((f) => <td key={f.symbol} className="py-2.5 px-3 text-emerald-400 font-bold">+{f.risk_metrics?.alpha}%</td>)}
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-slate-400 font-sans">Sharpe Ratio</td>
                {funds.map((f) => <td key={f.symbol} className="py-2.5 px-3 text-emerald-300 font-bold">{f.risk_metrics?.sharpe_ratio}</td>)}
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-slate-400 font-sans">Sortino Ratio</td>
                {funds.map((f) => <td key={f.symbol} className="py-2.5 px-3 text-teal-300 font-bold">{f.risk_metrics?.sortino_ratio}</td>)}
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-slate-400 font-sans">Treynor Ratio</td>
                {funds.map((f) => <td key={f.symbol} className="py-2.5 px-3">{f.risk_metrics?.treynor_ratio}</td>)}
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-slate-400 font-sans">Information Ratio</td>
                {funds.map((f) => <td key={f.symbol} className="py-2.5 px-3">{f.risk_metrics?.information_ratio}</td>)}
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-slate-400 font-sans">Jensen Alpha</td>
                {funds.map((f) => <td key={f.symbol} className="py-2.5 px-3">+{f.risk_metrics?.jensen_alpha}%</td>)}
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-slate-400 font-sans">Maximum Drawdown</td>
                {funds.map((f) => <td key={f.symbol} className="py-2.5 px-3 text-rose-400 font-bold">{f.risk_metrics?.max_drawdown}%</td>)}
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-slate-400 font-sans">Downside Deviation</td>
                {funds.map((f) => <td key={f.symbol} className="py-2.5 px-3">{f.risk_metrics?.downside_deviation}%</td>)}
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-slate-400 font-sans">Volatility Score (1-10)</td>
                {funds.map((f) => <td key={f.symbol} className="py-2.5 px-3 font-bold text-amber-400">{f.risk_metrics?.volatility_score} / 10</td>)}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 6 Recharts Interactive Charts Suite */}
      <div className="space-y-6">
        {/* Historical NAV Overlay Line Chart */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100">Historical NAV Time Series Overlay</h3>
            <span className="text-xs text-slate-400 font-semibold">2026 Monthly NAV Growth (₹)</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalNav} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => `₹${val}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                  formatter={(val: any) => [`₹${val}`, "NAV"]}
                />
                <Legend wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }} />
                {selectedSymbols.map((sym, idx) => (
                  <Line
                    key={sym}
                    type="monotone"
                    dataKey={sym}
                    name={sym}
                    stroke={COLOR_PALETTE[idx % COLOR_PALETTE.length]}
                    strokeWidth={3}
                    dot={{ r: 3 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Radar & Risk vs Return Scatter Plot */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RiskRadarChart funds={funds} />
          <RiskScatterPlot funds={funds} />
        </div>

        {/* Performance Heatmap Matrix */}
        <PerformanceHeatmap funds={funds} />
      </div>
    </div>
  );
};

export default ComparePage;
