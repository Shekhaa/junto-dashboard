"use client";

import React from "react";
import { Header } from "@/components/Header";
import { ReportsModerationTab } from "@/components/ReportsModerationTab";

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <Header
        lastUpdated={new Date()}
        autoRefresh={false}
        setAutoRefresh={() => {}}
        onRefreshNow={() => {}}
        isRefreshing={false}
        isMock={false}
        activeTab="moderation"
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ReportsModerationTab />
      </main>

      <footer className="border-t border-border-subtle py-6 bg-canvas text-gray-500 text-xs font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-junto-green" />
            <span className="text-gray-400">Junto Campus Trust &amp; Safety</span>
            <span>&bull;</span>
            <span>Zero-Tolerance Doxxing Shield</span>
          </div>
          <div>
            Junto Operations &bull; Staff Moderation Console
          </div>
        </div>
      </footer>
    </div>
  );
}
