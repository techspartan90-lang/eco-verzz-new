import React from "react";
import { Bookmark, Star, ArrowUpRight, PlusCircle, Trash2 } from "lucide-react";

export const WatchlistPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-amber-400" />
            <span>Fund Watchlist</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track favorite mutual funds and monitor NAV movements in real-time
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            name: "EcoVerzz Climate Impact Fund",
            category: "Equity ESG",
            nav: 148.5,
            return1Yr: 28.4,
            rating: 5,
          },
          {
            name: "Solar & Clean Tech Leaders",
            category: "Sectoral ESG",
            nav: 92.1,
            return1Yr: 34.2,
            rating: 5,
          },
          {
            name: "Nifty ESG 100 Index Fund",
            category: "Index Fund",
            nav: 215.8,
            return1Yr: 18.6,
            rating: 4,
          },
          {
            name: "Green Mobility Sovereign Bond",
            category: "Debt ESG",
            nav: 104.2,
            return1Yr: 9.8,
            rating: 5,
          },
        ].map((f, index) => (
          <div
            key={index}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl flex items-center justify-between hover:border-emerald-500/30 transition-colors"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-amber-400">{"★".repeat(f.rating)}</span>
                <span className="text-[10px] text-slate-400">{f.category}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-100">{f.name}</h3>
              <div className="flex items-center gap-3 mt-2 text-xs font-mono">
                <span className="text-slate-300 font-bold">NAV: ₹{f.nav}</span>
                <span className="text-emerald-400 font-bold">+{f.return1Yr}% 1Y</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors">
                Invest
              </button>
              <button className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchlistPage;
