"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Lock,
} from "lucide-react";

const API_BASE_URL = "http://localhost:4000/api";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "otp" | "password">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  // Step 1: Request OTP
  const handleRequestOTP = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/forgot-password/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to send verification code");
        setLoading(false);
        return;
      }

      setSuccess("✅ Verification code sent to your email!");
      setTimeout(() => {
        setStep("otp");
        setSuccess("");
      }, 1500);
    } catch (err) {
      console.error("Request OTP error:", err);
      setError("⚠️ Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/forgot-password/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid verification code");
        setLoading(false);
        return;
      }

      setSuccess("✅ Code verified! Set your new password.");
      setTimeout(() => {
        setStep("password");
        setSuccess("");
      }, 1500);
    } catch (err) {
      console.error("Verify OTP error:", err);
      setError("⚠️ Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("❌ Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("❌ Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/forgot-password/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to reset password");
        setLoading(false);
        return;
      }

      setSuccess("✅ Password reset successful! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      console.error("Reset password error:", err);
      setError("⚠️ Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-[480px] relative z-10"
      >
        {/* Success/Error Overlay */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-[#0f172a]/95 backdrop-blur-md rounded-[3.5rem] border border-emerald-500/20"
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 ring-4 ring-emerald-500/10 animate-pulse">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <p className="text-emerald-400 text-sm font-bold">{success}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-[#0f172a]/90 backdrop-blur-3xl rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] border border-white/5 p-10 md:p-14">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-4 ring-4 ring-blue-500/10">
              <Mail className="w-8 h-8 text-blue-500" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter text-center mb-2">
              Identity Recovery
            </h1>
            <p className="text-slate-400 text-center font-bold text-[10px] uppercase tracking-[0.4em] mt-2 opacity-60">
              {step === "email" && "Enter your registered email"}
              {step === "otp" && "Verify your identity"}
              {step === "password" && "Create new password"}
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className={`w-2 h-2 rounded-full ${step === "email" ? "bg-blue-500" : "bg-slate-700"}`} />
            <div className={`w-2 h-2 rounded-full ${step === "otp" ? "bg-blue-500" : "bg-slate-700"}`} />
            <div className={`w-2 h-2 rounded-full ${step === "password" ? "bg-blue-500" : "bg-slate-700"}`} />
          </div>

          {/* Step 1: Email Input */}
          {step === "email" && (
            <form onSubmit={handleRequestOTP} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">
                  Email Address
                </label>
                <div className="relative group/input">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-blue-600 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-14 pl-16 pr-6 bg-[#ebf2ff] border-none rounded-[1.5rem] text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none shadow-sm"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-[1.5rem] text-[13px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-[0_20px_40px_-5px_rgba(37,99,235,0.4)] disabled:opacity-70 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    Initialize Recovery
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === "otp" && (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">
                  Verification Code
                </label>
                <div className="relative group/input">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-blue-600 transition-colors">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="w-full h-14 pl-16 pr-6 bg-[#ebf2ff] border-none rounded-[1.5rem] text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none shadow-sm tracking-[0.5em] text-center"
                    disabled={loading}
                    required
                    maxLength={6}
                  />
                </div>
                <p className="text-xs text-slate-500 ml-2">Check your email for the code</p>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-[1.5rem] text-[13px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-[0_20px_40px_-5px_rgba(37,99,235,0.4)] disabled:opacity-70 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    Verify Code
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === "password" && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">
                  New Password
                </label>
                <div className="relative group/input">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-blue-600 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full h-14 pl-16 pr-6 bg-[#ebf2ff] border-none rounded-[1.5rem] text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none shadow-sm"
                    disabled={loading}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">
                  Confirm Password
                </label>
                <div className="relative group/input">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-blue-600 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-14 pl-16 pr-6 bg-[#ebf2ff] border-none rounded-[1.5rem] text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none shadow-sm"
                    disabled={loading}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-[1.5rem] text-[13px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-[0_20px_40px_-5px_rgba(37,99,235,0.4)] disabled:opacity-70 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    Reset Password
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                <p className="text-rose-400 text-xs font-bold">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Links */}
          <div className="mt-8 pt-8 border-t border-white/5 text-center space-y-4">
            <p className="text-sm font-bold text-slate-500">
              Remember your password?{" "}
              <Link
                href="/login"
                className="text-blue-400 hover:text-blue-300 relative z-30 cursor-pointer transition-colors duration-300"
              >
                Login
              </Link>
            </p>
            <p className="text-xs text-slate-600 uppercase tracking-widest">
              Secure Infrastructure Synchronizer
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
