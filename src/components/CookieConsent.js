"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie } from 'lucide-react';

const CONSENT_KEY = 'ghf_cookie_consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const existing = window.localStorage.getItem(CONSENT_KEY);
      if (!existing) {
        setVisible(true);
      }
    } catch {
      // localStorage indisponible (navigation privée stricte, etc.) : on
      // n'affiche pas le bandeau plutôt que de faire planter la page.
    }
  }, []);

  const setConsent = (value) => {
    try {
      window.localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // Rien à faire si le stockage n'est pas disponible.
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="region"
          aria-label="Consentement aux cookies"
          className="fixed bottom-0 inset-x-0 z-[500] p-4 sm:p-6"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4 }}
          data-testid="cookie-consent"
        >
          <div className="max-w-3xl mx-auto bg-[#111]/95 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Cookie className="hidden sm:block text-neon-gold shrink-0" size={28} aria-hidden="true" />
            <p className="text-white/70 text-sm flex-1">
              Nous utilisons un stockage nécessaire au fonctionnement du site (connexion) ainsi que,
              avec votre accord, des outils de mesure d&apos;audience. En savoir plus dans notre{' '}
              <Link href="/privacy" className="text-neon-gold hover:underline">
                politique de confidentialité
              </Link>
              .
            </p>
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setConsent('declined')}
                className="flex-1 sm:flex-none px-4 py-2 rounded-full text-sm border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-colors"
                data-testid="cookie-consent-decline"
              >
                Refuser
              </button>
              <button
                type="button"
                onClick={() => setConsent('accepted')}
                className="flex-1 sm:flex-none btn-primary px-4 py-2 rounded-full text-sm"
                data-testid="cookie-consent-accept"
              >
                Accepter
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
