"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import {
  BarChart3,
  Users,
  Settings,
  LogOut,
  LayoutDashboard,
  Store,
  Wrench,
  Trash2,
  Plus,
  Edit3,
  Search,
  Check,
  X,
  Briefcase,
  ShieldCheck,
  Loader2,
  Eye,
  AlertCircle,
  Bell,
  CheckCircle,
  ClipboardCheck,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = "http://localhost:4000/api";
const fetcher = async (url: string) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem("access_token") : null;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Fetch failed');
  return data;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"Overview" | "Users" | "Vendors" | "Technicians" | "Services" | "Approvals" | "System">("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Authenticate Admin
  useEffect(() => {
    const data = localStorage.getItem("userData");
    if (!data) {
      router.push("/admin/login");
      return;
    }
    try {
      const parsed = JSON.parse(data);
      if (parsed.role?.toLowerCase() !== "admin") {
        router.push("/admin/login");
        return;
      }
      setUser(parsed);
    } catch (e) {
      router.push("/admin/login");
    }
  }, [router]);

  // Global Metrics - Added error handling
  const { data: metricsData, mutate: mutateMetrics, error: metricsError } = useSWR(`${API_BASE_URL}/admins/metrics`, fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true
  });

  const metrics = metricsData?.success ? metricsData.data : { users: 0, vendors: 0, technicians: 0, services: 0 };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row pt-0">

      {/* 🔹 SIDEBAR NAVIGATION - Responsive positioning below global header */}
      <aside className={`bg-white border-r border-slate-200 transition-all duration-300 ${sidebarOpen ? "w-72" : "w-20"} flex flex-col z-20`}>
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 mb-10 overflow-hidden">
            <div className="min-w-[40px] h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <ShieldCheck className="text-white w-5 h-5 shadow-sm" />
            </div>
            {sidebarOpen && (
              <div className="flex flex-col">
                <h1 className="text-xl font-black uppercase tracking-tighter text-slate-900 leading-none">
                  Service<span className="text-blue-600">Hub</span>
                </h1>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Admin Node</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between px-1">
            {sidebarOpen && <h1 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Control Panel</h1>}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 hover:bg-slate-100 rounded-lg ml-auto">
              <LayoutDashboard className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          <NavBtn icon={BarChart3} label="Overview" active={activeTab === "Overview"} open={sidebarOpen} onClick={() => setActiveTab("Overview")} />
          <NavBtn icon={Users} label="Users" active={activeTab === "Users"} open={sidebarOpen} onClick={() => setActiveTab("Users")} />
          <NavBtn icon={Store} label="Vendors" active={activeTab === "Vendors"} open={sidebarOpen} onClick={() => setActiveTab("Vendors")} />
          <NavBtn icon={Wrench} label="Technicians" active={activeTab === "Technicians"} open={sidebarOpen} onClick={() => setActiveTab("Technicians")} />
          <NavBtn
            icon={ClipboardCheck}
            label="Approvals"
            active={activeTab === "Approvals"}
            open={sidebarOpen}
            onClick={() => setActiveTab("Approvals")}
            badge={metrics.pending_vendors > 0 ? metrics.pending_vendors : null}
          />
          <NavBtn icon={Briefcase} label="Services" active={activeTab === "Services"} open={sidebarOpen} onClick={() => setActiveTab("Services")} />
          <NavBtn icon={Settings} label="System" active={activeTab === "System"} open={sidebarOpen} onClick={() => setActiveTab("System")} />
        </nav>

        <div className="p-8 border-t border-slate-100">
          <button
            onClick={() => {
              localStorage.removeItem("userData");
              document.cookie = "userData=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
              window.location.href = "/admin/login";
            }}
            className="flex items-center gap-3 text-red-500 font-black uppercase tracking-widest text-[10px] hover:opacity-70"
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && "Logout Admin"}
          </button>
        </div>
      </aside>

      {/* 🔹 MAIN CONTENT AREA */}
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto max-h-[calc(100vh-80px)]">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col">
            <h2 className="text-3xl font-black tracking-tight text-slate-900">{activeTab} Hub</h2>
            <p className="text-slate-500 font-semibold text-sm mt-1">Platform synchronization and terminal control.</p>
          </div>
          <div className="flex items-center gap-6">
            <NotificationCenter />
            <div className="h-10 w-px bg-slate-200" />
            <div className="flex items-center gap-4 bg-white p-2 pr-5 rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg shadow-blue-500/20 shrink-0">
                {(user.name || user.username || 'A')[0].toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-black text-slate-900 leading-none">{user.name || user.username || 'Administrator'}</p>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                  System Controller
                </p>
              </div>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === "Overview" && (
            <motion.div key="ov" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatItem label="Global Users" value={metrics.users} icon={Users} color="bg-blue-600" />
                <StatItem label="Business Partners" value={metrics.vendors} icon={Store} color="bg-indigo-600" />
                <StatItem label="Field Techs" value={metrics.technicians} icon={Wrench} color="bg-emerald-600" />
                <StatItem label="Service Types" value={metrics.service_types || 0} icon={Briefcase} color="bg-amber-600" />
              </div>

              <div className="card p-10 bg-white">
                <h3 className="font-bold text-xl mb-6">Network Health</h3>
                <div className="space-y-4">
                  <HealthRow label="Backend API Connection" status={metricsData ? "Online" : "Connecting..."} />
                  <HealthRow label="Database Connectivity" status={metricsData?.success ? "Stable" : "Retrying..."} />
                  <HealthRow label="Admin Privileges" status="Verified" />
                </div>
                {metricsError && (
                  <p className="mt-6 p-4 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100 flex items-center gap-2">
                    <X className="w-4 h-4" /> Error connecting to API: {metricsError.message}. Check if backend is running.
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "Users" && <EntityModule key="u" type="user" columns={[{ key: "name", label: "User" }, { key: "email", label: "Email" }, { key: "phone", label: "Phone" }, { key: "status", label: "Status" }]} />}
          {activeTab === "Vendors" && <EntityModule key="v" type="vendor" columns={[{ key: "name", label: "Merchant" }, { key: "email", label: "Email" }, { key: "status", label: "Status" }]} />}
          {activeTab === "Technicians" && <EntityModule key="t" type="technician" columns={[{ key: "name", label: "Pro Name" }, { key: "skills", label: "Skills" }, { key: "phone", label: "Contact" }, { key: "status", label: "Status" }]} />}
          {activeTab === "Approvals" && <ApprovalsModule key="appr" mutateMetrics={mutateMetrics} />}
          {activeTab === "Services" && <EntityModule key="s" type="services" columns={[{ key: "name", label: "Service Name" }, { key: "vendor_name", label: "Vendor" }, { key: "status", label: "State" }]} />}

          {activeTab === "System" && (
            <motion.div key="sys" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-10">
              <h3 className="font-bold text-xl mb-4 text-red-600">Administrative Actions</h3>
              <p className="text-slate-500 text-sm font-medium mb-8">Perform global reset or clearing of temporary sessions.</p>
              <div className="flex gap-4">
                <button className="bg-red-50 text-red-600 px-6 py-3 rounded-xl font-bold text-sm border border-red-100 hover:bg-red-100 transition-colors">
                  Emergency Shutdown
                </button>
                <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all">
                  Reset Analytics Cache
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div >
  );
}

function NavBtn({ icon: Icon, label, active, open, onClick, badge }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all relative ${active
        ? "bg-blue-600 text-white shadow-xl shadow-blue-500/20"
        : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"
        }`}
    >
      <Icon className="w-5 h-5 shrink-0" />
      {open && <span className="font-bold text-sm">{label}</span>}
      {open && active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
      {!open && badge && (
        <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white translate-x-1 -translate-y-1">
          {badge}
        </div>
      )}
      {open && badge && (
        <div className="ml-auto px-2 py-0.5 bg-red-500 text-white text-[10px] font-black rounded-lg">
          {badge}
        </div>
      )}
    </button>
  );
}

function StatItem({ label, value, icon: Icon, color }: any) {
  return (
    <div className="card p-8 flex items-center justify-between hover:border-blue-200 transition-colors">
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{label}</p>
        <p className="text-4xl font-black text-slate-900">{value}</p>
      </div>
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center shadow-lg`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
    </div>
  );
}

function HealthRow({ label, status }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
      <span className="text-sm font-bold text-slate-600">{label}</span>
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs font-black uppercase text-emerald-600 tracking-widest">{status}</span>
      </div>
    </div>
  );
}

import { adminApi } from "@/lib/api";

function EntityModule({ type, columns }: any) {
  const { data: res, mutate, error, isLoading } = useSWR(
    type === 'services' ? `${API_BASE_URL}/admins/services` : `${API_BASE_URL}/admins/users/${type}`,
    fetcher
  );

  const rows = Array.isArray(res) ? res : (res?.success ? res.data : []);
  const [search, setSearch] = useState("");
  const [selectedEntity, setSelectedEntity] = useState<any>(null);

  const handleDelete = async (id: any) => {
    if (confirm("Confirm permanent record deletion?")) {
      try {
        await adminApi.deleteUser(type, id);
        mutate();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const filtered = rows.filter((r: any) =>
    Object.values(r).some(v => String(v || "").toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${type}...`}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card bg-white overflow-hidden">
        <div className="overflow-x-auto text-[13px]">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">ID</th>
                {columns.map((c: any) => (
                  <th key={c.key} className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">{c.label}</th>
                ))}
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length + 2} className="px-8 py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Synchronizing with terminal...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={columns.length + 2} className="px-8 py-20 text-center text-red-500 font-bold">
                    <X className="w-8 h-8 mx-auto mb-4" />
                    <p>Failed to load data: {error.message}</p>
                    <button onClick={() => mutate()} className="mt-4 text-xs underline">Retry Connection</button>
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((row: any) => (
                  <EditableRow key={row.id} row={row} columns={columns} onSave={() => mutate()} onDelete={() => handleDelete(row.id)} type={type} onShowDetails={() => setSelectedEntity(row)} />
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + 2} className="px-8 py-20 text-center text-slate-400 font-bold italic">
                    No data discovered in this cluster.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedEntity && (
          <DetailModal
            entity={selectedEntity}
            type={type}
            onClose={() => setSelectedEntity(null)}
            onAction={async (action: 'approve' | 'reject') => {
              try {
                await adminApi.updateStatus(type, selectedEntity.id, action === 'approve' ? 'active' : 'suspended');
                mutate();
                setSelectedEntity(null);
              } catch (err: any) {
                alert(err.message);
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function EditableRow({ row, columns, onSave, onDelete, type, onShowDetails }: any) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>(row);

  const save = async () => {
    try {
      await adminApi.updateUser(type, row.id, form);
      setEditing(false);
      onSave();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const approve = async () => {
    try {
      await adminApi.updateStatus(type, row.id, 'active');
      onSave();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const block = async () => {
    try {
      await adminApi.updateStatus(type, row.id, 'blocked');
      onSave();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <tr className="hover:bg-slate-50 transition-colors group">
      <td className="px-8 py-6">
        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-400">{row.id}</div>
      </td>
      {columns.map((c: any) => (
        <td key={c.key} className="px-8 py-6">
          {editing ? (
            <input
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold"
              value={form[c.key] || ""}
              onChange={e => setForm({ ...form, [c.key]: e.target.value })}
            />
          ) : (
            <span className={`font-bold ${c.key === 'status' ? (row[c.key] === 'active' ? 'text-emerald-600' : 'text-amber-600') : 'text-slate-900'}`}>
              {row[c.key] || "-"}
            </span>
          )}
        </td>
      ))}
      <td className="px-8 py-6 text-right">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {editing ? (
            <>
              <button onClick={save} className="text-emerald-600 p-2 hover:bg-emerald-50 rounded-lg" title="Save"><Check className="w-4 h-4" /></button>
              <button onClick={() => setEditing(false)} className="text-slate-400 p-2 hover:bg-slate-100 rounded-lg" title="Cancel"><X className="w-4 h-4" /></button>
            </>
          ) : (
            <>
              {type === 'vendor' && (
                <button onClick={onShowDetails} className="text-indigo-600 p-2 hover:bg-indigo-50 rounded-lg" title="View Details">
                  <Eye className="w-4 h-4" />
                </button>
              )}
              {row.status !== 'blocked' ? (
                <button onClick={block} className="text-amber-600 p-2 hover:bg-amber-50 rounded-lg" title="Block User"><AlertCircle className="w-4 h-4" /></button>
              ) : (
                <button onClick={approve} className="text-emerald-600 p-2 hover:bg-emerald-50 rounded-lg" title="Unblock/Activate"><Check className="w-4 h-4" /></button>
              )}
              <button onClick={() => setEditing(true)} className="text-blue-600 p-2 hover:bg-blue-50 rounded-lg" title="Edit"><Edit3 className="w-4 h-4" /></button>
              <button onClick={onDelete} className="text-red-500 p-2 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 className="w-4 h-4" /></button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

function DetailModal({ entity, type, onClose, onAction }: any) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Merchant Identity</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Verification Terminal</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="space-y-6">
          <DetailRow label="Corporate Name" value={entity.name} />
          <DetailRow label="Network ID" value={entity.email} />
          <DetailRow label="Direct Contact" value={entity.phone || 'N/A'} />
          <DetailRow label="Specialization" value={entity.description || 'Global Service Provider'} />
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Node Status</span>
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${entity.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
              {entity.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-10">
          <button
            onClick={() => onAction('reject')}
            className="w-full py-4 rounded-2xl bg-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-all active:scale-95"
          >
            Reject Authorization
          </button>
          <button
            onClick={() => onAction('approve')}
            className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:scale-[1.02] transition-all active:scale-95"
          >
            Authorize Merchant
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function DetailRow({ label, value }: any) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-lg font-bold text-slate-900">{value}</p>
    </div>
  );
}

function ApprovalsModule({ mutateMetrics }: any) {
  const { data: res, mutate, isLoading } = useSWR(`${API_BASE_URL}/admins/users/vendor`, fetcher);
  const allVendors = Array.isArray(res) ? res : (res?.success ? res.data : []);
  const pendingVendors = allVendors.filter((v: any) => v.status === 'pending');
  const [selectedVendor, setSelectedVendor] = useState<any>(null);

  const handleAction = async (id: number, status: string) => {
    try {
      await adminApi.updateStatus('vendor', id, status);
      mutate();
      mutateMetrics();
      setSelectedVendor(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          <div className="col-span-full py-20 text-center">
            <Loader2 className="w-10 h-10 animate-spin mx-auto text-blue-600 mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Scanning for upcoming partners...</p>
          </div>
        ) : pendingVendors.length > 0 ? (
          pendingVendors.map((vendor: any) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              key={vendor.id}
              className="card p-8 hover:border-blue-500 transition-all group"
            >
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Store className="w-7 h-7" />
              </div>
              <h4 className="font-black text-xl mb-1 text-slate-900">{vendor.name}</h4>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">{vendor.email}</p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                  <span>Type</span>
                  <span className="text-slate-900">Professional Merchant</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                  <span>Status</span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-600 rounded-md">Pending Review</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedVendor(vendor)}
                  className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all"
                >
                  View File
                </button>
                <button
                  onClick={() => handleAction(vendor.id, 'active')}
                  className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                >
                  <Check className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center card border-dashed border-slate-200">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-lg font-black text-slate-900">All Nodes Synchronized</h3>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">No pending vendor authorizations in the queue.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedVendor && (
          <DetailModal
            entity={selectedVendor}
            type="vendor"
            onClose={() => setSelectedVendor(null)}
            onAction={async (action: 'approve' | 'reject') => {
              await handleAction(selectedVendor.id, action === 'approve' ? 'active' : 'suspended');
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState<any>(null);
  const { data: notifs, mutate } = useSWR(`${API_BASE_URL}/admins/notifications`, fetcher, { refreshInterval: 10000 });

  const unreadCount = Array.isArray(notifs) ? notifs.filter((n: any) => !n.is_read).length : 0;
  const list = Array.isArray(notifs) ? notifs : [];

  const markRead = async (id: number) => {
    try {
      await fetch(`${API_BASE_URL}/admins/notifications/${id}/read`, { method: 'PUT', headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } });
      mutate();
    } catch (e) { }
  };

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
        <Bell className={`w-5 h-5 ${unreadCount > 0 ? "text-blue-600 animate-bounce" : "text-slate-400"}`} />
        {unreadCount > 0 && <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white translate-x-1 -translate-y-1">{unreadCount}</span>}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 mt-4 w-96 bg-white rounded-[2rem] shadow-2xl border border-slate-100 z-[60] overflow-hidden">
            <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Alert Terminal</h4>
              <button onClick={() => setIsOpen(false)} className="text-[10px] font-bold text-slate-400 hover:text-red-500">CLOSE</button>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {list.length > 0 ? list.map((n: any) => (
                <button key={n.id} onClick={() => { setSelectedNotif(n); markRead(n.id); setIsOpen(false); }} className={`w-full text-left p-6 hover:bg-slate-50 transition-colors border-b border-slate-50 flex gap-4 ${!n.is_read ? 'bg-blue-50/30' : ''}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.type === 'new_business_type' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                    {n.type === 'new_business_type' ? <Briefcase className="w-5 h-5" /> : <Store className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900 mb-1">{n.title}</p>
                    <p className="text-[11px] font-medium text-slate-500 line-clamp-2">{n.message}</p>
                    <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-tight">{new Date(n.created_at).toLocaleString()}</p>
                  </div>
                </button>
              )) : <div className="p-12 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 italic">No alerts in queue</div>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedNotif && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedNotif(null)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-white w-full max-w-md rounded-[3rem] p-12 shadow-2xl border border-white/20">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-blue-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">{selectedNotif.title}</h3>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Protocol Intelligence</p>
                </div>
              </div>

              <div className="space-y-6 mb-10">
                <div className="p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                  <p className="text-sm font-bold text-slate-700 leading-relaxed">{selectedNotif.message}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Logged</p>
                    <p className="text-[10px] font-black text-slate-900">{new Date(selectedNotif.created_at).toLocaleTimeString()}</p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Alert Type</p>
                    <p className="text-[10px] font-black text-slate-900 uppercase">{selectedNotif.type.replace('_', ' ')}</p>
                  </div>
                </div>

                {selectedNotif.payload && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Terminal Payload</p>
                    <div className="p-5 bg-slate-900 rounded-2xl text-[10px] font-mono text-emerald-400 overflow-x-auto">
                      <pre>{JSON.stringify(JSON.parse(selectedNotif.payload), null, 2)}</pre>
                    </div>
                  </div>
                )}
              </div>

              <button onClick={() => setSelectedNotif(null)} className="w-full bg-slate-900 text-white py-5 rounded-[1.25rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:opacity-90 active:scale-95 transition-all">Close Terminal</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
