"use client";

import { motion } from "framer-motion";
import Link from "next/link";
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
    description: "Certified, tested & budget-friendly with warranty.",
    icon: Laptop,
    href: "/services/refurbished-laptops",
  },
  {
    title: "New Laptops",
    description: "Latest models with full manufacturer warranty.",
    icon: Laptop,
    href: "/services/new-laptops",
  },
  {
    title: "Custom Gaming PCs",
    description: "Built for power — RGB, high FPS & cooling perfection.",
    icon: Monitor,
    href: "/services/custom-gaming-pcs",
  },
  {
    title: "Laptop & PC Service",
    description: "Screen, keyboard, battery, motherboard & more.",
    icon: Wrench,
    href: "/services/repair-service",
  },
  {
    title: "Data Recovery",
    description: "Recover lost data from HDD, SSD, USB & memory cards.",
    icon: Database,
    href: "/services/data-recovery",
  },
  {
    title: "Software & OS Installation",
    description: "Windows, drivers, antivirus & optimization setup.",
    icon: HardDrive,
    href: "/services/software-os-installation",
  },
  {
    title: "Networking & Wi-Fi Setup",
    description: "Home/office network cabling, routers & connections.",
    icon: Router,
    href: "/services/networking",
  },
  {
    title: "CCTV Installation",
    description: "Indoor/outdoor camera setup with mobile monitoring.",
    icon: Camera,
    href: "/services/cctv-installation",
  },
  {
    title: "Printer Service & Toner Refill",
    description: "Laser/inkjet repairs, refills & cartridge replacements.",
    icon: Printer,
    href: "/services/printer-service",
  },
  {
    title: "Accessories & Upgrades",
    description: "RAM, SSDs, GPUs, headsets, keyboards & more.",
    icon: Package,
    href: "/services/accessories-upgrades",
  },
  {
    title: "UPS & Inverters (Servosonic)",
    description: "Reliable power backup solutions for home & office.",
    icon: Battery,
    href: "/services/ups-inverter-servosonic",
  },
  {
    title: "AMC (Annual Maintenance)",
    description: "Proactive IT support for businesses & institutions.",
    icon: ShieldCheck,
    href: "/services/amc",
  },
  {
    title: "Mobile Repair & Accessories",
    description: "Display, battery, speaker & board-level repairs.",
    icon: Smartphone,
    href: "/services/mobile-repair",
  },
  {
    title: "Smart Home & Automation",
    description: "Smart lights, cameras, voice assistants & control systems.",
    icon: Home,
    href: "/services/smart-home",
  },
  {
    title: "Web Development & IT Solutions",
    description: "Websites, apps, and digital support for your business.",
    icon: Globe,
    href: "/services/web-development",
  },
  {
    title: "Car Wash & Detailing",
    description: "Premium car cleaning, polishing, and interior care.",
    icon: Car,
    href: "/services/car-wash",
  },
  {
    title: "Custom PC Builds for Creators",
    description: "Editing rigs with RTX GPUs, liquid cooling & silence kits.",
    icon: Cpu,
    href: "/services/creator-pc-builds",
  },
];

export default function ExploreServices() {
  return (
    <section className="py-20 px-6 bg-[var(--background)] text-[var(--foreground)] relative overflow-hidden">
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold mb-4"
        >
          Explore Our{" "}
          <span className="text-[var(--accent)]">Premium Services</span>
        </motion.h1>

        <p className="text-[var(--foreground)] text-lg max-w-2xl mx-auto mb-14">
          Everything your tech, home & business needs — all in one place.
        </p>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service, idx) => (
            <Link key={service.href} href={service.href}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="relative bg-white rounded-3xl p-[2px] shadow-lg hover:shadow-2xl transition-transform group border-2 border-[var(--accent)]"
              >
                <div className="bg-[var(--card-bg)] rounded-3xl p-8 h-full text-center group-hover:bg-[var(--card-hover-bg)] transition-all">
                  <div className="flex justify-center mb-6">
                    <service.icon className="w-14 h-14 text-[var(--accent)] group-hover:scale-110 transition-transform drop-shadow-lg" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3">{service.title}</h2>
                  <p className="text-[var(--foreground)] text-sm">{service.description}</p>
                  <div className="mt-6 text-sm font-semibold text-[var(--accent)] group-hover:text-[var(--foreground)]">
                    View Details →
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
