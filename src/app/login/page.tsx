"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

      // ✅ Save user info in localStorage
      localStorage.setItem("userData", JSON.stringify(data.user));

      // ✅ Redirect to user welcome/dashboard page
      router.push("/welcome");
    } catch (err) {
      console.error(err);
      setError("⚠️ Server error, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
      <div className="w-96 bg-white/60 dark:bg-white/10 border border-white/30 shadow-2xl backdrop-blur-2xl p-8 rounded-2xl">
        <h1 className="text-3xl font-bold text-center mb-6">User Login</h1>

        {error && (
          <div className="bg-red-500 text-white text-sm font-medium px-4 py-2 rounded-md mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Email or Phone"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[var(--accent)] text-gray-800"
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[var(--accent)] text-gray-800"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className={`btn-primary w-full mt-2 py-2 font-semibold ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm mt-5">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="text-[var(--accent)] font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
