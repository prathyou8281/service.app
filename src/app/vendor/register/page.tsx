"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Store, Mail, Lock, Phone, MapPin } from "lucide-react";

// ✅ Predefined Indian Locations
const indianCities = [
  "Agra", "Ahmedabad", "Alappuzha", "Amritsar", "Aurangabad", "Bangalore",
  "Bhopal", "Bhubaneswar", "Chandigarh", "Chennai", "Coimbatore", "Delhi",
  "Ernakulam", "Faridabad", "Ghaziabad", "Goa", "Guntur", "Gurugram", "Guwahati",
  "Hyderabad", "Indore", "Jaipur", "Jalandhar", "Jammu", "Jodhpur", "Kakinada",
  "Kalyan", "Kannur", "Kanpur", "Kochi", "Kollam", "Kolkata", "Kota", "Kozhikode",
  "Lucknow", "Madurai", "Mangalore", "Meerut", "Mumbai", "Mysore", "Nagpur",
  "Nashik", "Noida", "Palakkad", "Patna", "Pune", "Raipur", "Rajkot", "Ranchi",
  "Salem", "Siliguri", "Surat", "Thane", "Thrissur", "Tiruchirappalli", "Tirunelveli",
  "Trivandrum", "Udaipur", "Vadodara", "Vijayawada", "Visakhapatnam", "Warangal",
];

export default function VendorRegisterPage() {
  const [shopName, setShopName] = useState("");
  const [shopLocation, setShopLocation] = useState("");
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // ✅ Filter city suggestions dynamically
  useEffect(() => {
    if (!shopLocation.trim()) {
      setFilteredCities([]);
      return;
    }

    const results = indianCities.filter((city) =>
      city.toLowerCase().startsWith(shopLocation.toLowerCase())
    );
    setFilteredCities(results.slice(0, 8));
  }, [shopLocation]);

  // ✅ Handle Vendor Registration
  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!shopName || !shopLocation || !email || !password) {
      alert("⚠️ Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      // 🧹 Clear old vendor session (avoid auto-login issues)
      localStorage.removeItem("vendorEmail");
      localStorage.removeItem("vendorName");

      const res = await fetch("/api/auth/vendor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: shopName.trim(),
          email: email.trim(),
          password,
          phone: phone.trim(),
          description: description.trim(),
          address: shopLocation.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || data.error || "❌ Registration failed.");
        return;
      }

      alert("✅ Vendor registration successful! Please login.");
      router.replace("/vendor/login");
    } catch (err) {
      console.error("Vendor Register Error →", err);
      alert("⚠️ Something went wrong during registration.");
    } finally {
      setLoading(false);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[var(--soft-gradient)] text-[var(--foreground)] transition-colors duration-500">
      <AnimatePresence>
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, y: -30 }}
          className="card relative z-10 shadow-2xl p-10 sm:p-16 max-w-6xl w-[90%]"
        >
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <h2 className="text-4xl font-extrabold mb-6 text-center">
              Register as <span className="text-[var(--accent)]">Vendor</span>
            </h2>

            <form
              onSubmit={handleRegister}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 relative"
            >
              {/* Shop Name */}
              <div className="flex items-center gap-3 bg-[var(--card-bg)] rounded-xl p-3 border border-[var(--accent)]/20">
                <Store className="text-[var(--accent)] w-5 h-5" />
                <input
                  type="text"
                  placeholder="Shop Name"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="bg-transparent flex-1 outline-none placeholder-gray-400"
                />
              </div>

              {/* Shop Location (with suggestions) */}
              <div className="relative">
                <div className="flex items-center gap-3 bg-[var(--card-bg)] rounded-xl p-3 border border-[var(--accent)]/20">
                  <MapPin className="text-[var(--accent)] w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Shop Location"
                    value={shopLocation}
                    onChange={(e) => {
                      setShopLocation(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    className="bg-transparent flex-1 outline-none placeholder-gray-400"
                  />
                </div>

                {showSuggestions && filteredCities.length > 0 && (
                  <div className="absolute left-0 right-0 bg-white shadow-md border rounded-xl mt-1 z-20 max-h-48 overflow-auto">
                    {filteredCities.map((city) => (
                      <div
                        key={city}
                        onClick={() => {
                          setShopLocation(city);
                          setShowSuggestions(false);
                        }}
                        className="px-4 py-2 text-gray-700 hover:bg-[var(--accent)] hover:text-white cursor-pointer"
                      >
                        {city}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="flex items-center gap-3 bg-[var(--card-bg)] rounded-xl p-3 border border-[var(--accent)]/20">
                <Mail className="text-[var(--accent)] w-5 h-5" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent flex-1 outline-none placeholder-gray-400"
                />
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3 bg-[var(--card-bg)] rounded-xl p-3 border border-[var(--accent)]/20">
                <Phone className="text-[var(--accent)] w-5 h-5" />
                <input
                  type="tel"
                  placeholder="Phone Number (optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-transparent flex-1 outline-none placeholder-gray-400"
                />
              </div>

              {/* Password */}
              <div className="flex items-center gap-3 bg-[var(--card-bg)] rounded-xl p-3 border border-[var(--accent)]/20">
                <Lock className="text-[var(--accent)] w-5 h-5" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent flex-1 outline-none placeholder-gray-400"
                />
              </div>

              {/* Description */}
              <div className="col-span-2 flex items-center gap-3 bg-[var(--card-bg)] rounded-xl p-3 border border-[var(--accent)]/20">
                <input
                  type="text"
                  placeholder="Short Description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-transparent flex-1 outline-none placeholder-gray-400"
                />
              </div>

              {/* Submit */}
              <div className="col-span-2 mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-4 rounded-xl text-lg font-semibold"
                >
                  {loading ? "Registering..." : "Register"}
                </button>
              </div>
            </form>

            <p className="text-center text-sm mt-6 opacity-80">
              Already have an account?{" "}
              <Link
                href="vendor/login"
                className="text-[var(--accent)] hover:text-[var(--accent-hover)] underline-offset-2 hover:underline"
              >
                Login
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
