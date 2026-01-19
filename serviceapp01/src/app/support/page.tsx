"use client";
import { useState } from "react";

export default function SupportPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Send form data to backend API or email service
    alert("Thank you! Your message has been submitted.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-indigo-600 mb-4">💬 Support</h1>
        <p className="text-gray-600 mb-8">
          Need help? Fill out the form below or reach us through the provided options.
        </p>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={4}
              className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-500 transition"
          >
            Submit
          </button>
        </form>

        {/* Extra Support Options */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-5 bg-indigo-50 rounded-xl text-center shadow">
            <p className="text-lg font-semibold">📧 Email Us</p>
            <p className="text-sm text-gray-600">support@yourdomain.com</p>
          </div>
          <div className="p-5 bg-indigo-50 rounded-xl text-center shadow">
            <p className="text-lg font-semibold">📞 Call</p>
            <p className="text-sm text-gray-600">+91 98952 34900</p>
          </div>
          <div className="p-5 bg-indigo-50 rounded-xl text-center shadow">
            <p className="text-lg font-semibold">❓ FAQs</p>
            <p className="text-sm text-gray-600">Check our help center</p>
          </div>
        </div>
      </div>
    </div>
  );
}
