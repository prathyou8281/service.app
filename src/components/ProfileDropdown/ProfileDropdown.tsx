"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface UserData {
  id: number;
  username: string;
  email: string;
  role?: string;
  profilePhoto?: string;
}

export default function ProfileDropdown() {
  const [user, setUser] = useState<UserData | null>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // ✅ Fetch user info safely from backend
  useEffect(() => {
    const stored = localStorage.getItem("userData");
    if (!stored) return;

    const parsed = JSON.parse(stored);

    fetch(`/api/auth/get-profile?id=${parsed.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUser({
            id: data.user.id,
            username: data.user.username || "User",
            email: data.user.email,
            role: data.user.role || "Member",
            profilePhoto: data.user.profilePhoto || "",
          });
        } else {
          setUser(parsed);
        }
      })
      .catch(() => setUser(parsed));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("userEmail");
    router.push("/user/login");
  };

  const displayName = user?.username || "Guest";
  const avatarSrc =
    user?.profilePhoto && user.profilePhoto.trim() !== ""
      ? user.profilePhoto
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          displayName
        )}&background=00bcd4&color=ffffff&size=128&bold=true`;

  return (
    <div
      className="relative group"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* 🔹 Button — profile circle + name */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-4 bg-white/90 backdrop-blur-md px-5 py-3 rounded-full shadow-lg border border-white/40 hover:shadow-[0_0_25px_rgba(0,0,0,0.15)] transition-all"
      >
        <motion.img
          src={avatarSrc}
          alt="Profile"
          whileHover={{ rotate: 6 }}
          transition={{ type: "spring", stiffness: 250 }}
          className="w-12 h-12 rounded-full border-2 border-[var(--accent)] object-cover shadow-md"
        />

        <div className="flex flex-col text-left leading-tight pr-2">
          <span className="text-base font-semibold text-gray-900">
            {displayName}
          </span>
          <span className="text-xs text-[var(--accent-hover)] font-medium">
            {(user?.role || "member").toLowerCase()}
          </span>
        </div>
      </motion.button>

      {/* 🔹 Dropdown Section */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute right-0 mt-4 w-80 bg-white/95 backdrop-blur-2xl shadow-2xl border border-white/40 rounded-2xl p-5 z-50"
          >
            {/* Header: User Info */}
            <div className="flex items-center gap-4 pb-3 mb-3 border-b border-gray-200">
              <img
                src={avatarSrc}
                alt="User"
                className="w-14 h-14 rounded-full object-cover border-2 border-[var(--accent)] shadow-md"
              />
              <div>
                <p className="text-base font-semibold text-gray-900">
                  {displayName}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </div>

            {/* Menu Items */}
            <ul className="space-y-2 text-sm">
              <motion.li whileHover={{ x: 5 }}>
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] transition-all font-medium"
                >
                  <User className="w-5 h-5 text-[var(--accent)]" />
                  Profile
                </Link>
              </motion.li>

              <motion.li whileHover={{ x: 5 }}>
                <Link
                  href="/settings"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] transition-all font-medium"
                >
                  <Settings className="w-5 h-5 text-[var(--accent)]" />
                  Settings
                </Link>
              </motion.li>

              <motion.li whileHover={{ x: 5 }}>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-lg hover:bg-red-100 transition-all text-red-600 font-medium"
                >
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </motion.li>
            </ul>

            {/* Accent Glow Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 rounded-b-2xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
