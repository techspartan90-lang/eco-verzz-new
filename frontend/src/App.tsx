import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SceneType, UserProfile } from "./types";
import AmbientBackground from "./components/AmbientBackground";
import EarthVisualizer from "./components/EarthVisualizer";
import AuthScreen from "./components/AuthScreen";
import { Dashboard } from "./components/Dashboard";
import { audioEngine } from "./components/AudioEngine";
import { api } from "./services/api";
import { 
  Volume2, VolumeX, ArrowRight, Leaf, Sparkles, 
  Shield, LogOut, CheckCircle, Heart
} from "lucide-react";

const ONBOARDING_STAGES = [
  {
    title: "The Earth Needs Us More Than Ever",
    description: "Climate change, rising pollution, and dwindling forests are altering our planet. The future is not decided tomorrow—it is actively shaped by the choices we make today.",
    pillarIcon: "🌍",
    pillarLabel: "1️⃣ Learn 🌱 (Awareness)",
    progressText: "0% Healed"
  },
  {
    title: "Every Great Change Begins with Awareness",
    description: "True transformation begins when we understand our ecological footprint. Learning about nature and protecting our resources creates the first step toward a sustainable future.",
    pillarIcon: "🌱",
    pillarLabel: "2️⃣ Act ♻️ (Sustainable Actions)",
    progressText: "25% Healed"
  },
  {
    title: "Every Small Action Creates Big Impact",
    description: "Recycling waste, rescuing surplus food, making conscious choices, and safeguarding habitats may feel simple, but together they restore our vital ecosystems.",
    pillarIcon: "🌳",
    pillarLabel: "3️⃣ Connect 🤝 (Communities Working Together)",
    progressText: "50% Healed"
  },
  {
    title: "Together We Can Transform Our World",
    description: "Real change happens when vibrant communities unite. Volunteers, students, and pioneers hold the collective power to inspire others and construct healthier, cleaner cities.",
    pillarIcon: "🤝",
    pillarLabel: "4️⃣ Inspire 🌍 (Motivating Others)",
    progressText: "75% Healed"
  },
  {
    title: "Welcome to EcoVerzz",
    description: "EcoVerzz transforms environmental awareness into real-world action. Every local challenge you complete and sustainable habit you form helps build a blooming, resilient planet.",
    pillarIcon: "✨",
    pillarLabel: "5️⃣ Transform ✨ (A Healthy Planet)",
    progressText: "100% Healed"
  }
];

export default function App() {
  const [scene, setScene] = useState<SceneType>("healing");
  const [healingStage, setHealingStage] = useState(0); // 0 to 5
  const [celebrationStep, setCelebrationStep] = useState(0); // 0: healing, 1: You chose to protect..., 2: Welcome to EcoVerzz
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [zoom, setZoom] = useState<"far" | "normal" | "close" | "hyper">("far");

  // Load existing profile from localStorage on boot
  useEffect(() => {
    const saved = localStorage.getItem("ecoverzz_profile");
    if (saved) {
      try {
        const parsed: UserProfile = JSON.parse(saved);
        setProfile(parsed);
        setScene("dashboard"); // Skip directly to our premium immersive dashboard!
      } catch (e) {
        console.warn("Could not load saved profile", e);
      }
    }
  }, []);

  // Control Earth visual zoom level based on active scene stage
  useEffect(() => {
    switch (scene) {
      case "healing":
        setZoom(healingStage >= 4 ? "normal" : "far");
        break;
      case "auth":
      case "dashboard_coming_soon":
      case "dashboard":
        setZoom("far");
        break;
    }
  }, [scene, healingStage]);

  // Handle first global touch/click to safely resume Web Audio API contexts (browser autoplay bypass)
  const handleGlobalInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      audioEngine.start();
    }
  };

  // Toggle Mute Audio
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
  };

  // Trigger Earth Healing Tap
  const handleEarthTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleGlobalInteraction();
    
    if (scene !== "healing") return;
    if (healingStage < 5) {
      audioEngine.playTick();
      const nextStage = healingStage + 1;
      setHealingStage(nextStage);
      
      if (nextStage === 5) {
        setTimeout(() => {
          audioEngine.playSuccessChime();
          setCelebrationStep(1); // Go to "You didn't just heal..."
        }, 1200);
      }
    }
  };

  // Handle logout/reset
  const handleLogout = () => {
    api.logout();
    setProfile(null);
    setHealingStage(0);
    setCelebrationStep(0);
    setScene("healing");
    setHasInteracted(false);
    audioEngine.stop();
  };

  return (
    <div 
      id="app-root-container"
      onClick={handleGlobalInteraction}
      className="relative w-full min-h-screen bg-[#0a0a0b] text-gray-100 flex flex-col justify-between overflow-x-hidden font-sans select-none"
    >
      {/* Ambient background particles (leaves, fireflies, auroras) */}
      <AmbientBackground 
        intensity={scene === "healing" && healingStage > 0 ? "blooming" : "normal"} 
      />

      {/* Floating Minimal HUD: Sound control & Skip button */}
      <header className="relative w-full max-w-7xl mx-auto px-6 py-5 flex justify-between items-center z-50 pointer-events-auto">
        <div className="flex items-center gap-2">
          {/* Audio Synthesizer Controls */}
          <button
            onClick={toggleMute}
            className="p-2.5 rounded-full bg-glass hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200 cursor-pointer flex items-center justify-center border border-white/5 shadow-md"
            title={isMuted ? "Unmute Ambient Synthesizer" : "Mute Ambient Synthesizer"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          
          <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold hidden sm:inline-block">
            {isMuted ? "Synthesizer Off" : "Ambient Forest active"}
          </span>
        </div>

        {/* Brand identity */}
        <div className="flex items-center gap-1.5 bg-glass px-3.5 py-1.5 rounded-full border border-white/5 shadow-sm">
          <Leaf className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-xs font-black tracking-wide text-white font-sans uppercase">
            EcoVerzz
          </span>
        </div>

        {/* Minimal Skip Button for fast sandbox traversal */}
        {scene === "healing" && celebrationStep === 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleGlobalInteraction();
              setHealingStage(5);
              setCelebrationStep(2);
              setZoom("normal");
            }}
            className="text-[10px] uppercase tracking-[0.2em] text-white/30 hover:text-white/60 transition-colors font-semibold cursor-pointer"
          >
            Skip Journey
          </button>
        )}
      </header>

      {/* Main Core View Area */}
      <main className="relative flex-1 flex flex-col items-center justify-center py-6 z-40">
        <AnimatePresence mode="wait">
          
          {/* INTERACTIVE EARTH HEALING ONBOARDING EXPERIENCE */}
          {scene === "healing" && (
            <motion.div
              key="healing-onboarding"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-4xl px-6 flex flex-col items-center justify-between text-center relative min-h-[85vh] py-4"
            >
              {celebrationStep === 0 && (
                <div className="flex flex-col items-center justify-between w-full flex-1">
                  
                  {/* Upper Section (55% Height Approx): Hero Earth Globe */}
                  <div className="flex-1 flex items-center justify-center min-h-[38vh] md:min-h-[42vh] relative my-auto">
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleEarthTap}
                      className="relative cursor-pointer group p-6 rounded-full transition-all duration-300"
                      title="Tap the Earth to heal"
                    >
                      <div className="absolute inset-0 rounded-full bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-all duration-300 animate-ping" />
                      <EarthVisualizer scene="healing" healingStage={healingStage} zoomLevel={zoom} />
                    </motion.div>
                  </div>

                  {/* Spacer to guarantee visual breathing room */}
                  <div className="h-10 md:h-14" />

                  {/* Lower Section (30% Height Approx): Borderless text layout with delicate stagger animation */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={healingStage}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: { 
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.15
                          }
                        }
                      }}
                      className="flex flex-col items-center justify-center w-full mt-2"
                    >
                      <div className="w-full max-w-[450px] mx-auto px-4 flex flex-col items-center">
                        {/* Emblem / Icon */}
                        <motion.div 
                          variants={{
                            hidden: { opacity: 0, scale: 0.8 },
                            visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
                          }}
                          className="text-4xl mb-4 select-none"
                        >
                          {ONBOARDING_STAGES[healingStage]?.pillarIcon}
                        </motion.div>

                        {/* Title: 32px, Bold, White, Centered */}
                        <motion.h2
                          variants={{
                            hidden: { opacity: 0, y: 15 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay: 0.2 } }
                          }}
                          className="text-[28px] sm:text-[32px] font-bold text-white tracking-tight leading-tight text-center"
                        >
                          {ONBOARDING_STAGES[healingStage]?.title}
                        </motion.h2>

                        {/* Description: 18px, Regular, Soft Gray (#D8D8D8), Line Height 1.7, Letter Spacing 0.3px, Centered */}
                        <motion.p
                          variants={{
                            hidden: { opacity: 0, y: 15 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut", delay: 0.5 } }
                          }}
                          className="text-[16px] sm:text-[18px] text-[#D8D8D8] font-normal leading-[1.7] tracking-[0.3px] text-center mt-4 max-w-[420px]"
                        >
                          {ONBOARDING_STAGES[healingStage]?.description}
                        </motion.p>

                        {/* Small Progress Dots Indicator */}
                        <motion.div
                          variants={{
                            hidden: { opacity: 0, y: 10 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut", delay: 0.6 } }
                          }}
                          className="flex gap-2.5 mt-6 justify-center items-center"
                        >
                          {[0, 1, 2, 3, 4].map((index) => (
                            <div
                              key={index}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                healingStage >= index 
                                  ? "bg-emerald-400 scale-125 shadow-[0_0_8px_rgba(52,211,153,1)]" 
                                  : "bg-white/10"
                              }`}
                            />
                          ))}
                        </motion.div>
                      </div>

                      {/* Bottom pulsing indicator pill near the bottom center */}
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, scale: 0.95 },
                          visible: { opacity: 1, scale: 1, transition: { duration: 0.6, delay: 0.8 } }
                        }}
                        className="mt-8 mb-4 flex justify-center items-center"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.03, 1], opacity: [0.85, 1, 0.85] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          className="inline-flex items-center gap-3 px-6 py-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs sm:text-[13px] font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(16,185,129,0.15)] cursor-pointer hover:bg-emerald-500/15 transition-all"
                          onClick={handleEarthTap}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>✨ Heal the Earth to Unlock the Next Chapter</span>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}

              {celebrationStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 1 }}
                  onClick={() => {
                    audioEngine.playTick();
                    setCelebrationStep(2);
                  }}
                  className="flex flex-col items-center justify-center cursor-pointer min-h-[60vh] w-full"
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
                    <div className="relative">
                      {/* Dynamic Atmosphere Ozone Halo - Highly Innovative Visual effect of fully healed planet */}
                      <div className="absolute -inset-10 rounded-full border border-emerald-400/25 animate-[spin_25s_linear_infinite] shadow-[0_0_50px_rgba(52,211,153,0.15)]">
                        <div className="absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
                        <div className="absolute -bottom-1 -right-1.5 w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_10px_#2dd4bf]" />
                      </div>
                      <EarthVisualizer scene="healing" healingStage={5} zoomLevel="far" />
                    </div>
                  </div>
 
                  <div className="relative z-10 p-6 max-w-md mx-auto text-center flex flex-col items-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                      className="w-14 h-14 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30 shadow-[0_0_20px_rgba(52,211,153,0.15)]"
                    >
                      <Sparkles className="w-7 h-7 text-emerald-400 animate-pulse" />
                    </motion.div>
 
                    <h1 className="text-3xl md:text-4xl font-light tracking-tight text-white mb-4 leading-tight">
                      You didn't just heal the Earth.<br/>
                      <span className="font-serif italic text-emerald-400 font-normal">You have chosen to protect its future.</span>
                    </h1>
                    
                    <p className="text-[#D8D8D8] text-[15px] sm:text-[16px] leading-[1.7] max-w-[380px] mx-auto opacity-95 mb-8">
                      Your dedication has restored the atmosphere, reseeded the ancient forests, and cleared the oceans. You are now a recognized guardian of our shared home.
                    </p>
                    
                    <p className="text-gray-400 text-xs uppercase tracking-[0.25em] font-bold mt-4 animate-pulse">
                      Tap anywhere to continue
                    </p>
                  </div>
                </motion.div>
              )}
 
              {celebrationStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ type: "spring", stiffness: 60, damping: 15 }}
                  className="flex flex-col items-center text-center max-w-md mx-auto px-6 py-4"
                >
                  <div className="mb-8 relative flex items-center justify-center">
                    {/* Rotating Atmosphere Ozone Halo around Earth */}
                    <div className="absolute -inset-6 rounded-full border border-emerald-400/20 animate-[spin_30s_linear_infinite] pointer-events-none shadow-[0_0_50px_rgba(52,211,153,0.12)]">
                      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
                      <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf]" />
                    </div>
                    <EarthVisualizer scene="healing" healingStage={5} zoomLevel="normal" />
                  </div>
 
                  <motion.div
                    initial={{ scale: 0.8, rotate: -10 }}
                    animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-14 h-14 mb-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-center shadow-lg"
                  >
                    <Leaf className="w-7 h-7 text-emerald-400 animate-pulse" />
                  </motion.div>
 
                  <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2 uppercase">
                    🌍 EcoVerzz
                  </h1>
                  
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-400/90 font-bold font-mono mb-6">
                    Transforming Awareness into Action
                  </p>
 
                  <p className="text-[#D8D8D8] text-[15px] sm:text-[16px] leading-[1.7] max-w-[380px] mx-auto opacity-95 mb-8">
                    Welcome to the global eco-ledger. Complete real-world environmental tasks, earn points, and build a flourishing, sustainable world together.
                  </p>
 
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      audioEngine.playTick();
                      setScene("auth");
                    }}
                    className="group relative px-12 py-4 bg-white/5 backdrop-blur-2xl border border-white/20 rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xl hover:shadow-[0_0_50px_rgba(16,185,129,0.15)] animate-pulse"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    
                    <div className="flex items-center gap-2 relative z-10 text-white font-medium">
                      <span className="text-sm tracking-widest font-bold uppercase">Get Started</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
 
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-400/55 to-transparent" />
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* PREMIUM AUTHENTICATION SCREEN */}
          {scene === "auth" && (
            <motion.div
              key="auth-container"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full flex justify-center py-4"
            >
              <AuthScreen onSuccess={(newProfile) => {
                setProfile(newProfile);
                setScene("dashboard");
              }} />
            </motion.div>
          )}

          {/* TEMPORARY DASHBOARD COMING SOON SCREEN */}
          {scene === "dashboard_coming_soon" && (
            <motion.div
              key="dashboard-coming-soon"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ type: "spring", stiffness: 60, damping: 15 }}
              className="w-full max-w-md mx-auto px-6 py-4 flex flex-col items-center"
            >
              <div className="mb-6">
                <EarthVisualizer scene="healing" healingStage={5} zoomLevel="far" />
              </div>

              <div className="w-full bg-glass border border-white/10 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl flex flex-col items-center text-center">
                {/* Top decorative gradient accent */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500" />
                
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 mb-6 shadow-md">
                  <CheckCircle className="w-8 h-8 text-emerald-400 animate-pulse" />
                </div>

                <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
                  Dashboard Coming Soon
                </h2>
                
                <p className="text-xs uppercase tracking-[0.25em] text-emerald-400 font-bold font-mono mb-6">
                  Module 1: Authentication Synced
                </p>

                <div className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-4 mb-6 text-left space-y-2">
                  <p className="text-xs text-gray-400">
                    Pioneer Node: <strong className="text-white">{profile?.username || "Guest Pioneer"}</strong>
                  </p>
                  <p className="text-xs text-gray-400">
                    Network Ledger: <strong className="text-white">{profile?.email || "guest@ecoverzz.net"}</strong>
                  </p>
                  <p className="text-[10px] text-gray-500 font-mono">
                    Status: Verified Conservation Guardian
                  </p>
                </div>

                <p className="text-sm text-gray-400 leading-relaxed font-light mb-8 max-w-sm">
                  Your secure EcoVerzz connection has been established. The full interactive conservation dashboard is currently in active configuration.
                </p>

                {/* Return/Logout Button */}
                <button
                  onClick={handleLogout}
                  className="group relative w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 text-xs font-semibold text-white shadow-lg"
                >
                  <LogOut className="w-4 h-4 text-emerald-400 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Disconnect Security Ledger</span>
                </button>
              </div>

              {/* Secure footer tagline */}
              <div className="mt-6 flex items-center gap-1.5 text-xs text-gray-500 font-medium tracking-wide">
                <Shield className="w-3.5 h-3.5 text-emerald-500/80" />
                <span>Encrypted Decentralized Identity Session</span>
              </div>
            </motion.div>
          )}

          {/* HIGH-FIDELITY ACTIVE CONSERVATION DASHBOARD */}
          {scene === "dashboard" && profile && (
            <motion.div
              key="dashboard-container"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full"
            >
              <Dashboard profile={profile} onLogout={handleLogout} />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Cinematic Scene Indicator / Touch cues (Subtle layout rhythms) */}
      <footer className="relative w-full max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 z-50 pointer-events-none border-t border-white/5 mt-4">
        <div className="flex items-center space-x-12">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Current Status</p>
            <p className="text-sm font-light text-white/70">
              {scene === "healing" 
                ? `Restoration Phase 01: Awakening (Stage 0${healingStage})` 
                : scene === "auth"
                ? "Identity Sync Phase 02: Verification"
                : scene === "dashboard"
                ? "Ecosystem Active Phase 03: Guardian"
                : "Integration Phase 03: Harmony"}
            </p>
          </div>
          
          {scene === "healing" && (
            <div className="hidden md:block text-left space-y-1">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 animate-pulse">Touch Response</p>
              <p className="text-sm font-light text-emerald-400/80">Ripples Enabled</p>
            </div>
          )}
        </div>

        {/* Scene progress indicators */}
        <div className="flex gap-1.5 py-2">
          {["healing", "auth", "dashboard"].map((step) => (
            <div 
              key={step}
              className={`h-1 rounded-full transition-all duration-300 ${
                scene === step 
                  ? "w-8 bg-emerald-400" 
                  : "w-1.5 bg-white/10"
              }`}
            />
          ))}
        </div>

        <div className="flex space-x-12">
          <div className="text-right space-y-1">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Global CO2</p>
            <p className="text-sm font-mono text-emerald-400">-0.0004%</p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Active Guardians</p>
            <p className="text-sm font-mono text-white/80">1,204,558</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
