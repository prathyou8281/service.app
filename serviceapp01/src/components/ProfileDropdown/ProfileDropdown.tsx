"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, Settings, LogOut, ChevronDown, Shield, UserCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ProfileDropdownProps = {
  user: { username?: string; name?: string; email?: string; role?: string } | null;
};

export default function ProfileDropdown({ user }: ProfileDropdownProps) {
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
      case 'admin': return <span className="text-[10px] font-black bg-blue-100 text-blue-600 px-2.5 py-1 rounded-full uppercase tracking-widest border border-blue-200">System Admin</span>;
      case 'vendor': return <span className="text-[10px] font-black bg-indigo-100 text-indigo-600 px-2.5 py-1 rounded-full uppercase tracking-widest border border-indigo-200">Merchant Partner</span>;
      case 'technician': return <span className="text-[10px] font-black bg-emerald-100 text-emerald-600 px-2.5 py-1 rounded-full uppercase tracking-widest border border-emerald-200">Field Expert</span>;
      default: return <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full uppercase tracking-widest border border-slate-200">Verified Client</span>;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-3 p-1.5 pr-4 rounded-2xl transition-all duration-300 group border ${open ? 'bg-slate-50 border-slate-200' : 'hover:bg-slate-50 border-transparent hover:border-slate-100'}`}
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center text-white font-black shadow-lg shadow-slate-200 overflow-hidden ring-2 ring-white">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div className="hidden lg:flex flex-col items-start text-left">
          <span className="text-xs font-black tracking-tight leading-none text-slate-900 mb-1 truncate max-w-[120px]">
            {displayName}
          </span>
          {getRoleBadge(userRole)}
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-500 ${open ? 'rotate-180 text-slate-900' : 'group-hover:text-slate-600'}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute right-0 mt-4 w-64 bg-white border border-slate-100 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] z-50 overflow-hidden outline-none p-2"
          >
            <div className="p-6 bg-slate-50 rounded-[1.5rem] mb-2 border border-slate-100">
              <p className="font-black text-slate-900 truncate">{displayName}</p>
              <p className="text-xs text-slate-500 font-bold truncate mt-1">{user?.email || "No email verified"}</p>
            </div>

            <div className="space-y-1">
              <ProfileLink href="/profile" icon={User} label="Identity Profile" />
              <ProfileLink href="/settings" icon={Settings} label="System Settings" />
              <ProfileLink href="/security" icon={Shield} label="Security Core" />
            </div>

            <div className="mt-2 pt-2 border-t border-slate-50">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-4 px-5 py-4 text-sm font-black text-red-500 rounded-2xl hover:bg-red-50 transition-all duration-300"
              >
                <LogOut className="w-4 h-4" />
                TERMINATE SESSION
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
      className="flex items-center gap-4 px-5 py-4 text-sm font-bold text-slate-600 rounded-2xl hover:bg-slate-50 hover:text-blue-600 transition-all duration-300 group"
    >
      <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
      <span>{label}</span>
    </Link>
  );
}
