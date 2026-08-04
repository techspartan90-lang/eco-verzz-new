import React, { useState } from "react";
import { PieChart, Search, Filter, Star, ArrowUpRight, Sparkles, PlusCircle } from "lucide-react";
import { toast } from "sonner";

interface Fund {
  id: string;
  name: string;
  category: "Equity ESG" | "Sectoral" | "Index" | "Debt";
  nav: number;
  return1Yr: number;
  return3Yr: number;
  rating: number;
  esgScore: number;
  risk: "Low" | "Moderate" | "High";
  aum: string;
}

const mutualFundsCatalog: Fund[] = [
  {
    id: "mf-1",
    name: "EcoVerzz ESG Climate Leaders Fund",
    category: "Equity ESG",
    nav: 148.5,
    return1Yr: 28.4,
    return3Yr: 22.1,
    rating: 5,
    esgScore: 96,
    risk: "Moderate",
    aum: "₹4,250 Cr",
  },
  {
    id: "mf-2",
    name: "Solar & Clean Energy Opportunity",
    category: "Sectoral",
    nav: 92.1,
    return1Yr: 34.2,
    return3Yr: 27.8,
    rating: 5,
    esgScore: 94,
    risk: "High",
    aum: "₹1,820 Cr",
  },
  {
    id: "mf-3",
    name: "Nifty ESG 100 Index Fund",
    category: "Index",
    nav: 215.8,
    return1Yr: 18.6,
    return3Yr: 16.4,
    rating: 4,
    esgScore: 90,
    risk: "Moderate",
    aum: "₹12,400 Cr",
  },
  {
    id: "mf-4",
    name: "Green Mobility Sovereign Bond Fund",
    category: "Debt",
    nav: 104.2,
    return1Yr: 9.8,
    return3Yr: 8.5,
    rating: 5,
    esgScore: 98,
    risk: "Low",
    aum: "₹3,100 Cr",
  },
  {
    id: "mf-5",
    name: "Sustainable Water & Sanitation Equity",
    category: "Equity ESG",
    nav: 76.4,
    return1Yr: 24.1,
    return3Yr: 19.8,
    rating: 4,
    esgScore: 92,
    risk: "Moderate",
    aum: "₹950 Cr",
  },
  {
    id: "mf-6",
    name: "Circular Economy Micro Cap Growth",
    category: "Sectoral",
    nav: 44.8,
    return1Yr: 38.9,
    return3Yr: 31.2,
    rating: 5,
    esgScore: 95,
    risk: "High",
    aum: "₹620 Cr",
  },
];

export const MutualFundsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const filteredFunds = mutualFundsCatalog.filter((fund) => {
    const matchesSearch = fund.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "ALL" || fund.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleQuickInvest = (fundName: string) => {
    toast.success("Added to Investment Draft", {
      description: `Selected ${fundName} for investment processing.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <PieChart className="w-6 h-6 text-teal-400" />
            <span>Mutual Funds Directory</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Explore 100% verified ESG & Sustainable Mutual Funds in India
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 backdrop-blur-xl">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by fund name..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-950 rounded-xl border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none text-xs">
          {["ALL", "Equity ESG", "Sectoral", "Index", "Debt"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                  : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Funds Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFunds.map((fund) => (
          <div
            key={fund.id}
            className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 backdrop-blur-xl hover:border-emerald-500/40 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {fund.category}
                </span>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{fund.rating}.0</span>
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-300 transition-colors mb-2">
                {fund.name}
              </h3>

              <div className="flex items-center gap-2 mb-4">
                <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded-md">
                  <Sparkles className="w-3 h-3" />
                  <span>ESG Score: {fund.esgScore}/100</span>
                </div>
                <span className="text-[11px] text-slate-400">Risk: {fund.risk}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 mb-4 text-center">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">NAV</span>
                  <span className="text-xs font-bold font-mono text-slate-200">₹{fund.nav}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">1Y Return</span>
                  <span className="text-xs font-bold font-mono text-emerald-400">+{fund.return1Yr}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">3Y CAGR</span>
                  <span className="text-xs font-bold font-mono text-teal-400">+{fund.return3Yr}%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <span className="text-[11px] text-slate-400">AUM: {fund.aum}</span>
              <button
                onClick={() => handleQuickInvest(fund.name)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-md shadow-emerald-500/20"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Invest</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MutualFundsPage;
