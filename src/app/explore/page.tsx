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
  Users
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

export default function ExploreServices() {
  const router = useRouter();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleServiceClick = (category: ServiceCategory) => {
    router.push(`/services/vendors?name=${encodeURIComponent(category.name)}`);
  };

  return (
    <section className="min-h-screen px-6 py-20 bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Professional Services for{" "}
            <span className="text-[var(--accent)]">Everyday Needs</span>
          </h1>

          <p className="mt-4 max-w-3xl mx-auto text-lg text-[var(--secondary)]">
            Choose a category to find verified professional partners ready to help you instantly.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[var(--accent)]" />
          </div>
        ) : (
          /* SERVICES GRID */
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((cat, idx) => {
              const IconComponent = IconMap[cat.icon] || Package;
              return (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.04 }}
                  viewport={{ once: true }}
                  onClick={() => handleServiceClick(cat)}
                  className="group cursor-pointer bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:border-sky-500/30 transition-all duration-500 flex flex-col relative overflow-hidden"
                >
                  {/* Background Accents */}
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform duration-700">
                    <IconComponent className="w-24 h-24" />
                  </div>

                  {/* ICON */}
                  <div className="w-16 h-16 rounded-2xl bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center mb-8 shadow-sm group-hover:bg-sky-500 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                    <IconComponent className="w-8 h-8 text-sky-500 group-hover:text-white transition-colors duration-500" />
                  </div>

                  {/* CONTENT */}
                  <h2 className="text-2xl font-black mb-3 group-hover:text-sky-500 transition-colors duration-300">{cat.name}</h2>
                  <p className="text-sm text-[var(--secondary)] flex-1 line-clamp-2">
                    {cat.short_description}
                  </p>

                  <div className="mt-8 flex items-end justify-between border-t border-gray-100 dark:border-white/5 pt-6">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Starting at</p>
                      <p className="text-xl font-black text-sky-500">₹{cat.starting_price}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                        <Users className="w-3.5 h-3.5" />
                        {cat.vendor_count} Partners
                      </div>
                      <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest mt-1 group-hover:translate-x-1 transition-transform">Explore →</span>
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
