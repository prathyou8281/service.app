"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2, Zap, ShieldCheck, CheckCircle2, Globe, Server, Cpu } from "lucide-react";

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
    <div className="min-h-screen bg-[#05070a] flex flex-col lg:flex-row relative overflow-hidden font-sans">

      {/* 🔹 Left Section: Branding & Content */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center p-20 z-10 overflow-hidden">
        {/* Animated Background for Content Section */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-blue-600/10 rounded-full blur-[160px] animate-pulse" />
          <div className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)',
              backgroundSize: '80px 80px'
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10"
        >
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_20px_40px_rgba(59,130,246,0.3)] mb-12">
            <Zap className="text-white w-8 h-8" />
          </div>

          <h2 className="text-6xl font-black text-white tracking-tighter leading-tight mb-8">
            The Next Generation <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Service Ecosystem</span>
          </h2>

          <p className="text-slate-400 text-lg font-medium max-w-lg leading-relaxed mb-12">
            Access your professional dashboard and manage your multi-vendor service infrastructure with military-grade precision and real-time synchronization.
          </p>

          <div className="space-y-6">
            <FeatureNode icon={Globe} label="Global Service Network Integration" />
            <FeatureNode icon={Server} label="Enterprise Data Architecture" />
            <FeatureNode icon={Cpu} label="Advanced Resource Deployment" />
          </div>

          <div className="mt-20 pt-10 border-t border-white/5 flex items-center gap-4 text-slate-500">
            <ShieldCheck className="w-5 h-5 text-emerald-500/50" />
            <span className="text-xs font-black uppercase tracking-[0.3em]">Authorized Corporate Access Node</span>
          </div>
        </motion.div>
      </div>

      {/* 🔹 Right Section: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-20 relative z-10">

        {/* Mobile-only background pulses */}
        <div className="lg:hidden absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/5 rounded-full blur-[120px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[480px] relative"
        >
          <div className="bg-[#0f172a]/90 backdrop-blur-3xl rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] border border-white/5 p-10 md:p-14 overflow-hidden relative group">

            {/* Subtle glow follows group hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

            <div className="flex flex-col items-center mb-12">
              <h1 className="text-4xl font-black text-white tracking-tighter text-center mb-2">
                Welcome Back
              </h1>
              <p className="text-slate-400 text-center font-bold text-[10px] uppercase tracking-[0.4em] mt-2 opacity-60">
                Access your professional dashboard
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-8 relative z-10">
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">
                  Email Address
                </label>
                <div className="relative group/input">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-blue-600 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="usr@gmail.com"
                    className="w-full h-16 pl-16 pr-6 bg-[#ebf2ff] border-none rounded-[1.5rem] text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none shadow-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    Password
                  </label>
                  <Link href="/forgot-password" tabIndex={-1} className="text-[11px] font-black text-blue-400 uppercase tracking-[0.2em] hover:text-blue-300 transition-colors">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative group/input">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-blue-600 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full h-16 pl-16 pr-6 bg-[#ebf2ff] border-none rounded-[1.5rem] text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none shadow-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
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
                    Sign In
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-12 pt-10 border-t border-white/5 text-center">
              <p className="text-sm font-bold text-slate-500">
                New to our platform?{" "}
                <Link href="/register" className="text-blue-400 hover:text-blue-300">
                  Create Account
                </Link>
              </p>
            </div>
          </div>

          {/* Mobile Error Feedback */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-[10px] text-rose-400 font-extrabold uppercase tracking-[0.3em] text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

function FeatureNode({ icon: Icon, label }: any) {
  return (
    <div className="flex items-center gap-4 group cursor-default">
      <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:bg-blue-600/10 group-hover:border-blue-500/30 transition-all duration-500">
        <Icon className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-colors" />
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-200 transition-colors">{label}</span>
    </div>
  );
}
