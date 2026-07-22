import React from "react";
import { motion } from "motion/react";
import { SceneType } from "../types";

interface EarthVisualizerProps {
  scene: SceneType;
  healingStage?: number; // 0 to 5
  zoomLevel?: "far" | "normal" | "close" | "hyper";
}

export const EarthVisualizer: React.FC<EarthVisualizerProps> = ({
  scene,
  healingStage = 5,
  zoomLevel = "normal",
}) => {
  // If scene is healing, we use the healingStage. Otherwise, we assume fully healed (5) for auth/mission/completed.
  const stage = scene === "healing" ? healingStage : 5;

  // Zoom configurations based on scene stage
  const getScale = () => {
    switch (zoomLevel) {
      case "far": return 0.85;
      case "normal": return 1.0;
      case "close": return 1.18;
      case "hyper": return 2.2;
      default: return 1.0;
    }
  };

  // High-fidelity SVG continent shapes duplicated to enable seamless looping rotation
  const worldMapPath = (
    <g className="fill-current">
      {/* Loop 1: Continents Group */}
      <path d="M 20 40 q 15 -10 30 -5 t 25 10 t 15 -15 t 20 20 t -15 30 t -40 -10 t -35 -30 Z
               M 120 25 q 20 -15 40 -5 t 30 25 t -10 35 t -35 -10 t -25 -45 Z
               M 80 80 q 25 -5 35 25 t -20 30 t -30 -15 t 15 -40 Z
               M 240 30 q 30 -20 60 0 t 40 40 t -25 35 t -55 -25 t -20 -50 Z
               M 190 75 q 15 -5 25 20 t -10 25 t -30 -10 t 15 -35 Z" />
               
      {/* Loop 2 (Offset by exactly +300px to enable horizontal carousel wrap) */}
      <path d="M 320 40 q 15 -10 30 -5 t 25 10 t 15 -15 t 20 20 t -15 30 t -40 -10 t -35 -30 Z
               M 420 25 q 20 -15 40 -5 t 30 25 t -10 35 t -35 -10 t -25 -45 Z
               M 380 80 q 25 -5 35 25 t -20 30 t -30 -15 t 15 -40 Z
               M 540 30 q 30 -20 60 0 t 40 40 t -25 35 t -55 -25 t -20 -50 Z
               M 490 75 q 15 -5 25 20 t -10 25 t -30 -10 t 15 -35 Z" />
    </g>
  );

  // Styling based on stages 0 - 5
  // Stage 0: Damaged
  // Stage 1: Dry water, tiny greens, sky brighter
  // Stage 2: Bluer water, olivish green, smoke cleared, small animals
  // Stage 3: Rich blue, flowers, sparkly, clouds, birds fly
  // Stage 4: Vibrant emerald green-teal, sunlight sweep, glowing particles
  // Stage 5: Ultimate pristine healthy, flying birds, butterflies, fireflies, sunlight

  const isLush = stage > 0;
  
  // Outer atmosphere glow styles
  const getAtmosphereGlowClass = () => {
    if (stage === 0) {
      return "bg-amber-900/10 shadow-[0_0_80px_rgba(139,92,26,0.1)] ring-1 ring-amber-900/10";
    }
    if (stage === 1) {
      return "bg-teal-900/15 shadow-[0_0_80px_rgba(13,148,136,0.15)] ring-1 ring-teal-500/10";
    }
    if (stage === 2) {
      return "bg-blue-900/20 shadow-[0_0_85px_rgba(59,130,246,0.18)] ring-1 ring-blue-500/10";
    }
    if (stage === 3) {
      return "bg-emerald-950/25 shadow-[0_0_90px_rgba(16,185,129,0.22)] ring-1 ring-emerald-500/15";
    }
    if (stage === 4) {
      return "bg-emerald-900/30 shadow-[0_0_100px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400/20";
    }
    return "bg-[radial-gradient(circle_at_30%_30%,#10B981_0%,#064E3B_30%,#022C22_60%,#000_100%)] shadow-[0_0_120px_rgba(16,185,129,0.35)] ring-1 ring-emerald-500/25";
  };

  // Water background styles
  const getWaterBgStyle = () => {
    switch (stage) {
      case 0: // Damaged: arid, muddy brown, dark copper
        return "bg-gradient-to-tr from-[#1b1713] via-[#2d2116] to-[#3a2718]";
      case 1: // Cleaner: less coppery, muted blue-grayish
        return "bg-gradient-to-tr from-[#111921] via-[#1a2d3a] to-[#253a2b]";
      case 2: // Blue oceans
        return "bg-gradient-to-tr from-[#061c2d] via-[#0b334d] to-[#114b53]";
      case 3: // Sparkling ocean
        return "bg-gradient-to-tr from-[#031929] via-[#083a5c] to-[#0e5c6a]";
      case 4: // Radiant teal
        return "bg-gradient-to-tr from-[#021526] via-[#00426d] to-[#047788]";
      case 5: // Magical healthy blue
      default:
        return "bg-gradient-to-tr from-[#01111f] via-[#00385c] to-[#008ca1]";
    }
  };

  // Continent text fill color
  const getContinentColorClass = () => {
    switch (stage) {
      case 0: // Arid brown/faded grey with dry cracks feeling
        return "text-[#4a392a] opacity-80 filter grayscale-[20%]";
      case 1: // Dull green-brownish mix
        return "text-[#545f3c] opacity-90";
      case 2: // Forest olive green
        return "text-[#3b7145] opacity-95";
      case 3: // Radiant green
        return "text-emerald-600/90";
      case 4: // Glowing emerald
        return "text-emerald-500 filter drop-shadow-[0_0_4px_rgba(16,185,129,0.25)]";
      case 5: // Magical glowing pristine green
      default:
        return "text-emerald-400 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.45)]";
    }
  };

  return (
    <div className="relative flex items-center justify-center pointer-events-none select-none z-20">
      
      {/* Concentric orbital rings with stage-dependent scaling/opacity */}
      <div 
        className={`absolute -inset-8 md:-inset-12 border rounded-full pointer-events-none transition-all duration-1000 ${
          stage > 0 ? "border-emerald-500/10 animate-pulse" : "border-amber-900/5"
        }`} 
      />
      <div 
        className={`absolute -inset-16 md:-inset-24 border rounded-full pointer-events-none transition-all duration-1000 ${
          stage > 1 ? "border-emerald-500/5" : "border-transparent"
        }`} 
      />

      {/* Atmospheric Thermosphere outer glowing rings with Sophisticated Dark gradient values */}
      <motion.div
        animate={{
          scale: stage > 0 ? [1.02, 1.05, 1.02] : [1.00, 1.02, 1.00],
          opacity: stage > 0 ? [0.4, 0.7, 0.4] : [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`absolute rounded-full w-64 h-64 md:w-80 md:h-80 blur-md pointer-events-none transition-all duration-1000 ${getAtmosphereGlowClass()}`}
      />

      {/* Earth container with responsive scaling */}
      <motion.div
        animate={{
          scale: getScale(),
          rotate: [0, 1], // very micro drift
        }}
        transition={{
          type: "spring",
          stiffness: 40,
          damping: 18,
          scale: { duration: 1.8, ease: "easeOut" }
        }}
        className="w-64 h-64 md:w-80 md:h-80 rounded-full relative overflow-hidden bg-[#0A0A0A] border border-white/10"
      >
        {/* Dynamic Water Base Layer */}
        <div className={`absolute inset-0 transition-all duration-1000 ease-out ${getWaterBgStyle()}`} />

        {/* Seamless Rotating Continents (Map Layer) */}
        <div className="absolute inset-0 w-full h-full rounded-full overflow-hidden mask-circular">
          <div 
            className="absolute inset-0 animate-world-rotate flex items-center" 
            style={{ width: "200%", transform: "translateY(-10%)" }}
          >
            <svg 
              viewBox="0 0 600 150" 
              className={`w-full h-4/5 transition-colors duration-1000 ease-out ${getContinentColorClass()}`}
            >
              {worldMapPath}
            </svg>
          </div>
        </div>

        {/* Small dry cracks overlay (Only stage 0 and 1) */}
        {stage <= 1 && (
          <div className="absolute inset-0 opacity-45 mix-blend-overlay pointer-events-none">
            <svg viewBox="0 0 200 200" className="w-full h-full text-amber-950">
              <path d="M40,50 L55,45 L60,55 M120,80 L135,70 L130,90 M80,130 L95,120" stroke="currentColor" strokeWidth="1" fill="none" />
              <path d="M150,40 L160,55 L170,45 M30,110 L45,125" stroke="currentColor" strokeWidth="0.8" fill="none" />
            </svg>
          </div>
        )}

        {/* Smoke overlay in some areas (Only stage 0) */}
        {stage === 0 && (
          <div className="absolute inset-0 pointer-events-none opacity-40">
            {/* Animated wisps of smoke */}
            <motion.div 
              animate={{ x: [0, 40, 0], y: [0, -10, 0], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 left-1/4 w-12 h-6 bg-gradient-to-r from-transparent via-gray-600/30 to-transparent blur-md"
            />
            <motion.div 
              animate={{ x: [0, -30, 0], y: [0, 15, 0], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-1/3 right-1/4 w-16 h-8 bg-gradient-to-r from-transparent via-gray-600/25 to-transparent blur-md"
            />
          </div>
        )}

        {/* Dynamic Blooming Restoration Nodes (Stage 1+) */}
        {stage >= 1 && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Glowing ecosystem sprouts springing on rotating schedule */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
              className="absolute top-1/4 left-1/3 w-3 h-3 rounded-full bg-emerald-400 blur-[1px] shadow-[0_0_12px_rgba(52,211,153,1)]"
            />
            
            {stage >= 2 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0.7, 1.4, 0.7], opacity: [0.3, 0.85, 0.3] }}
                transition={{ duration: 4.2, repeat: Infinity, delay: 1.2 }}
                className="absolute bottom-1/3 right-1/4 w-2 h-2 rounded-full bg-teal-400 blur-[1px] shadow-[0_0_10px_rgba(45,212,191,1)]"
              />
            )}

            {stage >= 3 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.4, 0.95, 0.4] }}
                transition={{ duration: 2.8, repeat: Infinity, delay: 2.0 }}
                className="absolute top-1/2 left-2/3 w-2.5 h-2.5 rounded-full bg-emerald-300 blur-[1px] shadow-[0_0_10px_rgba(110,231,183,1)]"
              />
            )}
          </div>
        )}

        {/* Flowers blooming (Pink/Yellow glowing floral dots on land) (Stage 3+) */}
        {stage >= 3 && (
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 80 }}
              className="absolute top-1/3 left-1/2 w-1.5 h-1.5 rounded-full bg-pink-400 shadow-[0_0_6px_#f472b6]"
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 80, delay: 0.4 }}
              className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 rounded-full bg-yellow-300 shadow-[0_0_6px_#fde047]"
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 80, delay: 0.8 }}
              className="absolute top-1/2 left-1/4 w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_#c084fc]"
            />
          </div>
        )}

        {/* Atmospheric Cloud Layer (Parallax rotating faster, cleaner as stage increases) */}
        <div className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none ${stage === 0 ? "opacity-25" : "opacity-45"}`}>
          <div 
            className="absolute inset-0 flex items-center" 
            style={{ 
              width: "200%", 
              animation: "world-rotate 22s linear infinite",
              transform: "translateY(-5%)" 
            }}
          >
            <svg viewBox="0 0 600 150" className="w-full h-full text-white/50">
              <path fill="currentColor" opacity="0.3" d="M 50 30 q 30 -10 40 20 t 50 10 t -20 20 t -60 -10 Z" />
              <path fill="currentColor" opacity="0.4" d="M 220 20 q 25 -5 35 15 t 40 5 t -10 15 t -55 -10 Z" />
              <path fill="currentColor" opacity="0.25" d="M 120 80 q 30 10 45 -10 t 35 25 t -50 10 Z" />
              
              {/* Loop Offset Clouds */}
              <path fill="currentColor" opacity="0.3" d="M 350 30 q 30 -10 40 20 t 50 10 t -20 20 t -60 -10 Z" />
              <path fill="currentColor" opacity="0.4" d="M 520 20 q 25 -5 35 15 t 40 5 t -10 15 t -55 -10 Z" />
              <path fill="currentColor" opacity="0.25" d="M 420 80 q 30 10 45 -10 t 35 25 t -50 10 Z" />
            </svg>
          </div>
        </div>

        {/* Spherical Shadow overlay to give true 3D depth */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#020202]/90 via-[#030305]/20 to-white/10 mix-blend-multiply pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-white/5 pointer-events-none" />

        {/* Specular curved highlights */}
        <div className="absolute top-[3%] left-[5%] w-[90%] h-[40%] rounded-full bg-gradient-to-b from-white/12 to-transparent filter blur-[2px] pointer-events-none" />
      </motion.div>

      {/* Elegant flying bird silhouettes (Stage 3+) */}
      {stage >= 3 && (
        <div className="absolute inset-0 z-30 pointer-events-none">
          {/* Flock 1 */}
          <motion.div
            initial={{ x: -100, y: 150, scale: 0.7 }}
            animate={{ x: 380, y: 80 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 1 }}
            className="absolute text-emerald-300"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[1.5]">
              <path d="M 2 12 Q 6 6 10 12 Q 14 6 18 12" />
            </svg>
          </motion.div>
          
          {/* Flock 2 */}
          <motion.div
            initial={{ x: -80, y: 80, scale: 0.5 }}
            animate={{ x: 360, y: 120 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 7 }}
            className="absolute text-emerald-400"
          >
            <svg viewBox="0 0 24 24" className="w-3 h-3 fill-none stroke-current stroke-[1.5]">
              <path d="M 2 12 Q 6 6 10 12 Q 14 6 18 12" />
            </svg>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default EarthVisualizer;
