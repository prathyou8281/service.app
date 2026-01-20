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
  Check,
  X,
  Clock,
  Phone,
  Mail,
  AlertCircle
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

type Metrics = { users: number; vendors: number; technicians: number; pendingVendors: number; pendingTechnicians: number };
type Column = { key: string; label: string };

function getStatusColor(status: string) {
  if (status === 'active') return 'text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full text-[10px] uppercase font-black';
  if (status === 'pending') return 'text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full text-[10px] uppercase font-black';
  return 'text-gray-500 bg-gray-500/10 px-3 py-1 rounded-full text-[10px] uppercase font-black';
}

function StatCard({ icon: Icon, label, value, color }: { icon: any, label: string, value: any, color: "indigo" | "emerald" | "amber" | "rose" }) {
  const colors = {
    indigo: "from-indigo-500/20 to-[#16181d] border-indigo-500/20 text-indigo-500",
    emerald: "from-emerald-500/20 to-[#16181d] border-emerald-500/20 text-emerald-500",
    amber: "from-amber-500/20 to-[#16181d] border-amber-500/20 text-amber-500",
    rose: "from-rose-500/20 to-[#16181d] border-rose-500/20 text-rose-500",
  };

  return (
    <div className={`p-8 bg-gradient-to-br border rounded-3xl flex items-center justify-between group hover:translate-y-[-4px] transition-all duration-300 relative overflow-hidden shadow-xl`}>
      <div className="relative z-10">
        <p className="text-gray-500 text-sm font-semibold mb-2 uppercase tracking-widest">{label}</p>
        <p className="text-4xl font-black text-white">{value}</p>
      </div>
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-white/5 relative z-10 ${colors[color].split(' ').pop()}`}>
        <Icon className="w-8 h-8" />
      </div>
      <div className={`absolute -right-4 -bottom-4 w-32 h-32 bg-current opacity-[0.03] rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
    </div>
  );
}

function getTableColumns(active: string): Column[] {
  switch (active) {
    case "Users":
      return [
        { key: "name", label: "User" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "status", label: "Status" },
      ];
    case "Vendors":
      return [
        { key: "name", label: "Vendor" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "status", label: "Status" },
      ];
    case "Technicians":
      return [
        { key: "name", label: "Full Name" },
        { key: "email", label: "Email" },
        { key: "skills", label: "Skills" },
        { key: "status", label: "Status" },
      ];
    default:
      return [];
  }
}

function ApprovalsView() {
  const [activeTab, setActiveTab] = useState<'vendors' | 'technicians'>('vendors');
  const { data: vendorData, mutate: mutateVendors } = useSWR(`${API_BASE_URL}/admin/pending-vendors`, fetcher);
  const { data: techData, mutate: mutateTechs } = useSWR(`${API_BASE_URL}/admin/pending-technicians`, fetcher);
  const { mutate: mutateMetrics } = useSWR(`${API_BASE_URL}/admin/metrics`, fetcher);

  const vendorRows: any[] = vendorData?.success ? vendorData.data : [];
  const techRows: any[] = techData?.success ? techData.data : [];

  const handleStatusUpdate = async (type: 'vendors' | 'technicians', id: number, status: 'active' | 'rejected') => {
    const token = localStorage.getItem("access_token");
    const res = await fetch(`${API_BASE_URL}/admin/${type}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ id, status }),
    }).then(r => r.json());

    if (res.success) {
      if (type === 'vendors') mutateVendors();
      else mutateTechs();
      mutateMetrics();
    }
  };

  const rows = activeTab === 'vendors' ? vendorRows : techRows;

  return (
    <div className="bg-[#16181d] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
      <div className="p-8 border-b border-white/5 bg-[#1c1f26]">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Pending <span className="text-indigo-400">Approvals</span></h2>
            <p className="text-gray-500 text-xs mt-1 font-medium uppercase tracking-widest">Review and verify new registration requests</p>
          </div>
          <div className="flex bg-[#0f1014] p-1.5 rounded-2xl border border-white/5">
            <button
              onClick={() => setActiveTab('vendors')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'vendors' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-gray-500 hover:text-gray-300'}`}
            >
              VENDORS ({vendorRows.length})
            </button>
            <button
              onClick={() => setActiveTab('technicians')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'technicians' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-gray-500 hover:text-gray-300'}`}
            >
              TECHNICIANS ({techRows.length})
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {rows.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1c1f26]/50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">{activeTab === 'vendors' ? 'Business Details' : 'Professional Profile'}</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Identity & Contact</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Submission Date</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map((row, idx) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${activeTab === 'vendors' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-amber-500/10 text-amber-400'} rounded-2xl flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform`}>
                        {activeTab === 'vendors' ? <Store className="w-6 h-6" /> : <Wrench className="w-6 h-6" />}
                      </div>
                      <div>
                        <div className="font-bold text-gray-200 text-sm">{row.name}</div>
                        <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-bold max-w-[250px] truncate">
                          {activeTab === 'vendors' ? (row.description || "Vendor Partner") : (row.skills || "Specialist")}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-gray-400 font-semibold group-hover:text-gray-200 transition-colors">
                        <Mail className="w-3.5 h-3.5 text-indigo-500" />
                        {row.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 font-semibold group-hover:text-gray-200 transition-colors">
                        <Phone className="w-3.5 h-3.5 text-indigo-500" />
                        {row.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-xs text-gray-300 font-black">
                      {new Date(row.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                    <div className="text-[9px] text-gray-600 mt-1 font-black uppercase tracking-tighter">
                      Received at {new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => handleStatusUpdate(activeTab, row.id, 'active')}
                        className="bg-emerald-500 hover:bg-emerald-400 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-2"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(activeTab, row.id, 'rejected')}
                        className="bg-[#0f1014] text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all flex items-center gap-2"
                      >
                        <X className="w-3.5 h-3.5" />
                        Reject
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="w-24 h-24 bg-indigo-500/5 rounded-full flex items-center justify-center mb-8 border border-white/5"
            >
              <ShieldCheck className="w-12 h-12 text-indigo-500 opacity-20" />
            </motion.div>
            <h3 className="text-2xl font-black text-gray-200 tracking-tight">All Caught Up!</h3>
            <p className="text-gray-500 text-sm mt-3 font-medium max-w-xs">No pending {activeTab} applications to review at this moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const params = useSearchParams();
  const [user, setUser] = useState<{ username: string; email?: string; role: string } | null>(null);
  const [active, setActive] = useState<"Dashboard" | "Users" | "Vendors" | "Technicians" | "Approvals" | "Settings">("Dashboard");

  useEffect(() => {
    const view = params.get("v");
    if (view) setActive(view as any);
  }, [params]);

  useEffect(() => {
    const data = localStorage.getItem("userData");
    if (!data) {
      router.push("/admin/login");
      return;
    }
    const parsed = JSON.parse(data);
    if (parsed.role.toLowerCase() !== "admin") {
      router.push("/admin/login");
      return;
    }
    setUser(parsed);
  }, [router]);

  const { data: metricsRes } = useSWR(`${API_BASE_URL}/admin/metrics`, fetcher);
  const metrics: Metrics | null = metricsRes?.success ? metricsRes.data : null;

  if (!user) return <div className="min-h-screen bg-[#0f1014] flex items-center justify-center"><div className="loader"></div></div>;

  return (
    <div className="min-h-screen flex bg-[#0f1014] text-gray-100 font-sans selection:bg-[#6366f1]/30">
      {/* Sidebar */}
      <aside className="w-72 bg-[#16181d] border-r border-white/5 p-8 hidden lg:flex flex-col shadow-2xl">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            ServiceHub
          </h1>
        </div>

        <nav className="space-y-2 flex-1">
          {[
            { key: "Dashboard", icon: LayoutDashboard },
            { key: "Approvals", icon: ShieldCheck, badge: (metrics?.pendingVendors ?? 0) + (metrics?.pendingTechnicians ?? 0) },
            { key: "Users", icon: Users },
            { key: "Vendors", icon: Store },
            { key: "Technicians", icon: Wrench },
            { key: "Settings", icon: Settings },
          ].map(({ key, icon: Icon, badge }: any) => (
            <button
              key={key}
              onClick={() => setActive(key as any)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group ${active === key
                ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]"
                : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-300 ${active === key ? "scale-110" : "group-hover:scale-110"}`} />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-[#16181d] font-bold">
                    {badge}
                  </span>
                )}
              </div>
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
            <p className="text-gray-500 text-sm mt-1">Manage your platform ecosystem</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative hidden xl:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                placeholder="Global search..."
                className="bg-[#16181d] border border-white/5 rounded-full py-2.5 pl-11 pr-6 text-sm w-64 focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
              />
            </div>
            <ProfileDropdown
              user={user ? { username: user.username, email: user.email || '', role: user.role } : null}
              onSettingsClick={() => setActive("Settings")}
            />
          </div>
        </header>

        <div className="px-8 pb-12">
          {active === "Dashboard" && (
            <div className="space-y-10">
              {/* Stats Grid */}
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <StatCard icon={Users} label="Platform Users" value={metrics?.users ?? 0} color="indigo" />
                <StatCard icon={ShieldCheck} label="Pending Vendors" value={metrics?.pendingVendors ?? 0} color="rose" />
                <StatCard icon={Wrench} label="Pending Techs" value={metrics?.pendingTechnicians ?? 0} color="amber" />
                <StatCard icon={Store} label="Total Vendors" value={metrics?.vendors ?? 0} color="emerald" />
                <StatCard icon={Wrench} label="Technician Pool" value={metrics?.technicians ?? 0} color="amber" />
              </motion.div>

              {/* Activity Section Placeholder */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[#16181d] border border-white/5 rounded-3xl p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-lg font-bold">Growth Overview</h3>
                    <select className="bg-[#0f1014] border border-white/10 rounded-lg px-3 py-1.5 text-xs font-semibold outline-none">
                      <option>Last 30 Days</option>
                      <option>Last 6 Months</option>
                    </select>
                  </div>
                  <div className="h-[300px] flex items-end justify-between gap-2">
                    {[40, 70, 45, 90, 65, 80, 50, 85, 95, 60, 75, 100].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 1, delay: i * 0.05 }}
                        className="flex-1 bg-indigo-500/20 rounded-t-lg group relative hover:bg-indigo-500/40 transition-colors"
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold bg-[#16181d] px-2 py-1 rounded shadow-xl border border-white/5 whitespace-nowrap">
                          {h * 12} Users
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl shadow-indigo-600/30">
                  <div className="relative z-10">
                    <ShieldCheck className="w-12 h-12 mb-6 text-indigo-200" />
                    <h3 className="text-2xl font-bold mb-2 text-white">System Secure</h3>
                    <p className="text-indigo-100 text-sm leading-relaxed">
                      All protocols are running optimally. No critical issues detected in the last 24 hours.
                    </p>
                  </div>
                  <button className="relative z-10 mt-8 w-full bg-white/20 hover:bg-white/30 backdrop-blur-md py-3 rounded-2xl text-sm font-bold transition-all">
                    View Security Logs
                  </button>
                  <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                </div>
              </div>
            </div>
          )}

          {/* Management Tables */}
          <AnimatePresence mode="wait">
            {active !== "Dashboard" && active !== "Settings" && (
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ManagementTable
                  entity={active.toLowerCase() as any}
                  columns={getTableColumns(active)}
                />
              </motion.div>
            )}
            {active === "Settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <SettingsView user={user} />
              </motion.div>
            )}
            {active === "Approvals" && (
              <motion.div
                key="approvals"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <ApprovalsView />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function SettingsView({ user }: { user: any }) {
  const [profileForm, setProfileForm] = useState({ name: user.username, email: user.email || '', phone: user.phone || '' });
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("access_token");
    const res = await fetch(`${API_BASE_URL}/admin/update-profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(profileForm),
    }).then(r => r.json());
    setLoading(false);
    if (res.success) {
      alert("Profile updated! Data will sync on next login.");
    } else {
      alert("Failed to update profile.");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("access_token");
    const res = await fetch(`${API_BASE_URL}/admin/change-password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(passForm),
    }).then(r => r.json());
    setLoading(false);
    if (res.success) {
      alert("Password changed successfully!");
      setPassForm({ currentPassword: '', newPassword: '' });
    } else {
      alert(res.message || "Failed to change password.");
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Profile Settings */}
      <div className="bg-[#16181d] border border-white/5 rounded-[2.5rem] p-10 shadow-xl">
        <h3 className="text-xl font-bold mb-2">Profile Information</h3>
        <p className="text-gray-500 text-sm mb-8">Update your personal identifying details.</p>
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Admin Name</label>
            <input
              value={profileForm.name}
              onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
              className="w-full bg-[#0f1014] border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 transition-all outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email Address</label>
            <input
              value={profileForm.email}
              onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
              className="w-full bg-[#0f1014] border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 transition-all outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Phone Number</label>
            <input
              value={profileForm.phone}
              onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
              className="w-full bg-[#0f1014] border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 transition-all outline-none"
            />
          </div>
          <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 py-4 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20">
            {loading ? "Processing..." : "Save Profile Changes"}
          </button>
        </form>
      </div>

      {/* Security Settings */}
      <div className="space-y-8">
        <div className="bg-[#16181d] border border-white/5 rounded-[2.5rem] p-10 shadow-xl">
          <h3 className="text-xl font-bold mb-2">Security & Password</h3>
          <p className="text-gray-500 text-sm mb-8">Ensure your account is using a strong password.</p>
          <form onSubmit={handleChangePassword} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Current Password</label>
              <input
                type="password"
                value={passForm.currentPassword}
                onChange={e => setPassForm({ ...passForm, currentPassword: e.target.value })}
                className="w-full bg-[#0f1014] border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 transition-all outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">New Secure Password</label>
              <input
                type="password"
                value={passForm.newPassword}
                onChange={e => setPassForm({ ...passForm, newPassword: e.target.value })}
                className="w-full bg-[#0f1014] border border-white/5 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 transition-all outline-none"
              />
            </div>
            <button disabled={loading} className="w-full bg-white text-black hover:bg-gray-200 py-4 rounded-2xl text-sm font-bold transition-all">
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>

        {/* System Info */}
        <div className="bg-gradient-to-br from-[#16181d] to-[#0f1014] border border-white/5 rounded-[2.5rem] p-10 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-lg mb-1">System Version</h4>
            <p className="text-gray-500 text-sm italic">v2.4.0-master (Stable)</p>
          </div>
          <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl text-xs font-black uppercase tracking-tighter">
            System Optimal
          </div>
        </div>
      </div>
    </div>
  );
}


function ManagementTable({ entity, columns }: { entity: "users" | "vendors" | "technicians", columns: Column[] }) {
  const { data, mutate } = useSWR(`${API_BASE_URL}/admin/${entity}`, fetcher);
  const rows: any[] = data?.success ? data.data : [];

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState<any>({});

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this entry permanently?")) return;
    const token = localStorage.getItem("access_token");
    await fetch(`${API_BASE_URL}/admin/${entity}?id=${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    mutate();
  };

  const handleUpdate = async (id: number) => {
    const token = localStorage.getItem("access_token");
    await fetch(`${API_BASE_URL}/admin/${entity}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ id, ...editForm }),
    });
    setEditingId(null);
    mutate();
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    const res = await fetch(`${API_BASE_URL}/admin/${entity}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(addForm),
    }).then(r => r.json());

    if (res.success) {
      setIsAddModalOpen(false);
      setAddForm({});
      mutate();
    } else {
      alert("Error: " + (res.message || "Failed to add entity"));
    }
  };

  return (
    <div className="bg-[#16181d] border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative">
      <div className="p-8 border-b border-white/5 flex justify-between items-center">
        <h3 className="font-bold text-xl capitalize">{entity} Management</h3>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-white text-black px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Entity
        </button>
      </div>

      {/* Add Entity Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#16181d] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-2">Create New {entity.slice(0, -1)}</h2>
              <p className="text-gray-500 text-sm mb-8">Fill in the details to add to the system.</p>

              <form onSubmit={handleAdd} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Full Name</label>
                    <input
                      required
                      className="w-full bg-[#0f1014] border border-white/5 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition-all outline-none"
                      placeholder="Enter name"
                      onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email Address</label>
                    <input
                      required
                      type="email"
                      className="w-full bg-[#0f1014] border border-white/5 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition-all outline-none"
                      placeholder="email@example.com"
                      onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Phone Number</label>
                    <input
                      className="w-full bg-[#0f1014] border border-white/5 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition-all outline-none"
                      placeholder="Optional"
                      onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Password</label>
                    <input
                      required
                      type="password"
                      className="w-full bg-[#0f1014] border border-white/5 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition-all outline-none"
                      placeholder="••••••••"
                      onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                    />
                  </div>
                </div>

                {entity === 'technicians' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Skills</label>
                    <input
                      className="w-full bg-[#0f1014] border border-white/5 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition-all outline-none"
                      placeholder="e.g. AC Repair, Electrical"
                      onChange={(e) => setAddForm({ ...addForm, skills: e.target.value })}
                    />
                  </div>
                )}

                {entity === 'technicians' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Vendor ID</label>
                    <input
                      required
                      type="number"
                      className="w-full bg-[#0f1014] border border-white/5 rounded-2xl px-4 py-3 text-sm focus:border-indigo-500 transition-all outline-none"
                      placeholder="Assign to vendor ID"
                      onChange={(e) => setAddForm({ ...addForm, vendor_id: e.target.value })}
                    />
                  </div>
                )}

                <div className="pt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 bg-white/5 hover:bg-white/10 py-4 rounded-2xl text-sm font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 py-4 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all"
                  >
                    Create {entity.slice(0, -1)}
                  </button>
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
              {columns.map(c => <th key={c.key} className="px-8 py-5 text-sm font-bold text-gray-500 uppercase tracking-wider">{c.label}</th>)}
              <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-white/[0.01] transition-colors group">
                {columns.map(c => (
                  <td key={c.key} className="px-8 py-6">
                    {editingId === row.id ? (
                      <input
                        className="bg-[#0f1014] border border-white/10 rounded-lg px-3 py-2 text-sm w-full outline-none focus:border-indigo-500"
                        value={editForm[c.key] ?? row[c.key]}
                        onChange={(e) => setEditForm({ ...editForm, [c.key]: e.target.value })}
                      />
                    ) : (
                      <span className={`text-sm font-semibold ${c.key === 'status' ? getStatusColor(row[c.key]) : 'text-gray-300'}`}>
                        {row[c.key] || '—'}
                      </span>
                    )}
                  </td>
                ))}
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    {editingId === row.id ? (
                      <>
                        <button onClick={() => handleUpdate(row.id)} className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg">< ShieldCheck className="w-5 h-5" /></button>
                        <button onClick={() => setEditingId(null)} className="p-2 text-gray-500 hover:bg-white/10 rounded-lg"><LogOut className="w-5 h-5" /></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { setEditingId(row.id); setEditForm(row); }} className="p-2 text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors"><Edit3 className="w-5 h-5" /></button>
                        <button onClick={() => handleDelete(row.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"><Trash2 className="w-5 h-5" /></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <div className="p-20 text-center text-gray-600 font-medium">No {entity} records found in the database.</div>}
      </div>
    </div>
  );
}


