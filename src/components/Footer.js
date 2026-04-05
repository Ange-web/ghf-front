"use client";

import React from 'react';
import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer py-16" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-baseline gap-0.5 text-2xl font-bold tracking-wider mb-4">
              <span className="text-neon-red">GHF</span>
              <span className="text-white">_</span>
              <span className="text-neon-gold">AGENCY</span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed">
              L&apos;agence événementielle qui transforme vos nuits en expériences inoubliables.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
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
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/40 hover:text-neon-red transition-colors"
                data-testid="social-twitter"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                </svg>
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
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
                <Phone size={16} className="text-neon-red" />
                +33 1 23 45 67 89
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
            Â© {new Date().getFullYear()} GHF Agency. Tous droits réservés.
          </p>
          <p className="text-white/30 text-sm">
            Crafted with <span className="text-neon-red">♥</span> in Paris
          </p>
        </div>
      </div>
    </footer>
  );
}

