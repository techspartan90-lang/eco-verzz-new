import React from "react";
import { Calendar, CheckCircle2, Clock, Play } from "lucide-react";
import { toast } from "sonner";

export interface SipSchedule {
  id: string;
  fundName: string;
  amount: number;
  dueDate: string;
  autoPayStatus: "Active" | "Pending Approval";
}

const upcomingSips: SipSchedule[] = [
  {
    id: "sip-1",
    fundName: "EcoVerzz ESG Climate Leaders",
    amount: 15000,
    dueDate: "Aug 10, 2026",
    autoPayStatus: "Active",
  },
  {
    id: "sip-2",
    fundName: "Nifty 50 ESG Index Hybrid",
    amount: 10000,
    dueDate: "Aug 15, 2026",
    autoPayStatus: "Active",
  },
  {
    id: "sip-3",
    fundName: "Clean Energy Transition Equity",
    amount: 5000,
    dueDate: "Aug 20, 2026",
    autoPayStatus: "Pending Approval",
  },
];

export const SipPaymentsWidget: React.FC = () => {
  const handlePayNow = (fundName: string, amount: number) => {
    toast.success(`SIP Triggered`, {
      description: `Payment of ₹${amount.toLocaleString("en-IN")} for ${fundName} initiated successfully.`,
    });
  };

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 backdrop-blur-xl flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-teal-400" />
          <h3 className="text-base font-bold text-slate-100">Upcoming SIP Payments</h3>
        </div>
        <span className="text-xs font-semibold text-slate-400">August 2026</span>
      </div>

      <div className="space-y-3">
        {upcomingSips.map((sip) => (
          <div
            key={sip.id}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-teal-500/30 transition-colors"
          >
            <div className="overflow-hidden mr-2">
              <h4 className="text-xs font-bold text-slate-100 truncate">
                {sip.fundName}
              </h4>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                <Clock className="w-3 h-3 text-slate-500" />
                <span>Due {sip.dueDate}</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">{sip.autoPayStatus}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-bold font-mono text-slate-100">
                ₹{sip.amount.toLocaleString("en-IN")}
              </span>
              <button
                onClick={() => handlePayNow(sip.fundName, sip.amount)}
                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/30 transition-all flex items-center gap-1"
              >
                <Play className="w-2.5 h-2.5 fill-current" />
                <span>Pay</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
