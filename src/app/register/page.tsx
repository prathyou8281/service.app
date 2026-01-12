"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Phone,
  Mail,
  Lock,
} from "lucide-react";

const API_BASE_URL = "http://localhost:4000/api";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("⚠️ Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "❌ Registration failed");
        setLoading(false);
        return;
      }

      alert("✅ Registration successful! Please login.");
      router.push("/login");
    } catch (err) {
      console.error("Register error:", err);
      setError("⚠️ Server error, please try again later.");
      setLoading(false);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[var(--soft-gradient)] text-[var(--foreground)] transition-colors duration-500">
      <AnimatePresence>
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, y: -30 }}
          className="card relative z-10 shadow-2xl p-10 sm:p-16 max-w-2xl w-[90%]"
        >
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <h2 className="text-4xl font-extrabold mb-6 text-center">
              Register as <span className="text-[var(--accent)]">User</span>
            </h2>

            {error && (
              <div className="bg-red-500 text-white text-sm font-medium px-4 py-2 rounded-md mb-4 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="flex items-center gap-3 bg-[var(--card-bg)] rounded-xl p-3 border border-[var(--accent)]/20">
                <User className="text-[var(--accent)] w-5 h-5" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-transparent flex-1 outline-none placeholder-gray-400"
                  disabled={loading}
                  required
                />
              </div>

              {/* Email */}
              <div className="flex items-center gap-3 bg-[var(--card-bg)] rounded-xl p-3 border border-[var(--accent)]/20">
                <Mail className="text-[var(--accent)] w-5 h-5" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent flex-1 outline-none placeholder-gray-400"
                  disabled={loading}
                  required
                />
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3 bg-[var(--card-bg)] rounded-xl p-3 border border-[var(--accent)]/20">
                <Phone className="text-[var(--accent)] w-5 h-5" />
                <input
                  type="tel"
                  placeholder="Phone Number (optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-transparent flex-1 outline-none placeholder-gray-400"
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div className="flex items-center gap-3 bg-[var(--card-bg)] rounded-xl p-3 border border-[var(--accent)]/20">
                <Lock className="text-[var(--accent)] w-5 h-5" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent flex-1 outline-none placeholder-gray-400"
                  disabled={loading}
                  required
                  minLength={6}
                />
              </div>

              {/* Submit */}
              <div className="col-span-2 mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full btn-primary py-4 rounded-xl text-lg font-semibold ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Registering..." : "Register"}
                </button>
              </div>
            </form>

            <p className="text-center text-sm mt-6 opacity-80">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[var(--accent)] hover:text-[var(--accent-hover)] underline-offset-2 hover:underline"
              >
                Login
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
