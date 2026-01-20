"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Wrench, Mail, Lock, User, Phone, Sparkles, ArrowRight, ShieldCheck, Search, ChevronDown, Check, X, Plus } from "lucide-react";
import { AnimatePresence } from "framer-motion";

export default function TechnicianRegisterPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        skills: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [skillOptions, setSkillOptions] = useState<string[]>([]);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isOtherSelected, setIsOtherSelected] = useState(false);
    const [customSkill, setCustomSkill] = useState("");

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fetch skills from services table
    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const res = await fetch("http://localhost:4000/api/services/unique");
                const data = await res.json();
                // data might be wrapped in { success, data } or just the array
                const services = Array.isArray(data) ? data : (data?.data || []);
                const names = services.map((s: any) => s.name);
                setSkillOptions(names);
            } catch (err) {
                console.error("Failed to fetch skills:", err);
            }
        };
        fetchSkills();
    }, []);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = skillOptions.filter((option) =>
        option.toLowerCase().includes(searchTerm.toLowerCase()) && !selectedSkills.includes(option)
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const toggleSkill = (skill: string) => {
        if (selectedSkills.includes(skill)) {
            setSelectedSkills(selectedSkills.filter(s => s !== skill));
        } else {
            setSelectedSkills([...selectedSkills, skill]);
        }
        setSearchTerm("");
    };

    const handleAddCustomSkill = () => {
        if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
            const newSkill = customSkill.trim();
            setSelectedSkills([...selectedSkills, newSkill]);
            // If it's not in our list, we'll treat it as a new candidate for the services table
            // The backend should handle storing it in the services table if requested
            setCustomSkill("");
            setIsOtherSelected(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        const skillsString = selectedSkills.join(", ");
        if (!skillsString) {
            setError("Please select at least one skill");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("http://localhost:4000/api/technicians/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, skills: skillsString }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Registration failed");
            }

            const tech = data.data; // Data contains tech details and access_token from TechniciansService

            // Auto-login after registration
            localStorage.setItem("access_token", tech.access_token);
            localStorage.setItem(
                "userData",
                JSON.stringify({
                    id: tech.id,
                    username: tech.name,
                    email: tech.email,
                    role: "technician",
                    status: tech.status,
                })
            );

            document.cookie = `userData=${JSON.stringify({
                username: tech.name,
                role: "technician",
                status: tech.status,
            })}; path=/; max-age=86400; SameSite=Lax`;

            setSuccess("Registration Successful! Redirecting to your dashboard...");
            setTimeout(() => {
                router.push("/technician/dashboard");
            }, 1500);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] px-4 py-12 selection:bg-sky-500/30">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-100/40 rounded-full blur-3xl -mr-64 -mt-64" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100/40 rounded-full blur-3xl -ml-40 -mb-40" />

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
                                <Wrench className="text-white w-10 h-10" />
                            </motion.div>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">
                                Technician <span className="text-sky-500">Registration</span>
                            </h1>
                            <p className="text-gray-500 text-sm mt-3 font-medium max-w-xs uppercase tracking-widest text-[10px]">
                                Build your professional career with us
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
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-sky-500 transition-colors z-20" />
                                        <input
                                            name="name"
                                            required
                                            value={form.name}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-16 pr-4 py-4 text-sm focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 outline-none transition-all placeholder:text-gray-400 font-medium"
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-sky-500 transition-colors z-20" />
                                        <input
                                            name="phone"
                                            required
                                            value={form.phone}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-16 pr-4 py-4 text-sm focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 outline-none transition-all placeholder:text-gray-400 font-medium"
                                            placeholder="+1 234 567 890"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-sky-500 transition-colors z-20" />
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        value={form.email}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-16 pr-4 py-4 text-sm focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 outline-none transition-all placeholder:text-gray-400 font-medium"
                                        placeholder="email@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Create Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-sky-500 transition-colors z-20" />
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        value={form.password}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-16 pr-4 py-4 text-sm focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 outline-none transition-all placeholder:text-gray-400 font-medium"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Specializations / Skills</label>

                                <div className="flex flex-wrap gap-2 mb-2">
                                    {selectedSkills.map(skill => (
                                        <motion.span
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            key={skill}
                                            className="bg-sky-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg shadow-sky-500/20"
                                        >
                                            {skill}
                                            <X className="w-3 h-3 cursor-pointer hover:text-red-200 transition-colors" onClick={() => toggleSkill(skill)} />
                                        </motion.span>
                                    ))}
                                </div>

                                <div className="relative" ref={dropdownRef}>
                                    <div
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className={`w-full bg-gray-50/50 border ${isDropdownOpen ? 'border-sky-500 ring-4 ring-sky-500/10' : 'border-gray-100'} rounded-2xl pl-16 pr-12 py-4 text-sm transition-all cursor-pointer flex items-center`}
                                    >
                                        <Sparkles className={`absolute left-5 w-4 h-4 transition-colors ${isDropdownOpen ? 'text-sky-500' : 'text-gray-400'}`} />
                                        <span className={`font-medium ${selectedSkills.length === 0 ? 'text-gray-400' : 'text-gray-900'}`}>
                                            {selectedSkills.length === 0 ? "Select your professional skills" : `${selectedSkills.length} skills selected`}
                                        </span>
                                        <ChevronDown className={`absolute right-5 w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                    </div>

                                    <AnimatePresence>
                                        {isDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 10, scale: 1 }}
                                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                className="absolute left-0 right-0 z-[100] bg-white/95 backdrop-blur-xl border border-gray-100 rounded-[2rem] shadow-2xl p-4 mt-2"
                                            >
                                                <div className="relative mb-4">
                                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <input
                                                        autoFocus
                                                        placeholder="Search skills..."
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        className="w-full bg-gray-50/50 border-none rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-sky-500/20 outline-none font-medium"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </div>

                                                <div className="max-h-[220px] overflow-y-auto custom-scrollbar pr-2 space-y-1">
                                                    {filteredOptions.length > 0 ? filteredOptions.map((option) => (
                                                        <button
                                                            key={option}
                                                            type="button"
                                                            onClick={() => toggleSkill(option)}
                                                            className="w-full text-left px-4 py-3 rounded-xl text-xs font-bold text-gray-600 hover:bg-sky-50 hover:text-sky-600 transition-all flex items-center justify-between group"
                                                        >
                                                            {option}
                                                            <Plus className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </button>
                                                    )) : searchTerm && (
                                                        <p className="text-[10px] text-gray-400 text-center py-4 font-bold uppercase tracking-widest italic">
                                                            No matching skills found
                                                        </p>
                                                    )}

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setIsOtherSelected(true);
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className="w-full text-left px-4 py-3 rounded-xl text-xs font-black text-sky-600 bg-sky-50/50 hover:bg-sky-50 transition-all flex items-center gap-2"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                        ADD CUSTOM SKILL
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <AnimatePresence>
                                    {isOtherSelected && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="flex gap-2 p-1">
                                                <input
                                                    placeholder="Enter custom skill..."
                                                    value={customSkill}
                                                    onChange={(e) => setCustomSkill(e.target.value)}
                                                    className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-sky-500 outline-none font-medium"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleAddCustomSkill}
                                                    className="bg-gray-900 text-white px-5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-colors"
                                                >
                                                    Add
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsOtherSelected(false)}
                                                    className="bg-gray-100 text-gray-500 px-3 rounded-xl hover:bg-gray-200 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.01, translateY: -2 }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gray-900 hover:bg-black py-5 rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-4 h-16"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Initialize Professional Account
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        <div className="mt-12 pt-8 border-t border-gray-100 text-center">
                            <div className="flex items-center justify-center gap-2 text-gray-400 text-[9px] font-bold uppercase tracking-[0.3em] mb-8">
                                <ShieldCheck className="w-4 h-4 text-sky-500" />
                                Official Professional Portal
                            </div>
                            <p className="text-sm text-gray-500 font-medium">
                                Already part of our network?{" "}
                                <Link href="/technician/login" className="text-sky-600 font-bold hover:underline underline-offset-4">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
