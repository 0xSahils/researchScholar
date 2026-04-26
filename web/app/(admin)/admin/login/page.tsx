"use client";

import { Suspense, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { LockKey, Eye, EyeSlash, Spinner, ShieldCheck } from "@phosphor-icons/react";

// Inner component that uses useSearchParams — must be inside Suspense
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(from);
        router.refresh();
      } else {
        setError("Invalid username or password.");
        setPassword("");
      }
    });
  };

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md p-8 shadow-2xl">
      <h2 className="text-lg font-semibold text-white mb-6">Sign in to continue</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            disabled={isPending}
            placeholder="admin"
            className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Password</label>
          <div className="relative">
            <input type={showPass ? "text" : "password"} value={password}
              onChange={(e) => setPassword(e.target.value)}
              required autoComplete="current-password" disabled={isPending} placeholder="••••••••••"
              className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder:text-white/20 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition" />
            <button type="button" onClick={() => setShowPass((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition">
              {showPass ? <EyeSlash className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">{error}</p>
        )}

        <button type="submit" disabled={isPending || !username || !password}
          className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed mt-2">
          {isPending
            ? <><Spinner className="h-4 w-4 animate-spin" />Verifying...</>
            : <><LockKey className="h-4 w-4" weight="bold" />Sign in</>}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#08100a] px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-emerald-900/20 blur-[120px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-900 shadow-lg mb-4">
            <ShieldCheck className="h-7 w-7 text-white" weight="fill" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-white">ResearchScholars</h1>
          <p className="text-sm text-white/40 mt-1 font-mono uppercase tracking-widest">Admin Portal</p>
        </div>

        {/* Suspense wraps only the component that uses useSearchParams */}
        <Suspense fallback={
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 flex items-center justify-center">
            <Spinner className="h-6 w-6 text-emerald-400 animate-spin" />
          </div>
        }>
          <LoginForm />
        </Suspense>

        <p className="text-center text-xs text-white/20 mt-6">
          Restricted area · Unauthorised access is prohibited
        </p>
      </motion.div>
    </div>
  );
}
