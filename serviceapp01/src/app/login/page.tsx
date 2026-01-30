"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2, Zap, ShieldCheck, ChevronLeft } from "lucide-react";

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
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone || "",
        role: data.user.role || "user",
      };

      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("access_token", data.user.access_token);

      document.cookie = `userData=${JSON.stringify(userData)}; path=/; max-age=86400; SameSite=Lax`;

      router.push(data.user.role === 'admin' ? '/admin/dashboard' : data.user.role === 'vendor' ? '/vendor/dashboard' : '/welcome');
    } catch {
      setError("Infrastructure communication failure. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* 🔹 High-End Corporate Aura Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[160px] animate-pulse" style={{ animationDelay: '3s' }} />

        {/* Pro Matrix Grid */}
        <div className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[480px] relative z-10"
      >
        <div className="bg-[#0f172a]/80 backdrop-blur-3xl rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] border border-white/5 p-10 md:p-14 overflow-hidden relative">

          {/* Internal Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent shadow-[0_0_20px_rgba(59,130,246,0.5)]" />

          {/* Header Section */}
          <div className="flex flex-col items-center mb-12">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2rem] flex items-center justify-center shadow-[0_20px_40px_rgba(59,130,246,0.3)] mb-8 cursor-pointer relative group"
            >
              <Zap className="text-white w-10 h-10 relative z-10" />
              <div className="absolute inset-0 rounded-[2rem] bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
            </motion.div>

            <h1 className="text-4xl font-black text-white tracking-tighter text-center mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-400 text-center font-bold text-[10px] uppercase tracking-[0.5em] mt-2 opacity-60">
              Access your professional dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            {/* Email Field */}
            <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@enterprise.com"
                  className="w-full h-16 pl-16 pr-6 bg-white/[0.03] border border-white/5 rounded-2xl text-sm font-semibold text-white placeholder:text-slate-600 focus:bg-white/[0.05] focus:border-blue-500/30 transition-all outline-none shadow-inner"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  Password
                </label>
                <Link href="/forgetpassword" tabIndex={-1} className="text-[11px] font-black text-blue-400 uppercase tracking-[0.2em] hover:text-blue-300 transition-colors">
                  Reset?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full h-16 pl-16 pr-6 bg-white/[0.03] border border-white/5 rounded-2xl text-sm font-semibold text-white placeholder:text-slate-600 focus:bg-white/[0.05] focus:border-blue-500/30 transition-all outline-none shadow-inner"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              disabled={loading}
              type="submit"
              className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-[0_20px_40px_-5px_rgba(37,99,235,0.3)] disabled:opacity-70 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin text-white" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-12 pt-10 border-t border-white/5 text-center">
            <p className="text-sm font-bold text-slate-500">
              New to our platform?{" "}
              <Link href="/register" className="text-blue-400 hover:text-blue-300 transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Error Feedback */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-[10px] text-rose-400 font-extrabold uppercase tracking-[0.3em] text-center shadow-lg flex items-center justify-center gap-3"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Security Trust Mark */}
        <div className="mt-12 flex justify-center items-center gap-3 opacity-20">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white">Secure Encrypted Authentication</span>
        </div>
      </motion.div>
    </div>
  );
}
