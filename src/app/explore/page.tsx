"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Laptop,
  Monitor,
  Wrench,
  WrenchIcon,
  HelpCircle,
} from "lucide-react";

const API_BASE_URL = "http://localhost:4000/api";

export default function ExploreServices() {
  const router = useRouter();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/services`)
      .then(res => res.json())
      .then(data => {
        setServices(data || []);
      })
      .catch(err => console.error("Failed to fetch services", err))
      .finally(() => setLoading(false));
  }, []);

  const handleBook = (service: any) => {
    const userData = localStorage.getItem("userData");

    if (!userData) {
      router.push(`/login?redirect=book-service&serviceId=${service.id}`);
      return;
    }

    router.push(`/book-service?serviceId=${service.id}`);
  };

  const getIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('laptop')) return Laptop;
    if (lower.includes('pc') || lower.includes('gaming')) return Monitor;
    if (lower.includes('repair') || lower.includes('service')) return Wrench;
    return HelpCircle;
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
            Explore and book trusted services instantly with transparent pricing and expert support.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20 bg-[var(--card-bg)] rounded-3xl border border-[var(--card-border)]">
            <p className="text-[var(--secondary)] font-semibold">No services available at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.map((service, idx) => {
              const IconComp = getIcon(service.name);
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.04 }}
                  viewport={{ once: true }}
                  className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 shadow-md hover:shadow-xl transition flex flex-col"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center mb-5">
                    <IconComp className="w-7 h-7 text-[var(--accent)]" />
                  </div>

                  <h2 className="text-xl font-bold mb-2">{service.name}</h2>
                  <p className="text-sm text-[var(--secondary)] flex-1 line-clamp-3">
                    {service.description}
                  </p>

                  <div className="mt-4 py-2 border-t border-[var(--card-border)] flex items-baseline gap-2">
                    <span className="text-xs font-bold uppercase text-[var(--secondary)]">Starts from</span>
                    <span className="text-xl font-black text-[var(--accent)]">₹{service.price}</span>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => handleBook(service)}
                      className="w-full text-sm font-semibold rounded-xl bg-[var(--accent)] text-white py-3 hover:opacity-90 transition shadow-lg shadow-[var(--accent)]/20"
                    >
                      Book Now
                    </button>
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
