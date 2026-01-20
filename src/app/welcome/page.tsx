"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Wrench,
  ClipboardList,
  ChevronRight,
  Star,
  ShieldCheck,
  Zap,
  ArrowRight,
  LayoutDashboard,
  Bell,
  Search,
  Clock,
  User,
  Settings,
  LogOut,
  CheckCircle2,
  Info,
  Smartphone,
  Laptop,
  Camera,
  Package
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProfileDropdown from "@/components/ProfileDropdown/ProfileDropdown";

const API_BASE_URL = "http://localhost:4000/api";

export default function WelcomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [metrics, setMetrics] = useState({ totalOrders: 0, activeServices: 0, completedJobs: 0 });
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (!userData) {
      router.push("/user/login");
      return;
    }
    const parsed = JSON.parse(userData);
    setUser(parsed);

    const token = localStorage.getItem("access_token");

    // Fetch metrics
    fetch(`${API_BASE_URL}/users/metrics`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) setMetrics(res.data);
      })
      .catch(err => console.error("Failed to fetch metrics", err));

    // Fetch bookings for notifications
    fetch(`${API_BASE_URL}/users/bookings`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(res => {
        const data = Array.isArray(res) ? res : (res?.success ? res.data : []);
        setBookings(data);
      })
      .catch(err => console.error("Failed to fetch bookings", err))
      .finally(() => setLoading(false));
  }, [router]);

  if (!user) return null;

  const hour = currentTime.getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  // Dynamic Notifications based on real data
  const notifications = bookings
    .filter(b => b.status === 'assigned' || b.status === 'completed' || b.status === 'ongoing')
    .slice(0, 3)
    .map(b => ({
      id: b.id,
      title: b.status === 'assigned' ? 'Technician Assigned' : b.status === 'completed' ? 'Service Completed' : 'Service Ongoing',
      desc: b.status === 'assigned' ? `${b.technician_name} is assigned to your ${b.service_name}.` : b.status === 'completed' ? `Your ${b.service_name} has been successfully completed.` : `Work is in progress for ${b.service_name}.`,
      icon: b.status === 'completed' ? CheckCircle2 : b.status === 'assigned' ? User : Zap,
      color: b.status === 'completed' ? 'emerald' : b.status === 'assigned' ? 'indigo' : 'sky'
    }));

  return (
    <div className="min-h-screen bg-[#fcfdfe] text-[#1e293b] font-sans selection:bg-sky-500/30 overflow-x-hidden relative">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-sky-100/30 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-100/20 rounded-full blur-[140px]" />
      </div>

      <div className="fixed top-8 right-8 z-[100] flex items-center gap-4">
        <div
          className="relative"
          onMouseEnter={() => setShowNotifications(true)}
          onMouseLeave={() => setShowNotifications(false)}
        >
          <button className="w-12 h-12 bg-white rounded-2xl shadow-xl shadow-slate-200/50 flex items-center justify-center text-slate-400 hover:text-sky-500 hover:scale-110 transition-all active:scale-95 border border-white">
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-sky-500 rounded-full border-2 border-white" />}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-full mt-4 w-80 bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white p-6 z-[101]"
              >
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-black text-sm uppercase tracking-widest text-slate-900 text-[10px]">Real-time Updates</h4>
                  <span className="px-2 py-0.5 bg-sky-50 text-sky-500 rounded-full text-[9px] font-black uppercase">{notifications.length} New</span>
                </div>
                <div className="space-y-4">
                  {notifications.length > 0 ? notifications.map((n, i) => (
                    <div key={i} className="flex gap-4 p-3 hover:bg-sky-50 rounded-2xl transition-colors group cursor-pointer" onClick={() => router.push('/orders')}>
                      <div className={`w-10 h-10 bg-${n.color}-50 text-${n.color}-500 rounded-xl flex items-center justify-center shrink-0`}>
                        <n.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{n.title}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{n.desc}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-6">
                      <Info className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">No Recent Alerts</p>
                    </div>
                  )}
                </div>
                <button onClick={() => router.push('/orders')} className="w-full mt-6 py-3 border-t border-slate-50 text-[10px] font-black text-slate-400 hover:text-sky-500 uppercase tracking-[0.2em] transition-colors">
                  View All History
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-1 border border-white hover:scale-105 transition-transform active:scale-95">
          <ProfileDropdown user={user ? { username: user.name || user.username, email: user.email, role: user.role } : null} />
        </div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-24 pb-20">
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-3 text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] mb-4">
              <Clock className="w-4 h-4" />
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter mb-4">
              {greeting}, <br />
              <span className="text-sky-500">{user.name || user.username}</span>.
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-xl">
              What can we help you maintain or fix today? Browse our premium services or check your ongoing projects.
            </p>
          </motion.div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-24">
          <div className="lg:col-span-8 space-y-10">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
              <input
                type="text"
                placeholder="Search for experts (CCTV, Laptops, Mobile...)"
                className="w-full h-20 bg-white border-2 border-transparent focus:border-sky-500/20 rounded-3xl pl-16 pr-8 text-lg font-bold shadow-2xl shadow-slate-200/40 outline-none transition-all placeholder:text-slate-300"
              />
            </div>

            {/* Recent Bookings Section */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-6 px-4">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-sky-500" />
                  Recent Service Bookings
                </h3>
                <Link href="/orders" className="text-[10px] font-black uppercase text-sky-500 hover:tracking-widest transition-all">View Full History</Link>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {bookings.length > 0 ? bookings.slice(0, 3).map((b, idx) => (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-xl shadow-slate-200/20 flex items-center justify-between group hover:border-sky-500/30 transition-all cursor-pointer"
                    onClick={() => router.push('/orders')}
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center border border-sky-100/50 group-hover:bg-sky-500 group-hover:text-white transition-all duration-500">
                        <Wrench className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 leading-tight">{b.service_name}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{b.vendor_name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="hidden sm:block text-right">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Technician</p>
                        <p className="text-xs font-bold text-slate-900">{b.technician_name || 'Assigning...'}</p>
                      </div>
                      <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${b.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : b.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-sky-50 text-sky-600 border-sky-100'}`}>
                        {b.status}
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-sky-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </motion.div>
                )) : (
                  <div className="p-12 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                    <p className="text-slate-400 text-sm font-medium italic">No active bookings. Start exploring services!</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Link href="/services" className="group bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl hover:bg-sky-600 transition-all duration-500 relative overflow-hidden">
                <div className="absolute right-[-20px] top-[-20px] opacity-10 group-hover:rotate-12 transition-transform duration-700">
                  <Wrench className="w-40 h-40" />
                </div>
                <h3 className="text-2xl font-black mb-2">Book New Service</h3>
                <p className="text-sky-200 text-sm font-medium opacity-80 mb-8">Professional repair & installation</p>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                  Explore Now <ArrowRight className="w-4 h-4" />
                </div>
              </Link>

              <div className="bg-indigo-500 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute right-[-20px] top-[-20px] opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <Zap className="w-40 h-40" />
                </div>
                <h3 className="text-2xl font-black mb-2">Priority Support</h3>
                <p className="text-indigo-100 text-sm font-medium opacity-80 mb-8">24/7 dedicated assistance</p>
                <Link href="/support" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                  Getting Help <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white rounded-[3rem] p-10 border border-slate-50 shadow-2xl flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-sky-50 rounded-[2rem] flex items-center justify-center mb-6 border-2 border-white shadow-lg">
              <User className="w-10 h-10 text-sky-500" />
            </div>
            <h4 className="text-xl font-black text-slate-900">{user.name || user.username}</h4>
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mt-1 mb-8">{user.role}</p>

            <div className="w-full space-y-4 mb-8">
              <MetricRow label="Jobs Completed" value={metrics.completedJobs} icon={CheckCircle2} color="emerald" />
              <MetricRow label="Active Orders" value={metrics.activeServices} icon={Clock} color="sky" />
              <MetricRow label="Lifetime Points" value={metrics.totalOrders * 50} icon={Star} color="amber" />
            </div>

            <button onClick={() => router.push('/profile')} className="w-full py-4 bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-sky-50 hover:text-sky-600 transition-all">
              Complete Profile
            </button>
          </div>
        </section>

        <section className="mb-24">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Popular Categories</h2>
              <p className="text-sm font-medium text-slate-400">Most requested services in your area</p>
            </div>
            <Link href="/services" className="text-sky-500 font-black text-[10px] uppercase tracking-widest hover:underline underline-offset-8 transition-all">
              View All Categories
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <ShortCut icon={Laptop} label="IT Support" />
            <ShortCut icon={Camera} label="Security" />
            <ShortCut icon={Smartphone} label="Mobiles" />
            <ShortCut icon={Wrench} label="Repairs" />
            <ShortCut icon={LayoutDashboard} label="Network" />
            <ShortCut icon={Settings} label="Automation" />
          </div>
        </section>

        <section className="bg-sky-500 rounded-[3rem] p-12 lg:p-20 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-10">
            <svg viewBox="0 0 200 200" className="w-full h-full fill-white">
              <path d="M45,-76.3C58.3,-69.1,69.1,-58.3,76.3,-45C83.5,-31.7,87.1,-15.8,87.1,0C87.1,15.8,83.5,31.7,76.3,45C69.1,58.3,58.3,69.1,45,76.3C31.7,83.5,15.8,87.1,0,87.1C-15.8,87.1,-31.7,83.5,-45,76.3C-58.3,69.1,-69.1,58.3,-76.3,45C-83.5,31.7,-87.1,15.8,-87.1,0C-87.1,-15.8,-83.5,-31.7,-76.3,-45C-69.1,-58.3,-58.3,-69.1,-45,-76.3C-31.7,-83.5,-15.8,-87.1,0,-87.1C15.8,-87.1,31.7,-83.5,45,-76.3Z" transform="translate(100 100)" />
            </svg>
          </div>
          <div className="relative z-10 lg:flex items-center justify-between gap-10">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 font-black uppercase tracking-[0.3em] text-[10px] mb-6 mb-8 text-sky-100 opacity-80">
                <ShieldCheck className="w-5 h-5" /> Verified Technicians
              </div>
              <h2 className="text-4xl lg:text-5xl font-black mb-6">Experience the elite standard of service.</h2>
              <p className="text-sky-100 text-lg opacity-80 mb-10">Join 5000+ happy customers who trust our verified professionals for their high-end service requirements.</p>
              <button className="bg-white text-sky-500 px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-sky-50 transition-all shadow-2xl">
                Become a Partner
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function MetricRow({ label, value, icon: Icon, color }: any) {
  const colors: any = {
    emerald: "text-emerald-500 bg-emerald-50",
    sky: "text-sky-500 bg-sky-50",
    amber: "text-amber-500 bg-amber-50",
    indigo: "text-indigo-500 bg-indigo-50"
  };

  return (
    <div className="flex items-center justify-between w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:scale-[1.02] transition-transform">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 ${colors[color]} rounded-lg flex items-center justify-center`}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-sm font-black text-slate-900">{value}</span>
    </div>
  );
}

function ShortCut({ icon: Icon, label }: any) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-50 flex flex-col items-center gap-4 hover:shadow-2xl hover:shadow-sky-500/10 hover:-translate-y-2 transition-all duration-500 group cursor-pointer group shadow-xl shadow-slate-200/20">
      <div className="w-12 h-12 bg-sky-50 text-sky-500 rounded-2xl flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white transition-all duration-500">
        <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
      </div>
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-900 transition-colors">{label}</span>
    </div>
  );
}
