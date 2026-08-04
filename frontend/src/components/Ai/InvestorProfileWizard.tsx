import React, { useState } from "react";
import { User, DollarSign, Target, ShieldAlert, Sparkles, Check, ChevronRight, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

interface InvestorProfileWizardProps {
  initialProfile?: any;
  onSaveProfile: (profile: any) => void;
}

export const InvestorProfileWizard: React.FC<InvestorProfileWizardProps> = ({
  initialProfile,
  onSaveProfile,
}) => {
  const [step, setStep] = useState(1);

  const [age, setAge] = useState(initialProfile?.age || 30);
  const [annualIncome, setAnnualIncome] = useState(initialProfile?.annual_income || 1200000);
  const [experience, setExperience] = useState(initialProfile?.investment_experience || "Intermediate");
  const [riskTolerance, setRiskTolerance] = useState(initialProfile?.risk_tolerance || "Moderate");
  const [goal, setGoal] = useState(initialProfile?.investment_goal || "ESG Wealth Accumulation");
  const [monthlyInvestment, setMonthlyInvestment] = useState(initialProfile?.monthly_investment || 25000);
  const [horizon, setHorizon] = useState(initialProfile?.investment_horizon || 5);
  const [liquidity, setLiquidity] = useState(initialProfile?.liquidity_requirement || "Medium");
  const [taxBracket, setTaxBracket] = useState(initialProfile?.tax_bracket || "30%");

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      age: Number(age),
      annual_income: Number(annualIncome),
      investment_experience: experience,
      risk_tolerance: riskTolerance,
      investment_goal: goal,
      monthly_investment: Number(monthlyInvestment),
      investment_horizon: Number(horizon),
      liquidity_requirement: liquidity,
      tax_bracket: taxBracket,
      preferred_categories: "Equity ESG, Clean Tech",
    };
    onSaveProfile(updated);
    toast.success("Investor Profile Saved!", {
      description: "AI Scikit-Learn model updated with your new risk traits.",
    });
  };

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 backdrop-blur-xl max-w-3xl mx-auto space-y-6">
      {/* Wizard Header Progress Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span>AI Risk Profiling Wizard</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Step {step} of 4: {step === 1 ? "Personal Info" : step === 2 ? "Financial Parameters" : step === 3 ? "Risk Tolerance" : "Goal & Horizon"}
          </p>
        </div>

        <div className="flex items-center gap-1">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                step === s
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                  : step > s
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-slate-800 text-slate-500"
              }`}
            >
              {step > s ? <Check className="w-3.5 h-3.5" /> : s}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleFinish} className="space-y-6 text-xs">
        {step === 1 && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-200">Personal & Income Profile</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Age (Years)</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Annual Income (₹)</label>
                <input
                  type="number"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Investment Experience</label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Beginner">Beginner (&lt; 2 Years)</option>
                  <option value="Intermediate">Intermediate (2 - 5 Years)</option>
                  <option value="Advanced">Advanced (5+ Years)</option>
                  <option value="Expert">Expert Trader</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Tax Bracket</label>
                <select
                  value={taxBracket}
                  onChange={(e) => setTaxBracket(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="10%">10% Tax Slab</option>
                  <option value="20%">20% Tax Slab</option>
                  <option value="30%">30% Tax Slab</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-200">Financial Capacity & SIP</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Monthly SIP Capacity (₹)</label>
                <input
                  type="number"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Liquidity Requirement</label>
                <select
                  value={liquidity}
                  onChange={(e) => setLiquidity(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="High">High (Need cash anytime)</option>
                  <option value="Medium">Medium (Balanced lock-in)</option>
                  <option value="Low">Low (Long-term compounding)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-200">Risk Tolerance Selection</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: "Low", title: "Low Risk", desc: "Capital Preservation" },
                { id: "Moderate", title: "Moderate", desc: "Balanced ESG Growth" },
                { id: "High", title: "High Risk", desc: "Aggressive Clean Tech" },
                { id: "Aggressive", title: "Aggressive", desc: "Maximum ESG Alpha" },
              ].map((r) => (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => setRiskTolerance(r.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    riskTolerance === r.id
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-md"
                      : "bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800"
                  }`}
                >
                  <span className="font-bold block text-slate-100 mb-0.5">{r.title}</span>
                  <span className="text-[10px] text-slate-400">{r.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-200">Goal & Investment Horizon</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Primary Investment Goal</label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="ESG Wealth Accumulation">ESG Wealth Accumulation</option>
                  <option value="Clean Energy Retirement">Clean Energy Retirement</option>
                  <option value="EV Fleet & Property Fund">EV Fleet & Property Fund</option>
                  <option value="Tax Saving & Capital Preservation">Tax Saving & Capital Preservation</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Investment Horizon (Years)</label>
                <input
                  type="number"
                  value={horizon}
                  onChange={(e) => setHorizon(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-slate-300 hover:bg-slate-800 font-semibold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all shadow-md shadow-emerald-500/20"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all shadow-lg shadow-emerald-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Train ML & Save Profile</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
