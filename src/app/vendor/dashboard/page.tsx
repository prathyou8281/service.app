"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import {
  LayoutDashboard,
  Store,
  Package,
  IndianRupee,
  Settings,
  LogOut,
  Bell,
  ShoppingCart,
  TrendingUp,
  Clock,
  ChevronRight,
  MoreVertical,
  Plus,
  Zap,
  ShieldCheck,
  ClipboardList,
  Users,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = "http://localhost:4000/api";
const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function VendorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [active, setActive] = useState("Overview");

  useEffect(() => {
    const data = localStorage.getItem("userData");
    if (!data) {
      router.push("/vendor/login");
      return;
    }
    try {
      const parsed = JSON.parse(data);
      if (parsed.role?.toLowerCase() !== "vendor") {
        router.push("/vendor/login");
        return;
      }
      setUser(parsed);
    } catch {
      router.push("/vendor/login");
    }
  }, [router]);

  const fetcherWithAuth = (url: string) => fetch(url, {
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
  }).then(r => r.json());

  // Fetch Stats
  const { data: statsData } = useSWR(user ? `${API_BASE_URL}/vendors/stats` : null, fetcherWithAuth);
  const stats = statsData || { revenue: 0, activeJobs: 0, totalServices: 0, rating: 0 };

  // Fetch Orders
  const { data: ordersData } = useSWR(user ? `${API_BASE_URL}/vendors/orders` : null, fetcherWithAuth);
  const orders = Array.isArray(ordersData) ? ordersData : [];

  // Fetch Profile to check real-time status
  const { data: profile } = useSWR(user ? `${API_BASE_URL}/vendors/profile` : null, fetcherWithAuth);
  const currentStatus = profile?.status?.toLowerCase() || user.status?.toLowerCase() || 'pending';

  // Fetch Services for this vendor
  const { data: servicesData } = useSWR(user ? `${API_BASE_URL}/vendors/services` : null, fetcherWithAuth);
  const myServices = Array.isArray(servicesData) ? servicesData : [];

  if (!user) return null;

  if (currentStatus === 'pending') {
    return (
      <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card max-w-lg p-12 shadow-2xl bg-white flex flex-col items-center"
        >
          <div className="w-24 h-24 bg-amber-50 rounded-[2rem] flex items-center justify-center mb-10 animate-pulse">
            <ShieldCheck className="w-12 h-12 text-amber-500" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-6">Verification Pending</h1>
          <p className="text-slate-500 text-lg font-medium leading-relaxed mb-10">
            Welcome to the Network, <span className="text-slate-900 font-bold">{user.username}</span>. Your merchant application is currently being reviewed by our administrative board.
          </p>
          <div className="w-full bg-slate-50 p-6 rounded-3xl border border-dashed border-slate-200 mb-10">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Estimated Window</p>
            <p className="text-sm font-bold text-slate-900 mt-2">12 - 24 Hours for Global Activation</p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("userData");
              document.cookie = "userData=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
              router.push("/vendor/login");
            }}
            className="flex items-center gap-3 text-red-500 font-black uppercase tracking-widest text-xs hover:opacity-70"
          >
            <LogOut className="w-4 h-4" /> Shutdown Session
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* 🔹 SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col z-20">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Store className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Vendor<span className="text-indigo-600">Hub</span></h1>
          </div>

          <nav className="space-y-1.5">
            {[
              { key: "Overview", icon: LayoutDashboard },
              { key: "Orders", label: "Job Requests", icon: ClipboardList },
              { key: "Service Catalog", icon: Package },
            ].map(({ key, label, icon: Icon }: any) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 group ${active === key
                  ? "bg-indigo-600 text-white shadow-xl shadow-indigo-500/20"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${active === key ? "text-white" : "group-hover:text-indigo-600"}`} />
                  {label || key}
                </div>
                {key === 'Orders' && orders.filter((o: any) => o.status === 'pending').length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-black">{orders.filter((o: any) => o.status === 'pending').length}</span>
                )}
                {active === key && !(key === 'Orders' && orders.filter((o: any) => o.status === 'pending').length > 0) && <ChevronRight className="w-4 h-4" />}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-slate-100">
          <button
            onClick={() => {
              localStorage.removeItem("userData");
              document.cookie = "userData=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
              router.push("/vendor/login");
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all duration-300"
          >
            <LogOut className="w-4 h-4" /> Shutdown Session
          </button>
        </div>
      </aside>

      {/* 🔹 MAIN AREA */}
      <main className="flex-1 flex flex-col max-h-[calc(100vh-80px)] overflow-hidden">
        {/* Simplified Title Header (No Profile Dropdown) */}
        <div className="px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{active}</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Global Terminal Access</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-xl bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors">
              <Bell className="w-5 h-5" />
              {orders.some((o: any) => o.status === 'pending') && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping" />
              )}
            </button>
          </div>
        </div>

        {/* 🔹 SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 pt-0">
          <AnimatePresence mode="wait">
            {active === "Overview" && (
              <motion.div key="ov" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard label="Live Revenue" value={`₹${stats.revenue.toLocaleString()}`} trend="+12%" icon={IndianRupee} color="indigo" />
                  <StatCard label="Active Jobs" value={String(stats.activeJobs).padStart(2, '0')} trend="Latest" icon={Zap} color="blue" />
                  <StatCard label="Store Rating" value={`${stats.rating}/5`} trend="Top Tier" icon={TrendingUp} color="emerald" />
                  <StatCard label="Total Offers" value={myServices.length} trend="Active" icon={Package} color="amber" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 card p-8">
                    <h3 className="font-black text-sm uppercase tracking-widest mb-8">Active Service Requests</h3>
                    <div className="space-y-4">
                      {orders.slice(0, 3).map((order: any) => (
                        <DetailedOrderRow key={order.id} order={order} />
                      ))}
                      {orders.length === 0 && (
                        <p className="text-center py-10 text-slate-400 font-bold italic">No active requests discovered.</p>
                      )}
                    </div>
                  </div>

                  <div className="card p-8 bg-indigo-600 text-white border-none shadow-2xl shadow-indigo-600/20">
                    <h3 className="font-black text-lg mb-2">Merchant Advisory</h3>
                    <p className="text-indigo-100 text-sm font-medium mb-10 leading-relaxed">Expand your store capability by adding more specialized service types from the global catalog.</p>
                    <button className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">Launch Catalog</button>
                  </div>
                </div>
              </motion.div>
            )}

            {active === "Orders" && (
              <motion.div key="ord" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Job Deployment Queue</h3>
                </div>
                <div className="space-y-4">
                  {orders.map((order: any) => (
                    <DetailedOrderRow key={order.id} order={order} />
                  ))}
                  {orders.length === 0 && (
                    <div className="py-32 text-center card border-dashed border-slate-200">
                      <ClipboardList className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No deployments in the queue.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Floating Add - Optional */}
      <button className="fixed bottom-10 right-10 w-16 h-16 bg-indigo-600 text-white rounded-3xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group z-50">
        <Plus className="w-7 h-7" />
      </button>
    </div>
  );
}

function StatCard({ label, value, trend, icon: Icon, color }: any) {
  const colors: any = {
    indigo: "bg-indigo-50 text-indigo-600",
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="card p-8 flex items-start justify-between">
      <div className="space-y-1">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{label}</p>
        <p className="text-3xl font-black text-slate-900">{value}</p>
        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1 mt-2">
          {trend} <TrendingUp className="w-3 h-3" />
        </span>
      </div>
      <div className={`p-4 rounded-2xl ${colors[color]} shadow-sm`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}

function DetailedOrderRow({ order }: any) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`bg-white rounded-[2rem] border transition-all duration-300 overflow-hidden ${expanded ? 'border-indigo-500 shadow-2xl p-8 mb-6' : 'border-slate-100 p-6 hover:border-slate-300'}`}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${order.status === 'pending' ? 'bg-amber-50 text-amber-500' : 'bg-indigo-50 text-indigo-500'}`}>
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-black text-slate-900 flex items-center gap-2">
              {order.service_name}
              {order.status === 'pending' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />}
            </p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Client: {order.user_name}</p>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Session Logic</p>
            <p className="text-sm font-black text-slate-900">₹{order.total_amount}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className={`text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest ${order.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'}`}>
              {order.status}
            </span>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-950 hover:text-white transition-all group"
            >
              {expanded ? <X className="w-4 h-4" /> : <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-8 pt-8 border-t border-slate-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Request Specification</p>
                  <p className="text-sm font-bold text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 italic">
                    {order.user_description || "No specific deployment notes provided by client."}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Total Fee</p>
                    <p className="font-black text-slate-900 text-lg">₹{order.total_amount}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Payment</p>
                    <p className="font-black text-slate-900 text-lg uppercase tracking-tight">C.O.V</p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Deployment Actions</p>
                  <div className="flex gap-4">
                    <button className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:shadow-xl transition-all">Assign Protocol</button>
                    <button className="flex-1 bg-red-50 text-red-500 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Reject Load</button>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-amber-500" />
                  <p className="text-[10px] font-bold text-amber-700 uppercase tracking-[0.05em]">SLA window: 24h deployment cycle</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
