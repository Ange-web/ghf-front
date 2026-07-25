"use client";

import React from 'react';
import FastMarquee from 'react-fast-marquee';

export default function Marquee() {
  const items = [
    'TABLES OFFERTES',
    'ANNIVERSAIRES & EVJF',
    'ACCÈS VIP',
    'CLUBS PARISIENS',
    'RÉSERVATION RAPIDE',
    'SOIRÉES PRIVÉES',
    'GIRLS HAVE FUN',
  ];

  return (
    <div className="py-4 bg-black/40 border-y border-white/5" data-testid="marquee">
      <FastMarquee speed={50} gradient={false} pauseOnHover>
        {items.map((item, index) => (
          <span key={index} className="marquee-text mx-8">
            {item} <span>•</span>
          </span>
        ))}
      </FastMarquee>
    </div>
  );
}

