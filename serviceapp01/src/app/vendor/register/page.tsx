"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VendorRegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/vendor/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccess("Vendor registered successfully. Please login.");
      setTimeout(() => {
        router.push("/vendor/login");
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-lg bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-extrabold text-center mb-2">
          Register as Vendor
        </h1>
        <p className="text-center text-[var(--secondary)] mb-6">
          Join our platform and start offering services
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-500 text-center">{error}</div>
        )}
        {success && (
          <div className="mb-4 text-sm text-green-500 text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            name="name"
            placeholder="Vendor / Shop Name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-[var(--card-border)] bg-transparent"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-[var(--card-border)] bg-transparent"
          />

          <input
            name="phone"
            placeholder="Phone Number"
            required
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-[var(--card-border)] bg-transparent"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-[var(--card-border)] bg-transparent"
          />

          <textarea
            name="description"
            placeholder="Describe your services"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-[var(--card-border)] bg-transparent"
          />

          <button
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[var(--accent)] text-white font-semibold"
          >
            {loading ? "Registering..." : "Register Vendor"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          Already a vendor?{" "}
          <Link
            href="/vendor/login"
            className="text-[var(--accent)] font-semibold"
          >
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
