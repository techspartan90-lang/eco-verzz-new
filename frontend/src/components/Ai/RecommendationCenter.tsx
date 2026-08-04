import React from "react";
import { Sparkles, ArrowRight, ShieldCheck, Zap, TrendingUp, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface RecommendationCenterProps {
  recommendations: any[];
  onGenerateNew: () => void;
  loading?: boolean;
}

export const RecommendationCenter: React.FC<RecommendationCenterProps> = ({
  recommendations,
  onGenerateNew,
  loading = false,
}) => {
  const latestRec = recommendations && recommendations.length > 0 ? recommendations[0] : null;

  let parsedJson: any = null;
  if (latestRec && latestRec.recommendation_json) {
    try {
      parsedJson = JSON.parse(latestRec.recommendation_json);
    } catch (e) {
      parsedJson = null;
    }
  }

  const topFunds = parsedJson?.top_funds || [
    {
      name: "EcoVerzz Climate Impact Fund",
      symbol: "ECO-CLIMATE",
      cagr_3yr: 28.4,
      match_score: 98,
      risk_level: "Moderate",
      allocated_monthly: 8750,
    },
    {
      name: "Solar & Clean Tech Leaders",
      symbol: "SOLAR-TECH",
      cagr_3yr: 34.2,
      match_score: 95,
      risk_level: "High",
      allocated_monthly: 8750,
    },
    {
      name: "Green Mobility Sovereign Bond",
      symbol: "GREEN-BOND",
      cagr_3yr: 9.8,
      match_score: 90,
      risk_level: "Low",
      allocated_monthly: 7500,
    },
  ];

  const portfolioImpact = parsedJson?.portfolio_impact || {
    cagr_boost: "+4.2%",
    carbon_offset_tons: "12.0",
    esg_score_boost: "+12 Points",
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Callout */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 border border-emerald-500/30 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Scikit-Learn ML Model Recommendation Engine</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {latestRec ? latestRec.recommendation_type : "Personalized ESG Portfolio Allocation"}
          </h2>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            {latestRec
              ? latestRec.explanation
              : "Our AI model analyzes your risk tolerance, investment horizon, and ESG parameters to optimize expected CAGR."}
          </p>
        </div>

        <button
          onClick={onGenerateNew}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/20 shrink-0 self-start md:self-auto cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>{loading ? "Calculating ML Model..." : "Run AI Engine"}</span>
        </button>
      </div>

      {/* 4 AI Metric Output Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <span className="text-xs font-semibold text-slate-400 uppercase">Confidence Score</span>
          <h3 className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
            {latestRec ? `${latestRec.confidence_score}%` : "96.8%"}
          </h3>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">High Precision Model</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <span className="text-xs font-semibold text-slate-400 uppercase">Expected CAGR</span>
          <h3 className="text-2xl font-extrabold text-teal-300 font-mono mt-1">
            {latestRec ? `${latestRec.expected_return}%` : "18.5% p.a."}
          </h3>
          <span className="text-[11px] text-teal-400 font-semibold mt-1 block">5-Year Horizon Forecast</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <span className="text-xs font-semibold text-slate-400 uppercase">Risk Rating</span>
          <h3 className="text-2xl font-extrabold text-amber-300 font-mono mt-1">
            {latestRec ? `${latestRec.expected_risk} / 10` : "4.2 / 10"}
          </h3>
          <span className="text-[11px] text-amber-400 font-semibold mt-1 block">Moderate Volatility</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <span className="text-xs font-semibold text-slate-400 uppercase">Portfolio Impact</span>
          <h3 className="text-2xl font-extrabold text-cyan-300 font-mono mt-1">
            {portfolioImpact.cagr_boost}
          </h3>
          <span className="text-[11px] text-cyan-400 font-semibold mt-1 block">Alpha Boost vs Benchmark</span>
        </div>
      </div>

      {/* Suggested Funds List */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-100">Top Recommended Funds</h3>
          <span className="text-xs text-slate-400 font-semibold">Ranked by SHAP & Sharpe Ratio</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topFunds.map((fund: any, idx: number) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/40 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold text-slate-400">{fund.symbol}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {fund.match_score || 95}% Match
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-100 mb-2">{fund.name}</h4>

                <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono mb-3">
                  <span>3Y CAGR: <strong className="text-emerald-400">+{fund.cagr_3yr}%</strong></span>
                  <span>Risk: <strong className="text-teal-300">{fund.risk_level}</strong></span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  Alloc: <strong className="text-slate-200">₹{fund.allocated_monthly?.toLocaleString("en-IN") || "8,750"}/mo</strong>
                </span>
                <button
                  onClick={() =>
                    toast.success("Fund Selected", {
                      description: `Added ${fund.name} to portfolio allocation.`,
                    })
                  }
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors"
                >
                  Invest Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
