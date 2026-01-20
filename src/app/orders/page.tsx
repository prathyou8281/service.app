"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";
import {
  Package,
  Clock,
  CheckCircle2,
  User,
  MapPin,
  Wrench,
  ChevronRight,
  AlertCircle,
  Phone,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import ProfileDropdown from "@/components/ProfileDropdown/ProfileDropdown";

const API_BASE_URL = "http://localhost:4000/api";

const fetcher = (url: string) => {
  const token = localStorage.getItem("access_token");
  return fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());
};

export default function OrdersPage() {
  const [user, setUser] = useState<any>(null);
  const { data: res, mutate } = useSWR(`${API_BASE_URL}/users/bookings`, fetcher);
  const orders = Array.isArray(res) ? res : (res?.success ? res.data : []);

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "text-amber-500 bg-amber-50 border-amber-100";
      case "assigned": return "text-indigo-500 bg-indigo-50 border-indigo-100";
      case "ongoing": return "text-sky-500 bg-sky-50 border-sky-100";
      case "completed": return "text-emerald-500 bg-emerald-50 border-emerald-100";
      case "cancelled": return "text-rose-500 bg-rose-50 border-rose-100";
      default: return "text-slate-500 bg-slate-50 border-slate-100";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-sky-500/30">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-200/50 px-8 py-4 flex justify-between items-center">
        <Link href="/welcome" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-sky-50 transition-colors">
            <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-sky-500 transition-colors" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">Back to Dashboard</span>
        </Link>
        <ProfileDropdown user={user ? { username: user.name || user.username, email: user.email, role: user.role } : null} />
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-32 pb-20">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">My Service History</h1>
          <p className="text-slate-500 font-medium tracking-tight">Track your ongoing repairs and view past successful jobs.</p>
        </div>

        <div className="space-y-8">
          {orders.length === 0 ? (
            <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-200 shadow-xl shadow-slate-200/40">
              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">No Service Bookings Yet</h3>
              <p className="text-slate-400 font-medium mb-8">Ready to fix something? Our professionals are standing by.</p>
              <Link href="/services" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-sky-600 transition-all shadow-xl shadow-slate-900/10">
                Explore Services <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            orders.map((order: any, idx: number) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden group hover:border-sky-500/20 transition-colors duration-500"
              >
                <div className="p-10">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-sky-50 rounded-[1.5rem] flex items-center justify-center shrink-0 border border-sky-100 group-hover:bg-sky-500 group-hover:text-white transition-all duration-500">
                        <Wrench className="w-8 h-8" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-slate-900 leading-tight">{order.service_name}</h2>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mt-1">{order.vendor_name}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${getStatusColor(order.status)}`}>
                        {order.status}
                      </div>
                      <div className="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-50 text-slate-400 border border-slate-100 shadow-sm">
                        Booking ID: #{order.id}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Job Description</h4>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed italic cursor-help hover:text-slate-900 transition-colors">
                        "{order.user_description}"
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tracking Details</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                          <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center">
                            <Clock className="w-4 h-4 text-slate-400" />
                          </div>
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                          <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center">
                            <User className="w-4 h-4 text-slate-400" />
                          </div>
                          {order.technician_name ? (
                            <span className="text-indigo-600">Assigned: {order.technician_name}</span>
                          ) : (
                            <span className="text-slate-400">Finding best expert...</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50/50 rounded-[2rem] p-6 border border-slate-100 flex flex-col justify-between">
                      <div>
                        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Estimated Cost</h4>
                        <p className="text-2xl font-black text-slate-900">₹{order.total_amount}</p>
                      </div>
                      {order.status === 'completed' ? (
                        <button className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-100 transition-all group">
                          <CheckCircle2 className="w-4 h-4" /> Download Invoice
                        </button>
                      ) : (
                        <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-sky-500">
                          <AlertCircle className="w-4 h-4 animate-pulse" />
                          Order in Progress
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
