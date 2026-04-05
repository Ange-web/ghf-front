"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Star, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto text-white">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-neon-gold text-xs uppercase tracking-[0.2em] mb-2 block">
            Notre histoire
          </span>
          <h1 className="heading-lg mb-8">À propos de GHF Agency</h1>
        </motion.div>

        <motion.div 
          className="space-y-6 text-lg text-white/70 mb-16"
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p>
            Fondée avec la vision de révolutionner la vie nocturne à Paris, GHF Agency s&apos;est imposée comme le leader incontesté dans l&apos;organisation d&apos;événements exclusifs, de soirées VIP et de concerts inoubliables.
          </p>
          <p>
            Nous ne nous contentons pas d&apos;organiser des soirées ; nous créons des expériences sur-mesure. Notre réseau de clubs renommés, d&apos;artistes internationaux et notre dévouement à l&apos;excellence nous permettent de proposer l&apos;exceptionnel.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div 
            className="p-6 bg-[#0F0F13] border border-white/10 rounded-2xl"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Building2 className="text-neon-red mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">Lieux Exclusifs</h3>
            <p className="text-white/60 text-sm">Partenariats avec les meilleurs clubs et lieux événementiels.</p>
          </motion.div>
          
          <motion.div 
            className="p-6 bg-[#0F0F13] border border-white/10 rounded-2xl"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Star className="text-neon-gold mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">Service Premium</h3>
            <p className="text-white/60 text-sm">Une attention aux détails et un focus absolu sur la satisfaction client.</p>
          </motion.div>

          <motion.div 
            className="p-6 bg-[#0F0F13] border border-white/10 rounded-2xl"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Users className="text-neon-red mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">Communauté</h3>
            <p className="text-white/60 text-sm">Une clientèle fidèle composée de passionnés de la vie nocturne.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

