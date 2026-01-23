"use client";

import Link from "next/link";
import { Zap, Heart, Mail, Phone, MapPin, Search } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-slate-200 pt-20 pb-10">
            <div className="mx-auto max-w-7xl px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Brand & Mission */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Zap className="text-white w-5 h-5" />
                            </div>
                            <span className="text-xl font-black tracking-tighter">Service<span className="text-blue-600">Hub</span></span>
                        </Link>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">
                            We provide the world's most reliable doorstep IT services. Our mission is to make professional repairs simple and accessible for everyone.
                        </p>
                        <div className="flex gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors cursor-pointer">
                                    <Zap className="w-4 h-4" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-900 mb-8">Navigation</h4>
                        <ul className="space-y-4">
                            <li><Link href="/" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Home</Link></li>
                            <li><Link href="/explore" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Find Services</Link></li>
                            <li><Link href="/about" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Our Story</Link></li>
                            <li><Link href="/contact" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Support Center</Link></li>
                        </ul>
                    </div>

                    {/* Business */}
                    <div>
                        <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-900 mb-8">Work With Us</h4>
                        <ul className="space-y-4">
                            <li><Link href="/vendor/register" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Service Merchants</Link></li>
                            <li><Link href="/technician/register" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Professional Experts</Link></li>
                            <li><Link href="/admin/login" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Admin Portal</Link></li>
                            <li><Link href="/careers" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Global Careers</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-900 mb-8">Reach Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-sm font-bold text-slate-500">
                                <MapPin className="w-4 h-4 text-blue-600" />
                                Global HQ, Tech Park, NY
                            </li>
                            <li className="flex items-center gap-3 text-sm font-bold text-slate-500">
                                <Phone className="w-4 h-4 text-blue-600" />
                                +1 (555) 000-1111
                            </li>
                            <li className="flex items-center gap-3 text-sm font-bold text-slate-500">
                                <Mail className="w-4 h-4 text-blue-600" />
                                support@servicehub.com
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-1">
                        © 2026 ServiceHub • Crafted with <Heart className="w-3 h-3 text-red-500" /> for the community
                    </p>
                    <div className="flex gap-8">
                        <span className="text-[10px] font-black text-slate-400 hover:text-slate-600 cursor-pointer uppercase tracking-widest">Privacy Policy</span>
                        <span className="text-[10px] font-black text-slate-400 hover:text-slate-600 cursor-pointer uppercase tracking-widest">SLA Terms</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
