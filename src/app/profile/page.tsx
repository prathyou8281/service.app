"use client";

import { useEffect, useState, ChangeEvent } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  LogOut,
  Edit,
  Shield,
  Calendar,
  Check,
  Briefcase,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface UserData {
  id: number;
  username: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  joined: string;
  shopName?: string;
  shopLocation?: string;
  skill?: string;
  experience?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [editingField, setEditingField] = useState<keyof UserData | null>(null);
  const [tempValue, setTempValue] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("userData");
    if (!stored) {
      router.push("/user/login");
      return;
    }

    const parsed = JSON.parse(stored);
    fetch(`/api/auth/get-profile?id=${parsed.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.user);
        }
      })
      .catch((err) => console.error("Profile fetch error:", err));
  }, [router]);

  const initials = user?.username ? user.username[0].toUpperCase() : "U";

  const startEditing = (key: keyof UserData) => {
    if (!user) return;
    setEditingField(key);
    setTempValue(String(user[key] ?? ""));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    setTempValue(e.target.value);

  const saveField = async (key: keyof UserData) => {
    if (!user) return;
    const updatedUser = { ...user, [key]: tempValue };
    setUser(updatedUser);
    setEditingField(null);

    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          username: updatedUser.username,
          phone: updatedUser.phone,
          address: updatedUser.address,
          shopName: updatedUser.shopName,
          shopLocation: updatedUser.shopLocation,
          skill: updatedUser.skill,
          experience: updatedUser.experience,
        }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("userData", JSON.stringify(updatedUser));
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error("Profile update error:", err);
      alert("❌ Failed to update profile.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    router.push("/user/login");
  };

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen text-[var(--foreground)] text-lg">
        Loading your profile...
      </div>
    );

  // ✨ Field configuration
  const commonFields = [
    { icon: <User className="h-5 w-5 text-[var(--accent)]" />, label: "Full Name", key: "username" as const },
    { icon: <Mail className="h-5 w-5 text-[var(--accent)]" />, label: "Email", key: "email" as const },
    { icon: <Phone className="h-5 w-5 text-[var(--accent)]" />, label: "Phone", key: "phone" as const },
    { icon: <MapPin className="h-5 w-5 text-[var(--accent)]" />, label: "Address", key: "address" as const },
    { icon: <Shield className="h-5 w-5 text-[var(--accent)]" />, label: "Role", key: "role" as const },
    { icon: <Calendar className="h-5 w-5 text-[var(--accent)]" />, label: "Joined", key: "joined" as const },
  ];

  const vendorFields =
    user.role === "Vendor"
      ? [
          { icon: <Briefcase className="h-5 w-5 text-[var(--accent)]" />, label: "Shop Name", key: "shopName" as const },
          { icon: <MapPin className="h-5 w-5 text-[var(--accent)]" />, label: "Shop Location", key: "shopLocation" as const },
        ]
      : [];

  const technicianFields =
    user.role === "Technician"
      ? [
          { icon: <User className="h-5 w-5 text-[var(--accent)]" />, label: "Skill", key: "skill" as const },
          { icon: <Calendar className="h-5 w-5 text-[var(--accent)]" />, label: "Experience", key: "experience" as const },
        ]
      : [];

  const allFields = [...commonFields, ...vendorFields, ...technicianFields];

  return (
    <div className="min-h-screen w-full bg-[var(--background)] text-[var(--foreground)] transition-all">
      {/* 🔹 Top Header */}
      <header className="relative flex flex-col items-center text-center py-12 bg-gradient-to-br from-[var(--accent)]/40 to-[var(--accent-hover)]/20 backdrop-blur-md border-b border-white/10 shadow-lg">
        <div className="relative w-32 h-32 mb-5">
          <div className="absolute inset-0 rounded-full bg-[var(--accent)] blur-lg opacity-70 animate-pulse"></div>
          <div className="relative flex items-center justify-center w-32 h-32 rounded-full bg-[var(--accent)] border-4 border-white shadow-lg text-4xl font-bold">
            {initials}
          </div>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          {user.username}
        </h1>
        <p className="text-gray-200 mt-1">{user.email}</p>

        <div className="flex gap-4 mt-6">
          <button
            onClick={() => alert("💡 Click on any editable field below to modify.")}
            className="flex items-center gap-2 px-5 py-2 bg-[var(--accent)]/20 border border-[var(--accent)]/40 hover:bg-[var(--accent)]/30 rounded-lg text-sm font-medium transition-all"
          >
            <Edit className="h-4 w-4" /> Edit Profile
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2 bg-red-500/80 hover:bg-red-600 rounded-lg text-sm font-medium transition-all"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </header>

      {/* 🔹 Profile Info Card */}
      <section className="max-w-4xl mx-auto mt-10 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-10 shadow-xl">
        <h2 className="text-2xl font-semibold mb-8 border-b border-white/20 pb-3 text-center">
          Profile Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm md:text-base">
          {allFields.map((item) => (
            <div
              key={item.key}
              className="flex items-center gap-3 group hover:bg-white/5 rounded-lg px-3 py-2 transition-all"
            >
              {item.icon}
              {editingField === item.key ? (
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="text"
                    value={tempValue}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-1.5 rounded-md bg-white/10 border border-white/30 text-white focus:ring-2 focus:ring-[var(--accent)] outline-none transition"
                    autoFocus
                  />
                  <button
                    onClick={() => saveField(item.key)}
                    className="bg-green-500 hover:bg-green-600 text-white p-1.5 rounded-md transition"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() =>
                    !["email", "role", "joined"].includes(item.key)
                      ? startEditing(item.key)
                      : undefined
                  }
                  className={`flex-1 cursor-pointer ${
                    ["email", "role", "joined"].includes(item.key)
                      ? "cursor-default text-gray-400"
                      : "hover:text-white"
                  }`}
                >
                  <span className="block text-sm opacity-70">
                    {item.label}
                  </span>
                  <span className="font-semibold text-[var(--foreground)]">
                    {user[item.key] || "—"}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 🔹 Footer */}
      <footer className="text-center text-sm text-gray-400 mt-16 pb-8">
        © {new Date().getFullYear()} <span className="text-[var(--accent)] font-medium">ServiceApp</span> | Designed with ❤️ in Kannur
      </footer>
    </div>
  );
}
