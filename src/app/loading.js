import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-neon-red rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-3 h-3 bg-neon-gold rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
      </div>
      <p className="text-white/50 mt-4 text-sm font-medium tracking-wide">CHARGEMENT...</p>
    </div>
  );
}

