"use client";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background image */}
      <Image
        src="/background.jpg" // place in /public
        alt="Background"
        fill
        className="object-cover"
        priority
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/70 via-purple-800/70 to-pink-700/60" />

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col h-full items-center justify-center text-center px-6">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/20 max-w-2xl">
          <h1 className="text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
            Welcome to <span className="text-pink-400">ServiceApp</span>
          </h1>
          <p className="text-xl text-gray-200 leading-relaxed">
            Your one-stop solution for IT services, laptops & more. <br />
            Fast • Reliable • Affordable
          </p>
        </div>
      </div>
    </div>
  );
}
