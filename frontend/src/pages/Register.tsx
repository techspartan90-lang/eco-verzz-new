import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useRegisterForm, RegisterFormData } from "../hooks/useAuthForm";
import { ThemeToggle } from "../components/ThemeToggle";
import { toast } from "sonner";
import { 
  Leaf, Mail, Lock, User as UserIcon, Phone, UserCheck, 
  ArrowRight, AlertCircle, ShieldCheck, Eye, EyeOff, Sparkles, Check
} from "lucide-react";

export const Register: React.FC = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useRegisterForm();

  const selectedRole = watch("role", "Investor");

  const onSubmit = async (data: RegisterFormData) => {
    setApiError(null);
    try {
      await registerAuth({
        full_name: data.full_name,
        email: data.email,
        password: data.password,
        phone: data.phone || undefined,
        role: data.role,
      });
      toast.success("Account Created Successfully!", {
        description: `Welcome to EcoVerzz AI as an ${data.role}.`,
      });
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      const message = err.message || "Registration failed. Please try again.";
      setApiError(message);
      toast.error("Registration Failed", { description: message });
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-950 text-slate-100 dark:bg-slate-950 light:bg-slate-50 light:text-slate-900 overflow-hidden transition-colors duration-300">
      {/* Dynamic Ambient Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/20 dark:bg-emerald-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 -left-40 w-96 h-96 bg-teal-500/20 dark:bg-teal-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
      </div>

      {/* Top Header / Theme Switcher */}
      <header className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-slate-950 dark:bg-slate-950 light:bg-white rounded-[10px] flex items-center justify-center">
              <Leaf className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
            EcoVerzz AI
          </span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Main Register Container Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-xl z-10 my-20"
      >
        <div className="relative rounded-3xl bg-slate-900/80 dark:bg-slate-900/80 light:bg-white/90 backdrop-blur-xl border border-slate-800 dark:border-slate-800 light:border-slate-200 p-8 sm:p-10 shadow-2xl shadow-emerald-950/30 dark:shadow-black/50">
          
          {/* Card Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-4 text-emerald-400">
              <UserCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight dark:text-white light:text-slate-900">
              Create Your Account
            </h1>
            <p className="mt-2 text-sm text-slate-400 dark:text-slate-400 light:text-slate-600">
              Join the EcoVerzz movement and start building a sustainable future
            </p>
          </div>

          {/* Backend API Error Banner */}
          {apiError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-400 text-sm"
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{apiError}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            
            {/* Full Name & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <input
                    {...register("full_name")}
                    type="text"
                    placeholder="Jane Doe"
                    className={`w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-100 border text-sm transition-all duration-200 outline-none ${
                      errors.full_name
                        ? "border-rose-500 focus:ring-2 focus:ring-rose-500/30"
                        : "border-slate-800 dark:border-slate-700 light:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    } dark:text-white light:text-slate-900 placeholder:text-slate-500`}
                  />
                </div>
                {errors.full_name && (
                  <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.full_name.message}
                  </p>
                )}
              </div>

              {/* Phone (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
                  Phone Number <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <input
                    {...register("phone")}
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className={`w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-100 border text-sm transition-all duration-200 outline-none ${
                      errors.phone
                        ? "border-rose-500 focus:ring-2 focus:ring-rose-500/30"
                        : "border-slate-800 dark:border-slate-700 light:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    } dark:text-white light:text-slate-900 placeholder:text-slate-500`}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.phone.message}
                  </p>
                )}
              </div>

            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="jane@example.com"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-100 border text-sm transition-all duration-200 outline-none ${
                    errors.email
                      ? "border-rose-500 focus:ring-2 focus:ring-rose-500/30"
                      : "border-slate-800 dark:border-slate-700 light:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  } dark:text-white light:text-slate-900 placeholder:text-slate-500`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.email.message}
                </p>
              )}
            </div>

            {/* Password & Confirm Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`w-full pl-11 pr-11 py-3 rounded-xl bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-100 border text-sm transition-all duration-200 outline-none ${
                      errors.password
                        ? "border-rose-500 focus:ring-2 focus:ring-rose-500/30"
                        : "border-slate-800 dark:border-slate-700 light:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    } dark:text-white light:text-slate-900 placeholder:text-slate-500`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    {...register("confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`w-full pl-11 pr-11 py-3 rounded-xl bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-100 border text-sm transition-all duration-200 outline-none ${
                      errors.confirmPassword
                        ? "border-rose-500 focus:ring-2 focus:ring-rose-500/30"
                        : "border-slate-800 dark:border-slate-700 light:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    } dark:text-white light:text-slate-900 placeholder:text-slate-500`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.confirmPassword.message}
                  </p>
                )}
              </div>

            </div>

            {/* Role Selection Segmented Buttons */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 uppercase tracking-wider mb-2">
                Account Role
              </label>
              <div className="grid grid-cols-3 gap-2.5 p-1.5 rounded-2xl bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-300">
                {[
                  { value: "Investor", label: "Investor", desc: "Green Portfolios" },
                  { value: "Analyst", label: "Analyst", desc: "ESG Reports" },
                  { value: "Admin", label: "Admin", desc: "System Control" },
                ].map((roleOption) => {
                  const isSelected = selectedRole === roleOption.value;
                  return (
                    <label
                      key={roleOption.value}
                      className={`relative flex flex-col items-center justify-center py-2.5 px-2 rounded-xl cursor-pointer transition-all duration-200 text-center ${
                        isSelected
                          ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                      }`}
                    >
                      <input
                        {...register("role")}
                        type="radio"
                        value={roleOption.value}
                        className="sr-only"
                      />
                      <span className="text-sm font-semibold">{roleOption.label}</span>
                      <span className={`text-[10px] ${isSelected ? "text-slate-900/80 font-medium" : "text-slate-500"}`}>
                        {roleOption.desc}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 py-3.5 px-4 rounded-xl font-semibold text-sm text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-300 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/25 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>

          </form>

          {/* Footer Navigation */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 text-center">
            <p className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600">
              Already registered?{" "}
              <Link
                to="/login"
                className="font-semibold text-emerald-400 hover:text-emerald-300 underline underline-offset-4 transition-colors"
              >
                Sign in to your account
              </Link>
            </p>
          </div>

          {/* Security Badge */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Encrypted PostgreSQL & FastAPI Auth</span>
          </div>

        </div>
      </motion.div>
    </div>
  );
};
