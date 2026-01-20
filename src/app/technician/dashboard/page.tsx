"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import {
  Wrench,
  Activity,
  ClipboardCheck,
  LogOut,
  LayoutDashboard,
  CheckCircle2,
  Clock,
  AlertCircle,
  Briefcase,
  User,
  MapPin,
  Settings,
  ShieldCheck,
  Phone,
  MessageSquare,
  ArrowRight,
  Play,
  RotateCcw,
  ChevronRight
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

export default function TechnicianDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [active, setActive] = useState<"Dashboard" | "Jobs" | "History" | "Settings">("Dashboard");
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("userData");
    if (!data) return router.push("/technician/login");

    const parsed = JSON.parse(data);
    if (parsed.role.toLowerCase() !== "technician") {
      router.push("/technician/login");
      return;
    }
    setUser(parsed);
  }, [router]);

  const { data: jobsRes, mutate } = useSWR(
    user ? `${API_BASE_URL}/technicians/jobs` : null,
    fetcher
  );
  const jobs = jobsRes?.success ? jobsRes.data : Array.isArray(jobsRes) ? jobsRes : [];

  const metrics = {
    total: jobs.length,
    new: jobs.filter((j: any) => j.status === "assigned").length,
    active: jobs.filter((j: any) => j.status === "ongoing" || j.status === "accepted").length,
    completed: jobs.filter((j: any) => j.status === "completed").length,
  };

  const handleUpdateStatus = async (jobId: number, status: string) => {
    setUpdating(jobId);
    const token = localStorage.getItem("access_token");
    try {
      const res = await fetch(`${API_BASE_URL}/technicians/jobs/${jobId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      }).then(r => r.json());

      if (res.success) {
        mutate();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="w-10 h-10 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin" />
      </div>
    );

  if (user.status === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-12 border border-slate-100 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-amber-400" />
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-amber-50 rounded-3xl flex items-center justify-center relative shadow-inner">
              <Clock className="w-12 h-12 text-amber-500 animate-pulse" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">Under Review</h2>
          <p className="text-slate-500 font-medium leading-relaxed mb-10">
            Welcome, <strong>{user.username}</strong>. Your profile is being verified by our team. You'll get access to your dashboard once approved.
          </p>
          <button
            onClick={() => {
              localStorage.clear();
              document.cookie = "userData=; Max-Age=0; path=/";
              router.push("/technician/login");
            }}
            className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-3 group text-xs uppercase tracking-widest"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Sign Out
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-slate-200 p-10 hidden xl:flex flex-col shadow-xl shadow-slate-200/20">
        <div className="flex items-center gap-3 mb-16">
          <div className="w-12 h-12 bg-sky-500 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Wrench className="text-white w-6 h-6 fill-current" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter">Tech<span className="text-sky-500">Center</span></h1>
        </div>

        <nav className="space-y-3 flex-1">
          {[
            { key: "Dashboard", label: "Overview", icon: LayoutDashboard },
            { key: "Jobs", label: "Assignments", icon: Briefcase },
            { key: "History", label: "Completed", icon: ClipboardCheck },
            { key: "Settings", label: "Preferences", icon: Settings },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActive(key as any)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all relative group
                ${active === key
                  ? "bg-sky-50 text-sky-600 shadow-sm"
                  : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-300 ${active === key ? "scale-110" : "group-hover:scale-110"}`} />
              {label}
              {active === key && <motion.div layoutId="navInd" className="absolute left-0 w-1.5 h-6 bg-sky-500 rounded-r-full" />}
            </button>
          ))}
        </nav>

        <button
          onClick={() => {
            localStorage.clear();
            document.cookie = "userData=; Max-Age=0; path=/";
            router.push("/technician/login");
          }}
          className="mt-auto flex items-center gap-3 px-6 py-4 text-sm font-bold text-slate-400 hover:text-rose-500 transition-colors group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Logout
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto custom-scrollbar">
        <header className="sticky top-0 z-40 flex justify-between items-center px-10 py-8 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">{active}</h1>
            <p className="text-sm font-medium text-slate-400 mt-1 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Network Status: Online
            </p>
          </div>
          <div className="flex items-center gap-6">
            <ProfileDropdown user={user} />
          </div>
        </header>

        <div className="max-w-7xl mx-auto p-10">
          <AnimatePresence mode="wait">
            {active === "Dashboard" && (
              <motion.div key="dash" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  <Stat label="Total Assigned" value={metrics.total} color="sky" />
                  <Stat label="New Requests" value={metrics.new} color="amber" />
                  <Stat label="Ongoing Work" value={metrics.active} color="indigo" />
                  <Stat label="Successful Jobs" value={metrics.completed} color="emerald" />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                  <div className="xl:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <Activity className="w-6 h-6 text-sky-500" />
                        Active Assignments
                      </h3>
                      <Link href="#jobs" onClick={() => setActive("Jobs")} className="text-xs font-black text-sky-500 uppercase tracking-widest hover:underline">View All</Link>
                    </div>

                    <div className="space-y-6">
                      {jobs
                        .filter((j: any) => j.status !== "completed")
                        .slice(0, 5)
                        .map((job: any) => (
                          <ProfessionalJobCard
                            key={job.id}
                            job={job}
                            onUpdate={handleUpdateStatus}
                            isUpdating={updating === job.id}
                          />
                        ))}
                      {jobs.filter((j: any) => j.status !== "completed").length === 0 && (
                        <div className="p-12 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                          <p className="text-slate-400 font-medium italic">No active assignments at the moment.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="bg-white rounded-[3.5rem] p-10 shadow-2xl shadow-slate-200/40 border border-slate-100">
                      <h3 className="text-xl font-bold mb-8">Upcoming Events</h3>
                      <div className="space-y-8">
                        <ScheduleItem time="10:00 AM" label="Tool Audit" active />
                        <ScheduleItem time="01:30 PM" label="Workshop Sync" />
                        <ScheduleItem time="04:00 PM" label="Equipment Return" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-500 to-sky-600 rounded-[3rem] p-10 text-white shadow-xl">
                      <ShieldCheck className="w-10 h-10 mb-6 opacity-80" />
                      <h4 className="text-xl font-black mb-2">Duty Standards</h4>
                      <p className="text-white/80 text-sm leading-relaxed mb-6 font-medium">Remember to update job status in real-time for customer transparency.</p>
                      <div className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-white/10 rounded-full inline-block">Professional Protocol</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {active === "Jobs" && (
              <motion.div key="jobs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-black">All Assigned Jobs</h2>
                  <div className="flex gap-2">
                    <span className="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-xs font-bold uppercase tracking-widest border border-amber-100">{metrics.new} New Requests</span>
                    <span className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold uppercase tracking-widest border border-indigo-100">{metrics.active} Active</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {jobs
                    .filter((j: any) => j.status !== "completed")
                    .map((job: any) => (
                      <ProfessionalJobCard
                        key={job.id}
                        job={job}
                        onUpdate={handleUpdateStatus}
                        isUpdating={updating === job.id}
                      />
                    ))}
                </div>
              </motion.div>
            )}

            {active === "History" && (
              <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/20 border border-slate-100 overflow-hidden">
                <div className="p-10 border-b border-slate-100 bg-emerald-500/5">
                  <h2 className="text-2xl font-black flex items-center gap-3 text-emerald-600"><ClipboardCheck className="w-8 h-8" /> Completed Projects</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Service Details</th>
                        <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Customer Note</th>
                        <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Completion Date</th>
                        <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Performance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {jobs
                        .filter((j: any) => j.status === "completed")
                        .map((job: any) => (
                          <tr key={job.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-10 py-8">
                              <p className="font-black text-slate-900">{job.service_name}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Order #{job.id}</p>
                            </td>
                            <td className="px-10 py-8">
                              <p className="text-xs text-slate-500 line-clamp-1 italic font-medium">"{job.user_description}"</p>
                            </td>
                            <td className="px-10 py-8 text-sm font-bold text-slate-600">
                              {new Date(job.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                            <td className="px-10 py-8">
                              <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full uppercase tracking-widest border border-emerald-100">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Perfect
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {active === "Settings" && (
              <motion.div key="settings" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl space-y-8">
                <div className="bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-sky-50 rounded-full blur-3xl -translate-x-12 -translate-y-12" />
                  <h3 className="text-2xl font-black mb-10 text-slate-900 border-b border-slate-50 pb-6">Account Verification</h3>
                  <div className="space-y-6">
                    <AccountDetail label="Full Name" value={user.username} />
                    <AccountDetail label="Email Identity" value={user.email} />
                    <AccountDetail label="Professional Role" value="Elite Technician" />
                    <AccountDetail label="Verification Status" value="System Verified" icon={ShieldCheck} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
}

/* ---------- Subcomponents ---------- */

function Stat({ label, value, color }: any) {
  const themes: any = {
    sky: "text-sky-500 bg-sky-50 border-sky-100 shadow-sky-500/5",
    amber: "text-amber-500 bg-amber-50 border-amber-100 shadow-amber-500/5",
    indigo: "text-indigo-500 bg-indigo-50 border-indigo-100 shadow-indigo-500/5",
    emerald: "text-emerald-500 bg-emerald-50 border-emerald-100 shadow-emerald-500/5",
  };

  return (
    <div className={`bg-white border rounded-[2.5rem] p-8 shadow-xl transition-all hover:-translate-y-1 duration-300 ${themes[color]}`}>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-2 truncate">{label}</p>
      <div className="flex items-center justify-between">
        <p className="text-4xl font-black text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function ProfessionalJobCard({ job, onUpdate, isUpdating }: { job: any, onUpdate: any, isUpdating: boolean }) {
  const statusConfig: any = {
    assigned: { label: "NEW REQUEST", color: "bg-amber-400 text-white border-amber-500 shadow-amber-500/20", action: "Approve Job", next: "accepted", icon: CheckCircle2, pulse: true },
    accepted: { label: "ACCEPTED", color: "bg-emerald-500 text-white border-emerald-600 shadow-emerald-500/20", action: "Start Work", next: "ongoing", icon: Play },
    ongoing: { label: "IN PROGRESS", color: "bg-indigo-600 text-white border-indigo-700 shadow-indigo-600/20", action: "Mark Completed", next: "completed", icon: ClipboardCheck },
  };

  const config = statusConfig[job.status] || { label: job.status, color: "bg-slate-50 text-slate-400" };

  return (
    <div className="bg-white border border-slate-100 rounded-[3rem] p-8 shadow-2xl shadow-slate-200/40 relative group transition-all duration-500 hover:border-sky-200">
      <div className="flex justify-between items-start mb-6">
        <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-xl flex items-center gap-2 ${config.color}`}>
          {config.pulse && <div className="w-2 h-2 rounded-full bg-white animate-ping" />}
          {config.label}
        </div>
        <div className="flex gap-2">
          <button className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-sky-500 hover:bg-sky-50 transition-all"><Phone className="w-4 h-4" /></button>
          <button className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-sky-500 hover:bg-sky-50 transition-all"><MessageSquare className="w-4 h-4" /></button>
        </div>
      </div>

      <h4 className="font-black text-xl text-slate-900 mb-2 leading-tight">{job.service_name}</h4>
      <div className="flex items-center gap-2 mb-6">
        <User className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-xs font-bold text-slate-500">{job.user_name || "Enterprise Client"}</span>
      </div>

      <div className="bg-slate-50/50 rounded-2xl p-5 mb-8 border border-slate-100/50">
        <p className="text-xs text-slate-500 leading-relaxed font-medium italic line-clamp-2">
          "{job.user_description}"
        </p>
      </div>

      <div className="flex items-center gap-6 mb-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-sky-500" />
          On-Site
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-amber-500" />
          {new Date(job.created_at).toLocaleDateString()}
        </div>
      </div>

      {config.action && (
        <button
          disabled={isUpdating}
          onClick={() => onUpdate(job.id, config.next)}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-900 text-white text-xs font-black uppercase tracking-[0.2em] transition-all hover:bg-sky-600 disabled:opacity-50 active:scale-95 shadow-xl shadow-slate-900/10"
        >
          {isUpdating ? (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              {config.action}
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
}

function ScheduleItem({ time, label, active }: any) {
  return (
    <div className="flex gap-6 group">
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full ${active ? "bg-sky-500 ring-4 ring-sky-100" : "bg-slate-200"} group-hover:scale-125 transition-all`} />
        <div className="w-px h-full bg-slate-100 my-2" />
      </div>
      <div>
        <p className={`text-xs font-black tracking-widest uppercase ${active ? "text-sky-500" : "text-slate-400"}`}>{time}</p>
        <p className="text-sm font-bold text-slate-900 mt-1">{label}</p>
      </div>
    </div>
  );
}

function AccountDetail({ label, value, icon: Icon }: any) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0 group">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
      <span className="flex items-center gap-2 font-black text-slate-900">
        {Icon && <Icon className="w-4 h-4 text-sky-500" />}
        {value}
      </span>
    </div>
  );
}
