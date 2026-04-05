"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export default function TestimonialCard({ testimonial, index = 0 }) {
  return (
    <motion.div
      className="testimonial-card rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      data-testid={`testimonial-${testimonial.id}`}
    >
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < testimonial.rating ? 'star-filled fill-current' : 'star-empty'}
          />
        ))}
      </div>
      
      {/* Content */}
      <p className="text-white/80 text-sm leading-relaxed mb-6 relative z-10">
        &quot;{testimonial.content}&quot;
      </p>
      
      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-red to-neon-gold flex items-center justify-center text-white font-bold">
          {testimonial.authorName?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div>
          <p className="text-white font-medium text-sm">{testimonial.authorName || 'Utilisateur anonyme'}</p>
          <p className="text-white/40 text-xs">Client vérifié</p>
        </div>
      </div>
    </motion.div>
  );
}

