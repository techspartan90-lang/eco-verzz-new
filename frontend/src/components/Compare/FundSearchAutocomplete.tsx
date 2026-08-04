import React, { useState } from "react";
import { Search, Plus, X, Sparkles, Filter } from "lucide-react";
import { toast } from "sonner";

export interface FundOption {
  symbol: string;
  name: string;
  amc: string;
  category: string;
  risk: string;
}

const ALL_AVAILABLE_FUNDS: FundOption[] = [
  { symbol: "ECO-CLIMATE", name: "EcoVerzz Climate Impact Fund", amc: "EcoVerzz AMC", category: "Equity ESG", risk: "Moderate" },
  { symbol: "SOLAR-TECH", name: "Solar & Clean Tech Leaders", amc: "SBI Mutual Fund", category: "Sectoral ESG", risk: "High" },
  { symbol: "NIFTY-ESG", name: "Nifty ESG 100 Index Fund", amc: "HDFC Mutual Fund", category: "Index Fund", risk: "Moderate" },
  { symbol: "GREEN-BOND", name: "Green Mobility Sovereign Bond", amc: "EcoVerzz AMC", category: "Debt ESG", risk: "Low" },
  { symbol: "CIRCULAR-MICRO", name: "Circular Economy Micro Cap Growth", amc: "Axis Mutual Fund", category: "Sectoral ESG", risk: "Aggressive" },
];

interface FundSearchAutocompleteProps {
  selectedSymbols: string[];
  onAddFund: (symbol: string) => void;
  onRemoveFund: (symbol: string) => void;
}

export const FundSearchAutocomplete: React.FC<FundSearchAutocompleteProps> = ({
  selectedSymbols,
  onAddFund,
  onRemoveFund,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filtered = ALL_AVAILABLE_FUNDS.filter(
    (f) =>
      !selectedSymbols.includes(f.symbol) &&
      (f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.amc.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelect = (symbol: string) => {
    if (selectedSymbols.length >= 5) {
      toast.error("Maximum 5 Funds Allowed", {
        description: "You can compare up to 5 mutual funds simultaneously.",
      });
      return;
    }
    onAddFund(symbol);
    setSearchTerm("");
    setIsOpen(false);
  };

  return (
    <div className="space-y-3">
      {/* Search Input Bar */}
      <div className="relative">
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 focus-within:border-emerald-500/50 transition-colors shadow-lg">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={
              selectedSymbols.length >= 5
                ? "Maximum 5 funds selected for comparison"
                : "Search fund name, AMC, symbol, or category..."
            }
            disabled={selectedSymbols.length >= 5}
            className="w-full text-xs bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none disabled:opacity-50"
          />
          <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-lg shrink-0">
            {selectedSymbols.length} / 5 Selected
          </span>
        </div>

        {/* Autocomplete Dropdown */}
        {isOpen && searchTerm.trim().length > 0 && (
          <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-4 text-xs text-slate-400 text-center">No matching funds found</div>
            ) : (
              filtered.map((f) => (
                <button
                  key={f.symbol}
                  onClick={() => handleSelect(f.symbol)}
                  className="w-full p-3 text-left hover:bg-slate-800/80 transition-colors flex items-center justify-between border-b border-slate-800/50 last:border-0"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-100">{f.name}</p>
                    <span className="text-[10px] text-slate-400">{f.amc} • {f.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {f.risk}
                    </span>
                    <Plus className="w-4 h-4 text-slate-400 hover:text-emerald-400" />
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Selected Fund Pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {selectedSymbols.map((sym) => {
          const info = ALL_AVAILABLE_FUNDS.find((f) => f.symbol === sym) || {
            name: sym,
            symbol: sym,
          };
          return (
            <div
              key={sym}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold shadow-sm"
            >
              <span>{info.name}</span>
              <button
                onClick={() => onRemoveFund(sym)}
                className="p-0.5 rounded-md hover:bg-emerald-500/20 text-emerald-400 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
