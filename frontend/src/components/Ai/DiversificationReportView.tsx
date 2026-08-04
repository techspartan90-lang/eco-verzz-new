import React from "react";
import { SectorAllocationChart } from "../Charts/SectorAllocationChart";
import { AmcDistributionChart } from "../Charts/AmcDistributionChart";
import { Layers, Building2, CheckCircle2 } from "lucide-react";

interface DiversificationReportViewProps {
  reportData?: any;
}

export const DiversificationReportView: React.FC<DiversificationReportViewProps> = ({
  reportData,
}) => {
  const divScore = reportData?.diversification_score || 8.5;
  const amcList = reportData?.amc_distribution || [
    { amc: "EcoVerzz Asset Management", weight: 40.0 },
    { amc: "SBI Mutual Fund", weight: 25.0 },
    { amc: "HDFC Mutual Fund", weight: 20.0 },
    { amc: "Axis Mutual Fund", weight: 15.0 },
  ];

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-teal-400" />
            <span>Diversification Index Report</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Multi-AMC concentration & sector balance score
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Diversification Score</span>
            <span className="text-xl font-extrabold text-teal-300 font-mono">{divScore} / 10</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectorAllocationChart />
        <AmcDistributionChart />
      </div>
    </div>
  );
};
