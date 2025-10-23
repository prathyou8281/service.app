"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import {
  BarChart3,
  Users,
  Settings,
  Package,
  LogOut,
  LayoutDashboard,
  Store,
  Wrench,
  Trash2,
  Plus,
  Edit3,
} from "lucide-react";
import { motion } from "framer-motion";
import ProfileDropdown from "@/components/ProfileDropdown/ProfileDropdown";

// Fetch helper
const fetcher = (url: string) => fetch(url).then((r) => r.json());

// Type definitions
type Metrics = { users: number; vendors: number; technicians: number };
type Column = { key: string; label: string };

export default function AdminDashboard() {
  const router = useRouter();
  const params = useSearchParams();
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);

  // active page
  const [active, setActive] = useState<
    "Dashboard" | "Users" | "Vendors" | "Technicians" | "Settings"
  >("Dashboard");

  // Sync ?v param
  useEffect(() => {
    const view = params.get("v");
    if (view) setActive(view as any);
  }, [params]);

  // Check admin access
  useEffect(() => {
    const data = localStorage.getItem("userData");
    if (!data) router.push("/login");
    const parsed = JSON.parse(data!);
    if (parsed.role !== "Admin") router.push("/login");
    setUser(parsed);
  }, [router]);

  // Fetch metrics
  const { data: metricsRes } = useSWR("/api/admin/metrics", fetcher, {
    refreshInterval: 10000,
  });
  const metrics: Metrics | null = metricsRes?.success ? metricsRes.data : null;

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-[var(--background)] text-[var(--foreground)] transition-all duration-500 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--card-bg)] border-r border-[var(--card-border)] p-6 hidden md:flex flex-col">
        <h1 className="text-2xl font-extrabold mb-8 text-[var(--accent)]">Admin Panel</h1>
        <nav className="space-y-3">
          {[
            { key: "Dashboard", icon: LayoutDashboard },
            { key: "Users", icon: Users },
            { key: "Vendors", icon: Store },
            { key: "Technicians", icon: Wrench },
            { key: "Settings", icon: Settings },
          ].map(({ key, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActive(key as any)}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left text-sm font-medium transition ${
                active === key
                  ? "bg-[var(--accent)] text-white"
                  : "text-[var(--secondary)] hover:bg-white/10"
              }`}
            >
              <Icon className="w-5 h-5" />
              {key}
            </button>
          ))}
        </nav>

        <button
          onClick={() => {
            localStorage.removeItem("userData");
            router.push("/");
          }}
          className="mt-auto flex items-center gap-2 text-sm text-[var(--secondary)] hover:text-[var(--accent)] transition"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-extrabold tracking-wide">{active}</h1>
          <div className="flex items-center gap-4">
            <ProfileDropdown />
            <button
              onClick={() => {
                localStorage.removeItem("userData");
                router.push("/");
              }}
              className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/30 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </header>

        {/* Dashboard Cards */}
        {active === "Dashboard" && (
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StatCard
              icon={BarChart3}
              label="Total Users"
              value={metrics?.users ?? "..."}
              onClick={() => setActive("Users")}
            />
            <StatCard
              icon={Users}
              label="Registered Vendors"
              value={metrics?.vendors ?? "..."}
              onClick={() => setActive("Vendors")}
            />
            <StatCard
              icon={Package}
              label="Technicians"
              value={metrics?.technicians ?? "..."}
              onClick={() => setActive("Technicians")}
            />
            <StatCard icon={Settings} label="System Settings" value="⚙️" />
            <StatCard
              icon={Users}
              label="Got Users"
              value={metrics?.users ?? "..."}
              onClick={() => setActive("Users")}
            />
          </motion.div>
        )}

        {/* USERS PAGE */}
        {active === "Users" && (
          <EntityTable
            entity="users"
            columns={[
              { key: "username", label: "Username" },
              { key: "email", label: "Email" },
              { key: "phone", label: "Phone" },
              { key: "address", label: "Address" },
            ]}
            showAddButton
          />
        )}

        {/* VENDORS PAGE */}
        {active === "Vendors" && (
          <EntityTable
            entity="vendors"
            columns={[
              { key: "username", label: "Owner Name" },
              { key: "email", label: "Email" },
              { key: "phone", label: "Phone" },
              { key: "shopName", label: "Shop Name" },
              { key: "shopLocation", label: "Shop Location" },
              { key: "serviceType", label: "Service Type" },
              { key: "experience", label: "Experience" },
            ]}
            showAddButton
          />
        )}

        {/* TECHNICIANS PAGE */}
        {active === "Technicians" && (
          <EntityTable
            entity="technicians"
            columns={[
              { key: "name", label: "Name" },
              { key: "email", label: "Email" },
              { key: "phone", label: "Phone" },
              { key: "skill", label: "Skill" },
              { key: "experience", label: "Experience" },
            ]}
            showAddButton
          />
        )}
      </main>
    </div>
  );
}

/* ========== STAT CARD ========== */
function StatCard({
  icon: Icon,
  label,
  value,
  onClick,
}: {
  icon: any;
  label: string;
  value: any;
  onClick?: () => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      onClick={onClick}
      className="cursor-pointer p-6 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl shadow-md hover:shadow-lg transition"
    >
      <Icon className="w-8 h-8 text-[var(--accent)] mb-3" />
      <p className="text-sm text-[var(--secondary)]">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </motion.div>
  );
}

/* ========== ENTITY TABLE (Users / Vendors / Technicians) ========== */
function EntityTable({
  entity,
  columns,
  showAddButton = false,
}: {
  entity: "users" | "vendors" | "technicians";
  columns: Column[];
  showAddButton?: boolean;
}) {
  const { data, mutate } = useSWR(`/api/admin/${entity}`, (u) => fetch(u).then((r) => r.json()));
  const rows: any[] = data?.success ? data.data : [];
  const [showModal, setShowModal] = useState(false);

  // default form setup
  const [form, setForm] = useState<any>(
    entity === "users"
      ? { username: "", email: "", password: "", phone: "", address: "" }
      : entity === "vendors"
      ? {
          username: "", // ✅ changed ownerName → username
          email: "",
          password: "",
          phone: "",
          shopName: "",
          shopLocation: "",
          serviceType: "",
          experience: "",
        }
      : { name: "", email: "", password: "", phone: "", skill: "", experience: "" }
  );

  // SAVE (edit)
  const onSave = async (id: number, updates: any) => {
    const res = await fetch(`/api/admin/${entity}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    }).then((r) => r.json());
    if (res.success) mutate();
  };

  // DELETE
  const onDelete = async (id: number) => {
    if (confirm("⚠️ Are you sure you want to delete this record?")) {
      const res = await fetch(`/api/admin/${entity}?id=${id}`, { method: "DELETE" }).then((r) =>
        r.json()
      );
      if (res.success) mutate();
    }
  };

  // ADD
  const onAdd = async () => {
    const res = await fetch(`/api/admin/${entity}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).then((r) => r.json());
    if (res.success) {
      alert(`✅ ${entity} added successfully!`);
      setShowModal(false);
      mutate();
    } else {
      alert(`❌ Failed to add ${entity}: ${res.message || res.error}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-[var(--card-bg)] border border-[var(--card-border)] p-6 rounded-xl shadow-lg"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold capitalize">{entity}</h2>
        {showAddButton && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[var(--accent)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 transition"
          >
            <Plus className="w-4 h-4" /> Add{" "}
            {entity === "users" ? "User" : entity === "vendors" ? "Vendor" : "Technician"}
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5">
            <tr>
              <th className="px-4 py-3">#</th>
              {columns.map((c) => (
                <th key={c.key} className="px-4 py-3">
                  {c.label}
                </th>
              ))}
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows?.map((row: any, index: number) => (
              <EditableRow
                key={row.id}
                row={row}
                columns={columns}
                index={index + 1}
                onSave={onSave}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {!rows?.length && <p className="text-[var(--secondary)] mt-4">No records found.</p>}

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white text-black p-6 rounded-xl w-[400px] shadow-2xl">
            <h3 className="text-lg font-bold mb-4">Add New {entity}</h3>
            {Object.keys(form).map((key) => (
              <input
                key={key}
                type={key === "password" ? "password" : "text"}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                className="w-full border rounded-md px-3 py-2 mb-2 text-sm"
                value={form[key] ?? ""}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            ))}
            <p className="text-xs text-gray-500 mt-1 mb-2">
              💡 Leave blank to use default password: <b>12345</b>
            </p>
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-2 rounded-md border border-gray-400 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={onAdd}
                className="px-4 py-2 rounded-md bg-[var(--accent)] text-white text-sm hover:bg-opacity-90"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* ========== EDITABLE ROW ========== */
function EditableRow({
  row,
  columns,
  index,
  onSave,
  onDelete,
}: {
  row: any;
  columns: Column[];
  index: number;
  onSave: (id: number, updates: any) => void;
  onDelete: (id: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>(row);

  return (
    <tr className="border-t border-[var(--card-border)]">
      <td className="px-4 py-3 font-medium">{index}</td>
      {columns.map((col) => (
        <td key={col.key} className="px-4 py-3">
          {editing ? (
            <input
              className="w-full bg-white/10 border border-[var(--card-border)] rounded px-2 py-1 outline-none text-white"
              value={form[col.key] ?? ""}
              onChange={(e) => setForm({ ...form, [col.key]: e.target.value })}
            />
          ) : (
            <span className="text-[var(--secondary)]">{row[col.key] ?? "-"}</span>
          )}
        </td>
      ))}
      <td className="px-4 py-3 flex gap-2">
        {!editing ? (
          <>
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1 px-3 py-1 text-xs rounded-md border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition"
            >
              <Edit3 className="w-3 h-3" /> Edit
            </button>
            <button
              onClick={() => onDelete(row.id)}
              className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-md text-xs hover:bg-red-700"
            >
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onSave(row.id, form);
                setEditing(false);
              }}
              className="btn-accent px-3 py-1 rounded-md text-xs bg-[var(--accent)] text-white"
            >
              Save
            </button>
            <button
              onClick={() => {
                setForm(row);
                setEditing(false);
              }}
              className="px-3 py-1 rounded-md text-xs border border-[var(--card-border)] text-[var(--secondary)]"
            >
              Cancel
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
