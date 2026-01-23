"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  ArrowRight,
  Laptop,
  Smartphone,
  Monitor,
  Cpu,
  Zap,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";

/* Premium Service Card Component */
function ServiceCard({
  title,
  icon: Icon,
  delay = 0
}: {
  title: string;
  icon: any;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="service-card group"
    >
      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
        <Icon className="w-6 h-6" />
      </div>
      <p className="font-black text-slate-800 tracking-tighter">{title}</p>
    </motion.div>
  );
}

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    try {
      const data = localStorage.getItem("userData");
      if (data) {
        const user = JSON.parse(data);
        const role = user.role?.toLowerCase();
        if (role === "admin") router.replace("/admin/dashboard");
        else if (role === "vendor") router.replace("/vendor/dashboard");
        else if (role === "technician") router.replace("/technician/dashboard");
        else if (role === "user") router.replace("/welcome");
      }
    } catch { }
  }, [router]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-slate-50">

      {/* 🔹 DYNAMIC BACKGROUND DECOR */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] -mr-96 -mt-96" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[100px] -ml-48 -mb-48" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8),transparent_70%)]" />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 pt-32 lg:pt-48 pb-20">
        <div className="flex flex-col lg:flex-row items-center gap-20">

          {/* LEFT SIDE: CONTENT */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-blue-100 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" /> Trusted by 50,000+ Enterprises
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-6xl lg:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-8"
            >
              Smart Solutions.<br />
              <span className="text-blue-600">Faster Living.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-slate-500 text-lg lg:text-xl font-medium mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Your global destination for elite IT maintenance, hardware repairs, and professional gadget support. Delivered at your doorstep.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start"
            >
              <Link href="/explore" className="btn-primary group">
                Begin Exploration <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/login" className="btn-secondary">
                Book a Professional
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-16 flex flex-wrap justify-center lg:justify-start gap-8 opacity-40 grayscale"
            >
              {/* Corporate-style logos placeholder */}
              <span className="text-xs font-black uppercase tracking-widest">Global Reach</span>
              <span className="text-xs font-black uppercase tracking-widest">Enterprise Secured</span>
              <span className="text-xs font-black uppercase tracking-widest">ISO Certified</span>
            </motion.div>
          </div>

          {/* RIGHT SIDE: INTERACTIVE ELEMENTS */}
          <div className="flex-1 relative hidden lg:block">
            <div className="relative z-10 grid grid-cols-2 gap-8 perspective-1000">
              <ServiceCard title="Laptop Repair" icon={Laptop} delay={0.2} />
              <ServiceCard title="Mobile Care" icon={Smartphone} delay={0.3} />
              <ServiceCard title="System Setup" icon={Monitor} delay={0.4} />
              <ServiceCard title="Chip Level" icon={Cpu} delay={0.5} />
            </div>

            {/* Absolute Decorative Blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
          </div>
        </div>

        {/* FEATURE SECTION */}
        <section className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-12">
          <Feature
            title="Verified Experts"
            desc="Every technician undergoes rigorous background and skill verification."
          />
          <Feature
            title="Live Tracking"
            desc="Monitor your service progress and technician location in real-time."
          />
          <Feature
            title="MNC Billing"
            desc="Transparent pricing with GST compliant professional invoicing."
          />
        </section>
      </main>
    </div>
  );
}

function Feature({ title, desc }: any) {
  return (
    <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
      <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6">
        <CheckCircle2 className="w-6 h-6 text-blue-600" />
      </div>
      <h3 className="font-black text-xl mb-3 text-slate-900">{title}</h3>
      <p className="text-slate-500 font-medium text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
