"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, TrendingUp, DollarSign, LogOut } from "lucide-react";

type User = {
  username: string;
  role: string;
};

export default function VendorDashboard() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const data = localStorage.getItem("userData");

    if (!data) {
      router.replace("/login");
      return;
    }

    try {
      const parsed: User = JSON.parse(data);

      if (parsed.role?.toLowerCase() !== "vendor") {
        router.replace("/login");
        return;
      }

      setUser(parsed);
      setChecked(true);
    } catch {
      router.replace("/login");
    }
  }, [router]);

  // ⛔ Block render until auth check completes
  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Checking authentication...
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("userData");
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-800 via-purple-800 to-pink-700 text-white">
      <header className="flex justify-between items-center px-8 py-5 bg-white/10 backdrop-blur-xl">
        <h1 className="text-2xl font-bold text-yellow-300">
          Vendor Dashboard
        </h1>

        <div className="flex items-center gap-4">
          <span className="text-yellow-200">
            {user?.username}
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded-xl"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="p-10 text-center">
        <h2 className="text-4xl font-bold text-yellow-300">
          Welcome {user?.username} 🛍️
        </h2>
      </main>
    </div>
  );
}
