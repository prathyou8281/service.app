import Image from "next/image";
import TopNav from "../components/user/page"
import LoginPage from "../components/user/page"
  




export default function Home() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Gradient Background */}
      
      {/* Optional background image */}
      {/*
      <Image
        src="/background.jpg" // place in /public
        alt="Background"
        fill
        className="object-cover opacity-60"
        priority
      />
      */}

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center h-full text-center md:text-left px-6 gap-10">
        {/* Left Side - Text */}
        <div className="max-w-2xl">
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
          <Image src="/images/service.png" alt="ServiceApp showcase" width={500} height={400} />

            
        </div>
      </div>
    </div>
  );
}