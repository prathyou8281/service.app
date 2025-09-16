"use client";

import Image from "next/image";

export default function Footer({
  logoSrc = "/logo.png",
  logoAlt = "Brand Logo",
  brandName = "Your Brand",
}: {
  logoSrc?: string;
  logoAlt?: string;
  brandName?: string;
}) {
  const year = new Date().getFullYear();

  const linkClass =
    "text-sm text-foreground/80 hover:text-foreground transition-colors";
  const titleClass =
    "text-sm font-semibold tracking-tight text-foreground mb-3";

  return (
    <footer className="border-t border-black/5 bg-blue-50/70 backdrop-blur supports-[backdrop-filter]:bg-blue-50/80 dark:border-white/10 dark:bg-neutral-950/70">
      {/* Top */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-3">
              <Image
                src={logoSrc}
                alt={logoAlt}
                width={40}
                height={40}
                className="h-10 w-10 rounded-xl object-contain"
              />
              <span className="text-base font-semibold tracking-tight text-foreground">
                {brandName}
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-foreground/70">
              We craft reliable tech experiences — modern apps, premium devices,
              and friendly support. Let’s build something great together.
            </p>

            {/* Socials */}
            <div className="mt-5 flex items-center gap-3">
              <a
                href="#"
                aria-label="Visit us on X"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 bg-white/70 shadow-sm hover:bg-white dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
              >
                {/* X / Twitter */}
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-4 w-4"
                  fill="currentColor"
                >
                  <path d="M18.244 2H21l-6.53 7.46L22 22h-6.9l-4.34-5.71L5.6 22H3l7.03-8.03L2 2h6.9l3.96 5.26L18.244 2Zm-2.41 18h2.29L8.27 4h-2.3l9.86 16Z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Visit us on Instagram"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 bg-white/70 shadow-sm hover:bg-white dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
              >
                {/* Instagram */}
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-4 w-4"
                  fill="currentColor"
                >
                  <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5a5.5 5.5 0 1 1 0 11.001 5.5 5.5 0 0 1 0-11Zm0 2a3.5 3.5 0 1 0 .001 7.001A3.5 3.5 0 0 0 12 9.5Zm5.75-.25a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Visit us on Facebook"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 bg-white/70 shadow-sm hover:bg-white dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
              >
                {/* Facebook */}
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-4 w-4"
                  fill="currentColor"
                >
                  <path d="M13.5 9H16V6h-2.5C11.57 6 10 7.57 10 9.5V11H8v3h2v7h3v-7h2.09L15.5 11H13v-1.5c0-.28.22-.5.5-.5Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h4 className={titleClass}>Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className={linkClass}>About</a></li>
                <li><a href="#" className={linkClass}>Careers</a></li>
                <li><a href="#" className={linkClass}>Press</a></li>
                <li><a href="#" className={linkClass}>Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className={titleClass}>Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className={linkClass}>Blog</a></li>
                <li><a href="#" className={linkClass}>Guides</a></li>
                <li><a href="#" className={linkClass}>Docs</a></li>
                <li><a href="#" className={linkClass}>Community</a></li>
              </ul>
            </div>

            <div>
              <h4 className={titleClass}>Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className={linkClass}>Help Center</a></li>
                <li><a href="#" className={linkClass}>Status</a></li>
                <li><a href="#" className={linkClass}>Privacy</a></li>
                <li><a href="#" className={linkClass}>Terms</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter */}
       
      </div>

      {/* Bottom bar */}
      <div className="border-t border-black/5 bg-blue-100/70 dark:border-white/10 dark:bg-neutral-950/80">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-xs text-foreground/70">
            © {year} {brandName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-xs text-foreground/70 hover:text-foreground">Privacy</a>
            <span className="h-3 w-px bg-foreground/20" />
            <a href="#" className="text-xs text-foreground/70 hover:text-foreground">Terms</a>
            <span className="h-3 w-px bg-foreground/20" />
            <a href="#" className="text-xs text-foreground/70 hover:text-foreground">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
