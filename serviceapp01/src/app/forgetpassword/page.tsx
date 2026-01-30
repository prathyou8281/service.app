"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, Loader2, Send, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:4000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.message || "Unable to process request.");
      }
    } catch (err) {
      setError("Infrastructure communication failure.");
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

          <div className="mb-12">
            <Link
              href="/login"
              className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-blue-400 transition-colors mb-10 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Sign In
            </Link>

            <h1 className="text-4xl font-black text-white tracking-tighter leading-tight mb-4">Account Recovery</h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest opacity-60 leading-relaxed">
              Dispatch a secure recovery link to your registered terminal to restore access.
            </p>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Registered Email</label>
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="name@enterprise.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full h-16 pl-16 pr-6 bg-white/[0.03] border border-white/5 rounded-2xl text-sm font-semibold text-white placeholder:text-slate-600 focus:bg-white/[0.05] focus:border-blue-500/30 transition-all outline-none shadow-inner"
                  />
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-[10px] text-rose-400 font-extrabold uppercase tracking-[0.3em] text-center shadow-lg"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-[0_20px_40px_-5px_rgba(37,99,235,0.3)] disabled:opacity-70 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                {loading ? <Loader2 className="w-6 h-6 animate-spin text-white" /> : <>Request Link <Send className="w-5 h-5" /></>}
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-[2.5rem] flex items-center justify-center text-emerald-400 mx-auto mb-10 shadow-[0_20px_40px_rgba(16,185,129,0.1)]">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight mb-4">Link Dispatched</h3>
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest leading-relaxed mb-12 opacity-80">
                A secure synchronization link has been dispatched to <span className="text-blue-400">{email}</span>. Please verify your terminal.
              </p>
              <button
                onClick={() => router.push("/login")}
                className="w-full h-16 bg-white/[0.03] hover:bg-white/[0.08] text-white border border-white/5 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] transition-all"
              >
                Return to Login
              </button>
            </motion.div>
          )}

          <div className="mt-12 pt-10 border-t border-white/5 text-center">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
              Security Issue? <Link href="/register" className="text-blue-400 hover:text-blue-300">New Account</Link>
            </p>
          </div>
        </div>

        {/* Security Trust Mark */}
        <div className="mt-12 flex justify-center items-center gap-3 opacity-20">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white">Advanced Identity Protection</span>
        </div>
      </motion.div>
    </div>
  );
}
