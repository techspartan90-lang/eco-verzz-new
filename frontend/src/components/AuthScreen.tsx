import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Leaf, Mail, Lock, Shield, ArrowRight, User, Phone, KeyRound, CheckCircle2, ShieldCheck, ArrowLeft } from "lucide-react";
import { audioEngine } from "./AudioEngine";
import { useAuth } from "../context/AuthContext";
import { syncUserToSupabase } from "../services/supabaseClient";

interface AuthScreenProps {
  onSuccess: (profile: any) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess }) => {
  const { login, register, error: contextError, clearError } = useAuth();
  
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"Investor" | "Analyst" | "Admin">("Investor");
  
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const handleGoogleSignIn = () => {
    audioEngine.playTick();
    setLoading(true);
    setLocalError("");
    
    setTimeout(async () => {
      const guestProfile = {
        username: "Google Pioneer",
        email: "google-user@ecoverzz.net",
        role: "Investor",
        ecoPoints: 100,
        scannedItemsCount: 5,
        rank: "Ecosystem Scout",
        joinedAt: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      };
      
      localStorage.setItem("ecoverzz_profile", JSON.stringify(guestProfile));
      await syncUserToSupabase(guestProfile);
      
      audioEngine.playSuccessChime();
      setLoading(false);
      onSuccess(guestProfile);
    }, 1000);
  };

  const handleGuestMode = () => {
    audioEngine.playTick();
    setLoading(true);
    setLocalError("");

    setTimeout(async () => {
      const guestProfile = {
        username: "Pioneer Guest",
        email: "guest@ecoverzz.net",
        role: "Investor",
        ecoPoints: 50,
        scannedItemsCount: 2,
        rank: "Ecosystem Scout",
        joinedAt: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      };

      localStorage.setItem("ecoverzz_profile", JSON.stringify(guestProfile));
      await syncUserToSupabase(guestProfile);

      audioEngine.playSuccessChime();
      setLoading(false);
      onSuccess(guestProfile);
    }, 1000);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setLocalError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    audioEngine.playTick();

    setTimeout(() => {
      setLoading(false);
      setForgotSubmitted(true);
      audioEngine.playSuccessChime();
    }, 1200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    clearError();

    if (mode === "signup" && !fullName.trim()) {
      setLocalError("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setLocalError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    audioEngine.playTick();

    try {
      let profile;
      if (mode === "signup") {
        profile = await register({
          full_name: fullName.trim(),
          email: email.trim(),
          password: password,
          phone: phone.trim() || undefined,
          role: role,
        });
      } else {
        profile = await login(email.trim(), password);
      }

      await syncUserToSupabase(profile, password);

      setLoading(false);
      audioEngine.playSuccessChime();
      onSuccess(profile);
    } catch (err: any) {
      setLoading(false);
      const msg = err.detail || err.message || "Authentication failed. Please check your credentials.";
      setLocalError(msg);
    }
  };

  const displayError = localError || contextError;

  return (
    <div className="w-full max-w-md mx-auto px-6 py-4 z-30 relative font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -30 }}
        transition={{ type: "spring", stiffness: 60, damping: 15 }}
        className="bg-glass border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative p-6 md:p-8"
      >
        {/* Top gradient bar */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500" />

        {/* Brand Logo */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-14 h-14 mx-auto mb-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-center shadow-lg"
          >
            <Leaf className="w-7 h-7 text-emerald-400 animate-pulse" />
          </motion.div>
          
          <h2 className="text-2xl font-black text-white tracking-tight uppercase">
            {mode === "forgot"
              ? "Passkey Recovery"
              : mode === "signup"
              ? "Create Pioneer Profile"
              : "Sync Security Ledger"}
          </h2>
          <p className="text-gray-400 text-xs mt-1.5 max-w-xs mx-auto">
            {mode === "forgot"
              ? "Enter your registered email to receive authentication reset instructions."
              : mode === "signup"
              ? "Join the global alliance with custom role-based access."
              : "Welcome back. Log in to sync your active conservation ledger."}
          </p>
        </div>

        {/* Mode Selector Tabs (Login / Register) */}
        {mode !== "forgot" && (
          <div className="flex bg-white/[0.03] border border-white/5 p-1 rounded-xl mb-5 text-xs font-semibold">
            <button
              onClick={() => { audioEngine.playTick(); setMode("login"); setLocalError(""); clearError(); }}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                mode === "login" ? "bg-white/10 text-white font-bold" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { audioEngine.playTick(); setMode("signup"); setLocalError(""); clearError(); }}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                mode === "signup" ? "bg-white/10 text-white font-bold" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {displayError && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 font-medium text-center"
          >
            {displayError}
          </motion.div>
        )}

        {/* FORGOT PASSWORD SUBMITTED CONFIRMATION */}
        {mode === "forgot" && forgotSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4 space-y-4"
          >
            <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white">Reset Link Dispatched</h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
              Password recovery instructions have been sent to <strong className="text-emerald-400">{email}</strong>. Please check your inbox to reset your passkey.
            </p>
            <button
              onClick={() => { setForgotSubmitted(false); setMode("login"); }}
              className="mt-2 text-xs font-bold text-emerald-400 hover:underline flex items-center justify-center gap-1 mx-auto cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </button>
          </motion.div>
        ) : mode === "forgot" ? (
          /* FORGOT PASSWORD FORM */
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-3.5">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="w-4 h-4 text-gray-500" />
              </span>
              <input
                type="email"
                placeholder="Pioneer Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full py-3 pl-10 pr-4 bg-white/[0.02] hover:bg-white/[0.04] focus:bg-[#0c0c0d] text-xs text-white rounded-xl border border-white/10 focus:border-emerald-500/50 outline-none transition-all placeholder:text-gray-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 text-white font-bold text-xs shadow-lg hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Send Recovery Instructions</span>
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { setMode("login"); setLocalError(""); clearError(); }}
                className="text-[11px] text-gray-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1 mx-auto"
              >
                <ArrowLeft className="w-3 h-3" /> Back to Sign In
              </button>
            </div>
          </form>
        ) : (
          /* LOGIN & REGISTER FORM */
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name (Sign Up only) */}
            {mode === "signup" && (
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="w-4 h-4 text-gray-500" />
                </span>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                  className="w-full py-3 pl-10 pr-4 bg-white/[0.02] hover:bg-white/[0.04] focus:bg-[#0c0c0d] text-xs text-white rounded-xl border border-white/10 focus:border-emerald-500/50 outline-none transition-all placeholder:text-gray-600"
                />
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="w-4 h-4 text-gray-500" />
              </span>
              <input
                type="email"
                placeholder="Pioneer Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full py-3 pl-10 pr-4 bg-white/[0.02] hover:bg-white/[0.04] focus:bg-[#0c0c0d] text-xs text-white rounded-xl border border-white/10 focus:border-emerald-500/50 outline-none transition-all placeholder:text-gray-600"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="w-4 h-4 text-gray-500" />
              </span>
              <input
                type="password"
                placeholder="Master Passkey"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full py-3 pl-10 pr-4 bg-white/[0.02] hover:bg-white/[0.04] focus:bg-[#0c0c0d] text-xs text-white rounded-xl border border-white/10 focus:border-emerald-500/50 outline-none transition-all placeholder:text-gray-600"
              />
            </div>

            {/* Phone (Sign Up optional) */}
            {mode === "signup" && (
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Phone className="w-4 h-4 text-gray-500" />
                </span>
                <input
                  type="text"
                  placeholder="Phone Number (Optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                  className="w-full py-3 pl-10 pr-4 bg-white/[0.02] hover:bg-white/[0.04] focus:bg-[#0c0c0d] text-xs text-white rounded-xl border border-white/10 focus:border-emerald-500/50 outline-none transition-all placeholder:text-gray-600"
                />
              </div>
            )}

            {/* Role Selection Dropdown (Sign Up only) */}
            {mode === "signup" && (
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  Select Authorization Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Investor", "Analyst", "Admin"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => { audioEngine.playTick(); setRole(r); }}
                      className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                        role === r
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md shadow-emerald-500/10"
                          : "bg-white/[0.02] border-white/10 text-gray-400 hover:text-gray-200"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Forgot Password Link (Login mode only) */}
            {mode === "login" && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => { audioEngine.playTick(); setMode("forgot"); setLocalError(""); clearError(); }}
                  className="text-[11px] text-emerald-400 hover:underline cursor-pointer"
                >
                  Forgot Passkey?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 text-white font-bold text-xs shadow-lg hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>{mode === "signup" ? `Initiate ${role} Node` : "Sync Security Ledger"}</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Divider */}
        {mode !== "forgot" && (
          <>
            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink mx-3 text-[10px] text-gray-600 uppercase tracking-widest font-bold">or</span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            {/* Social logins */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="py-2.5 px-3 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 text-white rounded-xl flex items-center justify-center gap-2 transition-all text-[11px] font-bold cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                <span>Google</span>
              </button>
              
              <button
                onClick={handleGuestMode}
                disabled={loading}
                className="py-2.5 px-3 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 text-white rounded-xl flex items-center justify-center gap-2 transition-all text-[11px] font-bold cursor-pointer"
              >
                <span>Guest Mode</span>
              </button>
            </div>
          </>
        )}

        <div className="text-center text-[10px] text-gray-500 font-medium">
          By continuing, you agree to secure environmental data logging.
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center text-xs text-gray-500 font-medium tracking-wide mt-5 italic"
      >
        "Every small action creates a greener tomorrow."
      </motion.p>
    </div>
  );
};

export default AuthScreen;
