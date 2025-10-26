"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Store } from "lucide-react";
import { motion } from "framer-motion";

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ Check login status
  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) setIsLoggedIn(true);
  }, []);

  // ✅ Pages where login/register buttons are hidden
  const hideAuthButtons = [
    "/vendors",
    "/requests",
    "/orders",
    "/welcome",
    "/profile",
    "/admin/dashboard",
    "/vendor/dashboard",
    "/technician/dashboard",
  ].includes(pathname);

  // ✅ Show “Become a Vendor” only on specific pages
  const showVendorButton =
    pathname === "/" || pathname === "/login" || pathname === "/register";

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header
      className="sticky top-0 z-50 w-full shadow-md"
      style={{ backgroundColor: "var(--accent)" }}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8 relative">
        {/* 🔹 Logo */}
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

        {/* 🔹 Desktop nav links */}
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

        {/* 🔹 Right side buttons */}
        <div className="ml-auto flex items-center gap-4">
          {/* ✅ Become a Vendor — Only on Home/Login/Register pages */}
          {showVendorButton && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:flex items-center gap-2 cursor-pointer bg-white/10 px-4 py-2 rounded-xl text-sm font-semibold text-white hover:bg-white/20 transition-colors"
              onClick={() => router.push("/vendor/register")}
            >
              <Store className="w-4 h-4" />
              <span>Become a Vendor</span>
            </motion.div>
          )}

          {/* ✅ Auth Buttons — hidden if logged in */}
          {!hideAuthButtons && !isLoggedIn && (
            <div className="hidden md:flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary px-6 py-2 text-sm font-semibold"
                onClick={() => router.push("/login")}
              >
                Login
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary px-6 py-2 text-sm font-semibold"
                onClick={() => router.push("/register")}
              >
                Register
              </motion.button>
            </div>
          )}

          {/* 🔹 Mobile Menu Button */}
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

      {/* 🔹 Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md border-t">
          <div className="flex flex-col gap-3 p-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[var(--foreground)] font-medium py-2 px-3 rounded hover:bg-[var(--accent-hover)]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {/* ✅ Mobile Become a Vendor */}
            {showVendorButton && (
              <Link
                href="/vendor/register"
                className="flex items-center gap-2 font-medium text-[var(--foreground)] py-2 px-3 rounded hover:bg-[var(--accent-hover)]"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Store className="w-4 h-4" />
                Become a Vendor
              </Link>
            )}

            {/* ✅ Hide auth buttons if logged in */}
            {!hideAuthButtons && !isLoggedIn && (
              <>
                <Link
                  href="/login"
                  className="btn-secondary w-full text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="btn-secondary w-full text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
