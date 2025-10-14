"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

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

      if (!data.success) {
        setError("❌ Invalid email or password");
        return;
      }

      router.push("/welcome");
    } catch (err) {
      setError("⚠️ Server error, please try again later.");
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center relative">
      <div className="bg-white/20 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-96">
        <h1 className="text-4xl font-extrabold text-center text-white mb-8">
          Login
        </h1>

        {/* Email/Password Login */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <div className="text-right">
            <Link
              href="/user/forgetpassword"
              className="text-sm text-yellow-300 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-xl shadow-lg transition"
          >
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-white text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Google Login Button */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/welcome" })}
          className="w-full bg-white text-black font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            className="w-5 h-5"
          />
          Login with Google
        </button>

        <p className="text-center text-sm text-white mt-6">
          Don’t have an account?{" "}
          <Link
            href="/user/register"
            className="text-yellow-300 hover:underline"
          >
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
