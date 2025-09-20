"use client";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600">
      {/* Overlay for subtle dark tint */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center h-full text-center md:text-left px-6 gap-10">
        {/* Left Side - Text */}
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent">
              ServiceApp
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 leading-relaxed mb-8">
            Your one-stop solution for{" "}
            <span className="font-semibold text-pink-300">IT services</span>,{" "}
            <span className="font-semibold text-indigo-300">laptops</span> & more.
            <br />
            <span className="italic text-gray-300">Fast • Reliable • Affordable</span>
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a
              href="/services"
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:opacity-90 transition"
            >
              Explore Services
            </a>
            <a
              href="/contact"
              className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-gray-100 transition"
            >
              Book Now
            </a>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <Image
            src="/images/service.png" // ✅ Put your image inside /public/images/service.png
            alt="ServiceApp showcase"
            width={500}
            height={400}
            className="drop-shadow-xl"
            priority
          />
        </div>
      </div>
    </div>
  );
}
