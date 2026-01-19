"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";

export default function RequestForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const vendor = searchParams.get("vendor");
  const category = searchParams.get("category");
  const location = searchParams.get("location");

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const newRequest = {
      name: formData.get("name"),
      email: formData.get("email"),
      details: formData.get("details"),
      vendor,
      category,
      location,
      date: new Date().toLocaleString(),
    };

    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem("orders") || "[]");
    localStorage.setItem("orders", JSON.stringify([...existing, newRequest]));

    setSubmitted(true);
  };

  // Redirect to /orders after 5 seconds
  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        router.push("/orders");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitted, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {!submitted && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-10 rounded-2xl shadow-2xl max-w-lg w-full"
        >
          <h1 className="text-3xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
            📑 Request Form
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                className="w-full p-3 border rounded-lg bg-gray-50 text-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                className="w-full p-3 border rounded-lg bg-gray-50 text-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Request Details
              </label>
              <textarea
                name="details"
                className="w-full p-3 border rounded-lg bg-gray-50 text-black"
                rows={4}
                required
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full py-3 rounded-xl text-white font-bold bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg"
            >
              ✅ Submit Request
            </motion.button>
          </form>
        </motion.div>
      )}

      {/* Success Popup */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full"
            >
              <h2 className="text-2xl font-bold text-green-600 mb-2">
                🎉 Success!
              </h2>
              <p className="text-gray-600">
                Redirecting to orders in 5 seconds...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
