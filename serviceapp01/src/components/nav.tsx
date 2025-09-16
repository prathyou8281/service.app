"use client";

import Image from "next/image";
import { useState } from "react";

export default function TopNav({
  logoSrc = "/logo.png",
  logoAlt = "Brand Logo",
}: {
  logoSrc?: string;
  logoAlt?: string;
}) {
  const [open, setOpen] = useState(false);

  // Static labels only (no routes)
  const navItems: { label: string }[] = [
    { label: "Home" },
    { label: "Products" },
    { label: "About" },
    { label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-blue-100 backdrop-blur supports-[backdrop-filter]:bg-blue-100/90 dark:border-white/10 dark:bg-blue-900/70">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8"
        aria-label="Top Navigation"
      >
        {/* Left: Logo (no link) */}
        <div className="flex items-center gap-3" aria-label="Brand">
          <Image
            src={logoSrc}
            alt={logoAlt}
            width={36}
            height={36}
            className="h-9 w-9 rounded-xl object-contain"
            priority
          />
          <span className="hidden text-base font-semibold tracking-tight text-foreground sm:inline">
            Your Brand
          </span>
        </div>

        {/* Center: Static nav items */}
        <div className="mx-auto hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right: Auth buttons */}
        <div className="ml-auto hidden items-center gap-3 md:flex">
          <button
            type="button"
            className="rounded-xl border border-black/10 px-3 py-1.5 text-sm font-medium text-foreground/90 shadow-sm transition hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/5"
          >
            Login
          </button>
          <button
            type="button"
            className="rounded-xl bg-indigo-600 px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            Register
          </button>
        </div>

        {/* Mobile: Menu button */}
        <div className="ml-auto md:hidden">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
            className="inline-flex items-center justify-center rounded-xl border border-black/10 p-2 text-foreground/80 shadow-sm transition hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/5"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {open ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu panel (static buttons) */}
      <div
        id="mobile-menu"
        className={`md:hidden ${
          open ? "block" : "hidden"
        } border-t border-black/5 bg-blue-100/95 backdrop-blur dark:border-white/10 dark:bg-blue-900/90`}
      >
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                className="rounded-lg px-2 py-2 text-left text-sm font-medium text-foreground/80 transition-colors hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
              >
                {item.label}
              </button>
            ))}
            <div className="mt-2 flex items-center gap-2 pt-2">
              <button
                type="button"
                className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-center text-sm font-medium text-foreground/90 shadow-sm transition hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/5"
              >
                Login
              </button>
              <button
                type="button"
                className="flex-1 rounded-lg bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
