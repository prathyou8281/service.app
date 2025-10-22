"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import {
  BarChart3, Users, Settings, Package, LogOut, LayoutDashboard, Store, Wrench
} from "lucide-react";
import ProfileDropdown from "@/components/ProfileDropdown/ProfileDropdown";
import { motion } from "framer-motion";

const fetcher = (url:string) => fetch(url).then(r => r.json());

type Metrics = { users:number; vendors:number; technicians:number; };

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ username:string; role:string } | null>(null);
  const [active, setActive] = useState<"Dashboard" | "Users" | "Vendors" | "Technicians" | "Settings">("Dashboard");

  useEffect(() => {
    const data = localStorage.getItem("userData");
    if (!data) router.push("/login");
    const parsed = JSON.parse(data!);
    if (parsed.role !== "Admin") router.push("/login");
    setUser(parsed);
  }, [router]);

  const { data: metricsRes } = useSWR("/api/admin/metrics", fetcher, { refreshInterval: 10000 });
  const metrics: Metrics | null = metricsRes?.success ? metricsRes.data : null;

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-[var(--background)] text-[var(--foreground)] transition-all duration-500 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--card-bg)] border-r border-[var(--card-border)] p-6 hidden md:flex flex-col">
        <h1 className="text-2xl font-extrabold mb-8 text-[var(--accent)]">Admin Panel</h1>
        <nav className="space-y-3">
          {[
            { key:"Dashboard", icon: LayoutDashboard },
            { key:"Users", icon: Users },
            { key:"Vendors", icon: Store },
            { key:"Technicians", icon: Wrench },
            { key:"Settings", icon: Settings },
          ].map(({ key, icon:Icon }) => (
            <button
              key={key}
              onClick={() => setActive(key as any)}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left text-sm font-medium transition ${
                active === key ? "bg-[var(--accent)] text-white" : "text-[var(--secondary)] hover:bg-white/10"
              }`}
            >
              <Icon className="w-5 h-5" />
              {key}
            </button>
          ))}
        </nav>
        <button
          onClick={() => { localStorage.removeItem("userData"); router.push("/"); }}
          className="mt-auto flex items-center gap-2 text-sm text-[var(--secondary)] hover:text-[var(--accent)] transition"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 md:p-10">
        {/* Top bar */}
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-extrabold tracking-wide">{active}</h1>
          <div className="flex items-center gap-4">
            <ProfileDropdown />
            <button
              onClick={() => { localStorage.removeItem("userData"); router.push("/"); }}
              className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/30 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </header>

        {/* Views */}
        {active === "Dashboard" && (
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StatCard icon={BarChart3} label="Total Users" value={metrics?.users ?? "..."} />
            <StatCard icon={Users} label="Registered Vendors" value={metrics?.vendors ?? "..."} />
            <StatCard icon={Package} label="Technicians" value={metrics?.technicians ?? "..."} />
            <StatCard icon={Settings} label="System Settings" value="⚙️" />
          </motion.div>
        )}

        {active === "Users" && <EntityTable entity="users" columns={[
          { key:"username", label:"Username" },
          { key:"email", label:"Email" },
          { key:"role", label:"Role" },
          { key:"phone", label:"Phone" },
        ]} />}

        {active === "Vendors" && <EntityTable entity="vendors" columns={[
          { key:"shopName", label:"Shop" },
          { key:"ownerName", label:"Owner" },
          { key:"email", label:"Email" },
          { key:"phone", label:"Phone" },
          { key:"shopLocation", label:"Location" },
        ]} />}

        {active === "Technicians" && <EntityTable entity="technicians" columns={[
          { key:"name", label:"Name" },
          { key:"email", label:"Email" },
          { key:"phone", label:"Phone" },
          { key:"skill", label:"Skill" },
          { key:"experience", label:"Experience" },
        ]} />}

        {active === "Settings" && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.4}}
            className="bg-[var(--card-bg)] border border-[var(--card-border)] p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">System Settings</h2>
            <p className="text-[var(--secondary)]">Add your configuration controls here.</p>
          </motion.div>
        )}
      </main>
    </div>
  );
}

/* ---------- UI bits ---------- */

function StatCard({ icon:Icon, label, value }:{icon:any; label:string; value:any}) {
  return (
    <motion.div whileHover={{ scale: 1.04 }}
      className="p-6 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl shadow-md hover:shadow-lg transition">
      <Icon className="w-8 h-8 text-[var(--accent)] mb-3" />
      <p className="text-sm text-[var(--secondary)]">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </motion.div>
  );
}

type Column = { key:string; label:string; };

function EntityTable({ entity, columns }:{ entity:"users"|"vendors"|"technicians"; columns:Column[] }) {
  const { data, mutate } = useSWR(`/api/admin/${entity}`, (u)=>fetch(u).then(r=>r.json()));
  const rows:any[] = data?.success ? data.data : [];

  const onSave = async (id:number, updates:any) => {
    const res = await fetch(`/api/admin/${entity}`, {
      method:"PUT",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ id, ...updates }),
    }).then(r=>r.json());
    if (res.success) mutate(); // refresh table
  };

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.4}}
      className="bg-[var(--card-bg)] border border-[var(--card-border)] p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4 capitalize">{entity}</h2>

      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5">
            <tr>
              <th className="px-4 py-3">ID</th>
              {columns.map(c => <th key={c.key} className="px-4 py-3">{c.label}</th>)}
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows?.map((row:any) => (
              <EditableRow key={row.id} row={row} columns={columns} onSave={onSave} />
            ))}
          </tbody>
        </table>
      </div>

      {!rows?.length && (
        <p className="text-[var(--secondary)] mt-4">No records found.</p>
      )}
    </motion.div>
  );
}

function EditableRow({ row, columns, onSave }:{
  row:any; columns:Column[]; onSave:(id:number, updates:any)=>void;
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>(row);

  return (
    <tr className="border-t border-[var(--card-border)]">
      <td className="px-4 py-3">{row.id}</td>
      {columns.map(col => (
        <td key={col.key} className="px-4 py-3">
          {editing ? (
            <input
              className="w-full bg-white/10 border border-[var(--card-border)] rounded px-2 py-1 outline-none"
              value={form[col.key] ?? ""}
              onChange={(e)=>setForm({ ...form, [col.key]: e.target.value })}
            />
          ) : (
            <span className="text-[var(--secondary)]">{row[col.key] ?? "-"}</span>
          )}
        </td>
      ))}
      <td className="px-4 py-3">
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="btn-accent px-3 py-1 rounded-md text-xs"
          >
            Edit
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => { onSave(row.id, form); setEditing(false); }}
              className="btn-accent px-3 py-1 rounded-md text-xs"
            >
              Save
            </button>
            <button
              onClick={() => { setForm(row); setEditing(false); }}
              className="px-3 py-1 rounded-md text-xs border border-[var(--card-border)]"
            >
              Cancel
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
