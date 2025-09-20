"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Fix: add type for event
  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter both email and password!");
      return;
    }
    // Here you can later add authentication logic
    router.push("/welcome"); // Redirect after login
  };

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="bg-white/20 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-96">
        <h1 className="text-4xl font-extrabold text-center text-white mb-8">
          Login
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
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

          <div className="text-right">
            <Link
              href="/user/forgetpassword"
              className="text-sm text-yellow-300 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-xl shadow-lg transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-white mt-6">
          Don’t have an account?{" "}
          <Link
            href="/user/register"
            className="text-yellow-300 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
