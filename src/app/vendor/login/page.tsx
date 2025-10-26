"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Store } from "lucide-react";

export default function VendorLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const router = useRouter();

  // ✅ Auto-redirect if vendor already logged in
  useEffect(() => {
    const vendorEmail = localStorage.getItem("vendorEmail");
    if (vendorEmail && vendorEmail.includes("@")) {
      router.replace("/vendor/dashboard");
    } else {
      setCheckingSession(false);
    }
  }, [router]);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      alert("⚠️ Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      // 🧩 Clear any previous vendor session
      localStorage.removeItem("vendorEmail");
      localStorage.removeItem("vendorName");

      const res = await fetch("/api/auth/vendor/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "❌ Invalid credentials");
        return;
      }

      // ✅ Store vendor session info
      localStorage.setItem("vendorEmail", data.vendor.email);
      localStorage.setItem("vendorName", data.vendor.name || "Vendor");

      alert("✅ Login successful!");
      router.replace("/vendor/dashboard"); // smooth redirect
    } catch (err) {
      console.error("Vendor Login Error →", err);
      alert("⚠️ Something went wrong while logging in.");
    } finally {
      setLoading(false);
    }
  };

  // 🕐 Show loader if still checking session
  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[var(--foreground)]">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* 🔹 Left Side Quote */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden md:flex flex-col justify-center items-center w-1/2 bg-[var(--accent)]/90 text-white p-12 text-center"
      >
        <h1 className="text-4xl font-extrabold mb-4">
          “Build. Connect. Grow.”
        </h1>
        <p className="text-lg opacity-90 max-w-md leading-relaxed">
          Join our platform and expand your reach — <br />
          manage your store, track sales, and connect with thousands of
          customers across India.
        </p>
      </motion.div>

      {/* 🔹 Right Side Login Form */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col justify-center items-center w-full md:w-1/2 bg-[var(--soft-gradient)] text-[var(--foreground)] p-10 sm:p-16"
      >
        <div className="card w-full max-w-md shadow-xl p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--accent)]/20">
          <div className="flex items-center justify-center mb-6">
            <Store className="text-[var(--accent)] w-8 h-8 mr-2" />
            <h2 className="text-3xl font-bold">Vendor Login</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="flex items-center gap-3 bg-[var(--card-bg)] border border-[var(--accent)]/20 rounded-xl p-3">
              <Mail className="text-[var(--accent)] w-5 h-5" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent flex-1 outline-none placeholder-gray-400"
              />
            </div>

            {/* Password */}
            <div className="flex items-center gap-3 bg-[var(--card-bg)] border border-[var(--accent)]/20 rounded-xl p-3">
              <Lock className="text-[var(--accent)] w-5 h-5" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent flex-1 outline-none placeholder-gray-400"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 rounded-xl text-lg font-semibold mt-2"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center text-sm opacity-80">
            <p>
              Don’t have an account?{" "}
              <Link
                href="/vendor/register"
                className="text-[var(--accent)] hover:text-[var(--accent-hover)] underline-offset-2 hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
