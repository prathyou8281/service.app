"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react"; // Re-authenticate after completion
import { motion } from "framer-motion";
import { Lock, Phone, User as UserIcon, CheckCircle2, Loader2, Mail } from "lucide-react";

// Wrap content in Suspense for useSearchParams
function CompleteProfileContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const query = searchParams.get("data");
        if (query) {
            try {
                const decoded = JSON.parse(atob(query));
                setData(decoded);
            } catch (e) {
                setError("Invalid profile data. Please try logging in again.");
            }
        } else {
            setError("No profile data found.");
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!password || !phone) {
            setError("All fields are required.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("http://localhost:4000/api/auth/complete-google-signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    password,
                    phone,
                    login_provider: "google"
                })
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || "Registration failed");
            }

            // Successfully created user in DB. Now auto-login properly.
            const signInRes = await signIn("google", { redirect: false, callbackUrl: "/welcome" });

            if (signInRes?.ok) {
                router.push("/welcome");
            } else {
                // Fallback: manually push to login if auto-signin fails
                router.push("/login?success=AccountCreated");
            }

        } catch (err: any) {
            setError(err.message || "Something went wrong.");
            setLoading(false);
        }
    };

    if (!data && !error) return <div className="min-h-screen flex items-center justify-center bg-[#05070a] text-white">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#05070a] flex items-center justify-center p-6 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-[#0f172a] border border-white/10 p-8 rounded-3xl relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center ring-1 ring-blue-500/20">
                        <UserIcon className="w-8 h-8 text-blue-400" />
                    </div>
                </div>

                <h2 className="text-2xl font-black text-white text-center mb-2 tracking-tight">Complete Profile</h2>
                <p className="text-slate-400 text-center text-xs uppercase tracking-widest mb-8">One last step to secure your account</p>

                {error && (
                    <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-bold text-center">
                        {error}
                    </div>
                )}

                <div className="bg-slate-900/50 p-4 rounded-xl mb-6 border border-white/5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                            <Mail className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Email Account</p>
                            <p className="text-sm font-semibold text-slate-200">{data?.email}</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Mobile Number</label>
                        <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="tel"
                                required
                                className="w-full h-12 bg-slate-900/50 border border-white/5 rounded-xl pl-11 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                                placeholder="9876543210"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Set Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="password"
                                required
                                className="w-full h-12 bg-slate-900/50 border border-white/5 rounded-xl pl-11 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-[0.15em] transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Complete Registration"}
                    </button>
                </form>

            </motion.div>
        </div>
    );
}

export default function CompleteProfilePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#05070a] flex items-center justify-center text-white">Loading...</div>}>
            <CompleteProfileContent />
        </Suspense>
    );
}
