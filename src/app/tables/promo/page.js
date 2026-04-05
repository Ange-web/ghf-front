"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Users, Phone, MessageSquare, Check, Loader2, ArrowLeft, Info } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

function TablePromoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, openAuthModal } = useAuth();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    event_id: searchParams.get('event') || '',
    guests: 4,
    phone: '',
    special_requests: '',
    type: 'promo'
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await api.get('/api/events?has_table_promo=true');
      setEvents(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value) || 1 : value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await api.post('/api/reservations/table', formData);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Une erreur est survenue');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedEvent = events.find(e => e.id === formData.event_id);

  if (success) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center px-4" data-testid="table-promo-success">
        <motion.div className="max-w-md w-full text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-neon-red to-neon-gold rounded-full flex items-center justify-center mb-6">
            <Check size={40} className="text-white" />
          </div>
          <h2 className="heading-md text-white mb-4">Table Promo réservée !</h2>
          <p className="text-white/60 mb-8">
            Votre table promo pour <span className="text-neon-red">{selectedEvent?.title}</span> a été réservée. 
            Un email de confirmation vous sera envoyé.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => router.push('/profile')} className="btn-primary px-6 py-3 rounded-full">
              Voir mes réservations
            </button>
            <button onClick={() => { setSuccess(false); setFormData({ event_id: '', guests: 4, phone: '', special_requests: '', type: 'promo' }); }} className="btn-secondary px-6 py-3 rounded-full">
              Nouvelle réservation
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20" data-testid="table-promo-page">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={() => router.back()} className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={18} /> Retour
          </button>
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="text-neon-red" size={28} />
            <span className="text-neon-red text-xs uppercase tracking-[0.2em]">Tables Promo</span>
          </div>
          <h1 className="heading-lg text-white mt-2">Réserver une Table Promo</h1>
          <p className="text-white/60 mt-4">
            Profitez d&apos;une expérience privilégiée avec votre groupe. Table réservée jusqu&apos;à 6 personnes.
          </p>
        </motion.div>

        {/* Info Banner */}
        <motion.div
          className="mb-8 p-4 bg-neon-red/10 border border-neon-red/20 rounded-xl flex items-start gap-3"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        >
          <Info className="text-neon-red flex-shrink-0 mt-0.5" size={20} />
          <div className="text-sm text-white/70">
            <p className="font-medium text-white mb-1">Inclus dans la Table Promo :</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Table réservée (4 à 6 personnes)</li>
              <li>1 bouteille offerte</li>
              <li>Accès prioritaire</li>
              <li>Service dédié</li>
            </ul>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.form onSubmit={handleSubmit} className="space-y-6" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div>
              <label className="block text-sm text-white/70 mb-2">Événement *</label>
              <select name="event_id" value={formData.event_id} onChange={handleChange} className="form-input w-full px-4 py-3 rounded-lg" required data-testid="promo-event-select">
                <option value="">Sélectionnez un événement</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title} - {event.table_promo_price}€
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">Nombre de personnes *</label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <input type="number" name="guests" value={formData.guests} onChange={handleChange} min="2" max="6" className="form-input w-full pl-12 pr-4 py-3 rounded-lg" required data-testid="promo-guests-input" />
              </div>
              <p className="text-xs text-white/40 mt-1">Minimum 2, maximum 6 personnes</p>
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">Téléphone *</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+33 6 12 34 56 78" className="form-input w-full pl-12 pr-4 py-3 rounded-lg" required data-testid="promo-phone-input" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">Demandes spéciales</label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 text-white/40" size={18} />
                <textarea name="special_requests" value={formData.special_requests} onChange={handleChange} placeholder="Anniversaire, décoration, etc." rows={3} className="form-input w-full pl-12 pr-4 py-3 rounded-lg resize-none" data-testid="promo-requests-input" />
              </div>
            </div>

            {error && (
              <motion.p className="text-red-400 text-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {error}
              </motion.p>
            )}

            <button type="submit" disabled={submitting} className="btn-primary w-full py-4 rounded-lg flex items-center justify-center gap-2" data-testid="submit-promo-btn">
              {submitting ? (
                <><Loader2 className="animate-spin" size={20} /> Réservation en cours...</>
              ) : isAuthenticated ? (
                'Confirmer la réservation'
              ) : (
                'Se connecter pour réserver'
              )}
            </button>
          </motion.form>

          {/* Preview */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            {selectedEvent ? (
              <div className="sticky top-28 bg-[#0F0F13] rounded-xl overflow-hidden border border-neon-red/30">
                <div className="aspect-video relative">
                  <Image src={selectedEvent.image_url || 'https://images.pexels.com/photos/11481894/pexels-photo-11481894.jpeg'} alt={selectedEvent.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="text-neon-red" size={18} />
                    <span className="text-neon-red text-sm font-semibold">Table Promo</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{selectedEvent.title}</h3>
                  <div className="space-y-2 text-sm mt-4">
                    <div className="flex justify-between text-white/70">
                      <span>Prix de la table</span>
                      <span className="text-neon-red font-bold text-lg">{selectedEvent.table_promo_price}€</span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>Tables disponibles</span>
                      <span className="text-white">{selectedEvent.table_promo_available || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="sticky top-28 bg-[#0F0F13] rounded-xl p-8 border border-white/10 text-center">
                <Sparkles size={48} className="mx-auto text-white/20 mb-4" />
                <p className="text-white/50">Sélectionnez un événement</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function TablePromoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 flex items-center justify-center"><Loader2 className="animate-spin text-neon-red" size={40} /></div>}>
      <TablePromoContent />
    </Suspense>
  );
}

