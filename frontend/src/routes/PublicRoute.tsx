import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "motion/react";
import { Leaf } from "lucide-react";

interface PublicRouteProps {
  children?: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, token, loading } = useAuth();

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
      </div>
    );
  }

  if (token && user) {
    // Redirect authenticated users to /dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
