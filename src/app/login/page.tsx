"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ✅ Auto-redirect only if valid stored user
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("userData");
      if (!storedUser) return;

      const parsed = JSON.parse(storedUser);
      if (parsed && parsed.email && parsed.role) {
        // Redirect based on stored role
        switch (parsed.role.toLowerCase()) {
          case "admin":
            router.replace("/admin/dashboard");
            break;
          case "vendor":
            router.replace("/vendor/dashboard");
            break;
          case "technician":
            router.replace("/technician/dashboard");
            break;
          default:
            router.replace("/welcome");
        }
      } else {
        localStorage.removeItem("userData");
      }
    } catch {
      localStorage.removeItem("userData");
    }
  }, [router]);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("⚠️ Please enter both email and password!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "❌ Invalid email or password");
        setLoading(false);
        return;
      }

      // ✅ Save verified user info
      localStorage.setItem("userData", JSON.stringify(data.user));

      // ✅ Redirect based on verified backend role
      router.push(data.redirect);
    } catch (err) {
      console.error("Login error:", err);
      setError("⚠️ Server error, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-[var(--background)] text-[var(--foreground)] transition-colors duration-500">
      <div className="card w-96 p-10 bg-white/60 dark:bg-white/10 border border-white/30 shadow-2xl backdrop-blur-2xl animate-fadeInUp">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-[var(--foreground)]">
          Login
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Email or Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-gray-800"
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-gray-800"
            disabled={loading}
          />

          <div className="text-right">
            <Link
              href="/forgetpassword"
              className="text-sm text-[var(--accent)] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`btn-primary mt-4 w-full text-center ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-sm opacity-70">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button
          disabled={loading}
          onClick={() => signIn("google", { callbackUrl: "/welcome" })}
          className="w-full bg-white text-black font-semibold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            className="w-5 h-5"
          />
          Login with Google
        </button>

        <p className="text-center text-sm mt-6 opacity-80">
          Don’t have an account?{" "}
          <Link href="/register" className="text-[var(--accent)] hover:underline">
            Register
          </Link>
        </p>
      </div>

      {/* Animated Error Popup */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute top-10 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg font-semibold"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
