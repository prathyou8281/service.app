"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2, ShieldCheck, Zap } from "lucide-react";

const API_BASE_URL = "http://localhost:4000/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("userData");
      if (!storedUser) return;

      const parsed = JSON.parse(storedUser);
      if (parsed?.role) {
        const role = parsed.role.toLowerCase();
        router.replace(role === 'user' ? '/welcome' : `/${role}/dashboard`);
      }
    } catch {
      localStorage.removeItem("userData");
    }
  }, [router]);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please credentials are required.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Invalid authentication details.");
        return;
      }

      const userData = {
        username: data.user.name,
        email: data.user.email,
        role: data.user.role || "user",
      };

      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("access_token", data.user.access_token);

      // Set cookie for middleware
      document.cookie = `userData=${JSON.stringify(userData)}; path=/; max-age=86400; SameSite=Lax`;

      router.push(data.user.role === 'admin' ? '/admin/dashboard' : data.user.role === 'vendor' ? '/vendor/dashboard' : '/welcome');
    } catch {
      setError("Infrastructure communication failure. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="card p-10 shadow-2xl bg-white/80 backdrop-blur-xl">
          <div className="flex flex-col items-center mb-10">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/20 mb-6">
              <Zap className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-center">Welcome Back</h1>
            <p className="text-[var(--muted)] text-center font-bold text-xs uppercase tracking-widest mt-3">Access your professional dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.2em] ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                <input
                  type="email"
                  required
                  placeholder="name@enterprise.com"
                  className="input pl-12 h-14"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.2em]">Password</label>
                <Link href="/forgetpassword" tabIndex={-1} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Reset?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="input pl-12 h-14"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="btn-primary w-full h-14 text-sm font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-blue-900/10"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-slate-100 text-center">
            <p className="text-sm font-medium text-[var(--muted)]">
              New to our platform?{" "}
              <Link href="/register" className="text-blue-600 font-black hover:underline underline-offset-4">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Dynamic Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-black uppercase tracking-widest text-center shadow-lg"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
