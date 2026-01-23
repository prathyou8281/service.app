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
  Plus,
  Check,
  Store
} from "lucide-react";

export default function VendorRegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    description: "",
  });

  const [selectedBT, setSelectedBT] = useState<any>(null);
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
      .then(res => {
        if (res.success) {
          setDbOptions(res.data);
        }
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
    setForm({ ...form, description: bt.name });
    setIsDropdownOpen(false);
    setSearchTerm("");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedBT) {
      setError("Please select your business type");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/vendors/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          business_type_id: selectedBT.id,
          description: selectedBT.name
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccess("Registration Request Submitted! Please wait for Admin approval before you can log in.");

      setTimeout(() => {
        router.push("/vendor/login");
      }, 5000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] px-4 py-12 selection:bg-sky-500/30">
      <style jsx>{`
        .input-group {
          position: relative;
          width: 100%;
        }
        .custom-input {
          width: 100%;
          background: #ffffff;
          border: 1.5px solid #edf2f7;
          border-radius: 1rem;
          padding: 1rem 1.25rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #1e293b;
          outline: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
        .custom-input:hover {
          border-color: #cbd5e1;
          background: #fafafa;
        }
        .custom-input:focus {
          border-color: #0ea5e9;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .dropdown-trigger {
          position: relative;
          cursor: pointer;
          width: 100%;
        }
        .label-text {
          font-size: 0.75rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .label-icon {
          color: #0ea5e9;
          opacity: 0.8;
        }
        .form-section-title {
           font-size: 0.875rem;
           font-weight: 800;
           color: #1e293b;
           margin-bottom: 1.5rem;
           padding-bottom: 0.5rem;
           border-bottom: 2px solid #f1f5f9;
        }
      `}</style>

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-sky-100/40 rounded-full blur-3xl -ml-64 -mt-64" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-100/40 rounded-full blur-3xl -mr-40 -mb-40" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-5xl relative z-10"
      >
        <div className="bg-white/90 backdrop-blur-2xl rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-12 border border-white relative overflow-hidden">
          <div className="relative z-10">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
              <div className="text-left">
                <div className="flex items-center gap-4 mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, delay: 0.2 }}
                    className="w-16 h-16 bg-sky-500 rounded-2xl flex items-center justify-center shadow-xl shadow-sky-500/20"
                  >
                    <Store className="text-white w-8 h-8" />
                  </motion.div>
                  <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
                      Vendor <span className="text-sky-500">Boarding</span>
                    </h1>
                    <p className="text-slate-400 text-xs mt-2 font-bold uppercase tracking-[0.2em]">Partner Integration Terminal</p>
                  </div>
                </div>
              </div>
              <div className="hidden md:block text-right">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-relaxed">
                  SECURE PORTAL CORE V.4.2<br />
                  <span className="text-sky-400">AUTHORIZED ACCESS ONLY</span>
                </p>
              </div>
            </div>

            {/* Error/Success messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 p-5 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-500 font-bold flex items-center gap-4"
              >
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 p-5 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs text-emerald-600 font-bold flex items-center gap-4"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                {success}
              </motion.div>
            )}

            <form onSubmit={handleRegister} className="space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Column 1 */}
                <div className="space-y-10">
                  <div className="space-y-6">
                    <h3 className="form-section-title flex items-center gap-2">
                      <User size={18} className="text-sky-500" />
                      Organization Identity
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="label-text">
                          <Store size={14} className="label-icon" />
                          Business Legal Name
                        </label>
                        <div className="input-group">
                          <input
                            name="name"
                            required
                            value={form.name}
                            onChange={handleChange}
                            className="custom-input"
                            placeholder="e.g. Premium Services Ltd"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="label-text">
                          <Phone size={14} className="label-icon" />
                          Contact Identifier
                        </label>
                        <div className="input-group">
                          <input
                            name="phone"
                            required
                            value={form.phone}
                            onChange={handleChange}
                            className="custom-input"
                            placeholder="+91 XXXXX XXXXX"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="form-section-title flex items-center gap-2">
                      <Briefcase size={18} className="text-sky-500" />
                      Market Positioning
                    </h3>
                    <div className="space-y-2 relative" ref={dropdownRef}>
                      <label className="label-text">
                        <Briefcase size={14} className="label-icon" />
                        Primary Business Vertical
                      </label>
                      <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="dropdown-trigger">
                        <div className={`custom-input flex items-center justify-between ${!selectedBT ? 'text-gray-400' : 'text-gray-900'} ${isDropdownOpen ? 'border-sky-500 ring-4 ring-sky-500/10' : ''}`}>
                          {selectedBT?.name || "Select business vertical"}
                          <ChevronDown size={20} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </div>
                      </div>
                      <AnimatePresence>
                        {isDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 5 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute left-0 right-0 z-50 bg-white border border-slate-100 rounded-2xl shadow-2xl p-4 mt-2"
                          >
                            <div className="relative mb-3">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                              <input
                                autoFocus
                                className="w-full bg-slate-50 rounded-xl pl-10 pr-4 py-3 text-sm outline-none"
                                placeholder="Search verticals..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                            <div className="max-h-48 overflow-y-auto custom-scrollbar">
                              {filteredOptions.map((opt) => (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => handleSelectService(opt)}
                                  className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors flex justify-between items-center text-sm font-semibold text-slate-600"
                                >
                                  {opt.name}
                                  {selectedBT?.id === opt.id && <Check size={16} className="text-sky-500" />}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-10">
                  <div className="space-y-6">
                    <h3 className="form-section-title flex items-center gap-2">
                      <Lock size={18} className="text-sky-500" />
                      Security Infrastructure
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="label-text">
                          <Mail size={14} className="label-icon" />
                          Corporate Email Address
                        </label>
                        <div className="input-group">
                          <input
                            name="email"
                            type="email"
                            required
                            value={form.email}
                            onChange={handleChange}
                            className="custom-input"
                            placeholder="admin@yourfirm.com"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="label-text">
                          <Lock size={14} className="label-icon" />
                          Secure Account Password
                        </label>
                        <div className="input-group">
                          <input
                            name="password"
                            type="password"
                            required
                            value={form.password}
                            onChange={handleChange}
                            className="custom-input"
                            placeholder="Minimum 8 characters"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50/80 rounded-3xl p-8 border border-slate-100">
                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4">Onboarding Notice</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                      By initializing this partnership integration, you agree to our <span className="text-sky-600 hover:underline cursor-pointer">Corporate Service Agreement</span> and <span className="text-sky-600 hover:underline cursor-pointer">Privacy Framework</span>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Area */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-8 border-t border-slate-50">
                <div className="order-2 md:order-1">
                  <p className="text-slate-400 text-sm font-medium">
                    Verified account?{" "}
                    <Link href="/vendor/login" className="text-sky-600 font-extrabold hover:underline">
                      Access Terminal
                    </Link>
                  </p>
                </div>
                <button
                  disabled={loading}
                  type="submit"
                  className="order-1 md:order-2 w-full md:w-auto min-w-[320px] bg-[#1e293b] hover:bg-[#0f172a] py-5 px-10 rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center gap-4 disabled:opacity-50 h-16"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Initialize Partnership
                      <Plus size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
}
