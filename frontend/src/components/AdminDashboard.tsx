import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, Shield, Activity, Cpu, Database, Users, AlertTriangle, 
  FileText, Download, Search, Filter, RefreshCw, CheckCircle, Clock, 
  ChevronRight, BarChart2, TrendingUp, Layers, Server, Bell, Sun, Moon, 
  Settings, ArrowUpRight, Check, X, ShieldAlert, Sparkles, MapPin
} from "lucide-react";
import { UserProfile } from "../types";

interface AdminDashboardProps {
  profile: UserProfile | null;
  onBackToWebsite: () => void;
}

interface WardData {
  id: string;
  wardName: string;
  district: string;
  population: string;
  wasteCollectedKg: number;
  segregationRate: number;
  activeComplaints: number;
  resolvedComplaints: number;
  status: "Optimal" | "Action Required" | "Critical";
}

const INITIAL_WARDS: WardData[] = [
  { id: "W-101", wardName: "Ward 12 - Connaught Place", district: "Central Zone", population: "145,000", wasteCollectedKg: 42500, segregationRate: 88, activeComplaints: 3, resolvedComplaints: 142, status: "Optimal" },
  { id: "W-102", wardName: "Ward 24 - Bandra West", district: "Western Zone", population: "210,000", wasteCollectedKg: 68900, segregationRate: 74, activeComplaints: 12, resolvedComplaints: 289, status: "Action Required" },
  { id: "W-103", wardName: "Ward 08 - Indiranagar", district: "Eastern Zone", population: "180,000", wasteCollectedKg: 51200, segregationRate: 92, activeComplaints: 1, resolvedComplaints: 310, status: "Optimal" },
  { id: "W-104", wardName: "Ward 31 - Sector 62", district: "Northern Zone", population: "165,000", wasteCollectedKg: 39800, segregationRate: 65, activeComplaints: 19, resolvedComplaints: 115, status: "Critical" },
  { id: "W-105", wardName: "Ward 17 - Park Street", district: "Southern Zone", population: "128,000", wasteCollectedKg: 34100, segregationRate: 81, activeComplaints: 5, resolvedComplaints: 198, status: "Optimal" }
];

interface LogEntry {
  id: string;
  timestamp: string;
  source: "YOLO v8 Vision" | "OCR Pipeline" | "Fraud Shield" | "GPS Router";
  level: "INFO" | "WARN" | "SUCCESS";
  message: string;
}

const SYSTEM_LOGS: LogEntry[] = [
  { id: "log-1", timestamp: "14:22:05", source: "YOLO v8 Vision", level: "SUCCESS", message: "Batch inference completed in 18ms (99.4% confidence score)." },
  { id: "log-2", timestamp: "14:21:49", source: "Fraud Shield", level: "INFO", message: "Duplicate image upload flagged and quarantined for review." },
  { id: "log-3", timestamp: "14:20:12", source: "GPS Router", level: "SUCCESS", message: "Route optimized for 14 recycler trucks in Western Zone." },
  { id: "log-4", timestamp: "14:18:30", source: "OCR Pipeline", level: "WARN", message: "Serial number OCR retry triggered due to ambient shadow." },
  { id: "log-5", timestamp: "14:15:02", source: "YOLO v8 Vision", level: "SUCCESS", message: "Material classification model update v4.2 deployed across nodes." }
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ profile, onBackToWebsite }) => {
  const [activeTab, setActiveTab] = useState<"overview" | "wards" | "ai_monitoring" | "complaints" | "logs">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZone, setSelectedZone] = useState<string>("All");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>(SYSTEM_LOGS);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const filteredWards = INITIAL_WARDS.filter(w => {
    const matchesSearch = w.wardName.toLowerCase().includes(searchQuery.toLowerCase()) || w.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesZone = selectedZone === "All" || w.district === selectedZone;
    return matchesSearch && matchesZone;
  });

  const handleExportReport = (type: "PDF" | "CSV") => {
    setExportNotice(`Generated Enterprise ${type} ESG Audit Report successfully.`);
    setTimeout(() => setExportNotice(null), 4000);
  };

  return (
    <div className={`min-h-screen font-sans ${isDarkMode ? "bg-[#090d14] text-slate-100" : "bg-slate-50 text-slate-900"} transition-colors duration-300`}>
      {/* Top Enterprise Bar */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-xl ${isDarkMode ? "bg-[#0d121d]/90 border-slate-800" : "bg-white/90 border-slate-200"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBackToWebsite}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all cursor-pointer"
            >
              ← Back to Main Platform
            </button>
            <div className="h-5 w-px bg-slate-700 hidden sm:block" />
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              <span className="font-bold tracking-tight text-sm uppercase text-emerald-400">Government Smart City Command Center</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search input */}
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search wards, logs, telemetry..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-9 pr-4 py-1.5 rounded-xl text-xs outline-none border transition-all w-64 ${
                  isDarkMode ? "bg-slate-900/80 border-slate-700 text-white focus:border-emerald-500" : "bg-slate-100 border-slate-300 focus:border-emerald-600 text-slate-900"
                }`}
              />
            </div>

            {/* Dark/Light mode toggle */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className={`p-2 rounded-xl border transition-all ${isDarkMode ? "border-slate-800 bg-slate-900 text-amber-400" : "border-slate-200 bg-white text-slate-700"}`}
              title="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* System Status Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All 14 Nodes Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Export Toast Notice */}
        <AnimatePresence>
          {exportNotice && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>{exportNotice}</span>
              </div>
              <button onClick={() => setExportNotice(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Municipal Operations & AI Telemetry</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Real-time waste segregation compliance, ward efficiency ratings, and computer vision node diagnostic logs.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleExportReport("CSV")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isDarkMode ? "border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Download className="w-3.5 h-3.5" /> CSV Data
            </button>
            <button 
              onClick={() => handleExportReport("PDF")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:opacity-90 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" /> Export PDF Report
            </button>
          </div>
        </div>

        {/* Top Key Metrics Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className={`p-5 rounded-2xl border ${isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium">Total Municipal Waste</span>
              <Building2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold">236,500 <span className="text-sm font-normal text-slate-400">kg</span></div>
            <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" /> +14.2% from last month
            </div>
          </div>

          <div className={`p-5 rounded-2xl border ${isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium">AI Segregation Accuracy</span>
              <Cpu className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold">98.6%</div>
            <div className="mt-2 text-xs text-cyan-400 flex items-center gap-1 font-medium">
              <Sparkles className="w-3.5 h-3.5" /> YOLOv8 Model v4.2 active
            </div>
          </div>

          <div className={`p-5 rounded-2xl border ${isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium">Active Ward Complaints</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold">40 <span className="text-xs font-normal text-slate-400">unresolved</span></div>
            <div className="mt-2 text-xs text-amber-400 flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5" /> Avg SLA response: 1.4 hrs
            </div>
          </div>

          <div className={`p-5 rounded-2xl border ${isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium">Verified Carbon Saved</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold">142.8 <span className="text-sm font-normal text-slate-400">Tons CO₂</span></div>
            <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1 font-medium">
              <CheckCircle className="w-3.5 h-3.5" /> UN SDG 13 Compliant
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 mb-6 overflow-x-auto pb-2">
          {[
            { id: "overview", label: "Ward Performance Matrix", icon: BarChart2 },
            { id: "ai_monitoring", label: "AI Model Diagnostics", icon: Cpu },
            { id: "complaints", label: "Citizen Complaint Triage", icon: AlertTriangle },
            { id: "logs", label: "Realtime Telemetry Logs", icon: Server },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive 
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: WARDS OVERVIEW TABLE */}
        {activeTab === "overview" && (
          <div className={`rounded-2xl border overflow-hidden ${isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
            <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-semibold text-slate-400">Filter Zone:</span>
                {["All", "Central Zone", "Western Zone", "Eastern Zone", "Northern Zone", "Southern Zone"].map(zone => (
                  <button
                    key={zone}
                    onClick={() => setSelectedZone(zone)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      selectedZone === zone ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {zone}
                  </button>
                ))}
              </div>
              <span className="text-xs text-slate-500">Showing {filteredWards.length} municipal wards</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`text-[11px] uppercase tracking-wider font-semibold border-b ${isDarkMode ? "bg-slate-950/60 border-slate-800 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-600"}`}>
                    <th className="py-3.5 px-4">Ward ID & Name</th>
                    <th className="py-3.5 px-4">Zone District</th>
                    <th className="py-3.5 px-4">Population</th>
                    <th className="py-3.5 px-4">Waste Collected</th>
                    <th className="py-3.5 px-4">Segregation %</th>
                    <th className="py-3.5 px-4">Open Complaints</th>
                    <th className="py-3.5 px-4">Health Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-xs">
                  {filteredWards.map(ward => (
                    <tr key={ward.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-semibold">
                        <div>{ward.wardName}</div>
                        <span className="text-[10px] text-slate-500 font-mono">{ward.id}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">{ward.district}</td>
                      <td className="py-3.5 px-4 text-slate-400">{ward.population}</td>
                      <td className="py-3.5 px-4 font-semibold text-emerald-400">{ward.wasteCollectedKg.toLocaleString()} kg</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${ward.segregationRate >= 80 ? "bg-emerald-400" : ward.segregationRate >= 70 ? "bg-amber-400" : "bg-rose-400"}`} 
                              style={{ width: `${ward.segregationRate}%` }}
                            />
                          </div>
                          <span className="font-mono text-xs">{ward.segregationRate}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${ward.activeComplaints > 10 ? "bg-rose-500/20 text-rose-300" : "bg-slate-800 text-slate-300"}`}>
                          {ward.activeComplaints} active
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          ward.status === "Optimal" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                          ward.status === "Action Required" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                          "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            ward.status === "Optimal" ? "bg-emerald-400" : ward.status === "Action Required" ? "bg-amber-400" : "bg-rose-400"
                          }`} />
                          {ward.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] transition-colors">
                          Manage Ward
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: AI MODEL MONITORING */}
        {activeTab === "ai_monitoring" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`p-6 rounded-2xl border ${isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" /> YOLOv8 Waste Vision Model
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">Active v4.2</span>
              </div>
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Object Detection Precision</span>
                    <span className="font-bold text-emerald-400">99.4%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: "99.4%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Average Inference Latency</span>
                    <span className="font-bold text-cyan-400">18.4 ms</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-cyan-400 h-full rounded-full" style={{ width: "85%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Daily Image Scans Processed</span>
                    <span className="font-bold text-indigo-400">42,890 / 50,000</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-400 h-full rounded-full" style={{ width: "85%" }} />
                  </div>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-2xl border ${isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" /> Fraud & Verification Shield
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">Guarded</span>
              </div>
              <p className="text-xs text-slate-400 mb-4">Prevents fake photo uploads, duplicate reward claims, and stock image submissions through perceptual hash matching.</p>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40">
                  <span className="text-slate-300">Duplicate Photos Blocked Today</span>
                  <span className="font-bold text-amber-400 font-mono">148</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40">
                  <span className="text-slate-300">EXIF Metadata Spoof Attempts</span>
                  <span className="font-bold text-rose-400 font-mono">12</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40">
                  <span className="text-slate-300">EcoPoints Protection Rate</span>
                  <span className="font-bold text-emerald-400 font-mono">100%</span>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-2xl border ${isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-400" /> Predictive Recycler Logistics
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold">Optimized</span>
              </div>
              <p className="text-xs text-slate-400 mb-4">AI vehicle routing model calculates shortest path for municipal garbage trucks to reduce carbon emissions.</p>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Fuel Saved This Month</span>
                  <span className="font-bold text-emerald-400">1,240 Liters</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Route Efficiency Gain</span>
                  <span className="font-bold text-indigo-400">+28.5%</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Active Collection Fleet</span>
                  <span className="font-bold text-cyan-400">64 Trucks</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: COMPLAINTS */}
        {activeTab === "complaints" && (
          <div className={`p-6 rounded-2xl border ${isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Citizen Complaint & Issue Triage Stream
            </h3>
            <div className="space-y-4">
              {[
                { id: "CMP-4891", location: "Sector 14 Main Market, Ward 12", type: "Overflowing Smart Bin", urgency: "HIGH", time: "12 mins ago", status: "Assigned to Truck #14" },
                { id: "CMP-4890", location: "Park Avenue Road, Ward 24", type: "Illegal Plastic Dumping", urgency: "URGENT", time: "34 mins ago", status: "Inspector Dispatched" },
                { id: "CMP-4889", location: "Outer Ring Road, Ward 08", type: "Missed E-Waste Pickup", urgency: "MEDIUM", time: "1 hour ago", status: "Resolved" }
              ].map(c => (
                <div key={c.id} className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-white font-mono">{c.id}</span>
                      <span className="text-slate-400">• {c.type}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.urgency === "URGENT" ? "bg-rose-500/20 text-rose-400" : c.urgency === "HIGH" ? "bg-amber-500/20 text-amber-400" : "bg-slate-800 text-slate-300"}`}>
                        {c.urgency}
                      </span>
                    </div>
                    <div className="text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" /> {c.location}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">{c.time}</span>
                    <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                      {c.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: REALTIME LOGS */}
        {activeTab === "logs" && (
          <div className={`p-6 rounded-2xl border ${isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" /> Live System & Model Inference Logs
              </h3>
              <button 
                onClick={() => setLogs([...logs])} 
                className="flex items-center gap-1 text-xs text-emerald-400 hover:underline cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh Logs
              </button>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl font-mono text-xs text-slate-300 space-y-2 border border-slate-800 max-h-96 overflow-y-auto">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 hover:bg-slate-900/60 p-1.5 rounded">
                  <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                  <span className={`font-bold shrink-0 ${log.level === "SUCCESS" ? "text-emerald-400" : log.level === "WARN" ? "text-amber-400" : "text-cyan-400"}`}>
                    [{log.source}]
                  </span>
                  <span className="text-slate-300">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
