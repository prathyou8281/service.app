"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Nav({
  logoSrc = "/images/logo.webp",
  logoAlt = "ServiceApp Logo",
}: {
  logoSrc?: string;
  logoAlt?: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/home" },
    { label: "Products", href: "/products" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-indigo-700/90 backdrop-blur shadow-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo */}
        <Link href="/home" className="flex items-center gap-2">
          <Image
            src={logoSrc}
            alt={logoAlt}
            width={36}
            height={36}
            className="h-9 w-9 rounded-xl object-contain"
            priority
          />
          <span className="text-base font-semibold text-white hidden sm:inline">
            ServiceApp
          </span>
        </Link>

        {/* Center: Desktop Nav */}
        <div className="hidden md:flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-white/80 hover:text-white transition"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right: Desktop Auth */}
        <div className="hidden md:flex gap-3">
          <Link
            href="/user/login"
            className="rounded-xl border border-white/30 px-3 py-1.5 text-sm text-white shadow hover:bg-white/10 transition"
          >
            Login
          </Link>
          <Link
            href="/user/register"
            className="rounded-xl bg-pink-500 px-3.5 py-1.5 text-sm font-semibold text-white shadow hover:bg-pink-400 transition"
          >
            Register
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-indigo-800/95 backdrop-blur px-6 py-4 space-y-4">
          {/* Nav Items */}
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="block text-sm font-medium text-white/90 hover:text-white transition"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="border-t border-white/20 pt-4 flex flex-col gap-3">
            <Link
              href="/user/login"
              className="rounded-xl border border-white/30 px-3 py-2 text-sm text-white text-center shadow hover:bg-white/10 transition"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/user/register"
              className="rounded-xl bg-pink-500 px-3 py-2 text-sm font-semibold text-white text-center shadow hover:bg-pink-400 transition"
              onClick={() => setMenuOpen(false)}
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
