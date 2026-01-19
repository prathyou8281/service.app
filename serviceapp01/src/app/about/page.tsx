"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 md:px-20 py-20">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl w-full flex flex-col md:flex-row items-center gap-10"
      >
        {/* Left Text Content */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="text-primary">Our Service App</span>
          </h1>
          <p className="text-base md:text-lg leading-relaxed opacity-80">
            Welcome to our platform — where we connect users and vendors seamlessly.
            Our goal is to make service booking, vendor discovery, and customer
            management effortless and reliable. From personal tasks to professional
            projects, our app brings skilled service providers right to your fingertips.
          </p>

          <p className="text-base md:text-lg leading-relaxed opacity-80 mt-4">
            We believe in trust, transparency, and technology. With secure
            authentication, real-time updates, and user-friendly design, our
            platform ensures an outstanding experience for everyone — customers,
            vendors, and admins alike.
          </p>
        </div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex-1 flex justify-center"
        >
          <Image
            src="/images/logo.webp" // replace with your image path
            alt="About our service app"
            width={500}
            height={400}
            className="rounded-2xl shadow-lg object-cover"
          />
        </motion.div>
      </motion.section>

      {/* Mission & Vision Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-6xl w-full grid md:grid-cols-2 gap-10 mt-20"
      >
        <div className="p-8 bg-white/5 rounded-2xl shadow-md backdrop-blur-md">
          <h2 className="text-2xl font-semibold mb-3 text-primary">Our Mission</h2>
          <p className="text-base leading-relaxed opacity-80">
            To empower people and businesses by simplifying how services are
            discovered and delivered through technology, trust, and innovation.
          </p>
        </div>

        <div className="p-8 bg-white/5 rounded-2xl shadow-md backdrop-blur-md">
          <h2 className="text-2xl font-semibold mb-3 text-primary">Our Vision</h2>
          <p className="text-base leading-relaxed opacity-80">
            To become the most trusted service app where customers and vendors
            connect effortlessly — creating opportunities, growth, and satisfaction
            for all.
          </p>
        </div>
      </motion.section>
    </main>
  );
}
