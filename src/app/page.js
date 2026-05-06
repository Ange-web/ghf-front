"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, ChevronDown, Sparkles, Wine, Music, Crown, Users, Star, MapPin, Shield, Gift, PartyPopper } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import EventCard from '@/components/EventCard';
import InstagramReviews from '@/components/InstagramReviews';
import Marquee from '@/components/Marquee';

// ── Animation helpers ──────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
});




// ── Stats data ─────────────────────────────────────────────────
const STATS = [
  { value: '500+', label: 'Soirées organisées', icon: Sparkles },
  { value: '15K+', label: 'Clients satisfaits', icon: Users },
  { value: '4.9★', label: 'Note moyenne', icon: Star },
  { value: 'Paris', label: 'Meilleure agence', icon: MapPin },
];

export default function HomePage() {
  const { data: eventsRaw } = useApi('/api/events?limit=4');
  const { data: galleryRaw } = useApi('/api/gallery?limit=6');

  const events = useMemo(() => eventsRaw || [], [eventsRaw]);
  const gallery = useMemo(() => (galleryRaw || []).slice(0, 5), [galleryRaw]);

  const scrollToEvents = () => {
    document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div id="main-content" data-testid="home-page">

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="hero-section" data-testid="hero-section">
        <div className="hero-bg">
          <video
            src="/video/splash_bg.mp4"
            autoPlay muted loop playsInline
            aria-hidden="true"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 gradient-overlay opacity-90" />
          {/* Grain */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />
        </div>

        <div className="hero-content max-w-7xl mx-auto pt-28 md:pt-36">
          {/* Trust badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs uppercase tracking-widest backdrop-blur-sm">
              <Shield size={12} className="text-[#D4AF37]" />
              Paris — Agence Événementielle #1
            </span>
          </motion.div>

          <motion.h1
            className="heading-xl text-white max-w-4xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
          >
            Vivez des{' '}
            <span className="text-gradient">expériences</span>
            {' '}inoubliables
          </motion.h1>

          <motion.p
            className="text-white/60 text-base md:text-lg max-w-lg mt-5 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            L'accès aux lieux les plus sélects de Paris. Tables VIP, soirées privées et expériences sur-mesure.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 mt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
          >
            <Link
              href="/booking"
              className="btn-primary px-8 py-4 rounded-full text-center flex items-center justify-center gap-2 font-semibold"
              data-testid="hero-booking-btn"
            >
              <Calendar size={18} />
              Réserver maintenant
            </Link>
            <Link
              href="/events"
              className="btn-secondary px-8 py-4 rounded-full text-center flex items-center justify-center gap-2"
              data-testid="hero-events-btn"
            >
              Voir les événements
              <ArrowRight size={18} />
            </Link>
          </motion.div>

          {/* Hero stats */}
          <motion.div
            className="flex flex-wrap gap-6 mt-14"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75 }}
          >
            {STATS.map(({ value, label }) => (
              <div key={label} className="flex flex-col">
                <span className="text-white font-bold text-xl md:text-2xl tracking-tight">{value}</span>
                <span className="text-white/40 text-xs mt-0.5">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
          <motion.button
            className="text-white/40 flex flex-col items-center gap-1.5 min-w-[44px] min-h-[44px] justify-center hover:text-white/70 transition-colors"
            onClick={scrollToEvents}
            aria-label="Défiler vers les événements"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2.2 }}
          >
            <span className="text-[10px] uppercase tracking-[0.2em]">Découvrir</span>
            <ChevronDown size={20} />
          </motion.button>
        </div>
      </section>

      {/* ── MARQUEE ─────────────────────────────────────────────── */}
      <Marquee />


      {/* ── PROMO GHF — TABLES OFFERTES ─────────────────────────── */}
      <section className="py-20 px-4 relative overflow-hidden" data-testid="promo-section">
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[700px] h-[400px] bg-[#D4AF37]/8 blur-[140px] rounded-full" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            className="rounded-3xl border border-[#D4AF37]/20 bg-gradient-to-br from-[#D4AF37]/10 via-[#0F0F13] to-[#FF2D2D]/8 p-8 md:p-14 relative overflow-hidden"
            {...fadeUp(0)}
          >
            {/* Decorative corner sparkle */}
            <div className="absolute top-4 right-4 md:top-6 md:right-6 opacity-20">
              <Sparkles size={40} className="text-[#D4AF37]" />
            </div>
            <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 opacity-10">
              <PartyPopper size={32} className="text-[#FF2D2D]" />
            </div>

            {/* Grain texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none rounded-3xl"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />

            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">
              {/* Icon */}
              <motion.div
                className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/20 flex items-center justify-center"
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              >
                <Gift size={36} className="text-[#D4AF37]" />
              </motion.div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <span className="text-[#D4AF37] text-xs uppercase tracking-[0.25em] font-semibold">Offre exclusive</span>
                <h2 className="heading-md text-white mt-2 mb-4">
                  Tables <span className="text-[#D4AF37]">PROMO</span> par GHF Agency
                </h2>
                <p className="text-white/55 text-sm md:text-base leading-relaxed max-w-xl">
                  GHF Agency te propose des tables offertes — idéal pour les anniversaires, EVJF et soirées entre amies. Accès facilité, ambiance garantie. On s'occupe de tout. 🥂
                </p>

                {/* Tags */}
                <div className="flex flex-wrap justify-center md:justify-start gap-2.5 mt-5">
                  {[
                    { label: '🎂 Anniversaires', color: 'bg-[#FF2D2D]/15 border-[#FF2D2D]/25 text-[#FF2D2D]' },
                    { label: '👰 EVJF', color: 'bg-[#c084fc]/15 border-[#c084fc]/25 text-[#c084fc]' },
                    { label: '✨ Soirées entre amies', color: 'bg-[#D4AF37]/15 border-[#D4AF37]/25 text-[#D4AF37]' },
                  ].map(({ label, color }) => (
                    <span
                      key={label}
                      className={`inline-flex items-center px-3.5 py-1.5 rounded-full border text-xs font-medium ${color}`}
                    >
                      {label}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <motion.div className="mt-7" {...fadeUp(0.15)}>
                  <Link
                    href="/booking"
                    className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold animate-glow-pulse"
                    data-testid="promo-booking-btn"
                  >
                    <Calendar size={16} />
                    Réserver ma table offerte
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TABLE VIP ────────────────────────────────────────────── */}
      <section className="py-20 px-4 relative overflow-hidden bg-black/40" data-testid="vip-section">
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[700px] h-[400px] bg-[#D4AF37]/10 blur-[140px] rounded-full" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            className="rounded-3xl border border-[#D4AF37]/30 bg-gradient-to-br from-[#D4AF37]/12 via-[#0F0F13] to-[#D4AF37]/6 p-8 md:p-14 relative overflow-hidden"
            {...fadeUp(0)}
          >
            {/* Decorative corner sparkle */}
            <div className="absolute top-4 right-4 md:top-6 md:right-6 opacity-20">
              <Sparkles size={40} className="text-[#D4AF37]" />
            </div>
            <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 opacity-10">
              <Wine size={32} className="text-[#D4AF37]" />
            </div>

            {/* Grain texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none rounded-3xl"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />

            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">
              {/* Icon */}
              <motion.div
                className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-[#D4AF37]/25 to-[#D4AF37]/8 border border-[#D4AF37]/30 flex items-center justify-center"
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              >
                <Crown size={36} className="text-[#D4AF37]" />
              </motion.div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <span className="text-[#D4AF37] text-xs uppercase tracking-[0.25em] font-semibold">Expérience premium</span>
                <h2 className="heading-md text-white mt-2 mb-4">
                  Tables <span className="text-[#D4AF37]">VIP</span> par GHF Agency
                </h2>
                <p className="text-white/55 text-sm md:text-base leading-relaxed max-w-xl">
                  Carré privatisé dans les meilleurs clubs parisiens. Bouteilles premium, service dédié et accès prioritaire. L'excellence pour vos soirées. 👑
                </p>

                {/* Tags */}
                <div className="flex flex-wrap justify-center md:justify-start gap-2.5 mt-5">
                  {[
                    { label: '🍾 Bouteilles premium', color: 'bg-[#D4AF37]/15 border-[#D4AF37]/25 text-[#D4AF37]' },
                    { label: '🛋️ Carré privatisé', color: 'bg-[#D4AF37]/15 border-[#D4AF37]/25 text-[#D4AF37]' },
                    { label: '⚡ Accès prioritaire', color: 'bg-[#D4AF37]/15 border-[#D4AF37]/25 text-[#D4AF37]' },
                  ].map(({ label, color }) => (
                    <span
                      key={label}
                      className={`inline-flex items-center px-3.5 py-1.5 rounded-full border text-xs font-medium ${color}`}
                    >
                      {label}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <motion.div className="mt-7" {...fadeUp(0.15)}>
                  <Link
                    href="/booking"
                    className="btn-secondary inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black"
                    data-testid="vip-booking-btn"
                  >
                    <Crown size={16} />
                    Réserver ma table VIP
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PROCHAIN ÉVÉNEMENT ──────────────────────────────────── */}
      {events.length > 0 && (
        <section id="events" className="py-20 px-4 bg-black/40" data-testid="featured-event-section">
          <div className="max-w-7xl mx-auto">
            <motion.div className="text-center mb-12" {...fadeUp(0)}>
              <span className="text-neon-gold text-xs uppercase tracking-[0.2em]">À ne pas manquer</span>
              <h2 className="heading-md text-white mt-2">Prochain événement</h2>
            </motion.div>
            <EventCard event={events[0]} featured />
          </div>
        </section>
      )}

      {/* ── AUTRES ÉVÉNEMENTS ───────────────────────────────────── */}
      {events.length > 1 && (
        <section className="py-20 px-4" data-testid="events-grid-section">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="text-neon-gold text-xs uppercase tracking-[0.2em]">Calendrier</span>
                <h2 className="heading-md text-white mt-2">Autres événements</h2>
              </div>
              <Link
                href="/events"
                className="text-neon-red text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
                data-testid="see-all-events-btn"
              >
                Voir tout <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {events.slice(1, 4).map((event) => (
                <div key={event.id} className="h-full">
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── GALERIE ─────────────────────────────────────────────── */}
      {gallery.length > 0 && (
        <section className="py-20 px-4 bg-black/40" data-testid="gallery-preview-section">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-10">
              <div>
                <span className="text-neon-gold text-xs uppercase tracking-[0.2em]">Souvenirs</span>
                <h2 className="heading-md text-white mt-2">Galerie</h2>
              </div>
              <Link
                href="/gallery"
                className="text-neon-red text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
                data-testid="see-all-gallery-btn"
              >
                Voir tout <ArrowRight size={16} />
              </Link>
            </div>

            {/* Bento grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-3 h-[480px] md:h-[520px]">
              {gallery.map((item, index) => {
                const isHero = index === 0;
                const isWide = index === 3;
                return (
                  <motion.div
                    key={item.id}
                    className={`gallery-item rounded-2xl overflow-hidden relative group
                      ${isHero ? 'col-span-2 row-span-2' : ''}
                      ${isWide ? 'col-span-2' : ''}
                    `}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.07 }}
                    data-testid={`gallery-preview-${item.id}`}
                  >
                    <Image
                      src={item.url}
                      alt={item.title || 'Galerie GHF'}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      {item.title && (
                        <p className="text-white text-sm font-medium translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          {item.title}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── AVIS DM INSTAGRAM ───────────────────────────────────── */}
      <InstagramReviews />

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="py-28 px-4 relative overflow-hidden" data-testid="cta-section">
        {/* BG image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.pexels.com/photos/18718691/pexels-photo-18718691.jpeg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
        {/* Red glow center */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[300px] bg-[#FF2D2D]/10 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.span
            className="inline-block text-neon-gold text-xs uppercase tracking-[0.3em] mb-5"
            {...fadeUp(0)}
          >
            Rejoignez l'élite
          </motion.span>
          <motion.h2
            className="heading-lg text-white mb-6 leading-tight"
            {...fadeUp(0.1)}
          >
            Prêt à vivre une{' '}
            <span className="text-neon-red">expérience unique</span>&nbsp;?
          </motion.h2>
          <motion.p
            className="text-white/50 text-base md:text-lg mb-10 max-w-xl mx-auto"
            {...fadeUp(0.2)}
          >
            Tables VIP, soirées sur-mesure, accès exclusifs. Réservez maintenant et rejoignez-nous.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-3 justify-center"
            {...fadeUp(0.3)}
          >
            <Link
              href="/booking"
              className="btn-primary inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full text-base font-semibold animate-glow-pulse"
              data-testid="cta-booking-btn"
            >
              <Calendar size={18} />
              Réserver maintenant
            </Link>
            <Link
              href="/events"
              className="btn-secondary inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base"
            >
              Voir les événements
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
