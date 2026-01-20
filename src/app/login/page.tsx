"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = "http://localhost:4000/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("userData");
      if (!storedUser) return;

      const parsed = JSON.parse(storedUser);
      if (parsed?.role) {
        router.replace(`/${parsed.role}/dashboard`);
      }
    } catch {
      localStorage.removeItem("userData");
    }
  }, [router]);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Invalid email or password");
        return;
      }

      localStorage.setItem("userData", JSON.stringify(data.user));
      localStorage.setItem("access_token", data.user.access_token);

      // Set cookie for middleware/session
      document.cookie = `userData=${JSON.stringify({
        username: data.user.name,
        role: data.user.role || "user",
      })}; path=/; max-age=86400; SameSite=Lax`;

      // Check for pending booking redirected from explore
      const pendingBooking = localStorage.getItem("pendingBooking");
      if (pendingBooking) {
        try {
          const service = JSON.parse(pendingBooking);
          localStorage.removeItem("pendingBooking");
          router.push(`/book-service?serviceId=${service.id}`);
          return;
        } catch (e) {
          localStorage.removeItem("pendingBooking");
        }
      }

      router.push(data.redirect || "/welcome");
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[var(--background)] overflow-hidden">

      {/* Background glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-400/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-md p-10 rounded-3xl
                   bg-white/70 dark:bg-white/10
                   backdrop-blur-2xl border border-white/30
                   shadow-2xl"
      >
        <h1 className="text-4xl font-extrabold text-center mb-2">
          Welcome Back
        </h1>
        <p className="text-center text-sm opacity-70 mb-8">
          Login to continue
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl border border-gray-300
                       focus:ring-2 focus:ring-[var(--accent)]
                       outline-none transition"
          />

          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl border border-gray-300
                       focus:ring-2 focus:ring-[var(--accent)]
                       outline-none transition"
          />

          <div className="text-right text-sm">
            <Link
              href="/forgetpassword"
              className="text-[var(--accent)] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl
                       bg-[var(--accent)] text-white
                       font-semibold shadow-lg
                       disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        <div className="flex items-center my-6 opacity-60">
          <div className="flex-grow border-t" />
          <span className="mx-3 text-xs">OR</span>
          <div className="flex-grow border-t" />
        </div>

        <p className="text-center text-sm opacity-80">
          Don’t have an account?{" "}
          <Link href="/register" className="text-[var(--accent)] font-semibold">
            Register
          </Link>
        </p>
      </motion.div>

      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
            transition={{ duration: 0.35 }}
            className="absolute top-8 bg-red-500 text-white px-6 py-3 rounded-xl shadow-xl font-medium"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
