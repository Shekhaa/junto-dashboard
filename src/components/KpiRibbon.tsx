"use client";

import React from "react";
import { Users, TrendingUp, Clock, ShieldCheck, Activity } from "lucide-react";
import { KpiData } from "@/types/ops";

interface KpiRibbonProps {
  data: KpiData;
}

export const KpiRibbon: React.FC<KpiRibbonProps> = ({ data }) => {
  const { online_now, today_dau, dau_growth_pct, avg_session_duration_mins, verification_funnel } = data;

  const totalFunnel =
    verification_funnel.fully_verified +
    verification_funnel.semi_verified +
    verification_funnel.pending_id_card;

  const fullyVerifiedPct = totalFunnel > 0 ? Math.round((verification_funnel.fully_verified / totalFunnel) * 100) : 0;
  const semiVerifiedPct = totalFunnel > 0 ? Math.round((verification_funnel.semi_verified / totalFunnel) * 100) : 0;
  const pendingIdPct = totalFunnel > 0 ? 100 - fullyVerifiedPct - semiVerifiedPct : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Online Now */}
      <div className="bg-surface border border-border-subtle rounded-2xl p-5 relative overflow-hidden group hover:border-border-focus transition shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Online Now</span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-junto-green/10 text-junto-green-light border border-junto-green/20 text-[11px] font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-junto-green opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-junto-green" />
            </span>
            <span>LIVE</span>
          </div>
        </div>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
            {online_now.toLocaleString()}
          </span>
          <span className="text-xs text-gray-400 font-medium">students</span>
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
          <Activity className="w-3.5 h-3.5 text-junto-green" />
          <span>Active in last 5 minutes</span>
        </div>

        {/* Ambient bottom glow */}
        <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-junto-green/10 rounded-full blur-2xl group-hover:bg-junto-green/20 transition" />
      </div>

      {/* 2. Today's DAU */}
      <div className="bg-surface border border-border-subtle rounded-2xl p-5 relative overflow-hidden group hover:border-border-focus transition shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Today's DAU</span>
          <div className="w-8 h-8 rounded-lg bg-canvas border border-border-subtle flex items-center justify-center text-junto-indigo">
            <Users className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
            {today_dau.toLocaleString()}
          </span>
          <div className={`flex items-center text-xs font-mono font-medium ${
            dau_growth_pct >= 0 ? "text-junto-green" : "text-junto-rose"
          }`}>
            <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
            {dau_growth_pct >= 0 ? `+${dau_growth_pct}%` : `${dau_growth_pct}%`}
          </div>
        </div>

        <div className="mt-3 text-xs text-gray-400">
          <span>Day-over-Day campus traffic</span>
        </div>

        <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-junto-indigo/10 rounded-full blur-2xl group-hover:bg-junto-indigo/20 transition" />
      </div>

      {/* 3. Average Session Duration */}
      <div className="bg-surface border border-border-subtle rounded-2xl p-5 relative overflow-hidden group hover:border-border-focus transition shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Avg Session Duration</span>
          <div className="w-8 h-8 rounded-lg bg-canvas border border-border-subtle flex items-center justify-center text-junto-indigo-light">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-4 flex items-baseline gap-1.5">
          <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
            {avg_session_duration_mins}
          </span>
          <span className="text-xs text-gray-400 font-medium">mins / session</span>
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
          <span className="w-1.5 h-1.5 rounded-full bg-junto-indigo" />
          <span>Campus WiFi + 5G app stickiness</span>
        </div>

        <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-junto-indigo/10 rounded-full blur-2xl group-hover:bg-junto-indigo/20 transition" />
      </div>

      {/* 4. Verification Funnel */}
      <div className="bg-surface border border-border-subtle rounded-2xl p-5 relative overflow-hidden group hover:border-border-focus transition shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Verification Funnel</span>
          <div className="w-8 h-8 rounded-lg bg-canvas border border-border-subtle flex items-center justify-center text-junto-green">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        {/* Multi-segment progress bar */}
        <div className="mt-4">
          <div className="flex h-2.5 w-full rounded-full overflow-hidden bg-canvas border border-border-subtle">
            <div
              style={{ width: `${fullyVerifiedPct}%` }}
              className="bg-junto-green transition-all duration-500"
              title={`Fully Verified: ${verification_funnel.fully_verified} (${fullyVerifiedPct}%)`}
            />
            <div
              style={{ width: `${semiVerifiedPct}%` }}
              className="bg-junto-indigo transition-all duration-500"
              title={`Semi-Verified: ${verification_funnel.semi_verified} (${semiVerifiedPct}%)`}
            />
            <div
              style={{ width: `${pendingIdPct}%` }}
              className="bg-junto-amber transition-all duration-500"
              title={`Pending ID Card: ${verification_funnel.pending_id_card} (${pendingIdPct}%)`}
            />
          </div>
        </div>

        {/* Funnel Breakdown */}
        <div className="mt-3 flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-junto-green" />
            <span className="text-gray-300">{verification_funnel.fully_verified}</span>
            <span className="text-gray-500">Full</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-junto-indigo" />
            <span className="text-gray-300">{verification_funnel.semi_verified}</span>
            <span className="text-gray-500">Semi</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-junto-amber" />
            <span className="text-gray-300">{verification_funnel.pending_id_card}</span>
            <span className="text-gray-500">ID OCR</span>
          </div>
        </div>
      </div>
    </div>
  );
};
