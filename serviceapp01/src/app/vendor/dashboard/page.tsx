"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import {
  LayoutDashboard,
  Store,
  Package,
  IndianRupee,
  LogOut,
  Bell,
  ClipboardList,
  TrendingUp,
  ChevronRight,
  Plus,
  Zap,
  ShieldCheck,
  Users,
  X,
  Check,
  Ban,
  Loader2,
  Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = "http://localhost:4000/api";

export default function VendorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [active, setActive] = useState("Overview");
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [orderFilter, setOrderFilter] = useState('all');


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

  // Data Fetching
  const { data: statsData } = useSWR(user ? `${API_BASE_URL}/vendors/stats` : null, fetcherWithAuth);
  const stats = statsData || { revenue: 0, activeJobs: 0, totalServices: 0, rating: 0 };

  const { data: ordersData } = useSWR(user ? `${API_BASE_URL}/vendors/orders` : null, fetcherWithAuth);
  const orders = Array.isArray(ordersData) ? ordersData : [];

  const { data: servicesData, mutate: mutateServices } = useSWR(user ? `${API_BASE_URL}/vendors/services` : null, fetcherWithAuth);
  const myServices = Array.isArray(servicesData) ? servicesData : [];

  const { data: techniciansData, mutate: mutateTechnicians } = useSWR(user ? `${API_BASE_URL}/vendors/technicians` : null, fetcherWithAuth);
  const technicians = Array.isArray(techniciansData) ? techniciansData : [];

  const { data: profile } = useSWR(user ? `${API_BASE_URL}/vendors/profile` : null, fetcherWithAuth);
  const currentStatus = profile?.status?.toLowerCase() || user?.status?.toLowerCase() || 'pending';

  const filteredOrders = orders.filter((o: any) => {
    if (orderFilter === 'all') return true;
    return o.status === orderFilter;
  });

  // Actions
  const handleApproveTechnician = async (id: number) => {
    if (!confirm("Approve this technician?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/vendors/technicians/${id}/approve`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      });
      if (res.ok) {
        mutateTechnicians();
        alert("Technician approved!");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to approve technician.");
    }
  };

  const handleRejectTechnician = async (id: number) => {
    if (!confirm("Reject this technician?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/vendors/technicians/${id}/reject`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      });
      if (res.ok) {
        mutateTechnicians();
        alert("Technician rejected.");
      }
    } catch (e) {
      console.error(e);
    }
  };

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
          <button
            onClick={() => {
              localStorage.removeItem("userData");
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
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col z-20">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-black uppercase tracking-tighter text-slate-900 leading-none">
                Service<span className="text-indigo-600">Hub</span>
              </h1>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Merchant Portal</span>
            </div>
          </div>

          <nav className="space-y-1.5">
            {[
              { key: "Overview", icon: LayoutDashboard },
              { key: "Orders", label: "Operations Log", icon: ClipboardList },
              { key: "Staff", label: "Fleet Management", icon: Users },
              { key: "Services", label: "Service Catalog", icon: Package },
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
                {key === 'Staff' && technicians.filter((t: any) => t.status === 'pending').length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-black">{technicians.filter((t: any) => t.status === 'pending').length}</span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-slate-100">
          <button
            onClick={() => {
              localStorage.removeItem("userData");
              router.push("/vendor/login");
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all duration-300"
          >
            <LogOut className="w-4 h-4" /> Shutdown Session
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="px-10 py-6 flex items-center justify-between bg-white/70 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.2em] bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 italic">Merchant: {user?.name || user?.username || "Authorized Enterprise"}</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                {active === 'Services' ? 'Service Catalog' : active} <span className="text-indigo-600">Operations Node</span>
              </h2>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">PLATFORM ID: {user?.id?.toString().padStart(5, '0')}</span>
                <div className="w-1 h-1 bg-slate-200 rounded-full" />
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-1.5 leading-none">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" /> Verified Merchant Partner
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button className="relative p-3 rounded-2xl bg-slate-50 text-slate-400 border border-slate-200 hover:text-indigo-600 hover:bg-slate-100 transition-all group">
                <Bell className="w-5.5 h-5.5" />
                {orders.filter((o: any) => o.status === 'pending').length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                    {orders.filter((o: any) => o.status === 'pending').length}
                  </span>
                )}
              </button>
            </div>

            <div className="h-10 w-px bg-slate-100 mx-2" />

            <div className="flex items-center gap-3 pl-2 pr-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 transition-all hover:border-indigo-200 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center font-black text-white shadow-lg shadow-indigo-500/20">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:flex flex-col items-start leading-none">
                <span className="text-xs font-black text-slate-900 uppercase tracking-tighter mb-1">{user?.username}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Admin Access</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10 pt-8 bg-[#fbfcfd]">
          <AnimatePresence mode="wait">
            {active === "Overview" && (
              <motion.div key="ov" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard label="Live Revenue" value={`₹${stats.revenue.toLocaleString()}`} trend="Performance" icon={IndianRupee} color="indigo" />
                  <StatCard label="Active Jobs" value={String(stats.activeJobs).padStart(2, '0')} trend="In Action" icon={Zap} color="blue" />
                  <StatCard label="Store Rating" value={`${stats.rating}/5`} trend="Avg Review" icon={TrendingUp} color="emerald" />
                  <StatCard label="Total Offers" value={myServices.length} trend="Catalog Size" icon={Package} color="amber" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 card p-8">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="font-black text-sm uppercase tracking-widest">Active Dispatch</h3>
                      <button onClick={() => setActive("Orders")} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">View Fleet &rarr;</button>
                    </div>
                    <div className="space-y-4">
                      {orders.filter((o: any) => o.status !== 'completed').slice(0, 3).map((order: any) => (
                        <DetailedOrderRow
                          key={order.id}
                          order={order}
                          technicians={technicians.filter((t: any) => t.status === 'active')}
                          onRefresh={() => {
                            mutate(`${API_BASE_URL}/vendors/orders`);
                            mutate(`${API_BASE_URL}/vendors/stats`);
                          }}
                        />
                      ))}
                      {orders.filter((o: any) => o.status !== 'completed').length === 0 && (
                        <div className="py-12 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                          <Zap className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                          <p className="text-slate-400 font-bold italic text-sm">All units are currently idle.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {active === "Orders" && (
              <motion.div key="ord" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Global Order Stream</h3>
                  <div className="flex gap-2">
                    {['all', 'pending', 'assigned', 'processing', 'completed', 'rejected'].map(status => (
                      <button
                        key={status}
                        onClick={() => setOrderFilter(status)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-tighter transition-all ${orderFilter === status
                          ? 'bg-slate-950 text-white border-slate-950 shadow-lg'
                          : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                          }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  {filteredOrders.map((order: any) => (
                    <DetailedOrderRow
                      key={order.id}
                      order={order}
                      technicians={technicians.filter((t: any) => t.status === 'active')}
                      onRefresh={() => mutate(`${API_BASE_URL}/vendors/orders`)}
                    />
                  ))}
                  {filteredOrders.length === 0 && (
                    <div className="py-32 text-center card border-dashed border-slate-200">
                      <ClipboardList className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No deployments matching filter.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {active === "Staff" && (
              <motion.div key="tech" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-6">Staff Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {technicians.map((tech: any) => (
                    <div key={tech.id} className="card p-6 border border-slate-100 hover:shadow-xl transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                          {tech.name[0]}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${tech.status === 'active' ? 'bg-emerald-50 text-emerald-600' :
                          tech.status === 'rejected' ? 'bg-red-50 text-red-600' :
                            'bg-amber-50 text-amber-600'
                          }`}>
                          {tech.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900">{tech.name}</h4>
                      <p className="text-xs text-slate-500 mb-4">{tech.email}</p>
                      <p className="text-xs font-medium bg-slate-50 p-3 rounded-xl mb-6">{tech.skills || "No particular skills listed."}</p>

                      {tech.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveTechnician(tech.id)}
                            className="flex-1 bg-emerald-500 text-white py-2 rounded-xl text-xs font-bold hover:bg-emerald-600 transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectTechnician(tech.id)}
                            className="flex-1 bg-red-50 text-red-500 py-2 rounded-xl text-xs font-bold hover:bg-red-100 transition"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  {technicians.length === 0 && (
                    <p className="col-span-full text-center py-20 text-slate-400 font-bold italic">No technicians found.</p>
                  )}
                </div>
              </motion.div>
            )}

            {active === "Services" && (
              <motion.div key="serv" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Catalog Offerings</h3>
                  <button
                    onClick={() => setIsAddServiceOpen(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/20"
                  >
                    <Plus className="w-4 h-4" /> Add Service
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myServices.map((service: any) => (
                    <div key={service.id} className="card p-6 border border-slate-100 hover:shadow-xl transition-all group">
                      <div className="h-40 bg-slate-100 rounded-2xl mb-6 overflow-hidden relative">
                        {service.image ? (
                          <img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <ImageIcon className="w-12 h-12" />
                          </div>
                        )}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-black text-slate-900">
                          ₹{service.price}
                        </div>
                      </div>
                      <h4 className="font-bold text-slate-900 mb-1">{service.name}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-4">{service.short_description || service.description}</p>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${service.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">{service.status}</span>
                      </div>
                    </div>
                  ))}
                  {myServices.length === 0 && (
                    <div className="col-span-full py-20 text-center card border-dashed border-slate-200">
                      <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                      <p className="text-slate-400 font-bold">No services in your catalog yet.</p>
                      <button onClick={() => setIsAddServiceOpen(true)} className="text-indigo-600 text-xs font-black uppercase tracking-widest mt-4 hover:underline">Add your first service</button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* ADD SERVICE MODAL */}
      <AnimatePresence>
        {isAddServiceOpen && (
          <AddServiceModal onClose={() => setIsAddServiceOpen(false)} onSuccess={() => mutateServices()} />
        )}
      </AnimatePresence>
    </div>
  );
}

function AddServiceModal({ onClose, onSuccess }: any) {
  const [formData, setFormData] = useState({
    name: "",
    service_type_id: "",
    price: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [types, setTypes] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/services/types")
      .then(res => res.json())
      .then(data => setTypes(data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/vendors/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        onSuccess();
        onClose();
        alert("Service added successfully!");
      } else {
        alert("Failed to add service");
      }
    } catch (error) {
      console.error(error);
      alert("Error adding service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
      >
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="font-black text-slate-900 text-lg">Add New Service</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition"><X className="w-5 h-5 text-slate-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Service Type</label>
              <select
                required
                className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                value={formData.service_type_id}
                onChange={(e) => setFormData({ ...formData, service_type_id: e.target.value })}
              >
                <option value="">Select a category...</option>
                {types.map((t: any) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Service Name</label>
              <input
                required
                type="text"
                placeholder="e.g. Premium Laptop Cleaning"
                className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Price (₹)</label>
              <input
                required
                type="number"
                placeholder="0.00"
                className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Description</label>
              <textarea
                rows={3}
                placeholder="Detailed explanation of what's included..."
                className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          <div className="pt-4 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition shadow-xl shadow-indigo-200 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Publish Service"}
            </button>
          </div>
        </form>
      </motion.div>
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

function DetailedOrderRow({ order, technicians, onRefresh }: any) {
  const [expanded, setExpanded] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAssign = async (techId: number) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/vendors/orders/${order.id}/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ technicianId: techId })
      });
      if (res.ok) {
        setIsAssigning(false);
        if (onRefresh) onRefresh();
        alert("Technician assigned successfully!");
      } else {
        const data = await res.json();
        alert(data.message || "Failed to assign technician");
      }
    } catch (e) {
      alert("Execution error during assignment.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!confirm(`Update order status to ${status}?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${order.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        if (onRefresh) onRefresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white rounded-[2rem] border transition-all duration-300 overflow-hidden ${expanded ? 'border-indigo-500 shadow-2xl p-8 mb-6' : 'border-slate-100 p-6 hover:border-slate-300'}`}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${order.status === 'pending' ? 'bg-amber-50 text-amber-500' :
            order.status === 'completed' ? 'bg-emerald-50 text-emerald-500' :
              'bg-indigo-50 text-indigo-500'
            }`}>
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-black text-slate-900 flex items-center gap-2">
              {order.service_name}
              {order.status === 'pending' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />}
            </p>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Client: {order.user_name}</p>
              <div className="w-1 h-1 rounded-full bg-slate-200" />
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">ID: #{String(order.id).padStart(4, '0')}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Session Logic</p>
            <p className="text-sm font-black text-slate-900">₹{order.total_amount}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className={`text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest ${order.status === 'pending' ? 'bg-amber-50 text-amber-600' :
              order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                'bg-indigo-50 text-indigo-600'
              }`}>
              {order.status}
            </span>
            <button
              onClick={() => setExpanded(!expanded)}
              className={`p-3 rounded-xl transition-all group ${expanded ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-950 hover:text-white'}`}
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
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Zap className="w-3 h-3" /> Request Specification
                  </p>
                  <p className="text-sm font-bold text-slate-600 leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-100 italic">
                    {order.user_description || "No specific deployment notes provided by client."}
                  </p>
                </div>
                {order.technician_name && (
                  <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-black text-emerald-600 uppercase mb-1">Assigned Liaison</p>
                      <p className="font-black text-slate-900 text-sm">{order.technician_name}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-[10px]">
                      {order.technician_name[0]}
                    </div>
                  </div>
                )}
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
                  <div className="flex flex-col gap-3">
                    {order.status === 'pending' && (
                      <div className="flex gap-4">
                        <button
                          onClick={() => setIsAssigning(true)}
                          className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:shadow-xl transition-all active:scale-95"
                        >
                          Assign Protocol
                        </button>
                        <button
                          onClick={() => handleUpdateStatus('rejected')}
                          className="flex-1 bg-red-50 text-red-500 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95"
                        >
                          Reject Load
                        </button>
                      </div>
                    )}
                    {order.status === 'assigned' && (
                      <button
                        disabled
                        className="w-full bg-slate-100 text-slate-400 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest"
                      >
                        Waiting for Technician Acknowledge
                      </button>
                    )}
                    {order.status === 'completed' && (
                      <div className="w-full bg-emerald-50 text-emerald-600 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-center flex items-center justify-center gap-2">
                        <Check className="w-4 h-4" /> Operations Complete
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Technician Assignment Modal Overlay */}
      <AnimatePresence>
        {isAssigning && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl overflow-y-auto max-h-[80vh]"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <div>
                  <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight">Assign Unit</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Order #{order.id}</p>
                </div>
                <button onClick={() => setIsAssigning(false)} className="p-2 hover:bg-slate-100 rounded-full transition"><X className="w-5 h-5 text-slate-500" /></button>
              </div>
              <div className="p-8 space-y-3">
                {technicians.length === 0 ? (
                  <div className="py-10 text-center">
                    <p className="text-sm font-bold text-slate-400">No active technicians available.</p>
                    <p className="text-[10px] uppercase tracking-widest mt-2">{`(Approve technicians in Staff tab)`}</p>
                  </div>
                ) : (
                  technicians.map((tech: any) => (
                    <button
                      key={tech.id}
                      onClick={() => handleAssign(tech.id)}
                      disabled={loading}
                      className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-indigo-500 hover:bg-slate-50 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          {tech.name[0]}
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-black text-slate-900">{tech.name}</p>
                          <p className="text-[10px] font-bold text-slate-400">{tech.phone || 'No phone'}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
