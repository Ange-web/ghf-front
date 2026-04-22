"use client";

/**
 * InstagramReviews.js
 * Affiche les avis Instagram sous forme de vraie conversation DM.
 * Style : interface Instagram Dark Mode (bulle reçue, header, réaction, barre de saisie).
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Phone, Video, Info } from 'lucide-react';
import { useApi } from '@/hooks/useApi';

// ── Icônes inline ──────────────────────────────────────────────

function InstagramIcon({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

function SendIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  );
}

// ── Composants UI ──────────────────────────────────────────────

function Avatar({ name, size = 9 }) {
  const letter = name?.charAt(0).toUpperCase() || 'I';
  return (
    <div
      className={`w-${size} h-${size} rounded-full bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] p-[2px] shrink-0`}
      style={{ width: `${size * 4}px`, height: `${size * 4}px` }}
    >
      <div className="w-full h-full rounded-full bg-[#111] flex items-center justify-center text-white font-bold"
        style={{ fontSize: `${size * 1.4}px` }}>
        {letter}
      </div>
    </div>
  );
}

function StarRating({ rating = 5 }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={11}
          className={i < rating ? 'text-yellow-400 fill-current' : 'text-white/15 fill-current'} />
      ))}
    </div>
  );
}

// Heure simulée cohérente avec l'index
function getTime(index) {
  const base = new Date();
  base.setHours(21 + (index % 3), [14, 32, 47][index % 3], 0);
  return base.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

// ── Carte DM Instagram ─────────────────────────────────────────

function DMCard({ review, index }) {
  const username = review.instagramUsername || review.authorName || 'utilisateur';
  const time = getTime(index);

  return (
    <div className="bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60 w-full max-w-sm mx-auto select-none">

      {/* ── Header Instagram DM ── */}
      <div className="px-4 pt-4 pb-3 border-b border-white/8 flex items-center gap-3">
        {/* Retour */}
        <button className="text-white p-1 -ml-1 shrink-0" aria-hidden="true" tabIndex={-1}>
          <ChevronLeft size={22} />
        </button>

        {/* Avatar + statut en ligne */}
        <div className="relative shrink-0">
          <Avatar name={username} size={9} />
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-black" />
        </div>

        {/* Nom + statut */}
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold truncate">@{username}</p>
          <p className="text-emerald-400 text-[11px]">En ligne</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 text-white shrink-0">
          <button aria-hidden="true" tabIndex={-1}><Phone size={20} /></button>
          <button aria-hidden="true" tabIndex={-1}><Video size={22} /></button>
          <button aria-hidden="true" tabIndex={-1}><Info size={20} /></button>
        </div>
      </div>

      {/* ── Zone de messages ── */}
      <div className="bg-black px-4 pt-5 pb-4 min-h-[220px] flex flex-col justify-end gap-3">

        {/* Timestamp centré */}
        <p className="text-white/25 text-[10px] text-center uppercase tracking-wider">
          Aujourd&apos;hui {time}
        </p>

        {/* Bulle reçue (left) */}
        <div className="flex items-end gap-2">
          <Avatar name={username} size={6} />

          <div className="flex flex-col gap-1 max-w-[78%]">
            {/* Bulle message */}
            <div className="bg-[#262626] rounded-[20px] rounded-bl-[5px] px-4 py-3">
              <p className="text-white text-sm leading-relaxed">
                {review.content}
              </p>
            </div>

            {/* Réaction cœur */}
            <div className="flex items-center gap-1.5 ml-1">
              <span className="text-base leading-none">❤️</span>
              <span className="text-white/30 text-[10px]">GHF Agency a aimé</span>
            </div>
          </div>
        </div>

        {/* Indicateur Lu */}
        <div className="flex justify-end items-center gap-1 mt-1">
          <span className="text-white/25 text-[10px]">Lu</span>
          <Avatar name="G" size={3} />
        </div>
      </div>

      {/* ── Barre de saisie (décorative) ── */}
      <div className="px-4 py-3 border-t border-white/8 flex items-center gap-3">
        {/* Emoji + appareil photo */}
        <button className="text-white/40 shrink-0" aria-hidden="true" tabIndex={-1}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
          </svg>
        </button>

        {/* Champ texte */}
        <div className="flex-1 bg-[#1c1c1c] border border-white/10 rounded-full px-4 py-2 flex items-center justify-between">
          <span className="text-white/20 text-sm">Message…</span>
          <div className="flex gap-2 text-white/30">
            <button aria-hidden="true" tabIndex={-1}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
              </svg>
            </button>
            <button aria-hidden="true" tabIndex={-1}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Micro */}
        <button className="text-white/40 shrink-0" aria-hidden="true" tabIndex={-1}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
        </button>
      </div>

      {/* ── Footer : note + badge ── */}
      <div className="px-4 py-3 bg-[#0a0a0a] border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StarRating rating={review.rating} />
          {review.authorRole && (
            <span className="text-white/30 text-[10px]">— {review.authorRole}</span>
          )}
        </div>
        {review.source === 'instagram' && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white">
            <InstagramIcon size={8} />
            Vérifié
          </span>
        )}
      </div>
    </div>
  );
}

// ── Composant principal ────────────────────────────────────────

export default function InstagramReviews() {
  const { data: rawData, loading } = useApi('/api/testimonials');
  const reviews = rawData || [];

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef(null);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrent(prev => (prev + 1) % Math.max(reviews.length, 1));
    }, 6000);
  };

  useEffect(() => {
    if (reviews.length > 1) startTimer();
    return () => clearInterval(timerRef.current);
  }, [reviews.length]);

  const goTo = (index, dir) => {
    clearInterval(timerRef.current);
    setDirection(dir);
    setCurrent(index);
    startTimer();
  };

  const prev = () => goTo((current - 1 + reviews.length) % reviews.length, -1);
  const next = () => goTo((current + 1) % reviews.length, 1);

  if (loading || reviews.length === 0) return null;

  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60, scale: 0.97 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60, scale: 0.97 }),
  };

  return (
    <section className="py-20 px-4 relative overflow-hidden" aria-label="Avis clients Instagram">

      {/* Glow bg */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-[#833ab4]/8 to-[#fcb045]/8 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-2xl mx-auto relative">

        {/* Header section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#833ab4]/20 to-[#fcb045]/20 border border-white/10 mb-4">
            <InstagramIcon size={13} className="text-[#fcb045]" />
            <span className="text-white/60 text-xs uppercase tracking-widest">Messages privés sélectionnés</span>
          </div>
          <h2 className="heading-md text-white mt-2">Ce qu&apos;ils nous écrivent</h2>
          <p className="text-white/40 text-sm mt-2">Avis authentiques curatés depuis nos DMs Instagram</p>
        </div>

        {/* Slider */}
        <div className="relative px-8">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={reviews[current].id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            >
              <DMCard review={reviews[current]} index={current} />
            </motion.div>
          </AnimatePresence>

          {/* Flèches navigation */}
          {reviews.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"
                aria-label="Avis précédent"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={next}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"
                aria-label="Avis suivant"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}
        </div>

        {/* Dots */}
        {reviews.length > 1 && (
          <div className="flex justify-center gap-2 mt-8" role="tablist" aria-label="Navigation des avis">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > current ? 1 : -1)}
                role="tab"
                aria-selected={i === current}
                aria-label={`Avis ${i + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  i === current
                    ? 'w-6 h-1.5 bg-gradient-to-r from-[#833ab4] to-[#fcb045]'
                    : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
