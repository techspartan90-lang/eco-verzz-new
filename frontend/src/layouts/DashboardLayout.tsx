import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { SearchModal } from "../components/Common/SearchModal";
import { ErrorBoundary } from "../components/Common/ErrorBoundary";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

export const DashboardLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 dark:bg-slate-950 light:bg-slate-50 light:text-slate-900 transition-colors duration-300 font-sans">
      {/* Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      <div className="flex flex-1 relative overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:block shrink-0">
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileDrawerOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileDrawerOpen(false)}
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
              />
              {/* Drawer Container */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-0 left-0 bottom-0 w-72 z-50 md:hidden shadow-2xl flex"
              >
                <div className="relative w-full h-full">
                  <Sidebar
                    collapsed={false}
                    onToggleCollapse={() => {}}
                    mobileOpen={mobileDrawerOpen}
                    onCloseMobile={() => setMobileDrawerOpen(false)}
                  />
                  <button
                    onClick={() => setMobileDrawerOpen(false)}
                    className="absolute top-4 right-3 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto overflow-x-hidden">
          {/* Top Navbar */}
          <Navbar
            onOpenMobileMenu={() => setMobileDrawerOpen(true)}
            onOpenSearch={() => setSearchModalOpen(true)}
          />

          {/* Dynamic Nested Route Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </main>

          {/* Application Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
};
