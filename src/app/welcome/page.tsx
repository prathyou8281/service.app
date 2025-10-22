"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import ProfileDropdown from "@/components/ProfileDropdown/ProfileDropdown";

export default function Home() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("Guest");

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const userData = localStorage.getItem("userData");

    if (email) {
      setUserEmail(email);
      setUserName(email.split("@")[0]);
    }

    // Redirect if not logged in
    if (!userData) {
      router.push("/user/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("userEmail");
    router.push("/user/login");
  };

  return (
    <div className="relative min-h-screen w-full bg-[var(--background)] text-[var(--foreground)] transition-all duration-500 overflow-hidden">
      {/* 🔹 Top-right Profile & Logout */}
      <div className="absolute top-5 right-8 flex items-center gap-4 z-50">
        <ProfileDropdown />
        <button
          onClick={handleLogout}
          className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/30 transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* Optional overlay tint */}
      <div className="absolute inset-0 bg-[var(--overlay)] pointer-events-none" />

      {/* Layout */}
      <div className="relative z-30 flex flex-col lg:flex-row items-start lg:items-center justify-between px-6 sm:px-10 lg:px-16 py-10 gap-10">
        
        {/* 🔹 Left Section: Greeting + Stats + Activity */}
        <div className="flex-1 w-full max-w-2xl text-left space-y-8">
          {/* Greeting */}
          <div>
            <h1 className="mb-6 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--foreground)] drop-shadow-lg">
              Welcome back,{" "}
              <span className="text-[var(--accent)]">{userName}</span> 👋
            </h1>
            <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-[var(--secondary)]">
              Your one-stop solution for{" "}
              <span className="font-semibold text-[var(--accent)]">IT Services</span>,{" "}
              <span className="font-semibold text-[var(--highlight)]">Laptops</span> & more. <br />
              <span className="italic text-[var(--muted)]">
                Fast • Reliable • Affordable
              </span>
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { value: "12", label: "Total Orders" },
              { value: "3", label: "Active Services" },
              { value: "1", label: "Pending Payments" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-[var(--card-bg)] rounded-xl p-5 shadow-lg text-center border border-[var(--card-border)] hover:scale-[1.02] transition-transform"
              >
                <p className="text-3xl font-bold text-[var(--accent)]">{stat.value}</p>
                <p className="text-sm text-[var(--secondary)]">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Activity Section */}
          <div className="bg-[var(--card-bg)] rounded-xl p-5 shadow-lg border border-[var(--card-border)]">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-3">
              Recent Activity
            </h2>
            <ul className="space-y-2 text-[var(--secondary)] text-sm">
              <li>📦 You ordered: Lenovo IdeaPad S145</li>
              <li>🛠 Service request #123 is in progress</li>
              <li>💳 Payment for Order #456 is pending</li>
            </ul>
          </div>
        </div>

        {/* 🔹 Right Section: Quick Links */}
        <div className="flex-1 flex flex-col gap-5 items-center lg:items-end w-full">
          {/* Row 1: Services & Vendors */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <Link
              href="/explore"
              className="btn-accent w-full sm:w-[200px] h-[70px] rounded-xl text-base sm:text-lg lg:text-xl font-semibold flex items-center justify-center"
            >
              🛠 Services
            </Link>
            <Link
              href="/vendors"
              className="btn-accent w-full sm:w-[200px] h-[70px] rounded-xl text-base sm:text-lg lg:text-xl font-semibold flex items-center justify-center"
            >
              🏬 Vendors
            </Link>
          </div>

          {/* Row 2: Orders */}
          <Link
            href="/orders"
            className="btn-accent w-full sm:w-[420px] h-[70px] rounded-xl text-base sm:text-lg lg:text-xl font-semibold flex items-center justify-center"
          >
            📦 My Orders
          </Link>

          {/* Row 3: Support */}
          <Link
            href="/support"
            className="btn-accent w-full sm:w-[420px] h-[70px] rounded-xl text-base sm:text-lg lg:text-xl font-semibold flex items-center justify-center"
          >
            💬 Support
          </Link>
        </div>
      </div>
    </div>
  );
}
