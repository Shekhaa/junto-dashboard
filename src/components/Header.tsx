"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, RefreshCw, LogOut, Radio, Clock, ShieldAlert, Activity } from "lucide-react";

interface HeaderProps {
  lastUpdated: Date | null;
  autoRefresh: boolean;
  setAutoRefresh: (val: boolean) => void;
  onRefreshNow: () => void;
  isRefreshing: boolean;
  isMock?: boolean;
  activeTab?: "telemetry" | "moderation";
}

export const Header: React.FC<HeaderProps> = ({
  lastUpdated,
  autoRefresh,
  setAutoRefresh,
  onRefreshNow,
  isRefreshing,
  isMock,
  activeTab = "telemetry",
}) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    }
  };

  return (
    <header className="border-b border-border-subtle bg-canvas/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Nav Tabs */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-surface border border-border-subtle flex items-center justify-center glow-indigo">
              <ShieldCheck className="w-5 h-5 text-junto-indigo" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-white text-base">JUNTO</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-surface border border-border-subtle text-gray-300 font-mono">
                  OPS
                </span>
              </div>
            </div>
          </Link>

          {/* Navigation Tabs */}
          <nav className="hidden sm:flex items-center gap-1.5 p-1 bg-surface border border-border-subtle rounded-xl">
            <Link
              href="/dashboard"
              className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium transition ${
                activeTab === "telemetry"
                  ? "bg-canvas text-white border border-border-subtle shadow-sm"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-junto-indigo" />
              <span>Operations &amp; Telemetry</span>
            </Link>

            <Link
              href="/dashboard/reports"
              className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium transition ${
                activeTab === "moderation"
                  ? "bg-canvas text-white border border-border-subtle shadow-sm"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Safety &amp; Moderation</span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            </Link>
          </nav>
        </div>

        {/* Controls & Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Tab switchers */}
          <div className="sm:hidden flex items-center gap-1">
            <Link
              href="/dashboard"
              className={`p-1.5 rounded-lg border text-xs ${
                activeTab === "telemetry"
                  ? "bg-surface text-white border-junto-indigo"
                  : "text-gray-400 border-border-subtle"
              }`}
            >
              <Activity className="w-4 h-4 text-junto-indigo" />
            </Link>
            <Link
              href="/dashboard/reports"
              className={`p-1.5 rounded-lg border text-xs ${
                activeTab === "moderation"
                  ? "bg-surface text-white border-rose-500"
                  : "text-gray-400 border-border-subtle"
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </Link>
          </div>

          {/* Connection Pill */}
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-surface border border-border-subtle text-xs">
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isMock ? "bg-junto-amber" : "bg-junto-green"
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isMock ? "bg-junto-amber" : "bg-junto-green"
                }`}
              />
            </span>
            <span className="text-gray-300 font-medium">
              {isMock ? "Buffer Mode" : "Django Live API"}
            </span>
          </div>

          {/* Last Updated */}
          {lastUpdated && activeTab === "telemetry" && (
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-gray-400 font-mono">
              <Clock className="w-3.5 h-3.5 text-gray-500" />
              <span>{lastUpdated.toLocaleTimeString()}</span>
            </div>
          )}

          {/* Auto Refresh Toggle (Telemetry tab only) */}
          {activeTab === "telemetry" && (
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
                autoRefresh
                  ? "bg-junto-indigo/10 border-junto-indigo/30 text-junto-indigo-light"
                  : "bg-surface border-border-subtle text-gray-400 hover:text-gray-200"
              }`}
              title="Auto-refresh every 30 seconds"
            >
              <Radio className={`w-3.5 h-3.5 ${autoRefresh ? "animate-pulse" : ""}`} />
              <span>Auto 30s</span>
            </button>
          )}

          {/* Manual Refresh Now */}
          {activeTab === "telemetry" && (
            <button
              onClick={onRefreshNow}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-hover border border-border-subtle text-xs font-medium text-white transition disabled:opacity-50"
              title="Trigger manual API refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-junto-indigo" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-surface border border-transparent hover:border-border-subtle rounded-lg transition"
            title="Sign out of Operations Console"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
export default Header;
