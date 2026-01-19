"use client";
import { motion } from "framer-motion";

export default function CareersPage() {
  return (
    <main className="min-h-screen flex flex-col items-center px-6 md:px-20 py-20 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl"
      >
        <h1 className="text-4xl font-bold mb-4 text-primary">Join Our Team</h1>
        <p className="text-lg opacity-80">
          We’re always looking for talented designers, developers, and digital creators.
          Build the future with us and grow in a collaborative environment.
        </p>
      </motion.div>
    </main>
  );
}
