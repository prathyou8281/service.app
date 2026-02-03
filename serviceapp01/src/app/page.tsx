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
  CheckCircle2,
  Globe,
  Award,
  Users
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
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative h-full bg-[#0f172a]/40 backdrop-blur-md border border-white/5 p-8 rounded-3xl hover:border-blue-500/30 transition-all duration-300">
        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 mb-6">
          <Icon className="w-7 h-7" />
        </div>
        <p className="font-bold text-lg text-slate-200 tracking-tight group-hover:text-white transition-colors">{title}</p>
      </div>
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
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#05070a] text-white selection:bg-blue-500/30">

      {/* 🔹 DYNAMIC BACKGROUND DECOR */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[1000px] h-[1000px] bg-blue-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[150px]" />
        <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-sky-600/5 rounded-full blur-[120px]" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <main className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12 py-12 lg:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-20">

          {/* LEFT SIDE: CONTENT */}
          <div className="flex-1 text-center lg:text-left relative z-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] mb-10 border border-white/10 text-blue-400 shadow-xl shadow-blue-900/10"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">Trusted by 50,000+ Enterprises</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl lg:text-8xl font-black text-white leading-[0.95] tracking-tighter mb-8"
            >
              Smart Solutions.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400">Faster Living.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-slate-400 text-lg lg:text-xl font-medium mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed tracking-wide"
            >
              Your global destination for elite IT maintenance, hardware repairs, and professional gadget support. Delivered at your doorstep.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start"
            >
              <Link href="/explore" className="h-14 px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-[0_10px_40px_-10px_rgba(37,99,235,0.5)] active:scale-95 group">
                Begin Exploration <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/login" className="h-14 px-8 bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-md rounded-full text-sm font-bold uppercase tracking-widest flex items-center justify-center transition-all hover:border-white/20 active:scale-95">
                Book a Professional
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-20 flex flex-wrap justify-center lg:justify-start gap-12 border-t border-white/5 pt-10"
            >
              <StatItem label="Global Reach" icon={Globe} />
              <StatItem label="Enterprise Secured" icon={ShieldCheck} />
              <StatItem label="ISO Certified" icon={Award} />
            </motion.div>
          </div>

          {/* RIGHT SIDE: INTERACTIVE ELEMENTS */}
          <div className="flex-1 relative hidden lg:block w-full max-w-[600px]">
            <div className="absolute inset-0 bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen" />
            <div className="relative z-10 grid grid-cols-2 gap-6 perspective-1000">
              <ServiceCard title="Laptop Repair" icon={Laptop} delay={0.2} />
              <ServiceCard title="Mobile Care" icon={Smartphone} delay={0.3} />
              <ServiceCard title="System Setup" icon={Monitor} delay={0.4} />
              <ServiceCard title="Chip Level" icon={Cpu} delay={0.5} />
            </div>
          </div>
        </div>

        {/* FEATURE SECTION */}
        <div className="mt-40 border-t border-white/5 pt-20">
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16">
            <Feature
              title="Verified Experts"
              desc="Every technician undergoes rigorous background and skill verification."
              icon={Users}
              delay={0.2}
            />
            <Feature
              title="Live Tracking"
              desc="Monitor your service progress and technician location in real-time."
              icon={Monitor}
              delay={0.4}
            />
            <Feature
              title="MNC Billing"
              desc="Transparent pricing with GST compliant professional invoicing."
              icon={CheckCircle2}
              delay={0.6}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

function StatItem({ label, icon: Icon }: any) {
  return (
    <div className="flex items-center gap-3 text-slate-500 opacity-60 hover:opacity-100 transition-opacity duration-300">
      <Icon className="w-5 h-5" />
      <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
    </div>
  );
}

function Feature({ title, desc, icon: Icon, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      className="flex flex-col items-center lg:items-start text-center lg:text-left group"
    >
      <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:border-blue-500/30 group-hover:bg-blue-600/10 transition-all duration-300">
        <Icon className="w-7 h-7 text-slate-400 group-hover:text-blue-400 transition-colors" />
      </div>
      <h3 className="font-bold text-xl mb-3 text-white tracking-tight">{title}</h3>
      <p className="text-slate-400 font-medium text-sm leading-relaxed max-w-sm">{desc}</p>
    </motion.div>
  );
}
