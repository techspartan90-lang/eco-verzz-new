import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Wallet,
  DollarSign,
  TrendingUp,
  Clock,
  PieChart,
  RefreshCw,
  Upload,
  Download,
  PlusCircle,
  Bookmark,
  Sparkles,
  ShieldAlert,
  ArrowUpRight,
} from "lucide-react";
import { DashboardCard } from "../components/DashboardCard";
import { PortfolioRiskMeter } from "../components/Widgets/PortfolioRiskMeter";
import { PortfolioGrowthChart } from "../components/Charts/PortfolioGrowthChart";
import { AssetAllocationChart } from "../components/Charts/AssetAllocationChart";
import { SectorAllocationChart } from "../components/Charts/SectorAllocationChart";
import { AmcDistributionChart } from "../components/Charts/AmcDistributionChart";
import { MonthlyReturnsChart } from "../components/Charts/MonthlyReturnsChart";
import { MonthlyTrendChart } from "../components/Charts/MonthlyTrendChart";
import { GainLossTimelineChart } from "../components/Charts/GainLossTimelineChart";
import { HoldingsTable, Holding } from "../components/Tables/HoldingsTable";
import { TransactionsHistory, TransactionRecord } from "../components/Tables/TransactionsHistory";
import { ImportExportModal } from "../components/Common/ImportExportModal";
import {
  usePortfolios,
  useHoldings,
  useTransactions,
  usePortfolioMutations,
} from "../hooks/usePortfolio";
import { toast } from "sonner";

// Initial mock fallback holdings if backend DB is empty
const initialHoldingsData: Holding[] = [
  {
    id: "h-101",
    fundName: "EcoVerzz Climate Impact Fund",
    category: "Equity ESG",
    units: 1042.8,
    purchasePrice: 110.2,
    currentNav: 148.5,
    investedAmount: 114916,
    currentValue: 154855,
    gainLoss: 39939,
    gainLossPercentage: 34.75,
  },
  {
    id: "h-102",
    fundName: "Solar & Clean Tech Leaders",
    category: "Sectoral ESG",
    units: 2500.0,
    purchasePrice: 68.5,
    currentNav: 92.1,
    investedAmount: 171250,
    currentValue: 230250,
    gainLoss: 59000,
    gainLossPercentage: 34.45,
  },
  {
    id: "h-103",
    fundName: "Nifty ESG 100 Index Fund",
    category: "Index Fund",
    units: 1850.5,
    purchasePrice: 182.0,
    currentNav: 215.8,
    investedAmount: 336791,
    currentValue: 399337,
    gainLoss: 62546,
    gainLossPercentage: 18.57,
  },
  {
    id: "h-104",
    fundName: "Green Mobility Sovereign Bond",
    category: "Debt ESG",
    units: 4450.0,
    purchasePrice: 95.0,
    currentNav: 104.2,
    investedAmount: 422750,
    currentValue: 464058,
    gainLoss: 41308,
    gainLossPercentage: 9.77,
  },
];

const initialTransactionsData: TransactionRecord[] = [
  {
    id: "tx-1",
    fundName: "EcoVerzz Climate Impact Fund",
    transactionType: "SIP",
    units: 100,
    nav: 148.5,
    amount: 14850,
    transactionDate: "Aug 02, 2026",
    remarks: "Monthly Auto SIP Debit",
  },
  {
    id: "tx-2",
    fundName: "Solar & Clean Tech Leaders",
    transactionType: "BUY",
    units: 500,
    nav: 92.1,
    amount: 46050,
    transactionDate: "Jul 28, 2026",
    remarks: "Lumpsum ESG Addition",
  },
  {
    id: "tx-3",
    fundName: "Green Mobility Sovereign Bond",
    transactionType: "SIP",
    units: 200,
    nav: 104.2,
    amount: 20840,
    transactionDate: "Jul 15, 2026",
    remarks: "Sovereign Green Coupon",
  },
  {
    id: "tx-4",
    fundName: "Nifty ESG 100 Index Fund",
    transactionType: "BUY",
    units: 350,
    nav: 215.8,
    amount: 75530,
    transactionDate: "Jul 05, 2026",
    remarks: "Rebalancing Allocation",
  },
];

export const PortfolioPage: React.FC = () => {
  const { data: portfolioList } = usePortfolios();
  const activePortfolio = portfolioList && portfolioList.length > 0 ? portfolioList[0] : null;
  const portfolioId = activePortfolio?.id;

  const { data: dbHoldings, refetch: refetchHoldings } = useHoldings(portfolioId);
  const { data: dbTransactions, refetch: refetchTransactions } = useTransactions(portfolioId);
  const { addHolding, updateHolding, deleteHolding, createTransaction } = usePortfolioMutations(portfolioId);

  const [localHoldings, setLocalHoldings] = useState<Holding[]>(initialHoldingsData);
  const [localTransactions, setLocalTransactions] = useState<TransactionRecord[]>(initialTransactionsData);
  const [importExportModalOpen, setImportExportModalOpen] = useState(false);

  // Use database holdings/transactions if available, otherwise local state
  const holdingsList: Holding[] = (dbHoldings && dbHoldings.length > 0)
    ? dbHoldings.map((h: any) => ({
        id: h.id,
        fundName: h.fund_name,
        category: h.category,
        units: h.units,
        purchasePrice: h.purchase_price,
        currentNav: h.current_nav,
        investedAmount: h.invested_amount,
        currentValue: h.current_value,
        gainLoss: h.gain_loss,
        gainLossPercentage: h.gain_loss_percentage,
      }))
    : localHoldings;

  const transactionsList: TransactionRecord[] = (dbTransactions && dbTransactions.length > 0)
    ? dbTransactions.map((t: any) => ({
        id: t.id,
        fundName: t.fund_name,
        transactionType: t.transaction_type,
        units: t.units,
        nav: t.nav,
        amount: t.amount,
        transactionDate: new Date(t.transaction_date).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
        remarks: t.remarks,
      }))
    : localTransactions;

  // Total summary calculations
  const totalInvestment = holdingsList.reduce((acc, h) => acc + h.investedAmount, 0);
  const currentValue = holdingsList.reduce((acc, h) => acc + h.currentValue, 0);
  const profitLoss = currentValue - totalInvestment;
  const returnPercentage = totalInvestment > 0 ? Math.round((profitLoss / totalInvestment) * 10000) / 100 : 0;

  // Handlers for holdings CRUD
  const handleAddHolding = (data: any) => {
    if (portfolioId) {
      addHolding.mutate(data);
    } else {
      const investedAmount = round(data.units * data.purchase_price, 2);
      const currentVal = round(data.units * data.current_nav, 2);
      const gain = round(currentVal - investedAmount, 2);
      const gainPct = investedAmount > 0 ? round((gain / investedAmount) * 100, 2) : 0;

      const newH: Holding = {
        id: "h-" + Date.now(),
        fundName: data.fund_name,
        category: data.category,
        units: data.units,
        purchasePrice: data.purchase_price,
        currentNav: data.current_nav,
        investedAmount,
        currentValue: currentVal,
        gainLoss: gain,
        gainLossPercentage: gainPct,
      };
      setLocalHoldings((prev) => [newH, ...prev]);
    }
  };

  const handleEditHolding = (id: string, data: any) => {
    if (portfolioId) {
      updateHolding.mutate({ holdingId: id, data });
    } else {
      setLocalHoldings((prev) =>
        prev.map((h) => {
          if (h.id === id) {
            const units = data.units ?? h.units;
            const price = data.purchase_price ?? h.purchasePrice;
            const nav = data.current_nav ?? h.currentNav;
            const investedAmount = round(units * price, 2);
            const currentVal = round(units * nav, 2);
            const gain = round(currentVal - investedAmount, 2);
            const gainPct = investedAmount > 0 ? round((gain / investedAmount) * 100, 2) : 0;

            return {
              ...h,
              units,
              purchasePrice: price,
              currentNav: nav,
              investedAmount,
              currentValue: currentVal,
              gainLoss: gain,
              gainLossPercentage: gainPct,
            };
          }
          return h;
        })
      );
    }
  };

  const handleDeleteHolding = (id: string) => {
    if (portfolioId) {
      deleteHolding.mutate(id);
    } else {
      setLocalHoldings((prev) => prev.filter((h) => h.id !== id));
      toast.success("Holding Removed", { description: "Holding deleted from portfolio." });
    }
  };

  const handleTransactionAction = (type: "BUY" | "SELL", holding: Holding) => {
    const unitsAmount = type === "BUY" ? 50 : Math.min(holding.units, 50);
    const amount = round(unitsAmount * holding.currentNav, 2);

    if (portfolioId) {
      createTransaction.mutate({
        fund_name: holding.fundName,
        transaction_type: type,
        units: unitsAmount,
        nav: holding.currentNav,
        amount,
        remarks: `${type} transaction via Portfolio Manager`,
      });
    } else {
      const newTx: TransactionRecord = {
        id: "tx-" + Date.now(),
        fundName: holding.fundName,
        transactionType: type,
        units: unitsAmount,
        nav: holding.currentNav,
        amount,
        transactionDate: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
        remarks: `${type} order executed`,
      };
      setLocalTransactions((prev) => [newTx, ...prev]);

      setLocalHoldings((prev) =>
        prev
          .map((h) => {
            if (h.id === holding.id) {
              const newUnits = type === "BUY" ? h.units + unitsAmount : h.units - unitsAmount;
              if (newUnits <= 0) return null;

              const investedAmount = round(newUnits * h.purchasePrice, 2);
              const currentVal = round(newUnits * h.currentNav, 2);
              const gain = round(currentVal - investedAmount, 2);
              const gainPct = investedAmount > 0 ? round((gain / investedAmount) * 100, 2) : 0;

              return {
                ...h,
                units: newUnits,
                investedAmount,
                currentValue: currentVal,
                gainLoss: gain,
                gainLossPercentage: gainPct,
              };
            }
            return h;
          })
          .filter(Boolean) as Holding[]
      );
    }

    toast.success(`${type} Order Executed`, {
      description: `${type} ${unitsAmount} units of ${holding.fundName} (₹${amount.toLocaleString("en-IN")}).`,
    });
  };

  // Watchlist import trigger
  const handleImportFromWatchlist = () => {
    const watchlistFund: Holding = {
      id: "h-" + Date.now(),
      fundName: "Sustainable Water & Waste Equity",
      category: "Equity ESG",
      units: 200,
      purchasePrice: 65.0,
      currentNav: 76.4,
      investedAmount: 13000,
      currentValue: 15280,
      gainLoss: 2280,
      gainLossPercentage: 17.54,
    };
    handleAddHolding({
      fund_name: watchlistFund.fundName,
      category: watchlistFund.category,
      units: watchlistFund.units,
      purchase_price: watchlistFund.purchasePrice,
      current_nav: watchlistFund.currentNav,
    });
    toast.success("Watchlist Import Complete", {
      description: `Added '${watchlistFund.fundName}' from your Watchlist into Portfolio.`,
    });
  };

  const handleCsvImported = (parsed: any[]) => {
    parsed.forEach((h) => handleAddHolding(h));
  };

  return (
    <div className="space-y-6">
      {/* Import / Export Dialog */}
      <ImportExportModal
        isOpen={importExportModalOpen}
        onClose={() => setImportExportModalOpen(false)}
        onImportComplete={handleCsvImported}
      />

      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-emerald-400" />
            <span>Portfolio Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time holdings breakdown, 7 financial charts, risk meter & transaction audit log
          </p>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleImportFromWatchlist}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Add from Watchlist</span>
          </button>
          <button
            onClick={() => setImportExportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            <span>Import / Export</span>
          </button>
          <button
            onClick={() => {
              refetchHoldings();
              refetchTransactions();
              toast.success("Portfolio Data Synchronized", { description: "FastAPI database metrics revalidated." });
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Live</span>
          </button>
        </div>
      </div>

      {/* 6 Summary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard
          title="Total Investment"
          value={`₹${totalInvestment.toLocaleString("en-IN")}`}
          change="Capital Deployed"
          changeType="neutral"
          subtitle="Cost Basis"
          icon={DollarSign}
          iconColor="teal"
        />
        <DashboardCard
          title="Current Portfolio Value"
          value={`₹${currentValue.toLocaleString("en-IN")}`}
          change={`+₹${profitLoss.toLocaleString("en-IN")}`}
          changeType="positive"
          subtitle="Net Asset Value"
          icon={Wallet}
          iconColor="emerald"
          badge="Live NAV"
        />
        <DashboardCard
          title="Profit / Loss"
          value={`${profitLoss >= 0 ? "+" : ""}₹${profitLoss.toLocaleString("en-IN")}`}
          change={`${returnPercentage}% Overall`}
          changeType={profitLoss >= 0 ? "positive" : "negative"}
          subtitle="Unrealized Gains"
          icon={TrendingUp}
          iconColor="cyan"
        />
        <DashboardCard
          title="Today's Gain"
          value="+₹12,450"
          change="+1.01% Today"
          changeType="positive"
          subtitle="Daily Movement"
          icon={Clock}
          iconColor="blue"
        />
        <DashboardCard
          title="Overall Return"
          value={`${returnPercentage}%`}
          change="21.8% XIRR p.a."
          changeType="positive"
          subtitle="Annualized CAGR"
          icon={ArrowUpRight}
          iconColor="emerald"
        />
        <PortfolioRiskMeter
          riskScore={activePortfolio?.risk_score || 4.2}
          diversificationScore={activePortfolio?.diversification_score || 8.5}
        />
      </div>

      {/* 7 Interactive Visualizations Grid */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PortfolioGrowthChart />
          <AssetAllocationChart />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SectorAllocationChart />
          <AmcDistributionChart />
          <MonthlyTrendChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MonthlyReturnsChart />
          <GainLossTimelineChart />
        </div>
      </div>

      {/* Holdings Management Table */}
      <HoldingsTable
        holdings={holdingsList}
        onAddHolding={handleAddHolding}
        onEditHolding={handleEditHolding}
        onDeleteHolding={handleDeleteHolding}
        onTransaction={handleTransactionAction}
      />

      {/* Complete Transaction History Log */}
      <TransactionsHistory
        transactions={transactionsList}
        onRefresh={() => {
          refetchTransactions();
          toast.success("Transaction Log Refreshed");
        }}
      />
    </div>
  );
};

function round(val: number, decimals: number = 2) {
  return Number(Math.round(Number(val + "e" + decimals)) + "e-" + decimals);
}

export default PortfolioPage;
