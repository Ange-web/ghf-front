"use client";

import React from 'react';
import Link from 'next/link';
import { Mail, MapPin } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="footer py-16" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Logo />
            <p className="text-white/50 text-sm leading-relaxed">
              Tables offertes, accès VIP, soirées privées — GHF organise les meilleures nuits de Paris.
            </p>

            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <a
                href="https://instagram.com/girlshavefun.agency"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Suivez-nous sur Instagram"
                className="text-white/40 hover:text-neon-red transition-colors"
                data-testid="social-instagram"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a
                href="https://tiktok.com/@girlshavefun.agency"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Suivez-nous sur TikTok"
                className="text-white/40 hover:text-neon-red transition-colors"
                data-testid="social-tiktok"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
                </svg>
              </a>
              <a
                href="https://youtube.com/@girlshavefunagency"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Suivez-nous sur YouTube"
                className="text-white/40 hover:text-neon-red transition-colors"
                data-testid="social-youtube"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
                  <path d="m10 15 5-3-5-3z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 tracking-wide">Navigation</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-white/50 hover:text-white text-sm transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-white/50 hover:text-white text-sm transition-colors">
                  Événements
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-white/50 hover:text-white text-sm transition-colors">
                  Galerie
                </Link>
              </li>
              <li>
                <Link href="/contests" className="text-white/50 hover:text-white text-sm transition-colors">
                  Concours
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-white/50 hover:text-white text-sm transition-colors">
                  Réservation
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4 tracking-wide">Informations</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-white/50 hover:text-white text-sm transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-white/50 hover:text-white text-sm transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-white/50 hover:text-white text-sm transition-colors">
                  Conditions générales
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-white/50 hover:text-white text-sm transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 tracking-wide">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-white/50 text-sm">
                <MapPin size={16} className="text-neon-red" />
                Paris, France
              </li>
              <li className="flex items-center gap-3 text-white/50 text-sm">
                <Mail size={16} className="text-neon-red" />
                contact@ghfagency.com
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} GHF Agency. Tous droits réservés.
          </p>
          <p className="text-white/30 text-sm">
            Paris · Nightlife · VIP
          </p>
        </div>
      </div>
    </footer>
  );
}

