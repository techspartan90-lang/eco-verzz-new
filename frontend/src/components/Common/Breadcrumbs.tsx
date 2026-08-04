import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const routeNameMap: Record<string, string> = {
  dashboard: "Dashboard",
  portfolio: "Portfolio",
  "mutual-funds": "Mutual Funds",
  recommendations: "AI Recommendations",
  compare: "Compare Funds",
  reports: "Reports",
  watchlist: "Watchlist",
  notifications: "Notifications",
  settings: "Settings",
  admin: "Admin Control",
};

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex items-center space-x-1.5 text-xs font-medium text-slate-400 dark:text-slate-400 light:text-slate-500">
      <Link
        to="/dashboard"
        className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="sr-only">Home</span>
      </Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const displayName = routeNameMap[value] || value.replace("-", " ");

        return (
          <React.Fragment key={to}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 dark:text-slate-600 light:text-slate-300 flex-shrink-0" />
            {isLast ? (
              <span className="font-semibold text-slate-100 dark:text-slate-100 light:text-slate-900 capitalize">
                {displayName}
              </span>
            ) : (
              <Link
                to={to}
                className="hover:text-emerald-400 capitalize transition-colors"
              >
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
