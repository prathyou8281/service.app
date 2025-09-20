"use client";

import { motion } from "framer-motion";
import { Sparkles, Laptop, Smartphone, Wrench, Cloud, Headphones } from "lucide-react";

const services = [
  {
    title: "Web Development",
    description: "Modern, fast, and scalable web applications tailored for your business.",
    icon: Laptop,
  },
  {
    title: "Mobile Apps",
    description: "Beautiful and functional mobile apps for Android & iOS platforms.",
    icon: Smartphone,
  },
  {
    title: "IT Support",
    description: "Reliable 24/7 support to keep your business running smoothly.",
    icon: Wrench,
  },
  {
    title: "Cloud Solutions",
    description: "Seamless cloud integration and management for modern enterprises.",
    icon: Cloud,
  },
  {
    title: "Customer Care",
    description: "Friendly and quick response team to solve your concerns.",
    icon: Headphones,
  },
  {
    title: "Creative Design",
    description: "Eye-catching designs to elevate your brand and engage your audience.",
    icon: Sparkles,
  },
];

export default function ExploreServices() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-16 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-5xl font-extrabold text-white drop-shadow-lg mb-4">
          Explore Our <span className="text-yellow-300">Services</span>
        </h1>
        <p className="text-lg text-gray-200 max-w-2xl mx-auto mb-12">
          We offer innovative and reliable services designed to meet your needs and grow your business.
        </p>

        {/* Services Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-lg hover:scale-105 transform transition-all cursor-pointer group"
            >
              <div className="flex justify-center items-center mb-6">
                <service.icon className="w-14 h-14 text-yellow-300 group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">{service.title}</h2>
              <p className="text-gray-200">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
