"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Target,
  Eye,
  ShieldCheck,
  Zap,
  Users,
  Activity,
  Layers,
  ArrowUpRight
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#05070a] text-white selection:bg-blue-500/30">

      {/* 🔹 DYNAMIC BACKGROUND DECOR */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[1000px] h-[1000px] bg-blue-600/10 rounded-full blur-[150px] opacity-60" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[150px] opacity-60" />
        <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-sky-600/5 rounded-full blur-[120px] opacity-40" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <main className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12 py-12 lg:py-24">

        {/* 🔹 HERO SECTION */}
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 mb-32">

          {/* Left: Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] mb-10 border border-white/10 text-blue-400 shadow-xl shadow-blue-900/10"
            >
              <Users className="w-4 h-4" />
              <span className="bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent underline decoration-blue-500/30 underline-offset-4">Our Journey</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl lg:text-8xl font-black text-white leading-[0.95] tracking-tighter mb-10"
            >
              About<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400">Our Service App</span>
            </motion.h1>

            <div className="space-y-8">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-slate-400 text-lg lg:text-xl font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed tracking-wide"
              >
                Welcome to our platform — where we connect users and vendors seamlessly.
                Our goal is to make service booking, vendor discovery, and customer
                management effortless and reliable. From personal tasks to professional
                projects, our app brings skilled service providers right to your fingertips.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-slate-500 text-base lg:text-lg font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              >
                We believe in trust, transparency, and technology. With secure
                authentication, real-time updates, and user-friendly design, our
                platform ensures an outstanding experience for everyone — customers,
                vendors, and admins alike.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-12 flex flex-wrap justify-center lg:justify-start gap-12 border-t border-white/5 pt-10"
            >
              <div className="flex items-center gap-3 text-slate-500">
                <ShieldCheck className="w-5 h-5 text-blue-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Secure</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Instant Delivery</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <Activity className="w-5 h-5 text-indigo-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Real-time Updates</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Visual Element */}
          <div className="flex-1 relative w-full flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[500px] aspect-square lg:aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 group shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 mix-blend-overlay z-10" />
              <Image
                src="/images/logo.webp"
                alt="About Hero"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out"
              />

              {/* Glass Overlay Card */}
              <div className="absolute bottom-8 left-8 right-8 bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] z-20">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-lg text-white tracking-tight">Enterprise Standard</h4>
                </div>
                <p className="text-slate-300 text-sm font-medium">Delivering reliability at a global scale.</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 🔹 MISSION & VISION SECTION */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 relative">
          <PageCard
            icon={Target}
            title="Our Mission"
            content="To empower people and businesses by simplifying how services are discovered and delivered through technology, trust, and innovation."
            delay={0.5}
            theme="blue"
          />
          <PageCard
            icon={Eye}
            title="Our Vision"
            content="To become the most trusted service app where customers and vendors connect effortlessly — creating opportunities, growth, and satisfaction for all."
            delay={0.6}
            theme="purple"
          />
        </div>

      </main>
    </div>
  );
}

function PageCard({ icon: Icon, title, content, delay, theme }: any) {
  const accentColor = theme === 'blue' ? 'from-blue-600/20 to-blue-600/5' : 'from-indigo-600/20 to-indigo-600/5';
  const iconBg = theme === 'blue' ? 'text-blue-400' : 'text-indigo-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group relative h-full"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${accentColor} rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      <div className="relative h-full bg-white/5 backdrop-blur-md border border-white/5 p-10 lg:p-12 rounded-[2.5rem] hover:border-white/10 transition-all duration-300 flex flex-col items-start">
        <div className={`w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center ${iconBg} group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 mb-8 border border-white/5`}>
          <Icon className="w-7 h-7" />
        </div>
        <div className="flex items-center gap-3 mb-4">
          <h3 className="font-black text-2xl text-white tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-all">
            {title}
          </h3>
          <ArrowUpRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
        </div>
        <p className="text-slate-400 font-medium text-lg leading-relaxed group-hover:text-slate-300 transition-colors">
          {content}
        </p>
      </div>
    </motion.div>
  );
}
