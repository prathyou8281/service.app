"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Store,
  Wrench,
  Phone,
  Mail,
  Lock,
  MapPin,
  Briefcase,
} from "lucide-react";

export default function RegisterPage() {
  const [step, setStep] = useState<"select" | "form">("select");
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [shopName, setShopName] = useState("");
  const [shopLocation, setShopLocation] = useState("");
  const [skill, setSkill] = useState("");
  const [experience, setExperience] = useState("");

  const router = useRouter();

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username || !email || !password || !role) {
      alert("⚠️ Please fill all fields and select a role");
      return;
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        email,
        password,
        role,
        phone,
        shopName,
        shopLocation,
        skill,
        experience,
      }),
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.message || data.error);
      return;
    }

    alert(`✅ ${role} registration successful! Please login.`);
    router.push("/login");
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[var(--soft-gradient)] text-[var(--foreground)] transition-colors duration-500">
      <AnimatePresence>
        {step === "select" && (
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, scale: 0.9 }}
            className="card relative z-10 p-10 sm:p-16 shadow-2xl max-w-5xl w-[90%]"
          >
            <h1 className="text-4xl font-extrabold text-center mb-10 text-[var(--accent)]">
              Select Your Role
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { label: "User", icon: <User className="w-10 h-10 mb-3 text-[var(--accent)]" /> },
                { label: "Vendor", icon: <Store className="w-10 h-10 mb-3 text-[var(--accent)]" /> },
                { label: "Technician", icon: <Wrench className="w-10 h-10 mb-3 text-[var(--accent)]" /> },
              ].map((r) => (
                <motion.button
                  key={r.label}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setRole(r.label);
                    setStep("form");
                  }}
                  className="flex flex-col items-center justify-center font-semibold bg-[var(--card-bg)] border border-[var(--accent)]/20 p-6 rounded-2xl shadow-lg hover:bg-[var(--card-hover-bg)] transition-all"
                >
                  {r.icon}
                  {r.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {step === "form" && (
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -30 }}
            className="card relative z-10 shadow-2xl p-10 sm:p-16 max-w-6xl w-[90%]"
          >
            <div className="flex flex-col lg:flex-row gap-12 items-center justify-between">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex-1"
              >
                <h2 className="text-4xl font-extrabold mb-2">
                  Register as{" "}
                  <span className="text-[var(--accent)]">{role}</span>
                </h2>
                <button
                  onClick={() => setStep("select")}
                  className="text-xs underline text-[var(--accent-hover)] mb-6 hover:text-[var(--accent)] transition"
                >
                  Change Role
                </button>

                <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Username */}
                  <div className="flex items-center gap-3 bg-[var(--card-bg)] rounded-xl p-3 border border-[var(--accent)]/20">
                    <User className="text-[var(--accent)] w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-transparent flex-1 outline-none placeholder-gray-400"
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
                    />
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-3 bg-[var(--card-bg)] rounded-xl p-3 border border-[var(--accent)]/20">
                    <Phone className="text-[var(--accent)] w-5 h-5" />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-transparent flex-1 outline-none placeholder-gray-400"
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
                    />
                  </div>

                  {/* Vendor Fields */}
                  {role === "Vendor" && (
                    <>
                      <div className="flex items-center gap-3 bg-[var(--card-bg)] rounded-xl p-3 border border-[var(--accent)]/20">
                        <Store className="text-[var(--accent)] w-5 h-5" />
                        <input
                          type="text"
                          placeholder="Shop Name"
                          value={shopName}
                          onChange={(e) => setShopName(e.target.value)}
                          className="bg-transparent flex-1 outline-none placeholder-gray-400"
                        />
                      </div>

                      <div className="flex items-center gap-3 bg-[var(--card-bg)] rounded-xl p-3 border border-[var(--accent)]/20">
                        <MapPin className="text-[var(--accent)] w-5 h-5" />
                        <input
                          type="text"
                          placeholder="Shop Location"
                          value={shopLocation}
                          onChange={(e) => setShopLocation(e.target.value)}
                          className="bg-transparent flex-1 outline-none placeholder-gray-400"
                        />
                      </div>
                    </>
                  )}

                  {/* Technician Fields */}
                  {role === "Technician" && (
                    <>
                      <div className="flex items-center gap-3 bg-[var(--card-bg)] rounded-xl p-3 border border-[var(--accent)]/20">
                        <Wrench className="text-[var(--accent)] w-5 h-5" />
                        <input
                          type="text"
                          placeholder="Skill / Specialization"
                          value={skill}
                          onChange={(e) => setSkill(e.target.value)}
                          className="bg-transparent flex-1 outline-none placeholder-gray-400"
                        />
                      </div>

                      <div className="flex items-center gap-3 bg-[var(--card-bg)] rounded-xl p-3 border border-[var(--accent)]/20">
                        <Briefcase className="text-[var(--accent)] w-5 h-5" />
                        <input
                          type="text"
                          placeholder="Experience (e.g., 3 Years)"
                          value={experience}
                          onChange={(e) => setExperience(e.target.value)}
                          className="bg-transparent flex-1 outline-none placeholder-gray-400"
                        />
                      </div>
                    </>
                  )}

                  {/* Submit */}
                  <div className="col-span-2 mt-4">
                    <button type="submit" className="w-full btn-primary py-4">
                      Register
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
