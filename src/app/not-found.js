import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <h2 className="text-neon-red text-8xl font-bold mb-4 font-outfit">404</h2>
      <h3 className="heading-md text-white mb-6">Page introuvable</h3>
      <p className="text-white/60 max-w-md mx-auto mb-8">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Link 
        href="/"
        className="btn-primary inline-flex items-center gap-2 px-8 py-3 rounded-full"
      >
        <Home size={18} />
        Retour à l'accueil
      </Link>
    </div>
  );
}

