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
    Loader2,
    ArrowRight
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
            const priceVal = Number(displayPrice) || 0;
            const totalAmount = priceVal + 99;
            const finalVendorId = Number(vendorId || serviceDetails?.vendor_id || 0);

            if (!finalVendorId) {
                setError("Provider information missing. Please try again.");
                setLoading(false);
                return;
            }

            const res = await fetch("http://localhost:4000/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    service_id: Number(serviceId),
                    vendor_id: finalVendorId,
                    user_description: `Address: ${form.address}, ${form.city}, ${form.zip}. Details: ${form.description}`,
                    total_amount: totalAmount
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Platform synchronization failed during order creation.");
            }

            if (data.success) {
                if (form.paymentMethod === "online") {
                    // Initiate Paytm Payment
                    const paytmRes = await fetch("http://localhost:4000/api/payments/initiate", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            orderId: data.data.id,
                            amount: totalAmount
                        }),
                    });

                    const paytmData = await paytmRes.json();

                    if (!paytmRes.ok) {
                        throw new Error(paytmData.message || "Payment initiation failed");
                    }

                    // Redirect to Paytm (or Simulation)
                    const paytmUrl = paytmData?.paytmUrl;
                    if (!paytmUrl) {
                        throw new Error("Invalid redirection pulse from payment node.");
                    }

                    const formDetails = { ...paytmData };
                    delete formDetails.paytmUrl;

                    if (paytmUrl.includes('localhost:3000')) {
                        // Trial Simulation: Use Query Params for ease of local testing
                        const params = new URLSearchParams(formDetails).toString();
                        router.push(`${paytmUrl}?${params}`);
                        return;
                    }

                    const form_el = document.createElement('form');
                    form_el.method = 'POST';
                    form_el.action = paytmUrl;

                    Object.keys(formDetails).forEach(key => {
                        const input = document.createElement('input');
                        input.type = 'hidden';
                        input.name = key;
                        input.value = formDetails[key];
                        form_el.appendChild(input);
                    });

                    document.body.appendChild(form_el);
                    form_el.submit();
                } else {
                    setSuccess(true);
                    setTimeout(() => {
                        router.push("/orders");
                    }, 3000);
                }
            } else {
                setError(data.message || "Failed to place order. Please try again.");
            }
        } catch (err: any) {
            setError(err.message || "Server error. Please check your connection.");
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
            {/* Background Decorative Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-sky-500/5 rounded-full blur-[120px]" />
                <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-indigo-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">

                {/* Header Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-10"
                >
                    <Link href="/services" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-[var(--accent)] transition group">
                        <div className="w-8 h-8 rounded-full bg-white dark:bg-white/5 flex items-center justify-center border border-zinc-200 dark:border-white/10 group-hover:border-sky-500/50 transition-all">
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition" />
                        </div>
                        Cancel and return
                    </Link>
                    <div className="flex gap-2">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className={`h-1.5 w-8 rounded-full transition-all ${s === 1 ? 'bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]' : 'bg-zinc-200 dark:bg-white/10'}`} />
                        ))}
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

                    {/* Main Form */}
                    <div className="lg:col-span-3 space-y-8">
                        <section>
                            <h2 className="text-sm font-black text-zinc-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                                <span className="w-6 h-px bg-zinc-200 dark:bg-white/10" />
                                01. Location Details
                            </h2>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/5 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-sky-500/5 transition-all duration-500"
                            >
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-sky-500 transition-colors">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <input
                                            placeholder="Street Address"
                                            value={form.address}
                                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                                            className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl pl-12 pr-5 py-4 text-sm focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            placeholder="City"
                                            value={form.city}
                                            onChange={(e) => setForm({ ...form, city: e.target.value })}
                                            className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all"
                                        />
                                        <input
                                            placeholder="ZIP Code"
                                            value={form.zip}
                                            onChange={(e) => setForm({ ...form, zip: e.target.value })}
                                            className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </section>

                        <section>
                            <h2 className="text-sm font-black text-zinc-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                                <span className="w-6 h-px bg-zinc-200 dark:bg-white/10" />
                                02. Service Notes
                            </h2>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/5 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-sky-500/5 transition-all duration-500"
                            >
                                <textarea
                                    placeholder="Briefly describe the issue or specific requirements... (e.g. Best time for visit, specific problems)"
                                    rows={4}
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="w-full bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all resize-none"
                                />
                            </motion.div>
                        </section>

                        <section>
                            <h2 className="text-sm font-black text-zinc-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                                <span className="w-6 h-px bg-zinc-200 dark:bg-white/10" />
                                03. Secure Checkout
                            </h2>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/5 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-sky-500/5 transition-all duration-500"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setForm({ ...form, paymentMethod: "cod" })}
                                        className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-start gap-3 group relative overflow-hidden ${form.paymentMethod === 'cod' ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-500/10' : 'border-zinc-100 dark:border-white/5 hover:border-sky-500/30'}`}
                                    >
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${form.paymentMethod === 'cod' ? 'bg-sky-500 text-white' : 'bg-zinc-100 dark:bg-white/5 text-zinc-400 group-hover:text-sky-500'}`}>
                                            <Truck className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <span className="font-black text-sm block">Cash on Visit</span>
                                            <span className="text-[10px] uppercase tracking-wider opacity-50 font-bold">Pay after completion</span>
                                        </div>
                                        {form.paymentMethod === 'cod' && (
                                            <motion.div layoutId="payment-check" className="absolute top-4 right-4 text-sky-500">
                                                <CheckCircle2 className="w-5 h-5" />
                                            </motion.div>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setForm({ ...form, paymentMethod: "online" })}
                                        className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-start gap-3 group relative overflow-hidden ${form.paymentMethod === 'online' ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-500/10' : 'border-zinc-100 dark:border-white/5 hover:border-sky-500/30'}`}
                                    >
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${form.paymentMethod === 'online' ? 'bg-sky-500 text-white' : 'bg-zinc-100 dark:bg-white/5 text-zinc-400 group-hover:text-sky-500'}`}>
                                            <CreditCard className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <span className="font-black text-sm block">Online Payment</span>
                                            <span className="text-[10px] uppercase tracking-wider opacity-50 font-bold">Instant & Secure</span>
                                        </div>
                                        {form.paymentMethod === 'online' && (
                                            <motion.div layoutId="payment-check" className="absolute top-4 right-4 text-sky-500">
                                                <CheckCircle2 className="w-5 h-5" />
                                            </motion.div>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        </section>
                    </div>

                    {/* Sidebar Summary */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="sticky top-24 space-y-6"
                        >
                            <div className="bg-zinc-900 text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden border border-white/10">
                                {/* Glossy Effect */}
                                <div className="absolute -top-24 -right-24 w-48 h-48 bg-sky-400/20 rounded-full blur-3xl" />

                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-8 flex items-center gap-2">
                                    <ShieldCheck className="w-3 h-3 text-sky-400" /> Booking Intelligence
                                </h3>

                                <div className="space-y-8 relative z-10">
                                    <div>
                                        {fetchingService ? (
                                            <div className="flex items-center gap-3 py-4">
                                                <Loader2 className="w-5 h-5 animate-spin text-sky-400" />
                                                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Fetching Details...</span>
                                            </div>
                                        ) : (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                                <h4 className="text-2xl font-black leading-tight">{displayServiceName}</h4>
                                                <div className="flex items-center gap-2 mt-2 mb-4">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                    <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">Provider: <span className="text-white">{vendorName || serviceDetails?.vendor_name || "Verified Partner"}</span></p>
                                                </div>
                                                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                                                    <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                                                        {serviceDetails?.short_description || serviceDetails?.description || "Professional service delivery with end-to-end quality assurance and post-service warranty."}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>

                                    <div className="pt-8 border-t border-white/10 space-y-4">
                                        <div className="flex justify-between items-center text-xs font-bold">
                                            <span className="opacity-40 uppercase tracking-widest">Base Rate</span>
                                            <span className="bg-white/5 px-3 py-1 rounded-lg">₹{displayPrice}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs font-bold">
                                            <div className="flex items-center gap-2">
                                                <span className="opacity-40 uppercase tracking-widest">Service Fee</span>
                                                <div className="w-4 h-4 rounded-full bg-white/5 flex items-center justify-center text-[8px] cursor-help" title="Platform & Safety Fee">?</div>
                                            </div>
                                            <span className="text-sky-400 bg-sky-400/10 px-3 py-1 rounded-lg">₹99</span>
                                        </div>
                                        <div className="flex justify-between items-end pt-6 border-t border-white/10">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Total Payable</p>
                                                <p className="text-3xl font-black text-white tracking-tight">₹{Number(displayPrice) + 99}</p>
                                            </div>
                                            <div className="mb-1">
                                                <span className="text-[10px] font-black text-emerald-500 uppercase bg-emerald-500/10 px-2 py-1 rounded-md">Inc. GST</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading || fetchingService}
                                        className="w-full bg-sky-500 hover:bg-sky-400 text-white h-16 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all shadow-xl shadow-sky-500/20 active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-3 group"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Processing
                                            </>
                                        ) : (
                                            <>
                                                Confirm Booking
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>

                                    <div className="flex items-center justify-center gap-4 py-2">
                                        <div className="h-px flex-1 bg-white/5" />
                                        <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-20">Secure Shield</span>
                                        <div className="h-px flex-1 bg-white/5" />
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-red-500/10 border border-red-500/20 p-5 rounded-3xl flex items-start gap-4 text-red-500 shadow-xl shadow-red-500/5"
                                >
                                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest">Protocol Error</p>
                                        <p className="text-xs font-bold leading-relaxed">{error}</p>
                                    </div>
                                </motion.div>
                            )}

                            <div className="p-8 bg-white dark:bg-zinc-900/50 rounded-[2.5rem] space-y-5 border border-zinc-200 dark:border-white/5 backdrop-blur-xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-black uppercase tracking-widest">Verified Pro</p>
                                        <p className="text-[10px] font-medium opacity-50">Background checked experts</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-sky-500" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-black uppercase tracking-widest">Easy Reschedule</p>
                                        <p className="text-[10px] font-medium opacity-50">Up to 2 hours before start</p>
                                    </div>
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
