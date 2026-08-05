import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Camera, Zap, Target, BarChart2, ShoppingBag, Heart, 
  Users, Building2, RefreshCw, User, Bell, MapPin, 
  Award, Cpu, Globe, AlertTriangle, ArrowRight, Check, 
  Sparkles, ShieldCheck, ChevronRight, Play, ExternalLink, 
  Search, Filter, Star, Info, MessageSquare, Plus, Upload, Trash2, Send,
  Sliders, ThumbsUp, Map, Clock, CheckCircle2, Shield, Flame, Gift, Compass,
  HelpCircle, ChevronDown, CheckCircle, FileText, Download, X, Layers, Activity, Leaf, LogOut
} from "lucide-react";
import { EarthVisualizer } from "./EarthVisualizer";
import { audioEngine } from "./AudioEngine";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { UserProfile } from "../types";

interface EcoVerzzWebsiteProps {
  onLaunchApp?: (targetDashboardView?: string) => void;
  profile?: UserProfile | null;
}

// SECTION 2: TRUSTED BY PARTNERS
const TRUSTED_PARTNERS = [
  { name: "Smart Cities Mission India", category: "Government", logo: "🏛️" },
  { name: "Brihanmumbai Municipal Corp (BMC)", category: "Municipal", logo: "🏙️" },
  { name: "Delhi Municipal Corporation (MCD)", category: "Municipal", logo: "🏛️" },
  { name: "Tata Sustainability Group", category: "CSR", logo: "🏢" },
  { name: "Infosys Foundation CSR", category: "CSR", logo: "⚡" },
  { name: "IIT Bombay Eco Innovation Lab", category: "Institution", logo: "🎓" },
  { name: "Clean Earth Foundation NGO", category: "NGO", logo: "🌱" },
  { name: "EcoGreen Recyclers Network", category: "Recycle", logo: "♻️" },
];

// SECTION 3: PLATFORM OVERVIEW MODULES
const PLATFORM_OVERVIEW_CARDS = [
  { id: "ecoscan", title: "EcoScan AI", subtitle: "YOLOv8 Waste Identification", desc: "Recognizes plastic, glass, e-waste, and organics instantly with bin guidance.", metrics: "99.4% Precision", icon: Camera, color: "from-emerald-500 to-teal-400" },
  { id: "complaint", title: "Complaint Reporting", subtitle: "Civic Action Triage", desc: "Report illegal dumping or overflowing bins with auto GPS location tagging.", metrics: "1.4 hr Avg SLA", icon: AlertTriangle, color: "from-amber-500 to-rose-400" },
  { id: "food_rescue", title: "Food Rescue", subtitle: "Zero Surplus Hunger", desc: "Connects hotels and restaurants with NGOs to redistribute surplus meals.", metrics: "142,000+ Meals Saved", icon: Heart, color: "from-rose-500 to-pink-400" },
  { id: "carbon_calc", title: "Carbon Calculator", subtitle: "ISO 14064 Accounting", desc: "Computes personal and enterprise carbon footprint with reduction goals.", metrics: "Realtime Offset Matrix", icon: Sliders, color: "from-cyan-500 to-blue-500" },
  { id: "recycler_net", title: "Recycler Network", subtitle: "Logistics Optimization", desc: "Connects citizens with verified local recycling facilities for doorstep pickups.", metrics: "480+ Recycler Hubs", icon: RefreshCw, color: "from-teal-400 to-emerald-600" },
  { id: "rewards", title: "EcoRewards & Vault", subtitle: "Gamified ESG Currency", desc: "Earn EcoPoints for green actions and exchange for Madagascar tree planting.", metrics: "1.2M Points Claimed", icon: Award, color: "from-amber-400 to-orange-500" },
  { id: "ai_bot", title: "AI Assistant", subtitle: "Floating Sustainability Copilot", desc: "Ask instant questions about e-waste disposal, subsidies, and footprints.", metrics: "Instant 24/7 Intel", icon: Cpu, color: "from-purple-500 to-indigo-500" },
  { id: "analytics", title: "Analytics Dashboard", subtitle: "Municipal Telemetry", desc: "Live heatmaps, ward segregation accuracy ratings, and CO2 offset trends.", metrics: "14 Ward Nodes Live", icon: BarChart2, color: "from-blue-500 to-cyan-400" },
];

// SECTION 4: TIMELINE STEPS
const TIMELINE_STEPS = [
  { step: 1, title: "Upload Waste Image", desc: "Snap a photo of any waste item via mobile camera or web scanner.", icon: Upload },
  { step: 2, title: "AI Detection", desc: "Computer vision deep learning model identifies material composition in <20ms.", icon: Cpu },
  { step: 3, title: "Confidence Score", desc: "System verifies item authenticity and returns 99%+ material confidence score.", icon: CheckCircle },
  { step: 4, title: "Nearest Recycler", desc: "GPS routes item to nearest certified recycling hub or municipal bin.", icon: MapPin },
  { step: 5, title: "Reward", desc: "EcoPoints and XP tokens credited directly to user digital wallet.", icon: Award },
  { step: 6, title: "Carbon Saved", desc: "Offset ledger records avoided CO2 emissions and updates biosphere stats.", icon: Zap },
  { step: 7, title: "Impact Dashboard", desc: "Actions aggregated into municipal, CSR, and global SDG reports.", icon: BarChart2 },
];

// SECTION 5: AI ARCHITECTURE NODES
const AI_TECH_NODES = [
  { id: "cv", name: "Computer Vision", desc: "Real-time frame processing for high-density waste material recognition.", active: true },
  { id: "yolo", name: "YOLOv8 Detection", desc: "Multi-class bounding box segmentation for mixed waste items.", active: true },
  { id: "ocr", name: "OCR Serial Reader", desc: "Reads serial numbers on e-waste, batteries, and appliances for tracking.", active: true },
  { id: "ml", name: "Machine Learning", desc: "Continuous model refinement based on localized municipal waste patterns.", active: true },
  { id: "pred", name: "Predictive Analytics", desc: "Forecasts bin fill rates and peak food surplus hours for NGOs.", active: true },
  { id: "fraud", name: "Fraud Shield", desc: "Perceptual hashing blocks duplicate photo submissions and fake reward claims.", active: true },
];

export const EcoVerzzWebsite: React.FC<EcoVerzzWebsiteProps> = ({ onLaunchApp, profile }) => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const activeUser = profile || user;

  // Navigation & Interactive States
  const [activePortalTab, setActivePortalTab] = useState<"citizen" | "gov" | "csr" | "recycler" | "food">("gov");
  const [selectedTimelineStep, setSelectedTimelineStep] = useState(1);
  const [calcElectricity, setCalcElectricity] = useState(250); // kWh/month
  const [calcCommute, setCalcCommute] = useState(300); // km/month
  const [calcWasteKg, setCalcWasteKg] = useState(40); // kg/month
  const [pricingCycle, setPricingCycle] = useState<"monthly" | "yearly">("yearly");
  const [faqCategory, setFaqCategory] = useState("all");
  const [faqSearch, setFaqSearch] = useState("");
  const [activeFaqId, setActiveFaqId] = useState<number | null>(1);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatQuery, setChatQuery] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { sender: "ai", text: "Hello! I'm EcoVerzz AI Copilot. How can I help you build a greener community today?" }
  ]);

  // Carbon Calculator Calculation
  const calculatedCO2 = Math.round((calcElectricity * 0.85) + (calcCommute * 0.21) + (calcWasteKg * 1.5));
  const treesToOffset = Math.ceil(calculatedCO2 / 22);

  // Floating Chat Bot Handler
  const handleSendChat = (e?: React.FormEvent, customMsg?: string) => {
    if (e) e.preventDefault();
    const msg = customMsg || chatQuery;
    if (!msg.trim()) return;

    setChatMessages(prev => [...prev, { sender: "user", text: msg }]);
    if (!customMsg) setChatQuery("");
    audioEngine.playTick();

    setTimeout(() => {
      let reply = "EcoVerzz AI is scanning municipal databases...";
      const lower = msg.toLowerCase();
      if (lower.includes("battery") || lower.includes("e-waste")) {
        reply = "⚡ Batteries and e-waste should be deposited at certified EcoVerzz E-Nodes. Nearest center: Sector 14 E-Waste Hub (1.2 km away). You earn 50 EcoPoints per battery recycled!";
      } else if (lower.includes("footprint") || lower.includes("carbon")) {
        reply = "🌱 Your estimated household footprint is processed using ISO 14064 standards. Use our Carbon Calculator section to benchmark your monthly savings!";
      } else if (lower.includes("scheme") || lower.includes("government")) {
        reply = "🏛️ Active Government Green Schemes: PM Surya Ghar Muft Bijli Yojana (Solar subsidy up to ₹78,000) & National Clean Air Programme (NCAP) Municipal Grants.";
      } else {
        reply = "✨ EcoVerzz AI continuously optimizes waste collection and surplus food distribution using real-time YOLOv8 deep learning. Explore our Platform Overview to see live telemetry!";
      }

      setChatMessages(prev => [...prev, { sender: "ai", text: reply }]);
      audioEngine.playSuccessChime();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 overflow-x-hidden">
      
      {/* GLOBAL FLOATING HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#080c14]/80 backdrop-blur-2xl border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-300 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Leaf className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white font-sans uppercase">
                Eco<span className="text-emerald-400">Verzz</span> <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 ml-1 font-mono font-bold">AI</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">Smart City & Sustainability Platform</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#overview" className="hover:text-emerald-400 transition-colors">Platform Overview</a>
            <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</a>
            <a href="#ai-tech" className="hover:text-emerald-400 transition-colors">AI Technology</a>
            <a href="#portals" className="hover:text-emerald-400 transition-colors">Enterprise Portals</a>
            <a href="#calculator" className="hover:text-emerald-400 transition-colors">Carbon Calculator</a>
            <a href="#pricing" className="hover:text-emerald-400 transition-colors">Pricing</a>
          </nav>

          {/* Merged Action CTAs with Live User Credentials */}
          <div className="flex items-center gap-3">
            {token && activeUser ? (
              <div className="flex items-center gap-2.5">
                <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    {activeUser.name ? activeUser.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-white leading-tight">
                      {activeUser.name || activeUser.email}
                    </p>
                    <span className="text-[10px] text-emerald-400 font-medium">
                      {activeUser.role} Account
                    </span>
                  </div>
                </div>

                {activeUser.role === "Admin" && (
                  <button
                    onClick={() => navigate("/admin")}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-all cursor-pointer"
                  >
                    <Shield className="w-3.5 h-3.5 text-amber-400" /> Admin
                  </button>
                )}

                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 text-slate-950 hover:shadow-xl hover:shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-emerald-500/10 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" /> Go to Dashboard
                </button>

                <button
                  onClick={logout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => navigate("/login")}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="hidden sm:inline-flex px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Register
                </button>
                <button
                  onClick={() => onLaunchApp ? onLaunchApp() : navigate("/dashboard")}
                  className="px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 text-slate-950 hover:shadow-xl hover:shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-emerald-500/10 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" /> Launch Platform
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* SECTION 1: WORLD-CLASS HERO SECTION */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-dot-grid">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Column: Headline & CTAs */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Next-Gen Smart City Infrastructure • AI Powered</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                AI-Powered Sustainable <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                  Smart City Platform
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Helping citizens, governments, recyclers, NGOs, and businesses build cleaner and smarter communities using Artificial Intelligence, Computer Vision, and real-time carbon telemetry.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <button 
                  onClick={() => onLaunchApp("ai_scan")}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-xl shadow-emerald-500/25 flex items-center gap-2 cursor-pointer"
                >
                  <Camera className="w-4 h-4" /> Start Waste Scanning
                </button>
                <a 
                  href="#overview"
                  className="px-6 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-700 hover:border-emerald-500/50 text-slate-100 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Globe className="w-4 h-4 text-emerald-400" /> Explore Platform
                </a>
                <button 
                  onClick={() => setShowDemoModal(true)}
                  className="px-5 py-3.5 rounded-2xl bg-slate-800/40 text-slate-300 hover:text-white font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" /> Watch Live Demo
                </button>
              </div>

              {/* Live Statistics Counters Ticker */}
              <div className="pt-8 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white">2.4M+</div>
                  <div className="text-xs text-slate-400">Waste Items Segregated</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400">142T</div>
                  <div className="text-xs text-slate-400">CO₂ Diverted</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-teal-300">480+</div>
                  <div className="text-xs text-slate-400">Smart Municipal Wards</div>
                </div>
              </div>
            </div>

            {/* Right Hero Column: Animated Interactive 3D Earth Visualizer */}
            <div className="lg:col-span-5 flex justify-center relative">
              <div className="relative w-full max-w-md aspect-square rounded-full flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-2xl animate-pulse" />
                <EarthVisualizer scene="website" healingStage={5} zoomLevel="normal" />
                
                {/* Floating AI Status Badges */}
                <div className="absolute top-4 left-0 p-3 rounded-2xl bg-slate-900/90 border border-emerald-500/30 backdrop-blur-xl shadow-xl flex items-center gap-3 text-xs">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="font-bold text-white">YOLOv8 Vision Active</div>
                    <div className="text-[10px] text-slate-400">99.4% Recognition Speed</div>
                  </div>
                </div>

                <div className="absolute bottom-6 right-0 p-3 rounded-2xl bg-slate-900/90 border border-cyan-500/30 backdrop-blur-xl shadow-xl flex items-center gap-3 text-xs">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="font-bold text-white">ISO 14064 Certified</div>
                    <div className="text-[10px] text-slate-400">Realtime Carbon Ledger</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: TRUSTED BY PARTNERS MARQUEE */}
      <section className="py-12 border-y border-slate-800/80 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
          <p className="text-xs uppercase tracking-widest font-extrabold text-slate-400">
            Trusted by Government Bodies, Smart Cities, CSR Leaders & NGOs
          </p>
        </div>
        <div className="overflow-hidden whitespace-nowrap relative">
          <div className="inline-flex gap-8 animate-world-rotate">
            {[...TRUSTED_PARTNERS, ...TRUSTED_PARTNERS].map((partner, idx) => (
              <div key={idx} className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-300 text-xs font-bold hover:border-emerald-500/40 transition-all shrink-0">
                <span className="text-base">{partner.logo}</span>
                <span>{partner.name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-emerald-400 font-mono">{partner.category}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: PLATFORM OVERVIEW MODULES */}
      <section id="overview" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Unified Sustainability Suite</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">Comprehensive AI Ecosystem</h2>
          <p className="text-sm text-slate-400 mt-3">From real-time computer vision waste classification to municipal carbon telemetry and food rescue distribution.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLATFORM_OVERVIEW_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                whileHover={{ y: -6 }}
                onClick={() => onLaunchApp(card.id)}
                className="p-6 rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-950 hover:border-emerald-500/40 transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${card.color} p-0.5 mb-5`}>
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">{card.subtitle}</span>
                  <h3 className="text-lg font-bold text-white mt-1 group-hover:text-emerald-300 transition-colors">{card.title}</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{card.desc}</p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-300">{card.metrics}</span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* SECTION 4: HOW ECOVERZZ WORKS TIMELINE */}
      <section id="how-it-works" className="py-24 border-t border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-400">Automated Pipeline</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">How EcoVerzz AI Works</h2>
            <p className="text-sm text-slate-400 mt-3">From image capture to verified municipal offset credits in 7 seamless steps.</p>
          </div>

          {/* Interactive Timeline Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 relative">
            {TIMELINE_STEPS.map((t) => {
              const Icon = t.icon;
              const isSelected = selectedTimelineStep === t.step;
              return (
                <div
                  key={t.step}
                  onClick={() => {
                    setSelectedTimelineStep(t.step);
                    audioEngine.playTick();
                  }}
                  className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                    isSelected 
                      ? "bg-emerald-500/10 border-emerald-500/50 text-white shadow-xl shadow-emerald-500/10" 
                      : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full mx-auto mb-3 flex items-center justify-center font-mono font-bold text-xs ${isSelected ? "bg-emerald-400 text-slate-950" : "bg-slate-800 text-slate-400"}`}>
                    {t.step}
                  </div>
                  <Icon className={`w-5 h-5 mx-auto mb-2 ${isSelected ? "text-emerald-400" : "text-slate-500"}`} />
                  <div className="text-xs font-bold line-clamp-1">{t.title}</div>
                </div>
              );
            })}
          </div>

          {/* Timeline Step Active Detail Box */}
          <div className="mt-8 p-8 rounded-3xl border border-emerald-500/30 bg-slate-900/90 max-w-3xl mx-auto text-center relative overflow-hidden">
            <div className="text-xs font-mono text-emerald-400 font-bold uppercase">Step {selectedTimelineStep} of 7</div>
            <h3 className="text-2xl font-black text-white mt-2">{TIMELINE_STEPS[selectedTimelineStep - 1].title}</h3>
            <p className="text-sm text-slate-300 mt-3 max-w-xl mx-auto leading-relaxed">
              {TIMELINE_STEPS[selectedTimelineStep - 1].desc}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button 
                disabled={selectedTimelineStep === 1}
                onClick={() => setSelectedTimelineStep(prev => Math.max(1, prev - 1))}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 disabled:opacity-30 cursor-pointer"
              >
                Previous Step
              </button>
              <button 
                disabled={selectedTimelineStep === 7}
                onClick={() => setSelectedTimelineStep(prev => Math.min(7, prev + 1))}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold disabled:opacity-30 cursor-pointer"
              >
                Next Step →
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 5: AI TECHNOLOGY ARCHITECTURE DIAGRAM */}
      <section id="ai-tech" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Deep Learning Infrastructure</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">AI Technology Stack</h2>
          <p className="text-sm text-slate-400 mt-3">Engineered with high-throughput neural models and fraud detection safeguards.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AI_TECH_NODES.map((node) => (
            <div key={node.id} className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 hover:border-cyan-500/40 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 font-mono text-[10px] font-bold">Model Node</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{node.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{node.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: IMPACT DASHBOARD & REALTIME CHARTS */}
      <section className="py-24 border-t border-slate-800/80 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Realtime Biosphere Analytics</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">Global Impact Dashboard</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400">Waste Recycled Breakdown</span>
                <div className="text-3xl font-extrabold text-white mt-2">1,840.5 <span className="text-xs font-normal text-slate-400">Tons</span></div>
              </div>
              <div className="space-y-3 mt-6">
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Plastics & Polymers</span>
                    <span className="text-emerald-400 font-bold">54%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: "54%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>E-Waste & Electronics</span>
                    <span className="text-cyan-400 font-bold">28%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-cyan-400 h-full rounded-full" style={{ width: "28%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Glass & Metal Packaging</span>
                    <span className="text-indigo-400 font-bold">18%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-400 h-full rounded-full" style={{ width: "18%" }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400">Surplus Food Rescued</span>
                <div className="text-3xl font-extrabold text-rose-400 mt-2">142,500 <span className="text-xs font-normal text-slate-400">Meals</span></div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 mt-6 text-xs text-slate-300 space-y-2">
                <div className="flex justify-between">
                  <span>NGO Distribution Network</span>
                  <span className="font-bold text-rose-400">128 NGOs</span>
                </div>
                <div className="flex justify-between">
                  <span>Methane Gas Prevented</span>
                  <span className="font-bold text-emerald-400">48.2 Tons CH₄</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Donor Restaurants</span>
                  <span className="font-bold text-teal-300">340 Hubs</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400">Verified Trees Planted</span>
                <div className="text-3xl font-extrabold text-teal-300 mt-2">18,400 <span className="text-xs font-normal text-slate-400">Trees</span></div>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 space-y-2 mt-6">
                <div className="font-bold text-sm">Madagascar Reserve Project</div>
                <div>Every 1,000 EcoPoints redeemed sponsors 1 native sapling planted in verified reforestation zones.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTIONS 7-11: ENTERPRISE PORTALS SHOWCASE */}
      <section id="portals" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Tailored Enterprise Solutions</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">Role-Based Portals</h2>
        </div>

        {/* Portal Switcher Tabs */}
        <div className="flex justify-center gap-2 border-b border-slate-800 pb-4 overflow-x-auto mb-10">
          {[
            { id: "gov", label: "Smart City Government", icon: Building2 },
            { id: "citizen", label: "Citizen & Volunteer", icon: User },
            { id: "csr", label: "CSR & Corporate ESG", icon: ShieldCheck },
            { id: "recycler", label: "Recycler Network", icon: RefreshCw },
            { id: "food", label: "Food Rescue Network", icon: Heart },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activePortalTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActivePortalTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive 
                    ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20" 
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Portal Content Preview Box */}
        <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/80">
          {activePortalTab === "gov" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">Government & Municipalities</span>
                <h3 className="text-2xl font-bold text-white mt-3">Smart City Command & Ward Monitoring</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Real-time municipal dashboard for ward segregation tracking, citizen complaint SLA triage, truck route optimization, and automated ESG reporting.
                </p>
                <div className="mt-6 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Ward Performance Matrix & Heatmaps</div>
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> AI Complaint Auto-Dispatch</div>
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Executive PDF & CSV Data Exports</div>
                </div>
                <button onClick={() => onLaunchApp("admin")} className="mt-6 px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs cursor-pointer">
                  Launch Government Dashboard →
                </button>
              </div>
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-3">
                <div className="text-emerald-400 font-bold">LIVE MUNICIPAL TELEMETRY NODE #14</div>
                <div className="flex justify-between"><span>Ward 12 Segregation Rate</span><span className="text-emerald-400">88%</span></div>
                <div className="flex justify-between"><span>Open Complaints</span><span className="text-amber-400">3 active</span></div>
                <div className="flex justify-between"><span>AI Vision Accuracy</span><span className="text-cyan-400">99.4%</span></div>
              </div>
            </div>
          )}

          {activePortalTab === "citizen" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono font-bold">Citizens & Volunteers</span>
                <h3 className="text-2xl font-bold text-white mt-3">Gamified Sustainability & Rewards</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Scan waste, complete daily eco missions, climb municipal leaderboards, claim badges, and redeem EcoPoints for real-world rewards.
                </p>
                <button onClick={() => onLaunchApp("user_profile")} className="mt-6 px-5 py-2.5 rounded-xl bg-teal-400 text-slate-950 font-bold text-xs cursor-pointer">
                  Launch Citizen Portal →
                </button>
              </div>
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-3">
                <div className="text-teal-400 font-bold">CITIZEN PROFILE #ECO-94821</div>
                <div className="flex justify-between"><span>EcoPoints Balance</span><span className="text-amber-400">480 Coins</span></div>
                <div className="flex justify-between"><span>Streak Rating</span><span className="text-emerald-400">14 Days 🔥</span></div>
              </div>
            </div>
          )}

          {activePortalTab === "csr" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-bold">Corporate CSR & ESG</span>
                <h3 className="text-2xl font-bold text-white mt-3">Verified Corporate Sustainability</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Audit Scope 1-3 carbon emissions, sponsor local environmental drives, engage employees, and generate ISO 14064 compliant ESG reports.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-3">
                <div className="text-blue-400 font-bold">ENTERPRISE ESG AUDIT MATRIX</div>
                <div className="flex justify-between"><span>Scope 3 Avoidance</span><span className="text-emerald-400">1,240 T CO₂</span></div>
                <div className="flex justify-between"><span>Employees Engaged</span><span className="text-cyan-400">4,850 Active</span></div>
              </div>
            </div>
          )}

          {activePortalTab === "recycler" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">Recyclers & Scrap Hubs</span>
                <h3 className="text-2xl font-bold text-white mt-3">Smart Recycler Operations</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Route pickup requests, verify material authenticity with YOLO AI, manage inventory, and receive automated payments.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-3">
                <div className="text-amber-400 font-bold">RECYCLER DISPATCH HUB</div>
                <div className="flex justify-between"><span>Active Pickups Today</span><span className="text-emerald-400">28 Queued</span></div>
                <div className="flex justify-between"><span>Route Optimization</span><span className="text-indigo-400">+28% Efficient</span></div>
              </div>
            </div>
          )}

          {activePortalTab === "food" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold">Food Rescue Network</span>
                <h3 className="text-2xl font-bold text-white mt-3">Zero Surplus Food Waste</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Connect commercial donors with food banks and NGOs to redistribute surplus meals safely before expiry.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-3">
                <div className="text-rose-400 font-bold">FOOD RESCUE LIVE MAP</div>
                <div className="flex justify-between"><span>Meals Salvaged Today</span><span className="text-emerald-400">1,420 Meals</span></div>
                <div className="flex justify-between"><span>NGO Express Pickups</span><span className="text-rose-400">12 En Route</span></div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 12: INTERACTIVE CARBON CALCULATOR */}
      <section id="calculator" className="py-24 border-t border-slate-800/80 bg-slate-950/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">ISO 14064 Standard</span>
            <h2 className="text-3xl font-extrabold text-white mt-1">Interactive Carbon Calculator</h2>
            <p className="text-xs text-slate-400 mt-2">Adjust monthly inputs to calculate your estimated CO₂ footprint and tree offset equivalence.</p>
          </div>

          <div className="p-8 rounded-3xl border border-emerald-500/30 bg-slate-900/90 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-300">Monthly Electricity Consumption</span>
                  <span className="text-emerald-400 font-mono">{calcElectricity} kWh</span>
                </div>
                <input 
                  type="range" min="50" max="1000" value={calcElectricity} 
                  onChange={(e) => setCalcElectricity(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-300">Monthly Vehicle Commute</span>
                  <span className="text-cyan-400 font-mono">{calcCommute} km</span>
                </div>
                <input 
                  type="range" min="0" max="2000" value={calcCommute} 
                  onChange={(e) => setCalcCommute(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-300">Monthly Household Waste</span>
                  <span className="text-indigo-400 font-mono">{calcWasteKg} kg</span>
                </div>
                <input 
                  type="range" min="10" max="300" value={calcWasteKg} 
                  onChange={(e) => setCalcWasteKg(Number(e.target.value))}
                  className="w-full accent-indigo-400 cursor-pointer"
                />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between text-center">
              <div>
                <span className="text-xs uppercase tracking-widest font-bold text-slate-400">Estimated Carbon Output</span>
                <div className="text-4xl font-black text-emerald-400 mt-2">{calculatedCO2} <span className="text-sm font-normal text-slate-400">kg CO₂ / mo</span></div>
              </div>

              <div className="py-4 my-4 border-y border-slate-800/80">
                <div className="text-xs text-slate-300">Equivalent Trees Needed to Offset</div>
                <div className="text-2xl font-bold text-teal-300 mt-1">🌳 {treesToOffset} Trees / Year</div>
              </div>

              <button onClick={() => onLaunchApp("user_profile")} className="w-full py-3 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition-all cursor-pointer">
                Start Neutralizing Your Footprint →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 14: TESTIMONIALS */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Verified Impact Stories</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">Loved by Leaders & Citizens</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { quote: "EcoVerzz transformed our municipal ward segregation rate from 42% to 88% in just 90 days. The AI vision accuracy is unmatched.", name: "Rajesh Malhotra", role: "Smart City Commissioner", org: "Municipal Board" },
            { quote: "Our CSR team sponsored 500 saplings through EcoVerzz. The auditable ISO 14064 reporting saved us hundreds of audit hours.", name: "Ananya Deshmukh", role: "Head of ESG & CSR", org: "Fortune 500 Enterprise" },
            { quote: "The Food Rescue Network allowed our restaurant to donate 1,200 surplus meals directly to local food banks without any hassle.", name: "Marcus Chen", role: "Culinary Director", org: "Green Grocer Group" }
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
              <p className="text-xs text-slate-300 leading-relaxed italic">"{item.quote}"</p>
              <div className="mt-6 pt-4 border-t border-slate-800">
                <div className="font-bold text-white text-xs">{item.name}</div>
                <div className="text-[10px] text-slate-400">{item.role} • {item.org}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 15: PRICING */}
      <section id="pricing" className="py-24 border-t border-slate-800/80 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-400">Flexible SaaS Plans</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">Transparent Pricing</h2>
            
            {/* Billing Cycle Toggle */}
            <div className="mt-6 inline-flex items-center p-1 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
              <button 
                onClick={() => setPricingCycle("monthly")}
                className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${pricingCycle === "monthly" ? "bg-emerald-500 text-slate-950" : "text-slate-400"}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setPricingCycle("yearly")}
                className={`px-4 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${pricingCycle === "yearly" ? "bg-emerald-500 text-slate-950" : "text-slate-400"}`}
              >
                Yearly (20% Off)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { name: "Citizen", price: "Free", desc: "For individuals & volunteers.", features: ["EcoScan AI (50 scans/mo)", "Community Cleanup Drives", "EcoPoints Wallet", "Standard Leaderboard"] },
              { name: "NGO & Non-Profit", price: pricingCycle === "yearly" ? "$49/mo" : "$59/mo", desc: "For local conservation groups.", features: ["Food Rescue Dispatch Map", "Unlimited Volunteer Missions", "Direct Recycler Pickup Route", "Verified Impact Stamps"] },
              { name: "Corporate CSR", price: pricingCycle === "yearly" ? "$299/mo" : "$349/mo", desc: "For companies managing ESG goals.", features: ["Scope 1-3 Carbon Accounting", "Employee Eco Challenge Hub", "CSR Grant Manager", "ISO 14064 PDF Exporter"], highlight: true },
              { name: "Government", price: "Custom", desc: "For Smart Cities & Municipalities.", features: ["Full Smart City Ward Matrix", "Realtime AI Vision Nodes", "Automated Complaint SLA Triage", "Dedicated 24/7 SLA Support"] }
            ].map((plan, idx) => (
              <div key={idx} className={`p-6 rounded-3xl border flex flex-col justify-between ${plan.highlight ? "bg-gradient-to-b from-slate-900 to-emerald-950/40 border-emerald-500/50 shadow-xl shadow-emerald-500/10" : "bg-slate-900/60 border-slate-800"}`}>
                <div>
                  <div className="text-xs font-bold text-emerald-400 uppercase font-mono">{plan.name}</div>
                  <div className="text-3xl font-black text-white mt-2">{plan.price}</div>
                  <p className="text-[11px] text-slate-400 mt-1">{plan.desc}</p>

                  <div className="space-y-2 mt-6 text-xs text-slate-300">
                    {plan.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={() => onLaunchApp("admin")} className={`w-full py-2.5 rounded-xl text-xs font-bold mt-8 transition-all cursor-pointer ${plan.highlight ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400" : "bg-slate-800 text-white hover:bg-slate-700"}`}>
                  Get Started →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 16: FAQ ACCORDION */}
      <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Got Questions?</span>
          <h2 className="text-3xl font-extrabold text-white mt-1">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {[
            { id: 1, q: "How accurate is the EcoScan YOLOv8 AI model?", a: "EcoScan uses fine-tuned YOLOv8 deep learning models achieving 99.4% precision across plastics, e-waste, metals, paper, and organic matter." },
            { id: 2, q: "Is EcoVerzz compliant with international carbon standards?", a: "Yes. All carbon offset metrics are verified according to ISO 14064 greenhouse gas accounting standards." },
            { id: 3, q: "How can municipal corporations onboard their wards?", a: "Municipal administrators can deploy EcoVerzz node connectors in under 48 hours to start capturing ward telemetry." }
          ].map((faq) => (
            <div key={faq.id} className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden">
              <button 
                onClick={() => setActiveFaqId(activeFaqId === faq.id ? null : faq.id)}
                className="w-full p-4 text-left font-bold text-sm text-white flex items-center justify-between cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeFaqId === faq.id ? "rotate-180 text-emerald-400" : ""}`} />
              </button>
              {activeFaqId === faq.id && (
                <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 17: ENTERPRISE FOOTER */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-16 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Leaf className="w-5 h-5 text-emerald-400" />
              <span className="font-extrabold text-base text-white font-sans uppercase">Eco<span className="text-emerald-400">Verzz</span> AI</span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              Empowering cities, citizens, and corporations with AI-driven sustainability intelligence and circular economy logistics.
            </p>
          </div>

          <div>
            <div className="font-bold text-white mb-3">Platform</div>
            <div className="space-y-2">
              <div><a href="#overview" className="hover:text-white">EcoScan AI</a></div>
              <div><a href="#how-it-works" className="hover:text-white">How It Works</a></div>
              <div><a href="#calculator" className="hover:text-white">Carbon Calculator</a></div>
              <div><a href="#pricing" className="hover:text-white">Pricing</a></div>
            </div>
          </div>

          <div>
            <div className="font-bold text-white mb-3">Portals</div>
            <div className="space-y-2">
              <div><button onClick={() => onLaunchApp("admin")} className="hover:text-white">Government Portal</button></div>
              <div><button onClick={() => onLaunchApp("user_profile")} className="hover:text-white">Citizen Portal</button></div>
              <div><button onClick={() => onLaunchApp("settings")} className="hover:text-white">CSR & Enterprise</button></div>
            </div>
          </div>

          <div>
            <div className="font-bold text-white mb-3">Newsletter</div>
            <p className="text-[11px] text-slate-400 mb-2">Subscribe for sustainability updates.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="email@domain.com" className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs outline-none text-white w-full" />
              <button className="px-3 py-1.5 bg-emerald-500 text-slate-950 font-bold rounded-lg cursor-pointer">Join</button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-900 pt-6 flex flex-col sm:flex-row justify-between items-center text-[11px]">
          <div>© 2026 EcoVerzz AI Platform. All rights reserved. WCAG AA Compliant.</div>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security Ledger</span>
          </div>
        </div>
      </footer>

      {/* FLOATING AI CHATBOT ASSISTANT BUTTON & MODAL */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="mb-4 w-80 sm:w-96 rounded-3xl bg-slate-900 border border-emerald-500/40 shadow-2xl overflow-hidden flex flex-col h-[420px]"
            >
              {/* Chat Header */}
              <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-xs text-white">EcoVerzz AI Assistant</span>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`p-3 rounded-2xl max-w-[80%] ${msg.sender === "user" ? "bg-emerald-500 text-slate-950 font-medium" : "bg-slate-800 text-slate-200"}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Preset Prompts */}
              <div className="px-3 py-2 bg-slate-950 border-t border-slate-800/80 flex gap-2 overflow-x-auto">
                {["Where should I recycle batteries?", "Nearest e-waste center?", "Carbon footprint?"].map((preset, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleSendChat(undefined, preset)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 text-[10px] text-slate-300 hover:text-white whitespace-nowrap cursor-pointer"
                  >
                    {preset}
                  </button>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendChat} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
                <input 
                  type="text"
                  placeholder="Ask EcoVerzz AI..."
                  value={chatQuery}
                  onChange={(e) => setChatQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                />
                <button type="submit" className="p-2 rounded-xl bg-emerald-500 text-slate-950 font-bold cursor-pointer">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="p-4 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-bold shadow-xl shadow-emerald-500/30 hover:scale-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
        >
          <Cpu className="w-6 h-6 text-slate-950" />
        </button>
      </div>

    </div>
  );
};
