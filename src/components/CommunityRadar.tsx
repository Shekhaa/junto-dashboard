"use client";

import React from "react";
import { MessageSquare, BarChart2, MessageCircle, Zap, Radio } from "lucide-react";
import { CommunityRadarData } from "@/types/ops";

interface CommunityRadarProps {
  data: CommunityRadarData;
}

export const CommunityRadar: React.FC<CommunityRadarProps> = ({ data }) => {
  const { posts_today, polls_voted_today, chat_messages_today } = data;

  const totalActions = posts_today + polls_voted_today + chat_messages_today;

  return (
    <div className="bg-surface border border-border-subtle rounded-2xl p-6 shadow-xl">
      {/* Title & Velocity */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-junto-indigo animate-pulse" />
            <h3 className="text-base font-semibold text-white tracking-tight">
              Content &amp; Community Radar
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Realtime student interactions, campus discourse, and peer chat volume
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-canvas border border-border-subtle text-xs font-mono">
          <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-gray-300">Total Interactions Today:</span>
          <span className="text-white font-bold">{totalActions.toLocaleString()}</span>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Posts Created Today */}
        <div className="bg-canvas border border-border-subtle rounded-xl p-4 relative overflow-hidden group hover:border-border-focus transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Posts Created</span>
            <div className="w-7 h-7 rounded-lg bg-surface border border-border-subtle flex items-center justify-center text-junto-indigo">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">
              {posts_today.toLocaleString()}
            </span>
            <span className="text-[11px] text-gray-400">new threads</span>
          </div>
          <div className="mt-2 text-[11px] text-gray-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-junto-indigo" />
            <span>Campus feeds + Confessions</span>
          </div>
        </div>

        {/* 2. Polls Voted Today */}
        <div className="bg-canvas border border-border-subtle rounded-xl p-4 relative overflow-hidden group hover:border-border-focus transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Polls Voted</span>
            <div className="w-7 h-7 rounded-lg bg-surface border border-border-subtle flex items-center justify-center text-junto-amber">
              <BarChart2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">
              {polls_voted_today.toLocaleString()}
            </span>
            <span className="text-[11px] text-gray-400">student votes</span>
          </div>
          <div className="mt-2 text-[11px] text-gray-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-junto-amber" />
            <span>High campus engagement</span>
          </div>
        </div>

        {/* 3. Active Chat Messages */}
        <div className="bg-canvas border border-border-subtle rounded-xl p-4 relative overflow-hidden group hover:border-border-focus transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Active Chat Messages</span>
            <div className="w-7 h-7 rounded-lg bg-surface border border-border-subtle flex items-center justify-center text-junto-green">
              <MessageCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">
              {chat_messages_today.toLocaleString()}
            </span>
            <span className="text-[11px] text-gray-400">exchanged</span>
          </div>
          <div className="mt-2 text-[11px] text-gray-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-junto-green" />
            <span>P2P DMs &amp; ephemeral hangouts</span>
          </div>
        </div>
      </div>
    </div>
  );
};
