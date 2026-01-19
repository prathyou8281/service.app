"use client";

import { useEffect, useState } from "react";

type User = {
  username: string;
  role: string;
};

export default function VendorDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("userData");

    if (!data) {
      window.location.href = "/vendor/login";
      return;
    }

    try {
      const parsed: User = JSON.parse(data);

      if (parsed.role !== "vendor") {
        window.location.href = "/vendor/login";
        return;
      }

      setUser(parsed);
      setChecked(true);
    } catch {
      window.location.href = "/vendor/login";
    }
  }, []);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center animate-pulse">
        Checking authentication...
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("userData");
    window.location.href = "/vendor/login";
  };

  return (
    <div className="min-h-screen flex">
      
      {/* Sidebar */}
      <aside className="w-64 p-6 flex flex-col gap-6 border-r">
        <h1 className="text-2xl font-extrabold">
          Vendor Panel
        </h1>

        <nav className="flex flex-col gap-3 mt-6">
          {[
            "Dashboard",
            "My Profile",
            "My Services",
            "Orders",
            "Earnings",
            "Settings",
          ].map((item) => (
            <button
              key={item}
              className="text-left px-4 py-3 rounded-xl
                         transition-transform duration-300
                         hover:translate-x-1"
            >
              {item}
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto px-4 py-3 rounded-xl
                     transition-transform duration-300
                     hover:scale-105"
        >
          Logout
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-10">
        <header className="mb-10">
          <h2 className="text-4xl font-extrabold">
            Welcome {user?.username}
          </h2>
          <p className="mt-2">
            Manage your services, orders, and earnings in one place
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Services" value="12" />
          <StatCard title="Active Orders" value="5" />
          <StatCard title="Monthly Earnings" value="₹18,500" />
        </section>

        <section className="mt-12">
          <h3 className="text-2xl font-bold mb-6">
            Quick Actions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ActionCard text="Add New Service" />
            <ActionCard text="View Orders" />
            <ActionCard text="Update Profile" />
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div
      className="p-6 rounded-2xl
                 transition-transform duration-300
                 hover:scale-105"
    >
      <h4 className="text-lg opacity-70">{title}</h4>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

function ActionCard({ text }: { text: string }) {
  return (
    <button
      className="p-6 rounded-2xl font-semibold
                 transition-transform duration-300
                 hover:scale-105"
    >
      {text}
    </button>
  );
}
