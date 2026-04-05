"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-3xl mx-auto text-white">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <span className="text-neon-red text-xs uppercase tracking-[0.2em] mb-2 block">
            Légal
          </span>
          <h1 className="heading-lg mb-4">Politique de Confidentialité</h1>
          <p className="text-white/60">Dernière mise à jour : 1er Janvier 2024</p>
        </motion.div>

        <motion.div 
          className="space-y-8 text-white/70"
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">1. Collecte des données</h2>
            <p>
              Nous collectons les données que vous nous fournissez directement lors de la création de votre compte, de l&apos;inscription à des concours, de l&apos;envoi de photos ou des réservations (nom, adresse email, informations de contact).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">2. Utilisation des données</h2>
            <p>
              Les données récoltées sont utilisées uniquement pour le traitement de vos réservations, l&apos;attribution de lots des concours, et pour vous informer de nos événements exclusifs.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">3. Droit à l&apos;image</h2>
            <p>
              En envoyant des photos via notre système d&apos;upload communautaire, ou en participant à nos événements, vous consentez à l&apos;exploitation potentielle de votre image au sein de notre galerie, uniquement à des fins promotionnelles pour GHF Agency. Vous pouvez demander le retrait de vos photos sur simple demande de contact.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">4. Sécurité</h2>
            <p>
              Nous mettons en Å“uvre les mesures techniques et organisationnelles nécessaires pour assurer la sécurité de vos données (connexion encryptée, gestion sécurisée des accès).
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}

