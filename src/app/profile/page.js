"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Ticket, LogOut, Edit, Save, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading, logout, updateProfile } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const [reservationToCancel, setReservationToCancel] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchReservations();
      setEditForm({ name: user?.name || '', email: user?.email || '' });
    }
  }, [isAuthenticated, user]);

  const fetchReservations = async () => {
    try {
      const { data } = await api.get('/api/reservations/my');
      setReservations(data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoadingReservations(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const result = await updateProfile(editForm);
      if (result.success) {
        setEditing(false);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelReservation = (reservationId) => {
    setReservationToCancel(reservationId);
  };

  const confirmCancelReservation = async () => {
    if (!reservationToCancel) return;
    
    try {
      await api.delete(`/api/reservations/${reservationToCancel}`);
      fetchReservations();
      toast.success('Réservation annulée');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de l\'annulation');
    } finally {
      setReservationToCancel(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="animate-spin text-neon-red" size={40} />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen pt-24 pb-20" data-testid="profile-page">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <motion.div
          className="bg-[#0F0F13] rounded-2xl p-8 border border-white/10 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-red to-neon-gold flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1">
              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-white/60 mb-1 block">Nom</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="form-input w-full px-4 py-2 rounded-lg"
                      data-testid="edit-name-input"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-white/60 mb-1 block">Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="form-input w-full px-4 py-2 rounded-lg"
                      data-testid="edit-email-input"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                      data-testid="save-profile-btn"
                    >
                      {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                      {saving ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setEditForm({ name: user?.name || '', email: user?.email || '' });
                      }}
                      className="px-4 py-2 rounded-lg text-white/60 hover:text-white flex items-center gap-2 text-sm border border-white/10"
                    >
                      <X size={16} />
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
                  <p className="text-white/60 flex items-center gap-2 mt-1">
                    <Mail size={16} />
                    {user?.email}
                  </p>
                  {user?.role === 'admin' && (
                    <span className="inline-block mt-2 px-3 py-1 bg-neon-gold/20 text-neon-gold text-xs font-semibold uppercase tracking-wider rounded-full">
                      Administrateur
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="btn-secondary px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                  data-testid="edit-profile-btn"
                >
                  <Edit size={16} />
                  Modifier
                </button>
              )}
              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg text-red-400 hover:text-red-300 flex items-center gap-2 text-sm border border-red-500/20 hover:border-red-500/40 transition-colors"
                data-testid="profile-logout-btn"
              >
                <LogOut size={16} />
                Déconnexion
              </button>
            </div>
          </div>
        </motion.div>

        {/* Reservations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <Ticket className="text-neon-red" size={24} />
            Mes réservations
          </h3>

          {loadingReservations ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton h-24 rounded-xl" />
              ))}
            </div>
          ) : reservations.length === 0 ? (
            <div className="text-center py-12 bg-[#0F0F13] rounded-xl border border-white/10">
              <Ticket size={48} className="mx-auto text-white/20 mb-4" />
              <p className="text-white/50">Aucune réservation pour le moment</p>
              <p className="text-white/30 text-sm mt-2">
                Consultez nos événements pour réserver votre prochaine soirée !
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reservations.map((reservation, index) => (
                <motion.div
                  key={reservation.id}
                  className="bg-[#0F0F13] rounded-xl p-4 md:p-6 border border-white/10 hover:border-white/20 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  data-testid={`reservation-${reservation.id}`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-neon-red/20 flex items-center justify-center">
                        <Calendar className="text-neon-red" size={20} />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{reservation.event_title}</h4>
                        <p className="text-white/50 text-sm mt-1">
                          {new Date(reservation.event_date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-white/40">
                          <span>{reservation.guests} personne{reservation.guests > 1 ? 's' : ''}</span>
                          <span>•</span>
                          <span>Réservé le {new Date(reservation.created_at).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        reservation.status === 'confirmed'
                          ? 'bg-green-500/20 text-green-500'
                          : reservation.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-500'
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                        {reservation.status === 'confirmed' ? 'Confirmée' :
                         reservation.status === 'pending' ? 'En attente' : 'Annulée'}
                      </span>
                      
                      {reservation.status !== 'cancelled' && (
                        <button
                          onClick={() => handleCancelReservation(reservation.id)}
                          className="text-white/40 hover:text-red-400 transition-colors"
                          title="Annuler"
                          data-testid={`cancel-reservation-${reservation.id}`}
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Cancel Confirmation Modal */}
      {reservationToCancel && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setReservationToCancel(null)} />
          <div className="bg-[#0F0F13] rounded-2xl p-6 border border-white/10 relative z-10 max-w-sm w-full text-center">
            <h3 className="text-xl font-bold text-white mb-2">Annuler la réservation</h3>
            <p className="text-white/60 mb-6">ÃŠtes-vous sûr de vouloir annuler cette réservation ? Cette action est irréversible.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setReservationToCancel(null)} className="px-4 py-2 rounded-lg text-white/60 hover:text-white transition-colors">
                Non, garder
              </button>
              <button 
                onClick={confirmCancelReservation} 
                className="px-4 py-2 bg-red-500/20 text-red-500 hover:bg-red-500/30 rounded-lg transition-colors"
                data-testid="confirm-cancel-btn"
              >
                Oui, annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

