"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, Users, Gift, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import CountdownTimer from '@/components/CountdownTimer';

export default function ContestsPage() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [participatingId, setParticipatingId] = useState(null);
  const { isAuthenticated, openAuthModal } = useAuth();

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      const { data } = await api.get('/api/contests');
      setContests(data);
    } catch (error) {
      console.error('Error fetching contests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleParticipate = async (contestId) => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    setParticipatingId(contestId);
    try {
      await api.post(`/api/contests/${contestId}/participate`, { contest_id: contestId });
      fetchContests();
    } catch (error) {
      console.error('Error participating:', error);
      toast.error(error.response?.data?.detail || 'Erreur lors de la participation');
    } finally {
      setParticipatingId(null);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20" data-testid="contests-page">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span className="text-neon-gold text-xs uppercase tracking-[0.2em]">
            Jeux &amp; Concours
          </span>
          <h1 className="heading-lg text-white mt-2">Tentez votre chance</h1>
          <p className="text-white/60 mt-4 max-w-xl mx-auto">
            Participez à nos concours exclusifs et gagnez des entrées VIP, des bouteilles de champagne et bien plus encore !
          </p>
        </motion.div>
      </div>

      {/* Contests Grid */}
      <div className="max-w-5xl mx-auto px-4">
        {loading ? (
          <div className="space-y-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="skeleton h-96 rounded-2xl" />
            ))}
          </div>
        ) : contests.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Trophy size={64} className="mx-auto text-white/20 mb-4" />
            <p className="text-white/50 text-lg">Aucun concours actif pour le moment</p>
            <p className="text-white/30 text-sm mt-2">
              Revenez bientôt pour de nouvelles opportunités !
            </p>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {contests.map((contest, index) => (
              <motion.div
                key={contest.id}
                className="contest-card rounded-2xl overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                data-testid={`contest-${contest.id}`}
              >
                <div className="grid md:grid-cols-2">
                  {/* Image */}
                  <div className="aspect-video md:aspect-auto relative overflow-hidden">
                    <img
                      src={contest.image_url || 'https://images.pexels.com/photos/11481894/pexels-photo-11481894.jpeg'}
                      alt={contest.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r" />
                  </div>

                  {/* Content */}
                  <div className="p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-4">
                      <Trophy className="text-neon-gold" size={20} />
                      <span className="text-neon-gold text-sm font-medium uppercase tracking-wider">
                        Concours
                      </span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                      {contest.title}
                    </h2>

                    <p className="text-white/60 mb-6">
                      {contest.description}
                    </p>

                    {/* Prize */}
                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg mb-6">
                      <Gift className="text-neon-red" size={24} />
                      <div>
                        <p className="text-white/50 text-xs uppercase tracking-wider">À gagner</p>
                        <p className="text-white font-semibold">{contest.prize}</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-4 mb-6 text-sm">
                      <div className="flex items-center gap-2 text-white/60">
                        <Users size={16} className="text-neon-red" />
                        <span>{contest.participants_count} participants</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/60">
                        <Clock size={16} className="text-neon-red" />
                        <span>
                          Fin le {new Date(contest.end_date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long'
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Countdown */}
                    {contest.is_active && (
                      <div className="mb-6">
                        <p className="text-white/50 text-xs uppercase tracking-wider mb-3">
                          Temps restant
                        </p>
                        <CountdownTimer targetDate={contest.end_date} />
                      </div>
                    )}

                    {/* Action Button */}
                    {contest.is_active ? (
                      <button
                        onClick={() => handleParticipate(contest.id)}
                        disabled={participatingId === contest.id}
                        className="btn-primary py-4 rounded-lg flex items-center justify-center gap-2"
                        data-testid={`participate-btn-${contest.id}`}
                      >
                        {participatingId === contest.id ? (
                          <>
                            <Loader2 className="animate-spin" size={20} />
                            Inscription...
                          </>
                        ) : (
                          <>
                            <Trophy size={20} />
                            Participer maintenant
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="text-center py-4 border border-white/10 rounded-lg">
                        <p className="text-white/50">Concours terminé</p>
                        {contest.winner?.name && (
                          <p className="text-neon-gold text-sm mt-1">
                            Gagnant : {contest.winner.name}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="max-w-5xl mx-auto px-4 mt-16">
        <motion.div
          className="bg-[#0F0F13] rounded-2xl p-8 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl font-bold text-white mb-6">Comment participer ?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 flex-shrink-0 bg-neon-red/20 rounded-full flex items-center justify-center text-neon-red font-bold">
                1
              </div>
              <div>
                <p className="text-white font-medium mb-1">Créez un compte</p>
                <p className="text-white/50 text-sm">Inscrivez-vous gratuitement sur notre plateforme</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 flex-shrink-0 bg-neon-red/20 rounded-full flex items-center justify-center text-neon-red font-bold">
                2
              </div>
              <div>
                <p className="text-white font-medium mb-1">Participez</p>
                <p className="text-white/50 text-sm">Cliquez sur le bouton participer du concours</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 flex-shrink-0 bg-neon-red/20 rounded-full flex items-center justify-center text-neon-red font-bold">
                3
              </div>
              <div>
                <p className="text-white font-medium mb-1">Croisez les doigts</p>
                <p className="text-white/50 text-sm">Le tirage au sort déterminera le gagnant</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

