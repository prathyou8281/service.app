"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, Users, Settings, Package, LogOut } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("userData");
    if (!data) router.push("/login");
    const parsed = JSON.parse(data!);
    if (parsed.role !== "Admin") router.push("/login");
    setUser(parsed);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-all duration-500">
      {/* 🔹 Top Navigation Bar */}
      <header className="navbar flex justify-between items-center px-8 py-5">
        <h1 className="text-2xl font-extrabold tracking-wide">
          Admin Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-[var(--accent)] animate-pulseAccent">
            {user?.username || "Admin"}
          </span>
          <button onClick={handleLogout} className="btn-primary flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {/* 🔹 Dashboard Content */}
      <main className="max-w-6xl mx-auto p-8 sm:p-12 animate-fadeInUp">
        <h2 className="text-3xl font-bold text-center mb-12">
          Welcome back,{" "}
          <span className="text-[var(--accent)]">
            {user?.username || "Admin"}
          </span>{" "}
          👋
        </h2>

        {/* 🔹 Info Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Total Users */}
          <div className="card flex flex-col items-start justify-center p-6">
            <BarChart3 className="w-8 h-8 text-[var(--accent)] mb-3" />
            <p className="text-sm text-secondary">Total Users</p>
            <p className="text-3xl font-bold mt-1">128</p>
          </div>

          {/* Registered Vendors */}
          <div className="card flex flex-col items-start justify-center p-6">
            <Users className="w-8 h-8 text-[var(--accent)] mb-3" />
            <p className="text-sm text-secondary">Registered Vendors</p>
            <p className="text-3xl font-bold mt-1">32</p>
          </div>

          {/* Technicians */}
          <div className="card flex flex-col items-start justify-center p-6">
            <Package className="w-8 h-8 text-[var(--accent)] mb-3" />
            <p className="text-sm text-secondary">Technicians</p>
            <p className="text-3xl font-bold mt-1">18</p>
          </div>

          {/* System Settings */}
          <div className="card flex flex-col items-start justify-center p-6">
            <Settings className="w-8 h-8 text-[var(--accent)] mb-3" />
            <p className="text-sm text-secondary">System Settings</p>
            <p className="text-3xl font-bold mt-1">⚙️</p>
          </div>
        </div>
      </main>
    </div>
  );
}
