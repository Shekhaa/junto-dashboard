"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, Download, ChevronLeft, ChevronRight, UserCheck, UserX } from "lucide-react";
import { StudentTelemetry } from "@/types/ops";

interface TelemetryTableProps {
  data: StudentTelemetry[];
}

export const TelemetryTable: React.FC<TelemetryTableProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("ALL");
  const [selectedYear, setSelectedYear] = useState("ALL");
  const [selectedSection, setSelectedSection] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Extract unique filter options
  const colleges = useMemo(() => {
    const list = Array.from(new Set(data.map((d) => d.college)));
    return ["ALL", ...list];
  }, [data]);

  const years = useMemo(() => {
    const list = Array.from(new Set(data.map((d) => d.year)));
    return ["ALL", ...list];
  }, [data]);

  const sections = useMemo(() => {
    const list = Array.from(new Set(data.map((d) => d.section)));
    return ["ALL", ...list];
  }, [data]);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        item.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.roll_no.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCollege = selectedCollege === "ALL" || item.college === selectedCollege;
      const matchesYear = selectedYear === "ALL" || item.year === selectedYear;
      const matchesSection = selectedSection === "ALL" || item.section === selectedSection;

      return matchesSearch && matchesCollege && matchesYear && matchesSection;
    });
  }, [data, searchTerm, selectedCollege, selectedYear, selectedSection]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // CSV Export
  const handleExportCSV = () => {
    const headers = ["Student Name", "Roll No", "College", "Year", "Section", "In-Time", "Out-Time", "Duration", "Status"];
    const rows = filteredData.map((d) => [
      d.student_name,
      d.roll_no,
      d.college,
      d.year,
      d.section,
      d.in_time,
      d.out_time,
      d.duration,
      d.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map((val) => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `junto_student_telemetry_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-surface border border-border-subtle rounded-2xl shadow-xl overflow-hidden">
      {/* Table Header & Controls */}
      <div className="p-6 border-b border-border-subtle flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-white tracking-tight">
              Student In-Time &amp; Out-Time Telemetry
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-surface border border-border-subtle text-xs text-gray-400 font-mono">
              {filteredData.length} active logs
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Realtime entry, dwell duration, and exit telemetry across campus gateways
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search student or roll no..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 bg-canvas border border-border-subtle rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-junto-indigo focus:border-junto-indigo"
            />
          </div>

          {/* College Filter */}
          <select
            value={selectedCollege}
            onChange={(e) => {
              setSelectedCollege(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-canvas border border-border-subtle rounded-xl px-2.5 py-1.5 text-xs text-gray-300 focus:outline-none focus:ring-1 focus:ring-junto-indigo"
          >
            {colleges.map((col) => (
              <option key={col} value={col}>
                {col === "ALL" ? "All Colleges" : col}
              </option>
            ))}
          </select>

          {/* Year Filter */}
          <select
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-canvas border border-border-subtle rounded-xl px-2.5 py-1.5 text-xs text-gray-300 focus:outline-none focus:ring-1 focus:ring-junto-indigo"
          >
            {years.map((yr) => (
              <option key={yr} value={yr}>
                {yr === "ALL" ? "All Years" : yr}
              </option>
            ))}
          </select>

          {/* Section Filter */}
          <select
            value={selectedSection}
            onChange={(e) => {
              setSelectedSection(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-canvas border border-border-subtle rounded-xl px-2.5 py-1.5 text-xs text-gray-300 focus:outline-none focus:ring-1 focus:ring-junto-indigo"
          >
            {sections.map((sec) => (
              <option key={sec} value={sec}>
                {sec === "ALL" ? "All Sections" : `Sec ${sec}`}
              </option>
            ))}
          </select>

          {/* CSV Export */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-canvas hover:bg-surface-hover border border-border-subtle rounded-xl text-xs font-medium text-gray-300 hover:text-white transition"
            title="Export filtered records as CSV"
          >
            <Download className="w-3.5 h-3.5 text-gray-400" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-canvas/50 border-b border-border-subtle text-gray-400 font-mono uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4 font-medium">Student Name</th>
              <th className="py-3 px-4 font-medium">Roll No</th>
              <th className="py-3 px-4 font-medium">College</th>
              <th className="py-3 px-4 font-medium">Year &amp; Sec</th>
              <th className="py-3 px-4 font-medium">In-Time</th>
              <th className="py-3 px-4 font-medium">Out-Time</th>
              <th className="py-3 px-4 font-medium">Duration</th>
              <th className="py-3 px-4 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle text-gray-300">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-gray-500 font-mono">
                  No telemetry records match your current filter criteria.
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
                <tr key={item.id} className="hover:bg-surface-hover/50 transition">
                  {/* Student Name */}
                  <td className="py-3.5 px-4 font-medium text-white flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-junto-indigo/10 border border-junto-indigo/20 flex items-center justify-center text-[10px] text-junto-indigo-light font-bold">
                      {item.student_name.charAt(0)}
                    </div>
                    <span>{item.student_name}</span>
                  </td>

                  {/* Roll No */}
                  <td className="py-3.5 px-4 font-mono text-gray-400">{item.roll_no}</td>

                  {/* College */}
                  <td className="py-3.5 px-4 text-gray-300">{item.college}</td>

                  {/* Year & Sec */}
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-gray-400">{item.year}</span>
                    <span className="ml-1.5 px-1.5 py-0.5 rounded bg-canvas border border-border-subtle font-mono text-[10px] text-gray-300">
                      Sec {item.section}
                    </span>
                  </td>

                  {/* In-Time */}
                  <td className="py-3.5 px-4 font-mono text-gray-300">{item.in_time}</td>

                  {/* Out-Time */}
                  <td className="py-3.5 px-4 font-mono text-gray-400">
                    {item.out_time === "--:--:--" ? (
                      <span className="text-gray-500 italic">--:--:--</span>
                    ) : (
                      item.out_time
                    )}
                  </td>

                  {/* Duration */}
                  <td className="py-3.5 px-4 font-mono text-xs">
                    <span className={item.status === "online" ? "text-junto-green-light" : "text-gray-400"}>
                      {item.duration}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 text-right">
                    {item.status === "online" ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-junto-green/10 text-junto-green-light border border-junto-green/20 text-[11px] font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-junto-green animate-pulse" />
                        Online
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-canvas text-gray-400 border border-border-subtle text-[11px] font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                        Offline
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-border-subtle flex items-center justify-between text-xs text-gray-400">
        <div>
          Showing page <span className="text-white font-mono">{currentPage}</span> of{" "}
          <span className="text-white font-mono">{totalPages}</span> ({filteredData.length} records)
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg bg-canvas border border-border-subtle hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed text-gray-300 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg bg-canvas border border-border-subtle hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed text-gray-300 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
