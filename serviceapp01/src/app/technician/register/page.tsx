"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Wrench,
    Mail,
    Lock,
    User,
    Phone,
    ArrowRight,
    ChevronDown,
    Check,
    Plus,
    X,
    LayoutGrid,
    Zap,
    Briefcase
} from "lucide-react";

export default function TechnicianRegisterPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // --- Dynamic Options ---
    const [categories, setCategories] = useState<{ id: number, name: string }[]>([]);
    const [serviceTypes, setServiceTypes] = useState<{ id: number, name: string }[]>([]);
    const [skillsPool, setSkillsPool] = useState<{ id: number, name: string }[]>([]);

    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [selectedServiceType, setSelectedServiceType] = useState<any>(null);
    const [selectedSkills, setSelectedSkills] = useState<{ id: number, name: string }[]>([]);

    const [isCatOpen, setIsCatOpen] = useState(false);
    const [isSTOpen, setIsSTOpen] = useState(false);
    const [isSkillsOpen, setIsSkillsOpen] = useState(false);
    const [skillSearch, setSkillSearch] = useState("");

    const catRef = useRef<HTMLDivElement>(null);
    const stRef = useRef<HTMLDivElement>(null);
    const skillRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Fetch Categories
        fetch("http://localhost:4000/api/vendors/business-types")
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error("Cat fetch failed", err));

        // Fetch Service Types
        fetch("http://localhost:4000/api/services/types")
            .then(res => res.json())
            .then(data => setServiceTypes(data))
            .catch(err => console.error("ST fetch failed", err));

        // Fetch Skills (All Services)
        fetch("http://localhost:4000/api/services")
            .then(res => res.json())
            .then(data => setSkillsPool(data))
            .catch(err => console.error("Skills fetch failed", err));

        const handleClickOutside = (e: MouseEvent) => {
            if (catRef.current && !catRef.current.contains(e.target as Node)) setIsCatOpen(false);
            if (stRef.current && !stRef.current.contains(e.target as Node)) setIsSTOpen(false);
            if (skillRef.current && !skillRef.current.contains(e.target as Node)) setIsSkillsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const toggleSkill = (skill: any) => {
        if (selectedSkills.find(s => s.id === skill.id)) {
            setSelectedSkills(selectedSkills.filter(s => s.id !== skill.id));
        } else {
            setSelectedSkills([...selectedSkills, skill]);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!selectedCategory || !selectedServiceType || selectedSkills.length === 0) {
            setError("Please select your industry, service type, and at least one skill.");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                ...form,
                business_type_id: selectedCategory.id,
                service_type_id: selectedServiceType.id,
                skills: selectedSkills.map(s => s.name).join(", "),
            };

            const res = await fetch("http://localhost:4000/api/technicians/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Registration failed");

            setSuccess("Professional terminal activated. Awaiting admin handshake...");
            setTimeout(() => router.push("/technician/login"), 2500);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] flex flex-col lg:flex-row">
            {/* Left Branding */}
            <div className="lg:w-2/5 bg-slate-900 p-12 lg:p-24 flex flex-col justify-between text-white relative overflow-hidden">
                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-3 mb-16">
                        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                            <Wrench className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Tech<span className="text-emerald-400">Hub</span></span>
                    </Link>

                    <h1 className="text-4xl lg:text-6xl font-black leading-tight mb-8">
                        Join Our<br />
                        <span className="text-emerald-500">Expert Team.</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-sm font-medium mb-16 leading-relaxed">
                        Access high-quality job requests and manage your business with professional tools.
                    </p>

                    <div className="space-y-8">
                        {[
                            { text: "Automated Job Dispatch" },
                            { text: "Real-time Earnings Tracking" },
                            { text: "Verified Technician Status" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                <span className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-300">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 pt-20">
                    <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">© 2026 TechHub • Professionals Network</p>
                </div>

                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
            </div>

            {/* Right Form */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-24 bg-slate-50">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-2xl bg-white p-10 lg:p-16 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-slate-100"
                >
                    <div className="mb-12">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">Professional Application</h2>
                        <p className="text-emerald-600 font-bold uppercase text-[10px] tracking-[0.2em]">Complete your profile to get started</p>
                    </div>

                    {(error || success) && (
                        <div className={`mb-10 p-5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-4 ${error ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                            <div className={`w-2 h-2 rounded-full ${error ? 'bg-red-500' : 'bg-emerald-500'} animate-pulse`} />
                            {error || success}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                <input
                                    name="name"
                                    required
                                    value={form.name}
                                    onChange={handleChange}
                                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all outline-none"
                                    placeholder="e.g. Robert Smith"
                                />
                            </div>
                            <div className="space-y-2.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Number</label>
                                <input
                                    name="phone"
                                    required
                                    value={form.phone}
                                    onChange={handleChange}
                                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all outline-none"
                                    placeholder="Enter mobile number"
                                />
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                            <input
                                name="email"
                                type="email"
                                required
                                value={form.email}
                                onChange={handleChange}
                                className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all outline-none"
                                placeholder="Example: name@email.com"
                            />
                        </div>

                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Category Dropdown */}
                                <div className="space-y-2.5 relative" ref={catRef}>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Service Category</label>
                                    <button
                                        type="button"
                                        onClick={() => setIsCatOpen(!isCatOpen)}
                                        className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between px-5 text-sm font-bold transition-all hover:bg-slate-100/50 outline-none focus:ring-4 focus:ring-emerald-500/10 group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Briefcase className="w-4 h-4 text-slate-400 group-focus:text-emerald-500" />
                                            <span className={selectedCategory ? "text-slate-900" : "text-slate-400 uppercase text-[10px] tracking-widest"}>
                                                {selectedCategory?.name || "Select Category"}
                                            </span>
                                        </div>
                                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isCatOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    <AnimatePresence>
                                        {isCatOpen && (
                                            <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute z-50 left-0 right-0 mt-3 bg-white border border-slate-100 rounded-[2rem] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.1)] max-h-60 overflow-y-auto p-2">
                                                {categories.map(c => (
                                                    <button key={c.id} type="button" onClick={() => { setSelectedCategory(c); setIsCatOpen(false); }} className={`w-full text-left px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${selectedCategory?.id === c.id ? 'bg-emerald-50 text-emerald-600' : 'hover:bg-slate-50 text-slate-600'}`}>
                                                        {c.name}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Service Type Dropdown */}
                                <div className="space-y-2.5 relative" ref={stRef}>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Specialty</label>
                                    <button
                                        type="button"
                                        onClick={() => setIsSTOpen(!isSTOpen)}
                                        className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between px-5 text-sm font-bold transition-all hover:bg-slate-100/50 outline-none focus:ring-4 focus:ring-emerald-500/10 group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <LayoutGrid className="w-4 h-4 text-slate-400 group-focus:text-emerald-500" />
                                            <span className={selectedServiceType ? "text-slate-900" : "text-slate-400 uppercase text-[10px] tracking-widest"}>
                                                {selectedServiceType?.name || "Select Type"}
                                            </span>
                                        </div>
                                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isSTOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    <AnimatePresence>
                                        {isSTOpen && (
                                            <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute z-50 left-0 right-0 mt-3 bg-white border border-slate-100 rounded-[2rem] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.1)] max-h-60 overflow-y-auto p-2">
                                                {serviceTypes.map(st => (
                                                    <button key={st.id} type="button" onClick={() => { setSelectedServiceType(st); setIsSTOpen(false); }} className={`w-full text-left px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${selectedServiceType?.id === st.id ? 'bg-emerald-50 text-emerald-600' : 'hover:bg-slate-50 text-slate-600'}`}>
                                                        {st.name}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Skills Tag Selection */}
                            <div className="space-y-4 relative" ref={skillRef}>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Skills & Expertise</label>

                                <div className="flex flex-wrap gap-2 min-h-[50px] p-4 bg-slate-50/50 border border-dashed border-slate-200 rounded-[2rem]">
                                    {selectedSkills.length === 0 && <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 italic p-2">Skill list is empty...</span>}
                                    {selectedSkills.map(skill => (
                                        <span key={skill.id} className="bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl flex items-center gap-2 shadow-xl shadow-emerald-600/20">
                                            {skill.name}
                                            <X className="w-3 h-3 cursor-pointer" onClick={() => toggleSkill(skill)} />
                                        </span>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setIsSkillsOpen(!isSkillsOpen)}
                                    className="w-full h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-between px-5 font-bold text-sm focus:ring-4 focus:ring-emerald-500/10 group transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <Zap className="w-4 h-4 text-emerald-500" />
                                        <span className="text-slate-400 uppercase text-[10px] tracking-widest">Select Professional Skills</span>
                                    </div>
                                    <Plus className={`w-5 h-5 text-emerald-500 transition-transform duration-300 ${isSkillsOpen ? 'rotate-45' : ''} bg-emerald-50 p-1.5 rounded-lg`} />
                                </button>

                                <AnimatePresence>
                                    {isSkillsOpen && (
                                        <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute z-50 left-0 right-0 mt-3 bg-white border border-slate-100 rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] overflow-hidden">
                                            <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                                                <input
                                                    className="w-full bg-white rounded-xl px-4 py-3 text-xs font-bold outline-none border border-slate-100 focus:border-emerald-500 transition-colors"
                                                    placeholder="Search for skillsets..."
                                                    value={skillSearch}
                                                    onChange={(e) => setSkillSearch(e.target.value)}
                                                />
                                            </div>
                                            <div className="max-h-60 overflow-y-auto p-2">
                                                {skillsPool.filter(s => s.name.toLowerCase().includes(skillSearch.toLowerCase())).map(skill => (
                                                    <button
                                                        key={skill.id}
                                                        type="button"
                                                        onClick={() => toggleSkill(skill)}
                                                        className={`w-full text-left px-5 py-4 rounded-2xl transition-all flex justify-between items-center text-[11px] font-black uppercase tracking-widest ${selectedSkills.find(s => s.id === skill.id) ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-50'}`}
                                                    >
                                                        {skill.name}
                                                        {selectedSkills.find(s => s.id === skill.id) && <Check className="w-4 h-4" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Create Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    value={form.password}
                                    onChange={handleChange}
                                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-5 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                disabled={loading}
                                type="submit"
                                className="w-full bg-slate-950 hover:bg-emerald-600 h-16 rounded-2xl text-white text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                            >
                                {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <>Submit Application <ArrowRight className="w-4 h-4" /></>}
                            </button>
                        </div>
                    </form>

                    <p className="mt-12 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Already a member?{" "}
                        <Link href="/technician/login" className="text-emerald-600 hover:underline">
                            Log In Here
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
