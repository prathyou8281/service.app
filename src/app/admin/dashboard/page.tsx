"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, Users, Settings, Package, LogOut } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("userData");
    if (!data) router.push("/user/login");
    const parsed = JSON.parse(data!);
    if (parsed.role !== "Admin") router.push("/user/login");
    setUser(parsed);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    router.push("/user/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 text-white">
      {/* 🔹 Top Navigation Bar */}
      <header className="flex justify-between items-center px-8 py-5 bg-white/10 backdrop-blur-md border-b border-white/20 shadow-md">
        <h1 className="text-2xl font-extrabold tracking-wide">
          Admin Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-yellow-300">
            {user?.username || "Admin"}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-white text-sm font-semibold transition shadow-md"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {/* 🔹 Dashboard Content */}
      <main className="max-w-6xl mx-auto p-10">
        <h2 className="text-3xl font-bold text-center text-yellow-300 mb-10">
          Welcome back, {user?.username || "Admin"} 👋
        </h2>

        {/* Grid Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Total Users */}
          <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex flex-col items-start justify-center hover:scale-105 transition-transform shadow-xl hover:shadow-yellow-300/30">
            <BarChart3 className="text-yellow-300 w-8 h-8 mb-3" />
            <p className="text-sm text-gray-200">Total Users</p>
            <p className="text-3xl font-bold text-white mt-1">128</p>
          </div>

          {/* Vendors */}
          <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex flex-col items-start justify-center hover:scale-105 transition-transform shadow-xl hover:shadow-yellow-300/30">
            <Users className="text-yellow-300 w-8 h-8 mb-3" />
            <p className="text-sm text-gray-200">Registered Vendors</p>
            <p className="text-3xl font-bold text-white mt-1">32</p>
          </div>

          {/* Technicians */}
          <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex flex-col items-start justify-center hover:scale-105 transition-transform shadow-xl hover:shadow-yellow-300/30">
            <Package className="text-yellow-300 w-8 h-8 mb-3" />
            <p className="text-sm text-gray-200">Technicians</p>
            <p className="text-3xl font-bold text-white mt-1">18</p>
          </div>

          {/* System Settings */}
          <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex flex-col items-start justify-center hover:scale-105 transition-transform shadow-xl hover:shadow-yellow-300/30">
            <Settings className="text-yellow-300 w-8 h-8 mb-3" />
            <p className="text-sm text-gray-200">System Settings</p>
            <p className="text-3xl font-bold text-white mt-1">⚙️</p>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-white/70 mt-16 text-sm">
          © {new Date().getFullYear()} Computer Club Admin Panel
        </footer>
      </main>
    </div>
  );
}
