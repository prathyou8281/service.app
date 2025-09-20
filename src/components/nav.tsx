"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { User, Settings, LogOut } from "lucide-react";

export default function Nav({
  logoSrc = "/images/logo.webp",
  logoAlt = "/commern/loading.svg",
}: {
  logoSrc?: string;
  logoAlt?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);

  const hideAuthButtons = ["/user/login", "/user/register"].includes(pathname);
  const isWelcomePage = pathname === "/welcome";

  const navItems = [
    { label: "Home", href: "/home" },
    { label: "Products", href: "/products" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const handleMouseEnter = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setProfileOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => {
      setProfileOpen(false);
    }, 500);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-blue-100 backdrop-blur dark:bg-blue-900/70">
      <nav className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/home" className="flex items-center gap-3">
          <Image
            src={logoSrc}
            alt={logoAlt}
            width={36}
            height={36}
            className="h-9 w-9 rounded-xl object-contain"
            priority
          />
          <span className="hidden text-base font-semibold sm:inline">
            


            
          </span>
        </Link>

        {/* Nav items */}
        <div className="mx-auto hidden md:flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="ml-auto hidden md:flex gap-3 relative">
          {!hideAuthButtons && !isWelcomePage && (
            <>
              <Link
                href="/user/login"
                className="rounded-xl border px-3 py-1.5 text-sm"
              >
                Login
              </Link>
              <Link
                href="/user/register"
                className="rounded-xl bg-indigo-600 px-3.5 py-1.5 text-sm text-white"
              >
                Register
              </Link>
            </>
          )}

          {isWelcomePage && (
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {/* Creative Profile Button */}
              <button className="flex items-center gap-3 rounded-full bg-white px-3 py-1.5 shadow-md hover:shadow-lg transition">
                {/* Avatar with status dot */}
                <div className="relative">
                  <Image
                    src="/images/avatar.png" // 👈 replace with real user avatar
                    alt="User Avatar"
                    width={32}
                    height={32}
                    className="rounded-full border-2 border-indigo-500"
                  />
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                </div>
                {/* Name + role */}
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-sm font-semibold text-gray-800 dark:text-white">
                    John Doe
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Member
                  </span>
                </div>
                {/* Arrow */}
                <svg
                  className="h-4 w-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown with infographic style */}
              
              <div
                className={`absolute right-0 mt-2 w-52 rounded-xl bg-white shadow-xl ring-1 ring-black/10 dark:bg-gray-800 dark:text-white transform transition-all duration-300 origin-top ${
                  profileOpen
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }`}
              >
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-semibold">John Doe</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    johndoe@email.com
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
                  onClick={() => router.push("/home")}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LogOut className="h-4 w-4 text-red-500" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
