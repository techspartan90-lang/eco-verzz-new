import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "motion/react";
import { Leaf } from "lucide-react";

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="relative flex items-center justify-center p-4 rounded-full bg-emerald-500/10 border border-emerald-500/30"
        >
          <Leaf className="w-8 h-8 text-emerald-400" />
        </motion.div>
        <p className="mt-4 text-sm text-slate-400 font-medium tracking-wide">
          Verifying session...
        </p>
      </div>
    );
  }

  if (!token || !user) {
    // Redirect unauthenticated user to /login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
