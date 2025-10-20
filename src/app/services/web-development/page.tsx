"use client";
import { motion } from "framer-motion";

export default function WebDevelopmentPage() {
  return (
    <main className="min-h-screen flex flex-col items-center px-6 md:px-20 py-20 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl"
      >
        <h1 className="text-4xl font-bold mb-4 text-primary">Website Development</h1>
        <p className="text-lg opacity-80">
          We build fast, responsive, and SEO-friendly websites — from portfolios
          to full-scale e-commerce platforms. Your vision, our code.
        </p>
      </motion.div>
    </main>
  );
}
