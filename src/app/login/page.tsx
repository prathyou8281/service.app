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
  const router = useRouter();

  // ✅ Redirect if already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) router.push("/welcome");
  }, [router]);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setError("⚠️ Please enter both email and password!");
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "❌ Invalid email or password");
        return;
      }

      // ✅ Save user info
      localStorage.setItem("userData", JSON.stringify(data.user));

      // ✅ Redirect based on role
      router.push(data.redirect);
    } catch (err) {
      console.error("Login error:", err);
      setError("⚠️ Server error, please try again later.");
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
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-gray-800"
          />

          <div className="text-right">
            <Link
              href="/user/forgetpassword"
              className="text-sm text-[var(--accent)] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="btn-primary mt-4 w-full text-center"
          >
            Login
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-sm opacity-70">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button
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
          <Link href="/user/register" className="text-[var(--accent)] hover:underline">
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
