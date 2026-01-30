"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Users, Briefcase, Wrench, ShieldCheck, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProfileDropdown from "@/components/ProfileDropdown/ProfileDropdown";

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("Auth sync error", e);
      }
    }
  }, [pathname]);

  useEffect(() => {
    setJoinOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const isDashboard = [
    "/admin/dashboard",
    "/vendor/dashboard",
    "/technician/dashboard",
  ].some(p => pathname.startsWith(p));

  if (isDashboard) return null;

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/explore" },
    { label: "Support", href: "/support" },
    { label: "About", href: "/about" },
  ];

  const goTo = (path: string) => {
    setJoinOpen(false);
    setMobileMenuOpen(false);
    router.push(path);
  };

  return (
    <>
      <header className="sticky top-0 z-[100] w-full bg-white border-b border-slate-200 h-20">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 lg:px-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <ShieldCheck className="text-white w-5 h-5 shadow-sm" />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-950">
              Service<span className="text-blue-600">Hub</span>
            </span>
          </Link>

          {/* Nav Links - Only show if NOT on a dashboard to keep it clean */}
          {!isDashboard && (
            <nav className="hidden lg:flex items-center gap-10">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-blue-600 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            {!user ? (
              <div className="hidden lg:flex items-center gap-6">
                <button
                  onClick={() => setJoinOpen(true)}
                  className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 flex items-center gap-2 group"
                >
                  <Zap className="w-3 h-3 text-amber-500 group-hover:animate-pulse" />
                  Partner Portal
                </button>
                <Link
                  href="/login"
                  className="btn-primary !py-2.5 !text-[10px] !px-8"
                >
                  Sign In
                </Link>
              </div>
            ) : (
              <ProfileDropdown user={user} />
            )}

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-900 bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[90] bg-white flex flex-col p-8 pt-24"
          >
            <div className="flex flex-col gap-6">
              {!isDashboard && navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-2xl font-black tracking-tighter text-slate-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <hr className="border-slate-100" />
              {!user ? (
                <div className="grid grid-cols-1 gap-4">
                  <button onClick={() => setJoinOpen(true)} className="btn-secondary w-full">Join as Partner</button>
                  <Link href="/login" className="btn-primary w-full text-center">Login</Link>
                </div>
              ) : (
                <button
                  onClick={() => {
                    localStorage.removeItem("userData");
                    window.location.href = "/";
                  }}
                  className="text-left py-4 text-red-500 font-black uppercase tracking-widest text-xs"
                >
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Join Popup */}
      <AnimatePresence>
        {joinOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/60 backdrop-blur-md px-4"
            onClick={() => setJoinOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[3rem] p-10 w-full max-w-lg shadow-2xl"
            >
              <h3 className="text-2xl font-black tracking-tight text-slate-900 mb-2">Partner With Us</h3>
              <p className="text-slate-500 text-sm font-medium mb-10">Choose your path to professional growth</p>

              <div className="grid grid-cols-1 gap-4">
                <OptionCard
                  icon={Briefcase}
                  title="Service Merchant"
                  desc="For repair shops and business owners"
                  onClick={() => goTo("/vendor/register")}
                />
                <OptionCard
                  icon={Wrench}
                  title="Field Technical Expert"
                  desc="For independent professionals"
                  onClick={() => goTo("/technician/register")}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function OptionCard({ icon: Icon, title, desc, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-5 p-6 rounded-3xl border border-slate-100 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 transition-all text-left group"
    >
      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-blue-600 transition-colors">
        <Icon className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
      </div>
      <div>
        <h4 className="font-black text-slate-900">{title}</h4>
        <p className="text-xs text-slate-500 font-medium">{desc}</p>
      </div>
    </button>
  );
}
