"use client";


import React from "react";
import { motion } from "framer-motion";
import { Phone, Mail } from "lucide-react";
import { FaInstagram } from "react-icons/fa";

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-[var(--bg-primary)]">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs uppercase tracking-[0.3em] text-[var(--accent-gold)] font-medium mb-6 block">
            Get In Touch
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] mb-8 leading-tight">
            We'd Love to <span className="text-gradient-gold">Hear From You</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-base sm:text-lg mb-16">
            Whether you have a question about our products, need a custom order, or just want to say hello, we're here for you.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Phone */}
            <a
              href="tel:+919953573758"
              className="group flex flex-col items-center p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-gold)]/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-full bg-[var(--accent-gold)]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5 text-[var(--accent-gold)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Call Us</h3>
              <p className="text-[var(--text-secondary)] text-sm">+91 99535 73758</p>
            </a>

            {/* Email */}
            <a
              href="mailto:feelthemeal21@gmail.com"
              className="group flex flex-col items-center p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-gold)]/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-full bg-[var(--accent-gold)]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Mail className="w-5 h-5 text-[var(--accent-gold)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Email Us</h3>
              <p className="text-[var(--text-secondary)] text-sm">feelthemeal21@gmail.com</p>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/feel.the_meal?igsh=MXRlanhzdzFyb3JhZQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-gold)]/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-full bg-[var(--accent-gold)]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FaInstagram className="w-5 h-5 text-[var(--accent-gold)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Follow Us</h3>
              <p className="text-[var(--text-secondary)] text-sm">@feel.the_meal</p>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
