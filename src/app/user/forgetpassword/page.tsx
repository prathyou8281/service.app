"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email!");
      return;
    }

    // Simulate success
    setError("");
    alert(`Password reset link has been sent to ${email}`);
    router.push("/login");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center ">
      <div className="bg-white/20 backdrop-blur-lg p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-white mb-6">
          Forgot Password
        </h1>
        <p className="text-center text-sm text-gray-200 mb-6">
          Enter your registered email address and we’ll send you a password reset link.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="mt-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-xl shadow-lg transition-colors duration-200"
          >
            Send Reset Link
          </button>
        </form>
        <p className="text-center text-sm text-gray-200 mt-6">
          Remember your password?{" "}
          <span
            onClick={() => router.push("/user/login")}
            className="text-yellow-300 hover:underline cursor-pointer font-medium"
          >
            Go back to Login
          </span>
        </p>
      </div>
    </div>
  );
}
