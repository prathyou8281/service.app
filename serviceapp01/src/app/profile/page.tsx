
"use client";

import { useEffect, useState, ChangeEvent } from "react";
import {
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  Edit,
  Save,
  X,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface UserData {
  id: number;
  username: string;
  email: string;
  phone: string;
  role: string;
  joined: string;
}

export default function ProfilePage() {



  const [user, setUser] = useState<UserData | null>(null);
  const [form, setForm] = useState<UserData | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Load user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("userData");
    if (!stored) {
      router.push("/login");
      return;
    }

    const parsed = JSON.parse(stored);

    const data: UserData = {
      id: parsed.id,
      username: parsed.name || "User",
      email: parsed.email,
      phone: parsed.phone || "",
      role: parsed.role || "User",
      joined: new Date().toLocaleDateString(),
    };

    setUser(data);
    setForm(data);
  }, [router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!form) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ FINAL SAVE FUNCTION (BACKEND + UI + LOCALSTORAGE)
  const handleSave = async () => {
    if (!form) return;

    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: form.id,              // REQUIRED by DTO
          name: form.username,      // maps to DB column `name`
          phone: form.phone,
        }),
      });

      const responseText = await res.text();

      if (!res.ok) {
        console.error("Backend error:", responseText);
        throw new Error(responseText);
      }

      // Update UI
      setUser(form);
      setEditMode(false);

      // Sync localStorage
      localStorage.setItem(
        "userData",
        JSON.stringify({
          id: form.id,
          name: form.username,
          email: form.email,
          phone: form.phone,
          role: form.role,
        })
      );
    } catch (error) {
      console.error(error);
      alert("❌ Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm(user);
    setEditMode(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    router.push("/login");
  };

  if (!user || !form) {
    return (
      <div className="flex items-center justify-center min-h-screen text-muted-foreground">
        Loading profile…
      </div>
    );
  }

  const initials = user.username.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HEADER */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 h-64 bg-muted/50" />

        <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-12">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center ring-8 ring-background">
              <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-4xl font-bold">
                {initials}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-3xl font-semibold">{user.username}</h1>
              <p className="text-muted-foreground mt-1">{user.email}</p>

              <div className="flex gap-2 mt-4 justify-center lg:justify-start">
                <span className="px-3 py-1 rounded-full text-sm bg-accent">
                  {user.role}
                </span>
                <span className="text-sm text-muted-foreground">
                  Member since {user.joined}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => router.push("/welcome")}
                className="px-4 py-2 rounded-md border border-border hover:bg-accent"
              >
                ← Back
              </button>

              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground"
                >
                  <Edit size={16} /> Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-green-600 text-white disabled:opacity-60"
                  >
                    <Save size={16} />
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 rounded-md border border-border"
                  >
                    <X size={16} /> Cancel
                  </button>
                </>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-destructive text-destructive-foreground"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DETAILS */}
      <div className="max-w-7xl mx-auto px-6 -mt-14 pb-20">
        <div className="bg-card border border-border rounded-2xl shadow-md p-10">
          <h2 className="text-xl font-semibold mb-8">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { label: "Full Name", name: "username", icon: User },
              { label: "Email Address", name: "email", icon: Mail, disabled: true },
              { label: "Phone Number", name: "phone", icon: Phone },
              { label: "Role", name: "role", icon: Shield, disabled: true },
              { label: "Joined Date", name: "joined", icon: Calendar, disabled: true },
            ].map(({ label, name, icon: Icon, disabled }) => (
              <div
                key={name}
                className="rounded-xl border border-border p-5"
              >
                <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Icon size={16} />
                  {label}
                </label>

                <input
                  name={name}
                  value={(form as any)[name] || ""}
                  onChange={handleChange}
                  disabled={!editMode || disabled}
                  className="w-full rounded-md bg-background px-3 py-2 border border-border text-sm focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
