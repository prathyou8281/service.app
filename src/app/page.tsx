"use client";

import Image from "next/image";

/* Service Card Component */
function ServiceCard({
  title,
  img,
}: {
  title: string;
  img: string;
}) {
  return (
    <div className="service-card">
      <Image
        src={img}
        alt={title}
        width={110}
        height={110}
        className="rounded-xl"
      />
      <p>{title}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-[var(--background)] text-[var(--foreground)] transition-colors duration-500">

      {/* Soft overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-blue-50"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center h-full px-6 gap-12">

        {/* Left Side */}
        <div className="max-w-2xl animate-fadeInUp text-center md:text-left">
          <h1 className="text-6xl font-extrabold mb-6">
            Welcome to{" "}
            <span className="text-[var(--accent)]">ServiceApp</span>
          </h1>

          <p className="text-xl mb-8 leading-relaxed">
            Your one-stop solution for IT services, laptops, and more.
            <br />
            <span className="font-semibold">
              Fast • Reliable • Affordable
            </span>
          </p>

          <div className="flex gap-6 justify-center md:justify-start">
            <a href="/explore" className="btn-primary">
              Explore Services
            </a>
            <a href="/login" className="btn-secondary">
              Book Now
            </a>
          </div>
        </div>

        {/* Right Side Image */}
        <div className="w-full md:w-1/2 flex justify-center animate-fadeInUp">
          <Image
            src="/images/service.png"
            alt="Service showcase"
            width={520}
            height={420}
            className="drop-shadow-xl"
          />
        </div>
      </div>

      {/* LEFT Bottom 3D Cards */}
      <div className="absolute bottom-6 left-6 hidden lg:flex gap-6 perspective-1000 z-20">
        <ServiceCard
          title="Laptop Repair"
          img="/images/services/laptop.png"
        />
        <ServiceCard
          title="Mobile Service"
          img="/images/services/mobile.png"
        />
      </div>

      {/* RIGHT Bottom 3D Cards */}
      <div className="absolute bottom-10 right-10 hidden lg:flex gap-10 perspective-1000 z-20">
        <ServiceCard
          title="Software Help"
          img="/images/services/software.png"
        />
        <ServiceCard
          title="IT Support"
          img="/images/services/it.png"


        />



        <ServiceCard
          title="IT Support"
          img="/images/services/it.png"


        />


        <ServiceCard
          title="IT Support"
          img="/images/services/it.png"


        />


        <ServiceCard
          title="IT Support"
          img="/images/services/it.png"


        />


        <ServiceCard
          title="IT Support"
          img="/images/services/it.png"


        />


        <ServiceCard
          title="IT Support"
          img="/images/services/it.png"


        />


        <ServiceCard
          title="IT Support"
          img="/images/services/it.png"


        />

        <ServiceCard
          title="IT Support"
          img="/images/services/it.png"


        />
      </div>
    </div>
  );
}
