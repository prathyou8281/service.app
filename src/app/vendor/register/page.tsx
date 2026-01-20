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
  X,
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

  const [selectedService, setSelectedService] = useState("");
  const [dbOptions, setDbOptions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [customDescription, setCustomDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("http://localhost:4000/api/services/unique")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const names = data.map((s: any) => s.name);
          setDbOptions(names);
        }
      })
      .catch(err => console.error("Failed to fetch service options", err));

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = dbOptions.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectService = (option: string) => {
    setSelectedService(option);
    setForm({ ...form, description: option });
    setIsOtherSelected(false);
    setIsDropdownOpen(false);
    setSearchTerm("");
  };

  const handleSelectOther = () => {
    setIsOtherSelected(true);
    setSelectedService("Other");
    setForm({ ...form, description: "" });
    setIsDropdownOpen(false);
    setSearchTerm("");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const finalDescription = isOtherSelected ? customDescription : selectedService;

    if (!finalDescription) {
      setError("Please select or describe your service");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/vendors/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          description: finalDescription
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccess("Registration Request Submitted! Please wait for Admin approval before you can log in.");

      // We don't redirect immediately to let them read the message
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
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-sky-100/40 rounded-full blur-3xl -ml-64 -mt-64" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-100/40 rounded-full blur-3xl -mr-40 -mb-40" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-xl relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-10 border border-white/50 relative overflow-hidden">

          <div className="relative z-10">
            <div className="flex flex-col items-center mb-10 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12, delay: 0.2 }}
                className="w-20 h-20 bg-sky-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-sky-500/30 mb-8"
              >
                <Store className="text-white w-10 h-10" />
              </motion.div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">
                Vendor <span className="text-sky-500">Registration</span>
              </h1>
              <p className="text-gray-500 text-sm mt-3 font-medium max-w-sm uppercase tracking-widest text-[10px]">
                PARTNER WITH US AND GROW YOUR BUSINESS
              </p>
            </div>

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

            <form onSubmit={handleRegister} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Business Name</label>
                  <div className="relative group">
                    <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-sky-500 transition-colors" />
                    <input
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 outline-none transition-all placeholder:text-gray-400 font-medium"
                      placeholder="       Enter shop/business name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-sky-500 transition-colors" />
                    <input
                      name="phone"
                      required
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 outline-none transition-all placeholder:text-gray-400 font-medium"
                      placeholder="       +91 123456789"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-sky-500 transition-colors" />
                  <input
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 outline-none transition-all placeholder:text-gray-400 font-medium"
                    placeholder="         business@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-sky-500 transition-colors" />
                  <input
                    name="password"
                    type="password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 outline-none transition-all placeholder:text-gray-400 font-medium"
                    placeholder="        ••••••••"
                  />
                </div>
              </div>

              <div className="space-y-2 relative" ref={dropdownRef}>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">What service do you provide?</label>
                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="relative group cursor-pointer"
                >
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-sky-500 transition-colors" />
                  <div className={`w-full bg-gray-50/50 border ${isDropdownOpen ? 'border-sky-500 ring-4 ring-sky-500/10' : 'border-gray-100'} rounded-2xl pl-12 pr-10 py-4 text-sm transition-all font-medium ${!selectedService ? 'text-gray-400' : 'text-gray-900'}`}>
                    {selectedService || "Select a service category"}
                  </div>
                  <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </div>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 5, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute left-0 right-0 z-50 bg-white border border-gray-100 rounded-[2rem] shadow-2xl overflow-hidden mt-1 p-4"
                    >
                      <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input
                          autoFocus
                          placeholder="      Search for a service..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full bg-gray-50 border-none rounded-xl pl-10 pr-4 py-2 text-xs focus:ring-2 focus:ring-sky-500/20 outline-none font-medium"
                        />
                      </div>

                      <div className="max-h-[250px] overflow-y-auto custom-scrollbar pr-1">
                        {filteredOptions.length > 0 ? (
                          filteredOptions.map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => handleSelectService(option)}
                              className="w-full text-left px-4 py-3 rounded-xl text-xs font-semibold hover:bg-sky-50 transition-colors flex items-center justify-between group"
                            >
                              <span className={selectedService === option ? "text-sky-600" : "text-gray-600"}>{option}</span>
                              {selectedService === option && <Check className="w-3 h-3 text-sky-600" />}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-6 text-center">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">No services found</p>
                          </div>
                        )}

                        <div className="border-t border-gray-50 mt-2 pt-2">
                          <button
                            type="button"
                            onClick={handleSelectOther}
                            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-colors flex items-center gap-3 ${isOtherSelected ? 'bg-sky-50 text-sky-600' : 'text-gray-500 hover:bg-gray-50'}`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Other / Custom Service
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence>
                {isOtherSelected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Describe your custom service</label>
                    <textarea
                      required={isOtherSelected}
                      value={customDescription}
                      onChange={(e) => setCustomDescription(e.target.value)}
                      rows={3}
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl p-4 text-sm focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 outline-none transition-all resize-none placeholder:text-gray-400 font-medium"
                      placeholder="Enter a brief description of what you offer..."
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                disabled={loading}
                type="submit"
                className="w-full bg-gray-900 hover:bg-black py-5 rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-4 h-16"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Join the Partner Network
                    <Briefcase className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-12 pt-8 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500 font-medium">
                Already registered?{" "}
                <Link href="/vendor/login" className="text-sky-600 font-bold hover:underline underline-offset-3">
                  Vendor Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}
