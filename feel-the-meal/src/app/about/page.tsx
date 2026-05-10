"use client";

import React from "react";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-[var(--bg-primary)]">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs uppercase tracking-[0.3em] text-[var(--accent-gold)] font-medium mb-6 block">
            About Us
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] mb-8 leading-tight">
            Crafting <span className="text-gradient-gold">Memories</span>, One Bite at a Time
          </h1>

          <div className="space-y-6 text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed text-left sm:text-center mt-12">
            <p>
              Welcome to Feel The Meal. We started with a simple belief: that confections are more than just food. They are celebrations, moments of comfort, and expressions of love. Every cake we bake, every cookie we craft, and every chocolate we temper is a testament to this philosophy.
            </p>
            <p>
              Our journey began with a passion for bringing authentic, premium flavors to our community. We source the finest ingredients from across the subcontinent, ensuring that every creation not only looks breathtaking but tastes extraordinary. We refuse to compromise on quality, because we know that the best moments in life deserve the best flavors.
            </p>
            <p>
              Whether it's a grand celebration or a quiet moment of indulgence, we are honored to be a part of your story. Thank you for letting us bring a touch of sweetness to your life.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
