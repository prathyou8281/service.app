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
} from "lucide-react";

const services = [
  {
    title: "Refurbished Laptops",
    description: "Budget-friendly, tested, warranty-backed.",
    icon: Laptop,
    href: "/services/refurbished-laptops",
  },
  {
    title: "New Laptops",
    description: "Latest models with official warranty.",
    icon: Laptop,
    href: "/services/new-laptops",
  },
  {
    title: "Custom Gaming PCs",
    description: "RGB builds tuned for performance.",
    icon: Monitor,
    href: "/services/custom-gaming-pcs",
  },
  {
    title: "Laptop/PC Service & Repair",
    description: "Screen, battery, keyboard, thermal, motherboard & more.",
    icon: Wrench,
    href: "/services/repair-service",
  },
  {
    title: "Data Recovery",
    description: "Recover data from HDD/SSD/USB — secure & private.",
    icon: Database,
    href: "/services/data-recovery",
  },
  {
    title: "Software & OS Installation",
    description: "Windows, drivers, Office, antivirus, backups.",
    icon: HardDrive,
    href: "/services/software-os-installation",
  },
  {
    title: "Networking & Wi-Fi Setup",
    description: "Router config, office/home networks, cabling.",
    icon: Router,
    href: "/services/networking",
  },
  {
    title: "CCTV Installation",
    description: "Indoor/outdoor cameras, DVR/NVR, remote view.",
    icon: Camera,
    href: "/services/cctv-installation",
  },
  {
    title: "Printer Service & Toner Refill",
    description: "Laser/inkjet repairs, AMC, refills & spares.",
    icon: Printer,
    href: "/services/printer-service",
  },
  {
    title: "Accessories & Upgrades",
    description: "RAM, SSDs, GPUs, keyboards, headsets & more.",
    icon: Package,
    href: "/services/accessories-upgrades",
  },
  {
    title: "UPS & Inverters (Servosonic)",
    description: "Home/office power backup — sales & service.",
    icon: Battery,
    href: "/services/ups-inverter-servosonic",
  },
  {
    title: "Annual Maintenance Contract (AMC)",
    description: "Proactive care for businesses & schools.",
    icon: ShieldCheck,
    href: "/services/amc",
  },
];

export default function ExploreServices() {
  return (
    <div className="page-explore py-16 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-5xl font-extrabold drop-shadow-lg mb-4">
          Explore Our <span className="text-accent">Services</span>
        </h1>
        <p className="text-lg text-secondary max-w-2xl mx-auto mb-12">
          Sales • Setup • Repairs • Upgrades • Power Backup • Business AMC
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, idx) => (
            <Link key={service.href} href={service.href}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="card p-8 cursor-pointer group"
              >
                <div className="flex justify-center items-center mb-6">
                  <service.icon className="w-14 h-14 text-accent group-hover:text-foreground transition-colors" />
                </div>
                <h2 className="text-2xl font-bold mb-3">{service.title}</h2>
                <p className="text-secondary">{service.description}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
