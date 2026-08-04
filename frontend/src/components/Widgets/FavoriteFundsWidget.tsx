import React from "react";
import { Star, TrendingUp, ArrowUpRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export interface FavoriteFund {
  id: string;
  name: string;
  category: string;
  nav: number;
  return1Yr: number;
  esgRating: number;
}

const favoriteFundsList: FavoriteFund[] = [
  {
    id: "f-1",
    name: "EcoVerzz Climate Impact Fund",
    category: "Equity ESG",
    nav: 148.5,
    return1Yr: 28.4,
    esgRating: 5,
  },
  {
    id: "f-2",
    name: "Solar & Clean Tech Leaders",
    category: "Sectoral ESG",
    nav: 92.1,
    return1Yr: 34.2,
    esgRating: 5,
  },
  {
    id: "f-3",
    name: "Nifty ESG 100 Index Fund",
    category: "Index Fund",
    nav: 215.8,
    return1Yr: 18.6,
    esgRating: 4,
  },
  {
    id: "f-4",
    name: "Green Mobility Sovereign Bond",
    category: "Debt ESG",
    nav: 104.2,
    return1Yr: 9.8,
    esgRating: 5,
  },
];

export const FavoriteFundsWidget: React.FC = () => {
  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 backdrop-blur-xl flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          <h3 className="text-base font-bold text-slate-100">Starred Funds</h3>
        </div>
        <Link
          to="/watchlist"
          className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
        >
          <span>Watchlist</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-2.5">
        {favoriteFundsList.map((fund) => (
          <div
            key={fund.id}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-emerald-500/30 transition-colors group"
          >
            <div className="overflow-hidden mr-2">
              <h4 className="text-xs font-bold text-slate-100 group-hover:text-emerald-400 transition-colors truncate">
                {fund.name}
              </h4>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                <span>{fund.category}</span>
                <span>•</span>
                <span className="text-amber-400">{"★".repeat(fund.esgRating)} ESG</span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs font-bold font-mono text-slate-100">
                ₹{fund.nav}
              </span>
              <div className="flex items-center justify-end text-[11px] font-bold text-emerald-400">
                <ArrowUpRight className="w-3 h-3" />
                <span>+{fund.return1Yr}% 1Y</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
