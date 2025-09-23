"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

type Vendor = {
  id: number;
  name: string;
  category: string;
  location: string;
  description: string;
};

const vendors: Vendor[] = [
  { id: 1, name: "Pranav Car Dealership", category: "Car Dealing", location: "Kannur, Kerala", description: "Trusted car dealership with latest models and financing options." },
  { id: 2, name: "Computer Club", category: "Laptop & PC Sales", location: "Kannur, Kerala", description: "Affordable and high-performance laptops, gaming PCs, and IT support." },
  { id: 3, name: "Juishop", category: "Juice & Café", location: "Kannur, Kerala", description: "Refreshing juices, mocktails, and café vibes in the heart of Kannur." },
  { id: 4, name: "Crystal Optic", category: "Eyewear & Opticals", location: "Kannur, Kerala", description: "Premium glasses, lenses, and optical care for crystal-clear vision." },
  { id: 5, name: "Servosonic", category: "Inverters & UPS", location: "Kannur, Kerala", description: "Reliable power backup solutions with ISO certified quality." },
  { id: 6, name: "Kannur Auto Hub", category: "Bike & Scooter Sales", location: "Kannur, Kerala", description: "Wide range of two-wheelers with attractive exchange offers." },
  { id: 7, name: "Brownnies Café", category: "Bakery & Coffee Pub", location: "Kannur, Kerala", description: "Freshly baked treats, coffee, and hangout spot." },
  { id: 8, name: "NextGen Mobiles", category: "Mobile & Accessories", location: "Kannur, Kerala", description: "Latest smartphones and accessories at the best prices." },
  { id: 9, name: "Elite Furnishings", category: "Home & Furniture", location: "Kannur, Kerala", description: "Modern and stylish furniture to make your home elegant." },
  { id: 10, name: "Gold Palace", category: "Jewellery & Ornaments", location: "Kannur, Kerala", description: "Exclusive gold and diamond jewellery collections." },
];

export default function VendorsPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Vendor | null>(null);
  const router = useRouter();

  const filtered = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
        Vendors in Kannur
      </h1>

      {/* Search Bar */}
      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="🔍 Search vendors by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 p-4 border rounded-xl shadow-md focus:ring-2 focus:ring-purple-400 focus:outline-none"
        />
      </div>

      {/* Vendors Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
      >
        <AnimatePresence>
          {filtered.map((vendor, i) => (
            <motion.div
              key={vendor.id}
              layout
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <div
                onClick={() => setSelected(vendor)}
                className="cursor-pointer p-6 rounded-2xl shadow-lg bg-white/70 backdrop-blur-md border border-gray-200 hover:shadow-2xl transition transform hover:-translate-y-2"
              >
                <h2 className="text-xl font-bold text-purple-700">{vendor.name}</h2>
                <p className="text-gray-700 mt-1">{vendor.category}</p>
                <p className="text-sm text-gray-500 mt-2">{vendor.location}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Modal for Vendor Details */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative"
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                ✖
              </button>
              <h2 className="text-2xl font-bold text-purple-700 mb-4">
                {selected.name}
              </h2>
              <p className="text-gray-700 font-medium">
                Category: {selected.category}
              </p>
              <p className="text-gray-500 mb-4">📍 {selected.location}</p>
              <p className="text-gray-600">{selected.description}</p>

              {/* Book Slot button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() =>
                    router.push(
                      `/requests?vendor=${encodeURIComponent(selected.name)}&category=${encodeURIComponent(
                        selected.category
                      )}&location=${encodeURIComponent(selected.location)}`
                    )
                  }
                  className="px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-500 transition shadow-md"
                >
                  📑 Book Your Slot
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
