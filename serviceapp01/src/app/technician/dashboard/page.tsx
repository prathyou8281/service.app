"use client";

import { useEffect, useState, useRef } from "react";
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
  Star,
  Truck,
  XCircle,
  PlayCircle,
  Phone,
  Store,
  MessageSquare,
  ClipboardList,
  History,
  AlertCircle,
  MoreVertical,
  Check,
  ShieldCheck,
  PackageCheck,
  Settings,
  HelpCircle,
  User,
  Lock,
  Mail,
  Fingerprint
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = "http://localhost:4000/api";

export default function TechnicianDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [active, setActive] = useState("Overview");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

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

    // Click outside handler
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [router]);

  const fetcher = (url: string) => fetch(url, {
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
  }).then(r => {
    if (!r.ok) throw new Error("Failed to fetch");
    return r.json();
  });

  // Fetch Stats
  const { data: statsData } = useSWR(user ? `${API_BASE_URL}/technicians/stats` : null, fetcher, { refreshInterval: 10000 });
  const stats = statsData || { tasks: 0, completed: 0, rating: 4.9 };

  // Fetch Jobs
  const { data: jobsData, mutate: mutateJobs } = useSWR(user ? `${API_BASE_URL}/technicians/jobs` : null, fetcher, { refreshInterval: 5000 });
  const jobs = Array.isArray(jobsData) ? jobsData : [];

  const handleUpdateStatus = async (id: number, status: string, notes?: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/technicians/jobs/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ status, notes })
      });
      if (res.ok) {
        mutateJobs();
      } else {
        alert("Failed to update status");
      }
    } catch (e) {
      console.error(e);
      alert("Error updating status");
    }
  };

  if (!user) return null;

  // Filter jobs
  const activeJobs = jobs.filter((j: any) => ['assigned', 'processing', 'out_for_delivery'].includes(j.status));
  const completedJobs = jobs.filter((j: any) => j.status === 'completed');
  const pendingJobs = jobs.filter((j: any) => j.status === 'assigned');

  const sidebarItems = [
    { key: "Overview", icon: LayoutDashboard },
    { key: "Active Pipeline", icon: Zap, badge: activeJobs.length },
    { key: "Resolution Log", icon: History },
    { key: "My Schedule", icon: Calendar },
    { key: "Profile Settings", icon: Settings },
    { key: "Support Node", icon: HelpCircle },
  ];

  const notifications = [
    { id: 1, title: "New Assignment", message: "Emergency repair assigned by Nexus Partner", time: "2m ago", type: "urgent" },
    { id: 2, title: "Review Received", message: "Customer rated 5 stars for AC Service", time: "1h ago", type: "success" },
    { id: 3, title: "System Update", message: "New mobile protocol v2.4 deployed", time: "5h ago", type: "info" },
  ];

  return (
    <div className="min-h-screen flex bg-[#fbfcfd] text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-24'} bg-white border-r border-slate-200/60 transition-all duration-500 ease-in-out hidden lg:flex flex-col z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)] sticky top-0 h-screen`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10 px-2 overflow-hidden">
            <div className="min-w-[44px] h-11 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-50">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col"
              >
                <h1 className="text-xl font-black uppercase tracking-tighter text-slate-900 leading-none">
                  Service<span className="text-emerald-600">Hub</span>
                </h1>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Technician Portal</span>
              </motion.div>
            )}
          </div>

          <nav className="space-y-1.5 px-1">
            {sidebarItems.map(({ key, icon: Icon, badge }) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-[1.25rem] text-sm font-bold transition-all duration-300 group relative ${active === key
                  ? "bg-emerald-600 text-white shadow-xl shadow-emerald-500/25"
                  : "text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"
                  }`}
              >
                <Icon className={`w-[22px] h-[22px] shrink-0 ${active === key ? "text-white" : "group-hover:text-emerald-600 transition-colors"}`} />
                {isSidebarOpen && <span className="flex-1 text-left whitespace-nowrap">{key}</span>}
                {isSidebarOpen && badge !== undefined && badge > 0 && (
                  <span className={`text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black ${active === key ? 'bg-white text-emerald-600' : 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'}`}>
                    {badge}
                  </span>
                )}
                {!isSidebarOpen && active === key && (
                  <motion.div layoutId="active-indicator" className="absolute -left-1 w-2 h-8 bg-emerald-600 rounded-r-full" />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-100/80">
          <button
            onClick={() => {
              localStorage.removeItem("userData");
              localStorage.removeItem("access_token");
              router.push("/technician/login");
            }}
            className="w-full flex items-center gap-3.5 px-4 py-4 rounded-2xl text-sm font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all duration-300 group"
          >
            <LogOut className="w-5 h-5 shrink-0 group-hover:-translate-x-1 transition-transform" />
            {isSidebarOpen && <span>Exit Session</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="px-8 py-5 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors hidden lg:block border border-transparent hover:border-slate-200"
            >
              <MoreVertical className="w-5 h-5 text-slate-500" />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 italic">Personnel: {user?.name || user?.username || "Field Expert"}</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                {active} <span className="text-emerald-600">Intelligence Node</span>
              </h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SID: TECH-{user?.id?.toString().padStart(4, '0')}</span>
                <div className="w-1 h-1 bg-slate-300 rounded-full" />
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Operation Active
                </span>
                <div className="w-1 h-1 bg-slate-300 rounded-full" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clearance: Level 4</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Node */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-3 rounded-2xl transition-all border ${showNotifications ? 'bg-emerald-50 border-emerald-200 text-emerald-600 ring-4 ring-emerald-50' : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-emerald-600 hover:bg-emerald-50'}`}
              >
                <Bell className="w-5.5 h-5.5" />
                {pendingJobs.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                    {pendingJobs.length}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-[360px] bg-white border border-slate-200 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden z-50 origin-top-right"
                  >
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                      <h4 className="font-black text-sm uppercase tracking-widest text-slate-900">Transmission Log</h4>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">3 NEW SESSIONS</span>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto p-2">
                      {notifications.map((n) => (
                        <div key={n.id} className="p-4 rounded-3xl hover:bg-slate-50 transition-colors flex gap-4 cursor-pointer group">
                          <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${n.type === 'urgent' ? 'bg-red-50 text-red-500' :
                            n.type === 'success' ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-500'
                            }`}>
                            <AlertCircle className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">{n.title}</p>
                              <span className="text-[9px] font-bold text-slate-400 uppercase">{n.time}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{n.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="w-full p-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-colors border-t border-slate-100">
                      View Full Intelligence Log
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Interface */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className={`flex items-center gap-3 pl-2 pr-4 py-2 rounded-2xl transition-all border ${showProfileDropdown ? 'bg-emerald-50 border-emerald-200 ring-4 ring-emerald-50' : 'hover:bg-slate-50 border-transparent hover:border-slate-200'}`}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 border border-emerald-300/30 flex items-center justify-center font-black text-emerald-700 shadow-sm">
                  {(user?.name || user?.username || "A").charAt(0)}
                </div>
                <div className="hidden md:flex flex-col items-start text-left">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-tighter leading-none">{user?.name || user?.username || "Field Expert"}</span>
                  <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Tech Pro • Verified</span>
                </div>
              </button>

              <AnimatePresence>
                {showProfileDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-72 bg-white border border-slate-200 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden z-50 origin-top-right"
                  >
                    <div className="p-8 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white relative">
                      <motion.div
                        className="absolute top-0 right-0 p-8 opacity-10"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      >
                        <ShieldCheck className="w-24 h-24" />
                      </motion.div>
                      <div className="relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-2xl font-black mb-4">
                          {(user?.name || user?.username || "A").charAt(0)}
                        </div>
                        <h4 className="text-sm font-black uppercase tracking-widest">{user?.name || user?.username || "Authorized User"}</h4>
                        <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest mt-1 flex items-center gap-1.5 italic">
                          <Mail className="w-3 h-3" /> {user?.email || "No email verified"}
                        </p>
                      </div>
                    </div>
                    <div className="p-3">
                      {[
                        { icon: User, label: "Identity Profile", desc: "Security clearance & biometrics", path: "/profile" },
                        { icon: Settings, label: "System Settings", desc: "Operational preferences", path: "/profile" },
                        { icon: Fingerprint, label: "Security Core", desc: "Encryption & sessions", path: "/profile" },
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => router.push(item.path)}
                          className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors text-left group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-emerald-50 group-hover:border-emerald-200 transition-colors">
                            <item.icon className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">{item.label}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{item.desc}</p>
                          </div>
                        </button>
                      ))}
                      <div className="h-px bg-slate-100 my-2 mx-4" />
                      <button
                        onClick={() => {
                          localStorage.removeItem("userData");
                          localStorage.removeItem("access_token");
                          router.push("/technician/login");
                        }}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-red-50 transition-colors text-left group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center border border-red-100 group-hover:border-red-200 transition-colors">
                          <LogOut className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-red-600 uppercase tracking-widest">TERMINATE SESSION</p>
                          <p className="text-[10px] text-red-400 font-medium tracking-tight">Safely logout of system</p>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {active === "Overview" && (
              <motion.div
                key="ov"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard label="Pipeline" value={stats.tasks || "0"} trend="Active" icon={Zap} color="emerald" shadow="emerald" />
                  <StatCard label="Resolved" value={stats.completed || "0"} trend="+2 today" icon={CheckCircle2} color="blue" shadow="blue" />
                  <StatCard label="Response" value="12m" trend="Top 1%" icon={Clock} color="indigo" shadow="indigo" />
                  <StatCard label="Rating" value={stats.rating ? `${stats.rating}/5` : "4.9/5"} trend="Verified" icon={Star} color="amber" shadow="amber" />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* Active Jobs List */}
                  <div className="xl:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-2">
                      <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <ClipboardList className="w-4 h-4 text-emerald-500" /> Critical Operations
                      </h3>
                      {activeJobs.length > 0 && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 shadow-sm">
                          {activeJobs.length} ACTIVE SESSIONS
                        </span>
                      )}
                    </div>

                    <div className="space-y-4">
                      {activeJobs.length > 0 ? (
                        activeJobs.map((job: any) => (
                          <TaskCard key={job.id} job={job} onUpdate={handleUpdateStatus} />
                        ))
                      ) : (
                        <div className="p-20 text-center bg-white border border-slate-200/60 rounded-[3rem] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                          <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-emerald-100 shadow-inner">
                            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                          </div>
                          <h4 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Systems Nominal</h4>
                          <p className="text-slate-400 font-medium max-w-xs mx-auto text-sm leading-relaxed">No pending or active field operations at this time. Enjoy the downtime or refresh log.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sidebar/Activity */}
                  <div className="space-y-6">
                    <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 px-2 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-500" /> Recent Node Activity
                    </h3>
                    <div className="bg-white border border-slate-200/60 rounded-[2.5rem] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] divide-y divide-slate-100">
                      {jobs.slice(0, 5).map((job: any, i: number) => (
                        <div key={i} className="py-5 first:pt-0 last:pb-0 flex gap-4 group">
                          <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center transition-all group-hover:scale-110 ${job.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                            job.status === 'assigned' ? 'bg-amber-50 text-amber-600' :
                              'bg-blue-50 text-blue-600'
                            }`}>
                            <History className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-900 uppercase tracking-tighter leading-tight group-hover:text-emerald-600 transition-colors">{job.service_name}</p>
                            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{job.status} • {new Date(job.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                        </div>
                      ))}
                      {jobs.length === 0 && (
                        <p className="text-center py-10 text-xs font-bold text-slate-300 uppercase tracking-widest italic">No recent node activity found</p>
                      )}
                    </div>

                    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[2.5rem] p-8 text-white overflow-hidden relative group shadow-2xl shadow-indigo-950/20">
                      <motion.div
                        animate={{ rotate: [0, 10, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -right-8 -bottom-8 w-44 h-44 text-white/5"
                      >
                        <Zap className="w-full h-full" />
                      </motion.div>
                      <div className="relative z-10">
                        <h4 className="font-black text-[10px] uppercase tracking-[0.2em] mb-3 text-indigo-300/80">Operational Protocol</h4>
                        <p className="text-xl font-bold leading-[1.4] mb-6 tracking-tight">Always verify vendor details before field deployment.</p>
                        <button onClick={() => setActive("Active Pipeline")} className="bg-white text-indigo-950 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-indigo-500/10">
                          Protocol Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {active === "Active Pipeline" && (
              <motion.div key="pipe" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex items-center justify-between mb-8 px-2">
                  <h3 className="font-black text-xl text-slate-900 tracking-tight uppercase">Current Field Operations</h3>
                  <div className="flex gap-2">
                    <span className="px-4 py-2 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-amber-100 shadow-sm">Unaccepted: {pendingJobs.length}</span>
                    <span className="px-4 py-2 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-blue-100 shadow-sm">In Progress: {activeJobs.length - pendingJobs.length}</span>
                  </div>
                </div>
                {activeJobs.map((job: any) => (
                  <TaskCard key={job.id} job={job} onUpdate={handleUpdateStatus} />
                ))}
                {activeJobs.length === 0 && (
                  <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-200/60 shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-200">
                      <Zap className="w-10 h-10" />
                    </div>
                    <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No operations currently active in your pipeline.</p>
                  </div>
                )}
              </motion.div>
            )}

            {active === "Resolution Log" && (
              <motion.div key="log" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="mb-8 px-2">
                  <h3 className="font-black text-xl text-slate-900 tracking-tight uppercase">Historical Records</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Audit trail of all completed field actions and finalized handshakes</p>
                </div>
                {completedJobs.map((job: any) => (
                  <TaskCard key={job.id} job={job} onUpdate={handleUpdateStatus} readOnly />
                ))}
                {completedJobs.length === 0 && (
                  <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-200/60 shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-200">
                      <History className="w-10 h-10" />
                    </div>
                    <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Your resolution log is currently empty.</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Placeholder for other views */}
            {["My Schedule", "Profile Settings", "Support Node"].includes(active) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-slate-200/60 shadow-sm"
              >
                <div className="w-24 h-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center mb-8 border border-emerald-100/50 shadow-inner">
                  <Wrench className="w-10 h-10 text-emerald-500 animate-bounce" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">{active}</h3>
                <p className="text-slate-400 font-medium text-sm">This module is under tactical deployment. Stand by for update.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, trend, icon: Icon, color, shadow }: any) {
  const themes: any = {
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600", shadow: "shadow-emerald-500/10", iconBg: "bg-emerald-600" },
    blue: { bg: "bg-blue-50", text: "text-blue-600", shadow: "shadow-blue-500/10", iconBg: "bg-blue-600" },
    indigo: { bg: "bg-indigo-50", text: "text-indigo-600", shadow: "shadow-indigo-500/10", iconBg: "bg-indigo-600" },
    amber: { bg: "bg-amber-50", text: "text-amber-600", shadow: "shadow-amber-500/10", iconBg: "bg-amber-600" },
  };
  const theme = themes[color];

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className={`bg-white p-7 rounded-[2.5rem] border border-slate-200/60 shadow-xl ${theme.shadow} flex flex-col justify-between h-44 transition-all duration-300 relative overflow-hidden group`}
    >
      <div className={`absolute top-0 right-0 w-24 h-24 ${theme.bg} rounded-bl-full translate-x-12 -translate-y-12 opacity-50 group-hover:scale-110 transition-transform`} />

      <div className="flex items-start justify-between relative z-10">
        <div className={`p-3.5 rounded-2xl ${theme.bg} shadow-sm border border-white`}>
          <Icon className={`w-6 h-6 ${theme.text}`} />
        </div>
        <span className={`text-[10px] font-black uppercase tracking-widest ${theme.text} bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-slate-100`}>
          {trend}
        </span>
      </div>
      <div className="relative z-10">
        <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{value}</p>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 px-1">{label}</p>
      </div>
    </motion.div>
  );
}

function TaskCard({ job, onUpdate, readOnly }: any) {
  const [expanded, setExpanded] = useState(false);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'assigned': return { label: 'Assigned', color: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/20', icon: AlertCircle, step: 1 };
      case 'processing': return { label: 'In Progress', color: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-blue-500/20', icon: Activity, step: 2 };
      case 'out_for_delivery': return { label: 'Out for Delivery', color: 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-indigo-500/20', icon: Truck, step: 3 };
      case 'completed': return { label: 'Completed', color: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/20', icon: CheckCircle2, step: 4 };
      default: return { label: status, color: 'bg-slate-500 text-white', icon: ClipboardList, step: 0 };
    }
  };

  const statusInfo = getStatusInfo(job.status);
  const StatusIcon = statusInfo.icon;

  return (
    <motion.div
      layout
      className={`bg-white rounded-[3rem] border transition-all duration-500 overflow-hidden ${job.status === 'assigned' ? 'border-amber-200 shadow-2xl shadow-amber-500/5 ring-4 ring-amber-50/50' : 'border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-xl hover:shadow-slate-200/30'}`}
    >
      <div className="p-8 md:p-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-8">
              <div className="flex gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${job.status === 'assigned' ? 'bg-amber-600 shadow-amber-500/30' : 'bg-emerald-600 shadow-emerald-500/30'} text-white shadow-2xl`}>
                  <Wrench className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-black text-2xl text-slate-900 tracking-tight leading-none mb-3">
                    {job.service_name}
                  </h4>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">• SESSION ID: {job.id.toString().padStart(6, '0')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-10">
              <div className="space-y-5">
                <div className="flex items-center gap-4 group cursor-default">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-400 group-hover:bg-emerald-50 group-hover:border-emerald-200 group-hover:text-emerald-600 transition-all duration-300">
                    <UserCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Lead Customer</p>
                    <p className="text-sm font-black text-slate-700 uppercase tracking-tighter">{job.user_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group cursor-default">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-400 group-hover:bg-emerald-50 group-hover:border-emerald-200 group-hover:text-emerald-600 transition-all duration-300">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Fulfillment Vendor</p>
                    <p className="text-sm font-black text-slate-700 uppercase tracking-tighter">{job.vendor_name || "Nexus Partner"}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-4 group cursor-default">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-400 group-hover:bg-emerald-50 group-hover:border-emerald-200 group-hover:text-emerald-600 transition-all duration-300">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Secure Handshake</p>
                    <p className="text-sm font-black text-slate-700 tracking-tighter shadow-sm bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">{job.user_phone || "Secured Protocol"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group cursor-default">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-400 group-hover:bg-emerald-50 group-hover:border-emerald-200 group-hover:text-emerald-600 transition-all duration-300">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Dispatch Time</p>
                    <p className="text-sm font-black text-slate-700 uppercase tracking-tighter">{new Date(job.created_at).toLocaleDateString()} // {new Date(job.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setExpanded(!expanded)}
                className="group text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 flex items-center gap-2 transition-all p-2 -ml-2 rounded-xl hover:bg-emerald-50"
              >
                {expanded ? 'Retract Transmission Log' : 'Expand Operation Intel'} <ChevronRight className={`w-4 h-4 transition-transform duration-500 ${expanded ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col justify-center gap-4 shrink-0 lg:min-w-[240px] border-t lg:border-t-0 lg:border-l border-slate-100/80 pt-10 lg:pt-0 lg:pl-10">
            {!readOnly && (
              <div className="space-y-4">
                {job.status === 'assigned' && (
                  <>
                    <button
                      onClick={() => onUpdate(job.id, 'processing')}
                      className="w-full flex items-center justify-center gap-3 bg-emerald-600 text-white px-6 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] hover:bg-emerald-700 transition shadow-2xl shadow-emerald-500/20 active:scale-95 transform motion-safe:hover:-translate-y-1"
                    >
                      <PlayCircle className="w-5 h-5" /> Accept Task
                    </button>
                    <button
                      onClick={() => onUpdate(job.id, 'rejected')}
                      className="w-full flex items-center justify-center gap-3 bg-slate-50 text-slate-400 px-6 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] hover:bg-red-50 hover:text-red-500 transition border border-slate-200 active:scale-95"
                    >
                      <XCircle className="w-5 h-5" /> Decline
                    </button>
                  </>
                )}
                {job.status === 'processing' && (
                  <>
                    <button
                      onClick={() => onUpdate(job.id, 'out_for_delivery')}
                      className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white px-6 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] hover:bg-blue-700 transition shadow-2xl shadow-blue-500/20 active:scale-95 transform motion-safe:hover:-translate-y-1"
                    >
                      <Truck className="w-5 h-5" /> Start Delivery
                    </button>
                    <button
                      onClick={() => onUpdate(job.id, 'completed')}
                      className="w-full flex items-center justify-center gap-3 bg-emerald-600 text-white px-6 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] hover:bg-emerald-700 transition shadow-2xl shadow-emerald-500/20 active:scale-95 transform motion-safe:hover:-translate-y-1"
                    >
                      <CheckCircle2 className="w-5 h-5" /> Finalize
                    </button>
                  </>
                )}
                {job.status === 'out_for_delivery' && (
                  <button
                    onClick={() => onUpdate(job.id, 'completed')}
                    className="w-full flex items-center justify-center gap-3 bg-emerald-600 text-white px-6 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] hover:bg-emerald-700 transition shadow-2xl shadow-emerald-500/20 active:scale-95 transform motion-safe:hover:-translate-y-1"
                  >
                    <PackageCheck className="w-5 h-5" /> Confirm Delivered
                  </button>
                )}
              </div>
            )}
            {readOnly && (
              <div className="text-center p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 shadow-inner">
                <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
                  <Check className="w-7 h-7" />
                </div>
                <p className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">Resolution Finalized</p>
                <p className="text-[9px] text-emerald-400 font-bold mt-1 tracking-tight">ENCRYPTED AT REST</p>
              </div>
            )}
            <button className="w-full text-[10px] font-black text-slate-300 hover:text-slate-500 transition-colors uppercase tracking-[0.2em] flex items-center justify-center gap-2 mt-2">
              <MessageSquare className="w-4 h-4" /> Comm Channel 1
            </button>
          </div>
        </div>

        {/* Expandable Details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-slate-100 bg-slate-50/30"
            >
              <div className="p-10">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                  <div>
                    <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                      <MessageSquare className="w-3.5 h-3.5" /> Tactical Intel Log
                    </h5>
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-200/60 text-sm font-medium text-slate-600 leading-relaxed shadow-sm relative italic">
                      <div className="absolute top-4 left-4 opacity-5 text-4xl font-serif">"</div>
                      {job.user_description || "No tactical details provided by customer. Proceed with standard protocol."}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5" /> Mission Roadmap Progress
                    </h5>
                    <div className="flex items-center justify-between px-4 relative">
                      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200/50 -translate-y-1/2 rounded-full" />
                      {[
                        { s: 'assigned', i: AlertCircle },
                        { s: 'processing', i: PlayCircle },
                        { s: 'out_for_delivery', i: Truck },
                        { s: 'completed', i: CheckCircle2 }
                      ].map((step, idx) => {
                        const isPast = statusInfo.step > idx;
                        const isCurrent = statusInfo.step === idx + 1;
                        const StepIcon = step.i;
                        return (
                          <div key={idx} className="relative z-10 flex flex-col items-center">
                            <motion.div
                              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-700 border-2 ${isPast ? 'bg-emerald-600 border-emerald-600 text-white shadow-xl shadow-emerald-500/20' :
                                isCurrent ? 'bg-white border-emerald-600 text-emerald-600 shadow-2xl ring-8 ring-emerald-50 scale-110' :
                                  'bg-white border-slate-200 text-slate-300'
                                }`}
                              animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                              transition={{ repeat: Infinity, duration: 2 }}
                            >
                              <StepIcon className="w-5 h-5" />
                            </motion.div>
                            <span className={`text-[9px] font-black uppercase mt-4 tracking-tighter ${isCurrent ? 'text-emerald-700' : isPast ? 'text-emerald-500' : 'text-slate-400'}`}>
                              {step.s.replace(/_/g, ' ')}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
