import React from "react";
import { Newspaper, ExternalLink, Sparkles, TrendingUp } from "lucide-react";

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  sentiment: "Bullish" | "Neutral" | "Milestone";
  readTime: string;
  url: string;
}

const newsList: NewsArticle[] = [
  {
    id: "n-1",
    title: "India mandates top 500 mutual funds to report ESG carbon metrics by Q4 2026",
    source: "EcoFin Times",
    timeAgo: "2 hours ago",
    sentiment: "Milestone",
    readTime: "3 min read",
    url: "#",
  },
  {
    id: "n-2",
    title: "Green Energy Sector rallies +4.5% after national renewable grid expansion approval",
    source: "Market Watch",
    timeAgo: "4 hours ago",
    sentiment: "Bullish",
    readTime: "2 min read",
    url: "#",
  },
  {
    id: "n-3",
    title: "SEBI introduces new transparency framework for ESG Mutual Fund ratings",
    source: "Financial Express",
    timeAgo: "6 hours ago",
    sentiment: "Neutral",
    readTime: "4 min read",
    url: "#",
  },
];

export const MarketNewsWidget: React.FC = () => {
  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 backdrop-blur-xl flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-slate-100">Latest Market News</h3>
        </div>
        <span className="text-xs font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
          ESG Insights
        </span>
      </div>

      <div className="space-y-3">
        {newsList.map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-cyan-500/30 transition-colors group cursor-pointer"
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span
                className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                  item.sentiment === "Bullish"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    : item.sentiment === "Milestone"
                    ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                    : "bg-slate-800 text-slate-300 border-slate-700"
                }`}
              >
                {item.sentiment}
              </span>
              <span className="text-[10px] text-slate-500">{item.timeAgo}</span>
            </div>

            <h4 className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors line-clamp-2 leading-relaxed mb-1.5">
              {item.title}
            </h4>

            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>{item.source} • {item.readTime}</span>
              <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
