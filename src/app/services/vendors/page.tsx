"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Store,
    Star,
    MapPin,
    ArrowRight,
    ChevronLeft,
    Loader2,
    ShieldCheck,
    Phone,
    Mail,
    Info,
    Clock,
    Laptop,
    Monitor,
    Wrench,
    Database,
    HardDrive,
    Router,
    Camera,
    Printer,
    Package,
    Battery,
    Smartphone,
    Home,
    Globe,
    Car,
    Cpu,
} from "lucide-react";
import Link from "next/link";

// Helper to map icon names to Lucide components
const IconMap: { [key: string]: any } = {
    Laptop,
    Monitor,
    Wrench,
    Database,
    HardDrive,
    Router,
    Camera,
    Printer,
    Package,
    Battery,
    ShieldCheck,
    Smartphone,
    Home,
    Globe,
    Car,
    Cpu,
};

function VendorListContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const serviceName = searchParams.get("name");

    const [vendors, setVendors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const typeId = searchParams.get("typeId");
        const url = typeId
            ? `http://localhost:4000/api/services?service_type_id=${typeId}`
            : `http://localhost:4000/api/services/by-name/${encodeURIComponent(serviceName || '')}`;

        if (typeId || serviceName) {
            setLoading(true);
            fetch(url)
                .then((res) => res.json())
                .then((data) => {
                    const rows = Array.isArray(data) ? data : (data.data || []);
                    setVendors(rows);
                })
                .catch((err) => console.error("Error fetching vendors:", err))
                .finally(() => setLoading(false));
        }
    }, [serviceName, searchParams]);

    const handleSelectVendor = (service: any) => {
        const userData = localStorage.getItem("userData");
        if (!userData) {
            localStorage.setItem("pendingBooking", JSON.stringify(service));
            router.push("/login?redirect=book-service");
            return;
        }
        router.push(`/book-service?serviceId=${service.id}&serviceName=${encodeURIComponent(service.name)}&price=${service.price}&vendorName=${encodeURIComponent(service.vendor_name)}&vendorId=${service.vendor_id}`);
    };

    return (
        <div className="min-h-screen bg-[var(--background)] px-6 py-12 selection:bg-sky-500/30">
            <div className="max-w-7xl mx-auto">

                {/* Navigation */}
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-sky-500 transition mb-10 group"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
                    Back to Services
                </button>

                <div className="mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                            Best Vendors for <br />
                            <span className="text-sky-500">{serviceName}</span>
                        </h1>
                        <p className="text-gray-500 mt-4 text-lg font-medium">
                            Compare prices and profiles from top-rated service partners.
                        </p>
                    </motion.div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-12 h-12 text-sky-500 animate-spin" />
                        <p className="text-xs font-black uppercase tracking-widest text-gray-400">Finding the best partners...</p>
                    </div>
                ) : vendors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {vendors.map((v, idx) => (
                            <motion.div
                                key={v.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group relative bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:border-sky-100 transition-all duration-500"
                            >
                                {/* Badge */}
                                {v.is_verified ? (
                                    <div className="absolute top-6 right-6">
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                            <ShieldCheck className="w-3 h-3" />
                                            Verified
                                        </div>
                                    </div>
                                ) : (
                                    <div className="absolute top-6 right-6">
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                                            <Clock className="w-3 h-3" />
                                            Partner
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start gap-6 mb-8">
                                    <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                                        {(() => {
                                            const IconComponent = IconMap[v.icon] || Store;
                                            return <IconComponent className="w-8 h-8 text-sky-500" />;
                                        })()}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900 group-hover:text-sky-600 transition-colors">
                                            {v.vendor_name}
                                        </h3>
                                        <div className="flex items-center gap-1 text-amber-500 mt-1">
                                            <Star className="w-3.5 h-3.5 fill-current" />
                                            <Star className="w-3.5 h-3.5 fill-current" />
                                            <Star className="w-3.5 h-3.5 fill-current" />
                                            <Star className="w-3.5 h-3.5 fill-current" />
                                            <Star className="w-3.5 h-3.5 fill-current" />
                                            <span className="text-xs font-black ml-1 text-gray-400">5.0</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="bg-gray-50 rounded-2xl p-4">
                                        <p className="text-xs font-bold text-gray-500 leading-relaxed line-clamp-2">
                                            {v.short_description || v.description || "Certified service professional dedicated to quality and customer satisfaction."}
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                            <MapPin className="w-3.5 h-3.5" />
                                            Local Partner • Fast Response
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                            <Phone className="w-3.5 h-3.5" />
                                            {v.vendor_phone}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Starting from</p>
                                        <p className="text-2xl font-black text-gray-900">₹{v.price}</p>
                                    </div>
                                    <button
                                        onClick={() => handleSelectVendor(v)}
                                        className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-sky-500 transition-all shadow-xl shadow-gray-200 hover:shadow-sky-500/20 active:scale-95"
                                    >
                                        Select
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                        <Info className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-black text-gray-900">No vendors found</h3>
                        <p className="text-gray-500 mt-2 font-medium">We couldn't find any partners offering this service right now.</p>
                        <Link href="/services" className="inline-block mt-8 text-sky-600 font-black uppercase tracking-widest text-xs hover:underline">
                            Try another service
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function VendorSelectionPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-sky-500" /></div>}>
            <VendorListContent />
        </Suspense>
    );
}
