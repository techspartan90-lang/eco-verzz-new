import React from "react";
import { Dashboard } from "../components/Dashboard";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, useParams } from "react-router-dom";

export const CitizenDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { view } = useParams<{ view: string }>();

  if (!user) return null;

  // Retrieve initialView from route parameter, fallback to state or "home"
  const initialView = view || location.state?.initialView || "home";

  return (
    <Dashboard
      profile={user}
      onLogout={logout}
      initialView={initialView}
      onBackToWebsite={() => navigate("/")}
      hideSidebar={true}
    />
  );
};

export default CitizenDashboard;
