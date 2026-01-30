"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, Loader2, Key, CheckCircle2, ShieldCheck, Zap, Lock, UserCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: Email, 2: New Password
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please provide your registered email identifier.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passcodes do not synchronize. Please verify.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Security requirement: Minimum 6 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:4000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.message || "Failed to restore identity.");
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
            {!success && (
              <button
                onClick={() => step === 1 ? router.push("/login") : setStep(1)}
                className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-blue-400 transition-colors mb-10 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                {step === 1 ? "Back to Sign In" : "Change Email"}
              </button>
            )}

            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-[2rem] border border-white/5 flex items-center justify-center mb-8">
                {success ? (
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                ) : step === 1 ? (
                  <UserCircle className="w-10 h-10 text-blue-400" />
                ) : (
                  <ShieldCheck className="w-10 h-10 text-indigo-400" />
                )}
              </div>
              <h1 className="text-4xl font-black text-white tracking-tighter leading-tight mb-4">
                {success ? "Success" : step === 1 ? "Account Recovery" : "Reset Password"}
              </h1>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest opacity-60 leading-relaxed">
                {success ? "Your identity credentials have been restored." : step === 1 ? "Verify your terminal email to proceed." : `Synchronizing new security key for ${email}`}
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-8"
              >
                <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest leading-relaxed">
                  Your security configuration is now up to date. You can proceed to the main terminal with your new credentials.
                </p>
                <Link
                  href="/login"
                  className="block w-full h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center transition-all shadow-[0_20px_40px_-5px_rgba(37,99,235,0.3)]"
                >
                  Return to Dashboard
                </Link>
              </motion.div>
            ) : step === 1 ? (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleNextStep}
                className="space-y-8"
              >
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
                      className="w-full h-16 pl-16 pr-6 bg-white/[0.03] border border-white/5 rounded-2xl text-sm font-semibold text-white placeholder:text-slate-600 focus:bg-white/[0.05] focus:border-blue-500/30 transition-all outline-none shadow-inner"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-[10px] text-rose-400 font-extrabold uppercase tracking-[0.3em] text-center">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-[0_20px_40px_-5px_rgba(37,99,235,0.3)] group relative overflow-hidden"
                >
                  Continue <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleResetPassword}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">New Security Key</label>
                    <div className="relative group">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full h-16 pl-16 pr-6 bg-white/[0.03] border border-white/5 rounded-2xl text-sm font-semibold text-white placeholder:text-slate-600 focus:bg-white/[0.05] focus:border-indigo-500/30 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Confirm Synchronization</label>
                    <div className="relative group">
                      <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full h-16 pl-16 pr-6 bg-white/[0.03] border border-white/5 rounded-2xl text-sm font-semibold text-white placeholder:text-slate-600 focus:bg-white/[0.05] focus:border-emerald-500/30 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-[10px] text-rose-400 font-extrabold uppercase tracking-[0.3em] text-center">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-[0_20px_40px_-5px_rgba(37,99,235,0.3)] relative overflow-hidden disabled:opacity-70"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Restore Access"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-12 pt-10 border-t border-white/5 text-center">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
              {success ? "Synchronized successfully" : "Corporate Identity Protection"}
            </p>
          </div>
        </div>

        {/* Security Trust Mark */}
        <div className="mt-12 flex justify-center items-center gap-3 opacity-20">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white">Full Identity Restoration Node</span>
        </div>
      </motion.div>
    </div>
  );
}
