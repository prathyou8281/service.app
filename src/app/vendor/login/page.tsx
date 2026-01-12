"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VendorLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/vendor/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("vendorData", JSON.stringify(data.vendor));
      router.push("/vendor/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-md bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl shadow-xl p-8">
        
        {/* Header */}
        <h1 className="text-3xl font-extrabold text-center mb-2">
          Vendor Login
        </h1>
        <p className="text-center text-[var(--secondary)] mb-6">
          Manage your services, orders & customers
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-500 text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm mb-1 font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[var(--card-border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="vendor@email.com"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[var(--card-border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[var(--accent)] text-white font-semibold hover:opacity-90 transition"
          >
            {loading ? "Logging in..." : "Login as Vendor"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-[var(--card-border)]" />
          <span className="text-xs text-[var(--secondary)]">OR</span>
          <div className="flex-1 h-px bg-[var(--card-border)]" />
        </div>

        {/* Register Button */}
        <Link
          href="/vendor/register"
          className="block w-full text-center py-3 rounded-xl border border-[var(--accent)] text-[var(--accent)] font-semibold hover:bg-[var(--accent)] hover:text-white transition"
        >
          Register as Vendor
        </Link>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-[var(--secondary)]">
          Not a vendor?{" "}
          <Link
            href="/login"
            className="text-[var(--accent)] font-semibold hover:underline"
          >
            User Login
          </Link>
        </div>
      </div>
    </div>
  );
}
