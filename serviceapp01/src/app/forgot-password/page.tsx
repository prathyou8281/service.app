"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, Loader2, Key, CheckCircle2, ShieldCheck, Lock, UserCircle, ArrowRight, Smartphone, RefreshCcw } from "lucide-react";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Pass
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Professional identifier required.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:4000/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setStep(2);
      } else {
        setError(data.message || "Identifier not found in our infrastructure.");
      }
    } catch (err) {
      setError("Terminal synchronization failure.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setError("Valid 6-digit verification token required.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:4000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
      });
      if (res.ok) {
        setStep(3);
      } else {
        const data = await res.json();
        setError(data.message || "Invalid or expired token.");
      }
    } catch {
      setError("Network encryption failure.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passcodes do not reconcile.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Security requirement: Min 6 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:4000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword })
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.message || "System update rejected.");
      }
    } catch {
      setError("Cloud synchronization failure.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center p-6 relative overflow-hidden font-sans">

      {/* 🔹 Refined Minimalist Aura */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[10%] w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[140px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="bg-[#11141a] border border-white/5 rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] p-10 md:p-12 overflow-hidden relative">

          {/* Top Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
            <motion.div
              className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"
              animate={{ width: success ? '100%' : `${(step / 3) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="mb-10 text-center">
            {step > 1 && !success && (
              <button
                onClick={() => setStep(step - 1)}
                className="absolute top-8 left-8 p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-slate-500 hover:text-white transition-all group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              </button>
            )}

            <div className="w-16 h-16 bg-gradient-to-br from-white/[0.05] to-white/[0.01] rounded-[1.25rem] border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-xl">
              {success ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              ) : step === 1 ? (
                <Mail className="w-8 h-8 text-blue-400" />
              ) : step === 2 ? (
                <Smartphone className="w-8 h-8 text-indigo-400" />
              ) : (
                <Lock className="w-8 h-8 text-amber-400" />
              )}
            </div>

            <h1 className="text-3xl font-black text-white tracking-tighter mb-2">
              {success ? "Verification Complete" : step === 1 ? "Identity Recovery" : step === 2 ? "Terminal Verification" : "Security Update"}
            </h1>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">
              {success ? "Credentials Resynchronized" : step === 1 ? "Enter your registered mail" : step === 2 ? "6-digit token dispatched" : "Assign your new master key"}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <form onSubmit={step === 1 ? handleRequestOtp : step === 2 ? handleVerifyOtp : handleResetPassword} className="space-y-6">

                  {step === 1 && (
                    <div className="space-y-4">
                      <div className="relative group">
                        <UserCircle className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                        <input
                          type="email"
                          required
                          placeholder="professional@identifier.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full h-16 pl-16 pr-6 bg-white/[0.02] border border-white/5 rounded-2xl text-sm font-semibold text-white placeholder:text-slate-700 focus:bg-white/[0.04] focus:border-blue-500/50 outline-none transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4">
                      <div className="relative group text-center">
                        <div className="flex justify-center gap-2">
                          <input
                            type="text"
                            maxLength={6}
                            required
                            placeholder="000000"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            className="w-full h-16 text-center text-2xl font-black tracking-[0.5em] bg-white/[0.02] border border-white/5 rounded-2xl text-white placeholder:text-slate-800 focus:bg-white/[0.04] focus:border-indigo-500/50 outline-none transition-all"
                          />
                        </div>
                        <p className="mt-4 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                          Verification Code sent to <span className="text-slate-400">{email}</span>
                        </p>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <div className="relative group">
                          <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-amber-500 transition-colors" />
                          <input
                            type="password"
                            required
                            placeholder="New Security Key"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full h-16 pl-16 pr-6 bg-white/[0.02] border border-white/5 rounded-2xl text-sm font-semibold text-white placeholder:text-slate-700 focus:bg-white/[0.04] focus:border-amber-500/50 outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="relative group">
                          <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-emerald-500 transition-colors" />
                          <input
                            type="password"
                            required
                            placeholder="Confirm Master Key"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full h-16 pl-16 pr-6 bg-white/[0.02] border border-white/5 rounded-2xl text-sm font-semibold text-white placeholder:text-slate-700 focus:bg-white/[0.04] focus:border-emerald-500/50 outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-[10px] text-rose-400 font-black uppercase tracking-widest text-center"
                    >
                      {error}
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-xl shadow-blue-500/10 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>
                        {step === 1 ? "Initialize Recovery" : step === 2 ? "Verify Identity" : "Update Credentials"}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-8"
              >
                <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl">
                  <p className="text-slate-400 text-sm font-medium leading-relaxed">
                    Identity successfully restored. All cloud terminals have been synchronized with your new security credentials.
                  </p>
                </div>
                <button
                  onClick={() => router.push("/login")}
                  className="w-full h-16 bg-white/[0.03] hover:bg-white/[0.08] text-white border border-white/10 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all"
                >
                  Return to Main Terminal
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-600">
            <span>Security Layer 4.2</span>
            {success ? (
              <span className="text-emerald-500">Verified</span>
            ) : (
              <Link href="/login" className="hover:text-blue-500 transition-colors">Abort Access</Link>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-center items-center gap-4 opacity-30">
          <RefreshCcw className="w-3 h-3 text-slate-500 animate-spin-slow" />
          <span className="text-[8px] font-black uppercase tracking-[0.5em] text-slate-200">Global Infrastructure Synchronized</span>
        </div>
      </motion.div>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
