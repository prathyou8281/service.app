"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShieldCheck,
    MapPin,
    Clock,
    CreditCard,
    Truck,
    CheckCircle2,
    ChevronLeft,
    Calendar,
    AlertCircle,
    Loader2
} from "lucide-react";
import Link from "next/link";

function BookingContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const serviceId = searchParams.get("serviceId");
    const serviceNameInitial = searchParams.get("serviceName");
    const priceInitial = searchParams.get("price");
    const vendorName = searchParams.get("vendorName");
    const vendorId = searchParams.get("vendorId");

    const [user, setUser] = useState<any>(null);
    const [serviceDetails, setServiceDetails] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [fetchingService, setFetchingService] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        address: "",
        city: "",
        zip: "",
        description: "",
        paymentMethod: "cod", // cod, online
    });

    useEffect(() => {
        const userData = localStorage.getItem("userData");
        if (!userData) {
            router.push("/login?redirect=book-service");
            return;
        }
        setUser(JSON.parse(userData));

        // Fetch service details to get the full description and latest data
        if (serviceId) {
            setFetchingService(true);
            fetch(`http://localhost:4000/api/services/${serviceId}`)
                .then(res => res.json())
                .then(data => setServiceDetails(data))
                .catch(err => console.error("Error fetching service:", err))
                .finally(() => setFetchingService(false));
        }
    }, [router, serviceId, serviceNameInitial, priceInitial]);

    const displayServiceName = serviceNameInitial || serviceDetails?.name || "Selected Service";
    const displayPrice = priceInitial || serviceDetails?.price || 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.address || !form.city || !form.zip) {
            setError("Please fill in all address fields");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("access_token");
            const totalAmount = Number(displayPrice) + 99;
            const res = await fetch("http://localhost:4000/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    service_id: Number(serviceId),
                    vendor_id: Number(vendorId || serviceDetails?.vendor_id),
                    user_description: `Address: ${form.address}, ${form.city}, ${form.zip}. Details: ${form.description}`,
                    total_amount: totalAmount
                }),
            });

            const data = await res.json();

            if (data.success) {
                setSuccess(true);
                setTimeout(() => {
                    router.push("/welcome");
                }, 3000);
            } else {
                setError(data.message || "Failed to place order. Please try again.");
            }
        } catch (err) {
            setError("Server error. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--background)]">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white dark:bg-zinc-900 p-10 rounded-[2.5rem] shadow-2xl text-center max-w-md border border-emerald-500/20"
                >
                    <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30">
                        <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-black mb-4">Booking Confirmed!</h2>
                    <p className="text-zinc-500 font-medium">
                        Your service request has been placed successfully. A technician will be assigned shortly.
                    </p>
                    <div className="mt-8 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl text-sm font-semibold opacity-60 uppercase tracking-widest">
                        Redirecting to Dashboard...
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--background)] py-12 px-4 sm:px-6 lg:px-8 selection:bg-sky-500/30">
            <div className="max-w-4xl mx-auto">

                {/* Header Navigation */}
                <Link href="/services" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-[var(--accent)] transition mb-10 group">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
                    Cancel and return
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

                    {/* Main Form */}
                    <div className="lg:col-span-3 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/5 p-8 rounded-[2rem] shadow-sm"
                        >
                            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                                <MapPin className="text-[var(--accent)]" /> Service Address
                            </h2>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-4">
                                    <input
                                        placeholder="Street Address"
                                        value={form.address}
                                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                                        className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-sky-500/10 outline-none transition"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        placeholder="City"
                                        value={form.city}
                                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                                        className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-sky-500/10 outline-none transition"
                                    />
                                    <input
                                        placeholder="ZIP Code"
                                        value={form.zip}
                                        onChange={(e) => setForm({ ...form, zip: e.target.value })}
                                        className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-sky-500/10 outline-none transition"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/5 p-8 rounded-[2rem] shadow-sm"
                        >
                            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                                <Clock className="text-[var(--accent)]" /> Additional Details
                            </h2>
                            <textarea
                                placeholder="Briefly describe the issue or specific requirements..."
                                rows={4}
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-sky-500/10 outline-none transition resize-none"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/5 p-8 rounded-[2rem] shadow-sm"
                        >
                            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                                <CreditCard className="text-[var(--accent)]" /> Payment Method
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    onClick={() => setForm({ ...form, paymentMethod: "cod" })}
                                    className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-start gap-2 ${form.paymentMethod === 'cod' ? 'border-[var(--accent)] bg-sky-50/50 dark:bg-sky-500/5' : 'border-zinc-100 dark:border-white/5 hover:border-[var(--accent)]/50'}`}
                                >
                                    <Truck className={`w-6 h-6 ${form.paymentMethod === 'cod' ? 'text-[var(--accent)]' : 'text-zinc-400'}`} />
                                    <span className="font-bold text-sm">Cash on Visit</span>
                                    <span className="text-[10px] uppercase tracking-wider opacity-50">Pay after completion</span>
                                </button>
                                <button
                                    onClick={() => setForm({ ...form, paymentMethod: "online" })}
                                    className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-start gap-2 ${form.paymentMethod === 'online' ? 'border-[var(--accent)] bg-sky-50/50 dark:bg-sky-500/5' : 'border-zinc-100 dark:border-white/5 hover:border-[var(--accent)]/50'}`}
                                >
                                    <CreditCard className={`w-6 h-6 ${form.paymentMethod === 'online' ? 'text-[var(--accent)]' : 'text-zinc-400'}`} />
                                    <span className="font-bold text-sm">Online Payment</span>
                                    <span className="text-[10px] uppercase tracking-wider opacity-50">Secure instant checkout</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar Summary */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="sticky top-24 space-y-6"
                        >
                            <div className="bg-zinc-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <ShieldCheck className="w-24 h-24" />
                                </div>

                                <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-40 mb-6">Booking Summary</h3>

                                <div className="space-y-6 relative z-10">
                                    <div>
                                        {fetchingService ? (
                                            <Loader2 className="w-5 h-5 animate-spin text-sky-400" />
                                        ) : (
                                            <>
                                                <h4 className="text-xl font-black">{displayServiceName}</h4>
                                                <p className="text-zinc-400 text-sm mt-1 mb-3">Provider: <span className="font-bold text-gray-200">{vendorName || serviceDetails?.vendor_name || "Verified Partner"}</span></p>
                                                <p className="text-[11px] text-zinc-500 italic bg-white/5 p-3 rounded-xl border border-white/5">
                                                    {serviceDetails?.short_description || serviceDetails?.description || "Professional service delivery with quality assurance."}
                                                </p>
                                            </>
                                        )}
                                    </div>

                                    <div className="pt-6 border-t border-white/10 space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="opacity-60 font-medium">Base Price</span>
                                            <span className="font-bold">₹{displayPrice}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="opacity-60 font-medium">Service Fee</span>
                                            <span className="font-bold">₹99</span>
                                        </div>
                                        <div className="flex justify-between text-xl font-black pt-4 border-t border-white/10 text-[var(--accent)]">
                                            <span>Total</span>
                                            <span>₹{Number(displayPrice) + 99}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading || fetchingService}
                                        className="w-full bg-[var(--accent)] hover:bg-sky-400 text-black py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-sky-500/20 disabled:opacity-50 h-14"
                                    >
                                        {loading ? "Processing..." : "Confirm Booking"}
                                    </button>

                                    <p className="text-[10px] text-center opacity-40 font-bold uppercase tracking-widest mt-4">
                                        Secure 256-bit encrypted checkout
                                    </p>
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-red-50 dark:bg-red-500/10 border border-red-500/20 p-5 rounded-2xl flex items-center gap-4 text-red-500 text-sm font-bold"
                                >
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    {error}
                                </motion.div>
                            )}

                            <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl space-y-4 border border-zinc-200 dark:border-white/5">
                                <div className="flex items-center gap-4 text-xs font-bold opacity-60">
                                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                    Verified Professionals Only
                                </div>
                                <div className="flex items-center gap-4 text-xs font-bold opacity-60">
                                    <Calendar className="w-4 h-4 text-sky-500" />
                                    Flexible Rescheduling
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default function BookingPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin" /></div>}>
            <BookingContent />
        </Suspense>
    );
}
