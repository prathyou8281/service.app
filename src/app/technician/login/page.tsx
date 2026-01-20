"use client";

import { useState } from "react";
import Link from "next/link";
import { Wrench, Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

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

            if (!res.ok) {
                throw new Error(data.message || "Technician login failed");
            }

            const tech = data; // Data IS the tech object with access_token

            localStorage.setItem("access_token", tech.access_token);
            localStorage.setItem(
                "userData",
                JSON.stringify({
                    id: tech.id,
                    username: tech.name,
                    email: tech.email,
                    role: "technician",
                    status: tech.status,
                })
            );

            document.cookie = `userData=${JSON.stringify({
                username: tech.name,
                role: "technician",
                status: tech.status,
            })}; path=/; max-age=86400; SameSite=Lax`;

            window.location.href = "/technician/dashboard";
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#eef4fb] to-[#dfe9f5] px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="bg-white rounded-3xl shadow-xl p-10 border border-blue-100">
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-16 h-16 bg-sky-500 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/30 mb-6">
                            <Wrench className="text-white w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-extrabold text-gray-800 text-center">
                            Technician <span className="text-sky-500">Portal</span>
                        </h1>
                        <p className="text-gray-500 text-sm mt-2 font-medium">
                            Access your assigned jobs & task list
                        </p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600 font-semibold flex items-center gap-3"
                        >
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1 tracking-widest">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-4 text-sm text-gray-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1 tracking-widest">
                                Access Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-4 text-sm text-gray-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-sky-500 hover:bg-sky-600 active:scale-[0.98] py-4 rounded-2xl text-white font-bold text-sm shadow-lg shadow-sky-500/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Login
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-gray-200 text-center">
                        <div className="flex items-center justify-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                            <ShieldCheck className="w-3 h-3 text-sky-500" />
                            Secure Professional Access Only
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        Forgot credentials? Contact your vendor manager
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
