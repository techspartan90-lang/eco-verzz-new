import React, { useState } from "react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { DashboardCard } from "../components/DashboardCard";
import { PortfolioGrowthChart } from "../components/Charts/PortfolioGrowthChart";
import { AssetAllocationChart } from "../components/Charts/AssetAllocationChart";
import { MonthlyReturnsChart } from "../components/Charts/MonthlyReturnsChart";
import { RiskDistributionChart } from "../components/Charts/RiskDistributionChart";
import { RecentTransactionsTable } from "../components/Tables/RecentTransactionsTable";
import { FavoriteFundsWidget } from "../components/Widgets/FavoriteFundsWidget";
import { MarketNewsWidget } from "../components/Widgets/MarketNewsWidget";
import { AiRecommendationsWidget } from "../components/Widgets/AiRecommendationsWidget";
import { GoalsProgressWidget } from "../components/Widgets/GoalsProgressWidget";
import { SipPaymentsWidget } from "../components/Widgets/SipPaymentsWidget";
import { QuickActionsPanel } from "../components/Widgets/QuickActionsPanel";
import { toast } from "sonner";
import {
  Wallet,
  DollarSign,
  TrendingUp,
  Clock,
  BarChart2,
  ShieldAlert,
  Sparkles,
  PieChart,
  Award,
  PlusCircle,
  X,
} from "lucide-react";

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedFund, setSelectedFund] = useState("EcoVerzz ESG Climate Leaders");
  const [investmentAmount, setInvestmentAmount] = useState("10000");

  const handleAddInvestmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Investment Order Placed!", {
      description: `Added ₹${Number(investmentAmount).toLocaleString("en-IN")} into ${selectedFund}.`,
    });
    setAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 border border-slate-800 p-6 sm:p-8 shadow-xl shadow-emerald-950/20"
      >
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FastAPI & AI Engine Synchronized</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {user?.name || "Eco Investor"}!
            </h1>
            <p className="mt-1 text-sm text-slate-400 max-w-xl leading-relaxed">
              Your ESG portfolio is outperforming benchmark indices by{" "}
              <strong className="text-emerald-400">+4.2%</strong>. Total green carbon offset equivalent to{" "}
              <strong className="text-teal-300">12.4 Metric Tons</strong> CO2.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                if (!user) {
                  toast.error("Authentication Required", {
                    description: "Please sign in to place investment orders.",
                  });
                  navigate("/login", { state: { redirectTo: "/dashboard" } });
                  return;
                }
                setAddModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Invest Now</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions Panel */}
      <QuickActionsPanel
        onAddInvestment={() => {
          if (!user) {
            toast.error("Authentication Required", {
              description: "Please sign in to place investment orders.",
            });
            navigate("/login", { state: { redirectTo: "/dashboard" } });
            return;
          }
          setAddModalOpen(true);
        }}
      />

      {/* 8 KPI Dashboard Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Total Portfolio Value"
          value="₹12,48,500"
          change="+14.2% YoY"
          changeType="positive"
          subtitle="Net Asset Value"
          icon={Wallet}
          iconColor="emerald"
          badge="Live"
        />
        <DashboardCard
          title="Total Investment"
          value="₹10,20,000"
          change="+₹1.2L this year"
          changeType="positive"
          subtitle="Capital Deployed"
          icon={DollarSign}
          iconColor="teal"
        />
        <DashboardCard
          title="Current Profit/Loss"
          value="+₹2,28,500"
          change="+22.4% Return"
          changeType="positive"
          subtitle="Unrealized Gains"
          icon={TrendingUp}
          iconColor="cyan"
        />
        <DashboardCard
          title="Today's Gain/Loss"
          value="+₹12,450"
          change="+1.01% Today"
          changeType="positive"
          subtitle="Daily Movement"
          icon={Clock}
          iconColor="blue"
        />
        <DashboardCard
          title="Monthly Return"
          value="+3.85%"
          change="+0.9% vs last mo."
          changeType="positive"
          subtitle="August 2026"
          icon={BarChart2}
          iconColor="purple"
        />
        <DashboardCard
          title="Risk Score"
          value="4.2 / 10"
          change="Moderate Risk"
          changeType="neutral"
          subtitle="Balanced Portfolio"
          icon={ShieldAlert}
          iconColor="amber"
        />
        <DashboardCard
          title="AI Confidence Score"
          value="96.8%"
          change="High Precision"
          changeType="positive"
          subtitle="EcoVerzz LLM v4.2"
          icon={Sparkles}
          iconColor="emerald"
          badge="AI Model"
        />
        <DashboardCard
          title="Number of Funds"
          value="14 Funds"
          change="4 Asset Classes"
          changeType="neutral"
          subtitle="100% ESG Compliant"
          icon={PieChart}
          iconColor="teal"
        />
      </div>

      {/* Charts Grid: 2x2 Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PortfolioGrowthChart />
        <AssetAllocationChart />
        <MonthlyReturnsChart />
        <RiskDistributionChart />
      </div>

      {/* Widgets & Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Transactions & AI Preview */}
        <div className="lg:col-span-2 space-y-6">
          <RecentTransactionsTable />
          <AiRecommendationsWidget />
        </div>

        {/* Right 1 Column: Watchlist, News, Goals, SIP */}
        <div className="space-y-6">
          <FavoriteFundsWidget />
          <MarketNewsWidget />
          <GoalsProgressWidget />
          <SipPaymentsWidget />
        </div>
      </div>

      {/* Add Investment Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative"
          >
            <button
              onClick={() => setAddModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <PlusCircle className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-slate-100">Add Investment</h3>
            </div>

            <form onSubmit={handleAddInvestmentSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Select Mutual Fund
                </label>
                <select
                  value={selectedFund}
                  onChange={(e) => setSelectedFund(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="EcoVerzz ESG Climate Leaders">EcoVerzz ESG Climate Leaders</option>
                  <option value="Solar & Clean Tech Leaders">Solar & Clean Tech Leaders</option>
                  <option value="Nifty ESG 100 Index Fund">Nifty ESG 100 Index Fund</option>
                  <option value="Green Mobility Sovereign Bond">Green Mobility Sovereign Bond</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Investment Amount (₹)
                </label>
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                  placeholder="e.g. 10000"
                  required
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-800 text-slate-400 font-semibold hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all shadow-md shadow-emerald-500/20"
                >
                  Confirm Investment
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
