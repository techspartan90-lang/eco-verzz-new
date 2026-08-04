import React, { useState } from "react";
import { PlusCircle, Edit, Trash2, ArrowUpRight, ArrowDownLeft, X, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export interface Holding {
  id: string;
  fundName: string;
  category: string;
  units: number;
  purchasePrice: number;
  currentNav: number;
  investedAmount: number;
  currentValue: number;
  gainLoss: number;
  gainLossPercentage: number;
}

interface HoldingsTableProps {
  holdings: Holding[];
  onAddHolding?: (data: any) => void;
  onEditHolding?: (id: string, data: any) => void;
  onDeleteHolding?: (id: string) => void;
  onTransaction?: (type: "BUY" | "SELL", holding: Holding) => void;
}

export const HoldingsTable: React.FC<HoldingsTableProps> = ({
  holdings,
  onAddHolding,
  onEditHolding,
  onDeleteHolding,
  onTransaction,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHolding, setEditingHolding] = useState<Holding | null>(null);

  // Form states
  const [fundName, setFundName] = useState("");
  const [category, setCategory] = useState("Equity ESG");
  const [units, setUnits] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [currentNav, setCurrentNav] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const openAddModal = () => {
    setEditingHolding(null);
    setFundName("");
    setCategory("Equity ESG");
    setUnits("");
    setPurchasePrice("");
    setCurrentNav("");
    setErrorMessage(null);
    setModalOpen(true);
  };

  const openEditModal = (h: Holding) => {
    setEditingHolding(h);
    setFundName(h.fundName);
    setCategory(h.category);
    setUnits(h.units.toString());
    setPurchasePrice(h.purchasePrice.toString());
    setCurrentNav(h.currentNav.toString());
    setErrorMessage(null);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const parsedUnits = parseFloat(units);
    const parsedPrice = parseFloat(purchasePrice);
    const parsedNav = parseFloat(currentNav);

    // Validations: Prevent negative units, invalid NAV, invalid dates
    if (!fundName.trim()) {
      setErrorMessage("Fund name is required.");
      return;
    }
    if (isNaN(parsedUnits) || parsedUnits <= 0) {
      setErrorMessage("Units must be a positive number greater than 0.");
      return;
    }
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setErrorMessage("Purchase price must be greater than 0.");
      return;
    }
    if (isNaN(parsedNav) || parsedNav <= 0) {
      setErrorMessage("Current NAV must be greater than 0.");
      return;
    }

    // Duplicate check validation when adding new holding
    if (!editingHolding) {
      const isDuplicate = holdings.some(
        (h) => h.fundName.toLowerCase() === fundName.trim().toLowerCase()
      );
      if (isDuplicate) {
        setErrorMessage(
          `Holding '${fundName}' already exists in your portfolio. Use 'Buy More' or edit the existing holding.`
        );
        return;
      }
    }

    const payload = {
      fund_name: fundName.trim(),
      category,
      units: parsedUnits,
      purchase_price: parsedPrice,
      current_nav: parsedNav,
    };

    if (editingHolding) {
      if (onEditHolding) onEditHolding(editingHolding.id, payload);
      toast.success("Holding Updated", { description: `Updated ${fundName} parameters.` });
    } else {
      if (onAddHolding) onAddHolding(payload);
      toast.success("Holding Added", { description: `Added ${fundName} to portfolio.` });
    }

    setModalOpen(false);
  };

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 backdrop-blur-xl space-y-4">
      {/* Table Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-100">Portfolio Holdings</h3>
          <p className="text-xs text-slate-400">Current positions & live NAV valuation</p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Holding</span>
        </button>
      </div>

      {/* Holdings Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <th className="py-3 px-3">Fund Name</th>
              <th className="py-3 px-3">Units</th>
              <th className="py-3 px-3">Purchase Price</th>
              <th className="py-3 px-3">Current NAV</th>
              <th className="py-3 px-3">Invested Amount</th>
              <th className="py-3 px-3 font-bold text-slate-200">Current Value</th>
              <th className="py-3 px-3 text-right">Gain / Loss</th>
              <th className="py-3 px-3 text-right">Return %</th>
              <th className="py-3 px-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-slate-200 font-medium">
            {holdings.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-xs text-slate-400">
                  No holdings in this portfolio yet. Click "Add Holding" to get started.
                </td>
              </tr>
            ) : (
              holdings.map((h) => {
                const isPositive = h.gainLoss >= 0;
                return (
                  <tr key={h.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-3">
                      <div>
                        <p className="font-bold text-slate-100">{h.fundName}</p>
                        <span className="text-[10px] text-slate-400 font-medium">{h.category}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-300">{h.units}</td>
                    <td className="py-3.5 px-3 font-mono text-slate-400">₹{h.purchasePrice}</td>
                    <td className="py-3.5 px-3 font-mono text-slate-200">₹{h.currentNav}</td>
                    <td className="py-3.5 px-3 font-mono text-slate-300">
                      ₹{h.investedAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-100">
                      ₹{h.currentValue.toLocaleString("en-IN")}
                    </td>
                    <td className={`py-3.5 px-3 text-right font-mono font-bold ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                      {isPositive ? "+" : ""}₹{h.gainLoss.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3.5 px-3 text-right font-bold">
                      <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] ${isPositive ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"}`}>
                        {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
                        {h.gainLossPercentage}%
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onTransaction && onTransaction("BUY", h)}
                          className="px-2 py-1 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-colors"
                          title="Buy More"
                        >
                          Buy
                        </button>
                        <button
                          onClick={() => onTransaction && onTransaction("SELL", h)}
                          className="px-2 py-1 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-slate-950 transition-colors"
                          title="Sell"
                        >
                          Sell
                        </button>
                        <button
                          onClick={() => openEditModal(h)}
                          className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteHolding && onDeleteHolding(h.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-100 mb-4">
              {editingHolding ? "Edit Holding" : "Add New Holding"}
            </h3>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Fund Name</label>
                <input
                  type="text"
                  value={fundName}
                  onChange={(e) => setFundName(e.target.value)}
                  disabled={!!editingHolding}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500 disabled:opacity-60"
                  placeholder="e.g. EcoVerzz Climate Impact Fund"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Equity ESG">Equity ESG</option>
                  <option value="Sectoral">Sectoral ESG</option>
                  <option value="Index">Index Fund</option>
                  <option value="Debt">Debt / Green Bonds</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Units</label>
                  <input
                    type="number"
                    step="0.01"
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                    placeholder="100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Buy Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                    placeholder="110.5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Current NAV</label>
                  <input
                    type="number"
                    step="0.01"
                    value={currentNav}
                    onChange={(e) => setCurrentNav(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                    placeholder="148.5"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-800 text-slate-400 font-semibold hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all shadow-md shadow-emerald-500/20"
                >
                  {editingHolding ? "Save Changes" : "Confirm Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
