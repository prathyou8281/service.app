"use client";

import { useState } from "react";
import Link from "next/link";

export default function VendorLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:4000/api/vendors/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Vendor login failed");
      }

      // ✅ STORE LOGIN DATA (THIS FIXES DASHBOARD REDIRECT)
      localStorage.setItem(
        "userData",
        JSON.stringify({
          username: data.vendor.name,
          role: "vendor",
        })
      );

      // ✅ HARD REDIRECT (NO ROUTER, NO MIDDLEWARE)
      window.location.href = "/vendor/dashboard";
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-md bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-extrabold text-center mb-2">
          Vendor Login
        </h1>
        <p className="text-center text-[var(--secondary)] mb-6">
          Manage your services, orders & customers
        </p>

        {error && (
          <p className="mb-4 text-sm text-red-500 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm mb-1 font-medium">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[var(--card-border)]"
              placeholder="vendor@email.com"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[var(--card-border)]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[var(--accent)] text-white font-semibold disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login as Vendor"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-[var(--card-border)]" />
          <span className="text-xs text-[var(--secondary)]">OR</span>
          <div className="flex-1 h-px bg-[var(--card-border)]" />
        </div>

        <Link
          href="/vendor/register"
          className="block w-full text-center py-3 rounded-xl border border-[var(--accent)] text-[var(--accent)] font-semibold hover:bg-[var(--accent)] hover:text-white transition"
        >
          Register as Vendor
        </Link>

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
