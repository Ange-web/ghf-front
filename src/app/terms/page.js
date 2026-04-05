"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-3xl mx-auto text-white">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <span className="text-neon-red text-xs uppercase tracking-[0.2em] mb-2 block">
            Légal
          </span>
          <h1 className="heading-lg mb-4">Conditions Générales d&apos;Utilisation</h1>
          <p className="text-white/60">Dernière mise à jour : 1er Janvier 2024</p>
        </motion.div>

        <motion.div 
          className="space-y-8 text-white/70"
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">1. Acceptation des conditions</h2>
            <p>
              En accédant et en utilisant les services de GHF Agency, vous acceptez d&apos;être lié par les présentes conditions générales d&apos;utilisation. Si vous n&apos;acceptez pas ces conditions, veuillez ne pas utiliser nos services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">2. Réservations et Paiements</h2>
            <p>
              Toutes les réservations sont soumises à disponibilité et confirmation. Les paiements ou arrhes versés pour la sécurisation des tables VIP ou Promo sont non-remboursables, sauf indication contraire explicite.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">3. Droit d&apos;accès</h2>
            <p>
              GHF Agency et les établissements partenaires se réservent le droit d&apos;admission. Une réservation ne garantit pas l&apos;entrée si le code vestimentaire ou le comportement ne correspondent pas aux standards de l&apos;établissement.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">4. Modifications des Services</h2>
            <p>
              Nous nous réservons le droit de modifier ou de suspendre partiellement ou totalement nos services à tout moment sans préavis.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}

