"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const services = [
  {
    id: 1,
    name: "Website Development",
    description:
      "We craft fast, modern, and responsive websites that help your business grow online — from portfolio to e-commerce.",
    image: "/images/services/website-development.jpg",
    price: "Starting ₹4,999",
  },
  {
    id: 2,
    name: "Mobile App Development",
    description:
      "Build Android & iOS apps that are intuitive, high-performing, and aligned with your business goals.",
    image: "/images/services/app-development.jpg",
    price: "Starting ₹9,999",
  },
  {
    id: 3,
    name: "Digital Marketing",
    description:
      "Boost your online presence with result-driven SEO, social media campaigns, and targeted advertising.",
    image: "/images/services/digital-marketing.jpg",
    price: "Custom Plans",
  },
  {
    id: 4,
    name: "Branding & Graphic Design",
    description:
      "Create stunning visuals — logos, posters, and social media creatives that make your brand stand out.",
    image: "/images/services/graphic-design.jpg",
    price: "Starting ₹1,499",
  },
  {
    id: 5,
    name: "UI/UX Design",
    description:
      "Deliver seamless user experiences with modern interfaces, interactive prototypes, and strong visual flow.",
    image: "/images/services/ui-ux.jpg",
    price: "Starting ₹2,999",
  },
  {
    id: 6,
    name: "E-Commerce Solutions",
    description:
      "Get complete online store setup — from product management to secure payment gateways and analytics.",
    image: "/images/services/ecommerce.jpg",
    price: "Starting ₹7,999",
  },
];

export default function ProductsPage() {
  return (
    <main className="min-h-screen flex flex-col items-center px-6 md:px-20 py-20">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16 max-w-3xl"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Our <span className="text-primary">Services</span>
        </h1>
        <p className="text-lg opacity-80">
          We deliver high-quality digital solutions — from branding and design to
          full-stack development and marketing strategies that help your business
          shine online.
        </p>
      </motion.div>

      {/* Service Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl w-full">
        {services.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.6 }}
            className="bg-white/5 rounded-2xl shadow-lg backdrop-blur-md overflow-hidden hover:scale-105 transition-transform duration-300"
          >
            <div className="relative w-full h-56">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6 flex flex-col justify-between h-48">
              <div>
                <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                <p className="text-sm opacity-80 mb-4">{item.description}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-primary font-semibold">{item.price}</span>
                <button className="px-4 py-2 bg-primary text-white text-sm rounded-xl hover:opacity-90 transition">
                  Get Service
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
