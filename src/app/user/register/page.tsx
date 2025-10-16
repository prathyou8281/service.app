"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterPage() {
  const [step, setStep] = useState<"select" | "form">("select");
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username || !email || !password || !role) {
      alert("⚠️ Please fill all fields and select role");
      return;
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, role }),
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.message);
      return;
    }

    alert(`✅ ${role} registration successful! Please login.`);
    router.push("/user/login");
  };

  return (
    <div className="h-screen w-full flex items-center justify-center relative bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 overflow-hidden">
      {/* 🌟 Background Glow */}
      <div className="absolute w-[800px] h-[800px] bg-purple-500/20 blur-[200px] rounded-full"></div>

      {/* 🌀 Step 1: Role Selection Popup */}
      <AnimatePresence>
        {step === "select" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 p-10 rounded-3xl shadow-2xl text-center w-[90%] sm:w-[400px] relative z-10"
          >
            <h1 className="text-3xl font-extrabold text-yellow-300 mb-6">
              Select Your Role
            </h1>
            <p className="text-white/80 mb-6 text-sm">
              Choose your account type to continue registration.
            </p>

            <div className="flex flex-col gap-4">
              {["User", "Vendor", "Technician", "Admin"].map((r) => (
                <motion.button
                  key={r}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setRole(r);
                    setStep("form");
                  }}
                  className="py-3 rounded-xl font-semibold bg-white/20 border border-white/30 text-white hover:bg-yellow-400 hover:text-black transition shadow-md"
                >
                  {r}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🧾 Step 2: Registration Form */}
      <AnimatePresence>
        {step === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white/20 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-[90%] sm:w-[400px] border border-white/30 relative z-10"
          >
            <h1 className="text-4xl font-extrabold text-center text-white mb-4">
              Register
            </h1>

            <p className="text-center text-sm text-yellow-300 mb-6">
              Selected Role: <b>{role}</b>{" "}
              <button
                onClick={() => setStep("select")}
                className="ml-2 text-xs text-white underline hover:text-yellow-300"
              >
                Change
              </button>
            </p>

            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
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

              <button
                type="submit"
                className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-xl shadow-lg transition"
              >
                Register
              </button>
            </form>

            <p className="text-center text-sm text-white mt-6">
              Already have an account?{" "}
              <Link
                href="/user/login"
                className="text-yellow-300 hover:underline"
              >
                Login
              </Link>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
