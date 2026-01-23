"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Laptop,
  Monitor,
  Wrench,
  HelpCircle,
  Search,
  ChevronRight,
  ShieldCheck,
  Star,
  Settings,
  Cpu,
  Smartphone,
  Zap
} from "lucide-react";
import ProfileDropdown from "@/components/ProfileDropdown/ProfileDropdown";

const API_BASE_URL = "http://localhost:4000/api";

export default function ExploreServices() {
  const router = useRouter();
  const [serviceTypes, setServiceTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Auth check for navbar
    const userData = localStorage.getItem("userData");
    if (userData) setUser(JSON.parse(userData));

    // Fetch ONLY service types from DB
    fetch(`${API_BASE_URL}/services/types`)
      .then(res => res.json())
      .then(data => {
        // Handle potential NestJS response wrapper
        const types = Array.isArray(data) ? data : (data.data || []);
        setServiceTypes(types);
      })
      .catch(err => console.error("Failed to fetch service types", err))
      .finally(() => setLoading(false));
  }, []);

  const getIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('laptop')) return Laptop;
    if (lower.includes('computer') || lower.includes('pc')) return Monitor;
    if (lower.includes('mobile') || lower.includes('phone')) return Smartphone;
    if (lower.includes('electrical') || lower.includes('ac')) return Zap;
    if (lower.includes('repair') || lower.includes('service')) return Wrench;
    if (lower.includes('chip') || lower.includes('hardware')) return Cpu;
    return Settings;
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Banner */}
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-blue-100"
          >
            <ShieldCheck className="w-4 h-4" /> 100% Verified Technicians Only
          </motion.div>
          <h2 className="text-4xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
            Everything you need,<br />
            <span className="text-blue-600 underline underline-offset-8 decoration-4 decoration-blue-100">Professionally Handled.</span>
          </h2>
          <p className="text-[var(--muted)] text-lg font-medium max-w-2xl mx-auto">
            Choose from our specialized categories. Every service type is powered by certified experts vetted by our quality control team.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-slate-100 rounded-[2rem] animate-pulse"></div>
            ))}
          </div>
        ) : serviceTypes.length === 0 ? (
          <div className="text-center py-24 card border-dashed">
            <HelpCircle className="w-12 h-12 text-[var(--muted)] mx-auto mb-4" />
            <p className="text-[var(--muted)] font-bold">No service categories active at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {serviceTypes.map((type, idx) => {
              const IconComp = getIcon(type.name);
              return (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  viewport={{ once: true }}
                  onClick={() => router.push(`/services/vendors?typeId=${type.id}&name=${encodeURIComponent(type.name)}`)}
                  className="card p-8 group cursor-pointer hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                      <IconComp className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-black mb-3">{type.name}</h3>
                    <p className="text-sm font-medium text-[var(--muted)] leading-relaxed mb-6">
                      Premium {type.name.toLowerCase()} solutions by top-rated industry specialists.
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-[var(--border)]">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="text-sm font-bold">4.9</span>
                    </div>
                    <button className="flex items-center gap-2 text-sm font-black text-blue-600 group-hover:translate-x-1 transition-transform">
                      Explore <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Support Section */}
        <section className="mt-32 card p-12 bg-slate-950 text-white border-none overflow-hidden relative">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="text-center md:text-left">
              <h3 className="text-3xl font-black mb-4">Can't find what you need?</h3>
              <p className="text-slate-400 font-medium max-w-md">Our enterprise team handles custom requests for large organizations and special hardware.</p>
            </div>
            <button className="bg-white text-slate-950 px-10 py-4 font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all whitespace-nowrap">
              Contact Enterprise
            </button>
          </div>

          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        </section>
      </main>
    </div>
  );
}
