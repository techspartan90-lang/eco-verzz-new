import React from "react";
import { Leaf, ShieldCheck, Cpu } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 bg-slate-950/80 dark:bg-slate-950/80 light:bg-white text-slate-400 py-4 px-4 sm:px-6 lg:px-8 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Brand & Copyright */}
        <div className="flex items-center gap-2">
          <Leaf className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-200">EcoVerzz AI Platform</span>
          <span className="text-slate-600">|</span>
          <span>&copy; {new Date().getFullYear()} EcoVerzz Inc. All rights reserved.</span>
        </div>

        {/* Center: Live API Connection Status Indicator */}
        <div className="flex items-center gap-3 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px]">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold">FastAPI Connected</span>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center gap-1 text-slate-400">
            <Cpu className="w-3 h-3 text-teal-400" />
            <span>AI Model v4.2 Active</span>
          </div>
        </div>

        {/* Right: Policy Links */}
        <div className="flex items-center gap-4 text-slate-400">
          <a href="#privacy" className="hover:text-emerald-400 transition-colors">
            Privacy Policy
          </a>
          <a href="#terms" className="hover:text-emerald-400 transition-colors">
            Terms of Service
          </a>
          <a href="#security" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-bit Encrypted</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
