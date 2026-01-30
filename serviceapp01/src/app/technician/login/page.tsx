"use client";

import { useState } from "react";
import Link from "next/link";
import { Wrench, Mail, Lock, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TechnicianLoginPage() {
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
                "http://localhost:4000/api/auth/technician/login",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Credential verification failed.");

            const tech = data;
            localStorage.setItem("access_token", tech.access_token);
            localStorage.setItem(
                "userData",
                JSON.stringify({
                    id: tech.id,
                    name: tech.name,
                    email: tech.email,
                    phone: tech.phone || "",
                    role: "technician",
                    status: tech.status,
                })
            );

            document.cookie = `userData=${JSON.stringify({
                name: tech.name,
                role: "technician",
                status: tech.status,
            })}; path=/; max-age=86400; SameSite=Lax`;

            window.location.href = "/technician/dashboard";
        } catch (err: any) {
            setError(err.message || "Field network connection timed out.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Aesthetics */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-1/4 -left-24 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-teal-500/5 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="card p-10 bg-white/80 backdrop-blur-xl border border-slate-100 shadow-2xl">
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-600/20 mb-6">
                            <Wrench className="text-white w-7 h-7" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight text-center">Field Access</h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3">Technician Operation Node</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input !h-14 !pl-12 !bg-slate-50 focus:!bg-white"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Password</label>
                                <Link href="/forgetpassword" tabIndex={-1} className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">Reset?</Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
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
                                    Connect to Terminal <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="mt-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-[10px] text-red-600 font-black uppercase tracking-widest text-center"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-10 pt-10 border-t border-slate-50 text-center">
                        <p className="text-xs font-bold text-slate-400">
                            Unauthorized access is logged. Managed by Corporate Security.
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex justify-center items-center gap-2 text-slate-300">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[8px] font-black uppercase tracking-[0.4em]">Field Secure Encrypted Access</span>
                </div>
            </motion.div>
        </div>
    );
}
