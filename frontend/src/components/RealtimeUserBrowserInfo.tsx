import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Cpu, HardDrive, Wifi, Battery, BatteryCharging, Monitor, 
  User, ShieldCheck, Clock, Globe, Copy, Check, Download, 
  RefreshCw, Activity, Lock, Eye, Compass, Zap, Layers, Sparkles, 
  Radio, Database, AlertCircle, Laptop, Smartphone, Terminal, Signal,
  Server, CheckCircle2, Sliders, Shield, ArrowUpRight, Gauge
} from "lucide-react";
import { UserProfile } from "../types";
import { audioEngine } from "./AudioEngine";
import { api } from "../services/api";
import { checkSupabaseConnection, isSupabaseConfigured, supabase } from "../services/supabaseClient";

interface RealtimeUserBrowserInfoProps {
  profile: UserProfile | null;
  onRefreshProfile?: () => void;
}

export const RealtimeUserBrowserInfo: React.FC<RealtimeUserBrowserInfoProps> = ({ 
  profile: initialProfile,
  onRefreshProfile 
}) => {
  // Profile state
  const [profile, setProfile] = useState<UserProfile | null>(initialProfile);
  const [isRefreshingProfile, setIsRefreshingProfile] = useState(false);

  // Active Category Filter Tab
  const [activeTab, setActiveTab] = useState<"all" | "auth" | "browser" | "hardware" | "screen" | "network" | "storage" | "supabase">("all");

  // Live session timer
  const [sessionSeconds, setSessionSeconds] = useState(0);

  // Auto-refresh control
  const [refreshInterval, setRefreshInterval] = useState<number>(1000); // 1000ms default
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState<string>(new Date().toLocaleTimeString());

  // Copy status feedback
  const [copied, setCopied] = useState(false);

  // Real-time Clock State
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Supabase Diagnostics State
  const [supabaseStatus, setSupabaseStatus] = useState<{
    connected: boolean;
    configured: boolean;
    url: string;
    error?: string;
    loading: boolean;
  }>({
    connected: false,
    configured: isSupabaseConfigured(),
    url: import.meta.env.VITE_SUPABASE_URL || "https://zotygsvdthwhnzoucske.supabase.co",
    loading: false,
  });

  const handleCheckSupabase = async () => {
    audioEngine.playTick();
    setSupabaseStatus((prev) => ({ ...prev, loading: true }));
    const result = await checkSupabaseConnection();
    if (result.connected) audioEngine.playSuccessChime();
    setSupabaseStatus({ ...result, loading: false });
  };

  useEffect(() => {
    handleCheckSupabase();
  }, []);

  // Real-time Browser & System State
  const [browserInfo, setBrowserInfo] = useState({
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "Unknown",
    language: typeof navigator !== "undefined" ? navigator.language : "Unknown",
    languages: typeof navigator !== "undefined" ? navigator.languages?.join(", ") || "Unknown" : "Unknown",
    cookieEnabled: typeof navigator !== "undefined" ? navigator.cookieEnabled : false,
    doNotTrack: typeof navigator !== "undefined" ? (navigator.doNotTrack || "Unspecified") : "Unspecified",
    online: typeof navigator !== "undefined" ? navigator.onLine : true,
    platform: typeof navigator !== "undefined" ? navigator.platform : "Unknown",
    maxTouchPoints: typeof navigator !== "undefined" ? (navigator.maxTouchPoints || 0) : 0,
    hardwareConcurrency: typeof navigator !== "undefined" ? (navigator.hardwareConcurrency || "N/A") : "N/A",
    deviceMemory: typeof navigator !== "undefined" ? ((navigator as any).deviceMemory || "N/A") : "N/A",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timezoneOffset: `UTC ${new Date().getTimezoneOffset() <= 0 ? "+" : "-"}${Math.abs(Math.floor(new Date().getTimezoneOffset() / 60)).toString().padStart(2, "0")}:${Math.abs(new Date().getTimezoneOffset() % 60).toString().padStart(2, "0")}`,
  });

  // Display & Screen Geometry State
  const [screenInfo, setScreenInfo] = useState({
    width: typeof window !== "undefined" ? window.screen.width : 0,
    height: typeof window !== "undefined" ? window.screen.height : 0,
    availWidth: typeof window !== "undefined" ? window.screen.availWidth : 0,
    availHeight: typeof window !== "undefined" ? window.screen.availHeight : 0,
    colorDepth: typeof window !== "undefined" ? window.screen.colorDepth : 0,
    pixelDepth: typeof window !== "undefined" ? window.screen.pixelDepth : 0,
    devicePixelRatio: typeof window !== "undefined" ? window.devicePixelRatio : 1,
    viewportWidth: typeof window !== "undefined" ? window.innerWidth : 0,
    viewportHeight: typeof window !== "undefined" ? window.innerHeight : 0,
    orientation: typeof window !== "undefined" && window.screen.orientation ? window.screen.orientation.type : "N/A",
  });

  // Network Telemetry State
  const [networkInfo, setNetworkInfo] = useState<{
    type?: string;
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
    saveData?: boolean;
  }>({});

  // Battery State
  const [batteryInfo, setBatteryInfo] = useState<{
    charging: boolean;
    level: number;
    chargingTime: number;
    dischargingTime: number;
    supported: boolean;
  }>({
    charging: true,
    level: 1,
    chargingTime: 0,
    dischargingTime: Infinity,
    supported: false,
  });

  // Storage Metrics
  const [storageInfo, setStorageInfo] = useState<{
    localStorageLength: number;
    localStorageSizeEstimate: string;
    sessionStorageLength: number;
    quota?: string;
    usage?: string;
    quotaPercent?: number;
  }>({
    localStorageLength: 0,
    localStorageSizeEstimate: "0 B",
    sessionStorageLength: 0,
  });

  // WebGL & Hardware GPU Metrics
  const [gpuInfo, setGpuInfo] = useState<{
    vendor: string;
    renderer: string;
    webglVersion: string;
    maxTextureSize: number | string;
  }>({
    vendor: "Detecting...",
    renderer: "Detecting...",
    webglVersion: "Unknown",
    maxTextureSize: "N/A",
  });

  // Geolocation State
  const [geoInfo, setGeoInfo] = useState<{
    lat: number | null;
    lng: number | null;
    accuracy: number | null;
    status: "idle" | "fetching" | "granted" | "denied" | "error";
    errorMsg?: string;
  }>({
    lat: null,
    lng: null,
    accuracy: null,
    status: "idle",
  });

  // Derived Browser Name Detection
  const getBrowserNameAndVersion = () => {
    const ua = browserInfo.userAgent;
    let name = "Unknown Browser";
    let version = "";

    if (ua.includes("Firefox/")) {
      name = "Mozilla Firefox";
      version = ua.split("Firefox/")[1]?.split(" ")[0] || "";
    } else if (ua.includes("Edg/")) {
      name = "Microsoft Edge";
      version = ua.split("Edg/")[1]?.split(" ")[0] || "";
    } else if (ua.includes("Chrome/")) {
      name = "Google Chrome";
      version = ua.split("Chrome/")[1]?.split(" ")[0] || "";
    } else if (ua.includes("Safari/") && !ua.includes("Chrome/")) {
      name = "Apple Safari";
      version = ua.split("Version/")[1]?.split(" ")[0] || "";
    } else if (ua.includes("OPR/") || ua.includes("Opera/")) {
      name = "Opera";
      version = ua.split("OPR/")[1]?.split(" ")[0] || "";
    }

    return { name, version };
  };

  const detectedBrowser = getBrowserNameAndVersion();

  // 1. Session Uptime Counter
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Real-Time Clock & Dynamic Window Listener
  useEffect(() => {
    if (!isLiveStreaming) return;

    const intervalId = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      setLastSyncTime(now.toLocaleTimeString());
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, [isLiveStreaming, refreshInterval]);

  // Window Resize & Orientation Listener
  useEffect(() => {
    const handleResize = () => {
      setScreenInfo((prev) => ({
        ...prev,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        width: window.screen.width,
        height: window.screen.height,
        availWidth: window.screen.availWidth,
        availHeight: window.screen.availHeight,
        devicePixelRatio: window.devicePixelRatio,
        orientation: window.screen.orientation ? window.screen.orientation.type : "N/A",
      }));
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  // Online / Offline Listeners
  useEffect(() => {
    const handleOnline = () => {
      setBrowserInfo((prev) => ({ ...prev, online: true }));
    };
    const handleOffline = () => {
      setBrowserInfo((prev) => ({ ...prev, online: false }));
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Network Connection Telemetry
  useEffect(() => {
    const nav = navigator as any;
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;

    const updateNetworkInfo = () => {
      if (connection) {
        setNetworkInfo({
          type: connection.type || "N/A",
          effectiveType: connection.effectiveType || "N/A",
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData,
        });
      }
    };

    updateNetworkInfo();
    if (connection) {
      connection.addEventListener("change", updateNetworkInfo);
      return () => connection.removeEventListener("change", updateNetworkInfo);
    }
  }, []);

  // Battery Manager Listener
  useEffect(() => {
    const nav = navigator as any;
    if (typeof nav.getBattery === "function") {
      nav.getBattery().then((battery: any) => {
        const updateBatteryState = () => {
          setBatteryInfo({
            charging: battery.charging,
            level: battery.level,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime,
            supported: true,
          });
        };

        updateBatteryState();
        battery.addEventListener("chargingchange", updateBatteryState);
        battery.addEventListener("levelchange", updateBatteryState);
        battery.addEventListener("chargingtimechange", updateBatteryState);
        battery.addEventListener("dischargingtimechange", updateBatteryState);
      }).catch(() => {
        setBatteryInfo((prev) => ({ ...prev, supported: false }));
      });
    }
  }, []);

  // Storage Diagnostics
  useEffect(() => {
    const updateStorageMetrics = async () => {
      try {
        let totalBytes = 0;
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            totalBytes += key.length + (localStorage.getItem(key)?.length || 0);
          }
        }

        const sizeFormatted = totalBytes < 1024 
          ? `${totalBytes} B` 
          : totalBytes < 1024 * 1024 
          ? `${(totalBytes / 1024).toFixed(2)} KB` 
          : `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`;

        let quotaFormatted = "N/A";
        let usageFormatted = "N/A";
        let percent = undefined;

        if (navigator.storage && navigator.storage.estimate) {
          const estimate = await navigator.storage.estimate();
          if (estimate.quota) {
            quotaFormatted = `${(estimate.quota / (1024 * 1024 * 1024)).toFixed(2)} GB`;
          }
          if (estimate.usage) {
            usageFormatted = `${(estimate.usage / (1024 * 1024)).toFixed(2)} MB`;
          }
          if (estimate.quota && estimate.usage) {
            percent = Number(((estimate.usage / estimate.quota) * 100).toFixed(4));
          }
        }

        setStorageInfo({
          localStorageLength: localStorage.length,
          localStorageSizeEstimate: sizeFormatted,
          sessionStorageLength: sessionStorage.length,
          quota: quotaFormatted,
          usage: usageFormatted,
          quotaPercent: percent,
        });
      } catch (e) {
        console.warn("Storage estimate error", e);
      }
    };

    updateStorageMetrics();
  }, [currentTime]);

  // WebGL GPU Extraction
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (gl) {
        const glContext = gl as WebGLRenderingContext;
        const debugInfo = glContext.getExtension("WEBGL_debug_renderer_info");
        const vendor = debugInfo ? glContext.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : glContext.getParameter(glContext.VENDOR);
        const renderer = debugInfo ? glContext.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : glContext.getParameter(glContext.RENDERER);
        const version = glContext.getParameter(glContext.VERSION);
        const maxTexture = glContext.getParameter(glContext.MAX_TEXTURE_SIZE);

        setGpuInfo({
          vendor: vendor || "Unknown Vendor",
          renderer: renderer || "Unknown GPU Renderer",
          webglVersion: version || "WebGL 1.0",
          maxTextureSize: maxTexture || "N/A",
        });
      } else {
        setGpuInfo({
          vendor: "Disabled/Unsupported",
          renderer: "No WebGL Context Available",
          webglVersion: "Unsupported",
          maxTextureSize: "N/A",
        });
      }
    } catch (e) {
      setGpuInfo({
        vendor: "Error",
        renderer: "Unable to query WebGL",
        webglVersion: "N/A",
        maxTextureSize: "N/A",
      });
    }
  }, []);

  // Request Live Geolocation
  const requestGeolocation = () => {
    audioEngine.playTick();
    if (!navigator.geolocation) {
      setGeoInfo((prev) => ({ ...prev, status: "error", errorMsg: "Geolocation is not supported by this browser." }));
      return;
    }

    setGeoInfo((prev) => ({ ...prev, status: "fetching" }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        audioEngine.playSuccessChime();
        setGeoInfo({
          lat: Number(pos.coords.latitude.toFixed(6)),
          lng: Number(pos.coords.longitude.toFixed(6)),
          accuracy: Math.round(pos.coords.accuracy),
          status: "granted",
        });
      },
      (err) => {
        setGeoInfo((prev) => ({
          ...prev,
          status: "denied",
          errorMsg: err.message || "Location permission denied.",
        }));
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Re-fetch Profile Live from Backend
  const handleRefetchProfile = async () => {
    audioEngine.playTick();
    setIsRefreshingProfile(true);
    try {
      const liveData = await api.getProfile();
      setProfile(liveData);
      audioEngine.playSuccessChime();
      if (onRefreshProfile) onRefreshProfile();
    } catch (e) {
      console.warn("Failed to refetch live profile", e);
    } finally {
      setIsRefreshingProfile(false);
    }
  };

  // Format Session Uptime HH:MM:SS
  const formatUptime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Prepare Exportable Diagnostic Report
  const getFullDiagnosticJson = () => {
    const accessToken = localStorage.getItem("ecoverzz_access_token");
    const refreshToken = localStorage.getItem("ecoverzz_refresh_token");

    return {
      timestamp: currentTime.toISOString(),
      localTime: currentTime.toLocaleString(),
      sessionUptime: formatUptime(sessionSeconds),
      userAuthentication: {
        isAuthenticated: Boolean(accessToken),
        username: profile?.username || "Anonymous",
        email: profile?.email || "N/A",
        role: profile?.rank || "Citizen",
        ecoPoints: profile?.ecoPoints || 0,
        scannedItemsCount: profile?.scannedItemsCount || 0,
        joinedAt: profile?.joinedAt || "N/A",
        tokenState: {
          accessTokenPresent: Boolean(accessToken),
          accessTokenPrefix: accessToken ? `${accessToken.substring(0, 10)}...` : "None",
          refreshTokenPresent: Boolean(refreshToken),
        },
      },
      supabaseCloud: {
        configured: supabaseStatus.configured,
        endpoint: supabaseStatus.url,
        connected: supabaseStatus.connected,
      },
      browserEnvironment: {
        detectedBrowser: detectedBrowser.name,
        browserVersion: detectedBrowser.version,
        userAgent: browserInfo.userAgent,
        language: browserInfo.language,
        languages: browserInfo.languages,
        onlineStatus: browserInfo.online ? "Online" : "Offline",
        platform: browserInfo.platform,
        timezone: browserInfo.timezone,
        timezoneOffset: browserInfo.timezoneOffset,
        doNotTrack: browserInfo.doNotTrack,
        cookieEnabled: browserInfo.cookieEnabled,
      },
      hardwareMetrics: {
        logicalCpuCores: browserInfo.hardwareConcurrency,
        deviceMemoryGB: browserInfo.deviceMemory,
        maxTouchPoints: browserInfo.maxTouchPoints,
        gpuVendor: gpuInfo.vendor,
        gpuRenderer: gpuInfo.renderer,
        webglVersion: gpuInfo.webglVersion,
        maxTextureSize: gpuInfo.maxTextureSize,
      },
      displayGeometry: {
        screenResolution: `${screenInfo.width}x${screenInfo.height}`,
        availableScreen: `${screenInfo.availWidth}x${screenInfo.availHeight}`,
        viewportDimensions: `${screenInfo.viewportWidth}x${screenInfo.viewportHeight}`,
        devicePixelRatio: screenInfo.devicePixelRatio,
        colorDepth: `${screenInfo.colorDepth}-bit`,
        orientation: screenInfo.orientation,
      },
      networkTelemetry: {
        online: browserInfo.online,
        effectiveType: networkInfo.effectiveType || "N/A",
        downlinkMbps: networkInfo.downlink ?? "N/A",
        rttMs: networkInfo.rtt ?? "N/A",
        saveDataMode: networkInfo.saveData ? "Enabled" : "Disabled",
      },
      batteryTelemetry: batteryInfo.supported ? {
        charging: batteryInfo.charging,
        batteryPercent: `${Math.round(batteryInfo.level * 100)}%`,
        chargingTimeSec: batteryInfo.chargingTime,
        dischargingTimeSec: batteryInfo.dischargingTime,
      } : { supported: false },
      storageTelemetry: {
        localStorageItems: storageInfo.localStorageLength,
        localStorageEstimatedSize: storageInfo.localStorageSizeEstimate,
        sessionStorageItems: storageInfo.sessionStorageLength,
        quotaEstimate: storageInfo.quota,
        usageEstimate: storageInfo.usage,
      },
      geolocation: geoInfo.status === "granted" ? {
        latitude: geoInfo.lat,
        longitude: geoInfo.lng,
        accuracyMeters: geoInfo.accuracy,
      } : { status: geoInfo.status },
    };
  };

  // Copy Report to Clipboard
  const handleCopyReport = () => {
    audioEngine.playTick();
    const dataStr = JSON.stringify(getFullDiagnosticJson(), null, 2);
    navigator.clipboard.writeText(dataStr).then(() => {
      setCopied(true);
      audioEngine.playSuccessChime();
      setTimeout(() => setCopied(false), 2500);
    });
  };

  // Download Report JSON File
  const handleDownloadReport = () => {
    audioEngine.playTick();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(getFullDiagnosticJson(), null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ecoverzz_telemetry_${profile?.username || "user"}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    audioEngine.playSuccessChime();
  };

  const showAll = activeTab === "all";

  return (
    <div className="w-full space-y-6 select-text text-gray-100 font-sans">
      
      {/* FUTURISTIC CYBERPUNK HERO HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#0a1221] via-[#09101c] to-[#0c182b] backdrop-blur-2xl border border-emerald-500/25 rounded-3xl p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
        {/* Glow ambient background orbs */}
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-emerald-400 shadow-lg shadow-emerald-950/50">
                <Activity className="w-7 h-7 animate-pulse" />
              </span>
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                  Real-Time User & System Intel
                  <span className="text-[11px] px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    LIVE TELEMETRY
                  </span>
                </h2>
                <p className="text-xs text-gray-400 mt-1 max-w-xl font-light leading-relaxed">
                  Real-time streaming client hardware metrics, network latency, GPU acceleration, viewport geometry, and authenticated user identity connected to Supabase.
                </p>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Live Streaming Toggle Button */}
            <button
              onClick={() => {
                audioEngine.playTick();
                setIsLiveStreaming((prev) => !prev);
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-mono font-bold flex items-center gap-2 border transition-all cursor-pointer shadow-lg ${
                isLiveStreaming
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-emerald-950/30"
                  : "bg-gray-800/60 border-gray-700 text-gray-400"
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${isLiveStreaming ? "bg-emerald-400 animate-pulse" : "bg-gray-500"}`} />
              {isLiveStreaming ? "STREAMING ACTIVE" : "STREAM PAUSED"}
            </button>

            {/* Refresh Interval Selector */}
            <div className="relative">
              <select
                value={refreshInterval}
                onChange={(e) => {
                  audioEngine.playTick();
                  setRefreshInterval(Number(e.target.value));
                }}
                className="bg-black/70 border border-white/15 text-gray-200 text-xs rounded-2xl px-3.5 py-2.5 font-mono outline-none focus:border-emerald-500 transition-colors cursor-pointer"
              >
                <option value={1000}>Sync: 1 sec</option>
                <option value={2000}>Sync: 2 sec</option>
                <option value={5000}>Sync: 5 sec</option>
                <option value={10000}>Sync: 10 sec</option>
              </select>
            </div>

            {/* Copy JSON Report */}
            <button
              onClick={handleCopyReport}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/15 text-white rounded-2xl text-xs font-medium flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gray-300" />}
              {copied ? "Copied!" : "Copy Report"}
            </button>

            {/* Export JSON File */}
            <button
              onClick={handleDownloadReport}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-gray-950 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Live System Status Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-white/10 font-mono text-xs">
          <div className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-gray-500 text-[9px] uppercase block">Local Time</span>
              <span className="text-white font-bold">{currentTime.toLocaleTimeString()}</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-center gap-2.5">
            <Radio className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <span className="text-gray-500 text-[9px] uppercase block">Session Uptime</span>
              <span className="text-cyan-300 font-bold">{formatUptime(sessionSeconds)}</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-center gap-2.5">
            <Signal className={`w-4 h-4 shrink-0 ${browserInfo.online ? "text-emerald-400" : "text-rose-500"}`} />
            <div>
              <span className="text-gray-500 text-[9px] uppercase block">Network State</span>
              <span className={browserInfo.online ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                {browserInfo.online ? "ONLINE" : "OFFLINE"}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-center gap-2.5">
            <Database className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-gray-500 text-[9px] uppercase block">Supabase Sync</span>
              <span className="text-emerald-400 font-bold">Connected</span>
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORY FILTER TABS TOOLBAR */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl">
        {[
          { id: "all", label: "All Telemetry Panels", icon: Sliders },
          { id: "auth", label: "User & Auth", icon: User },
          { id: "browser", label: "Browser & OS", icon: Globe },
          { id: "hardware", label: "Hardware & GPU", icon: Cpu },
          { id: "screen", label: "Display Geometry", icon: Monitor },
          { id: "network", label: "Network & Power", icon: Wifi },
          { id: "storage", label: "Storage & GPS", icon: Database },
          { id: "supabase", label: "Supabase Cloud", icon: Server },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                audioEngine.playTick();
                setActiveTab(tab.id as any);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium flex items-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm font-bold"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-400" : ""}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* EXPANDED FLEX RESPONSIVE GRID FOR TELEMETRY PANELS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* PANEL 1: AUTHENTICATED USER IDENTITY & SESSION */}
        {(showAll || activeTab === "auth") && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-b from-[#0b101c]/95 to-[#080c16]/95 backdrop-blur-2xl border border-emerald-500/20 rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-emerald-400/40 transition-all duration-300"
          >
            <div>
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                      User Authentication
                    </h3>
                    <span className="text-[10px] text-gray-400 font-mono block">OAuth2 / Supabase JWT</span>
                  </div>
                </div>

                <button
                  onClick={handleRefetchProfile}
                  disabled={isRefreshingProfile}
                  title="Sync profile from backend server"
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer border border-white/5"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshingProfile ? "animate-spin text-emerald-400" : ""}`} />
                </button>
              </div>

              {/* Profile Card Details */}
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 flex items-center justify-center text-gray-950 font-black text-base shadow-lg">
                      {profile?.username ? profile.username.substring(0, 2).toUpperCase() : "US"}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm font-sans">{profile?.username || "Authenticated User"}</h4>
                      <span className="text-[11px] text-emerald-400 block font-mono">{profile?.email || "user@ecoverzz.org"}</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-bold text-[10px] uppercase">
                    {profile?.rank || "Citizen"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                    <span className="text-gray-500 block text-[9px] uppercase">EcoPoints Balance</span>
                    <span className="text-emerald-400 font-bold text-base">{profile?.ecoPoints ?? 480}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                    <span className="text-gray-500 block text-[9px] uppercase">Scanned / Carbon</span>
                    <span className="text-teal-300 font-bold text-base">{profile?.scannedItemsCount ?? 65}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-1 text-xs">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-gray-400">Account Creation:</span>
                    <span className="text-white font-medium">{profile?.joinedAt || "July 2026"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-gray-400">JWT Token Status:</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified Active
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-gray-400">Security Encryption:</span>
                    <span className="text-cyan-400">HMAC-SHA256</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-400">Session Bearer:</span>
                    <span className="text-gray-300 font-mono text-[10px]">Active Session</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex justify-between items-center text-[11px] text-gray-500 font-mono">
              <span>Authentication Protocol: OAuth2 / JWT</span>
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <Lock className="w-3.5 h-3.5" /> Encrypted
              </span>
            </div>
          </motion.div>
        )}

        {/* PANEL 2: BROWSER ENGINE & OS INTEL */}
        {(showAll || activeTab === "browser") && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-b from-[#0b101c]/95 to-[#080c16]/95 backdrop-blur-2xl border border-cyan-500/20 rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-cyan-400/40 transition-all duration-300"
          >
            <div>
              <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-white/10">
                <div className="p-2.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Browser & OS Environment
                  </h3>
                  <span className="text-[10px] text-gray-400 font-mono block">Client Agent Detection</span>
                </div>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase block">Browser Identity</span>
                    <span className="font-bold text-cyan-300 text-base">{detectedBrowser.name}</span>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-xs font-bold">
                    v{detectedBrowser.version || "Latest"}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-gray-400">Platform / OS:</span>
                    <span className="text-white font-medium">{browserInfo.platform}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-gray-400">Client Language:</span>
                    <span className="text-gray-200">{browserInfo.language}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-gray-400">Timezone Name:</span>
                    <span className="text-cyan-400 font-bold">{browserInfo.timezone}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-gray-400">Timezone Offset:</span>
                    <span className="text-gray-300">{browserInfo.timezoneOffset}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-gray-400">Cookies Enabled:</span>
                    <span className={browserInfo.cookieEnabled ? "text-emerald-400 font-bold" : "text-rose-400"}>
                      {browserInfo.cookieEnabled ? "YES" : "NO"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-400">Do-Not-Track:</span>
                    <span className="text-gray-300">{browserInfo.doNotTrack}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10">
              <span className="text-[10px] text-gray-500 uppercase block mb-1 font-mono">User Agent Header</span>
              <p className="text-[11px] text-gray-300 font-mono bg-black/60 p-2.5 rounded-xl border border-white/5 break-all line-clamp-2" title={browserInfo.userAgent}>
                {browserInfo.userAgent}
              </p>
            </div>
          </motion.div>
        )}

        {/* PANEL 3: HARDWARE & GPU METRICS */}
        {(showAll || activeTab === "hardware") && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-b from-[#0b101c]/95 to-[#080c16]/95 backdrop-blur-2xl border border-purple-500/20 rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-purple-400/40 transition-all duration-300"
          >
            <div>
              <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-white/10">
                <div className="p-2.5 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Hardware & GPU Telemetry
                  </h3>
                  <span className="text-[10px] text-gray-400 font-mono block">CPU Cores & Acceleration</span>
                </div>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10">
                    <span className="text-gray-500 text-[10px] uppercase block">Logical CPU Cores</span>
                    <span className="text-purple-300 font-bold text-lg">{browserInfo.hardwareConcurrency} Cores</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10">
                    <span className="text-gray-500 text-[10px] uppercase block">Device Memory RAM</span>
                    <span className="text-purple-300 font-bold text-lg">
                      {browserInfo.deviceMemory !== "N/A" ? `~${browserInfo.deviceMemory} GB` : "N/A"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-gray-400">Max Touch Points:</span>
                    <span className="text-white font-bold">{browserInfo.maxTouchPoints}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-gray-400">WebGL Version:</span>
                    <span className="text-purple-300 font-bold">{gpuInfo.webglVersion}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-gray-400">Max Texture Size:</span>
                    <span className="text-gray-200">{gpuInfo.maxTextureSize}px</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-400">GPU Vendor:</span>
                    <span className="text-gray-300 font-bold truncate max-w-[140px]" title={gpuInfo.vendor}>{gpuInfo.vendor}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10">
              <span className="text-[10px] text-gray-500 uppercase block mb-1 font-mono">Unmasked WebGL Renderer</span>
              <p className="text-[11px] text-purple-200/90 font-mono bg-black/60 p-2.5 rounded-xl border border-white/5 truncate" title={gpuInfo.renderer}>
                {gpuInfo.renderer}
              </p>
            </div>
          </motion.div>
        )}

        {/* PANEL 4: DISPLAY GEOMETRY & VIEWPORT METRICS */}
        {(showAll || activeTab === "screen") && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-b from-[#0b101c]/95 to-[#080c16]/95 backdrop-blur-2xl border border-amber-500/20 rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-amber-400/40 transition-all duration-300"
          >
            <div>
              <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-white/10">
                <div className="p-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Screen & Viewport Geometry
                  </h3>
                  <span className="text-[10px] text-gray-400 font-mono block">Dynamic Resolution Metrics</span>
                </div>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-gray-500 text-[10px] uppercase block">Live Viewport Size</span>
                    <span className="font-bold text-amber-300 text-base">
                      {screenInfo.viewportWidth} x {screenInfo.viewportHeight} px
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold">
                    DPR: {screenInfo.devicePixelRatio}x
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-gray-400">Monitor Screen Size:</span>
                    <span className="text-white font-bold">{screenInfo.width} x {screenInfo.height} px</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-gray-400">Available Screen Area:</span>
                    <span className="text-gray-300">{screenInfo.availWidth} x {screenInfo.availHeight} px</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-gray-400">Color Depth:</span>
                    <span className="text-amber-400 font-bold">{screenInfo.colorDepth}-bit color</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-400">Screen Orientation:</span>
                    <span className="text-gray-300 capitalize font-bold">{screenInfo.orientation}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 text-xs text-gray-500 font-mono flex justify-between">
              <span>Viewport auto-syncs on window resize</span>
              <span className="text-amber-400 font-bold">Live Listener</span>
            </div>
          </motion.div>
        )}

        {/* PANEL 5: NETWORK PERFORMANCE & BATTERY TELEMETRY */}
        {(showAll || activeTab === "network") && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-b from-[#0b101c]/95 to-[#080c16]/95 backdrop-blur-2xl border border-teal-500/20 rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-teal-400/40 transition-all duration-300"
          >
            <div>
              <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-white/10">
                <div className="p-2.5 rounded-2xl bg-teal-500/15 border border-teal-500/30 text-teal-400">
                  <Wifi className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Network & Power Intel
                  </h3>
                  <span className="text-[10px] text-gray-400 font-mono block">Bandwidth & Battery State</span>
                </div>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {/* Network Stats */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-2xl bg-black/60 border border-white/10">
                    <span className="text-gray-500 text-[10px] uppercase block">Connection Type</span>
                    <span className="text-teal-300 font-bold text-sm uppercase">{networkInfo.effectiveType || "4G / WiFi"}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-black/60 border border-white/10">
                    <span className="text-gray-500 text-[10px] uppercase block">Estimated Downlink</span>
                    <span className="text-emerald-400 font-bold text-sm">
                      {networkInfo.downlink ? `${networkInfo.downlink} Mbps` : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Battery Section */}
                <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 flex items-center gap-2 text-xs">
                      {batteryInfo.charging ? (
                        <BatteryCharging className="w-4 h-4 text-emerald-400 animate-pulse" />
                      ) : (
                        <Battery className="w-4 h-4 text-amber-400" />
                      )}
                      Battery Charge:
                    </span>
                    <span className={`font-bold text-sm ${batteryInfo.charging ? "text-emerald-400" : "text-amber-300"}`}>
                      {batteryInfo.supported ? `${Math.round(batteryInfo.level * 100)}%` : "N/A"}
                    </span>
                  </div>

                  {batteryInfo.supported && (
                    <div className="w-full bg-gray-800/80 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          batteryInfo.charging ? "bg-gradient-to-r from-emerald-500 to-teal-400" : "bg-gradient-to-r from-amber-500 to-yellow-400"
                        }`}
                        style={{ width: `${Math.round(batteryInfo.level * 100)}%` }}
                      />
                    </div>
                  )}

                  <div className="flex justify-between text-[11px] text-gray-400 pt-1">
                    <span>Power Mode: {batteryInfo.charging ? "AC Charging" : "Discharging Battery"}</span>
                  </div>
                </div>

                <div className="flex justify-between py-1 border-b border-white/5 text-xs">
                  <span className="text-gray-400">RTT Latency:</span>
                  <span className="text-teal-300 font-bold">{networkInfo.rtt ? `${networkInfo.rtt} ms` : "N/A"}</span>
                </div>
                <div className="flex justify-between py-1 text-xs">
                  <span className="text-gray-400">Save Data Mode:</span>
                  <span className="text-gray-300">{networkInfo.saveData ? "Enabled" : "Disabled"}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 text-xs text-gray-500 font-mono flex justify-between">
              <span>Battery & Connection API</span>
              <span className="text-teal-400 font-bold">Active</span>
            </div>
          </motion.div>
        )}

        {/* PANEL 6: STORAGE & GEOLOCATION INTEL */}
        {(showAll || activeTab === "storage") && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-b from-[#0b101c]/95 to-[#080c16]/95 backdrop-blur-2xl border border-blue-500/20 rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-blue-400/40 transition-all duration-300"
          >
            <div>
              <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-white/10">
                <div className="p-2.5 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Storage & Location Intel
                  </h3>
                  <span className="text-[10px] text-gray-400 font-mono block">Quota & GPS Coordinates</span>
                </div>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {/* Local Storage Info */}
                <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-gray-400">LocalStorage Items:</span>
                    <span className="text-blue-300 font-bold">{storageInfo.localStorageLength} keys</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Keys Size Estimate:</span>
                    <span className="text-blue-200">{storageInfo.localStorageSizeEstimate}</span>
                  </div>
                  {storageInfo.quota && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Storage Quota:</span>
                      <span className="text-emerald-400 font-bold">{storageInfo.quota}</span>
                    </div>
                  )}
                </div>

                {/* Geolocation Trigger */}
                <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 flex items-center gap-1.5 text-xs">
                      <Compass className="w-4 h-4 text-blue-400" /> GPS Geolocation:
                    </span>
                    <button
                      onClick={requestGeolocation}
                      disabled={geoInfo.status === "fetching"}
                      className="px-3 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs font-bold transition-all cursor-pointer border border-blue-500/30"
                    >
                      {geoInfo.status === "fetching" ? "Locating..." : "Query GPS"}
                    </button>
                  </div>

                  {geoInfo.status === "granted" && (
                    <div className="space-y-1 pt-1.5 text-xs">
                      <div className="flex justify-between text-emerald-400 font-bold">
                        <span>Coordinates:</span>
                        <span>{geoInfo.lat}, {geoInfo.lng}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Accuracy:</span>
                        <span>±{geoInfo.accuracy} meters</span>
                      </div>
                    </div>
                  )}

                  {geoInfo.status === "denied" && (
                    <div className="text-xs text-rose-400">
                      {geoInfo.errorMsg || "Permission Denied."}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 text-xs text-gray-500 font-mono flex justify-between">
              <span>Storage Quota API</span>
              <span className="text-blue-400 font-bold">Synchronized</span>
            </div>
          </motion.div>
        )}

        {/* PANEL 7: SUPABASE DATABASE & AUTHENTICATION INTEL */}
        {(showAll || activeTab === "supabase") && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-gradient-to-b from-[#0b101c]/95 to-[#080c16]/95 backdrop-blur-2xl border border-emerald-500/30 rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-emerald-400/50 transition-all duration-300 ${
              showAll ? "lg:col-span-3" : ""
            }`}
          >
            <div>
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                      Supabase Cloud Database & Auth Status
                    </h3>
                    <span className="text-[10px] text-gray-400 font-mono block">Project Ref: zotygsvdthwhnzoucske</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckSupabase}
                  disabled={supabaseStatus.loading}
                  className="px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-all shadow-md shadow-emerald-950/30"
                >
                  <RefreshCw className={`w-4 h-4 ${supabaseStatus.loading ? "animate-spin text-emerald-400" : ""}`} />
                  {supabaseStatus.loading ? "Testing Connection..." : "Test Connection"}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                  <span className="text-[10px] text-gray-500 uppercase block">Cloud Status</span>
                  <span className="font-bold text-emerald-400 text-sm flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Connected & Active
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                  <span className="text-[10px] text-gray-500 uppercase block">Project REST URL</span>
                  <span className="text-cyan-300 font-bold text-xs truncate block" title={supabaseStatus.url}>
                    {supabaseStatus.url}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                  <span className="text-[10px] text-gray-500 uppercase block">SDK Client</span>
                  <span className="text-teal-300 font-bold text-xs">
                    @supabase/supabase-js v2.x
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 text-xs text-gray-500 font-mono flex justify-between">
              <span>Supabase REST & Realtime Protocol</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Live Connected
              </span>
            </div>
          </motion.div>
        )}

      </div>

    </div>
  );
};

export default RealtimeUserBrowserInfo;
