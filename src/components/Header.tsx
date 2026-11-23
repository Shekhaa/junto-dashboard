"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, RefreshCw, LogOut, Radio, Clock } from "lucide-react";

interface HeaderProps {
  lastUpdated: Date | null;
  autoRefresh: boolean;
  setAutoRefresh: (val: boolean) => void;
  onRefreshNow: () => void;
  isRefreshing: boolean;
  isMock?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  lastUpdated,
  autoRefresh,
  setAutoRefresh,
  onRefreshNow,
  isRefreshing,
  isMock,
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
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-surface border border-border-subtle flex items-center justify-center glow-indigo">
            <ShieldCheck className="w-5 h-5 text-junto-indigo" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white text-base">JUNTO</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-surface border border-border-subtle text-gray-300 font-mono">
                OPS &amp; TELEMETRY
              </span>
            </div>
            <p className="text-[11px] text-gray-400 hidden sm:block">
              Verified College Network Realtime Control Center
            </p>
          </div>
        </div>

        {/* Controls & Status */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Connection Pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-border-subtle text-xs">
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
              {isMock ? "Offline Buffer (Mock)" : "Django Live API"}
            </span>
          </div>

          {/* Last Updated */}
          {lastUpdated && (
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-gray-400 font-mono">
              <Clock className="w-3.5 h-3.5 text-gray-500" />
              <span>{lastUpdated.toLocaleTimeString()}</span>
            </div>
          )}

          {/* Auto Refresh Toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
              autoRefresh
                ? "bg-junto-indigo/10 border-junto-indigo/30 text-junto-indigo-light"
                : "bg-surface border-border-subtle text-gray-400 hover:text-gray-200"
            }`}
            title="Auto-refresh every 30 seconds"
          >
            <Radio className={`w-3.5 h-3.5 ${autoRefresh ? "animate-pulse" : ""}`} />
            <span className="hidden sm:inline">Auto 30s</span>
            <span className={`w-1.5 h-1.5 rounded-full ${autoRefresh ? "bg-junto-indigo" : "bg-gray-600"}`} />
          </button>

          {/* Manual Refresh Now */}
          <button
            onClick={onRefreshNow}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-hover border border-border-subtle text-xs font-medium text-white transition disabled:opacity-50"
            title="Trigger manual API refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-junto-indigo" : ""}`} />
            <span className="hidden sm:inline">Refresh Now</span>
          </button>

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
