"use client";

import { useEffect } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log de l'erreur dans la console du navigateur
    console.error("Next.js Error Boundary:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
        <AlertCircle size={40} className="text-neon-red" />
      </div>
      <h2 className="heading-md text-white mb-4">Une erreur est survenue !</h2>
      <p className="text-white/60 max-w-md mx-auto mb-8">
        Nous sommes désolés, mais une erreur inattendue s'est produite lors de l'affichage de cette page.
      </p>
      <button
        onClick={() => reset()}
        className="btn-primary inline-flex items-center gap-2 px-8 py-3 rounded-full"
      >
        <RefreshCcw size={18} />
        Réessayer
      </button>
    </div>
  );
}

