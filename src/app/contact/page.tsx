"use client";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <main className="min-h-screen flex flex-col items-center px-6 md:px-20 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl text-center"
      >
        <h1 className="text-4xl font-bold mb-4 text-primary">Contact Us</h1>
        <p className="text-lg opacity-80 mb-6">
          Have questions or want to start a project? We’d love to hear from you!
        </p>
        <div className="text-sm opacity-80 space-y-2">
          <p>📧 support@yourbrand.com</p>
          <p>📍 Kannur / Bangalore</p>
          <p>📞 +91 88920 06466</p>
        </div>
      </motion.div>
    </main>
  );
}
