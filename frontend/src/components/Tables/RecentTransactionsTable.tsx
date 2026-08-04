import React, { useState } from "react";
import { ArrowUpRight, ArrowDownLeft, Clock, Filter, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export interface Transaction {
  id: string;
  fundName: string;
  type: "SIP" | "BUY" | "SELL" | "DIVIDEND";
  amount: number;
  date: string;
  status: "Completed" | "Processing" | "Failed";
  nav: number;
}

const mockTransactions: Transaction[] = [
  {
    id: "tx-101",
    fundName: "EcoVerzz ESG Climate Leaders Fund",
    type: "SIP",
    amount: 15000,
    date: "Aug 02, 2026",
    status: "Completed",
    nav: 142.85,
  },
  {
    id: "tx-102",
    fundName: "Clean Energy Transition Equity",
    type: "BUY",
    amount: 50000,
    date: "Jul 28, 2026",
    status: "Completed",
    nav: 88.4,
  },
  {
    id: "tx-103",
    fundName: "Nifty ESG Index Hybrid Fund",
    type: "SIP",
    amount: 10000,
    date: "Jul 25, 2026",
    status: "Completed",
    nav: 215.1,
  },
  {
    id: "tx-104",
    fundName: "Green Tech Venture Index",
    type: "SELL",
    amount: 25000,
    date: "Jul 18, 2026",
    status: "Completed",
    nav: 64.2,
  },
  {
    id: "tx-105",
    fundName: "Sustainable Water & Waste Fund",
    type: "SIP",
    amount: 8000,
    date: "Jul 10, 2026",
    status: "Completed",
    nav: 49.75,
  },
];

export const RecentTransactionsTable: React.FC = () => {
  const [filter, setFilter] = useState<string>("ALL");

  const filtered = filter === "ALL"
    ? mockTransactions
    : mockTransactions.filter((t) => t.type === filter);

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 backdrop-blur-xl flex flex-col justify-between">
      {/* Table Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-100">Recent Transactions</h3>
          <p className="text-xs text-slate-400">Order execution & SIP history</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {["ALL", "SIP", "BUY", "SELL"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                filter === f
                  ? "bg-emerald-500 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <th className="py-2.5 px-3">Fund / Type</th>
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3">NAV</th>
              <th className="py-2.5 px-3 text-right">Amount</th>
              <th className="py-2.5 px-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-slate-200 font-medium">
            {filtered.map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[10px] ${
                        tx.type === "SIP" || tx.type === "BUY"
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                          : "bg-rose-500/15 text-rose-400 border border-rose-500/20"
                      }`}
                    >
                      {tx.type === "SIP" || tx.type === "BUY" ? (
                        <ArrowDownLeft className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-100 truncate max-w-[180px] sm:max-w-xs">
                        {tx.fundName}
                      </p>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">{tx.type}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 text-slate-400 whitespace-nowrap">{tx.date}</td>
                <td className="py-3 px-3 text-slate-300 font-mono">₹{tx.nav}</td>
                <td className="py-3 px-3 text-right font-bold text-slate-100 font-mono">
                  ₹{tx.amount.toLocaleString("en-IN")}
                </td>
                <td className="py-3 px-3 text-right">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Link */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-slate-400">Showing {filtered.length} transactions</span>
        <Link
          to="/portfolio"
          className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition-colors"
        >
          <span>View All Activity</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
