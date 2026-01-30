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
  Shield
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
    </div>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

      {/* Top Header Section */}
      <div className="bg-white border-b border-slate-200 pt-12 pb-24 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg border-4 border-white">
              {user.avatar ? (
                <img src={`${UPLOADS_BASE_URL}${user.avatar}`} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600 uppercase">
                  {user.name.charAt(0)}
                </div>
              )}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white"
              >
                {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Camera className="w-6 h-6" />}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white" />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-1">{user.name}</h1>
            <p className="text-slate-500 font-medium mb-4">{user.email}</p>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {user.role}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 lg:px-12 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 space-y-1">
              {[
                { id: "profile", label: "Profile Details", icon: User },
                { id: "security", label: "Security & Password", icon: Shield },
                { id: "account", label: "Account Activity", icon: Calendar }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === "profile" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8"
                >
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
                    {!editMode ? (
                      <button onClick={() => setEditMode(true)} className="btn-secondary py-2 px-4 flex items-center gap-2 text-xs">
                        <Edit3 className="w-4 h-4" /> Edit Profile
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-blue-200 active:scale-95 transition-all">
                          Save Changes
                        </button>
                        <button onClick={() => { setEditMode(false); setFormData(user); }} className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all">
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <SimpleInput label="Full Name" value={formData.name} onChange={(v: string) => setFormData({ ...formData, name: v })} disabled={!editMode} icon={User} />
                    <SimpleInput label="Email Address" value={formData.email} disabled icon={Mail} />
                    <SimpleInput label="Phone Number" value={formData.phone} onChange={(v: string) => setFormData({ ...formData, phone: v })} disabled={!editMode} icon={Phone} placeholder="+91 00000 00000" />
                    <SimpleInput label="User Role" value={user.role} disabled icon={Briefcase} />
                  </div>

                  {user.role?.toLowerCase() === 'technician' && (
                    <div className="mt-8 pt-8 border-t border-slate-100">
                      <SimpleInput label="Skills & Expertise" value={formData.skills} onChange={(v: string) => setFormData({ ...formData, skills: v })} disabled={!editMode} icon={Key} placeholder="React, Node.js, etc." />
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "security" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8"
                >
                  <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                    <Lock className="w-5 h-5 text-blue-600" /> Account Security
                  </h2>

                  <form onSubmit={handleChangePassword} className="max-w-md space-y-6">
                    <div className="space-y-4">
                      <SimpleInput label="Current Password" type="password" value={oldPassword} onChange={setOldPassword} icon={Lock} placeholder="••••••••" />
                      <SimpleInput label="New Password" type="password" value={newPassword} onChange={setNewPassword} icon={Key} placeholder="••••••••" />
                      <SimpleInput label="Confirm New Password" type="password" value={confirmPassword} onChange={setConfirmPassword} icon={ShieldCheck} placeholder="••••••••" />
                    </div>
                    <button
                      type="submit"
                      disabled={updateStatus === 'saving' || !oldPassword || !newPassword}
                      className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {updateStatus === 'saving' ? "Updating Password..." : "Update Password"}
                    </button>
                  </form>
                </motion.div>
              )}

              {activeTab === "account" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8"
                >
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Account Activity</h2>
                  <div className="space-y-4">
                    <ActivityRow label="Account Created" value={new Date(user.joined_at || Date.now()).toLocaleDateString()} />
                    <ActivityRow label="Status" value={user.status || 'Active'} color="text-emerald-600" />
                    <ActivityRow label="System ID" value={`MOD-${user.id}${user.role?.charAt(0)}`} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {updateStatus !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-8 right-8 px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4 border ${updateStatus === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
              updateStatus === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
                'bg-blue-600 text-white border-transparent'
              }`}
          >
            {updateStatus === 'saving' && <Loader2 className="w-5 h-5 animate-spin" />}
            {updateStatus === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            {updateStatus === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
            <p className="text-sm font-bold">
              {updateStatus === 'saving' && "Saving..."}
              {updateStatus === 'success' && "Updation Successful"}
              {updateStatus === 'error' && (errorMessage || "Something went wrong")}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SimpleInput({ label, value, onChange, disabled, icon: Icon, type = "text", placeholder }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <Icon className="w-4 h-4" />
        </div>
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none ${disabled ? 'opacity-70 cursor-not-allowed' : 'hover:border-slate-300'}`}
        />
      </div>
    </div>
  );
}

function ActivityRow({ label, value, color = "text-slate-900" }: any) {
  return (
    <div className="flex justify-between items-center py-4 border-b border-slate-50 last:border-0">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <span className={`text-sm font-bold ${color}`}>{value}</span>
    </div>
  );
}
