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
} from "lucide-react";
import { useRouter } from "next/navigation";

// ✅ Define user data structure
interface UserData {
  id: number;
  username: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  joined: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [editingField, setEditingField] = useState<keyof UserData | null>(null);
  const [tempValue, setTempValue] = useState<string>("");
  const router = useRouter();

  // ✅ Fetch user from DB if logged in
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
        } else {
          console.error("Failed to fetch user data");
        }
      })
      .catch((err) => console.error("Profile fetch error:", err));
  }, [router]);

  const initials = user?.username ? user.username[0].toUpperCase() : "G";

  // ✅ Begin editing a field
  const startEditing = (key: keyof UserData) => {
    if (!user) return;
    setEditingField(key);
    setTempValue(String(user[key] ?? "")); // ✅ fixed TypeScript type issue
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    setTempValue(e.target.value);

  // ✅ Save field changes
  const saveField = async (key: keyof UserData) => {
    if (!user) return;

    const updated = { ...user, [key]: tempValue };
    setUser(updated);
    setEditingField(null);

    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, [key]: tempValue }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("userData", JSON.stringify(updated));
      } else {
        alert("❌ Failed to update profile field.");
      }
    } catch (err) {
      console.error("🚨 Profile update error:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    router.push("/user/login");
  };

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen text-white text-lg">
        Loading your profile...
      </div>
    );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 text-white">
      {/* 🔹 Header Section */}
      <div className="relative bg-black/30 backdrop-blur-md p-10 flex flex-col items-center border-b border-white/10 shadow-xl">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 animate-spin-slow blur-md opacity-70"></div>
          <div className="relative w-32 h-32 flex items-center justify-center rounded-full bg-gradient-to-r from-pink-400 to-indigo-400 border-4 border-white shadow-lg text-4xl font-bold">
            {initials}
          </div>
        </div>

        <h1 className="mt-5 text-3xl font-bold tracking-wide">
          {user.username}
        </h1>
        <p className="text-gray-200 mt-1">{user.email}</p>

        <div className="flex gap-4 mt-6">
          <button
            onClick={() =>
              alert("💡 Click any editable field below to change it.")
            }
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-5 py-2 rounded-lg shadow transition-all"
          >
            <Edit className="h-4 w-4" /> Edit Profile
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 px-5 py-2 rounded-lg shadow transition-all"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </div>

      {/* 🔹 Profile Info Section */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-10 mx-6 sm:mx-16 mt-10 shadow-xl">
        <h2 className="text-2xl font-semibold mb-8 border-b border-white/20 pb-2">
          Profile Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-200 text-base">
          {(
            [
              { icon: <User className="h-5 w-5 text-pink-400" />, label: "Full Name", key: "username" as const },
              { icon: <Mail className="h-5 w-5 text-blue-400" />, label: "Email", key: "email" as const },
              { icon: <Phone className="h-5 w-5 text-green-400" />, label: "Phone", key: "phone" as const },
              { icon: <MapPin className="h-5 w-5 text-yellow-400" />, label: "Address", key: "address" as const },
              { icon: <Shield className="h-5 w-5 text-indigo-400" />, label: "Role", key: "role" as const },
              { icon: <Calendar className="h-5 w-5 text-purple-400" />, label: "Joined", key: "joined" as const },
            ] as const
          ).map((item) => (
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
                    className="bg-white/10 text-white border border-white/20 rounded px-2 py-1 flex-1 outline-none focus:border-white/50"
                    autoFocus
                  />
                  <button
                    onClick={() => saveField(item.key)}
                    className="bg-green-500 hover:bg-green-600 text-white rounded-full p-1"
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
                      ? "cursor-default"
                      : "hover:text-white/90"
                  }`}
                  title={
                    ["email", "role", "joined"].includes(item.key)
                      ? ""
                      : "Click to edit"
                  }
                >
                  <strong>{item.label}:</strong>{" "}
                  <span className="text-gray-300">{user[item.key]}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 🔹 Footer */}
      <footer className="text-center text-sm text-gray-300 mt-16 pb-8">
        © {new Date().getFullYear()} ServiceApp | Designed with ❤️ in Kannur
      </footer>

      <style jsx>{`
        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 6s linear infinite;
        }
      `}</style>
    </div>
  );
}
