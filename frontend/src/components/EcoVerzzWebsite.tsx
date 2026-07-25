import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Camera, Zap, Target, BarChart2, ShoppingBag, Heart, 
  Users, Building2, RefreshCw, User, Bell, MapPin, 
  Award, Cpu, Globe, AlertTriangle, ArrowRight, Check, 
  Sparkles, ShieldCheck, ChevronRight, Play, ExternalLink, 
  Search, Filter, Star, Info, MessageSquare, Plus, Upload, Trash2, Send,
  Sliders, ThumbsUp, Map, Clock, CheckCircle2, Shield, Flame, Gift, Compass
} from "lucide-react";
import { EarthVisualizer } from "./EarthVisualizer";
import { audioEngine } from "./AudioEngine";
import { UserProfile } from "../types";

interface EcoVerzzWebsiteProps {
  onLaunchApp: (targetDashboardView?: string) => void;
  profile: UserProfile | null;
}

interface FeatureItem {
  id: string;
  num: number;
  name: string;
  tagline: string;
  category: "ai_waste" | "circular_food" | "community_social" | "business_impact";
  icon: any;
  targetDashboardView: string;
  shortDesc: string;
  fullDesc: string;
  sdgs: string[];
  keyHighlights: string[];
  gradient: string;
}

const CORE_FEATURES: FeatureItem[] = [
  {
    id: "ecoscan",
    num: 1,
    name: "EcoScan – Smart Waste Guide",
    tagline: "Scan • Segregate • Dispose • Earn",
    category: "ai_waste",
    icon: Camera,
    targetDashboardView: "ai_scan",
    shortDesc: "AI-powered waste identification system that recognizes waste types, recommends color-coded disposal bins, and awards EcoPoints.",
    fullDesc: "EcoScan uses real-time computer vision and YOLOv8 deep learning models to identify waste items instantly from camera feeds or photos. It provides step-by-step segregation guidance, calculates carbon offsets, and credits EcoPoints directly to user wallets.",
    sdgs: ["SDG 12: Responsible Consumption", "SDG 13: Climate Action"],
    keyHighlights: ["Real-time Image Classification", "Color-coded Bin Matcher", "Instant EcoPoints Calculation", "Contamination Prevention Warning"],
    gradient: "from-emerald-500 to-teal-400"
  },
  {
    id: "ecopulse",
    num: 2,
    name: "EcoPulse – Awareness Hub",
    tagline: "Learn Today. Protect Tomorrow.",
    category: "community_social",
    icon: Zap,
    targetDashboardView: "awareness",
    shortDesc: "AI-driven awareness hub providing sustainability news, environmental tips, government green schemes, and daily eco lessons.",
    fullDesc: "EcoPulse aggregates global and regional environmental intelligence into actionable, bite-sized lessons. Users discover green policies, subsidies for solar installation, urban composting techniques, and local eco campaigns.",
    sdgs: ["SDG 4: Quality Education", "SDG 13: Climate Action"],
    keyHighlights: ["Curated Eco News Feed", "Government Green Scheme Finder", "Interactive Quiz Modules", "Daily Micro-Habits"],
    gradient: "from-cyan-500 to-blue-500"
  },
  {
    id: "ecomissions",
    num: 3,
    name: "Eco Missions",
    tagline: "Small Actions. Big Impact.",
    category: "community_social",
    icon: Target,
    targetDashboardView: "missions",
    shortDesc: "Participate in daily, weekly, and community sustainability challenges to earn badges, certificates, and streak rewards.",
    fullDesc: "Gamified sustainability challenges designed to build long-term green habits. From zero-single-use-plastic weeks to community tree counts, completing missions unlocks digital badges, XP ranks, and physical rewards.",
    sdgs: ["SDG 11: Sustainable Cities", "SDG 12: Responsible Consumption"],
    keyHighlights: ["Daily & Weekly Challenges", "Streak Multiplier Bonuses", "Digital Verified Certificates", "Leaderboard Ranking"],
    gradient: "from-amber-500 to-orange-400"
  },
  {
    id: "impact_dashboard",
    num: 4,
    name: "Environmental Impact Dashboard",
    tagline: "Every Action Counts.",
    category: "business_impact",
    icon: BarChart2,
    targetDashboardView: "home",
    shortDesc: "Comprehensive matrix recording waste recycled, food rescued, verified carbon offsets, and UN SDGs supported over time.",
    fullDesc: "Track your personal and collective environmental footprint with precision analytics. View total CO2 diverted in kilograms, water saved, trees protected, and direct contributions to UN Sustainable Development Goals.",
    sdgs: ["SDG 13: Climate Action", "SDG 15: Life on Land"],
    keyHighlights: ["Real-time CO2 Diverted Analytics", "SDG Contribution Radar", "Downloadable ESG Reports", "Communal Impact Aggregation"],
    gradient: "from-emerald-400 to-green-600"
  },
  {
    id: "circular_marketplace",
    num: 5,
    name: "Circular Marketplace",
    tagline: "Nothing Valuable Becomes Waste.",
    category: "circular_food",
    icon: ShoppingBag,
    targetDashboardView: "marketplace",
    shortDesc: "Promotes circular economy by enabling users to buy, sell, donate, repair, or exchange pre-loved goods using EcoPoints.",
    fullDesc: "A zero-waste trade platform where citizens, businesses, and upcyclers buy, swap, or donate items. Prevent electronics, furniture, clothing, and materials from entering landfills by extending product lifecycles.",
    sdgs: ["SDG 12: Responsible Consumption", "SDG 8: Decent Work"],
    keyHighlights: ["EcoPoints Currency Exchange", "Upcycled Goods Showcase", "Repair & Refurbish Directory", "Zero-Waste Peer Trade"],
    gradient: "from-purple-500 to-indigo-400"
  },
  {
    id: "food_rescue",
    num: 6,
    name: "Food Rescue Network",
    tagline: "Save Food. Feed Lives.",
    category: "circular_food",
    icon: Heart,
    targetDashboardView: "food_rescue",
    shortDesc: "Connects restaurants, hotels, and households with NGOs and food banks to redistribute surplus meals efficiently.",
    fullDesc: "Eliminate organic food waste by creating real-time alert channels between commercial food donors, food banks, shelters, and volunteers. Track food safety windows, quantity in meals, and delivery routing.",
    sdgs: ["SDG 2: Zero Hunger", "SDG 12: Responsible Consumption"],
    keyHighlights: ["Surplus Food Real-Time Map", "NGO Express Pickups", "Food Safety Expiry Countdown", "Methane Emissions Prevented"],
    gradient: "from-rose-500 to-pink-400"
  },
  {
    id: "community_cleanup",
    num: 7,
    name: "Community Cleanup",
    tagline: "Together for a Cleaner Tomorrow.",
    category: "community_social",
    icon: Users,
    targetDashboardView: "waste_reports",
    shortDesc: "Organize or volunteer in neighborhood cleanup drives, coastal sweeps, tree plantations, and local conservation events.",
    fullDesc: "Empower grassroots environmental action. Create cleanup drives, set target cleanup coordinates, mobilize volunteers, request waste bin dispatch from municipalities, and measure total waste collected.",
    sdgs: ["SDG 11: Sustainable Cities", "SDG 14: Life Below Water"],
    keyHighlights: ["GPS Cleanup Organizer", "Volunteer RSVP & Check-in", "Equipment Logistics Dispatch", "Before/After Impact Gallery"],
    gradient: "from-teal-500 to-emerald-400"
  },
  {
    id: "business_csr",
    num: 8,
    name: "Business & CSR Portal",
    tagline: "Sustainability for Every Business.",
    category: "business_impact",
    icon: Building2,
    targetDashboardView: "settings",
    shortDesc: "Enables organizations to manage corporate ESG goals, launch CSR campaigns, engage employees, and audit SDG metrics.",
    fullDesc: "Enterprise suite for corporate sustainability management. Companies sponsor local environmental drives, monitor Scope 3 carbon offset verification, engage workforce via eco-challenges, and output compliant ESG audit reports.",
    sdgs: ["SDG 9: Industry & Innovation", "SDG 17: Partnerships"],
    keyHighlights: ["Automated Scope 1-3 Carbon Tracking", "Employee Eco-Challenge Hub", "CSR Grant Allocation Portal", "Auditable ESG PDF Exporter"],
    gradient: "from-blue-600 to-indigo-600"
  },
  {
    id: "recycle_connect",
    num: 9,
    name: "Recycle Connect",
    tagline: "Turn Waste into Wealth.",
    category: "ai_waste",
    icon: RefreshCw,
    targetDashboardView: "ai_scan",
    shortDesc: "Direct bridge connecting citizens with verified scrap recyclers. Sell recyclables, schedule pickups, and earn direct income.",
    fullDesc: "Monetize sorted scrap materials. Check live market rates for paper, cardboard, copper, e-waste, and plastics. Schedule doorstep collection by certified recycling partners and receive instant payouts or EcoPoints.",
    sdgs: ["SDG 8: Decent Work", "SDG 12: Responsible Consumption"],
    keyHighlights: ["Live Scrap Commodity Rates", "Doorstep Pickup Dispatch", "Verified Recycler Rating System", "Instant Wallet Monetization"],
    gradient: "from-amber-400 to-emerald-500"
  },
  {
    id: "user_profile",
    num: 10,
    name: "User Profile & Identity",
    tagline: "Your Sustainability Identity.",
    category: "community_social",
    icon: User,
    targetDashboardView: "passport",
    shortDesc: "Digital sustainability portfolio showcasing EcoPoints, verified impact rank, completed missions, and supported SDGs.",
    fullDesc: "Your immutable green resume. Displays your cumulative carbon offset score, verified badges, rank progression from Citizen to Planetary Pioneer, and shareable QR code for public environmental credentials.",
    sdgs: ["SDG 13: Climate Action"],
    keyHighlights: ["Dynamic XP & Rank Progress", "Verified Digital Badge Shelf", "Public Shareable Green Passport", "Personal Carbon Ledger"],
    gradient: "from-violet-500 to-purple-500"
  },
  {
    id: "smart_notifications",
    num: 11,
    name: "Smart Notification Centre",
    tagline: "Never Miss an Opportunity to Impact.",
    category: "community_social",
    icon: Bell,
    targetDashboardView: "telemetry",
    shortDesc: "Real-time alerts for mission deadlines, recycler doorstep arrivals, nearby food rescues, and verified report updates.",
    fullDesc: "Intelligent push & ledger notifications customized to your location and interests. Receive instant updates when a nearby restaurant posts surplus food or when a municipal team resolves your submitted EcoReport.",
    sdgs: ["SDG 11: Sustainable Cities"],
    keyHighlights: ["Real-time Geo-fenced Alerts", "Recycler ETA Dispatch Tracking", "Urgent Food Rescue Pings", "Resolution Ledger Logs"],
    gradient: "from-emerald-400 to-cyan-500"
  },
  {
    id: "location_services",
    num: 12,
    name: "Location Services",
    tagline: "Connecting Sustainability Around You.",
    category: "ai_waste",
    icon: MapPin,
    targetDashboardView: "telemetry",
    shortDesc: "GPS-enabled spatial mapping of recycling hubs, illegal dumping hotspots, cleanup events, and food donation points.",
    fullDesc: "Interactive GIS ecosystem mapping nearby recycling drop-offs, active volunteer drives, hazardous waste collection centers, and live pollution reports with navigation and distance estimates.",
    sdgs: ["SDG 11: Sustainable Cities", "SDG 15: Life on Land"],
    keyHighlights: ["Interactive GIS Green Map", "Distance & Route Navigation", "Drop-Off Bin Status Indicators", "Hotspot Heatmap Overlay"],
    gradient: "from-blue-500 to-teal-400"
  },
  {
    id: "rewards_recognition",
    num: 13,
    name: "Rewards & Recognition",
    tagline: "Every Good Action Deserves Recognition.",
    category: "community_social",
    icon: Award,
    targetDashboardView: "rewards",
    shortDesc: "Motivates eco-friendly behavior with levels, badges, streaks, leaderboards, gift vouchers, and official certificates.",
    fullDesc: "Reward engine turning ecological responsibility into tangible perks. Redeem EcoPoints for sustainable brand discounts, public transport passes, tree planting sponsorships, or official institutional certificates.",
    sdgs: ["SDG 12: Responsible Consumption"],
    keyHighlights: ["Communal Leaderboard Ladders", "Voucher Marketplace Redemption", "Institutional Certificates", "Streak Bonus Chests"],
    gradient: "from-yellow-400 to-amber-500"
  },
  {
    id: "ai_insights",
    num: 14,
    name: "AI Insights & Recommendations",
    tagline: "Smarter Choices for a Greener Future.",
    category: "ai_waste",
    icon: Cpu,
    targetDashboardView: "eco_ai",
    shortDesc: "Analyzes user habits and waste metrics to deliver personalized eco recommendations and actionable reduction plans.",
    fullDesc: "An AI advisor powered by LLMs that analyzes consumption patterns, suggests low-carbon alternative products, identifies recurring single-use plastics in your scans, and delivers customized green lifestyle plans.",
    sdgs: ["SDG 12: Responsible Consumption", "SDG 13: Climate Action"],
    keyHighlights: ["Personalized Carbon Reduction Plan", "Smart Product Swap Suggestions", "AI Lifestyle Coaching", "Predictive Waste Forecasting"],
    gradient: "from-indigo-500 to-blue-400"
  },
  {
    id: "ecolink_social",
    num: 15,
    name: "EcoLink – Social Network",
    tagline: "Share Impact. Inspire Change.",
    category: "community_social",
    icon: Globe,
    targetDashboardView: "eco_social",
    shortDesc: "Dedicated social feed for citizens, businesses, and NGOs to post green achievements, stories, and sustainability reels.",
    fullDesc: "A positive environmental social community. Share photos of your planted saplings, post zero-waste meal prep tutorials, engage in discussions, upvote verified impact stories, and build a green follower network.",
    sdgs: ["SDG 17: Partnerships"],
    keyHighlights: ["Impact Story & Reel Feed", "Verified Green Creator Badges", "Communal Group Discussions", "Upvote & Reshare Ecosystem"],
    gradient: "from-teal-400 to-cyan-500"
  },
  {
    id: "ecoreport",
    num: 16,
    name: "EcoReport – Environmental Reporting",
    tagline: "See It. Report It. Protect It.",
    category: "business_impact",
    icon: AlertTriangle,
    targetDashboardView: "waste_reports",
    shortDesc: "Report illegal dumping, water leaks, or overflowing bins with photos and GPS. Directs verified reports to authorities.",
    fullDesc: "Civic environmental watchdog platform. Snap a photo of illegal waste dumping or water pipeline leaks. EcoReport tags GPS coordinates, verifies report legitimacy via AI vision, and routes ticket to municipal authorities.",
    sdgs: ["SDG 11: Sustainable Cities", "SDG 16: Peace & Strong Institutions"],
    keyHighlights: ["GPS Auto-Tagging & Photo Proof", "AI Duplicate Report Filter", "Direct Municipal Ticket Routing", "Status Resolution Tracker"],
    gradient: "from-rose-500 to-red-600"
  }
];

export const EcoVerzzWebsite: React.FC<EcoVerzzWebsiteProps> = ({ onLaunchApp, profile }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeDemoFeature, setActiveDemoFeature] = useState<FeatureItem | null>(CORE_FEATURES[0]);
  
  // Interactive EcoScan Simulator State
  const [scanSample, setScanSample] = useState<"bottle" | "ewaste" | "organic" | "cardboard">("bottle");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  // Interactive Impact Calculator State
  const [wasteAmountKg, setWasteAmountKg] = useState<number>(45);

  // Interactive Eco Missions State
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);

  // Interactive CSR Metric Simulator State
  const [employeeCount, setEmployeeCount] = useState<number>(250);

  // Interactive AI Advice State
  const [aiHabitQuery, setAiHabitQuery] = useState<string>("How do I eliminate single-use plastic at my office?");
  const [aiAdviceReply, setAiAdviceReply] = useState<string | null>(null);

  // Interactive EcoReport State
  const [reportType, setReportType] = useState<string>("Illegal Dumping");
  const [reportSubmitted, setReportSubmitted] = useState<boolean>(false);

  // Filter Features
  const filteredFeatures = selectedCategory === "all"
    ? CORE_FEATURES
    : CORE_FEATURES.filter(f => f.category === selectedCategory);

  // Run mock AI waste scanner demo
  const handleRunScanDemo = (type: "bottle" | "ewaste" | "organic" | "cardboard") => {
    audioEngine.playTick();
    setScanSample(type);
    setIsScanning(true);
    setScanResult(null);

    setTimeout(() => {
      audioEngine.playSuccessChime();
      setIsScanning(false);
      const dataMap = {
        bottle: {
          title: "PET Plastic Water Bottle",
          category: "Recyclable Plastic (Type 1 PET)",
          confidence: "99.4%",
          binColor: "Blue Recycling Bin 🟦",
          ecoPoints: "+25 EcoPoints",
          co2Saved: "0.18 kg CO2",
          instructions: "Rinse bottle, crush body to save space, remove cap if non-recyclable."
        },
        ewaste: {
          title: "Discarded Smartphone Lithium Battery",
          category: "Hazardous E-Waste",
          confidence: "97.8%",
          binColor: "Special Red E-Waste Kiosk 🟥",
          ecoPoints: "+100 EcoPoints",
          co2Saved: "1.45 kg CO2",
          instructions: "Do not incinerate or place in general trash. Schedule Recycle Connect doorstep pickup."
        },
        organic: {
          title: "Fruit Peels & Vegetable Scrap",
          category: "Organic Compostable Waste",
          confidence: "98.9%",
          binColor: "Green Organic Bin 🟩",
          ecoPoints: "+15 EcoPoints",
          co2Saved: "0.42 kg CO2",
          instructions: "Ideal for home composting or municipal organic biogas collection."
        },
        cardboard: {
          title: "Corrugated Shipping Box",
          category: "Paper & Cardboard",
          confidence: "99.1%",
          binColor: "Blue Paper Bin 🟦",
          ecoPoints: "+30 EcoPoints",
          co2Saved: "0.65 kg CO2",
          instructions: "Flatten box completely and remove any plastic adhesive tape."
        }
      };
      setScanResult(dataMap[type]);
    }, 1200);
  };

  useEffect(() => {
    handleRunScanDemo("bottle");
  }, []);

  // Handle AI Advice Prompt
  const handleGenerateAiAdvice = () => {
    audioEngine.playTick();
    setAiAdviceReply(null);
    setTimeout(() => {
      audioEngine.playSuccessChime();
      setAiAdviceReply(
        `🌱 Custom Action Plan for: "${aiHabitQuery}"\n\n1. Replace disposable coffee cups with double-walled stainless steel flasks (+40 EcoPoints/week).\n2. Install a filtered water station instead of ordering plastic 20L carboys.\n3. Implement a central digital invoice system to save ~12kg paper monthly.`
      );
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#050811] text-gray-100 font-sans selection:bg-emerald-500 selection:text-gray-950">
      
      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#050811]/90 backdrop-blur-xl border-b border-white/10 px-4 md:px-8 py-4 flex items-center justify-between max-w-[1440px] mx-auto">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 flex items-center justify-center text-gray-950 font-black text-xl shadow-lg shadow-emerald-500/20">
            🌱
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              EcoVerzz <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono">AI v2.5</span>
            </span>
            <span className="text-[10px] text-gray-400 font-mono block -mt-1">Sustainability Ecosystem</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-xs font-mono font-medium text-gray-300">
          <a href="#features" className="hover:text-emerald-400 transition-colors">16 Core Features</a>
          <a href="#demo" className="hover:text-emerald-400 transition-colors">Interactive AI Demo</a>
          <a href="#impact" className="hover:text-emerald-400 transition-colors">SDG Impact</a>
          <a href="#one-liner" className="hover:text-emerald-400 transition-colors">Executive Summary</a>
        </nav>

        {/* Action CTA Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => { audioEngine.playSuccessChime(); onLaunchApp("home"); }}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-gray-950 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            <Zap className="w-4 h-4" /> Launch App / Dashboard
          </button>
        </div>
      </header>

      {/* 2. HERO BANNER SECTION */}
      <section className="relative pt-12 pb-20 px-4 md:px-8 max-w-[1440px] mx-auto overflow-hidden">
        {/* Glow ambient spots */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Column: Headline */}
          <div className="lg:col-span-7 text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
              <span>Next-Gen AI Sustainability & Circular Economy Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Empowering Citizens & Businesses for a <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Cleaner Planet</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-300 font-light leading-relaxed max-w-2xl">
              EcoVerzz AI is a unified ecosystem integrating computer vision waste segregation, surplus food rescue, circular marketplace, civic environmental reporting, and reward-driven community action.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#features"
                onClick={() => audioEngine.playTick()}
                className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black rounded-2xl text-xs uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer shadow-xl shadow-emerald-500/20"
              >
                Explore All 16 Features <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#demo"
                onClick={() => audioEngine.playTick()}
                className="px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold rounded-2xl text-xs uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 text-emerald-400 fill-current" /> Try Live Interactive Demos
              </a>
            </div>

            {/* Quick Metrics Header Bar */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 font-mono text-xs">
              <div>
                <span className="text-gray-400 text-[10px] uppercase block">Core Features</span>
                <span className="text-2xl font-black text-emerald-400">16 Modules</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase block">AI Accuracy</span>
                <span className="text-2xl font-black text-teal-300">99.2%</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase block">SDGs Supported</span>
                <span className="text-2xl font-black text-cyan-400">7 Goals</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Earth Globe Visualizer Card */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="w-full max-w-md bg-gradient-to-b from-[#0b1222] to-[#080d1a] border border-emerald-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Live Biosphere Visualizer
                </span>
                <span className="text-[10px] font-mono text-gray-400">3D Interactive</span>
              </div>

              <div className="w-full h-72 rounded-2xl relative overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center">
                <EarthVisualizer scene="healing" healingStage={5} zoomLevel="normal" />
              </div>

              <div className="mt-4 p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex justify-between items-center font-mono text-xs">
                <div>
                  <span className="text-gray-400 text-[9px] block">ECOSYSTEM HEALED</span>
                  <span className="text-emerald-400 font-bold text-sm">100% Planetary Balance</span>
                </div>
                <button
                  onClick={() => { audioEngine.playSuccessChime(); onLaunchApp("home"); }}
                  className="px-3.5 py-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-[10px] font-bold uppercase hover:bg-emerald-500/30 transition-all cursor-pointer"
                >
                  Enter Platform
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. EXECUTIVE ONE-LINER BANNER */}
      <section id="one-liner" className="py-12 px-4 md:px-8 bg-gradient-to-r from-[#0a1426] via-[#0b1b2d] to-[#081524] border-y border-emerald-500/20">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <span className="px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs uppercase tracking-widest inline-block">
            🌟 EcoVerzz in One Line
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-relaxed max-w-4xl mx-auto font-sans">
            "EcoVerzz AI is an AI-powered sustainability ecosystem that empowers citizens, businesses, NGOs, recyclers, and governments to collaborate through smart waste management, circular economy, community engagement, environmental reporting, and reward-driven sustainable actions."
          </h2>
        </div>
      </section>

      {/* 4. ALL 16 CORE FEATURES INTERACTIVE SHOWCASE */}
      <section id="features" className="py-20 px-4 md:px-8 max-w-[1440px] mx-auto text-left">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div>
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-2">
              COMPREHENSIVE ECOSYSTEM SUITE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              16 Core AI & Sustainability Features
            </h2>
            <p className="text-sm text-gray-400 mt-2 max-w-xl font-light">
              Explore all 16 modules. Click any feature card to view its live hands-on demo or launch directly into the active dashboard!
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl font-mono text-xs">
            {[
              { id: "all", label: "All 16 Features" },
              { id: "ai_waste", label: "AI & Waste Guide" },
              { id: "circular_food", label: "Circular & Food" },
              { id: "community_social", label: "Community & Social" },
              { id: "business_impact", label: "Enterprise & Impact" }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => { audioEngine.playTick(); setSelectedCategory(cat.id); }}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-emerald-500 text-gray-950 font-black shadow-md"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFeatures.map((feat) => {
            const IconComponent = feat.icon;
            const isSelected = activeDemoFeature?.id === feat.id;

            return (
              <motion.div
                key={feat.id}
                whileHover={{ y: -6 }}
                onClick={() => { audioEngine.playTick(); setActiveDemoFeature(feat); }}
                className={`bg-gradient-to-b from-[#090e1a] to-[#070b14] border rounded-3xl p-6 shadow-xl flex flex-col justify-between cursor-pointer transition-all duration-300 relative group overflow-hidden ${
                  isSelected 
                    ? "border-emerald-400/80 shadow-[0_0_30px_rgba(16,185,129,0.25)]" 
                    : "border-white/10 hover:border-emerald-500/40"
                }`}
              >
                {/* Number Badge */}
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3.5 rounded-2xl bg-gradient-to-tr ${feat.gradient} text-gray-950 font-black shadow-lg`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="font-mono font-black text-2xl text-white/20 group-hover:text-emerald-400/60 transition-colors">
                    #{feat.num.toString().padStart(2, "0")}
                  </span>
                </div>

                {/* Content */}
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block font-bold mb-1">
                    "{feat.tagline}"
                  </span>
                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                    {feat.name}
                  </h3>
                  <p className="text-xs text-gray-400 font-light leading-relaxed mb-4">
                    {feat.shortDesc}
                  </p>
                </div>

                {/* Footer Badges & Direct Launch to Dashboard Action */}
                <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
                  <div className="flex justify-between items-center font-mono text-[10px]">
                    <span className="text-gray-500 truncate max-w-[140px]">{feat.sdgs[0]}</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Inspect Demo <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      audioEngine.playSuccessChime();
                      onLaunchApp(feat.targetDashboardView);
                    }}
                    className="w-full py-2 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer mt-1"
                  >
                    <span>Open in Dashboard</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 5. INTERACTIVE LIVE FEATURE DEMO SECTION (Real-Time Experience for ALL 16 Features) */}
      <section id="demo" className="py-16 px-4 md:px-8 max-w-[1440px] mx-auto text-left">
        <div className="bg-gradient-to-b from-[#0a1222] to-[#070c17] border border-emerald-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 pb-6 border-b border-white/10">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-1">
                REAL-TIME HANDS-ON EXPERIENCE FOR ALL 16 FEATURES
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                Live Module Simulator: {activeDemoFeature?.name || "EcoScan"}
              </h2>
            </div>

            {/* Feature selector dropdown */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  audioEngine.playSuccessChime();
                  if (activeDemoFeature) onLaunchApp(activeDemoFeature.targetDashboardView);
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-gray-950 font-black text-xs uppercase tracking-wider rounded-2xl flex items-center gap-2 shadow-lg hover:from-emerald-400 hover:to-teal-300 cursor-pointer"
              >
                <span>Open in Dashboard</span> <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <select
                value={activeDemoFeature?.id}
                onChange={(e) => {
                  const found = CORE_FEATURES.find(f => f.id === e.target.value);
                  if (found) {
                    audioEngine.playTick();
                    setActiveDemoFeature(found);
                  }
                }}
                className="bg-black/70 border border-emerald-500/40 text-emerald-300 text-xs rounded-2xl px-4 py-2.5 font-mono outline-none focus:border-emerald-400 cursor-pointer"
              >
                {CORE_FEATURES.map(f => (
                  <option key={f.id} value={f.id} className="bg-gray-900 text-white">
                    #{f.num}. {f.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Interactive Feature Demo Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Technical Description & SDGS */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div>
                <span className="text-xs font-mono text-emerald-400 block font-bold mb-1">TAGLINE</span>
                <p className="text-lg font-black text-white italic">"{activeDemoFeature?.tagline}"</p>
              </div>

              <div>
                <span className="text-xs font-mono text-gray-400 block font-bold mb-1 uppercase">Full Module Description</span>
                <p className="text-xs text-gray-300 font-light leading-relaxed">
                  {activeDemoFeature?.fullDesc}
                </p>
              </div>

              <div>
                <span className="text-xs font-mono text-gray-400 block font-bold mb-2 uppercase">Key Capability Highlights</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
                  {activeDemoFeature?.keyHighlights.map((hl, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-gray-200 flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-[11px]">{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-mono text-gray-400 block font-bold mb-2 uppercase">UN Sustainable Development Goals (SDGs)</span>
                <div className="flex flex-wrap gap-2">
                  {activeDemoFeature?.sdgs.map((sdg, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] font-bold">
                      🌱 {sdg}
                    </span>
                  ))}
                </div>
              </div>

              {/* Direct Link to Dashboard Details */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    audioEngine.playSuccessChime();
                    if (activeDemoFeature) onLaunchApp(activeDemoFeature.targetDashboardView);
                  }}
                  className="w-full py-3 bg-white/5 hover:bg-white/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-emerald-400" />
                  <span>Navigate to {activeDemoFeature?.name} in Dashboard</span>
                </button>
              </div>
            </div>

            {/* Right Column: Real-Time Interactive Simulator Console */}
            <div className="lg:col-span-7 bg-black/60 border border-white/10 rounded-2xl p-6 text-left">
              
              {/* 1. ECOSCAN AI SIMULATOR */}
              {activeDemoFeature?.id === "ecoscan" && (
                <div className="space-y-5">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                      <Camera className="w-4 h-4 text-emerald-400" /> AI Vision Waste Classifier Demo
                    </h4>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      YOLOv8 Active Model
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { type: "bottle", label: "Plastic Bottle 🍾" },
                      { type: "ewaste", label: "Lithium Battery 🔋" },
                      { type: "organic", label: "Fruit Peels 🍎" },
                      { type: "cardboard", label: "Cardboard Box 📦" }
                    ].map(item => (
                      <button
                        key={item.type}
                        onClick={() => handleRunScanDemo(item.type as any)}
                        className={`p-2.5 rounded-xl border text-xs font-mono font-medium transition-all cursor-pointer ${
                          scanSample === item.type
                            ? "bg-emerald-500 text-gray-950 border-emerald-400 font-bold"
                            : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <div className="p-4 rounded-2xl bg-[#090f1d] border border-emerald-500/30 font-mono text-xs space-y-3">
                    {isScanning ? (
                      <div className="py-8 text-center space-y-3">
                        <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                        <p className="text-xs text-gray-400">Analyzing waste image tensor matrix...</p>
                      </div>
                    ) : scanResult ? (
                      <>
                        <div className="flex justify-between items-start border-b border-white/10 pb-3">
                          <div>
                            <span className="text-[10px] text-gray-400 block uppercase">Detected Item</span>
                            <h5 className="text-sm font-bold text-white">{scanResult.title}</h5>
                          </div>
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                            Confidence: {scanResult.confidence}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                            <span className="text-[9px] text-gray-400 uppercase block">Recommended Disposal</span>
                            <span className="text-emerald-300 font-bold block mt-0.5">{scanResult.binColor}</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                            <span className="text-[9px] text-gray-400 uppercase block">Reward & Offset</span>
                            <span className="text-teal-300 font-bold block mt-0.5">{scanResult.ecoPoints} • {scanResult.co2Saved}</span>
                          </div>
                        </div>

                        <p className="text-[11px] text-gray-400 font-sans italic border-t border-white/5 pt-2">
                          💡 Note: {scanResult.instructions}
                        </p>
                      </>
                    ) : null}
                  </div>
                </div>
              )}

              {/* 2. ECOPULSE SIMULATOR */}
              {activeDemoFeature?.id === "ecopulse" && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Zap className="w-4 h-4 text-cyan-400" /> Government Schemes & Sustainability Intelligence
                    </h4>
                    <span className="text-[10px] text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                      Live Feed
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { title: "National Rooftop Solar Subsidy 2026", desc: "Up to 40% subsidy for residential solar installations.", tag: "Govt Scheme" },
                      { title: "Urban Wet Waste Micro-Composting Policy", desc: "Mandatory segregated collection for apartment complexes.", tag: "Policy" },
                      { title: "Single-Use Plastic Ban Enforcement", desc: "Stricter penalties for non-biodegradable packaging.", tag: "Law" }
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-[#090f1d] border border-white/10 hover:border-cyan-500/30 transition-all">
                        <div className="flex justify-between items-start">
                          <h5 className="font-bold text-white text-xs font-sans">{item.title}</h5>
                          <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 text-[9px] font-bold rounded-md">{item.tag}</span>
                        </div>
                        <p className="text-[11px] text-gray-400 font-sans mt-1">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. ECO MISSIONS SIMULATOR */}
              {activeDemoFeature?.id === "ecomissions" && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Target className="w-4 h-4 text-amber-400" /> Active Daily & Weekly Challenges
                    </h4>
                    <span className="text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                      Gamified Tasks
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { id: "m1", title: "Scan 3 Recyclable Items Today", reward: "+50 EcoPoints", progress: "2/3 completed" },
                      { id: "m2", title: "Rescue 1 Surplus Meal or Donate Food", reward: "+100 EcoPoints", progress: "0/1 completed" },
                      { id: "m3", title: "Participate in Local Plastic Sweep", reward: "+150 EcoPoints", progress: "1/1 ready" }
                    ].map((m) => {
                      const isDone = completedMissions.includes(m.id);
                      return (
                        <div key={m.id} className="p-3 rounded-2xl bg-[#090f1d] border border-white/10 flex items-center justify-between">
                          <div>
                            <h5 className="font-bold text-white font-sans text-xs">{m.title}</h5>
                            <span className="text-[10px] text-amber-400 block font-bold mt-0.5">{m.reward} • {m.progress}</span>
                          </div>
                          <button
                            onClick={() => {
                              audioEngine.playSuccessChime();
                              if (!isDone) setCompletedMissions(prev => [...prev, m.id]);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all cursor-pointer ${
                              isDone ? "bg-emerald-500 text-gray-950" : "bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30"
                            }`}
                          >
                            {isDone ? "Claimed ✓" : "Complete Mission"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. ENVIRONMENTAL IMPACT DASHBOARD SIMULATOR */}
              {activeDemoFeature?.id === "impact_dashboard" && (
                <div className="space-y-5 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <BarChart2 className="w-4 h-4 text-emerald-400" /> Interactive Environmental Offset Matrix
                    </h4>
                    <span className="text-[10px] text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      Live Calculator
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-gray-400">Select Waste Diverted from Landfill:</span>
                      <span className="text-emerald-400 font-bold">{wasteAmountKg} kg Waste</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={500}
                      step={5}
                      value={wasteAmountKg}
                      onChange={(e) => { audioEngine.playTick(); setWasteAmountKg(Number(e.target.value)); }}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                      <span className="text-[9px] text-gray-400 block uppercase">CO2 Diverted</span>
                      <span className="text-base font-black text-emerald-400">{(wasteAmountKg * 2.8).toFixed(1)} kg</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/30">
                      <span className="text-[9px] text-gray-400 block uppercase">Trees Saved</span>
                      <span className="text-base font-black text-teal-300">{(wasteAmountKg * 0.12).toFixed(1)} trees</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30">
                      <span className="text-[9px] text-gray-400 block uppercase">Water Conserved</span>
                      <span className="text-base font-black text-cyan-300">{(wasteAmountKg * 14.5).toFixed(0)} L</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. CIRCULAR MARKETPLACE SIMULATOR */}
              {activeDemoFeature?.id === "circular_marketplace" && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-purple-400" /> Circular Marketplace Live Listings
                    </h4>
                    <span className="text-[10px] text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
                      Zero-Waste Trade
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { title: "Upcycled Denim Tote Bag", points: "120 EcoPoints", seller: "Elena G.", icon: "🎒" },
                      { title: "Refurbished Solar Powerbank", points: "350 EcoPoints", seller: "Dave K.", icon: "🔋" },
                      { title: "Organic Vermicompost Kit 5kg", points: "90 EcoPoints", seller: "GreenRoots NGO", icon: "🌱" },
                      { title: "Stainless Steel Water Flask", points: "80 EcoPoints", seller: "Sarah M.", icon: "🥤" }
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-[#0a0f1e] border border-white/10 space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="text-2xl">{item.icon}</span>
                          <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                            {item.points}
                          </span>
                        </div>
                        <h5 className="font-bold text-white text-xs font-sans">{item.title}</h5>
                        <div className="flex justify-between items-center text-[10px] text-gray-400 pt-1 border-t border-white/5">
                          <span>Listed by {item.seller}</span>
                          <button onClick={() => audioEngine.playSuccessChime()} className="text-emerald-400 font-bold hover:underline cursor-pointer">Acquire</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. FOOD RESCUE NETWORK SIMULATOR */}
              {activeDemoFeature?.id === "food_rescue" && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Heart className="w-4 h-4 text-rose-400" /> Active Surplus Food Rescues
                    </h4>
                    <span className="text-[10px] text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                      Live NGO Dispatch
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { donor: "Bistro Green Hotel", item: "15 Vegan Meals Box", expiry: "Expiry: 2h remaining", dist: "0.8 km nearby" },
                      { donor: "Fresh Supermarket", item: "20kg Organic Bakery Bread", expiry: "Expiry: 4h remaining", dist: "1.4 km nearby" }
                    ].map((food, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-[#0a0f1e] border border-rose-500/20 flex items-center justify-between">
                        <div>
                          <h5 className="font-bold text-white font-sans text-xs">{food.item}</h5>
                          <span className="text-[10px] text-gray-400 block">{food.donor} • {food.dist}</span>
                          <span className="text-[9px] text-rose-400 block font-bold">{food.expiry}</span>
                        </div>
                        <button onClick={() => audioEngine.playSuccessChime()} className="px-3 py-1.5 bg-rose-500/20 border border-rose-500/40 text-rose-300 rounded-xl text-[10px] font-bold hover:bg-rose-500/30 cursor-pointer">
                          Dispatch Rescue
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 7. COMMUNITY CLEANUP SIMULATOR */}
              {activeDemoFeature?.id === "community_cleanup" && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-teal-400" /> Upcoming Local Cleanup Drives
                    </h4>
                    <span className="text-[10px] text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded-md border border-teal-500/20">
                      Community Drives
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { title: "North Creek Plastic Sweep", coords: "12.97° N, 77.59° E", volunteers: "28 joined", date: "Saturday, 9:00 AM" },
                      { title: "Urban Park Sapling Plantation", coords: "12.92° N, 77.62° E", volunteers: "45 joined", date: "Sunday, 7:30 AM" }
                    ].map((event, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-[#0a0f1e] border border-teal-500/20 flex items-center justify-between">
                        <div>
                          <h5 className="font-bold text-white font-sans text-xs">{event.title}</h5>
                          <span className="text-[10px] text-gray-400 block">{event.coords} • {event.date}</span>
                          <span className="text-[9px] text-teal-400 block font-bold">{event.volunteers}</span>
                        </div>
                        <button onClick={() => audioEngine.playSuccessChime()} className="px-3.5 py-1.5 bg-teal-500/20 border border-teal-500/40 text-teal-300 rounded-xl text-[10px] font-bold hover:bg-teal-500/30 cursor-pointer">
                          RSVP & Join
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 8. BUSINESS & CSR PORTAL SIMULATOR */}
              {activeDemoFeature?.id === "business_csr" && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-400" /> Enterprise ESG Impact Calculator
                    </h4>
                    <span className="text-[10px] text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                      CSR Metric Engine
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Company Employee Workforce:</span>
                      <span className="text-blue-400 font-bold">{employeeCount} Employees</span>
                    </div>
                    <input
                      type="range"
                      min={50}
                      max={2000}
                      step={25}
                      value={employeeCount}
                      onChange={(e) => { audioEngine.playTick(); setEmployeeCount(Number(e.target.value)); }}
                      className="w-full accent-blue-500 cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/30">
                      <span className="text-[9px] text-gray-400 block uppercase">Est. Annual CO2 Reduced</span>
                      <span className="text-sm font-black text-blue-300">{(employeeCount * 140).toLocaleString()} kg</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30">
                      <span className="text-[9px] text-gray-400 block uppercase">Scope 3 ESG Score</span>
                      <span className="text-sm font-black text-indigo-300">AAA Verified</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 9. RECYCLE CONNECT SIMULATOR */}
              {activeDemoFeature?.id === "recycle_connect" && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-amber-400" /> Live Scrap Commodity Rates & Pickup
                    </h4>
                    <span className="text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                      Monetize Scrap
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { item: "PET Plastics", rate: "$0.40 / kg" },
                      { item: "Copper Wire", rate: "$6.50 / kg" },
                      { item: "E-Waste / PCB", rate: "$2.80 / kg" },
                      { item: "Cardboard", rate: "$0.15 / kg" }
                    ].map((row, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex justify-between">
                        <span className="text-gray-300">{row.item}</span>
                        <span className="text-amber-400 font-bold">{row.rate}</span>
                      </div>
                    ))}
                  </div>

                  <button onClick={() => audioEngine.playSuccessChime()} className="w-full py-2.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold rounded-xl text-xs uppercase hover:bg-amber-500/30 cursor-pointer">
                    Schedule Doorstep Scrap Pickup
                  </button>
                </div>
              )}

              {/* 10. USER PROFILE SIMULATOR */}
              {activeDemoFeature?.id === "user_profile" && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <User className="w-4 h-4 text-violet-400" /> Verified Green Identity Preview
                    </h4>
                    <span className="text-[10px] text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded-md border border-violet-500/20">
                      Digital Passport
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#090e1a] border border-violet-500/30 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-500 to-purple-400 text-gray-950 font-black text-lg flex items-center justify-center">
                      {profile?.username ? profile.username.substring(0, 2).toUpperCase() : "EV"}
                    </div>
                    <div>
                      <h5 className="font-bold text-white text-sm font-sans">{profile?.username || "Citizen Guardian"}</h5>
                      <span className="text-[10px] text-violet-300 block font-mono">Rank: Planetary Pioneer</span>
                      <span className="text-[9px] text-gray-400 block font-mono mt-0.5">Verified CO2 Offset: 2,840 kg</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 11. SMART NOTIFICATIONS SIMULATOR */}
              {activeDemoFeature?.id === "smart_notifications" && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Bell className="w-4 h-4 text-emerald-400" /> Real-time Notification Engine
                    </h4>
                    <span className="text-[10px] text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      Geo-Fenced Alerts
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                      🔔 Recycler Pickup Partner is 5 minutes away from your coordinates!
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-gray-300">
                      🍱 Food Rescue Alert: Bistro Green posted 15 surplus meals nearby.
                    </div>
                  </div>
                </div>
              )}

              {/* 12. LOCATION SERVICES SIMULATOR */}
              {activeDemoFeature?.id === "location_services" && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-400" /> GIS Spatial Map & Drop-Off Finder
                    </h4>
                    <span className="text-[10px] text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                      GPS Enabled
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#090f1d] border border-white/10 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-white">Central E-Waste Recycling Kiosk</span>
                      <span className="text-emerald-400 font-bold">0.4 km away</span>
                    </div>
                    <span className="text-[10px] text-gray-400 block font-sans">Open now • Accepts Lithium batteries, circuit boards, small appliances</span>
                  </div>
                </div>
              )}

              {/* 13. REWARDS & RECOGNITION SIMULATOR */}
              {activeDemoFeature?.id === "rewards_recognition" && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-400" /> Rewards & Badge Shelf
                    </h4>
                    <span className="text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                      Perks Engine
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300">
                      🥇 Gold Seedling Badge
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                      🌳 10 Trees Certificate
                    </div>
                    <div className="p-3 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                      🚌 Metro Pass 20% Off
                    </div>
                  </div>
                </div>
              )}

              {/* 14. AI INSIGHTS SIMULATOR */}
              {activeDemoFeature?.id === "ai_insights" && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-indigo-400" /> Personal AI Eco-Advisor
                    </h4>
                    <span className="text-[10px] text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                      LLM Advisor
                    </span>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      value={aiHabitQuery}
                      onChange={(e) => setAiHabitQuery(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={handleGenerateAiAdvice}
                      className="w-full py-2 bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-bold rounded-xl text-xs uppercase hover:bg-indigo-500/30 cursor-pointer"
                    >
                      Generate AI Sustainability Plan
                    </button>
                  </div>

                  {aiAdviceReply && (
                    <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-gray-200 text-xs font-sans whitespace-pre-line">
                      {aiAdviceReply}
                    </div>
                  )}
                </div>
              )}

              {/* 15. ECOLINK SOCIAL SIMULATOR */}
              {activeDemoFeature?.id === "ecolink_social" && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Globe className="w-4 h-4 text-teal-400" /> EcoLink Community Story Feed
                    </h4>
                    <span className="text-[10px] text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded-md border border-teal-500/20">
                      Social Network
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#090f1d] border border-white/10 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-white">Elena G. • 2h ago</span>
                      <span className="text-emerald-400 font-bold">♥ 42 Upvotes</span>
                    </div>
                    <p className="text-xs text-gray-300 font-sans">"We cleared 12kg of microplastics from the local creek bed today!"</p>
                  </div>
                </div>
              )}

              {/* 16. ECOREPORT SIMULATOR */}
              {activeDemoFeature?.id === "ecoreport" && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400" /> Civic Environmental Issue Reporter
                    </h4>
                    <span className="text-[10px] text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                      Authority Ticket
                    </span>
                  </div>

                  <div className="space-y-2">
                    <select
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    >
                      <option value="Illegal Dumping">Illegal Trash Dumping 🚯</option>
                      <option value="Water Leakage">Clean Water Pipe Burst 💧</option>
                      <option value="Tree Cutting">Unauthorized Tree Felling 🌳</option>
                    </select>

                    <button
                      onClick={() => {
                        audioEngine.playSuccessChime();
                        setReportSubmitted(true);
                      }}
                      className="w-full py-2.5 bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold rounded-xl text-xs uppercase hover:bg-rose-500/30 cursor-pointer"
                    >
                      Submit Verified GPS Environmental Ticket
                    </button>
                  </div>

                  {reportSubmitted && (
                    <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                      ✅ Ticket #EV-REP-902 dispatched to Municipal Pollution Authority. GPS: 12.97° N, 77.59° E.
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>
        </div>
      </section>

      {/* 6. SDG IMPACT MATRIX */}
      <section id="impact" className="py-16 px-4 md:px-8 max-w-[1440px] mx-auto text-left">
        <div className="mb-10">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-2">
            GLOBAL SUSTAINABILITY GOALS
          </span>
          <h2 className="text-3xl font-black text-white">Direct UN SDG Alignment</h2>
          <p className="text-xs text-gray-400 mt-1 max-w-xl font-light">
            EcoVerzz AI directly measures and reports environmental actions mapped to official United Nations Sustainable Development Goals.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 font-mono text-xs">
          {[
            { num: "SDG 2", title: "Zero Hunger", desc: "Food Surplus Rescue Network", color: "bg-amber-500/15 border-amber-500/30 text-amber-400" },
            { num: "SDG 11", title: "Sustainable Cities", desc: "Community Cleanup & EcoReport", color: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" },
            { num: "SDG 12", title: "Responsible Consumption", desc: "EcoScan AI & Circular Market", color: "bg-cyan-500/15 border-cyan-500/30 text-cyan-400" },
            { num: "SDG 13", title: "Climate Action", desc: "CO2 Diversion Ledger Analytics", color: "bg-teal-500/15 border-teal-500/30 text-teal-400" },
            { num: "SDG 14", title: "Life Below Water", desc: "Coast & Creek Plastic Sweeps", color: "bg-blue-500/15 border-blue-500/30 text-blue-400" },
            { num: "SDG 17", title: "Partnerships", desc: "Business & CSR EcoLink Hub", color: "bg-purple-500/15 border-purple-500/30 text-purple-400" }
          ].map((sdg, idx) => (
            <div key={idx} className={`p-4 rounded-2xl border ${sdg.color} text-left space-y-2`}>
              <span className="font-black text-sm block">{sdg.num}</span>
              <h5 className="font-bold text-white font-sans text-xs">{sdg.title}</h5>
              <p className="text-[10px] text-gray-400 font-light leading-snug">{sdg.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="py-12 px-4 md:px-8 border-t border-white/10 bg-[#03050c] text-left">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-6 font-mono text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-gray-950 font-black flex items-center justify-center text-base">🌱</div>
            <div>
              <span className="text-white font-bold block">EcoVerzz AI Ecosystem</span>
              <span className="text-[10px]">AI-Powered Sustainability for Citizens, Enterprises & Governments</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => onLaunchApp("home")} className="text-emerald-400 hover:underline font-bold cursor-pointer">Launch Platform</button>
            <a href="#features" className="hover:text-gray-300">16 Features List</a>
            <a href="#demo" className="hover:text-gray-300">AI Demos</a>
          </div>
        </div>
      </footer>

    </div>
  );
};
