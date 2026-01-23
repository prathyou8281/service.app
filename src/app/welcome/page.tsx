"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Wrench,
  ShoppingBag,
  ClipboardList,
  LifeBuoy,
  Search,
  Bell,
  Star,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProfileDropdown from "@/components/ProfileDropdown/ProfileDropdown";

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ username?: string; name?: string; email?: string; role?: string } | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (!userData) {
      router.push("/login");
      return;
    }
    try {
      const parsed = JSON.parse(userData);
      setUser(parsed);
    } catch (e) {
      router.push("/login");
    }
  }, [router]);

  // Fetch Stats
  const API_BASE_URL = "http://localhost:4000/api";
  const [stats, setStats] = useState({ active: 0, completed: 0 });

  useEffect(() => {
    if (user) {
      fetch(`${API_BASE_URL}/users/stats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      })
        .then(r => r.json())
        .then(data => setStats(data))
        .catch(() => { });
    }
  }, [user]);

  if (!user) return null;

  const displayName = user.username || user.name || "Member";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12">

        {/* 🔹 Enhanced Hero Hub */}
        <section className="relative rounded-[2.5rem] bg-slate-950 p-10 lg:p-20 overflow-hidden mb-16 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border border-white/5">
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="max-w-xl text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                >
                  <ShieldCheck className="w-4 h-4" /> Global Service Protocol Active
                </motion.div>

                <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.1] mb-8 tracking-tight">
                  Welcome Back,<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">{displayName}</span>
                </h1>

                <p className="text-slate-400 text-lg mb-12 font-medium leading-relaxed max-w-lg">
                  Access specialized IT maintenance and hardware solutions. Secure, verified, and professional.
                </p>

                <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                  <Link href="/explore" className="btn-primary !px-10 !py-5 flex items-center justify-center gap-3 group !rounded-2xl shadow-xl shadow-blue-500/20">
                    Explore Categories <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/orders" className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all backdrop-blur-md flex items-center justify-center">
                    Dashboard Stream
                  </Link>
                </div>
              </div>

              <div className="flex gap-4 lg:flex-col">
                <HeroMetric label="Node Status" value="Online" color="text-emerald-400" />
                <HeroMetric label="Active Jobs" value={stats.active} color="text-blue-400" />
                <HeroMetric label="Completed" value={stats.completed} color="text-slate-400" />
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -mr-64 -mt-64" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px] -ml-40 -mb-40" />
        </section>

        {/* 🔹 Strategic Access Points */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-black tracking-tight">Priority Services</h2>
              <Link href="/explore" className="text-[10px] font-black text-blue-600 hover:text-indigo-600 uppercase tracking-[0.2em] transition-colors">Global Catalog &rarr;</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <SimpleServiceCard title="Terminal Maintenance" price="1,499" />
              <SimpleServiceCard title="AC Dust Sync" price="899" />
            </div>
          </div>

          <div className="space-y-8">
            <div className="card p-10 bg-white border-slate-200/60 shadow-xl shadow-slate-200/20">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-8">
                <LifeBuoy className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-black text-xl mb-3 text-slate-900">Direct Support</h3>
              <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">Need custom hardware logic or urgent deployment? Our tech leads are on standby.</p>
              <button className="w-full bg-slate-950 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all active:scale-95">Open Ticket</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function HeroMetric({ label, value, color }: any) {
  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md min-w-[140px] text-center lg:text-left">
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
    </div>
  );
}

function QuickStat({ label, value }: any) {
  return (
    <div className="flex flex-col items-end">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-xl font-black text-slate-900 tracking-tight">{value}</p>
    </div>
  );
}

function SimpleServiceCard({ title, price }: any) {
  return (
    <div className="card-hover card p-8 group">
      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
        <CheckCircle2 className="w-6 h-6" />
      </div>
      <h4 className="font-black text-xl mb-4">{title}</h4>
      <div className="flex justify-between items-center pt-6 border-t border-slate-50 mt-4">
        <span className="text-xl font-black text-blue-600">₹{price}</span>
        <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-600 transition-colors">Book Now</button>
      </div>
    </div>
  );
}
