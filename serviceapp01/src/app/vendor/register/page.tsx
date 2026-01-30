"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Mail,
  Lock,
  User,
  Phone,
  ChevronDown,
  Search,
  Check,
  Store,
  ArrowRight,
  ShieldCheck,
  Building,
  Plus
} from "lucide-react";

export default function VendorRegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [selectedBT, setSelectedBT] = useState<any>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newBTName, setNewBTName] = useState("");
  const [dbOptions, setDbOptions] = useState<{ id: number, name: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("http://localhost:4000/api/vendors/business-types")
      .then(res => res.json())
      .then(data => {
        setDbOptions(data);
      })
      .catch(err => console.error("Failed to fetch business types", err));

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = dbOptions.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectService = (bt: any) => {
    setSelectedBT(bt);
    setIsAddingNew(false);
    setIsDropdownOpen(false);
    setSearchTerm("");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedBT && !isAddingNew) {
      setError("Please select your business category");
      return;
    }

    if (isAddingNew && !newBTName) {
      setError("Please specify your business category name");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...form,
        business_type_id: isAddingNew ? null : selectedBT.id,
        new_business_type: isAddingNew ? newBTName : null,
        description: isAddingNew ? `Specialist in ${newBTName}` : selectedBT.name
      };

      const res = await fetch("http://localhost:4000/api/vendors/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccess("Application submitted! Our operations team will verify your terminal credentials.");

      setTimeout(() => {
        router.push("/vendor/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col lg:flex-row">
      {/* Left Side - Brand/Intro */}
      <div className="lg:w-2/5 bg-slate-950 p-12 lg:p-24 flex flex-col justify-between text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-20">
            <div className="w-12 h-12 bg-blue-600 rounded-[1.25rem] flex items-center justify-center shadow-2xl shadow-blue-500/20">
              <Store className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter">Service<span className="text-blue-500">Hub</span></span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] mb-8 tracking-tight">
              Scale your<br />
              <span className="text-blue-500 underline decoration-blue-500/30 underline-offset-8">expertise.</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-sm mb-16 font-medium leading-relaxed">
              Connect with high-value clients and manage your operations with our enterprise-grade vendor portal.
            </p>

            <div className="space-y-8">
              {[
                { icon: Check, text: "Global Merchant Status" },
                { icon: Check, text: "Real-time Order Stream" },
                { icon: Check, text: "Automated Financial Sync" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                    <item.icon className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="font-bold text-sm uppercase tracking-widest text-slate-300">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 pt-20">
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">© 2026 ServiceHub Systems • Unified Field Interface</p>
        </div>

        {/* Decor */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] -ml-32 -mb-32"></div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-24 bg-slate-50">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-xl bg-white p-10 lg:p-16 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-slate-100"
        >
          <div className="mb-12">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">Merchant Onboarding</h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Configure your business terminal</p>
          </div>

          {(error || success) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mb-10 p-5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-4 ${error ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                }`}
            >
              <div className={`w-2 h-2 rounded-full shrink-0 ${error ? 'bg-red-500' : 'bg-emerald-500'} animate-pulse`} />
              {error || success}
            </motion.div>
          )}

          <form onSubmit={handleRegister} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Trade Identity</label>
                <div className="relative group">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-5 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none"
                    placeholder="Corporation Name"
                  />
                </div>
              </div>
              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Access</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    name="phone"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-5 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none"
                    placeholder="+91 Network ID"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 relative" ref={dropdownRef}>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sector Classification</label>

              {!isAddingNew ? (
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between px-5 font-bold text-sm focus:ring-4 focus:ring-blue-500/10 transition-all hover:bg-slate-100/50"
                >
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    <span className={selectedBT ? "text-slate-900" : "text-slate-400 uppercase text-[10px] tracking-widest"}>
                      {selectedBT?.name || "Select Business Vertical"}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                <div className="relative group">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                  <input
                    autoFocus
                    value={newBTName}
                    onChange={(e) => setNewBTName(e.target.value)}
                    className="w-full h-14 bg-white border border-blue-500 rounded-2xl pl-12 pr-32 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                    placeholder="Specify New Category..."
                  />
                  <button
                    type="button"
                    onClick={() => { setIsAddingNew(false); setNewBTName(""); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}

              <AnimatePresence>
                {isDropdownOpen && !isAddingNew && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute left-0 right-0 z-50 mt-3 bg-white border border-slate-100 rounded-3xl shadow-[0_24px_48px_-12px_rgba(0,0,0,0.1)] overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          autoFocus
                          className="w-full bg-white rounded-xl pl-11 pr-5 py-3 text-xs font-bold outline-none border border-slate-100 focus:border-blue-500 transition-colors"
                          placeholder="Search global category index..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto p-2">
                      <button
                        type="button"
                        onClick={() => { setIsAddingNew(true); setIsDropdownOpen(false); }}
                        className="w-full text-left px-5 py-4 hover:bg-blue-50 rounded-2xl transition-all flex items-center gap-3 text-blue-600 group"
                      >
                        <Plus className="w-5 h-5 bg-blue-100 p-1 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all" />
                        <span className="text-[10px] font-black uppercase tracking-widest italic">Other / Request New Category</span>
                      </button>
                      <div className="h-px bg-slate-50 my-2 mx-3" />
                      {filteredOptions.length > 0 ? (
                        filteredOptions.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleSelectService(opt)}
                            className={`w-full text-left px-5 py-4 rounded-2xl transition-all flex justify-between items-center text-xs font-bold ${selectedBT?.id === opt.id ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
                          >
                            {opt.name}
                            {selectedBT?.id === opt.id && <Check className="w-4 h-4" />}
                          </button>
                        ))
                      ) : (
                        <p className="p-8 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Security Index: No Match Found</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-8">
              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Network Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-5 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none"
                    placeholder="terminal@apex.com"
                  />
                </div>
              </div>
              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Terminal Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    name="password"
                    type="password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-5 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                disabled={loading}
                type="submit"
                className="w-full bg-slate-900 hover:bg-blue-600 h-16 rounded-2xl text-white text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl shadow-slate-200 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <>Request Terminal Access <ArrowRight className="w-5 h-5" /></>}
              </button>
            </div>

            <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
              Authorized personnel only?{" "}
              <Link href="/vendor/login" className="text-blue-600 hover:underline">
                Return to Login
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
