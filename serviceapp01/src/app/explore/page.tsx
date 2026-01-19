"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Laptop,
  Monitor,
  Wrench,
  Database,
  HardDrive,
  Router,
  Camera,
  Printer,
  Package,
  Battery,
  ShieldCheck,
  Smartphone,
  Home,
  Globe,
  Car,
  Cpu,
} from "lucide-react";

const services = [
  {
    title: "Refurbished Laptops",
    description: "Certified laptops with warranty at affordable prices.",
    icon: Laptop,
    slug: "refurbished-laptops",
  },
  {
    title: "New Laptops",
    description: "Latest branded laptops with full manufacturer warranty.",
    icon: Laptop,
    slug: "new-laptops",
  },
  {
    title: "Custom Gaming PCs",
    description: "High-performance gaming builds with RGB & cooling.",
    icon: Monitor,
    slug: "custom-gaming-pcs",
  },
  {
    title: "Laptop & PC Repair",
    description: "Screen, battery, keyboard & motherboard repairs.",
    icon: Wrench,
    slug: "repair-service",
  },
  {
    title: "Data Recovery",
    description: "Recover data from HDD, SSD, USB & memory cards.",
    icon: Database,
    slug: "data-recovery",
  },
  {
    title: "Software & OS Installation",
    description: "Windows, drivers, antivirus & optimization services.",
    icon: HardDrive,
    slug: "software-os-installation",
  },
  {
    title: "Networking & Wi-Fi Setup",
    description: "Home & office networking with secure configuration.",
    icon: Router,
    slug: "networking",
  },
  {
    title: "CCTV Installation",
    description: "Indoor & outdoor CCTV with mobile access.",
    icon: Camera,
    slug: "cctv-installation",
  },
  {
    title: "Printer Service",
    description: "Printer repair, toner refill & cartridge replacement.",
    icon: Printer,
    slug: "printer-service",
  },
  {
    title: "Accessories & Upgrades",
    description: "RAM, SSD, GPU & performance upgrades.",
    icon: Package,
    slug: "accessories-upgrades",
  },
  {
    title: "UPS & Inverters",
    description: "Reliable power backup solutions for homes & offices.",
    icon: Battery,
    slug: "ups-inverter",
  },
  {
    title: "Annual Maintenance (AMC)",
    description: "Proactive IT support plans for businesses.",
    icon: ShieldCheck,
    slug: "amc",
  },
  {
    title: "Mobile Repair",
    description: "Display, battery & board-level mobile repairs.",
    icon: Smartphone,
    slug: "mobile-repair",
  },
  {
    title: "Smart Home Automation",
    description: "Smart lights, cameras & automation systems.",
    icon: Home,
    slug: "smart-home",
  },
  {
    title: "Web Development & IT",
    description: "Websites, apps & digital IT solutions.",
    icon: Globe,
    slug: "web-development",
  },
  {
    title: "Car Wash & Detailing",
    description: "Professional car wash & interior detailing.",
    icon: Car,
    slug: "car-wash",
  },
  {
    title: "Creator PC Builds",
    description: "Editing rigs for designers & video creators.",
    icon: Cpu,
    slug: "creator-pc-builds",
  },
];

export default function ExploreServices() {
  const router = useRouter();

  const handleBook = (slug: string) => {
    const userData = localStorage.getItem("userData");

    if (!userData) {
      router.push(`/login?redirect=book-service&service=${slug}`);
      return;
    }

    router.push(`/book-service?service=${slug}`);
  };

  return (
    <section className="min-h-screen px-6 py-20 bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Professional Services for{" "}
            <span className="text-[var(--accent)]">Everyday Needs</span>
          </h1>

          <p className="mt-4 max-w-3xl mx-auto text-lg text-[var(--secondary)]">
            From laptop repairs and IT solutions to smart homes and car care —  
            book trusted services instantly with transparent pricing and expert support.
          </p>
        </motion.div>

        {/* SERVICES GRID */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service, idx) => (
            <motion.div
              key={service.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.04 }}
              viewport={{ once: true }}
              className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 shadow-md hover:shadow-xl transition flex flex-col"
            >
              {/* ICON */}
              <div className="w-14 h-14 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center mb-5">
                <service.icon className="w-7 h-7 text-[var(--accent)]" />
              </div>

              {/* CONTENT */}
              <h2 className="text-xl font-bold mb-2">{service.title}</h2>
              <p className="text-sm text-[var(--secondary)] flex-1">
                {service.description}
              </p>

              {/* ACTIONS */}
              <div className="mt-6 flex gap-3">
                <Link
                  href={`/services/${service.slug}`}
                  className="flex-1 text-center text-sm font-semibold rounded-xl border border-[var(--card-border)] py-2 hover:bg-white/5 transition"
                >
                  View Details
                </Link>

                <button
                  onClick={() => handleBook(service.slug)}
                  className="flex-1 text-sm font-semibold rounded-xl bg-[var(--accent)] text-white py-2 hover:opacity-90 transition"
                >
                  Book Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
