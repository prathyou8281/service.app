"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { User, Settings, LogOut, Menu, X } from "lucide-react";

export default function Nav({
  logoSrc = "/images/logo.webp",
  logoAlt = "Logo",
}: {
  logoSrc?: string;
  logoAlt?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ username: string; email: string; role: string } | null>(null);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);

  // ✅ Pages where login/register buttons should be hidden
  const hideAuthButtons = [
    "/user/login",
    "/user/register",
    "/vendors",
    "/requests",
    "/orders",
    "/welcome",
    "/profile",
    "/admin/dashboard",
    "/vendor/dashboard",
    "/technician/dashboard",
  ].includes(pathname);

  // ✅ Pages that should display the profile icon (top-right avatar)
  const isProtectedPage = [
    "/welcome",
    "/admin/dashboard",
    "/vendor/dashboard",
    "/technician/dashboard",
  ].includes(pathname);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  // ✅ Load user info from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleMouseEnter = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setProfileOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => {
      setProfileOpen(false);
    }, 500);
  };

  // ✅ Logout user
  const handleLogout = () => {
    localStorage.removeItem("userData");
    router.push("/user/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-blue-100 backdrop-blur dark:bg-blue-900/70">
      <nav className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        {/* ✅ Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={logoSrc}
            alt={logoAlt}
            width={60}
            height={60}
            className="h-9 w-9 rounded-xl object-contain"
            priority
          />
        </Link>

        {/* ✅ Desktop nav items */}
        <div className="mx-auto hidden md:flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium hover:text-indigo-600 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* ✅ Right side */}
        <div className="ml-auto flex items-center gap-3 relative">
          {/* Desktop auth buttons */}
          {!hideAuthButtons && (
            <div className="hidden md:flex gap-3">
              <Link href="/login" className="rounded-xl border px-3 py-1.5 text-sm">
                Login
              </Link>
              <Link
                href="/user/register"
                className="rounded-xl bg-indigo-600 px-3.5 py-1.5 text-sm text-white"
              >
                Register
              </Link>
            </div>
          )}

          {/* ✅ Profile avatar shown on welcome/dashboard pages */}
          {isProtectedPage && (
            <div
              className="hidden md:block relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button className="flex items-center gap-3 rounded-full bg-white px-3 py-1.5 shadow-md hover:shadow-lg transition">
                <div className="relative">
                  <Image
                    src="/images/avatar.png"
                    alt="User Avatar"
                    width={60}
                    height={60}
                    className="rounded-full border-2 border-indigo-500"
                  />
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                </div>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-sm font-semibold text-gray-800 dark:text-white">
                    {user?.username || "Guest"}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.role || "Member"}
                  </span>
                </div>
                <svg
                  className="h-4 w-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* ✅ Dropdown Menu */}
              <div
                className={`absolute right-0 mt-2 w-52 rounded-xl bg-white shadow-xl ring-1 ring-black/10 dark:bg-gray-800 dark:text-white transform transition-all duration-300 origin-top ${
                  profileOpen
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }`}
              >
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-semibold">{user?.username || "Guest"}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.email || "guest@example.com"}
                  </p>
                </div>

                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <User className="h-4 w-4 text-indigo-600" />
                  My Profile
                </Link>

                <Link
                  href="/settings"
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Settings className="h-4 w-4 text-indigo-600" />
                  Settings
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LogOut className="h-4 w-4 text-red-500" />
                  Logout
                </button>
              </div>
            </div>
          )}

          {/* ✅ Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md border bg-white dark:bg-gray-700"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* ✅ Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 shadow-md border-t">
          <div className="flex flex-col gap-3 p-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {!hideAuthButtons && (
              <>
                <Link
                  href="/login"
                  className="rounded-xl border px-3 py-1.5 text-sm text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl bg-indigo-600 px-3.5 py-1.5 text-sm text-white text-center"
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
