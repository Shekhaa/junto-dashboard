"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Flame, Sun, Coffee, Moon } from "lucide-react";
import { HourlyHeatmap } from "@/types/ops";

interface PeakHoursChartProps {
  data: HourlyHeatmap[];
}

export const PeakHoursChart: React.FC<PeakHoursChartProps> = ({ data }) => {
  return (
    <div className="bg-surface border border-border-subtle rounded-2xl p-6 shadow-xl">
      {/* Header & Milestone Legend */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-junto-indigo" />
            <h3 className="text-base font-semibold text-white tracking-tight">
              Campus Peak Hours Heatmap (24-Hour Distribution)
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Aggregate realtime network telemetry bucketed across daily campus routines
          </p>
        </div>

        {/* Milestone Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-canvas border border-border-subtle text-xs text-amber-300 font-mono">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>Morning Rush (08:00 - 10:00)</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-canvas border border-border-subtle text-xs text-emerald-300 font-mono">
            <Coffee className="w-3.5 h-3.5 text-emerald-400" />
            <span>Canteen Lunch (12:00 - 14:00)</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-canvas border border-border-subtle text-xs text-indigo-300 font-mono">
            <Moon className="w-3.5 h-3.5 text-indigo-400" />
            <span>Hostel Primetime (20:00 - 23:00)</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="indigoAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.45} />
                <stop offset="50%" stopColor="#6366F1" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#1F2937" strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="hour"
              stroke="#6B7280"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#1F2937" }}
              interval={2}
            />

            <YAxis
              stroke="#6B7280"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#1F2937" }}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as HourlyHeatmap;
                  return (
                    <div className="bg-canvas border border-border-focus rounded-xl p-3 shadow-2xl backdrop-blur-md">
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <span className="text-xs font-mono font-medium text-gray-400">{item.hour}</span>
                        {item.tag && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-junto-indigo/20 text-junto-indigo-light border border-junto-indigo/30 font-medium">
                            {item.tag}
                          </span>
                        )}
                      </div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-bold text-white font-mono">
                          {item.active_users.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-400">concurrent students</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey="active_users"
              stroke="#6366F1"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#indigoAreaGradient)"
              activeDot={{
                r: 6,
                fill: "#10B981",
                stroke: "#0B0F19",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
