"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, Settings, LogOut, ChevronDown, Shield, UserCircle, LayoutDashboard, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ProfileDropdownProps = {
  user: { username?: string; name?: string; email?: string; role?: string } | null;
  scrolled?: boolean;
};

export default function ProfileDropdown({ user, scrolled }: ProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    document.cookie = "userData=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    window.location.href = "/login";
  };

  const displayName = user?.name || user?.username || "Authorized User";
  const userRole = (user?.role || "user").toLowerCase();

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin': return <span className="text-[9px] font-black bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-full uppercase tracking-[0.15em] border border-blue-500/20">System Admin</span>;
      case 'vendor': return <span className="text-[9px] font-black bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-full uppercase tracking-[0.15em] border border-indigo-500/20">Merchant Partner</span>;
      case 'technician': return <span className="text-[9px] font-black bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full uppercase tracking-[0.15em] border border-emerald-500/20">Field Expert</span>;
      default: return <span className="text-[9px] font-black bg-white/5 text-slate-400 px-2.5 py-1 rounded-full uppercase tracking-[0.15em] border border-white/10">Verified Client</span>;
    }
  };

  const dashboardPath = userRole === 'admin' ? '/admin/dashboard' : userRole === 'vendor' ? '/vendor/dashboard' : userRole === 'technician' ? '/technician/dashboard' : '/welcome';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-4 p-1.5 pr-5 rounded-2xl transition-all duration-300 group border h-14 ${open
          ? "bg-[#161b22] border-white/20 shadow-lg shadow-black/20"
          : "bg-[#0d1117] border-white/5 hover:bg-[#161b22] hover:border-white/10"
          }`}
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black shadow-lg overflow-hidden ring-1 ring-white/20 group-hover:scale-105 transition-transform">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div className="hidden lg:flex flex-col items-start text-left">
          <span className="text-[11px] font-black tracking-tight leading-none mb-1.5 truncate max-w-[120px] uppercase transition-colors text-white">
            {displayName}
          </span>
          {getRoleBadge(userRole)}
        </div>
        <ChevronDown className={`w-3.5 h-3.5 transition-all duration-500 ${open ? 'rotate-180 text-white' : 'text-slate-500 group-hover:text-white'}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="absolute right-0 mt-4 w-72 bg-[#05070a] border border-white/10 rounded-[2.5rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.6)] z-[1000] overflow-hidden p-3"
          >
            <div className="p-8 bg-[#0d1117] rounded-[2rem] mb-3 border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-[40px] group-hover:bg-blue-600/20 transition-all" />
              <p className="font-black text-white text-lg tracking-tight truncate relative z-10">{displayName}</p>
              <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase truncate mt-1.5 relative z-10">{user?.email || "No email verified"}</p>
            </div>

            <div className="space-y-1.5 px-1">
              <ProfileLink href={dashboardPath} icon={LayoutDashboard} label="Command Center" />
              <ProfileLink href="/profile" icon={User} label="Identity Profile" />
              <ProfileLink href="/settings" icon={Settings} label="System Settings" />
              <ProfileLink href="/security" icon={Shield} label="Security Core" />
            </div>

            <div className="mt-3 pt-3 border-t border-white/5 px-1">
              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-between px-6 py-4 text-[10px] font-black text-red-400 rounded-2xl hover:bg-red-500/10 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <LogOut className="w-4 h-4" />
                  <span className="tracking-[0.2em] uppercase">Terminate Session</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProfileLink({ href, icon: Icon, label }: any) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between px-6 py-4 text-[11px] font-bold text-slate-400 rounded-2xl hover:bg-white/5 hover:text-white transition-all duration-300 group"
    >
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-blue-500/30 group-hover:bg-blue-600/10 transition-all">
          <Icon className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
        </div>
        <span className="tracking-wide uppercase">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-500" />
    </Link>
  );
}
