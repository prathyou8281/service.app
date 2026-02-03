"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Users, Briefcase, Wrench, ShieldCheck, Zap, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProfileDropdown from "@/components/ProfileDropdown/ProfileDropdown";

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      <header
        className={`sticky top-0 z-[100] w-full transition-all duration-500 border-b ${scrolled
            ? "h-16 bg-[#05070a] border-white/5 shadow-2xl"
            : "h-20 bg-[#05070a] border-white/5"
          }`}
      >
        <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between px-6 lg:px-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <span className={`text-2xl font-black tracking-tighter text-white`}>
              Service<span className="text-blue-500">Hub</span>
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-10">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`group relative text-[11px] font-bold uppercase tracking-[0.2em] transition-colors ${pathname === item.href ? "text-white" : "text-slate-400 hover:text-white"
                  }`}
              >
                {item.label}
                <span className={`absolute -bottom-1 left-0 h-[2px] bg-blue-500 transition-all duration-300 ${pathname === item.href ? "w-full" : "w-0 group-hover:w-full"
                  }`} />
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-8">
            {!user ? (
              <div className="hidden lg:flex items-center gap-8">
                <button
                  onClick={() => setJoinOpen(true)}
                  className={`text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-blue-400 flex items-center gap-2.5 transition-all group`}
                >
                  <div className={`w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center transition-all group-hover:bg-blue-600/10 group-hover:border-blue-500/50`}>
                    <Zap className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                  </div>
                  Partner Portal
                </button>
                <Link
                  href="/login"
                  className="h-12 px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-[11px] font-bold uppercase tracking-widest flex items-center justify-center transition-all shadow-[0_10px_30px_-10px_rgba(37,99,235,0.5)] active:scale-95"
                >
                  Sign In
                </Link>
              </div>
            ) : (
              <ProfileDropdown user={user} scrolled={scrolled} />
            )}

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-3 rounded-xl transition-all ${mobileMenuOpen
                ? "bg-white/10 text-white"
                : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white"
                }`}
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
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[90] bg-[#05070a] flex flex-col p-10 pt-32"
          >
            {/* Background Decor for Mobile Menu */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 flex flex-col gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-4xl font-black tracking-tighter transition-colors ${pathname === item.href ? "text-blue-500" : "text-white"
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <div className="mt-10 pt-10 border-t border-white/5 flex flex-col gap-6">
                {!user ? (
                  <>
                    <button
                      onClick={() => setJoinOpen(true)}
                      className="h-14 w-full bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between px-6 text-white font-bold"
                    >
                      Partner Portal <ChevronRight className="w-5 h-5 text-blue-500" />
                    </button>
                    <Link
                      href="/login"
                      className="h-14 w-full bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black uppercase tracking-widest shadow-lg shadow-blue-900/40"
                    >
                      Login
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      localStorage.removeItem("userData");
                      window.location.href = "/";
                    }}
                    className="h-14 w-full bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center text-red-500 font-bold uppercase tracking-widest"
                  >
                    Logout
                  </button>
                )}
              </div>
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
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-xl px-4"
            onClick={() => setJoinOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0f172a] border border-white/10 rounded-[3rem] p-10 lg:p-14 w-full max-w-xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]" />

              <div className="relative z-10 text-center lg:text-left">
                <h3 className="text-3xl lg:text-4xl font-black tracking-tight text-white mb-3">Partner With Us</h3>
                <p className="text-slate-400 text-base font-medium mb-12">Choose your path to professional growth</p>

                <div className="grid grid-cols-1 gap-6">
                  <OptionCard
                    icon={Briefcase}
                    title="Service Merchant"
                    desc="For repair shops and business owners"
                    onClick={() => goTo("/vendor/register")}
                    theme="blue"
                  />
                  <OptionCard
                    icon={Wrench}
                    title="Field Technical Expert"
                    desc="For independent professionals"
                    onClick={() => goTo("/technician/register")}
                    theme="indigo"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function OptionCard({ icon: Icon, title, desc, onClick, theme }: any) {
  const accentColor = theme === 'blue' ? 'group-hover:bg-blue-600' : 'group-hover:bg-indigo-600';
  const iconColor = theme === 'blue' ? 'text-blue-400' : 'text-indigo-400';

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-6 p-7 rounded-[2rem] border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-left group relative"
    >
      <div className={`w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 transition-all duration-300 ${accentColor}`}>
        <Icon className={`w-6 h-6 transition-colors duration-300 ${iconColor} group-hover:text-white`} />
      </div>
      <div>
        <h4 className="font-bold text-xl text-white mb-1 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{title}</h4>
        <p className="text-sm text-slate-500 font-medium group-hover:text-slate-300 transition-colors">{desc}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-slate-700 ml-auto group-hover:text-white transition-all group-hover:translate-x-1" />
    </button>
  );
}
