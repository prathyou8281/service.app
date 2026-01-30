"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Calendar,
  Edit3,
  Save,
  X,
  LogOut,
  Loader2,
  Camera,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Lock,
  Key,
  Shield,
  ArrowRight,
  Zap,
  Activity,
  UserCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = "http://localhost:4000/api";
const UPLOADS_BASE_URL = "http://localhost:4000";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status?: string;
  skills?: string;
  joined_at?: string;
  avatar?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Change Password State
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const stored = localStorage.getItem("userData");
      if (!stored) {
        router.push("/login");
        return;
      }

      const parsed = JSON.parse(stored);
      const token = localStorage.getItem("access_token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const role = parsed.role?.toLowerCase() || "user";
        let endpoint = `${API_BASE_URL}/users/profile`;
        if (role === "technician") endpoint = `${API_BASE_URL}/technicians/profile`;
        if (role === "vendor") endpoint = `${API_BASE_URL}/vendors/profile`;

        const res = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setFormData(data);
        } else {
          setUser(parsed);
          setFormData(parsed);
        }
      } catch (err) {
        console.error("Failed to sync profile:", err);
        setUser(parsed);
        setFormData(parsed);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleSave = async () => {
    if (!user) return;
    setUpdateStatus('saving');
    setErrorMessage("");

    const token = localStorage.getItem("access_token");
    const role = user.role?.toLowerCase() || "user";

    let endpoint = `${API_BASE_URL}/users/profile`;
    if (role === "technician") endpoint = `${API_BASE_URL}/technicians/profile`;
    if (role === "vendor") endpoint = `${API_BASE_URL}/vendors/profile`;

    try {
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const updatedUser = { ...user, ...formData };
        setUser(updatedUser);
        setEditMode(false);
        setUpdateStatus('success');

        const localData = JSON.parse(localStorage.getItem("userData") || "{}");
        localStorage.setItem("userData", JSON.stringify({ ...localData, ...formData }));
      } else {
        setUpdateStatus('error');
        setErrorMessage("Failed to update profile details.");
      }
    } catch (err) {
      setUpdateStatus('error');
      setErrorMessage("Network error. Please try again.");
    } finally {
      setTimeout(() => setUpdateStatus('idle'), 3000);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setUpdateStatus('error');
      setErrorMessage("Passwords do not match.");
      return;
    }

    setUpdateStatus('saving');
    const token = localStorage.getItem("access_token");

    try {
      const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });

      const data = await res.json();

      if (res.ok) {
        setUpdateStatus('success');
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setUpdateStatus('error');
        setErrorMessage(data.message || "Failed to change password.");
      }
    } catch (err) {
      setUpdateStatus('error');
      setErrorMessage("Network error.");
    } finally {
      setTimeout(() => setUpdateStatus('idle'), 3000);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    setUpdateStatus('saving');

    const fData = new FormData();
    fData.append("avatar", file);

    const token = localStorage.getItem("access_token");
    const role = user.role?.toLowerCase() || "user";

    let endpoint = `${API_BASE_URL}/users/upload-avatar`;
    if (role === "technician") endpoint = `${API_BASE_URL}/technicians/upload-avatar`;
    if (role === "vendor") endpoint = `${API_BASE_URL}/vendors/upload-avatar`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fData
      });

      if (res.ok) {
        const data = await res.json();
        const updatedUser = { ...user, avatar: data.url };
        setUser(updatedUser);
        setFormData(prev => ({ ...prev, avatar: data.url }));

        const localData = JSON.parse(localStorage.getItem("userData") || "{}");
        localStorage.setItem("userData", JSON.stringify({ ...localData, avatar: data.url }));

        setUpdateStatus('success');
      } else {
        setUpdateStatus('error');
      }
    } catch (err) {
      setUpdateStatus('error');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUpdateStatus('idle'), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("access_token");
    document.cookie = "userData=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/login");
  };

  if (loading) return (
    <div className="min-h-screen bg-[#05070a] flex items-center justify-center">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-600/20 blur-[60px] rounded-full animate-pulse" />
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin relative z-10" />
      </div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#05070a] text-white overflow-x-hidden font-sans">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

      {/* 🔹 Background Aura */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/5 rounded-full blur-[160px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* 🔹 Navigation Header (Standalone for Page) */}
      <header className="relative z-20 border-b border-white/5 bg-[#05070a]/80 backdrop-blur-3xl sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Zap className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tighter">ServiceHub</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-rose-400 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 py-12 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Profile Header Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mb-12"
          >
            <div className="bg-[#0f172a]/40 backdrop-blur-2xl border border-white/5 rounded-[3rem] p-10 md:p-14 flex flex-col md:flex-row items-center gap-10">

              {/* Avatar Section */}
              <div className="relative group">
                <div className="w-44 h-44 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/5 relative bg-white/[0.02]">
                  {user.avatar ? (
                    <img src={`${UPLOADS_BASE_URL}${user.avatar}`} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-600/20 to-indigo-600/20 flex items-center justify-center text-5xl font-black text-blue-400 uppercase">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-[#05070a]/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer text-white"
                  >
                    {isUploading ? <Loader2 className="w-8 h-8 animate-spin text-blue-400" /> : <Camera className="w-8 h-8 mb-2" />}
                    <span className="text-[10px] font-black uppercase tracking-widest">Update Photo</span>
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-2xl border-4 border-[#0a0c12] shadow-lg flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <h1 className="text-5xl font-black tracking-tighter text-white mb-2">{user.name}</h1>
                  <p className="text-slate-400 text-lg font-medium opacity-60 tracking-tight">{user.email}</p>
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <div className="bg-blue-600/10 border border-blue-500/20 text-blue-400 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em]">
                    {user.role} Verified
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                    <Calendar className="w-4 h-4" /> Joined {new Date(user.joined_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </div>
                </div>
              </div>

              <div className="hidden lg:block border-l border-white/5 pl-12 h-32 space-y-4">
                <div className="text-center">
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Account Secure</p>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto">
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* Sidebar Navigation */}
            <div className="lg:col-span-3">
              <div className="bg-[#0f172a]/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-4 space-y-2">
                {[
                  { id: "profile", label: "Profile Details", icon: UserCircle },
                  { id: "security", label: "Security & Password", icon: Lock },
                  { id: "account", label: "Account Activity", icon: Activity }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative group ${activeTab === tab.id
                        ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20"
                        : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
                      }`}
                  >
                    <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-white" : "text-slate-600 group-hover:text-slate-400"}`} />
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div layoutId="tab-pill" className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Display */}
            <div className="lg:col-span-9">
              <AnimatePresence mode="wait">
                {activeTab === "profile" && (
                  <motion.div
                    key="profile-tab"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="bg-[#0f172a]/40 backdrop-blur-2xl border border-white/5 rounded-[3rem] p-10 md:p-14 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                      <div>
                        <h2 className="text-3xl font-black text-white tracking-tighter mb-1">Personal Information</h2>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest opacity-60">Manage your core identity parameters</p>
                      </div>

                      {!editMode ? (
                        <button
                          onClick={() => setEditMode(true)}
                          className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/5 hover:bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all active:scale-[0.98]"
                        >
                          <Edit3 className="w-4 h-4 text-blue-400" /> Edit Profile
                        </button>
                      ) : (
                        <div className="flex gap-3">
                          <button
                            onClick={handleSave}
                            disabled={updateStatus === 'saving'}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-blue-600/20 active:scale-[0.98] transition-all flex items-center gap-2"
                          >
                            {updateStatus === 'saving' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Changes
                          </button>
                          <button
                            onClick={() => { setEditMode(false); setFormData(user); }}
                            className="bg-white/5 hover:bg-white/10 text-slate-400 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
                      <SimpleInput label="Full Name" value={formData.name} onChange={(v: string) => setFormData({ ...formData, name: v })} disabled={!editMode} icon={User} />
                      <SimpleInput label="Email Address" value={formData.email} disabled icon={Mail} />
                      <SimpleInput label="Phone Number" value={formData.phone} onChange={(v: string) => setFormData({ ...formData, phone: v })} disabled={!editMode} icon={Phone} placeholder="Primary communication channel" />
                      <SimpleInput label="User Role" value={user.role} disabled icon={Briefcase} />
                    </div>

                    {user.role?.toLowerCase() === 'technician' && (
                      <div className="mt-12 pt-12 border-t border-white/5">
                        <SimpleInput label="Skills & Expertise" value={formData.skills} onChange={(v: string) => setFormData({ ...formData, skills: v })} disabled={!editMode} icon={Zap} placeholder="React, Oracle Cloud, Azure infrastructure, etc." />
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "security" && (
                  <motion.div
                    key="security-tab"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="bg-[#0f172a]/40 backdrop-blur-2xl border border-white/5 rounded-[3rem] p-10 md:p-14"
                  >
                    <div className="mb-12">
                      <h2 className="text-3xl font-black text-white tracking-tighter mb-1 font-sans">Account Security</h2>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest opacity-60">Restore or update master terminal access</p>
                    </div>

                    <form onSubmit={handleChangePassword} className="max-w-xl space-y-10">
                      <div className="space-y-8">
                        <SimpleInput label="Current Password" type="password" value={oldPassword} onChange={setOldPassword} icon={Lock} placeholder="••••••••" />
                        <div className="h-px bg-white/5" />
                        <SimpleInput label="New Password" type="password" value={newPassword} onChange={setNewPassword} icon={Key} placeholder="••••••••" />
                        <SimpleInput label="Confirm New Password" type="password" value={confirmPassword} onChange={setConfirmPassword} icon={ShieldCheck} placeholder="••••••••" />
                      </div>

                      <button
                        type="submit"
                        disabled={updateStatus === 'saving' || !oldPassword || !newPassword}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white h-20 rounded-[1.5rem] font-black text-[12px] uppercase tracking-[0.4em] transition-all shadow-2xl shadow-blue-600/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4 group"
                      >
                        {updateStatus === 'saving' ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          <>
                            Synchronize New Password
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                          </>
                        )}
                      </button>
                    </form>
                  </motion.div>
                )}

                {activeTab === "account" && (
                  <motion.div
                    key="account-tab"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="bg-[#0f172a]/40 backdrop-blur-2xl border border-white/5 rounded-[3rem] p-10 md:p-14"
                  >
                    <div className="mb-12">
                      <h2 className="text-3xl font-black text-white tracking-tighter mb-1">Account Activity</h2>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest opacity-60">Log of infrastructure interactions</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ActivityCard label="Account Verification" value={new Date(user.joined_at || Date.now()).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })} icon={Calendar} sub="Activation Date" />
                      <ActivityCard label="System Status" value={user.status || 'Active'} icon={CheckCircle2} sub="Current Health" color="text-emerald-400" />
                      <ActivityCard label="Master Identification" value={`TER-${user.id}${user.role?.charAt(0).toUpperCase()}`} icon={Zap} sub="Node ID" color="text-blue-400" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* 🔹 Professional Toast Notification */}
      <AnimatePresence>
        {updateStatus !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: -50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 50, x: -50 }}
            className={`fixed bottom-10 left-10 z-50 px-8 py-5 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex items-center gap-5 border ${updateStatus === 'success' ? 'bg-[#061c15] border-emerald-500/30 text-emerald-400' :
                updateStatus === 'error' ? 'bg-[#1c0606] border-rose-500/30 text-rose-400' :
                  'bg-blue-600 text-white border-blue-400/30'
              }`}
          >
            <div className={`p-2 rounded-xl ${updateStatus === 'saving' ? 'bg-white/10' : 'bg-white/5'}`}>
              {updateStatus === 'saving' && <Loader2 className="w-5 h-5 animate-spin" />}
              {updateStatus === 'success' && <CheckCircle2 className="w-5 h-5" />}
              {updateStatus === 'error' && <AlertCircle className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-0.5 opacity-60">System Message</p>
              <p className="text-xs font-black uppercase tracking-widest">
                {updateStatus === 'saving' && "Processing Data..."}
                {updateStatus === 'success' && "Update Synchronized"}
                {updateStatus === 'error' && (errorMessage || "Communication Error")}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SimpleInput({ label, value, onChange, disabled, icon: Icon, type = "text", placeholder }: any) {
  return (
    <div className="space-y-4">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">{label}</label>
      <div className="relative group">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors">
          <Icon className="w-5 h-5" />
        </div>
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full h-18 py-5 pl-16 pr-6 bg-[#ebf2ff] border-none rounded-[1.5rem] text-sm font-bold text-slate-900 placeholder:text-slate-400 transition-all outline-none shadow-sm focus:ring-4 focus:ring-blue-600/20 ${disabled ? 'opacity-70 cursor-not-allowed grayscale-[0.5]' : 'hover:scale-[1.01]'}`}
        />
      </div>
    </div>
  );
}

function ActivityCard({ label, value, icon: Icon, sub, color = "text-white" }: any) {
  return (
    <div className="bg-white/5 border border-white/5 p-8 rounded-[2rem] hover:bg-white/[0.08] transition-all group">
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6 text-slate-400 group-hover:text-blue-400" />
        </div>
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">{sub}</span>
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">{label}</p>
      <p className={`text-2xl font-black tracking-tight ${color}`}>{value}</p>
    </div>
  );
}
