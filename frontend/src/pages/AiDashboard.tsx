import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  UserCheck,
  Activity,
  ShieldAlert,
  Layers,
  RefreshCw,
  Download,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import { InvestorProfileWizard } from "../components/Ai/InvestorProfileWizard";
import { RecommendationCenter } from "../components/Ai/RecommendationCenter";
import { PortfolioAnalysisView } from "../components/Ai/PortfolioAnalysisView";
import { RiskAnalysisView } from "../components/Ai/RiskAnalysisView";
import { DiversificationReportView } from "../components/Ai/DiversificationReportView";
import { PortfolioRebalanceView } from "../components/Ai/PortfolioRebalanceView";
import {
  useAiProfile,
  useAiRecommendations,
  usePortfolioAnalysis,
  useRiskAnalysis,
  useDiversificationReport,
  useRebalanceSuggestions,
  useAiMutations,
} from "../hooks/useAiEngine";
import { toast } from "sonner";

export const AiDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "recommendations" | "profile" | "analysis" | "risk" | "diversification" | "rebalance"
  >("recommendations");

  const { data: profile } = useAiProfile();
  const { data: recommendations } = useAiRecommendations();
  const { data: portfolioAnalysis } = usePortfolioAnalysis();
  const { data: riskAnalysis } = useRiskAnalysis();
  const { data: diversificationReport } = useDiversificationReport();
  const { data: rebalanceSuggestions } = useRebalanceSuggestions();

  const { updateProfile, generateRecommendation } = useAiMutations();

  const handleSaveWizard = (updated: any) => {
    updateProfile.mutate(updated);
    generateRecommendation.mutate({});
    setActiveTab("recommendations");
  };

  const handleDownloadReport = (format: "PDF" | "CSV") => {
    toast.success(`Exporting AI Advice Report (${format})`, {
      description: `Your ${format} recommendation summary report has started downloading.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Page Header & Export Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-emerald-400" />
            <span>AI Recommendation Engine</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Scikit-Learn ML Model & SHAP Rationale for Personalized ESG Asset Allocation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDownloadReport("CSV")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => handleDownloadReport("PDF")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Download PDF Report</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none text-xs">
        {[
          { id: "recommendations", label: "Recommendation Center", icon: Sparkles },
          { id: "profile", label: "Investor Profile Wizard", icon: UserCheck },
          { id: "analysis", label: "Portfolio Health", icon: Activity },
          { id: "risk", label: "Risk & Stress Test", icon: ShieldAlert },
          { id: "diversification", label: "Diversification Index", icon: Layers },
          { id: "rebalance", label: "Portfolio Rebalancer", icon: RefreshCw },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Views */}
      <AnimatePresence mode="wait">
        {activeTab === "recommendations" && (
          <motion.div
            key="recommendations"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <RecommendationCenter
              recommendations={recommendations || []}
              onGenerateNew={() => generateRecommendation.mutate({})}
              loading={generateRecommendation.isPending}
            />
          </motion.div>
        )}

        {activeTab === "profile" && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <InvestorProfileWizard
              initialProfile={profile}
              onSaveProfile={handleSaveWizard}
            />
          </motion.div>
        )}

        {activeTab === "analysis" && (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <PortfolioAnalysisView analysisData={portfolioAnalysis} />
          </motion.div>
        )}

        {activeTab === "risk" && (
          <motion.div
            key="risk"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <RiskAnalysisView riskData={riskAnalysis} />
          </motion.div>
        )}

        {activeTab === "diversification" && (
          <motion.div
            key="diversification"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <DiversificationReportView reportData={diversificationReport} />
          </motion.div>
        )}

        {activeTab === "rebalance" && (
          <motion.div
            key="rebalance"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <PortfolioRebalanceView rebalanceData={rebalanceSuggestions} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AiDashboardPage;
