"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  ArrowRight,
  LifeBuoy,
  Calendar,
  Clock,
  CheckCircle2,
  Package,
  AlertCircle,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ username?: string; name?: string; email?: string; role?: string } | null>(null);
  const [stats, setStats] = useState({ active: 0, completed: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const API_BASE_URL = "http://localhost:4000/api";

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

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('access_token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch Stats
      fetch(`${API_BASE_URL}/users/stats`, { headers })
        .then(r => r.json())
        .then(data => setStats(data))
        .catch(() => { });

      // Fetch Recent Orders
      fetch(`${API_BASE_URL}/users/history`, { headers })
        .then(r => r.json())
        .then(data => {
          // Take top 3 recent orders
          const orders = Array.isArray(data) ? data.slice(0, 3) : (data.data || []).slice(0, 3);
          setRecentOrders(orders);
        })
        .catch(err => console.error("Failed to fetch orders", err))
        .finally(() => setLoadingOrders(false));
    }
  }, [user]);

  if (!user) return null;

  const displayName = user.username || user.name || "Member";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12">

        {/* 🔹 Enhanced Hero Hub */}
        <section className="relative rounded-[3rem] bg-slate-950 p-10 lg:p-20 overflow-hidden mb-16 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] border border-white/5">
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="max-w-xl text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                >
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  Live Session Active
                </motion.div>

                <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.1] mb-8 tracking-tight">
                  Welcome Back,<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">{displayName}</span>
                </h1>

                <p className="text-slate-400 text-lg mb-12 font-medium leading-relaxed max-w-lg">
                  Your service command center is ready. Track your active deployments or schedule new maintenance protocols.
                </p>

                <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                  <Link href="/explore" className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 group">
                    Book Service <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/orders" className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all backdrop-blur-md flex items-center justify-center">
                    Order History
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                <HeroMetric label="Network Status" value="Optimized" color="text-emerald-400" />
                <HeroMetric label="Active Jobs" value={stats.active || 0} color="text-blue-400" />
                <HeroMetric label="Completed" value={stats.completed || 0} color="text-slate-400" />
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -mr-64 -mt-64" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px] -ml-40 -mb-40" />
        </section>

        {/* 🔹 Strategic Access Points & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Order Activity Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                <Package className="w-6 h-6 text-slate-400" />
                Recent Activity
              </h2>
              <Link href="/orders" className="text-[10px] font-black text-blue-600 hover:text-indigo-600 uppercase tracking-[0.2em] transition-colors">Full History &rarr;</Link>
            </div>

            {loadingOrders ? (
              <div className="space-y-4">
                {[1, 2].map(i => <div key={i} className="h-32 bg-white/50 border border-slate-100 animate-pulse rounded-[2.5rem]" />)}
              </div>
            ) : recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500 group">
                    <div className="flex items-start gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${order.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                        order.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                          'bg-blue-50 text-blue-600'
                        }`}>
                        {order.status === 'completed' ? <CheckCircle2 className="w-7 h-7" /> : <Clock className="w-7 h-7" />}
                      </div>
                      <div>
                        <h3 className="font-black text-xl text-slate-900 group-hover:text-blue-600 transition-colors">{order.service_name}</h3>
                        <p className="text-sm text-slate-500 font-bold mt-1">Provider: {order.vendor_name || 'Verified Hub'}</p>
                        <div className="flex items-center gap-4 mt-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-blue-400" /> {new Date(order.created_at).toLocaleDateString()}</span>
                          <div className="w-1 h-1 rounded-full bg-slate-200" />
                          <span className="bg-slate-50 px-2 py-0.5 rounded">₹{order.total_amount}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-4 md:mt-0">
                      <span className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${order.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        order.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          'bg-blue-50 text-blue-600 border-blue-100'
                        }`}>
                        {order.status.replace(/_/g, " ")}
                      </span>
                      <Link href="/orders" className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all">
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-20 rounded-[3rem] border border-dashed border-slate-200 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-10 h-10 text-slate-300" />
                </div>
                <p className="text-slate-500 font-bold text-lg">No active deployments detected.</p>
                <Link href="/explore" className="text-blue-600 font-black text-xs uppercase tracking-widest mt-4 inline-block hover:underline">Initiate New Request &rarr;</Link>
              </div>
            )}
          </div>

          {/* Quick Actions / Support */}
          <div className="space-y-8">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                <LifeBuoy className="w-7 h-7" />
              </div>
              <h3 className="font-black text-2xl mb-4 text-slate-900">Direct Support</h3>
              <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">Encountering deployment issues or hardware logic failures? Our senior engineers are on standby 24/7.</p>
              <Link href="/support" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center">
                Open Secure Ticket
              </Link>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-10 rounded-[3rem] text-white shadow-2xl shadow-indigo-500/30 relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="font-black text-2xl mb-3">Service+ Access</h3>
                <p className="text-indigo-100 text-sm font-medium mb-10 leading-relaxed">Unlock priority routing, extended warranties, and dedicated account managers.</p>
                <Link href="/profile" className="bg-white text-indigo-600 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 hover:scale-105 transition-all inline-block hover:shadow-xl">
                  Upgrade Identity
                </Link>
              </div>
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/20 transition-all duration-700" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-3xl -ml-16 -mb-16" />
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
