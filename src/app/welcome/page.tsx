"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Wrench,
  ShoppingBag,
  ClipboardList,
  LifeBuoy,
} from "lucide-react";
import ProfileDropdown from "@/components/ProfileDropdown/ProfileDropdown";

export default function Home() {
  const router = useRouter();
  const [userName, setUserName] = useState("Guest");

  useEffect(() => {
    const userData = localStorage.getItem("userData");

    if (!userData) {
      router.push("/user/login");
      return;
    }

    const parsed = JSON.parse(userData);
    setUserName(parsed.name || "User");
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("userEmail");
    router.push("/login");
  };

  return (
    <div className="min-h-screen w-full bg-[var(--background)] text-[var(--foreground)] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/10 via-transparent to-[var(--highlight)]/10 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[var(--accent)]/20 blur-3xl rounded-full" />
      <div className="absolute bottom-0 -left-40 w-[400px] h-[400px] bg-[var(--highlight)]/20 blur-3xl rounded-full" />

      {/* Top bar */}
      <div className="relative z-50 flex justify-end items-center gap-4 px-6 py-4">
        <ProfileDropdown />
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col min-h-[calc(100vh-80px)] px-6 sm:px-10 lg:px-16 pb-12">
        {/* HERO */}
        <section className="flex-1 flex flex-col justify-center max-w-6xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
            Smart Services. <br />
            <span className="text-[var(--accent)]">Simpler Life.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg sm:text-xl text-[var(--secondary)] leading-relaxed">
            Welcome back,{" "}
            <span className="font-semibold text-[var(--accent)]">
              {userName}
            </span>
            .  
            Manage repairs, book trusted technicians, track orders,  
            and get fast support — all from one powerful service platform.
          </p>

          <p className="mt-3 text-sm sm:text-base text-[var(--muted)] italic">
            Reliable • Professional • On-Time Services
          </p>

          {/* Primary CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href="/explore"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-[var(--card-border)] font-semibold text-lg hover:bg-white/5 transition"
            
            >
              <Wrench className="w-5 h-5" />
              Explore Services
            </Link>
            <Link
              href="/orders"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-[var(--card-border)] font-semibold text-lg hover:bg-white/5 transition"
            >
              <ClipboardList className="w-5 h-5" />
              My Orders
            </Link>
          </div>
        </section>

        {/* DASHBOARD SECTIONS */}
        <section className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats */}
          {[
            { value: "12", label: "Total Orders" },
            { value: "3", label: "Active Services" },
            { value: "1", label: "Pending Payments" },
          ].map((stat, i) => (
            <div
              key={i}
              className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 shadow-md hover:shadow-xl transition"
            >
              <p className="text-4xl font-extrabold text-[var(--accent)]">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-[var(--secondary)] uppercase tracking-wide">
                {stat.label}
              </p>
            </div>
          ))}
        </section>

        {/* SERVICES & ACTIONS */}
        <section className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* What you can do */}
          <div className="rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] p-8 shadow-md">
            <h2 className="text-2xl font-bold mb-4">
              What you can do here
            </h2>
            <ul className="space-y-3 text-[var(--secondary)]">
              <li>🛠 Book laptop & mobile repair services</li>
              <li>👨‍🔧 Find verified technicians near you</li>
              <li>📦 Track your service & product orders</li>
              <li>💳 Manage payments & invoices</li>
              <li>💬 Get instant customer support</li>
            </ul>
          </div>

          {/* Quick actions */}
          <div className="rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] p-8 shadow-md">
            <h2 className="text-2xl font-bold mb-6">
              Quick Actions
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/vendors"
                className="flex items-center gap-3 p-5 rounded-xl bg-[var(--highlight)] text-white font-semibold hover:opacity-90 transition"
              >
                <ShoppingBag className="w-5 h-5" />
                View Vendors
              </Link>

              <Link
                href="/support"
                className="flex items-center gap-3 p-5 rounded-xl border border-[var(--card-border)] hover:bg-white/5 transition font-semibold"
              >
                <LifeBuoy className="w-5 h-5" />
                Support
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
