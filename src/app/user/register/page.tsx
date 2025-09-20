"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  // Fix: type the event
  const handleRegister = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields!");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    router.push("/welcome");
  };

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="bg-white/20 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-96">
        <h1 className="text-4xl font-extrabold text-center text-white mb-8">
          Create Account
        </h1>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button
            type="submit"
            className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-xl shadow-lg transition"
          >
            Register
          </button>
        </form>
        <p className="text-center text-sm text-white mt-6">
          Already have an account?{" "}
          <a href="/user/login" className="text-yellow-300 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
