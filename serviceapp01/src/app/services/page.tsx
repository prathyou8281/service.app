"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
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
    Loader2,
    ChevronLeft,
    Users,
    Search
} from "lucide-react";

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

interface ServiceCategory {
    name: string;
    short_description: string;
    starting_price: number;
    icon: string;
    vendor_count: number;
}

export default function ServicesPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch("http://localhost:4000/api/services/unique");
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error("Failed to fetch service categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.short_description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCategoryClick = (category: ServiceCategory) => {
        router.push(`/services/vendors?name=${encodeURIComponent(category.name)}`);
    };

    return (
        <section className="min-h-screen px-6 py-12 bg-white selection:bg-sky-500/30">
            <div className="max-w-7xl mx-auto">

                {/* BACK BUTTON */}
                <Link href="/welcome" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-sky-500 transition mb-12 group">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
                    Dashboard
                </Link>

                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-tight">
                            What service <br />
                            <span className="text-sky-500">do you need today?</span>
                        </h1>
                        <p className="mt-4 max-w-xl text-lg text-gray-500 font-medium">
                            We've partnered with the best service providers in your city to ensure high-quality and reliable work.
                        </p>
                    </motion.div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search for repair, setup..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-50 border border-transparent focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium outline-none transition-all"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-12 h-12 text-sky-500 animate-spin" />
                        <p className="text-xs font-black uppercase tracking-widest text-gray-400">Loading catalog...</p>
                    </div>
                ) : (
                    /* SERVICES GRID */
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredCategories.map((cat, idx) => {
                            const IconComponent = IconMap[cat.icon] || Package;
                            return (
                                <motion.div
                                    key={cat.name}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: idx * 0.04 }}
                                    viewport={{ once: true }}
                                    onClick={() => handleCategoryClick(cat)}
                                    className="group cursor-pointer bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:border-sky-200 transition-all duration-500 flex flex-col relative overflow-hidden active:scale-95"
                                >
                                    {/* ICON */}
                                    <div className="w-16 h-16 rounded-2xl bg-sky-50 flex items-center justify-center mb-8 shadow-sm group-hover:bg-sky-500 group-hover:scale-110 transition-all duration-500">
                                        <IconComponent className="w-8 h-8 text-sky-500 group-hover:text-white transition-colors duration-500" />
                                    </div>

                                    {/* CONTENT */}
                                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-sky-500 transition-colors duration-300">{cat.name}</h2>
                                    <p className="text-xs text-gray-500 mt-2 flex-1 font-medium leading-relaxed line-clamp-2">
                                        {cat.short_description}
                                    </p>

                                    <div className="mt-8 flex items-end justify-between border-t border-gray-50 pt-6">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Starting at</p>
                                            <p className="text-xl font-black text-gray-900 group-hover:text-sky-500 transition-colors">₹{cat.starting_price}</p>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                <Users className="w-3.5 h-3.5" />
                                                {cat.vendor_count} Options
                                            </div>
                                            <span className="text-[10px] font-black text-sky-600 border-b-2 border-transparent group-hover:border-sky-600 transition-colors mt-1">Book Now</span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
