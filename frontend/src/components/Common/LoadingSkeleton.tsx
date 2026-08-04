import React from "react";

export const CardSkeleton: React.FC = () => (
  <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="w-24 h-3 bg-slate-800 rounded-full" />
      <div className="w-8 h-8 rounded-xl bg-slate-800" />
    </div>
    <div className="w-36 h-7 bg-slate-800 rounded-lg mb-3" />
    <div className="flex items-center gap-2">
      <div className="w-16 h-4 bg-slate-800 rounded-md" />
      <div className="w-24 h-3 bg-slate-800 rounded-full" />
    </div>
  </div>
);

export const ChartSkeleton: React.FC = () => (
  <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 animate-pulse min-h-[300px] flex flex-col justify-between">
    <div className="flex items-center justify-between">
      <div className="w-32 h-4 bg-slate-800 rounded-full" />
      <div className="w-20 h-6 bg-slate-800 rounded-lg" />
    </div>
    <div className="w-full h-44 bg-slate-800/40 rounded-xl my-4 flex items-end justify-between p-4 gap-2">
      <div className="w-full h-1/2 bg-slate-800 rounded-t-sm" />
      <div className="w-full h-3/4 bg-slate-800 rounded-t-sm" />
      <div className="w-full h-1/3 bg-slate-800 rounded-t-sm" />
      <div className="w-full h-5/6 bg-slate-800 rounded-t-sm" />
      <div className="w-full h-2/3 bg-slate-800 rounded-t-sm" />
    </div>
    <div className="flex justify-around">
      <div className="w-12 h-3 bg-slate-800 rounded-full" />
      <div className="w-12 h-3 bg-slate-800 rounded-full" />
      <div className="w-12 h-3 bg-slate-800 rounded-full" />
    </div>
  </div>
);

export const TableRowSkeleton: React.FC = () => (
  <div className="flex items-center justify-between p-4 border-b border-slate-800 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-slate-800" />
      <div>
        <div className="w-28 h-3.5 bg-slate-800 rounded-full mb-1.5" />
        <div className="w-16 h-2.5 bg-slate-800 rounded-full" />
      </div>
    </div>
    <div className="w-20 h-4 bg-slate-800 rounded-md" />
  </div>
);

export const WidgetSkeleton: React.FC = () => (
  <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 animate-pulse space-y-4">
    <div className="flex justify-between items-center">
      <div className="w-28 h-4 bg-slate-800 rounded-full" />
      <div className="w-6 h-6 bg-slate-800 rounded-full" />
    </div>
    <div className="space-y-3">
      <div className="w-full h-12 bg-slate-800/60 rounded-xl" />
      <div className="w-full h-12 bg-slate-800/60 rounded-xl" />
      <div className="w-full h-12 bg-slate-800/60 rounded-xl" />
    </div>
  </div>
);
