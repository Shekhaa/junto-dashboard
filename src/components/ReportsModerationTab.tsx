"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  Lock,
  Trash2,
  UserX,
  CheckCircle,
  RefreshCw,
  Search,
  Filter,
  EyeOff,
  User,
  ShieldCheck,
  Ban,
  Radio,
} from "lucide-react";
import { ReportedPost, ModerationStats } from "@/types/ops";

export function ReportsModerationTab() {
  const [reports, setReports] = useState<ReportedPost[]>([]);
  const [stats, setStats] = useState<ModerationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<"ALL" | "AUTO_HIDDEN" | "HIGH_PRIORITY">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeActionId, setActiveActionId] = useState<number | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchReportsAndStats = async () => {
    try {
      setLoading(true);
      const [reportsRes, statsRes] = await Promise.all([
        fetch("/api/ops/moderation/reports", { cache: "no-store", credentials: "include" }),
        fetch("/api/ops/moderation/stats", { cache: "no-store", credentials: "include" }),
      ]);

      if (reportsRes.status === 401 || statsRes.status === 401) {
        window.location.href = "/login?from=/dashboard/reports";
        return;
      }

      const reportsData = await reportsRes.json();
      const statsData = await statsRes.json();

      setReports(reportsData);
      setStats(statsData);
    } catch (err) {
      console.error("Failed to load moderation data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsAndStats();
  }, []);

  const handleAction = async (postId: number, action: "dismiss" | "delete" | "ban_user") => {
    const actionLabel =
      action === "delete"
        ? "DELETE this post permanently from campus feeds"
        : action === "ban_user"
        ? "BAN this student account and revoke all login sessions"
        : "DISMISS reports and restore this post to clean status";

    if (!confirm(`Are you sure you want to ${actionLabel}?`)) return;

    setActiveActionId(postId);
    try {
      const res = await fetch(`/api/ops/moderation/action/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action }),
      });

      const data = await res.json();

      if (res.ok) {
        setReports((prev) => prev.filter((r) => r.id !== postId));
        setFeedbackMessage({
          text: data.message || `Action '${action}' executed successfully.`,
          type: "success",
        });

        // Update stats optimistically
        if (stats) {
          setStats({
            ...stats,
            pending_reports: Math.max(stats.pending_reports - 1, 0),
            banned_users: action === "ban_user" ? stats.banned_users + 1 : stats.banned_users,
          });
        }
      } else {
        alert(data.error || "Action failed.");
      }
    } catch (err) {
      alert(`Action error: ${err}`);
    } finally {
      setActiveActionId(null);
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  const filteredReports = useMemo(() => {
    return reports.filter((post) => {
      const matchesSearch =
        searchTerm === "" ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author_roll.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.reasons.some((r) => r.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesFilter =
        filterType === "ALL"
          ? true
          : filterType === "AUTO_HIDDEN"
          ? post.is_hidden
          : post.reports_count >= 6;

      return matchesSearch && matchesFilter;
    });
  }, [reports, searchTerm, filterType]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-junto-rose/10 border border-junto-rose/20 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Campus Safety &amp; Moderation Command
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Realtime triage for reported student confessions, AI doxxing alerts, and faculty defamation flags
          </p>
        </div>

        <button
          onClick={fetchReportsAndStats}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2 bg-surface hover:bg-surface-hover border border-border-subtle rounded-xl text-xs font-medium text-white transition disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-junto-indigo" : ""}`} />
          <span>Refresh Reports</span>
        </button>
      </div>

      {/* Summary KPI Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface border border-border-subtle rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Pending Reports</span>
            <AlertTriangle className="w-4 h-4 text-junto-amber" />
          </div>
          <div className="mt-3 text-2xl font-bold font-mono text-white">
            {stats ? stats.pending_reports : "..."}
          </div>
          <div className="mt-1 text-[11px] text-amber-400/80">Requires staff triage</div>
        </div>

        <div className="bg-surface border border-border-subtle rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Auto-Hidden by AI</span>
            <Lock className="w-4 h-4 text-junto-indigo" />
          </div>
          <div className="mt-3 text-2xl font-bold font-mono text-white">
            {stats ? stats.auto_hidden_posts : "..."}
          </div>
          <div className="mt-1 text-[11px] text-indigo-400/80">Hidden from student feed</div>
        </div>

        <div className="bg-surface border border-border-subtle rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Doxxing Intercepts</span>
            <ShieldCheck className="w-4 h-4 text-junto-green" />
          </div>
          <div className="mt-3 text-2xl font-bold font-mono text-white">
            {stats ? stats.doxxing_attempts_blocked : "..."}
          </div>
          <div className="mt-1 text-[11px] text-emerald-400/80">Phone/ID blocks this week</div>
        </div>

        <div className="bg-surface border border-border-subtle rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Banned Students</span>
            <Ban className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-3 text-2xl font-bold font-mono text-white">
            {stats ? stats.banned_users : "..."}
          </div>
          <div className="mt-1 text-[11px] text-rose-400/80">Deactivated &amp; revoked</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface p-3 border border-border-subtle rounded-2xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
              filterType === "ALL"
                ? "bg-junto-indigo text-white"
                : "bg-canvas text-gray-400 hover:text-white border border-border-subtle"
            }`}
          >
            All Reports ({reports.length})
          </button>
          <button
            onClick={() => setFilterType("AUTO_HIDDEN")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
              filterType === "AUTO_HIDDEN"
                ? "bg-junto-indigo text-white"
                : "bg-canvas text-gray-400 hover:text-white border border-border-subtle"
            }`}
          >
            Auto-Hidden
          </button>
          <button
            onClick={() => setFilterType("HIGH_PRIORITY")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
              filterType === "HIGH_PRIORITY"
                ? "bg-junto-indigo text-white"
                : "bg-canvas text-gray-400 hover:text-white border border-border-subtle"
            }`}
          >
            High Severity (&ge;6 Reports)
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search content, student name, roll..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-canvas border border-border-subtle rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-junto-indigo"
          />
        </div>
      </div>

      {/* Feedback Toast */}
      {feedbackMessage && (
        <div className="p-3 bg-junto-green/10 border border-junto-green/20 rounded-xl text-xs text-junto-green-light flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-junto-green shrink-0" />
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {/* Reports Feed List */}
      {loading && reports.length === 0 ? (
        <div className="py-20 text-center text-gray-500 font-mono text-sm">
          <RefreshCw className="w-6 h-6 animate-spin text-junto-indigo mx-auto mb-2" />
          Loading flagged reports...
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="p-12 text-center bg-surface rounded-2xl border border-border-subtle">
          <div className="w-12 h-12 rounded-full bg-junto-green/10 text-junto-green flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white">Campus Feed is Clean</h3>
          <p className="text-xs text-gray-400 mt-1">
            No active posts match your current moderation filter. Great work!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((post) => (
            <div
              key={post.id}
              className="bg-surface border border-border-subtle hover:border-border-focus rounded-2xl p-5 shadow-xl transition relative overflow-hidden"
            >
              {/* Top Banner: Reports Count & Unmasked Author Identity */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-border-subtle">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-junto-rose/10 text-rose-400 border border-junto-rose/20 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {post.reports_count} Reports
                  </span>

                  {post.is_hidden && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium font-mono bg-canvas text-gray-300 border border-border-subtle flex items-center gap-1">
                      <Lock className="w-3 h-3 text-junto-indigo" />
                      Auto-Hidden
                    </span>
                  )}

                  {post.is_anonymous ? (
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1">
                      <EyeOff className="w-3 h-3" />
                      Posted Anonymously
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-canvas text-gray-400 border border-border-subtle flex items-center gap-1">
                      <User className="w-3 h-3" />
                      Public Identity
                    </span>
                  )}
                </div>

                {/* Unmasked Author Details */}
                <div className="flex items-center gap-2 text-xs font-mono text-gray-300 bg-canvas px-3 py-1.5 rounded-xl border border-border-subtle">
                  <span className="text-gray-500">Unmasked Author:</span>
                  <span className="text-white font-bold">{post.author_name}</span>
                  <span className="text-gray-500">&bull;</span>
                  <span className="text-junto-indigo-light">Roll: {post.author_roll}</span>
                  {post.author_email && (
                    <>
                      <span className="text-gray-500 hidden sm:inline">&bull;</span>
                      <span className="text-gray-400 hidden sm:inline">{post.author_email}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Content Body */}
              <div className="mt-4 p-4 rounded-xl bg-canvas border border-border-subtle">
                <p className="text-sm text-gray-100 whitespace-pre-wrap leading-relaxed font-sans">
                  {post.content}
                </p>
              </div>

              {/* Reasons & Timestamp */}
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-gray-500 font-medium mr-1">Flag Reasons:</span>
                  {post.reasons.map((reason, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-junto-amber/10 text-amber-300 text-xs rounded-lg border border-junto-amber/20 font-mono"
                    >
                      {reason}
                    </span>
                  ))}
                </div>

                <div className="text-[11px] text-gray-500 font-mono">
                  Reported at {new Date(post.created_at).toLocaleTimeString()}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-border-subtle flex flex-wrap items-center justify-end gap-2.5">
                <button
                  onClick={() => handleAction(post.id, "dismiss")}
                  disabled={activeActionId === post.id}
                  className="px-3.5 py-1.5 text-xs font-medium text-gray-300 hover:text-white bg-canvas hover:bg-surface border border-border-subtle rounded-xl transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-gray-400" />
                  <span>Dismiss Report</span>
                </button>

                <button
                  onClick={() => handleAction(post.id, "delete")}
                  disabled={activeActionId === post.id}
                  className="px-3.5 py-1.5 text-xs font-medium text-rose-300 hover:text-white bg-junto-rose/10 hover:bg-junto-rose border border-junto-rose/30 rounded-xl transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Post</span>
                </button>

                <button
                  onClick={() => handleAction(post.id, "ban_user")}
                  disabled={activeActionId === post.id}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition shadow-lg shadow-rose-600/30 disabled:opacity-50 flex items-center gap-1.5"
                >
                  <UserX className="w-3.5 h-3.5" />
                  <span>Ban Student</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default ReportsModerationTab;
