"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import {
  BarChart3,
  Users,
  Settings,
  Package,
  LogOut,
  LayoutDashboard,
  Store,
  Wrench,
  Trash2,
  Plus,
  Edit3,
  Search,
  ChevronRight,
  ShieldCheck,
  Briefcase,
  DollarSign,
  Clock,
  CheckCircle2,
  UserPlus,
  X,
  MapPin,
  Mail,
  Layers,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProfileDropdown from "@/components/ProfileDropdown/ProfileDropdown";

const API_BASE_URL = "http://localhost:4000/api";

const fetcher = (url: string) => {
  const token = localStorage.getItem("access_token");
  return fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json());
};

type Metrics = { services: number; technicians: number; pendingBookings: number; totalEarnings: number; pendingTechnicians: number };
type Column = { key: string; label: string };

export default function VendorDashboard() {
  const router = useRouter();
  const params = useSearchParams();
  const [user, setUser] = useState<{ username: string; email?: string; role: string; id: number } | null>(null);
  const [active, setActive] = useState<"Dashboard" | "Services" | "Technicians" | "Orders" | "Earnings" | "Settings">("Dashboard");

  useEffect(() => {
    const view = params.get("v");
    if (view) setActive(view as any);
  }, [params]);

  useEffect(() => {
    const data = localStorage.getItem("userData");
    if (!data) {
      router.push("/vendor/login");
      return;
    }
    const parsed = JSON.parse(data);
    if (parsed.role.toLowerCase() !== "vendor") {
      router.push("/vendor/login");
      return;
    }
    setUser(parsed);
  }, [router]);

  const { data: metricsRes } = useSWR(user ? `${API_BASE_URL}/vendors/metrics` : null, fetcher);
  const metrics: Metrics | null = metricsRes?.success ? metricsRes.data : null;

  if (!user) return <div className="min-h-screen bg-[#0f1014] flex items-center justify-center"><div className="loader"></div></div>;

  return (
    <div className="min-h-screen flex bg-[#0f1014] text-gray-100 font-sans selection:bg-[#6366f1]/30">
      {/* Sidebar */}
      <aside className="w-72 bg-[#16181d] border-r border-white/5 p-8 hidden lg:flex flex-col shadow-2xl">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Store className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            VendorHub
          </h1>
        </div>

        <nav className="space-y-2 flex-1">
          {[
            { key: "Dashboard", icon: LayoutDashboard },
            { key: "Services", icon: Briefcase },
            { key: "Technicians", icon: Wrench },
            { key: "Orders", icon: Package },
            { key: "Earnings", icon: DollarSign },
            { key: "Settings", icon: Settings },
          ].map(({ key, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActive(key as any)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group ${active === key
                ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]"
                : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-300 ${active === key ? "scale-110" : "group-hover:scale-110"}`} />
              {key}
              {active === key && <motion.div layoutId="activeInd" className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5">
          <button
            onClick={() => {
              localStorage.removeItem("userData");
              localStorage.removeItem("access_token");
              document.cookie = "userData=; Max-Age=0; path=/";
              router.push("/");
            }}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-500 hover:text-red-400 transition-colors group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto custom-scrollbar bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.05),transparent_40%)]">
        <header className="sticky top-0 z-30 flex justify-between items-center p-8 backdrop-blur-md bg-[#0f1014]/80">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{active}</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your service business</p>
          </div>
          <div className="flex items-center gap-6">
            <ProfileDropdown
              user={user ? { username: user.username, email: user.email || '', role: user.role } : null}
              onSettingsClick={() => setActive("Settings")}
            />
          </div>
        </header>

        <div className="px-8 pb-12">
          {active === "Dashboard" && (
            <div className="space-y-10">
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <StatCard icon={Briefcase} label="Services" value={metrics?.services ?? 0} color="indigo" />
                <StatCard icon={Wrench} label="Live Techs" value={metrics?.technicians ?? 0} color="emerald" />
                <StatCard icon={Clock} label="Pending Orders" value={metrics?.pendingBookings ?? 0} color="amber" />
                <StatCard icon={UserPlus} label="Pending Techs" value={metrics?.pendingTechnicians ?? 0} color="indigo" />
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[#16181d] border border-white/5 rounded-3xl p-8">
                  <h3 className="text-lg font-bold mb-6">Recent Performance</h3>
                  <div className="h-[250px] flex items-end justify-between gap-2">
                    {[60, 40, 80, 50, 90, 70, 100, 85, 65, 45, 95, 75].map((h, i) => (
                      <div key={i} className="flex-1 bg-indigo-500/20 rounded-t-lg relative group">
                        <motion.div
                          className="absolute bottom-0 w-full bg-indigo-500 rounded-t-lg"
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ delay: i * 0.05 }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-indigo-600 rounded-3xl p-8 text-white flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Grow Your Business</h3>
                    <p className="text-indigo-100 text-sm opacity-80">Add more services and assign expert technicians to increase your ranking and earnings.</p>
                  </div>
                  <button onClick={() => setActive("Services")} className="w-full bg-white text-indigo-600 py-3 rounded-2xl font-bold text-sm">Add New Service</button>
                </div>
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {active === "Services" && (
              <motion.div key="services" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <ManagementTable
                  entity="services"
                  columns={[
                    { key: "name", label: "Service Name" },
                    { key: "price", label: "Price" },
                    { key: "status", label: "Status" }
                  ]}
                />
              </motion.div>
            )}
            {active === "Technicians" && (
              <motion.div key="technicians" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                <ManagementTable
                  entity="technicians"
                  columns={[
                    { key: "name", label: "Name" },
                    { key: "email", label: "Email" },
                    { key: "skills", label: "Skills" },
                    { key: "status", label: "Status" }
                  ]}
                />

                {/* Pending Technicians Section */}
                <PendingTechniciansView />
              </motion.div>
            )}
            {active === "Orders" && (
              <motion.div key="orders" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <OrdersTable />
              </motion.div>
            )}
            {active === "Earnings" && (
              <motion.div key="earnings" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <EarningsView />
              </motion.div>
            )}
            {active === "Settings" && (
              <motion.div key="settings" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <SettingsView user={user} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function PendingTechniciansView() {
  const { data, mutate } = useSWR(`${API_BASE_URL}/vendors/pending-technicians`, fetcher);
  const { mutate: mutateMetrics } = useSWR(`${API_BASE_URL}/vendors/metrics`, fetcher);
  const { mutate: mutateTechs } = useSWR(`${API_BASE_URL}/vendors/technicians`, fetcher);
  const rows: any[] = data?.success ? data.data : [];

  const handleStatusUpdate = async (id: number, status: 'active' | 'rejected') => {
    const token = localStorage.getItem("access_token");
    const res = await fetch(`${API_BASE_URL}/vendors/technicians/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ id, status }),
    }).then(r => r.json());

    if (res.success) {
      mutate();
      mutateTechs();
      mutateMetrics();
    }
  };

  if (rows.length === 0) return null;

  return (
    <div className="bg-[#16181d] border border-white/5 rounded-3xl overflow-hidden shadow-2xl mt-10">
      <div className="p-8 border-b border-white/5 bg-amber-500/5 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-xl text-amber-500 flex items-center gap-2">
            <UserPlus className="w-5 h-5" /> Pending Approvals
          </h3>
          <p className="text-gray-500 text-xs mt-1">New technicians waiting to join your team</p>
        </div>
        <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[10px] font-black text-amber-500 tracking-widest uppercase">
          {rows.length} APPLICATIONS
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/[0.02]">
              <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest">Technician</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest">Expertise / Skills</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest">Applied Date</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-500 tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((tech) => (
              <tr key={tech.id} className="hover:bg-white/[0.01] transition-colors group">
                <td className="px-8 py-6">
                  <div className="font-bold text-gray-200 text-sm">{tech.name}</div>
                  <div className="text-[10px] text-gray-500 font-medium">{tech.email}</div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-wrap gap-1">
                    {(tech.skills || "").split(',').slice(0, 3).map((s: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded text-[9px] font-bold uppercase truncate max-w-[100px]">
                        {s.trim()}
                      </span>
                    ))}
                    {(tech.skills || "").split(',').length > 3 && <span className="text-[9px] text-gray-500 font-bold">+{tech.skills.split(',').length - 3}</span>}
                  </div>
                </td>
                <td className="px-8 py-6 text-xs text-gray-400 font-bold">
                  {new Date(tech.created_at).toLocaleDateString()}
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleStatusUpdate(tech.id, 'active')}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(tech.id, 'rejected')}
                      className="bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white p-2 rounded-xl transition-all border border-rose-500/20"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any, label: string, value: any, color: "indigo" | "emerald" | "amber" }) {
  const colors = {
    indigo: "from-indigo-500/20 to-[#16181d] border-indigo-500/20 text-indigo-500",
    emerald: "from-emerald-500/20 to-[#16181d] border-emerald-500/20 text-emerald-500",
    amber: "from-amber-500/20 to-[#16181d] border-amber-500/20 text-amber-500",
  };
  return (
    <div className="p-6 bg-gradient-to-br border rounded-3xl flex items-center justify-between group hover:translate-y-[-4px] transition-all relative overflow-hidden shadow-xl border-white/5">
      <div className="relative z-10">
        <p className="text-gray-500 text-xs font-semibold mb-1 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-black text-white">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 relative z-10 ${colors[color].split(' ').pop()}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}

function ManagementTable({ entity, columns }: { entity: "services" | "technicians", columns: Column[] }) {
  const apiPath = `vendors/${entity}`;
  const { data, mutate } = useSWR(`${API_BASE_URL}/${apiPath}`, fetcher);

  // Backend returns data directly or inside .data depending on version
  const items: any[] = data?.success ? data.data : (Array.isArray(data) ? data : []);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    const token = localStorage.getItem("access_token");
    await fetch(`${API_BASE_URL}/${apiPath}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    mutate();
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    const res = await fetch(`${API_BASE_URL}/${apiPath}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(formData),
    }).then(r => r.json());

    if (res.success) {
      setIsAddModalOpen(false);
      setFormData({});
      mutate();
    } else {
      alert("Error: " + (res.message || "Failed to create"));
    }
  };

  return (
    <div className="bg-[#16181d] border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative">
      <div className="p-8 border-b border-white/5 flex justify-between items-center">
        <h3 className="font-bold text-xl capitalize">{entity} Management</h3>
        <button onClick={() => setIsAddModalOpen(true)} className="bg-white text-black px-5 py-2.5 rounded-2xl text-sm font-bold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add New
        </button>
      </div>

      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-lg bg-[#16181d] border border-white/10 rounded-[2.5rem] p-10">
              <h2 className="text-2xl font-bold mb-6 text-white">Add New {entity.slice(0, -1)}</h2>
              <form onSubmit={handleAdd} className="space-y-4 text-gray-100">
                {entity === "services" ? (
                  <>
                    <input required placeholder="Service Name" className="w-full bg-[#0f1014] border border-white/5 rounded-2xl px-5 py-4 outline-none focus:border-indigo-500" onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    <textarea placeholder="Description" className="w-full bg-[#0f1014] border border-white/5 rounded-2xl px-5 py-4 outline-none focus:border-indigo-500" onChange={e => setFormData({ ...formData, description: e.target.value })} />
                    <input required type="number" placeholder="Price" className="w-full bg-[#0f1014] border border-white/5 rounded-2xl px-5 py-4 outline-none focus:border-indigo-500" onChange={e => setFormData({ ...formData, price: e.target.value })} />
                  </>
                ) : (
                  <>
                    <input required placeholder="Full Name" className="w-full bg-[#0f1014] border border-white/5 rounded-2xl px-5 py-4 outline-none focus:border-indigo-500" onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    <input required type="email" placeholder="Email" className="w-full bg-[#0f1014] border border-white/5 rounded-2xl px-5 py-4 outline-none focus:border-indigo-500" onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    <input required type="password" placeholder="Password" className="w-full bg-[#0f1014] border border-white/5 rounded-2xl px-5 py-4 outline-none focus:border-indigo-500" onChange={e => setFormData({ ...formData, password: e.target.value })} />
                    <input placeholder="Skills (comma separated)" className="w-full bg-[#0f1014] border border-white/5 rounded-2xl px-5 py-4 outline-none focus:border-indigo-500" onChange={e => setFormData({ ...formData, skills: e.target.value })} />
                  </>
                )}
                <div className="pt-6 flex gap-3">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 bg-white/5 py-4 rounded-xl text-sm font-bold">Cancel</button>
                  <button type="submit" className="flex-1 bg-indigo-600 py-4 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20">Create</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/[0.02]">
              {columns.map(c => <th key={c.key} className="px-8 py-5 text-sm font-bold text-gray-500 uppercase">{c.label}</th>)}
              <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-white/[0.01] transition-colors group">
                {columns.map(c => (
                  <td key={c.key} className="px-8 py-6 text-sm">
                    {c.key === 'status' ? (
                      <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${item[c.key] === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-500/10 text-gray-500'}`}>
                        {item[c.key]}
                      </span>
                    ) : item[c.key]}
                  </td>
                ))}
                <td className="px-8 py-6 text-right">
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrdersTable() {
  const { data, mutate } = useSWR(`${API_BASE_URL}/vendors/bookings`, fetcher);
  const orders: any[] = data?.success ? data.data : [];
  const { data: techData } = useSWR(`${API_BASE_URL}/vendors/technicians`, fetcher);
  const techs: any[] = techData?.success ? techData.data : (Array.isArray(techData) ? techData : []);

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const parseDescription = (desc: string) => {
    if (!desc) return { address: 'Not provided', details: 'No additional details' };
    const parts = desc.split('. Details:');
    const address = parts[0]?.replace('Address: ', '') || 'Not specified';
    const details = parts[1] || desc;
    return { address, details };
  };

  const handleAssign = async (orderId: number, techId: number) => {
    const token = localStorage.getItem("access_token");
    const res = await fetch(`${API_BASE_URL}/vendors/bookings/${orderId}/assign`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ technician_id: techId }), // Backend expects technician_id from AssignTechnicianDto
    }).then(r => r.json());

    if (res.success) {
      setIsModalOpen(false);
      setSelectedOrder(null);
      mutate();
    }
  };

  return (
    <div className="bg-[#16181d] border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative">
      <div className="p-8 border-b border-white/5 flex justify-between items-center">
        <h3 className="font-bold text-xl">Service Orders</h3>
        <span className="text-xs font-bold text-gray-500 bg-white/5 px-4 py-1.5 rounded-full uppercase tracking-widest">{orders.length} Total</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/[0.02]">
              <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase tracking-wider">Service</th>
              <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase tracking-wider text-center">Amount</th>
              <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase tracking-wider text-center">Status</th>
              <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase tracking-wider text-right">Technician</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-white/[0.01] transition-colors group">
                <td className="px-8 py-6">
                  <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{o.service_name || `Service #${o.service_id}`}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-gray-600" />
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{new Date(o.created_at).toLocaleDateString()}</p>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <p className="text-sm font-bold text-white">{o.user_name}</p>
                  <p className="text-[10px] text-gray-500 font-mono mt-0.5">{o.user_phone}</p>
                </td>
                <td className="px-8 py-6 text-sm font-mono text-emerald-400 text-center font-bold">₹{o.total_amount}</td>
                <td className="px-8 py-6 text-center">
                  <span className={`px-3 py-1.5 rounded-full text-[9px] uppercase font-black tracking-[0.1em] border shadow-sm ${o.status === 'pending' ? 'bg-amber-400/10 text-amber-500 border-amber-500/20' :
                    o.status === 'completed' ? 'bg-emerald-400/10 text-emerald-500 border-emerald-500/20' :
                      o.status === 'assigned' ? 'bg-blue-400/10 text-blue-500 border-blue-500/20' :
                        o.status === 'accepted' ? 'bg-emerald-400/10 text-emerald-500 border-emerald-400/20' :
                          'bg-indigo-400/10 text-indigo-500 border-indigo-500/20'
                    }`}>
                    {o.status === 'assigned' ? 'Awaiting Approval' : o.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  {o.technician_id ? (
                    <div className="flex items-center justify-end gap-3">
                      <div className="text-right">
                        <p className="text-sm font-bold text-indigo-400">{o.technician_name}</p>
                        <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest">Active Member</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                        <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setSelectedOrder(o); setIsModalOpen(true); }}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                    >
                      Assign Tech
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-4xl bg-[#16181d] border border-white/10 rounded-[3rem] shadow-[0_32px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[900px]"
            >
              {/* Left Column: Order/Customer Info */}
              <div className="w-full md:w-[400px] p-10 bg-white/[0.02] border-r border-white/5 overflow-y-auto">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full font-black uppercase tracking-widest border border-indigo-500/30">New Order</span>
                    <h2 className="text-3xl font-black text-white mt-4 leading-tight">{selectedOrder.service_name}</h2>
                    <p className="text-gray-500 text-xs mt-2 font-bold tracking-wider">ORDER IDENTITY: #{selectedOrder.id}</p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="md:hidden p-2 hover:bg-white/5 rounded-full text-gray-500">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-10">
                  <div className="relative group">
                    <div className="absolute -left-4 top-0 w-1 h-full bg-indigo-500 rounded-full opacity-50" />
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Customer Info</h4>
                    <div className="space-y-3">
                      <p className="text-lg font-bold text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10"><Users className="w-4 h-4 text-indigo-400" /></div>
                        {selectedOrder.user_name}
                      </p>
                      <p className="text-sm font-medium text-gray-400 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10"><Mail className="w-4 h-4 text-indigo-400" /></div>
                        {selectedOrder.user_email}
                      </p>
                      <p className="text-sm font-medium text-gray-400 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10"><Phone className="w-4 h-4 text-indigo-400" /></div>
                        {selectedOrder.user_phone}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Service Location</h4>
                    <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                      <div className="flex items-start gap-4">
                        <MapPin className="w-5 h-5 text-indigo-500 shrink-0 mt-1" />
                        <p className="text-sm font-bold text-gray-100 leading-relaxed italic">
                          {parseDescription(selectedOrder.user_description).address}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Project Requirements</h4>
                    <p className="text-xs text-gray-400 leading-safe font-medium bg-indigo-500/5 p-6 rounded-3xl border border-indigo-500/10 italic">
                      "{parseDescription(selectedOrder.user_description).details}"
                    </p>
                  </div>

                  <div className="pt-6 border-t border-white/5">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Total Budget</p>
                    <p className="text-4xl font-black text-emerald-400 italic">₹{selectedOrder.total_amount}</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Specialists */}
              <div className="flex-1 p-10 flex flex-col">
                <div className="flex justify-between items-center mb-10">
                  <h4 className="text-sm font-bold text-white flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                      <Layers className="w-5 h-5 text-white" />
                    </div>
                    Expert Network Search
                  </h4>
                  <button onClick={() => setIsModalOpen(false)} className="hidden md:flex p-3 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 transition-all">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-white/5 rounded-3xl p-8 mb-8 border border-white/10">
                  <p className="text-xs text-indigo-400 font-bold mb-1">AI-Powered Skill Match</p>
                  <p className="text-sm text-gray-400 font-medium">Matching specialists with <span className="text-white font-bold">"{selectedOrder.service_name}"</span> expertise.</p>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-4">
                  {[...techs]
                    .filter(t => t.status === 'active')
                    .sort((a, b) => {
                      const matchA = a.skills?.toLowerCase().includes(selectedOrder.service_name.replace(' & ', ' ').toLowerCase().split(' ')[0]);
                      const matchB = b.skills?.toLowerCase().includes(selectedOrder.service_name.replace(' & ', ' ').toLowerCase().split(' ')[0]);
                      return (matchA === matchB) ? 0 : matchA ? -1 : 1;
                    })
                    .map((tech) => {
                      const isMatch = tech.skills?.toLowerCase().includes(selectedOrder.service_name.replace(' & ', ' ').toLowerCase().split(' ')[0]);
                      return (
                        <div key={tech.id} className={`group flex items-center justify-between p-6 rounded-[2.5rem] border transition-all duration-500 hover:scale-[1.02] ${isMatch ? 'bg-indigo-500/[0.08] border-indigo-500/30 shadow-2xl shadow-indigo-500/10' : 'bg-[#0f1014] border-white/5 hover:border-white/20'}`}>
                          <div className="flex items-center gap-6">
                            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-inner relative ${isMatch ? 'bg-indigo-500/20 border-2 border-indigo-500/40' : 'bg-white/5 border border-white/10'}`}>
                              <Users className={`w-8 h-8 ${isMatch ? 'text-indigo-400' : 'text-gray-600'}`} />
                              {isMatch && <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-[#16181d]"><Zap className="w-2.5 h-2.5 text-white fill-current" /></div>}
                            </div>
                            <div>
                              <div className="flex items-center gap-3">
                                <p className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{tech.name}</p>
                                {isMatch && <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-400/20">Elite Match</span>}
                              </div>
                              <p className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-widest line-clamp-1 max-w-[250px]">
                                <span className="text-indigo-400">Expertise:</span> {tech.skills || 'Support Specialist'}
                              </p>
                              <div className="flex items-center gap-4 mt-3">
                                <div className="flex items-center gap-2 text-[10px] text-gray-600 font-bold uppercase tracking-widest"><Phone className="w-3 h-3" /> {tech.phone || 'Private'}</div>
                                <div className="flex items-center gap-2 text-[10px] text-gray-600 font-bold uppercase tracking-widest"><Mail className="w-3 h-3" /> {tech.email.split('@')[0]}</div>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleAssign(selectedOrder.id, tech.id)}
                            className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 ${isMatch ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/20' : 'bg-white text-black hover:bg-indigo-500 hover:text-white shadow-black/20'}`}
                          >
                            Dispatch Expert
                          </button>
                        </div>
                      );
                    })}

                  {techs.filter(t => t.status === 'active').length === 0 && (
                    <div className="py-20 text-center bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                      <p className="text-gray-500 text-sm font-black uppercase tracking-[0.2em]">No Online Specialists Available</p>
                      <p className="text-gray-600 text-xs mt-2">Check technician portal for pending approvals</p>
                    </div>
                  )}
                </div>

                <div className="pt-8 flex items-center justify-between border-t border-white/5 mt-auto">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                      {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-white/5 border-2 border-[#16181d]" />)}
                    </div>
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">+12 standby personnel</p>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-indigo-500 bg-indigo-500/10 px-5 py-2.5 rounded-full uppercase tracking-widest border border-indigo-500/20">
                    <ShieldCheck className="w-4 h-4" /> Secure Protocol
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SettingsView({ user }: { user: any }) {
  const [profileForm, setProfileForm] = useState({ name: user.username, email: user.email || '', phone: user.phone || '', description: user.description || '' });
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Re-fetch profile for details
    const token = localStorage.getItem("access_token");
    fetch(`${API_BASE_URL}/vendors/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(res => {
      if (res.success) setProfileForm({ name: res.data.name, email: res.data.email, phone: res.data.phone || '', description: res.data.description || '' });
    });
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("access_token");
    const res = await fetch(`${API_BASE_URL}/vendors/update-profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(profileForm),
    }).then(r => r.json());
    setLoading(false);
    if (res.success) alert("Profile updated!");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("access_token");
    const res = await fetch(`${API_BASE_URL}/vendors/change-password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(passForm),
    }).then(r => r.json());
    setLoading(false);
    if (res.success) {
      alert("Password updated!");
      setPassForm({ currentPassword: '', newPassword: '' });
    } else alert(res.message || "Failed");
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <div className="bg-[#16181d] border border-white/5 rounded-[2.5rem] p-10 shadow-xl">
        <h3 className="text-xl font-bold mb-8 text-white">Vendor Profile</h3>
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Business Name</label>
            <input value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} className="w-full bg-[#0f1014] border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Business Description</label>
            <textarea value={profileForm.description} onChange={e => setProfileForm({ ...profileForm, description: e.target.value })} className="w-full bg-[#0f1014] border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 outline-none" rows={3} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Contact Phone</label>
            <input value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} className="w-full bg-[#0f1014] border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 outline-none" />
          </div>
          <button disabled={loading} className="w-full bg-indigo-600 py-4 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20">{loading ? "Updating..." : "Save Changes"}</button>
        </form>
      </div>

      <div className="bg-[#16181d] border border-white/5 rounded-[2.5rem] p-10 shadow-xl">
        <h3 className="text-xl font-bold mb-8 text-white">Security</h3>
        <form onSubmit={handleChangePassword} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Current Password</label>
            <input type="password" value={passForm.currentPassword} onChange={e => setPassForm({ ...passForm, currentPassword: e.target.value })} className="w-full bg-[#0f1014] border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">New Password</label>
            <input type="password" value={passForm.newPassword} onChange={e => setPassForm({ ...passForm, newPassword: e.target.value })} className="w-full bg-[#0f1014] border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 outline-none" />
          </div>
          <button disabled={loading} className="w-full bg-white text-black py-4 rounded-xl text-sm font-bold">{loading ? "Updating..." : "Change Password"}</button>
        </form>
      </div>
    </div>
  );
}

function EarningsView() {
  const { data } = useSWR(`${API_BASE_URL}/vendors/bookings`, fetcher);
  const completed: any[] = data?.success ? data.data.filter((o: any) => o.status === 'completed') : [];
  const total = completed.reduce((acc, curr) => acc + Number(curr.total_amount), 0);

  return (
    <div className="space-y-8">
      <div className="bg-indigo-600 rounded-3xl p-10 text-white flex justify-between items-center shadow-2xl">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Total Revenue</p>
          <h2 className="text-5xl font-black">₹ {total}</h2>
        </div>
        <div className="p-5 bg-white/10 rounded-2xl backdrop-blur-md">
          <DollarSign className="w-10 h-10" />
        </div>
      </div>

      <div className="bg-[#16181d] border border-white/5 rounded-3xl p-8 shadow-xl">
        <h3 className="text-xl font-bold mb-6">Completed Job History</h3>
        <div className="space-y-4 text-gray-100">
          {completed.length === 0 && <p className="text-gray-500">No completed jobs yet.</p>}
          {completed.map(o => (
            <div key={o.id} className="flex items-center justify-between p-6 bg-[#0f1014] rounded-2xl border border-white/5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl"><CheckCircle2 className="w-5 h-5" /></div>
                <div>
                  <p className="font-bold">{o.service_name || "Job Title"}</p>
                  <p className="text-xs text-gray-500">{new Date(o.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <p className="font-mono text-emerald-400 font-bold">₹ {o.total_amount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
