"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Clock, Users, Gift, Loader2, Star, Sparkles, CheckCircle2, AlertTriangle, Crown } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import CountdownTimer from '@/components/CountdownTimer';
import Image from 'next/image';

const FALLBACK_IMAGE = 'https://images.pexels.com/photos/11481894/pexels-photo-11481894.jpeg';

function getUrgencyLevel(endDate) {
  const diff = new Date(endDate) - new Date();
  if (diff <= 0) return 'expired';
  if (diff < 24 * 60 * 60 * 1000) return 'critical'; // < 24h
  if (diff < 3 * 24 * 60 * 60 * 1000) return 'soon';  // < 3 days
  return 'normal';
}

export default function ContestsPage() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [participatingId, setParticipatingId] = useState(null);
  const [participatedIds, setParticipatedIds] = useState(new Set());
  const { isAuthenticated, openAuthModal } = useAuth();

  useEffect(() => { fetchContests(); }, []);

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
    if (!isAuthenticated) { openAuthModal(); return; }
    setParticipatingId(contestId);
    try {
      await api.post(`/api/contests/${contestId}/participate`, { contest_id: contestId });
      setParticipatedIds(prev => new Set([...prev, contestId]));
      toast.success('Participation enregistrée ! Bonne chance.');
      fetchContests();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de la participation');
    } finally {
      setParticipatingId(null);
    }
  };

  const activeContests = contests.filter(c => c.is_active);
  const pastContests = contests.filter(c => !c.is_active);

  return (
    <div className="min-h-screen pb-20" data-testid="contests-page">

      {/* ── Hero Header ─────────────────────────────────────── */}
      <div className="relative pt-32 pb-20 px-4 text-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-neon-gold/5 blur-[100px]" />
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Animated trophy */}
          <motion.div
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-neon-gold/20 to-neon-gold/5 border border-neon-gold/20 flex items-center justify-center"
            animate={{ boxShadow: ['0 0 20px rgba(255,238,0,0.1)', '0 0 40px rgba(255,238,0,0.25)', '0 0 20px rgba(255,238,0,0.1)'] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <Trophy size={36} className="text-neon-gold" />
          </motion.div>

          <span className="text-neon-gold text-xs uppercase tracking-[0.3em]">Jeux &amp; Concours</span>
          <h1 className="heading-lg text-white mt-3">Tentez votre chance</h1>
          <p className="text-white/50 mt-4 max-w-lg mx-auto text-sm leading-relaxed">
            Participez à nos concours exclusifs et gagnez des entrées VIP, des bouteilles de champagne et bien plus encore.
          </p>

          {/* Stats bar */}
          {!loading && contests.length > 0 && (
            <motion.div
              className="inline-flex items-center gap-6 mt-8 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="flex items-center gap-2 text-white/60">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white font-semibold">{activeContests.length}</span> concours actif{activeContests.length > 1 ? 's' : ''}
              </span>
              <span className="w-px h-4 bg-white/10" />
              <span className="flex items-center gap-2 text-white/60">
                <Users size={14} className="text-neon-gold" />
                <span className="text-white font-semibold">
                  {contests.reduce((acc, c) => acc + (c.participants_count || 0), 0)}
                </span> participants
              </span>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* ── Contests ───────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4">
        {loading ? (
          <div className="space-y-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="skeleton h-80 rounded-2xl" />
            ))}
          </div>
        ) : contests.length === 0 ? (
          <motion.div className="text-center py-24" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Trophy size={56} className="mx-auto text-white/10 mb-4" />
            <p className="text-white/40 text-lg font-medium">Aucun concours actif</p>
            <p className="text-white/25 text-sm mt-2">Revenez bientôt pour de nouvelles opportunités !</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Active contests */}
            {activeContests.map((contest, index) => {
              const urgency = getUrgencyLevel(contest.end_date);
              const hasParticipated = participatedIds.has(contest.id) || contest.has_participated;
              const isLoading = participatingId === contest.id;

              return (
                <motion.article
                  key={contest.id}
                  className="contest-card rounded-2xl overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 }}
                  data-testid={`contest-${contest.id}`}
                >
                  <div className="grid md:grid-cols-5">
                    {/* Image — 2/5 */}
                    <div className="md:col-span-2 relative min-h-[220px] md:min-h-0 overflow-hidden">
                      <Image
                        src={contest.image_url || FALLBACK_IMAGE}
                        alt={contest.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 40vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/60" />

                      {/* Status badges on image */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {urgency === 'critical' && (
                          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-neon-red rounded-full text-white text-[10px] font-bold uppercase tracking-wider">
                            <AlertTriangle size={10} />
                            Dernière chance
                          </span>
                        )}
                        {urgency === 'soon' && (
                          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-500/90 rounded-full text-white text-[10px] font-bold uppercase tracking-wider">
                            <Clock size={10} />
                            Se termine bientôt
                          </span>
                        )}
                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/80 backdrop-blur-sm rounded-full text-white text-[10px] font-bold uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                          Actif
                        </span>
                      </div>

                      {hasParticipated && (
                        <div className="absolute bottom-3 left-3">
                          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-neon-gold/90 rounded-full text-black text-xs font-bold">
                            <CheckCircle2 size={13} />
                            Inscrit
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content — 3/5 */}
                    <div className="md:col-span-3 p-6 md:p-8 flex flex-col justify-between gap-5">
                      {/* Top */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Trophy size={14} className="text-neon-gold" />
                          <span className="text-neon-gold text-xs font-semibold uppercase tracking-widest">Concours exclusif</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white leading-tight mb-3">{contest.title}</h2>
                        <p className="text-white/55 text-sm leading-relaxed line-clamp-3">{contest.description}</p>
                      </div>

                      {/* Prize — highlighted */}
                      <div className="relative flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-neon-gold/10 to-transparent border border-neon-gold/20">
                        <div className="w-10 h-10 rounded-full bg-neon-gold/15 flex items-center justify-center shrink-0">
                          <Gift size={18} className="text-neon-gold" />
                        </div>
                        <div>
                          <p className="text-neon-gold/70 text-[10px] uppercase tracking-[0.2em] font-semibold">À gagner</p>
                          <p className="text-white font-bold text-base leading-tight">{contest.prize}</p>
                        </div>
                      </div>

                      {/* Participants + date */}
                      <div className="flex flex-wrap gap-4 text-xs text-white/50">
                        <span className="flex items-center gap-1.5">
                          <Users size={13} className="text-neon-red" />
                          {contest.participants_count || 0} participants
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={13} className="text-neon-red" />
                          Fin le {new Date(contest.end_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>

                      {/* Countdown */}
                      <div>
                        <p className="text-white/40 text-[10px] uppercase tracking-widest mb-2">Temps restant</p>
                        <CountdownTimer targetDate={contest.end_date} />
                      </div>

                      {/* CTA */}
                      {hasParticipated ? (
                        <div className="flex items-center gap-3 py-3.5 px-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                          <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                          <div>
                            <p className="text-emerald-400 font-semibold text-sm">Vous êtes inscrit !</p>
                            <p className="text-white/40 text-xs">Le tirage au sort aura lieu à la fin du concours.</p>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleParticipate(contest.id)}
                          disabled={isLoading}
                          className="relative w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 overflow-hidden
                            bg-gradient-to-r from-neon-gold to-[#E5C048] text-black
                            hover:shadow-[0_0_30px_rgba(255,238,0,0.35)] hover:-translate-y-0.5
                            disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
                            flex items-center justify-center gap-2"
                          data-testid={`participate-btn-${contest.id}`}
                          aria-label={`Participer au concours ${contest.title}`}
                        >
                          {isLoading ? (
                            <><Loader2 className="animate-spin" size={18} />Inscription...</>
                          ) : (
                            <><Sparkles size={18} />Participer maintenant</>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}

            {/* Past contests */}
            {pastContests.length > 0 && (
              <div className="mt-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-white/30 text-xs uppercase tracking-widest">Concours terminés</span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                <div className="space-y-4">
                  {pastContests.map((contest, index) => (
                    <motion.article
                      key={contest.id}
                      className="rounded-xl overflow-hidden border border-white/8 bg-white/3"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      data-testid={`contest-${contest.id}`}
                    >
                      <div className="flex flex-col sm:flex-row gap-0">
                        {/* Small image */}
                        <div className="sm:w-32 h-24 sm:h-auto relative shrink-0 overflow-hidden">
                          <Image
                            src={contest.image_url || FALLBACK_IMAGE}
                            alt={contest.title}
                            fill
                            className="object-cover opacity-50 grayscale"
                            sizes="128px"
                          />
                        </div>

                        <div className="flex-1 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            <span className="text-white/25 text-[10px] uppercase tracking-widest">Terminé</span>
                            <h3 className="text-white/60 font-semibold mt-0.5">{contest.title}</h3>
                            <p className="text-white/35 text-xs mt-1 flex items-center gap-1.5">
                              <Gift size={11} />
                              {contest.prize}
                            </p>
                          </div>

                          {contest.winner?.name ? (
                            <div className="flex items-center gap-3 px-4 py-2.5 bg-neon-gold/10 border border-neon-gold/20 rounded-xl shrink-0">
                              <Crown size={16} className="text-neon-gold" />
                              <div>
                                <p className="text-neon-gold/60 text-[10px] uppercase tracking-wider">Gagnant</p>
                                <p className="text-neon-gold font-bold text-sm">{contest.winner.name}</p>
                              </div>
                            </div>
                          ) : (
                            <span className="text-white/25 text-xs">Aucun gagnant annoncé</span>
                          )}
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── How to participate ─────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 mt-20">
        <motion.div
          className="bg-[#0F0F13] rounded-2xl p-8 md:p-12 border border-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.55)]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <span className="text-neon-gold text-xs uppercase tracking-[0.3em]">Simple &amp; rapide</span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white mt-3 uppercase tracking-[0.12em]">
              Comment participer ?
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-0 relative">
            {/* Connecting line desktop */}
            <div
              className="hidden md:block absolute top-10 left-[16.66%] right-[16.66%] h-px bg-neon-gold/25"
              aria-hidden="true"
            />

            {[
              { num: 1, icon: Star, title: 'Créez un compte', desc: 'Inscrivez-vous gratuitement sur notre plateforme' },
              { num: 2, icon: Trophy, title: 'Participez', desc: 'Cliquez sur "Participer" sur le concours de votre choix' },
              { num: 3, icon: Gift, title: 'Gagnez', desc: 'Le tirage au sort désigne le gagnant à la fin du concours' },
            ].map(({ num, icon: Icon, title, desc }) => (
              <div key={num} className="flex flex-col items-center text-center px-6 gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-[#1A1012] border border-neon-gold/10 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] flex items-center justify-center z-10 relative">
                    <Icon size={26} className="text-neon-gold" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-neon-red text-white text-[11px] font-bold flex items-center justify-center z-20 shadow-[0_6px_14px_rgba(0,0,0,0.45)]">
                    {num}
                  </span>
                </div>
                <div>
                  <p className="text-white font-semibold text-lg mb-2">{title}</p>
                  <p className="text-white/45 text-sm leading-relaxed max-w-[240px] mx-auto">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
