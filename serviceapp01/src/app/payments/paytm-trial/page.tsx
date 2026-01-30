"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShieldCheck,
    Lock,
    Smartphone,
    CreditCard,
    Loader2,
    CheckCircle2,
    XCircle,
    Fingerprint,
    QrCode,
    Globe,
    Wallet,
    Building,
    ArrowRight,
    Zap,
    Info,
    ChevronRight,
    Shield,
    History,
    InfoIcon
} from "lucide-react";

// 🔹 CSS LOGO COMPONENT
const PaytmLogo = () => (
    <div className="flex items-baseline select-none">
        <span className="text-4xl font-black tracking-tighter text-white italic">pay</span>
        <span className="text-4xl font-black tracking-tighter text-[#00baf2] italic">tm</span>
    </div>
);

// 🔹 DYNAMIC CSS QR COMPONENT
const DynamicQR = () => (
    <div className="relative w-full h-full bg-white p-2 flex items-center justify-center">
        <div className="grid grid-cols-4 grid-rows-4 gap-1 w-full h-full opacity-20 group-hover:opacity-40 transition-opacity">
            {[...Array(16)].map((_, i) => (
                <div key={i} className="bg-slate-900 rounded-sm" />
            ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#00baf2] rounded-xl flex items-center justify-center">
                <div className="w-4 h-4 bg-[#00baf2] rounded-sm animate-pulse" />
            </div>
        </div>
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-slate-900" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-slate-900" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-slate-900" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-slate-900" />
    </div>
);

function PaytmGatewayContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<'wallet' | 'qr' | 'upi' | 'cards'>('wallet');
    const [status, setStatus] = useState<'browsing' | 'processing' | 'success' | 'failed'>('browsing');
    const [upiId, setUpiId] = useState("");

    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");
    const mid = searchParams.get("mid") || "PAYTM_MERCHANT_PRO_99";

    const executeTrialTransition = async (isSuccess: boolean) => {
        setStatus('processing');
        await new Promise(r => setTimeout(r, 2000));

        if (isSuccess) {
            setStatus('success');
            try {
                await fetch("http://localhost:4000/api/payments/callback/simulated", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ORDER_ID: `ORDER_${orderId}_${Date.now()}`,
                        STATUS: 'TXN_SUCCESS',
                        TXNID: `PT_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                        CHECKSUMHASH: 'PURE_CSS_GATEWAY_AUTH'
                    })
                });

                setTimeout(() => {
                    router.replace(`/orders?payment=success&orderId=${orderId}`);
                }, 2000);
            } catch (e) {
                console.error("Gateway sync failed", e);
            }
        } else {
            setStatus('failed');
            setTimeout(() => router.replace(`/orders?payment=failed&message=Transaction cancelled by consumer.`), 2000);
        }
    };

    return (
        <div className="min-h-screen bg-[#f1f4f9] flex items-center justify-center p-4 md:p-10 font-sans selection:bg-[#00baf2]/20">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-5xl bg-white rounded-[3rem] shadow-[0_80px_150px_-30px_rgba(0,46,110,0.18)] overflow-hidden flex flex-col md:flex-row min-h-[700px] border border-white"
            >
                {/* 🔹 LEFT PANEL: ORIGINAL PAYTM BRANDING */}
                <div className="md:w-[380px] bg-gradient-to-br from-[#002e6e] via-[#001c4a] to-[#000d23] p-12 text-white flex flex-col justify-between relative overflow-hidden">
                    {/* Ornamental Background */}
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                        <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#00baf2]/10 rounded-full blur-[100px]" />
                        <div className="absolute top-1/2 -right-20 w-60 h-60 bg-[#00baf2]/5 rounded-full blur-[80px]" />
                    </div>

                    <div className="relative z-10">
                        <div className="mb-16">
                            <PaytmLogo />
                            <div className="flex items-center gap-2 mt-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00baf2]/60">Gateway Protocol</span>
                                <div className="h-px flex-1 bg-white/10" />
                            </div>
                        </div>

                        <div className="space-y-10">
                            <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00baf2]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00baf2] mb-4">Total Amount Due</p>
                                <p className="text-5xl font-black mb-10 tracking-tighter">₹{amount}</p>

                                <div className="space-y-5">
                                    <div className="flex justify-between items-center text-[11px] font-bold">
                                        <span className="opacity-30 uppercase tracking-widest">Order Reference</span>
                                        <span className="opacity-60">SH_{orderId?.padStart(6, '0')}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[11px] font-bold">
                                        <span className="opacity-30 uppercase tracking-widest">Merchant pulse</span>
                                        <span className="opacity-60 uppercase font-black tracking-tighter">ServiceHub Pro</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#00baf2]/5 border border-[#00baf2]/10 rounded-3xl p-6 flex gap-4">
                                <ShieldCheck className="w-6 h-6 text-[#00baf2] shrink-0" />
                                <p className="text-[10px] font-bold text-white/50 leading-relaxed uppercase tracking-widest">Your payment is protected by end-to-end encryption nodes. Transactions are instant and verified by BHIM UPI.</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 hidden md:block border-t border-white/5 pt-10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black text-[#00baf2] uppercase tracking-[0.2em] mb-1">Merchant Identity</p>
                                <p className="text-[11px] font-bold opacity-30 uppercase tracking-tighter">{mid}</p>
                            </div>
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
                                <Lock className="w-5 h-5 text-white/40" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 🔹 RIGHT PANEL: THE PAYMENT HUB */}
                <div className="flex-1 bg-white flex flex-col">
                    {/* Header Progress */}
                    <div className="px-12 pt-10 flex items-center justify-between">
                        <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Transaction Methodology</h2>
                        <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-100/50">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">Vanguard Link Active</span>
                        </div>
                    </div>

                    {/* 🔹 DYNAMIC TABS (WALLET FIRST) */}
                    <div className="px-12 mt-10">
                        <div className="bg-slate-50/80 p-2.5 rounded-[2.5rem] flex items-center shadow-inner border border-slate-100">
                            {[
                                { id: 'wallet', icon: Wallet, label: 'Wallet' },
                                { id: 'qr', icon: QrCode, label: 'QR Scan' },
                                { id: 'upi', icon: Smartphone, label: 'UPI Sync' },
                                { id: 'cards', icon: CreditCard, label: 'Cards' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex-1 py-5 px-4 rounded-[2rem] flex items-center justify-center gap-3 transition-all duration-500 relative ${activeTab === tab.id ? 'bg-white text-[#002e6e] shadow-[0_15px_30px_-5px_rgba(0,46,110,0.1)] scale-105 z-10' : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'}`}
                                >
                                    <tab.icon className={`w-4.5 h-4.5 ${activeTab === tab.id ? 'text-[#00baf2]' : 'opacity-40'}`} />
                                    <span className="text-[11px] font-black uppercase tracking-widest">{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 px-12 py-12 overflow-y-auto">
                        <AnimatePresence mode="wait">
                            {status === 'browsing' && (
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="h-full flex flex-col"
                                >
                                    {activeTab === 'wallet' && (
                                        <div className="flex flex-col h-full space-y-12 py-4">
                                            <div className="space-y-6">
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Paytm Wallet</h3>
                                                        <p className="text-[11px] font-bold text-[#00baf2] uppercase tracking-[0.3em] mt-3">Primary Balance Source</p>
                                                    </div>
                                                    <Wallet className="w-10 h-10 text-slate-100" />
                                                </div>

                                                <div className="bg-[#002e6e] p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl group">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-[#00baf2]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                                    <div className="flex justify-between items-start mb-12 relative z-10">
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00baf2] mb-2">Authenticated User</p>
                                                            <p className="text-lg font-bold tracking-tight">Prathyush C</p>
                                                        </div>
                                                        <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-black text-emerald-400 uppercase tracking-widest">KYC Verified</div>
                                                    </div>
                                                    <div className="relative z-10">
                                                        <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">Available Pulse</p>
                                                        <p className="text-4xl font-black tracking-tighter">₹8,750.00</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-sky-50 p-8 rounded-[2.5rem] border border-sky-100 flex gap-5">
                                                <Zap className="w-6 h-6 text-[#00baf2] shrink-0" />
                                                <p className="text-[11px] text-[#002e6e] font-bold leading-relaxed">Fast-track payment enabled. Double-click the button below to authorize instant wallet deduction.</p>
                                            </div>

                                            <button
                                                onClick={() => executeTrialTransition(true)}
                                                className="w-full h-24 bg-gradient-to-r from-[#00baf2] to-[#002e6e] hover:from-[#00a8dc] hover:to-[#001e4a] text-white rounded-[2rem] flex items-center justify-between px-12 font-black uppercase text-xs tracking-[0.4em] transition-all duration-500 shadow-2xl shadow-sky-900/10 active:scale-[0.98]"
                                            >
                                                <span>Authorize ₹{amount}</span>
                                                <ArrowRight className="w-6 h-6" />
                                            </button>
                                        </div>
                                    )}

                                    {activeTab === 'qr' && (
                                        <div className="flex flex-col items-center justify-center h-full text-center space-y-12">
                                            <div className="relative group">
                                                <div className="absolute inset-0 bg-[#00baf2]/20 rounded-[3.5rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                                <div className="relative w-80 h-80 bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-[0_50px_100px_-20px_rgba(0,46,110,0.12)] flex items-center justify-center cursor-pointer">
                                                    <DynamicQR />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Ready for Scan</h3>
                                                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.3em] leading-relaxed max-w-xs mx-auto">Scan this digital node with any UPI-enabled application</p>
                                            </div>
                                            <button
                                                onClick={() => executeTrialTransition(true)}
                                                className="group relative h-20 w-full max-w-sm bg-slate-900 text-white rounded-[2.2rem] overflow-hidden transition-all duration-500 shadow-2xl shadow-slate-900/10 active:scale-[0.98]"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-[#00baf2] to-[#002e6e] translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                                                <div className="relative z-10 flex items-center justify-center gap-4">
                                                    <QrCode className="w-5 h-5 text-[#00baf2]" />
                                                    <span className="text-[11px] font-black uppercase tracking-[0.4em]">Simulate Protocol Scan</span>
                                                </div>
                                            </button>
                                        </div>
                                    )}

                                    {activeTab === 'upi' && (
                                        <div className="space-y-12 py-4">
                                            <div className="space-y-5">
                                                <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase px-2">UPI Address</h3>
                                                <div className="relative group">
                                                    <input
                                                        placeholder="vanguard@paytm"
                                                        value={upiId}
                                                        onChange={(e) => setUpiId(e.target.value)}
                                                        className="w-full h-24 bg-slate-50 border-2 border-slate-50 rounded-[2.2rem] px-10 text-2xl font-black text-slate-900 focus:bg-white focus:border-[#00baf2] outline-none transition-all duration-500 placeholder:text-slate-200"
                                                    />
                                                    <div className="absolute right-10 top-1/2 -translate-y-1/2 flex items-center gap-4">
                                                        <motion.div animate={{ opacity: upiId ? 1 : 0 }} className="text-[10px] font-black text-[#00baf2] uppercase tracking-[0.2em]">Verified</motion.div>
                                                        <CheckCircle2 className={`w-8 h-8 ${upiId ? 'text-[#00baf2]' : 'text-slate-200'}`} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-slate-900 p-10 rounded-[3rem] text-white flex gap-6 shadow-2xl relative overflow-hidden">
                                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#00baf2]/5 rounded-full blur-3xl" />
                                                <Smartphone className="w-12 h-12 text-[#00baf2] shrink-0" />
                                                <div className="space-y-2">
                                                    <p className="text-base font-black uppercase tracking-tight">Push Approval Sync</p>
                                                    <p className="text-[11px] font-bold opacity-40 leading-relaxed uppercase tracking-widest">A secure verification pulse will be sent to your UPI device. Double-check the order amount before authorizing.</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => executeTrialTransition(true)}
                                                disabled={!upiId}
                                                className="w-full h-24 bg-gradient-to-r from-[#00baf2] to-[#002e6e] text-white rounded-[2.2rem] flex items-center justify-center gap-6 font-black uppercase text-xs tracking-[0.4em] transition-all duration-700 disabled:opacity-30 shadow-2xl shadow-sky-900/20"
                                            >
                                                Send Payment Request <ChevronRight className="w-7 h-7" />
                                            </button>
                                        </div>
                                    )}

                                    {activeTab === 'cards' && (
                                        <div className="space-y-10 py-4">
                                            <div className="grid grid-cols-1 gap-10">
                                                <div className="space-y-4">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-6">Instrument Node Entry</p>
                                                    <div className="relative">
                                                        <input
                                                            placeholder="0000 0000 0000 0000"
                                                            className="w-full h-24 bg-slate-50 border-2 border-slate-50 rounded-[2.2rem] px-10 text-xl font-black text-slate-900 focus:bg-white focus:border-[#00baf2] outline-none transition-all duration-500"
                                                        />
                                                        <CreditCard className="w-8 h-8 absolute right-10 top-1/2 -translate-y-1/2 text-slate-200" />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-10">
                                                    <div className="relative">
                                                        <input
                                                            placeholder="MM / YY"
                                                            className="w-full h-20 bg-slate-50 border-2 border-slate-50 rounded-[1.8rem] px-10 text-xl font-black text-slate-900 focus:bg-white focus:border-[#00baf2] outline-none transition-all duration-500"
                                                        />
                                                    </div>
                                                    <div className="relative">
                                                        <input
                                                            placeholder="***"
                                                            type="password"
                                                            className="w-full h-20 bg-slate-50 border-2 border-slate-50 rounded-[1.8rem] px-10 text-xl font-black text-slate-900 focus:bg-white focus:border-[#00baf2] outline-none transition-all duration-500"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => executeTrialTransition(true)}
                                                className="w-full h-24 bg-[#002e6e] text-white rounded-[2.2rem] flex items-center justify-center gap-6 font-black uppercase text-xs tracking-[0.4em] transition-all hover:bg-[#001e4a] shadow-2xl shadow-slate-900/10"
                                            >
                                                Validate Protected Transaction
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {status === 'processing' && (
                                <motion.div
                                    key="processing"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-full flex flex-col items-center justify-center text-center gap-14"
                                >
                                    <div className="relative">
                                        <div className="w-48 h-48 border-[16px] border-slate-50 border-t-[#00baf2] rounded-full animate-[spin_1s_linear_infinite]" />
                                        <Lock className="w-14 h-14 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#002e6e]" />
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">ENCRYPTING TUNNEL</h3>
                                        <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.8em] animate-pulse">Synchronizing Banking Sync...</p>
                                    </div>
                                </motion.div>
                            )}

                            {status === 'success' && (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="h-full flex flex-col items-center justify-center text-center gap-14"
                                >
                                    <div className="w-56 h-56 bg-emerald-50 rounded-[6rem] flex items-center justify-center relative shadow-[0_60px_120px_-30px_rgba(16,185,129,0.3)] border border-emerald-100/50">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1, rotate: 360 }}
                                            transition={{ type: "spring", duration: 2 }}
                                            className="absolute inset-[10px] border-[12px] border-emerald-500 rounded-[5.5rem]"
                                        />
                                        <CheckCircle2 className="w-28 h-28 text-emerald-500" />
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">PAYMENT RECEIVED</h3>
                                        <p className="text-sm text-[#00baf2] font-black tracking-[0.5em] uppercase">Auth Node Verified 200</p>
                                    </div>
                                    <div className="bg-slate-900 p-12 rounded-[3.5rem] flex items-center gap-12 text-white shadow-2xl border border-white/5">
                                        <Fingerprint className="w-16 h-16 text-[#00baf2] animate-pulse" />
                                        <div className="text-left py-2">
                                            <p className="text-[11px] font-black uppercase text-[#00baf2] tracking-[0.4em] mb-2">Immutable Audit Node</p>
                                            <p className="text-[13px] font-bold opacity-50 tracking-widest font-mono uppercase">SYNC_{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer Safety */}
                    <div className="px-14 py-12 border-t border-slate-50 bg-slate-50/10 flex items-center justify-between">
                        <button
                            onClick={() => executeTrialTransition(false)}
                            className="group text-[11px] font-black uppercase tracking-[0.4em] text-slate-300 hover:text-red-500 transition-all flex items-center gap-4"
                        >
                            <XCircle className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" /> Abort Logic
                        </button>
                        <div className="flex items-center gap-10 opacity-20 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Secure 3D Synapse</span>
                            </div>
                            <div className="h-6 w-px bg-slate-300" />
                            <div className="flex gap-4">
                                <div className="w-8 h-5 bg-slate-300 rounded-sm" />
                                <div className="w-8 h-5 bg-slate-300 rounded-sm" />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default function PaytmGatewayPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-[#00baf2]" /></div>}>
            <PaytmGatewayContent />
        </Suspense>
    );
}
