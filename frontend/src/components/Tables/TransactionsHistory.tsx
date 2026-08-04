import React, { useState } from "react";
import { Search, Filter, ArrowDownLeft, ArrowUpRight, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";

export interface TransactionRecord {
  id: string;
  fundName: string;
  transactionType: "BUY" | "SELL" | "SIP" | "REDEMPTION";
  units: number;
  nav: number;
  amount: number;
  transactionDate: string;
  remarks?: string;
}

interface TransactionsHistoryProps {
  transactions: TransactionRecord[];
  onRefresh?: () => void;
}

export const TransactionsHistory: React.FC<TransactionsHistoryProps> = ({
  transactions,
  onRefresh,
}) => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filtered = transactions.filter((t) => {
    const matchesSearch = t.fundName.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "ALL" || t.transactionType === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 backdrop-blur-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-100">Transaction History</h3>
          <p className="text-xs text-slate-400">Complete audit log of BUY, SELL, SIP & REDEMPTION orders</p>
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Log</span>
          </button>
        )}
      </div>

      {/* Controls Bar: Search & Type Pills */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transaction..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-900 rounded-lg border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto text-xs scrollbar-none">
          {["ALL", "BUY", "SELL", "SIP", "REDEMPTION"].map((f) => (
            <button
              key={f}
              onClick={() => {
                setTypeFilter(f);
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors whitespace-nowrap ${
                typeFilter === f
                  ? "bg-emerald-500 text-slate-950 shadow-sm"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <th className="py-2.5 px-3">Type / Fund</th>
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3">Units</th>
              <th className="py-2.5 px-3">NAV</th>
              <th className="py-2.5 px-3 text-right">Amount</th>
              <th className="py-2.5 px-3">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-slate-200 font-medium">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-xs text-slate-400">
                  No matching transaction records found.
                </td>
              </tr>
            ) : (
              paginated.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-extrabold text-[10px] ${
                          tx.transactionType === "BUY" || tx.transactionType === "SIP"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/15 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {tx.transactionType === "BUY" || tx.transactionType === "SIP" ? (
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-100">{tx.fundName}</p>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{tx.transactionType}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-400 whitespace-nowrap">{tx.transactionDate}</td>
                  <td className="py-3 px-3 font-mono text-slate-300">{tx.units}</td>
                  <td className="py-3 px-3 font-mono text-slate-400">₹{tx.nav}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-100">
                    ₹{tx.amount.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px] truncate max-w-[150px]">
                    {tx.remarks || "Processed"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
        <span>
          Showing {filtered.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
          {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} entries
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-semibold text-slate-200">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
