"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/auth";
import { Lock, Mail, ShieldAlert, ArrowRight, CheckCircle2, Ticket } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please provide both email and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await login({ email, password });
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password123");
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 shadow-lg shadow-emerald-500/5">
            <Ticket className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
            FreshAgent Hub
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Sign in to access your agent portal and ticket queue
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#131b2e]/80 border border-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3 text-rose-400 text-sm">
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="agent1@freshagent.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0b0f19]/80 border border-gray-700/60 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0b0f19]/80 border border-gray-700/60 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-[#0b0f19] font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-[#0b0f19] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-gray-800/80">
            <p className="text-xs font-medium text-gray-400 text-center mb-3 uppercase tracking-wider">
              Quick Demo Accounts (Click to Fill)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin("agent1@freshagent.com")}
                className="py-2 px-3 bg-gray-800/50 hover:bg-gray-800 border border-gray-700/40 rounded-lg text-xs font-medium text-emerald-400 text-left transition flex items-center justify-between"
              >
                <span>Agent One</span>
                <CheckCircle2 className="w-3.5 h-3.5 opacity-60" />
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("admin@freshagent.com")}
                className="py-2 px-3 bg-gray-800/50 hover:bg-gray-800 border border-gray-700/40 rounded-lg text-xs font-medium text-indigo-400 text-left transition flex items-center justify-between"
              >
                <span>Admin User</span>
                <CheckCircle2 className="w-3.5 h-3.5 opacity-60" />
              </button>
            </div>
            <p className="text-[11px] text-gray-500 text-center mt-3">
              Default demo password: <code className="text-gray-400 bg-gray-900 px-1.5 py-0.5 rounded">password123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
