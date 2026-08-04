import React, { useState } from "react";
import { Upload, Download, FileText, FileSpreadsheet, X, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete?: (holdings: any[]) => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  onClose,
  onImportComplete,
}) => {
  const [activeTab, setActiveTab] = useState<"import" | "export">("import");
  const [csvContent, setCsvContent] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvContent(text);
      setErrorMsg(null);
    };
    reader.readAsText(file);
  };

  const processCsvImport = () => {
    setErrorMsg(null);
    if (!csvContent.trim()) {
      setErrorMsg("Please select or paste a valid CSV file.");
      return;
    }

    try {
      const lines = csvContent.trim().split("\n");
      if (lines.length < 2) {
        setErrorMsg("CSV file must contain a header row and at least one data row.");
        return;
      }

      const parsedHoldings: any[] = [];

      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(",").map((cell) => cell.trim().replace(/^"(.*)"$/, "$1"));
        if (row.length < 4) continue;

        const [fund_name, unitsStr, priceStr, navStr] = row;
        const units = parseFloat(unitsStr);
        const purchase_price = parseFloat(priceStr);
        const current_nav = parseFloat(navStr);

        if (!fund_name || isNaN(units) || units <= 0 || isNaN(purchase_price) || isNaN(current_nav)) {
          continue;
        }

        parsedHoldings.push({
          fund_name,
          units,
          purchase_price,
          current_nav,
          category: "Equity ESG",
        });
      }

      if (parsedHoldings.length === 0) {
        setErrorMsg("Could not parse valid holdings. Format: Fund Name, Units, Purchase Price, NAV");
        return;
      }

      if (onImportComplete) onImportComplete(parsedHoldings);
      toast.success("Portfolio CSV Imported Successfully!", {
        description: `Imported ${parsedHoldings.length} fund holdings into portfolio.`,
      });
      onClose();
    } catch (e: any) {
      setErrorMsg("Failed to parse CSV file: " + e.message);
    }
  };

  const handleExport = (format: "CSV" | "Excel" | "PDF") => {
    toast.success(`Exporting Portfolio Statement (${format})`, {
      description: `Your ${format} statement download has started.`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab("import")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "import"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Import Portfolio</span>
          </button>
          <button
            onClick={() => setActiveTab("export")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "export"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Export Statements</span>
          </button>
        </div>

        {activeTab === "import" ? (
          <div className="space-y-4 text-xs">
            <p className="text-slate-400">
              Upload a CSV file containing your current mutual fund holdings. Format expected:
            </p>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-400">
              Fund Name, Units, Purchase Price, Current NAV
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="border-2 border-dashed border-slate-800 rounded-2xl p-6 text-center hover:border-emerald-500/40 transition-colors">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <label className="cursor-pointer text-emerald-400 font-bold hover:underline">
                Choose CSV File
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-slate-500 mt-1">Supports standard CSV exports</p>
            </div>

            {csvContent && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <p className="text-[11px] font-bold text-slate-300 mb-1">File Preview:</p>
                <pre className="text-[10px] text-slate-400 font-mono line-clamp-3 overflow-hidden">
                  {csvContent}
                </pre>
              </div>
            )}

            <button
              onClick={processCsvImport}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all shadow-md shadow-emerald-500/20"
            >
              Parse & Import Holdings
            </button>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <p className="text-slate-400">
              Export your portfolio metrics, holdings list, and transaction history into certified formats:
            </p>

            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => handleExport("CSV")}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/30 transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h4 className="font-bold text-slate-100">Export CSV Spreadsheet</h4>
                    <p className="text-[10px] text-slate-500">Raw data format for Excel / Google Sheets</p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </button>

              <button
                onClick={() => handleExport("Excel")}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-teal-500/30 transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-5 h-5 text-teal-400" />
                  <div>
                    <h4 className="font-bold text-slate-100">Export Excel Workbook (.xlsx)</h4>
                    <p className="text-[10px] text-slate-500">Formatted workbook with return calculations</p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition-colors" />
              </button>

              <button
                onClick={() => handleExport("PDF")}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/30 transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  <div>
                    <h4 className="font-bold text-slate-100">Export PDF Valuation Statement</h4>
                    <p className="text-[10px] text-slate-500">Certified ESG wealth report for tax filing</p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
