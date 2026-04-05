"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "Comment réserver une table VIP ?",
    answer: "Vous pouvez réserver une table VIP directement depuis la page de l'événement souhaité en cliquant sur \"Réserver une table\", ou depuis l'onglet Réservations. Vous devrez être connecté à votre compte."
  },
  {
    question: "Quels sont les avantages d'une Table Promo ?",
    answer: "Les tables promo incluent l'entrée pour l'événement, un accès prioritaire, une table réservée pour vous et vos invités (jusqu'à 6 personnes selon l'option), ainsi qu'au moins une bouteille offerte."
  },
  {
    question: "Est-il possible d'annuler une réservation ?",
    answer: "Oui, vous pouvez annuler votre réservation depuis l'onglet 'Mon Profil'. L'annulation est généralement gratuite jusqu'à 48h avant l'événement. Au-delà, des frais peuvent s'appliquer."
  },
  {
    question: "Comment s'inscrire aux concours ?",
    answer: "Visitez la section \"Concours\" de notre application. Si un concours est actif, cliquez simplement sur \"Participer maintenant\". Assurez-vous d'avoir un compte certifié et complet pour augmenter vos chances."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="text-neon-red text-xs uppercase tracking-[0.2em] mb-2 block">
            Aide & Support
          </span>
          <h1 className="heading-lg text-white mb-4">Questions Fréquentes</h1>
          <p className="text-white/60">Retrouvez les réponses aux questions les plus communes de notre communauté.</p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#0F0F13] border border-white/10 rounded-2xl overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 flex items-center justify-between text-left text-white font-medium hover:bg-white/5 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                {faq.question}
                <ChevronDown 
                  size={20} 
                  className={`text-neon-gold transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-4 pt-0 text-white/60">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

