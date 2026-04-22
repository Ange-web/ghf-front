"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import CountdownTimer from './CountdownTimer';

export default function EventCard({ event, featured = false }) {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return price === 0 ? 'Gratuit' : `${price}€`;
  };

  // Spots — supporte spotsLeft (API réelle) et available_spots (legacy)
  const spotsLeft = event.spotsLeft ?? event.available_spots ?? 0;
  const capacity = event.capacity ?? 0;
  const spotsPercent = capacity > 0 ? Math.max(0, Math.min(100, (spotsLeft / capacity) * 100)) : null;

  const isSoldOut = spotsLeft <= 0;
  const isSoon = (() => {
    const diff = new Date(event.date) - new Date();
    return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
  })();

  const spotsColor = spotsPercent === null ? '' :
    spotsPercent < 20 ? 'bg-neon-red' :
    spotsPercent < 50 ? 'bg-orange-400' :
    'bg-emerald-500';

  const spotsTextColor = spotsPercent === null ? 'text-neon-gold' :
    spotsPercent < 20 ? 'text-neon-red' :
    spotsPercent < 50 ? 'text-orange-400' :
    'text-emerald-400';

  const imgSrc = event.imageUrl || event.image_url || 'https://images.pexels.com/photos/11481894/pexels-photo-11481894.jpeg';

  if (featured) {
    return (
      <motion.div
        className="event-card rounded-2xl overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        data-testid={`featured-event-${event.id}`}
      >
        <div className="relative min-h-[550px] sm:aspect-[4/5] md:aspect-[21/9] bg-black overflow-hidden flex items-center justify-center">
          <Image src={imgSrc} alt="" fill className="object-cover opacity-30 blur-2xl scale-110" priority />
          <Image src={imgSrc} alt={event.title} fill className="object-contain" sizes="(max-width: 768px) 100vw, 80vw" priority />
          <div className="absolute inset-0 gradient-overlay" />

          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                {/* Status badges */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neon-red text-white text-xs font-semibold uppercase tracking-wider rounded-full">
                    {isSoon && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" aria-hidden="true" />
                    )}
                    Prochain événement
                  </span>
                  {isSoon && !isSoldOut && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500/80 text-white text-xs font-semibold uppercase tracking-wider rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" aria-hidden="true" />
                      Bientôt
                    </span>
                  )}
                  {isSoldOut && (
                    <span className="inline-flex items-center px-3 py-1 bg-white/10 text-white/60 text-xs font-semibold uppercase tracking-wider rounded-full">
                      Complet
                    </span>
                  )}
                </div>

                <h3 className="heading-lg text-white mb-3">{event.title}</h3>
                <p className="text-white/70 text-sm md:text-base max-w-xl mb-4 line-clamp-2">
                  {event.description}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-white/60 mb-4">
                  <span className="flex items-center gap-2">
                    <Calendar size={16} className="text-neon-gold" />
                    {formatDate(event.date)}
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin size={16} className="text-neon-gold" />
                    {event.venue || event.location}
                  </span>
                  <span className={`flex items-center gap-2 ${spotsTextColor}`}>
                    <Users size={16} />
                    {isSoldOut ? 'Complet' : `${spotsLeft} places restantes`}
                  </span>
                </div>

                {/* Progress bar */}
                {spotsPercent !== null && !isSoldOut && (
                  <div className="w-full max-w-xs">
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${spotsColor}`}
                        style={{ width: `${spotsPercent}%` }}
                        role="progressbar"
                        aria-valuenow={spotsLeft}
                        aria-valuemax={capacity}
                        aria-label={`${spotsLeft} places sur ${capacity} disponibles`}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-start md:items-end gap-4">
                <CountdownTimer targetDate={event.date} />
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-2xl font-bold text-neon-gold">
                    {formatPrice(event.price)}
                  </span>
                  <Link
                    href={`/booking?event=${event.id}`}
                    className="btn-primary px-6 py-3 rounded-full flex items-center gap-2"
                    data-testid={`book-event-${event.id}`}
                    aria-label={`Réserver ${event.title}`}
                  >
                    Réserver
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <Link href={`/events/${event.id}`} aria-label={`Voir les détails de ${event.title}`} className="block h-full">
      <motion.div
        className="event-card rounded-xl overflow-hidden group cursor-pointer h-full flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        data-testid={`event-card-${event.id}`}
      >
        {/* Image */}
        <div className="event-card-image bg-black overflow-hidden relative flex items-center justify-center">
          <Image src={imgSrc} alt="" fill className="object-cover opacity-30 blur-xl scale-110" />
          <Image
            src={imgSrc}
            alt={event.title}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 gradient-overlay opacity-60" />

          {/* Price badge */}
          <div className="absolute top-4 right-4 bg-neon-gold text-black px-3 py-1 text-sm font-bold rounded-full shadow-lg">
            {formatPrice(event.price)}
          </div>

          {/* Category + status */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <div className="bg-black/60 backdrop-blur-sm text-white/80 px-3 py-1 text-xs uppercase tracking-wider rounded-full">
              {event.category}
            </div>
            {isSoon && !isSoldOut && (
              <div className="flex items-center gap-1.5 bg-orange-500/80 backdrop-blur-sm text-white px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" aria-hidden="true" />
                Bientôt
              </div>
            )}
            {isSoldOut && (
              <div className="bg-white/10 backdrop-blur-sm text-white/50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-full">
                Complet
              </div>
            )}
          </div>

          {/* VIP / Promo badges */}
          {(event.hasTablePromo || event.has_table_promo || event.hasTableVip || event.has_table_vip) && (
            <div className="absolute bottom-4 left-4 flex gap-2">
              {(event.hasTablePromo || event.has_table_promo) && (
                <span className="bg-neon-red/80 text-white px-2 py-0.5 text-xs rounded font-medium">
                  Tables Promo
                </span>
              )}
              {(event.hasTableVip || event.has_table_vip) && (
                <span className="bg-neon-gold/80 text-black px-2 py-0.5 text-xs rounded font-semibold">
                  VIP
                </span>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-neon-red transition-colors line-clamp-1">
            {event.title}
          </h3>
          <p className="text-white/60 text-sm mb-4 line-clamp-2 flex-1">
            {event.description}
          </p>

          <div className="flex flex-wrap gap-3 text-xs text-white/50 mb-4">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-neon-red" />
              {formatDate(event.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={14} className="text-neon-red" />
              {event.venue || event.location}
            </span>
          </div>

          {/* Spots + progress bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-xs font-medium ${spotsTextColor}`}>
                {isSoldOut
                  ? 'Complet'
                  : spotsPercent !== null && spotsPercent < 20
                    ? `⚡ Plus que ${spotsLeft} place${spotsLeft > 1 ? 's' : ''} !`
                    : `${spotsLeft} places restantes`
                }
              </span>
              {spotsPercent !== null && !isSoldOut && (
                <span className="text-xs text-white/30">{Math.round(spotsPercent)}%</span>
              )}
            </div>
            {spotsPercent !== null && (
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${isSoldOut ? 'bg-white/20 w-full' : spotsColor}`}
                  style={{ width: isSoldOut ? '100%' : `${spotsPercent}%` }}
                  role="progressbar"
                  aria-valuenow={spotsLeft}
                  aria-valuemax={capacity}
                  aria-label={`${spotsLeft} places sur ${capacity} disponibles`}
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-auto">
            <span className="text-neon-gold font-bold text-base">
              {formatPrice(event.price)}
            </span>
            <span
              className="text-neon-red text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all"
              data-testid={`book-btn-${event.id}`}
            >
              Voir détails
              <ArrowRight size={16} />
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
