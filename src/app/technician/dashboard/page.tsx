"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Wrench,
  Activity,
  ClipboardCheck,
  LogOut,
} from "lucide-react";

export default function TechnicianDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("userData");
    if (!data) router.push("/");
    const parsed = JSON.parse(data!);
    if (parsed.role !== "Technician") router.push("/");
    setUser(parsed);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[var(--soft-gradient)] text-[var(--foreground)] relative overflow-hidden transition-colors duration-700">
      {/* 🌌 Background Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(6,182,212,0.25),transparent_70%)] blur-3xl"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.2),transparent_70%)] blur-2xl"></div>

      {/* Header */}
      <header className="flex justify-between items-center px-8 py-5 bg-white/10 backdrop-blur-xl border-b border-[var(--card-border)] shadow-md relative z-10">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-extrabold tracking-wide text-[var(--accent)] drop-shadow"
        >
          Technician Dashboard
        </motion.h1>

        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-[var(--accent-hover)]">
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

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center text-[var(--accent)] mb-12 drop-shadow-lg"
        >
          Welcome back, {user?.username || "Technician"} 👋
        </motion.h2>

        {/* Dashboard Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <DashboardCard
            title="Pending Repairs"
            value="14"
            icon={<Wrench className="w-8 h-8 text-[var(--accent)]" />}
          />
          <DashboardCard
            title="Active Jobs"
            value="6"
            icon={<Activity className="w-8 h-8 text-[var(--accent)]" />}
          />
          <DashboardCard
            title="Completed Jobs"
            value="48"
            icon={<ClipboardCheck className="w-8 h-8 text-[var(--accent)]" />}
          />
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent my-14"></div>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-4"
        >
          <h3 className="text-xl font-semibold text-white/90">
            Track your service progress, manage tasks, and deliver excellence.
          </h3>
          <button
            className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-black font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-[var(--glow)] transition transform hover:-translate-y-1 hover:scale-105"
            onClick={() => alert('🛠 Workboard feature coming soon!')}
          >
            View Workboard
          </button>
        </motion.section>

        {/* Footer */}
        <footer className="text-center text-white/70 mt-20 text-sm">
          © {new Date().getFullYear()} Computer Club – Technician Panel
        </footer>
      </main>
    </div>
  );
}

/* 🔹 Card Component */
function DashboardCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[var(--card-bg)] backdrop-blur-lg border border-[var(--card-border)] rounded-2xl p-6 shadow-lg hover-glow animate-fadeInUp"
    >
      <div className="flex items-center gap-4">
        <div className="bg-[var(--accent)]/20 p-3 rounded-xl animate-float">{icon}</div>
        <div>
          <p className="text-sm text-gray-300">{title}</p>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}
