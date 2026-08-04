import React, { useState } from "react";
import { Settings as SettingsIcon, User, Shield, Bell, Key, Save } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.name || "Eco Investor");
  const [email, setEmail] = useState(user?.email || "user@ecoverzz.ai");
  const [phone, setPhone] = useState(user?.phone || "+91 98765 43210");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [aiAlerts, setAiAlerts] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Settings Saved", {
      description: "User preferences updated successfully.",
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-emerald-400" />
          <span>Account & Security Settings</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage user profile information, security settings, and notifications
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-400" />
            <span>Profile Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled
                className="w-full p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 text-slate-400 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Role / Account Tier</label>
              <input
                type="text"
                value={`${user?.role || "Investor"} Mode`}
                disabled
                className="w-full p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 text-emerald-400 font-semibold cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Notifications Preference */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Bell className="w-4 h-4 text-teal-400" />
            <span>Notification Preferences</span>
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 cursor-pointer">
              <div>
                <p className="font-semibold text-slate-200">Email Trade Confirmations</p>
                <p className="text-[11px] text-slate-400">Receive instant transaction proofs via email</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 cursor-pointer">
              <div>
                <p className="font-semibold text-slate-200">AI Rebalancing Signals</p>
                <p className="text-[11px] text-slate-400">Receive push alerts when AI flags ESG portfolio shifts</p>
              </div>
              <input
                type="checkbox"
                checked={aiAlerts}
                onChange={(e) => setAiAlerts(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
