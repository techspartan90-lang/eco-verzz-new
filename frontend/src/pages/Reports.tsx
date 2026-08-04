import React from "react";
import { FileSpreadsheet, Download, FileText, Calendar, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const reportTemplates = [
  {
    id: "rep-1",
    title: "FY 2025-26 Capital Gains Tax Statement",
    type: "Tax Report",
    period: "Apr 2025 - Mar 2026",
    size: "1.2 MB PDF",
  },
  {
    id: "rep-2",
    title: "EcoVerzz Annual ESG Carbon Impact Report",
    type: "ESG Impact",
    period: "Calendar Year 2025",
    size: "3.4 MB PDF",
  },
  {
    id: "rep-3",
    title: "Consolidated Account Statement (CAS)",
    type: "Portfolio Statement",
    period: "Monthly - July 2026",
    size: "850 KB PDF",
  },
  {
    id: "rep-4",
    title: "Dividend & Income Summary",
    type: "Income Report",
    period: "YTD 2026",
    size: "620 KB CSV",
  },
];

export const ReportsPage: React.FC = () => {
  const handleDownloadReport = (title: string) => {
    toast.success("Downloading Statement", {
      description: `Preparing ${title}... Download started.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
            <span>Reports & Statements</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Download certified financial statements, tax reports, and ESG impact audits
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTemplates.map((rep) => (
          <div
            key={rep.id}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl flex items-center justify-between hover:border-emerald-500/30 transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">{rep.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {rep.type} • {rep.period}
                </p>
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                  {rep.size}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleDownloadReport(rep.title)}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 transition-colors border border-slate-700"
              title="Download Report"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsPage;
