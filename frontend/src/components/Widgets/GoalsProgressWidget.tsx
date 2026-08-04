import React from "react";
import { Target, Flag, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export interface GoalItem {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
}

const goalsList: GoalItem[] = [
  {
    id: "g-1",
    title: "Green Energy Wealth Fund",
    targetAmount: 2000000,
    currentAmount: 1560000,
    targetDate: "Dec 2028",
    category: "Long-term Wealth",
  },
  {
    id: "g-2",
    title: "EV Fleet & Solar Retirement Pot",
    targetAmount: 5000000,
    currentAmount: 2250000,
    targetDate: "Mar 2035",
    category: "Retirement",
  },
  {
    id: "g-3",
    title: "Sustainable Housing Reserve",
    targetAmount: 1000000,
    currentAmount: 900000,
    targetDate: "Jan 2027",
    category: "Property",
  },
];

export const GoalsProgressWidget: React.FC = () => {
  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 backdrop-blur-xl flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-slate-100">Investment Goals</h3>
        </div>
        <span className="text-xs text-slate-400">3 Active Goals</span>
      </div>

      <div className="space-y-3.5">
        {goalsList.map((goal) => {
          const percentage = Math.min(
            100,
            Math.round((goal.currentAmount / goal.targetAmount) * 100)
          );

          return (
            <div
              key={goal.id}
              className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-emerald-500/30 transition-colors"
            >
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-slate-100 truncate max-w-[180px]">
                  {goal.title}
                </span>
                <span className="text-emerald-400 font-mono">{percentage}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>
                  ₹{(goal.currentAmount / 100000).toFixed(2)}L / ₹{(goal.targetAmount / 100000).toFixed(2)}L
                </span>
                <span>Target: {goal.targetDate}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
