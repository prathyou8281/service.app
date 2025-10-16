"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Wrench, Activity, ClipboardCheck, LogOut } from "lucide-react";

export default function TechnicianDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("userData");
    if (!data) router.push("/user/login");
    const parsed = JSON.parse(data!);
    if (parsed.role !== "Technician") router.push("/user/login");
    setUser(parsed);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    router.push("/user/login");
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-800 via-purple-800 to-pink-700 text-white">
      {/* 🔆 Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,255,255,0.2),transparent_60%)] blur-3xl"></div>

      {/* Header */}
      <header className="flex justify-between items-center px-8 py-5 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-md relative z-10">
        <h1 className="text-2xl font-extrabold tracking-wide text-cyan-300 drop-shadow">
          Technician Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-cyan-200">
            {user?.username || "Technician"}
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

      {/* Body */}
      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <h2 className="text-4xl font-bold text-center text-cyan-300 mb-10 drop-shadow">
          Welcome back, {user?.username || "Technician"} 👋
        </h2>

        {/* Dashboard Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Pending Repairs */}
          <div className="group bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-cyan-300/40 transition-all transform hover:-translate-y-2 hover:scale-[1.03]">
            <div className="flex items-center gap-4">
              <div className="bg-cyan-400/20 p-3 rounded-xl">
                <Wrench className="text-cyan-300 w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-gray-200">Pending Repairs</p>
                <p className="text-3xl font-bold text-white mt-1">14</p>
              </div>
            </div>
          </div>

          {/* Active Jobs */}
          <div className="group bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-cyan-300/40 transition-all transform hover:-translate-y-2 hover:scale-[1.03]">
            <div className="flex items-center gap-4">
              <div className="bg-cyan-400/20 p-3 rounded-xl">
                <Activity className="text-cyan-300 w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-gray-200">Active Jobs</p>
                <p className="text-3xl font-bold text-white mt-1">6</p>
              </div>
            </div>
          </div>

          {/* Completed Jobs */}
          <div className="group bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-cyan-300/40 transition-all transform hover:-translate-y-2 hover:scale-[1.03]">
            <div className="flex items-center gap-4">
              <div className="bg-cyan-400/20 p-3 rounded-xl">
                <ClipboardCheck className="text-cyan-300 w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-gray-200">Completed Jobs</p>
                <p className="text-3xl font-bold text-white mt-1">48</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent my-14"></div>

        {/* CTA Section */}
        <section className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-white/90">
            Track your service progress, manage tasks, and deliver excellence.
          </h3>
          <button
            className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold px-6 py-3 rounded-xl shadow-lg transition transform hover:-translate-y-1 hover:scale-105"
            onClick={() => alert('Feature coming soon!')}
          >
            View Workboard
          </button>
        </section>

        <footer className="text-center text-white/70 mt-16 text-sm">
          © {new Date().getFullYear()} Computer Club Technician Panel
        </footer>
      </main>
    </div>
  );
}
