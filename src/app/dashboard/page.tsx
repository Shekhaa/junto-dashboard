"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import { KpiRibbon } from "@/components/KpiRibbon";
import { PeakHoursChart } from "@/components/PeakHoursChart";
import { TelemetryTable } from "@/components/TelemetryTable";
import { CommunityRadar } from "@/components/CommunityRadar";
import { OpsOverviewResponse } from "@/types/ops";
import { Loader2, AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState<OpsOverviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = useCallback(async (isManual = false) => {
    if (isManual) {
      setIsRefreshing(true);
    }
    setError(null);

    try {
      const res = await fetch("/api/ops/overview", {
        method: "GET",
        headers: { "Accept": "application/json" },
        cache: "no-store",
        credentials: "include",
      });

      if (res.status === 401) {
        // Unauthorized or session expired - redirect to login wall
        window.location.href = "/login?from=/dashboard";
        return;
      }

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.hint || errJson.error || `Ops API returned status ${res.status}`);
      }

      const json: OpsOverviewResponse = await res.json();
      setData(json);
      setLastUpdated(new Date());
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error fetching ops data";
      setError(msg);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  // 30s Auto Refresh interval
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchOverview();
    }, 30000); // 30s

    return () => clearInterval(interval);
  }, [autoRefresh, fetchOverview]);

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      {/* Top Navigation */}
      <Header
        lastUpdated={lastUpdated}
        autoRefresh={autoRefresh}
        setAutoRefresh={setAutoRefresh}
        onRefreshNow={() => fetchOverview(true)}
        isRefreshing={isRefreshing}
        isMock={data?.is_mock}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Error notification banner if any */}
        {error && (
          <div className="p-4 bg-junto-rose/10 border border-junto-rose/30 rounded-2xl flex items-start gap-3 text-xs text-rose-300">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-rose-200">Live Backend Disconnected</p>
              <p className="text-gray-300 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* Loading state skeleton */}
        {isLoading && !data ? (
          <div className="h-96 flex flex-col items-center justify-center gap-3 text-gray-500 font-mono text-sm">
            <Loader2 className="w-8 h-8 text-junto-indigo animate-spin" />
            <span>Synchronizing live campus telemetry...</span>
          </div>
        ) : data ? (
          <>
            {/* 1. Real-Time KPI Ribbon */}
            <section>
              <KpiRibbon data={data.kpis} />
            </section>

            {/* 2. Campus Peak Hours Heatmap & 3. Community Radar */}
            <section className="space-y-6">
              <PeakHoursChart data={data.campus_peak_hours} />
              <CommunityRadar data={data.community_radar} />
            </section>

            {/* 4. Student In-Time & Out-Time Telemetry Table */}
            <section>
              <TelemetryTable data={data.telemetry} />
            </section>
          </>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle py-6 bg-canvas text-gray-500 text-xs font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-junto-green" />
            <span className="text-gray-400">Junto Telemetry Core v1.4.0</span>
            <span>&bull;</span>
            <span>Edge Mesh Active</span>
          </div>
          <div>
            Built for Junto (The Verified College Network) &bull; Deployable on Vercel
          </div>
        </div>
      </footer>
    </div>
  );
}
