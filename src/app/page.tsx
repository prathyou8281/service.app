"use client";

import Image from "next/image";

export default function Home() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center h-full text-center md:text-left px-6 gap-10">
        
        {/* Left Side - Text */}
        <div className="max-w-2xl animate-fadeInUp">
          <h1 className="text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
            Welcome to <span className="text-pink-400">ServiceApp</span>
          </h1>
          <p className="text-xl text-gray-200 leading-relaxed mb-8">
            Your one-stop solution for IT services, laptops, and more.  
            <br />
            Fast • Reliable • Affordable
          </p>

          {/* Call to action */}
          <div className="flex gap-6 justify-center md:justify-start">
            <a href="/explore" className="btn-primary">
              Explore Services
            </a>
            <a href="user/login" className="btn-secondary">
              Book Now
            </a>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="w-full md:w-1/2 flex justify-center animate-fadeInUp">
          <Image
            src="/images/service.png"
            alt="ServiceApp showcase"
            width={500}
            height={400}
            className="drop-shadow-xl"
          />
        </div>
      </div>
    </div>
  );
}
