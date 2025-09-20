"use client";
import { useEffect, useState } from "react";
import { User, Mail, Phone, MapPin, LogOut, Edit } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("Guest");
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) {
      setUserEmail(email);
      setUserName(email.split("@")[0]);
    }
  }, []);

  // Avatar initials
  const initials = userName ? userName[0].toUpperCase() : "G";

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 text-white">
      {/* Header */}
      <div className="relative bg-black/30 backdrop-blur-md p-10 flex flex-col items-center">
        {/* Avatar infographic */}
        <div className="w-28 h-28 flex items-center justify-center rounded-full bg-gradient-to-r from-pink-400 to-indigo-400 border-4 border-white shadow-lg text-4xl font-bold">
          {initials}
        </div>

        <h1 className="mt-4 text-3xl font-bold">{userName}</h1>
        <p className="text-sm text-gray-200">{userEmail}</p>
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => alert("Edit profile clicked")}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg shadow transition"
          >
            <Edit className="h-4 w-4" /> Edit Profile
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("userEmail");
              router.push("/home");
            }}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg shadow transition"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-10 mt-10">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center shadow-lg">
          <p className="text-3xl font-bold">12</p>
          <p className="text-sm text-gray-200">Total Orders</p>
        </div>
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center shadow-lg">
          <p className="text-3xl font-bold">3</p>
          <p className="text-sm text-gray-200">Active Services</p>
        </div>
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center shadow-lg">
          <p className="text-3xl font-bold">1</p>
          <p className="text-sm text-gray-200">Pending Payments</p>
        </div>
      </div>

      {/* Profile Info */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 mx-10 mt-10 shadow-xl">
        <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-200">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-pink-400" />
            <span>{userName}</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-blue-400" />
            <span>{userEmail}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-green-400" />
            <span>+91 98765 43210</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-yellow-400" />
            <span>Kannur, Kerala</span>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="flex justify-center gap-6 mt-10 pb-20">
        <Link
          href="/orders"
          className="w-[200px] h-[70px] rounded-xl bg-indigo-600 text-lg font-bold text-white shadow-xl hover:bg-indigo-500 transition flex items-center justify-center"
        >
          📦 My Orders
        </Link>
        <Link
          href="/services"
          className="w-[200px] h-[70px] rounded-xl bg-indigo-600 text-lg font-bold text-white shadow-xl hover:bg-indigo-500 transition flex items-center justify-center"
        >
          🛠 My Services
        </Link>
        <Link
          href="/support"
          className="w-[200px] h-[70px] rounded-xl bg-indigo-600 text-lg font-bold text-white shadow-xl hover:bg-indigo-500 transition flex items-center justify-center"
        >
          💬 Support
        </Link>
      </div>
    </div>
  );
}
