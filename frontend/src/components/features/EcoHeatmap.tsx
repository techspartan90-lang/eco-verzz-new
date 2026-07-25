import React from "react";
import { motion } from "motion/react";
import { Activity, Calendar, Zap, CheckCircle2 } from "lucide-react";

export const EcoHeatmap: React.FC = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = [
    [2, 5, 8, 10, 4, 1, 0],
    [1, 3, 9, 12, 6, 2, 1],
    [0, 2, 6, 8, 10, 5, 2],
    [4, 7, 10, 14, 8, 3, 0],
    [1, 4, 7, 9, 5, 2, 0],
    [3, 8, 12, 16, 11, 6, 4],
    [5, 9, 15, 18, 14, 8, 5],
  ];

  return (
    <div className="bg-[#0b101c]/90 border border-emerald-500/20 p-6 rounded-3xl backdrop-blur-2xl text-left space-y-4 shadow-xl">
      <div className="flex justify-between items-center border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Weekly Activity Heatmap
            </h3>
            <span className="text-[10px] text-gray-400 font-mono block">7-Day Conservation Engagement Matrix</span>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
          7-Day Peak: Sat 18:00
        </span>
      </div>

      {/* Heatmap Grid */}
      <div className="space-y-2 font-mono text-xs">
        <div className="grid grid-cols-8 gap-2 text-center text-gray-400 text-[10px] uppercase pb-1">
          <span>Time</span>
          {days.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        {["08:00", "11:00", "14:00", "17:00", "20:00", "22:00", "00:00"].map((time, rowIdx) => (
          <div key={time} className="grid grid-cols-8 gap-2 items-center text-center">
            <span className="text-[9px] text-gray-500 text-left">{time}</span>
            {hours[rowIdx].map((val, colIdx) => {
              const bgClass =
                val === 0
                  ? "bg-white/[0.02]"
                  : val < 5
                  ? "bg-emerald-500/20 text-emerald-300"
                  : val < 10
                  ? "bg-emerald-500/40 text-emerald-200"
                  : val < 15
                  ? "bg-emerald-500/70 text-gray-950 font-bold"
                  : "bg-emerald-400 text-gray-950 font-black shadow-[0_0_10px_#34d399]";

              return (
                <div
                  key={colIdx}
                  className={`h-8 rounded-xl flex items-center justify-center text-[10px] transition-all hover:scale-105 cursor-pointer ${bgClass}`}
                  title={`${val} actions on ${days[colIdx]} at ${time}`}
                >
                  {val > 0 ? val : ""}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-white/10 flex justify-between items-center text-[11px] text-gray-400 font-mono">
        <span>Heatmap Intensity: Actions Logged / Hour</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-white/5" />
          <span className="w-2.5 h-2.5 rounded bg-emerald-500/20" />
          <span className="w-2.5 h-2.5 rounded bg-emerald-500/50" />
          <span className="w-2.5 h-2.5 rounded bg-emerald-400" />
          <span className="text-emerald-400 font-bold ml-1">Peak</span>
        </div>
      </div>
    </div>
  );
};

export default EcoHeatmap;
