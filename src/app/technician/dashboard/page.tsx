"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import {
  LayoutDashboard,
  Wrench,
  Activity,
  CheckCircle2,
  LogOut,
  Bell,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  UserCircle,
  Briefcase,
  Zap,
  Star
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = "http://localhost:4000/api";
const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function TechnicianDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [active, setActive] = useState("Overview");

  useEffect(() => {
    const data = localStorage.getItem("userData");
    if (!data) {
      router.push("/technician/login");
      return;
    }
    try {
      const parsed = JSON.parse(data);
      if (parsed.role?.toLowerCase() !== "technician") {
        router.push("/technician/login");
        return;
      }
      setUser(parsed);
    } catch {
      router.push("/technician/login");
    }
  }, [router]);

  // Fetch Stats
  const { data: statsData } = useSWR(user ? `${API_BASE_URL}/technicians/stats` : null, (url) =>
    fetch(url, { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } }).then(r => r.json())
  );
  const stats = statsData || { tasks: 0, completed: 0, rating: 4.9 };

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* 🔹 SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col z-20">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Wrench className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Tech<span className="text-emerald-600">Sync</span></h1>
          </div>

          <nav className="space-y-1.5">
            {[
              { key: "Overview", icon: LayoutDashboard },
              { key: "Active Pipeline", icon: Briefcase },
              { key: "Resolution Log", icon: CheckCircle2 },
              { key: "Global Rankings", icon: Activity },
              { key: "Field Schedule", icon: Calendar },
            ].map(({ key, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 group ${active === key
                  ? "bg-emerald-600 text-white shadow-xl shadow-emerald-500/20"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${active === key ? "text-white" : "group-hover:text-emerald-600"}`} />
                  {key}
                </div>
                {active === key && <ChevronRight className="w-4 h-4" />}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-slate-100 text-slate-300">
          <button
            onClick={() => {
              localStorage.removeItem("userData");
              document.cookie = "userData=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
              router.push("/technician/login");
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all duration-300"
          >
            <LogOut className="w-4 h-4" /> Shutdown Access
          </button>
        </div>
      </aside>

      {/* 🔹 MAIN AREA */}
      <main className="flex-1 flex flex-col max-h-[calc(100vh-80px)] overflow-hidden">
        {/* Local Header - Removed ProfileDropdown */}
        <div className="px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{active} Terminal</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Certified Specialist Node</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-xl bg-slate-100 text-slate-400 hover:text-emerald-600 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 🔹 CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 pt-0">
          <AnimatePresence mode="wait">
            {active === "Overview" && (
              <motion.div key="ov" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard label="Tasks Queue" value={stats.tasks || "0"} trend="Active" icon={Briefcase} color="emerald" />
                  <StatCard label="In Progress" value="02" trend="Live" icon={Clock} color="blue" />
                  <StatCard label="Historical Solves" value={stats.completed || "86"} trend="+12%" icon={CheckCircle2} color="indigo" />
                  <StatCard label="Peer Rating" value={stats.rating ? `${stats.rating}/5` : "4.9/5"} trend="Top 1%" icon={Star} color="amber" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-6 px-2">Assigned Service Operations</h3>
                    <div className="space-y-4">
                      <TaskCard
                        title="Emergency Workstation Restore"
                        customer="Marcus Aurelius"
                        location="Tech Corridor, Block 4"
                        time="14:30 EST"
                        status="Critical"
                      />
                      <TaskCard
                        title="Hardware Sync Optimization"
                        customer="Selena Gomez"
                        location="Global Residency, NY"
                        time="16:00 EST"
                        status="Standard"
                      />
                    </div>
                  </div>

                  <div className="card p-8 text-center bg-slate-950 text-white border-none shadow-2xl self-start">
                    <div className="w-20 h-20 bg-emerald-600 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-xl shadow-emerald-600/20">
                      <Wrench className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="font-black text-xl mb-2">{user.username}</h3>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-10 italic">Tier 1 Field Specialist</p>

                    <div className="grid grid-cols-2 gap-4 mb-10">
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Reputation</p>
                        <p className="font-black text-xl">2,450</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Status</p>
                        <p className="font-black text-xl text-emerald-500">Gold</p>
                      </div>
                    </div>

                    <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-emerald-600/20">
                      Sync Availability
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {active !== "Overview" && (
              <div className="py-24 text-center card border-dashed border-slate-200">
                <Zap className="w-12 h-12 text-slate-200 mx-auto mb-6" />
                <h3 className="text-xl font-black text-slate-900">{active} Module</h3>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Connecting to secure field cloud...</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, trend, icon: Icon, color }: any) {
  const colors: any = {
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    indigo: "bg-indigo-50 text-indigo-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="card p-8 flex items-start justify-between">
      <div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
        <p className="text-3xl font-black text-slate-900">{value}</p>
        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1 mt-2">
          {trend} <Activity className="w-3 h-3" />
        </span>
      </div>
      <div className={`p-4 rounded-2xl ${colors[color]} shadow-sm`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}

function TaskCard({ title, customer, location, time, status }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="card p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all cursor-pointer group"
    >
      <div className="flex gap-6">
        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all">
          <Wrench className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-black text-lg text-slate-900">{title}</h4>
          <div className="flex flex-wrap items-center gap-6 mt-2">
            <span className="flex items-center gap-2 text-xs font-bold text-slate-400"><UserCircle className="w-4 h-4" /> {customer}</span>
            <span className="flex items-center gap-2 text-xs font-bold text-slate-400"><MapPin className="w-4 h-4" /> {location}</span>
            <span className="flex items-center gap-2 text-xs font-bold text-slate-400"><Clock className="w-4 h-4" /> {time}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider ${status === 'Critical' ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-blue-50 text-blue-600'}`}>
          {status}
        </span>
        <button className="btn-primary !py-2.5 !px-6 !text-[10px] !bg-slate-900">Execute</button>
      </div>
    </motion.div>
  );
}
