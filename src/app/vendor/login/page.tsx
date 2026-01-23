"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Store, Mail, Lock, ArrowRight, Loader2, ShieldCheck, X } from "lucide-react";

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
          username: data.user.name,
          role: "vendor",
        })
      );

      document.cookie = `userData=${JSON.stringify({
        username: data.user.name,
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">

      {/* Background Aesthetics */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 -left-24 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="card p-10 bg-white/80 backdrop-blur-xl shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] border border-slate-100">

          <div className="flex flex-col items-center mb-10">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-600/20 mb-6">
              <Store className="text-white w-7 h-7" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Merchant Access</h1>
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mt-3">Professional Vendor Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Corporate Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input !h-14 !pl-12 !bg-slate-50 focus:!bg-white"
                  placeholder="name@business.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secure Password</label>
                <Link href="/forgetpassword" tabIndex={-1} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Reset?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input !h-14 !pl-12 !bg-slate-50 focus:!bg-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-black py-4 rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 h-16"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Initialize Store <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-slate-50 text-center">
            <p className="text-sm font-bold text-slate-400">
              New merchant partner?{" "}
              <Link
                href="/vendor/register"
                className="text-indigo-600 font-black hover:underline decoration-2 underline-offset-4"
              >
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
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-[10px] text-red-600 font-black uppercase tracking-widest text-center shadow-lg"
            >
              <span className="flex items-center justify-center gap-2">
                <X className="w-3 h-3" /> {error}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 flex justify-center items-center gap-2 text-slate-300">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[8px] font-black uppercase tracking-[0.4em]">Encrypted Session Management</span>
        </div>
      </motion.div>
    </div>
  );
}
