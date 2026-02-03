"use client";

import Link from "next/link";
import {
    Zap,
    Heart,
    Mail,
    Phone,
    MapPin,
    ShieldAlert,
    Twitter,
    Linkedin,
    Youtube,
    Github,
    ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-[#05070a] border-t border-white/5 pt-24 pb-12 overflow-hidden shadow-2xl">
            {/* Background Decor */}
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">

                    {/* 🔹 Brand & Mission */}
                    <div className="space-y-8">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)] group-hover:scale-110 transition-transform duration-300">
                                <Zap className="text-white w-6 h-6" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-white">
                                Service<span className="text-blue-500">Hub</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-sm">
                            Global standard IT maintenance, hardware repair, and professional support delivered at your doorstep with transparency and technical excellence.
                        </p>
                        <div className="flex gap-4">
                            <SocialIcon icon={Twitter} href="#" />
                            <SocialIcon icon={Linkedin} href="#" />
                            <SocialIcon icon={Youtube} href="#" />
                            <SocialIcon icon={Github} href="#" />
                        </div>
                    </div>

                    {/* 🔹 Navigation */}
                    <div>
                        <h4 className="font-black text-[11px] uppercase tracking-[0.25em] text-white/40 mb-10">Company</h4>
                        <ul className="space-y-5">
                            <FooterLink href="/">Home</FooterLink>
                            <FooterLink href="/explore">Find Services</FooterLink>
                            <FooterLink href="/about">Our Story</FooterLink>
                            <FooterLink href="/contact">Support Center</FooterLink>
                        </ul>
                    </div>

                    {/* 🔹 Work With Us */}
                    <div>
                        <h4 className="font-black text-[11px] uppercase tracking-[0.25em] text-white/40 mb-10">Join Network</h4>
                        <ul className="space-y-5">
                            <FooterLink href="/vendor/register">Service Merchants</FooterLink>
                            <FooterLink href="/technician/register">Professional Experts</FooterLink>
                            <FooterLink href="/admin/login">Admin Portal</FooterLink>
                            <FooterLink href="/careers">Global Careers</FooterLink>
                        </ul>
                    </div>

                    {/* 🔹 Support & Contact */}
                    <div>
                        <h4 className="font-black text-[11px] uppercase tracking-[0.25em] text-white/40 mb-10">Contact Us</h4>
                        <ul className="space-y-6 mb-10">
                            <li className="flex items-start gap-4 text-sm font-bold text-slate-400 group cursor-default">
                                <MapPin className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                                <span className="group-hover:text-white transition-colors leading-relaxed">Global Headquarters,<br />Tech Park West, CA</span>
                            </li>
                            <li className="flex items-center gap-4 text-sm font-bold text-slate-400 group cursor-default">
                                <Phone className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                <span className="group-hover:text-white transition-colors">+1 (555) 000-1234</span>
                            </li>
                            <li className="flex items-center gap-4 text-sm font-bold text-slate-400 group cursor-default">
                                <Mail className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                <span className="group-hover:text-white transition-colors">noreplyservicehubserver@gmail.com</span>
                            </li>
                        </ul>

                        <Link
                            href="/report-issue"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all duration-300"
                        >
                            <ShieldAlert className="w-4 h-4" />
                            Report an Issue
                        </Link>
                    </div>
                </div>

                {/* 🔹 Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="flex items-center gap-2 group"
                    >
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-1.5 transition-colors group-hover:text-slate-400">
                            © {currentYear} SERVICEHUB
                            <span className="text-white/20 px-2">•</span>
                            CRAFTED WITH <Heart className="w-3.5 h-3.5 text-blue-500 fill-blue-500/20 transition-transform group-hover:scale-125 duration-500" /> FOR THE ELITE
                        </p>
                    </motion.div>

                    <div className="flex gap-10">
                        <Link href="/privacy" className="text-[10px] font-black text-slate-500 hover:text-white transition-all uppercase tracking-[0.2em]">Privacy Policy</Link>
                        <Link href="/terms" className="text-[10px] font-black text-slate-500 hover:text-white transition-all uppercase tracking-[0.2em]">SLA Terms</Link>
                        <span className="text-[10px] font-black text-slate-500 hover:text-white transition-all uppercase tracking-[0.2em] cursor-pointer">Security</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
            <Link
                href={href}
                className="text-sm font-bold text-slate-500 hover:text-white transition-colors flex items-center gap-2 group"
            >
                <ChevronRight className="w-3.5 h-3.5 text-blue-500 opacity-0 -ml-2 group-hover:opacity-100 transition-all" />
                {children}
            </Link>
        </motion.li>
    );
}

function SocialIcon({ icon: Icon, href }: { icon: any; href: string }) {
    return (
        <Link
            href={href}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600/20 hover:border-blue-500/30 transition-all duration-300"
        >
            <Icon className="w-5 h-5" />
        </Link>
    );
}
