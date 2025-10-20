"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { User, Settings, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ProfileDropdownProps = {
  user: { username: string; email: string; role: string } | null;
};

export default function ProfileDropdown({ user }: ProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 400);
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    window.location.href = "/login"; // or use router.push if inside a page
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-md hover:shadow-lg transition">
        <div className="relative">
          <img
            src="/images/avatar.png"
            alt="user avatar"
            className="w-10 h-10 rounded-full border-2 border-[var(--foreground)]"
          />
          <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 border-2 border-white"></span>
        </div>
        <div className="flex flex-col items-start hidden sm:flex">
          <span className="text-sm font-semibold text-[var(--foreground)] lowercase">
            {user?.username || "guest"}
          </span>
          <span className="text-xs text-[var(--foreground)] lowercase">
            {user?.role || "member"}
          </span>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-52 rounded-xl bg-white shadow-xl ring-1 ring-black/10 text-[var(--foreground)] lowercase"
          >
            <div className="px-4 py-3 border-b border-gray-200">
              <p className="text-sm font-semibold">{user?.username || "guest"}</p>
              <p className="text-xs text-gray-500">{user?.email || "guest@example.com"}</p>
            </div>

            <Link
              href="/profile"
              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[var(--accent-hover)]"
            >
              <User className="w-4 h-4 text-[var(--accent)]" />
              profile
            </Link>

            <Link
              href="/settings"
              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[var(--accent-hover)]"
            >
              <Settings className="w-4 h-4 text-[var(--accent)]" />
              settings
            </Link>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-red-500/20"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
