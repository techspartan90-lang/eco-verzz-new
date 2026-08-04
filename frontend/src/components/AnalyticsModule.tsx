import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis,
  Tooltip, CartesianGrid, Legend, PieChart, Pie, Cell, ComposedChart, Scatter
} from "recharts";
import {
  TrendingUp, ShieldAlert, DollarSign, PieChart as PieChartIcon, Activity,
  RefreshCw, Sparkles, Sliders, CheckCircle2, ArrowUpRight, BarChart2, Layers,
  ExternalLink, BrainCircuit, Globe, Database, FileSpreadsheet, Newspaper, AlertTriangle
} from "lucide-react";
import { integrations, StockEsgData, NewsArticle, OpenAIInsightResponse, SyncStatus } from "../services/integrations";

// COLOR PALETTE FOR CHARTS & HEATMAPS
const COLORS = ["#10b981", "#06b6d4", "#6366f1", "#f59e0b", "#ec4899", "#8b5cf6"];

// MOCK FINANCIAL & INVESTMENT ANALYTICS DATA
const INVESTMENT_GROWTH = [
  { month: "Jan", capitalInvested: 450000, carbonYield: 12400, projectROI: 8.2 },
  { month: "Feb", capitalInvested: 520000, carbonYield: 14800, projectROI: 9.1 },
  { month: "Mar", capitalInvested: 610000, carbonYield: 18200, projectROI: 10.4 },
  { month: "Apr", capitalInvested: 740000, carbonYield: 22100, projectROI: 11.2 },
  { month: "May", capitalInvested: 890000, carbonYield: 27500, projectROI: 12.8 },
  { month: "Jun", capitalInvested: 1020000, carbonYield: 32400, projectROI: 13.5 },
  { month: "Jul", capitalInvested: 1150000, carbonYield: 38900, projectROI: 14.2 },
  { month: "Aug", capitalInvested: 1250000, carbonYield: 44200, projectROI: 15.1 },
];

const PORTFOLIO_ALLOCATION = [
  { name: "Solar Grid Infrastructure", value: 35, capital: "$437,500" },
  { name: "Wind Turbine Farms", value: 25, capital: "$312,500" },
  { name: "Smart Waste & Circular Economy", value: 20, capital: "$250,000" },
  { name: "Reforestation Carbon Offsets", value: 15, capital: "$187,500" },
  { name: "Green Hydrogen Tech", value: 5, capital: "$62,500" },
];

const MONTHLY_RETURNS = [
  { month: "Jan", portfolioReturn: 2.1, benchmarkSAndP: 1.2, alpha: 0.9 },
  { month: "Feb", portfolioReturn: 3.4, benchmarkSAndP: 1.8, alpha: 1.6 },
  { month: "Mar", portfolioReturn: 2.8, benchmarkSAndP: -0.4, alpha: 3.2 },
  { month: "Apr", portfolioReturn: 4.1, benchmarkSAndP: 2.1, alpha: 2.0 },
  { month: "May", portfolioReturn: 3.9, benchmarkSAndP: 1.5, alpha: 2.4 },
  { month: "Jun", portfolioReturn: 5.2, benchmarkSAndP: 2.8, alpha: 2.4 },
  { month: "Jul", portfolioReturn: 4.6, benchmarkSAndP: 1.9, alpha: 2.7 },
  { month: "Aug", portfolioReturn: 5.8, benchmarkSAndP: 2.3, alpha: 3.5 },
];

const ESG_RISK_HEATMAP_MATRIX = [
  { ward: "Ward 12 (Central)", wasteSegregation: 94, carbonOffset: 88, compliance: 96, slaSpeed: 92, overallRisk: "Low" },
  { ward: "Ward 24 (Western)", wasteSegregation: 74, carbonOffset: 70, compliance: 82, slaSpeed: 68, overallRisk: "Medium" },
  { ward: "Ward 08 (Eastern)", wasteSegregation: 92, carbonOffset: 94, compliance: 90, slaSpeed: 95, overallRisk: "Low" },
  { ward: "Ward 31 (Northern)", wasteSegregation: 62, carbonOffset: 58, compliance: 65, slaSpeed: 52, overallRisk: "High" },
  { ward: "Ward 17 (Southern)", wasteSegregation: 86, carbonOffset: 82, compliance: 88, slaSpeed: 84, overallRisk: "Low" },
];

export const AnalyticsModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"investment" | "portfolio" | "risk" | "returns">("investment");
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    lastSyncedAt: new Date().toLocaleTimeString(),
    isSyncing: false,
    status: "Idle",
    syncedSources: ["Google Sheets", "Yahoo Finance", "Alpha Vantage", "News API", "OpenAI API"],
  });

  const [stocks, setStocks] = useState<StockEsgData[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [aiInsight, setAiInsight] = useState<OpenAIInsightResponse | null>(null);
  const [carbonStressPrice, setCarbonStressPrice] = useState<number>(75);

  useEffect(() => {
    // Subscribe to auto-sync status
    const unsubscribe = integrations.subscribeSync((status) => setSyncStatus(status));

    // Load initial external data
    integrations.getYahooFinanceEsgData().then(setStocks);
    integrations.getGreenNewsFeed().then(setNews);
    integrations.generateOpenAIInsight({ capital: 1250000, roi: 15.1 }).then(setAiInsight);

    return () => unsubscribe();
  }, []);

  const handleManualSync = async () => {
    await integrations.triggerAutoSync();
    const updatedStocks = await integrations.getYahooFinanceEsgData();
    setStocks(updatedStocks);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans pb-16">
      {/* Header Bar with Live Data Integration Sync */}
      <div className="bg-[#090d14] border-b border-slate-800 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-white tracking-tight uppercase">EcoVerzz Analytics Engine</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  Recharts v2.15 Active
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Institutional ESG Risk, Return & Investment Intelligence</p>
            </div>
          </div>

          {/* External Integrations Auto-Sync Control */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-slate-400">Auto-Synced Data:</span>
              <span className="text-emerald-400 font-bold font-mono">
                {syncStatus.isSyncing ? "Syncing..." : `Last: ${syncStatus.lastSyncedAt}`}
              </span>
            </div>

            <button
              onClick={handleManualSync}
              disabled={syncStatus.isSyncing}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition-all cursor-pointer shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncStatus.isSyncing ? "animate-spin" : ""}`} />
              <span>{syncStatus.isSyncing ? "Syncing Data..." : "Sync All Sources"}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top Synchronized Integrations Pill Badge */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/30 border border-emerald-500/20 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300 font-semibold">Active External Integrations:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { name: "Google Sheets", icon: FileSpreadsheet, status: "Connected" },
              { name: "Yahoo Finance", icon: Database, status: "Live Feed" },
              { name: "Alpha Vantage", icon: Activity, status: "Synced" },
              { name: "News API", icon: Newspaper, status: "4 Articles" },
              { name: "OpenAI GPT-4o", icon: BrainCircuit, status: "Active AI" }
            ].map(item => {
              const Icon = item.icon;
              return (
                <span key={item.name} className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px] flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{item.name}</span>
                  <span className="text-[10px] text-emerald-400">({item.status})</span>
                </span>
              );
            })}
          </div>
        </div>

        {/* AI Insight Summary Banner powered by OpenAI */}
        {aiInsight && (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-indigo-950/40 border border-indigo-500/30 shadow-xl relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                <BrainCircuit className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">OpenAI Portfolio & Risk Insight</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/40">
                      ESG Rating: {aiInsight.esgRating}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">GPT-4o Realtime Analysis</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">{aiInsight.summary}</p>
                <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <span className="font-bold text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Key Risk Factors:
                    </span>
                    <ul className="list-disc list-inside text-slate-400 text-[11px] space-y-0.5">
                      {aiInsight.keyRisks.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> AI Recommendations:
                    </span>
                    <ul className="list-disc list-inside text-slate-400 text-[11px] space-y-0.5">
                      {aiInsight.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
          {[
            { id: "investment", label: "Investment Analytics", icon: DollarSign },
            { id: "portfolio", label: "Portfolio Analytics", icon: PieChartIcon },
            { id: "risk", label: "Risk Analytics & Heatmap", icon: ShieldAlert },
            { id: "returns", label: "Return & Trend Analysis", icon: TrendingUp },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 1. INVESTMENT ANALYTICS TAB */}
        {activeTab === "investment" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
                <div className="text-xs text-slate-400 font-medium mb-1">Total Capital Allocated</div>
                <div className="text-2xl font-black text-white">$1,250,000</div>
                <div className="text-[11px] text-emerald-400 mt-2 font-medium flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +15.1% Cumulative ROI
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
                <div className="text-xs text-slate-400 font-medium mb-1">Carbon Credit Yield</div>
                <div className="text-2xl font-black text-emerald-400">44,200 <span className="text-xs font-normal text-slate-400">tCO₂e</span></div>
                <div className="text-[11px] text-slate-400 mt-2">Valued at $75/ton ($3.31M)</div>
              </div>

              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
                <div className="text-xs text-slate-400 font-medium mb-1">Active Clean Tech Projects</div>
                <div className="text-2xl font-black text-cyan-400">14 <span className="text-xs font-normal text-slate-400">Projects</span></div>
                <div className="text-[11px] text-cyan-400 mt-2">100% On Schedule</div>
              </div>

              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
                <div className="text-xs text-slate-400 font-medium mb-1">Internal Rate of Return (IRR)</div>
                <div className="text-2xl font-black text-amber-400">18.4%</div>
                <div className="text-[11px] text-amber-400 mt-2">Top 5% Benchmark</div>
              </div>
            </div>

            {/* Recharts Area Chart: Capital Growth & Carbon Yield */}
            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/50 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-base font-bold text-white">Capital Deployment & Carbon Credit Yield Trajectory</h3>
                  <p className="text-xs text-slate-400">Monthly progression of capital invested ($) vs Carbon Offset Yield (tCO₂e)</p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1 text-emerald-400 font-bold"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"/> Capital ($)</span>
                  <span className="flex items-center gap-1 text-cyan-400 font-bold"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block"/> Yield (tCO₂e)</span>
                </div>
              </div>

              <div className="h-80 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={INVESTMENT_GROWTH} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCapital" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <YAxis yAxisId="left" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 12 }} tickFormatter={(v) => `$${v/1000}k`} />
                    <YAxis yAxisId="right" orientation="right" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", color: "#fff" }}
                    />
                    <Area yAxisId="left" type="monotone" dataKey="capitalInvested" name="Capital Invested ($)" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCapital)" />
                    <Area yAxisId="right" type="monotone" dataKey="carbonYield" name="Carbon Yield (tCO2e)" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorYield)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* 2. PORTFOLIO ANALYTICS TAB */}
        {activeTab === "portfolio" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recharts Donut/Pie Chart: Asset Allocation */}
              <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/50 space-y-4">
                <h3 className="text-base font-bold text-white">Asset Allocation Breakdown</h3>
                <p className="text-xs text-slate-400">Distribution of green capital across sustainable sector categories</p>
                <div className="h-72 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={PORTFOLIO_ALLOCATION}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={95}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {PORTFOLIO_ALLOCATION.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", color: "#fff" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2">
                  {PORTFOLIO_ALLOCATION.map((item, idx) => (
                    <div key={item.name} className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                        <span className="text-slate-300 font-medium">{item.name}</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-400">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Yahoo Finance Realtime Stock ESG Table */}
              <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/50 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Synchronized Stock ESG Holdings</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Yahoo Finance Sync</span>
                </div>
                <div className="space-y-3">
                  {stocks.map(stk => (
                    <div key={stk.symbol} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-white font-mono">{stk.symbol}</span>
                          <span className="text-slate-400">• {stk.name}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">Carbon Intensity: {stk.carbonIntensity}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-white">${stk.price} <span className={`text-[11px] ${stk.changePercent >= 0 ? "text-emerald-400" : "text-rose-400"}`}>{stk.changePercent >= 0 ? "+" : ""}{stk.changePercent}%</span></div>
                        <div className="text-[11px] text-emerald-400 font-mono">ESG Score: {stk.esgScore}/100</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. RISK ANALYTICS & HEATMAP TAB */}
        {activeTab === "risk" && (
          <div className="space-y-6">
            {/* Risk Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { label: "Sharpe Ratio", val: "2.42", desc: "Top Tier Risk-Adjusted", color: "text-emerald-400" },
                { label: "Annual Volatility", val: "11.8%", desc: "-4.2% Lower than Market", color: "text-cyan-400" },
                { label: "Max Drawdown", val: "8.2%", desc: "Protected Capital Buffer", color: "text-indigo-400" },
                { label: "Value at Risk (VaR)", val: "4.1%", desc: "95% Confidence Level", color: "text-amber-400" },
                { label: "Portfolio Beta", val: "0.64", desc: "Defensive ESG Tilt", color: "text-purple-400" },
              ].map(m => (
                <div key={m.label} className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 text-center">
                  <div className="text-xs text-slate-400">{m.label}</div>
                  <div className={`text-2xl font-black mt-1 ${m.color}`}>{m.val}</div>
                  <div className="text-[10px] text-slate-500 mt-1">{m.desc}</div>
                </div>
              ))}
            </div>

            {/* Custom Risk & Municipal ESG Heatmap Matrix */}
            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/50 space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">Municipal ESG & Operational Risk Heatmap Matrix</h3>
                <p className="text-xs text-slate-400">Real-time risk assessment across municipal wards (Higher score = Lower risk)</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[11px]">
                      <th className="py-3 px-4">Municipal Ward</th>
                      <th className="py-3 px-4">Waste Segregation %</th>
                      <th className="py-3 px-4">Carbon Offset Score</th>
                      <th className="py-3 px-4">Compliance Rating</th>
                      <th className="py-3 px-4">SLA Response Speed</th>
                      <th className="py-3 px-4">Overall Risk Profile</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 font-mono">
                    {ESG_RISK_HEATMAP_MATRIX.map(row => (
                      <tr key={row.ward} className="hover:bg-slate-800/30">
                        <td className="py-3.5 px-4 font-bold text-white">{row.ward}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold ${row.wasteSegregation >= 85 ? "bg-emerald-500/20 text-emerald-300" : row.wasteSegregation >= 70 ? "bg-amber-500/20 text-amber-300" : "bg-rose-500/20 text-rose-300"}`}>
                            {row.wasteSegregation}%
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold ${row.carbonOffset >= 85 ? "bg-emerald-500/20 text-emerald-300" : row.carbonOffset >= 70 ? "bg-amber-500/20 text-amber-300" : "bg-rose-500/20 text-rose-300"}`}>
                            {row.carbonOffset} pts
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold ${row.compliance >= 85 ? "bg-emerald-500/20 text-emerald-300" : row.compliance >= 70 ? "bg-amber-500/20 text-amber-300" : "bg-rose-500/20 text-rose-300"}`}>
                            {row.compliance}%
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold ${row.slaSpeed >= 85 ? "bg-emerald-500/20 text-emerald-300" : row.slaSpeed >= 70 ? "bg-amber-500/20 text-amber-300" : "bg-rose-500/20 text-rose-300"}`}>
                            {row.slaSpeed} pts
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${row.overallRisk === "Low" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : row.overallRisk === "Medium" ? "bg-amber-500/10 text-amber-400 border border-amber-500/30" : "bg-rose-500/10 text-rose-400 border border-rose-500/30"}`}>
                            {row.overallRisk} Risk
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. RETURN ANALYTICS & TREND ANALYSIS TAB */}
        {activeTab === "returns" && (
          <div className="space-y-6">
            {/* Recharts Composed Chart: Line + Bar for Return & Alpha Trends */}
            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/50 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-base font-bold text-white">Monthly Portfolio Return vs Benchmark Alpha</h3>
                  <p className="text-xs text-slate-400">Comparing EcoVerzz Green Fund Returns (%) against S&P 500 ESG Index</p>
                </div>
              </div>

              <div className="h-80 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={MONTHLY_RETURNS} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", color: "#fff" }} />
                    <Legend />
                    <Bar dataKey="portfolioReturn" name="EcoVerzz Green Return (%)" fill="#10b981" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="benchmarkSAndP" name="S&P 500 ESG Index (%)" fill="#475569" radius={[6, 6, 0, 0]} />
                    <Line type="monotone" dataKey="alpha" name="Generated Alpha (%)" stroke="#f59e0b" strokeWidth={3} dot={{ r: 5 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
