"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("Guest");

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) {
      setUserEmail(email);
      setUserName(email.split("@")[0]); // 👈 take name before "@"
    }
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-r from-blue-700 to-indigo-800">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Split Layout */}
      <div className="relative z-30 flex h-full items-center justify-between px-10">
        {/* Left Side: Greeting + Stats + Activity */}
        <div className="max-w-2xl text-left space-y-10 pt-20">
          {/* Greeting */}
          <div>
            <h1 className="mb-10 text-4xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-lg">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent">
                {userName}
              </span>{" "}
              👋
            </h1>
            <p className="text-lg leading-relaxed text-gray-200 sm:text-xl">
              Your one-stop solution for{" "}
              <span className="font-semibold text-pink-300">IT services</span>,{" "}
              <span className="font-semibold text-indigo-300">laptops</span> & more.
              <br />
              <span className="italic text-gray-300">
                Fast • Reliable • Affordable
              </span>
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg text-center">
              <p className="text-3xl font-bold text-white">12</p>
              <p className="text-sm text-gray-300">Total Orders</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg text-center">
              <p className="text-3xl font-bold text-white">3</p>
              <p className="text-sm text-gray-300">Active Services</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg text-center">
              <p className="text-3xl font-bold text-white">1</p>
              <p className="text-sm text-gray-300">Pending Payments</p>
            </div>
          </div>

          {/* Activity */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-white mb-3">
              Recent Activity
            </h2>
            <ul className="space-y-2 text-gray-200 text-sm">
              <li>📦 You ordered: Lenovo IdeaPad S145</li>
              <li>🛠 Service request #123 is in progress</li>
              <li>💳 Payment for Order #456 is pending</li>
            </ul>
          </div>
        </div>

              {/* Right Side: Buttons */}
      <div className="absolute right-1/6 top-1/2 -translate-y-1/7 flex flex-col gap-6 items-center">
        {/* First row: Services + Vendors */}
        <div className="flex gap-4">
          <Link
            href="/services"
            className="w-[200px] h-[90px] rounded-2xl bg-indigo-600 text-xl font-bold text-white shadow-xl hover:bg-indigo-500 transition flex items-center justify-center"
          >
            🛠 Services
          </Link>
          <Link
            href="/vendors"
            className="w-[200px] h-[90px] rounded-2xl bg-indigo-600 text-xl font-bold text-white shadow-xl hover:bg-indigo-500 transition flex items-center justify-center"
          >
            🏬 Vendors
          </Link>
        </div>

        {/* Second row: Orders */}
        <Link
          href="/orders"
          className="w-[420px] h-[90px] rounded-2xl bg-indigo-600 text-xl font-bold text-white shadow-xl hover:bg-indigo-500 transition flex items-center justify-center"
        >
          📦 My Orders
        </Link>

        {/* Third row: Support */}
        <Link
          href="/support"
          className="w-[420px] h-[90px] rounded-2xl bg-indigo-600 text-xl font-bold text-white shadow-xl hover:bg-indigo-500 transition flex items-center justify-center"
        >
          💬 Support
        </Link>
      </div>
      </div>
    </div>
  );
}
