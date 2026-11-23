"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/dashboard";

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(from);
        router.refresh();
      } else {
        setError(data.error || "Incorrect operations password. Access denied.");
        setIsLoading(false);
      }
    } catch {
      setError("Unable to connect to authorization service.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md z-10">
      <div className="bg-surface border border-border-subtle rounded-2xl p-8 shadow-2xl backdrop-blur-xl relative">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-canvas flex items-center justify-center border border-border-subtle mb-4 shadow-inner glow-indigo">
            <ShieldCheck className="w-8 h-8 text-junto-indigo" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-white">JUNTO</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-junto-indigo/10 text-junto-indigo-light font-mono font-medium border border-junto-indigo/20">
              OPS PORTAL
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            Protected operations gate for the verified college network
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-2">
              Operations Key
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter DASHBOARD_PASSWORD..."
                required
                autoFocus
                className="w-full pl-10 pr-10 py-3 bg-canvas border border-border-subtle rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-junto-indigo focus:border-transparent transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-200 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-junto-rose/10 border border-junto-rose/20 rounded-xl text-xs text-rose-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-junto-rose animate-ping" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !password}
            className="w-full py-3 px-4 bg-junto-indigo hover:bg-junto-indigo-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-junto-indigo/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authorizing Session...</span>
              </>
            ) : (
              <>
                <span>Unlock Operations Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer badge */}
        <div className="mt-8 pt-6 border-t border-border-subtle flex items-center justify-between text-xs text-gray-500 font-mono">
          <span>SESSION: AES-256</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-junto-green animate-pulse" />
            API GATE ONLINE
          </span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas px-4 relative overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-junto-indigo/5 rounded-full blur-3xl pointer-events-none" />

      <Suspense
        fallback={
          <div className="w-full max-w-md p-8 bg-surface border border-border-subtle rounded-2xl flex items-center justify-center text-gray-400 text-sm font-mono">
            <Loader2 className="w-6 h-6 animate-spin text-junto-indigo mr-2" />
            Loading portal...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
