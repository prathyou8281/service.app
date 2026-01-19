"use client";
import { motion } from "framer-motion";

export default function PressPage() {
  return (
    <main className="min-h-screen flex flex-col items-center px-6 md:px-20 py-20 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl"
      >
        <h1 className="text-4xl font-bold mb-4 text-primary">Press & Media</h1>
        <p className="text-lg opacity-80">
          Explore our latest updates, announcements, and media coverage.
          For interviews or brand collaborations, contact our PR team.
        </p>
      </motion.div>
    </main>
  );
}
