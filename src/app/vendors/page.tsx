"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Vendor = {
  id: number;
  name: string;
  category: string;
  location: string;
};

const vendors: Vendor[] = [
  { id: 1, name: "Pranav Car Dealership", category: "Car Dealing", location: "Kannur, Kerala" },
  { id: 2, name: "Computer Club", category: "Laptop & PC Sales", location: "Kannur, Kerala" },
  { id: 3, name: "Juishop", category: "Juice & Café", location: "Kannur, Kerala" },
  { id: 4, name: "Crystal Optic", category: "Eyewear & Opticals", location: "Kannur, Kerala" },
  { id: 5, name: "Servosonic", category: "Inverters & UPS", location: "Kannur, Kerala" },
  { id: 6, name: "Kannur Auto Hub", category: "Bike & Scooter Sales", location: "Kannur, Kerala" },
  { id: 7, name: "Brownnies Café", category: "Bakery & Coffee Pub", location: "Kannur, Kerala" },
  { id: 8, name: "NextGen Mobiles", category: "Mobile & Accessories", location: "Kannur, Kerala" },
  { id: 9, name: "Elite Furnishings", category: "Home & Furniture", location: "Kannur, Kerala" },
  { id: 10, name: "Gold Palace", category: "Jewellery & Ornaments", location: "Kannur, Kerala" },
];

export default function VendorsPage() {
  const [search, setSearch] = useState("");

  const filtered = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
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

      {/* Vendors Grid with Animation */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
      >
        <AnimatePresence>
          {filtered.map((vendor, i) => (
            <motion.div
              key={vendor.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {vendor.name}
              </h2>
              <p className="text-gray-600">{vendor.category}</p>
              <p className="text-sm text-gray-500 mt-2">{vendor.location}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* No vendors found */}
      {filtered.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No vendors found.</p>
      )}
    </div>
  );
}
