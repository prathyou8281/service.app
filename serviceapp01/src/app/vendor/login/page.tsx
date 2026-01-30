"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Store, Mail, Lock, ArrowRight, Loader2, ShieldCheck, Zap } from "lucide-react";

export default function VendorLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:4000/api/auth/vendor/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Authentication failed. Please check credentials.");
      }

      localStorage.setItem("access_token", data.user.access_token);
      localStorage.setItem(
        "userData",
        JSON.stringify({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: "vendor",
        })
      );

      document.cookie = `userData=${JSON.stringify({
        name: data.user.name,
        role: "vendor",
      })}; path=/; max-age=86400; SameSite=Lax`;

      window.location.href = data.redirect || "/vendor/dashboard";
    } catch (err: any) {
      setError(err.message || "Infrastructure communication failure.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* 🔹 High-End Corporate Aura Background */}
      <div className="absolute inset-0 z-0 text-indigo-500/10">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[160px] animate-pulse" style={{ animationDelay: '3s' }} />

        {/* Pro Matrix Grid */}
        <div className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)',
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
        <div className="bg-[#0f172a]/80 backdrop-blur-3xl rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] border border-white/5 p-10 md:p-14 overflow-hidden relative">

          {/* Header Section */}
          <div className="flex flex-col items-center mb-12">
            <motion.div
              whileHover={{ scale: 1.05, rotate: -5 }}
              className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-[0_20px_40px_rgba(99,102,241,0.3)] mb-8 cursor-pointer relative group"
            >
              <Store className="text-white w-9 h-9 relative z-10" />
            </motion.div>

            <h1 className="text-4xl font-black text-white tracking-tighter text-center mb-2">
              Merchant Access
            </h1>
            <p className="text-slate-400 text-center font-bold text-[10px] uppercase tracking-[0.5em] mt-3 opacity-60">
              Professional Vendor Portal
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Corporate Email</label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-16 pl-16 pr-6 bg-white/[0.03] border border-white/5 rounded-2xl text-sm font-semibold text-white placeholder:text-slate-600 focus:bg-white/[0.05] focus:border-indigo-500/30 transition-all outline-none"
                  placeholder="name@business.com"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Secure Password</label>
                <Link href="/forgetpassword" tabIndex={-1} className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.2em] hover:text-indigo-300 transition-colors">Reset?</Link>
              </div>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-16 pl-16 pr-6 bg-white/[0.03] border border-white/5 rounded-2xl text-sm font-semibold text-white placeholder:text-slate-600 focus:bg-white/[0.05] focus:border-indigo-500/30 transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-[0_20px_40px_-5px_rgba(79,70,229,0.3)] disabled:opacity-70 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin text-white" />
              ) : (
                <>
                  Initialize Store <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-10 border-t border-white/5 text-center">
            <p className="text-sm font-bold text-slate-500">
              New merchant partner?{" "}
              <Link href="/vendor/register" className="text-indigo-400 hover:text-indigo-300">
                Join Network
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
              className="mt-6 p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-[10px] text-rose-400 font-extrabold uppercase tracking-[0.3em] text-center shadow-lg"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 flex justify-center items-center gap-3 opacity-20">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white">Merchant Secure Node</span>
        </div>
      </motion.div>
    </div>
  );
}
