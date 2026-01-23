"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { Lock, Mail, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await authApi.adminLogin({ email, password });

            const userData = {
                username: response.user.name,
                email: response.user.email,
                role: "admin",
            };

            localStorage.setItem("userData", JSON.stringify(userData));
            localStorage.setItem("access_token", response.user.access_token);

            // Set cookie for middleware
            document.cookie = `userData=${JSON.stringify(userData)}; path=/; max-age=86400; SameSite=Lax`;

            router.push("/admin/dashboard");
        } catch (err: any) {
            setError(err.message || "Invalid credentials for Admin access");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="card p-10 shadow-2xl">
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/20 mb-6">
                            <ShieldCheck className="text-white w-10 h-10" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-center">Admin Access</h1>
                        <p className="text-[var(--muted)] text-center font-medium mt-2">Enterprise Management Terminal</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 font-bold flex items-center gap-3"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider ml-1">Email Identifier</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]" />
                                <input
                                    type="email"
                                    required
                                    placeholder="admin@enterprise.com"
                                    className="input pl-12 h-14"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider ml-1">Security Key</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]" />
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="input pl-12 h-14"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            type="submit"
                            className="btn-primary w-full h-14 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-blue-900/10 transition-all"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Initialize Login
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-10 border-t border-[var(--border)] text-center">
                        <p className="text-[var(--muted)] text-xs font-bold uppercase tracking-widest">Authorized Personnel Only</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
