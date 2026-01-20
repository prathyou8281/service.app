"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Users, Briefcase, Wrench } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Nav({
  logoSrc = "/images/logo.webp",
  logoAlt = "Logo",
}: {
  logoSrc?: string;
  logoAlt?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);

  /* 🔹 CLOSE POPUP AUTOMATICALLY ON ROUTE CHANGE */
  useEffect(() => {
    setJoinOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const hideAuthButtons = [
    "/vendors",
    "/requests",
    "/orders",
    "/profile",
    "/admin/dashboard",
    "/vendor/dashboard",
    "/technician/dashboard",
  ].includes(pathname);

  const showJoinButton = ["/", "/login", "/register", "/welcome"].includes(
    pathname
  );

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  /* 🔹 SAFE NAVIGATION HANDLER */
  const goTo = (path: string) => {
    setJoinOpen(false);
    setMobileMenuOpen(false);
    router.push(path);
  };

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full shadow-md"
        style={{ backgroundColor: "var(--accent)" }}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8 relative">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={60}
              height={60}
              className="h-10 w-10 rounded-xl object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="mx-auto hidden md:flex gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="font-semibold text-[var(--foreground)] hover:text-[var(--accent-hover)] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="ml-auto flex items-center gap-4">
            {/* ✅ Join With Us */}
            {showJoinButton && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden md:flex items-center gap-2 btn-primary px-6 py-2 text-sm font-semibold"
                onClick={() => setJoinOpen(true)}
              >
                <Users className="w-4 h-4" />
                Join With Us
              </motion.button>
            )}

            {!hideAuthButtons && (
              <div className="hidden md:flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary px-6 py-2 text-sm font-semibold"
                  onClick={() => goTo("/login")}
                >
                  Login
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary px-6 py-2 text-sm font-semibold"
                  onClick={() => goTo("/register")}
                >
                  Register
                </motion.button>
              </div>
            )}

            {/* Mobile Menu */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md border bg-white"
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white shadow-md border-t">
            <div className="flex flex-col gap-3 p-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="font-medium py-2 px-3 rounded hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {showJoinButton && (
                <button
                  className="btn-primary w-full"
                  onClick={() => {
                    setJoinOpen(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  Join With Us
                </button>
              )}

              {!hideAuthButtons && (
                <>
                  <Link
                    href="/login"
                    className="btn-secondary w-full text-center"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="btn-secondary w-full text-center"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ✅ JOIN WITH US POPUP */}
      <AnimatePresence>
        {joinOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setJoinOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-xl"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
                Join With Us
              </h3>

              <div className="space-y-4">
                <button
                  onClick={() => goTo("/vendor/register")}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border hover:bg-sky-50 transition"
                >
                  <Briefcase className="w-6 h-6 text-sky-600" />
                  <div className="text-left">
                    <p className="font-semibold">Become a Service Partner</p>
                    <p className="text-xs text-gray-500">
                      Grow your business with us
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => goTo("/technician/register")}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border hover:bg-sky-50 transition"
                >
                  <Wrench className="w-6 h-6 text-sky-600" />
                  <div className="text-left">
                    <p className="font-semibold">Join Our Technician Team</p>
                    <p className="text-xs text-gray-500">
                      Get jobs and manage tasks
                    </p>
                  </div>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
