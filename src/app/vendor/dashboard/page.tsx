"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, TrendingUp, DollarSign, LogOut } from "lucide-react";

export default function VendorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("userData");
    if (!data) router.push("/login");
    const parsed = JSON.parse(data!);
    if (parsed.role !== "Vendor") router.push("/login");
    setUser(parsed);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    router.push("/");
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-800 via-purple-800 to-pink-700 text-white">
      {/* 🔆 Ambient Gradient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,0,0.2),transparent_60%)] blur-3xl"></div>

      {/* Header */}
      <header className="flex justify-between items-center px-8 py-5 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-md relative z-10">
        <h1 className="text-2xl font-extrabold tracking-wide text-yellow-300 drop-shadow">
          Vendor Dashboard
        </h1>

        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-yellow-200">
            {user?.username || "Vendor"}
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
        <h2 className="text-4xl font-bold text-center text-yellow-300 mb-10 drop-shadow">
          Welcome back, {user?.username || "Vendor"} 🛍️
        </h2>

        {/* Cards Section */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Total Orders */}
          <div className="group bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-yellow-400/40 transition-all transform hover:-translate-y-2 hover:scale-[1.03]">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-400/20 p-3 rounded-xl">
                <ShoppingBag className="text-yellow-300 w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-gray-200">Total Orders</p>
                <p className="text-3xl font-bold text-white mt-1">210</p>
              </div>
            </div>
          </div>

          {/* Products Listed */}
          <div className="group bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-yellow-400/40 transition-all transform hover:-translate-y-2 hover:scale-[1.03]">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-400/20 p-3 rounded-xl">
                <TrendingUp className="text-yellow-300 w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-gray-200">Products Listed</p>
                <p className="text-3xl font-bold text-white mt-1">67</p>
              </div>
            </div>
          </div>

          {/* Monthly Revenue */}
          <div className="group bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-yellow-400/40 transition-all transform hover:-translate-y-2 hover:scale-[1.03]">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-400/20 p-3 rounded-xl">
                <DollarSign className="text-yellow-300 w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-gray-200">Monthly Revenue</p>
                <p className="text-3xl font-bold text-white mt-1">₹1.2L</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent my-14"></div>

        {/* CTA Section */}
        <section className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-white/90">
            Manage your listings, check analytics, and grow your business.
          </h3>
          <button
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-3 rounded-xl shadow-lg transition transform hover:-translate-y-1 hover:scale-105"
            onClick={() => alert("Feature coming soon!")}
          >
            Explore Vendor Tools
          </button>
        </section>

        <footer className="text-center text-white/70 mt-16 text-sm">
          © {new Date().getFullYear()} Computer Club Vendor Panel
        </footer>
      </main>
    </div>
  );
}
