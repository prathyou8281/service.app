import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600">
      {/* Optional background image */}
      {/* 
      <Image
        src="/background.jpg"
        alt="Background"
        fill
        className="object-cover opacity-60"
        priority
      />
      */}

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center h-full text-center md:text-left px-4 sm:px-6 gap-8 sm:gap-10">
        {/* Left Side - Text */}
        <div className="max-w-xl sm:max-w-2xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg leading-tight">
            Welcome to{" "}
            <span className="text-pink-400">ServiceApp</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed mb-8">
            Your one-stop solution for{" "}
            <span className="font-semibold text-pink-300">IT services</span>,{" "}
            <span className="font-semibold text-indigo-300">laptops</span> & more.  
            <br />
            <span className="italic text-gray-300">
              Fast • Reliable • Affordable
            </span>
          </p>

          {/* Call to action */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center md:justify-start">
            <a
              href="/services"
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-5 sm:px-6 py-3 rounded-xl font-semibold shadow-lg hover:opacity-90 transition text-sm sm:text-base"
            >
              Explore Services
            </a>
            <a
              href="/contact"
              className="bg-white text-indigo-600 px-5 sm:px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-gray-100 transition text-sm sm:text-base"
            >
              Book Now
            </a>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <Image
            src="/images/service.png"
            alt="ServiceApp showcase"
            width={400}
            height={300}
            className="w-64 sm:w-80 md:w-[500px] h-auto drop-shadow-xl"
            priority
          />
        </div>
      </div>
    </div>
  );
}
