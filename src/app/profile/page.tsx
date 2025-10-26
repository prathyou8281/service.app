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
  Building,
  Globe,
  Hash,
  Plus,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Address {
  id: number;
  address: string;
  city: string;
  state: string;
  country: string;
  pin_code: string;
}

interface UserData {
  id: number;
  username: string;
  email: string;
  phone: string;
  role: string;
  joined: string;
  addresses?: Address[];
  shopName?: string;
  shopLocation?: string;
  skill?: string;
  experience?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [editingField, setEditingField] = useState<keyof UserData | null>(null);
  const [tempValue, setTempValue] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pin_code: "",
  });
  const router = useRouter();

  // ✅ Fetch user
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
        if (data.success) setUser(data.user);
      })
      .catch((err) => console.error("Profile fetch error:", err));
  }, [router]);

  const initials = user?.username?.[0]?.toUpperCase() || "U";

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
          name: updatedUser.username,
          phone: updatedUser.phone,
          address: updatedUser.address,
          city: updatedUser.city,
          state: updatedUser.state,
          country: updatedUser.country,
          pin_code: updatedUser.pin_code,
        }),
      });
      const data = await res.json();
      if (data.success)
        localStorage.setItem("userData", JSON.stringify(updatedUser));
      else alert("❌ " + data.message);
    } catch {
      alert("❌ Failed to update profile.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    router.push("/user/login");
  };

  const handleAddAddress = async () => {
    if (!user) return;
    const res = await fetch("/api/auth/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, ...newAddress }),
    });
    const data = await res.json();
    if (data.success) {
      setShowAddModal(false);
      setNewAddress({
        address: "",
        city: "",
        state: "",
        country: "",
        pin_code: "",
      });
      const refreshed = await fetch(`/api/auth/get-profile?id=${user.id}`).then(
        (r) => r.json()
      );
      if (refreshed.success) setUser(refreshed.user);
    } else alert("❌ " + data.message);
  };

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen text-lg text-[var(--foreground)]">
        Loading your profile...
      </div>
    );

  const sections = [
    {
      title: "Personal Details",
      fields: [
        { icon: <User />, label: "Full Name", key: "username" },
        { icon: <Mail />, label: "Email", key: "email" },
        { icon: <Phone />, label: "Phone", key: "phone" },
      ],
    },
    {
      title: "Address Info",
      custom: true,
    },
    {
      title: "Account Details",
      fields: [
        { icon: <Shield />, label: "Role", key: "role" },
        { icon: <Calendar />, label: "Joined", key: "joined" },
      ],
    },
    ...(user.role === "Vendor"
      ? [
          {
            title: "Vendor Info",
            fields: [
              { icon: <Briefcase />, label: "Shop Name", key: "shopName" },
              { icon: <MapPin />, label: "Shop Location", key: "shopLocation" },
            ],
          },
        ]
      : []),
    ...(user.role === "Technician"
      ? [
          {
            title: "Technician Info",
            fields: [
              { icon: <User />, label: "Skill", key: "skill" },
              { icon: <Calendar />, label: "Experience", key: "experience" },
            ],
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-all">
      {/* HEADER */}
      <header className="text-center py-16 bg-[var(--accent)] text-white shadow-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center text-4xl font-bold border-4 border-white shadow-xl">
            {initials}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {user.username}
          </h1>
          <p className="text-white/80">{user.email}</p>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => alert("💡 Click any field below to edit directly.")}
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
            >
              <Edit className="h-4 w-4" /> Edit
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-red-500/80 hover:bg-red-600 transition-all"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </motion.div>
      </header>

      {/* GRID */}
      <motion.section
        className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        {sections.map((section, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm hover:shadow-lg transition-all"
          >
            <h3 className="text-lg font-semibold mb-4 text-[var(--accent)] uppercase tracking-wide">
              {section.title}
            </h3>

            {section.custom ? (
              <>
                {user.addresses && user.addresses.length > 0 ? (
                  <div className="space-y-4">
                    {user.addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className="border border-[var(--border)] rounded-xl p-4 bg-[var(--muted)]/10 hover:bg-[var(--muted)]/20 transition"
                      >
                        <p className="font-semibold text-[var(--foreground)]">
                          {addr.address}
                        </p>
                        <p className="text-sm opacity-70">
                          {addr.city}, {addr.state}, {addr.country} –{" "}
                          {addr.pin_code}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm opacity-60">
                    No addresses added yet.
                  </p>
                )}

                <button
                  onClick={() => setShowAddModal(true)}
                  className="w-full mt-5 border-2 border-dashed border-[var(--accent)]/50 rounded-xl py-3 text-[var(--accent)] hover:bg-[var(--accent)]/10 transition flex items-center justify-center gap-2 font-medium"
                >
                  <Plus className="w-5 h-5" /> Add Address
                </button>
              </>
            ) : (
              <div className="space-y-3">
                {section.fields?.map((item) => (
                  <div key={item.key} className="flex items-center gap-3">
                    <div className="text-[var(--accent)]">{item.icon}</div>
                    {editingField === item.key ? (
                      <div className="flex items-center gap-2 w-full">
                        <input
                          value={tempValue}
                          onChange={handleInputChange}
                          className="flex-1 px-3 py-1 rounded-lg bg-[var(--muted)]/20 border border-[var(--border)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--accent)] outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => saveField(item.key as keyof UserData)}
                          className="bg-[var(--accent)] hover:opacity-90 p-1.5 rounded-lg text-white"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() =>
                          !["email", "role", "joined"].includes(item.key)
                            ? startEditing(item.key as keyof UserData)
                            : undefined
                        }
                        className={`flex-1 cursor-pointer ${
                          ["email", "role", "joined"].includes(item.key)
                            ? "cursor-default opacity-60"
                            : "hover:text-[var(--accent)]"
                        }`}
                      >
                        <p className="text-sm opacity-60">{item.label}</p>
                        <p className="font-semibold truncate">
                          {user[item.key as keyof UserData] || "—"}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </motion.section>

      {/* ADD ADDRESS MODAL */}
      {showAddModal && (
        <motion.div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-[var(--card)] text-[var(--foreground)] p-6 rounded-2xl w-full max-w-md shadow-2xl relative border border-[var(--accent)]/20"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-3 right-3 text-[var(--muted-foreground)] hover:text-[var(--accent)]"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold mb-4 text-center text-[var(--accent)]">
              Add New Address
            </h2>
            {["address", "city", "state", "country", "pin_code"].map((key) => (
              <input
                key={key}
                placeholder={key.toUpperCase()}
                value={(newAddress as any)[key]}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, [key]: e.target.value })
                }
                className="w-full border border-[var(--border)] rounded-lg p-2 mb-3 bg-[var(--muted)]/10 text-[var(--foreground)] focus:ring-2 focus:ring-[var(--accent)] outline-none"
              />
            ))}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-[var(--muted)]/20 text-[var(--foreground)] rounded-lg hover:bg-[var(--muted)]/30"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAddress}
                className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)]"
              >
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
