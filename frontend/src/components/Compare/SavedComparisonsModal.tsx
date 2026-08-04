import React, { useState } from "react";
import { Bookmark, Clock, X, Trash2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface SavedComparisonsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedComparisons: any[];
  recentHistory: any[];
  onSelectFunds: (funds: string[]) => void;
  onSaveCurrent: (name: string) => void;
}

export const SavedComparisonsModal: React.FC<SavedComparisonsModalProps> = ({
  isOpen,
  onClose,
  savedComparisons,
  recentHistory,
  onSelectFunds,
  onSaveCurrent,
}) => {
  const [saveName, setSaveName] = useState("");

  if (!isOpen) return null;

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saveName.trim()) return;
    onSaveCurrent(saveName.trim());
    setSaveName("");
    toast.success("Comparison Preset Saved!", {
      description: `Saved '${saveName}' to your account.`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-emerald-400" />
            <span>Saved Comparisons & Presets</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Save current fund comparison preset or load previous comparisons
          </p>
        </div>

        {/* Save Current Preset Form */}
        <form onSubmit={handleSaveSubmit} className="flex gap-2">
          <input
            type="text"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            placeholder="Name this comparison preset (e.g. ESG Clean Tech Top 3)..."
            className="flex-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            required
          />
          <button
            type="submit"
            className="px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shrink-0"
          >
            Save Preset
          </button>
        </form>

        {/* Saved Presets List */}
        <div className="space-y-3 text-xs">
          <h4 className="font-bold text-slate-300">Your Saved Comparison Presets</h4>
          {savedComparisons.length === 0 ? (
            <p className="text-slate-500 italic text-[11px]">No saved comparison presets yet.</p>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {savedComparisons.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition-colors"
                >
                  <div>
                    <p className="font-bold text-slate-100">{item.comparison_name}</p>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      {item.selected_funds.join(", ")}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      onSelectFunds(item.selected_funds);
                      onClose();
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold hover:bg-emerald-500 hover:text-slate-950 transition-colors"
                  >
                    <span>Load</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
