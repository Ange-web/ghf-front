"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Users, Calendar, Image as ImageIcon, Trophy, Ticket,
  Plus, Edit, Trash2, Check, X, Loader2, BarChart3, Settings,
  LogOut, Bell, Search, LayoutDashboard, ChevronRight, Menu,
  Upload, Link, RefreshCw, Eye, EyeOff, MessageCircle,
  Star, AlertCircle, CheckCircle2, KeyRound
} from 'lucide-react';

// SVG Instagram inline (non disponible dans cette version de lucide-react)
function InstagramIcon({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/Logo';

// --- Dashboard Palette ---
// Background: #0a0a0a
// Cards: #111111
// Primary: #ff6b4a
// Accent: #ff8a6d
// Gold: #d6b37c

// ──────────────────────────────────────────────────────────────
// Instagram Curation Panel — composant autonome dans le dashboard
// ──────────────────────────────────────────────────────────────
function InstagramCurationPanel() {
  const [inbox, setInbox] = useState([]);
  const [approved, setApproved] = useState([]);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editRating, setEditRating] = useState(5);
  const [editRole, setEditRole] = useState('');
  const [shortToken, setShortToken] = useState('');
  const [pageId, setPageId] = useState('');
  const [savingToken, setSavingToken] = useState(false);
  const [showTokenForm, setShowTokenForm] = useState(false);

  // Saisie manuelle
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualUsername, setManualUsername] = useState('');
  const [manualContent, setManualContent] = useState('');
  const [manualRating, setManualRating] = useState(5);
  const [manualRole, setManualRole] = useState('');
  const [manualPublish, setManualPublish] = useState(true);
  const [savingManual, setSavingManual] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [inboxRes, approvedRes, statusRes] = await Promise.all([
        api.get('/api/instagram/inbox'),
        api.get('/api/instagram/approved'),
        api.get('/api/instagram/status'),
      ]);
      setInbox(inboxRes.data);
      setApproved(approvedRes.data);
      setStatus(statusRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const { data } = await api.get('/api/instagram/sync');
      toast.success(`${data.imported} nouveau(x) message(s) importé(s)`);
      fetchAll();
    } catch (e) {
      toast.error(e.response?.data?.error || 'Erreur de synchronisation');
    } finally {
      setSyncing(false);
    }
  };

  const startEdit = (msg) => {
    setEditingId(msg.id);
    setEditContent(msg.content);
    setEditRating(msg.rating || 5);
    setEditRole(msg.authorRole || '');
  };

  const handleApprove = async (id) => {
    try {
      await api.post(`/api/instagram/approve/${id}`, {
        content: editContent,
        rating: editRating,
        authorRole: editRole,
      });
      toast.success('Avis approuvé et publié !');
      setEditingId(null);
      fetchAll();
    } catch (e) {
      toast.error('Erreur lors de l\'approbation');
    }
  };

  const handleReject = async (id) => {
    if (!confirm('Supprimer ce message définitivement ?')) return;
    try {
      await api.post(`/api/instagram/reject/${id}`);
      toast.success('Message supprimé');
      fetchAll();
    } catch (e) {
      toast.error('Erreur');
    }
  };

  const handleUnpublish = async (id) => {
    try {
      await api.delete(`/api/instagram/unpublish/${id}`);
      toast.success('Avis retiré de la publication');
      fetchAll();
    } catch (e) {
      toast.error('Erreur');
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setSavingManual(true);
    try {
      await api.post('/api/instagram/manual', {
        instagramUsername: manualUsername.replace(/^@/, ''),
        content: manualContent,
        rating: manualRating,
        authorRole: manualRole || 'Client Instagram',
        publishNow: manualPublish,
      });
      toast.success(manualPublish ? 'Avis ajouté et publié !' : 'Avis ajouté dans l\'inbox');
      setManualUsername('');
      setManualContent('');
      setManualRating(5);
      setManualRole('');
      setShowManualForm(false);
      fetchAll();
    } catch (e) {
      toast.error(e.response?.data?.error || 'Erreur lors de l\'ajout');
    } finally {
      setSavingManual(false);
    }
  };

  const handleSaveToken = async (e) => {
    e.preventDefault();
    setSavingToken(true);
    try {
      const { data } = await api.post('/api/instagram/token', {
        shortLivedToken: shortToken,
        pageId: pageId || undefined,
      });
      toast.success(`Token configuré ! Expire le ${new Date(data.expiresAt).toLocaleDateString('fr-FR')}`);
      setShortToken('');
      setShowTokenForm(false);
      fetchAll();
    } catch (e) {
      toast.error(e.response?.data?.error || 'Erreur de configuration du token');
    } finally {
      setSavingToken(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="animate-spin text-[#ff6b4a]" size={32} />
    </div>
  );

  const daysLeft = status?.daysLeft;
  const tokenColor = daysLeft > 15 ? 'text-emerald-400' : daysLeft > 5 ? 'text-orange-400' : 'text-red-400';

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-[#833ab4]/10 via-[#fd1d1d]/10 to-[#fcb045]/10 border border-white/10 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] flex items-center justify-center">
            <InstagramIcon size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold">Curation des Avis Instagram</h2>
            <p className="text-white/40 text-xs">
              {status?.configured
                ? <span className={tokenColor}>Token actif — expire dans {daysLeft} jours</span>
                : <span className="text-red-400">Aucun token configuré</span>
              }
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => { setShowManualForm(v => !v); setShowTokenForm(false); }}
            className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-bold transition-colors"
          >
            <Plus size={14} />
            Ajouter manuellement
          </button>
          <button
            onClick={() => { setShowTokenForm(v => !v); setShowManualForm(false); }}
            className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/70 text-xs transition-colors"
          >
            <KeyRound size={14} />
            {status?.configured ? 'Renouveler token' : 'Configurer token'}
          </button>
          <button
            onClick={handleSync}
            disabled={syncing || !status?.configured}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#833ab4] to-[#fd1d1d] hover:opacity-90 rounded-xl text-white text-xs font-bold transition-opacity disabled:opacity-40"
          >
            <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
            Synchroniser les DMs
          </button>
        </div>
      </div>

      {/* Formulaire de saisie manuelle */}
      {showManualForm && (
        <div className="p-5 bg-[#111] border border-emerald-500/20 rounded-2xl">
          <h3 className="text-white font-bold mb-1 flex items-center gap-2">
            <Plus size={16} className="text-emerald-400" />
            Ajouter un avis manuellement
          </h3>
          <p className="text-white/40 text-xs mb-4 leading-relaxed">
            Lis le DM sur ton Instagram, puis retranscris-le ici. L'avis sera affiché avec le badge "Vérifié Instagram".
          </p>
          <form onSubmit={handleManualSubmit} className="flex flex-col gap-3">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-white/40 text-xs uppercase tracking-wider block mb-1">Compte Instagram</label>
                <input
                  type="text"
                  value={manualUsername}
                  onChange={e => setManualUsername(e.target.value)}
                  placeholder="maelle_mnl93"
                  className="w-full bg-[#1a1a1a] border border-[#333] focus:border-emerald-500 text-white px-4 py-3 rounded-xl outline-none transition-colors text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-white/40 text-xs uppercase tracking-wider block mb-1">Note</label>
                <select
                  value={manualRating}
                  onChange={e => setManualRating(Number(e.target.value))}
                  className="bg-[#1a1a1a] border border-[#333] text-white px-3 py-3 rounded-xl outline-none text-sm h-[46px]"
                >
                  {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} ⭐</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-white/40 text-xs uppercase tracking-wider block mb-1">Contenu du DM</label>
              <textarea
                value={manualContent}
                onChange={e => setManualContent(e.target.value)}
                rows={4}
                placeholder="Copie ici le message envoyé par la personne dans ses DMs..."
                className="w-full bg-[#1a1a1a] border border-[#333] focus:border-emerald-500 text-white px-4 py-3 rounded-xl outline-none transition-colors text-sm resize-none"
                required
              />
            </div>

            <div>
              <label className="text-white/40 text-xs uppercase tracking-wider block mb-1">Rôle affiché (optionnel)</label>
              <input
                type="text"
                value={manualRole}
                onChange={e => setManualRole(e.target.value)}
                placeholder="Cliente VIP, Habituée, ..."
                className="w-full bg-[#1a1a1a] border border-[#333] focus:border-emerald-500 text-white px-4 py-3 rounded-xl outline-none transition-colors text-sm"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => setManualPublish(v => !v)}
                className={`w-10 h-5 rounded-full transition-colors relative ${manualPublish ? 'bg-emerald-500' : 'bg-white/10'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${manualPublish ? 'left-5' : 'left-0.5'}`} />
              </div>
              <span className="text-white/60 text-xs">
                {manualPublish ? 'Publier immédiatement sur le site' : 'Mettre dans l\'inbox pour révision'}
              </span>
            </label>

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={savingManual}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-xl font-bold text-sm disabled:opacity-50 transition-colors"
              >
                {savingManual ? <><Loader2 size={16} className="animate-spin" />Ajout...</> : <><Check size={16} />{manualPublish ? 'Ajouter & Publier' : 'Ajouter dans l\'inbox'}</>}
              </button>
              <button
                type="button"
                onClick={() => setShowManualForm(false)}
                className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white/50 rounded-xl text-sm transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Token config form */}
      {showTokenForm && (
        <div className="p-5 bg-[#111] border border-[#333] rounded-2xl">
          <h3 className="text-white font-bold mb-1 flex items-center gap-2">
            <KeyRound size={16} className="text-[#fcb045]" />
            Configuration du Token Meta
          </h3>
          <p className="text-white/40 text-xs mb-4 leading-relaxed">
            1. Va sur <span className="text-[#fcb045]">developers.facebook.com → Explorateur d'API Graph</span><br/>
            2. Génère un token avec les permissions : <code className="bg-white/10 px-1 rounded">instagram_manage_messages</code>, <code className="bg-white/10 px-1 rounded">instagram_basic</code><br/>
            3. Colle-le ci-dessous. Il sera échangé automatiquement en Long-lived Token (60 jours).
          </p>
          <form onSubmit={handleSaveToken} className="flex flex-col gap-3">
            <input
              type="text"
              value={shortToken}
              onChange={e => setShortToken(e.target.value)}
              placeholder="Short-lived Access Token (depuis l'API Graph Explorer)"
              className="w-full bg-[#1a1a1a] border border-[#333] focus:border-[#fd1d1d] text-white px-4 py-3 rounded-xl outline-none transition-colors text-sm"
              required
            />
            <input
              type="text"
              value={pageId}
              onChange={e => setPageId(e.target.value)}
              placeholder="Facebook Page ID (optionnel si défini dans .env)"
              className="w-full bg-[#1a1a1a] border border-[#333] focus:border-[#fd1d1d] text-white px-4 py-3 rounded-xl outline-none transition-colors text-sm"
            />
            <button
              type="submit"
              disabled={savingToken}
              className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#833ab4] to-[#fd1d1d] rounded-xl text-white font-bold text-sm disabled:opacity-50"
            >
              {savingToken ? <><Loader2 size={16} className="animate-spin" />Échange en cours...</> : 'Configurer le token'}
            </button>
          </form>
        </div>
      )}

      {/* Two-panel layout */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* LEFT — Flux Entrant */}
        <div className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-[#222]">
            <div className="flex items-center gap-2">
              <MessageCircle size={16} className="text-[#fd1d1d]" />
              <span className="text-white font-bold text-sm">Flux Entrant</span>
              {inbox.length > 0 && (
                <span className="px-2 py-0.5 bg-[#fd1d1d]/20 text-[#fd1d1d] text-xs rounded-full font-bold">{inbox.length}</span>
              )}
            </div>
            <span className="text-white/30 text-xs">DMs non traités</span>
          </div>

          <div className="divide-y divide-[#1a1a1a] max-h-[600px] overflow-y-auto">
            {inbox.length === 0 ? (
              <div className="py-16 text-center text-white/30 text-sm">
                <CheckCircle2 size={32} className="mx-auto mb-3 text-white/10" />
                Aucun message en attente
              </div>
            ) : inbox.map(msg => (
              <div key={msg.id} className="p-5">
                {/* Author */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#833ab4] to-[#fcb045] flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {msg.instagramUsername?.charAt(0).toUpperCase() || 'I'}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">@{msg.instagramUsername || msg.authorName}</p>
                    <p className="text-white/30 text-xs">{new Date(msg.createdAt).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>

                {/* Édition ou affichage */}
                {editingId === msg.id ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-white/40 text-xs uppercase tracking-wider">Contenu original</label>
                      <p className="text-white/40 text-xs italic mt-1 line-through">{msg.originalContent}</p>
                    </div>
                    <textarea
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      rows={3}
                      className="w-full bg-[#1a1a1a] border border-[#333] focus:border-[#833ab4] text-white px-3 py-2 rounded-xl outline-none text-sm resize-none"
                    />
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="text-white/40 text-xs">Rôle affiché</label>
                        <input
                          value={editRole}
                          onChange={e => setEditRole(e.target.value)}
                          placeholder="Client VIP, Habitué..."
                          className="w-full bg-[#1a1a1a] border border-[#333] focus:border-[#833ab4] text-white px-3 py-2 rounded-xl outline-none text-sm mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-white/40 text-xs">Note</label>
                        <select
                          value={editRating}
                          onChange={e => setEditRating(Number(e.target.value))}
                          className="bg-[#1a1a1a] border border-[#333] text-white px-3 py-2 rounded-xl outline-none text-sm mt-1 w-full"
                        >
                          {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} ⭐</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(msg.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/20 rounded-xl text-sm font-bold transition-colors"
                      >
                        <Check size={15} /> Approuver &amp; Publier
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white/50 rounded-xl text-sm transition-colors"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-4">"{msg.content}"</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(msg)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#833ab4]/10 hover:bg-[#833ab4]/20 text-[#c084fc] border border-[#833ab4]/20 rounded-xl text-xs font-bold transition-colors"
                      >
                        <Edit size={13} /> Éditer &amp; Approuver
                      </button>
                      <button
                        onClick={() => handleApprove(msg.id)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs transition-colors"
                        title="Approuver sans modifier"
                      >
                        <Check size={13} />
                      </button>
                      <button
                        onClick={() => handleReject(msg.id)}
                        className="flex items-center justify-center px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs transition-colors"
                        title="Rejeter"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Avis en ligne */}
        <div className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-[#222]">
            <div className="flex items-center gap-2">
              <Eye size={16} className="text-emerald-400" />
              <span className="text-white font-bold text-sm">Avis en ligne</span>
              {approved.length > 0 && (
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full font-bold">{approved.length}</span>
              )}
            </div>
            <span className="text-white/30 text-xs">Publiés sur le site</span>
          </div>

          <div className="divide-y divide-[#1a1a1a] max-h-[600px] overflow-y-auto">
            {approved.length === 0 ? (
              <div className="py-16 text-center text-white/30 text-sm">
                <InstagramIcon size={32} className="mx-auto mb-3 text-white/10" />
                Aucun avis publié
              </div>
            ) : approved.map(msg => (
              <div key={msg.id} className="p-5 flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#833ab4] to-[#fcb045] flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
                  {msg.instagramUsername?.charAt(0).toUpperCase() || 'I'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-white text-sm font-semibold truncate">@{msg.instagramUsername || msg.authorName}</p>
                    <div className="flex text-[#d6b37c] shrink-0">
                      {[...Array(msg.rating || 5)].map((_, i) => <Star key={i} size={10} className="fill-current" />)}
                    </div>
                  </div>
                  {msg.authorRole && <p className="text-white/30 text-xs mb-1">{msg.authorRole}</p>}
                  <p className="text-white/60 text-xs leading-relaxed line-clamp-2">"{msg.content}"</p>
                </div>
                <button
                  onClick={() => handleUnpublish(msg.id)}
                  className="shrink-0 p-2 bg-white/5 hover:bg-red-500/10 text-white/30 hover:text-red-400 rounded-lg transition-colors"
                  title="Retirer de la publication"
                >
                  <EyeOff size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading, isAdmin, logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Forms & Modals
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});

  // Gallery upload mode
  const [galleryUploadMode, setGalleryUploadMode] = useState('file'); // 'file' | 'url'
  const [galleryFile, setGalleryFile] = useState(null);
  const [galleryFilePreview, setGalleryFilePreview] = useState(null);
  const galleryFileInputRef = useRef(null);

  // Event upload mode
  const [eventUploadMode, setEventUploadMode] = useState('url'); // 'file' | 'url'
  const [eventFile, setEventFile] = useState(null);
  const [eventFilePreview, setEventFilePreview] = useState(null);
  const eventFileInputRef = useRef(null);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      router.push('/');
    }
  }, [authLoading, isAuthenticated, isAdmin, router]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [activeTab, isAdmin]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let endpoint = '';
      switch (activeTab) {
        case 'dashboard': endpoint = '/api/admin/stats'; break;
        case 'events': endpoint = '/api/events'; break;
        case 'reservations': endpoint = '/api/reservations'; break;
        case 'gallery': endpoint = '/api/admin/gallery'; break;
        case 'contests': endpoint = '/api/contests'; break;
        case 'users': endpoint = '/api/admin/users'; break;
        default: break;
      }
      
      if (!endpoint) {
          setLoading(false);
          return;
      }

      const { data: result } = await api.get(endpoint);
      
      if (activeTab === 'dashboard') {
        setStats(result);
        // Au cas où stats ne retourne pas de mock, on garde notre graphique en statique pour le visuel VIP
      } else {
        setData(Array.isArray(result) ? result : Array.isArray(result?.data) ? result.data : []);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGalleryFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Seules les images sont acceptées');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Le fichier ne doit pas dépasser 10 MB');
        return;
      }
      setGalleryFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setGalleryFilePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleEventFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Seules les images sont acceptées');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Le fichier ne doit pas dépasser 10 MB');
        return;
      }
      setEventFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setEventFilePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let endpoint = '';
      let payload = { ...formData };

      // --- GALLERY: dual mode (file upload or URL) ---
      if (activeTab === 'gallery' && !editingItem) {
        if (galleryUploadMode === 'file') {
          if (!galleryFile) {
            toast.error('Veuillez sélectionner un fichier image');
            setSaving(false);
            return;
          }
          const fd = new FormData();
          fd.append('image', galleryFile);
          if (formData.title) fd.append('caption', formData.title);
          if (formData.event_id) fd.append('eventId', formData.event_id);
          await api.post('/api/gallery/upload', fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        } else {
          // URL mode
          await api.post('/api/gallery', {
            url: formData.url,
            caption: formData.title || null,
            eventId: formData.event_id || null,
          });
        }
        toast.success('Image ajoutée avec succès !');
        setShowForm(false);
        setGalleryFile(null);
        setGalleryFilePreview(null);
        fetchData();
        setSaving(false);
        return;
      }

      switch (activeTab) {
        case 'events': 
          endpoint = '/api/events';

          let finalImageUrl = payload.image_url || payload.imageUrl;
          if (eventUploadMode === 'file' && eventFile) {
            const uploadFd = new FormData();
            uploadFd.append('image', eventFile);
            const { data } = await api.post('/api/upload', uploadFd, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });
            finalImageUrl = data.url;
          } else if (eventUploadMode === 'file' && !eventFile && !editingItem) {
            toast.error('Veuillez sélectionner une image pour l\'événement');
            setSaving(false);
            return;
          }

          payload = {
            ...payload,
            venue: payload.location || 'GHF Club, Paris',
            description: payload.description || 'Rejoignez-nous pour cette soirée inoubliable avec GHF !',
            image_url: finalImageUrl,
            date: new Date(payload.date).toISOString(),
            price: parseFloat(payload.price || 0),
            capacity: parseInt(payload.capacity || 100),
            table_promo_price: parseFloat(payload.table_promo_price || 0),
            table_promo_capacity: parseInt(payload.table_promo_capacity || 0),
            table_vip_price: parseFloat(payload.table_vip_price || 0),
            table_vip_capacity: parseInt(payload.table_vip_capacity || 0)
          };
          delete payload.location;
          break;
        case 'gallery': 
          endpoint = '/api/gallery'; 
          break;
        case 'contests': 
          endpoint = '/api/contests'; 
          if(payload.end_date) payload.end_date = new Date(payload.end_date).toISOString();
          break;
        default: return;
      }
      
      if (editingItem) {
        await api.put(`${endpoint}/${editingItem.id}`, payload);
        toast.success("Élément modifié avec succès !");
      } else {
        await api.post(endpoint, payload);
        toast.success("Création réussie !");
      }
      
      setShowForm(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || error.response?.data?.error || "Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handleChangeRole = async (id, newRole) => {
    try {
      if (!window.confirm(`Voulez-vous donner le rôle ${newRole} à cet utilisateur ?`)) return;
      await api.patch(`/api/admin/users/${id}/role`, { role: newRole });
      toast.success("Rôle modifié avec succès !");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || "Erreur lors de la modification du rôle");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet élément ?')) return;
    try {
      let endpoint = '';
      switch (activeTab) {
        case 'events': endpoint = `/api/events/${id}`; break;
        case 'gallery': endpoint = `/api/gallery/${id}`; break;
        case 'contests': endpoint = `/api/contests/${id}`; break;
        case 'users': endpoint = `/api/admin/users/${id}`; break;
        default: return;
      }
      
      await api.delete(endpoint);
      toast.success("Supprimé.");
      fetchData();
    } catch (error) {
      toast.error("Échec de la suppression.");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      let endpoint = '';
      if (activeTab === 'reservations') endpoint = `/api/admin/reservations/${id}`;
      else if (activeTab === 'gallery') endpoint = `/api/admin/gallery/${id}/status`;
      else return;

      await api.patch(endpoint, { status });
      toast.success("Statut mis à jour.");
      fetchData();
    } catch (error) {
      toast.error("Erreur de statut.");
    }
  };

  const openForm = (item = null) => {
    setEditingItem(item);
    if (item) {
        setFormData(item);
    } else {
        setFormData({ 
            capacity: 100, price: 0, 
            has_table_promo: false, table_promo_price: 150, table_promo_capacity: 10,
            has_table_vip: false, table_vip_price: 300, table_vip_capacity: 5
        });
    }
    // Reset gallery upload state
    setGalleryFile(null);
    setGalleryFilePreview(null);
    setGalleryUploadMode('file');

    // Reset event upload state
    setEventFile(null);
    setEventFilePreview(null);
    setEventUploadMode(item && (item.image_url || item.imageUrl) ? 'url' : 'file');
    
    setShowForm(true);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#ff6b4a]" size={48} />
      </div>
    );
  }

  if (!isAdmin) return null;

  const sidebarLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'reservations', label: 'Réservations', icon: Ticket },
    { id: 'gallery', label: 'V.I.P Gallery', icon: ImageIcon },
    { id: 'users', label: 'Membres', icon: Users },
    { id: 'contests', label: 'Concours', icon: Trophy },
    { id: 'instagram', label: 'Avis Instagram', icon: InstagramIcon },
  ];

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden selection:bg-[#ff6b4a] selection:text-white">
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden" 
          onClick={() => setMobileMenuOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside className={`flex-shrink-0 bg-[#0a0a0a] border-r border-[#1a1a1a] flex-col justify-between z-50 transition-all duration-300 md:flex ${mobileMenuOpen ? 'fixed inset-y-0 left-0 w-64 flex' : 'hidden md:relative md:w-64'}`}>
        <div>
          <div className="h-20 flex items-center px-8 border-b border-[#1a1a1a]">
            <Logo />
          </div>
          <nav className="p-4 space-y-2 mt-4">
            {sidebarLinks.map(link => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => { setActiveTab(link.id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive 
                    ? 'bg-[#ff6b4a]/10 text-[#ff6b4a] shadow-[0_0_15px_rgba(255,107,74,0.15)]' 
                    : 'text-white/50 hover:bg-[#111] hover:text-white'
                  }`}
                >
                  <Icon size={20} className={isActive ? 'text-[#ff6b4a]' : ''} />
                  <span className="font-medium">{link.label}</span>
                  {isActive && <ChevronRight size={16} className="ml-auto opacity-50" />}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-[#1a1a1a]">
          <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-white/50 hover:bg-red-500/10 hover:text-red-500 transition-colors">
            <LogOut size={20} />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Topbar */}
        <header className="h-20 flex items-center justify-between px-4 md:px-8 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-[#1a1a1a] z-10 w-full">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-2 -ml-2 text-white/70 hover:text-[#ff6b4a] transition-colors rounded-lg">
              <Menu size={24} />
            </button>
            <div className="flex items-center bg-[#111] border border-[#222] rounded-full px-4 py-2 w-full max-w-xs md:w-96 focus-within:border-[#ff6b4a]/50 transition-colors hidden sm:flex">
              <Search size={18} className="text-white/30 mr-3" />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-white/30"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <button className="relative p-2 text-white/60 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#ff6b4a] rounded-full shadow-[0_0_8px_#ff6b4a]"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-[#222]">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white">{user?.name || "Admin"}</p>
                <p className="text-xs text-[#d6b37c] font-medium tracking-widest uppercase">VIP Manager</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#ff6b4a] to-[#d6b37c] p-[2px]">
                <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'A'}&background=0a0a0a&color=fff`} className="w-full h-full rounded-full border-2 border-[#0a0a0a] object-cover" alt="Admin" />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Main */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
           
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]/50 backdrop-blur-sm z-50">
                <Loader2 className="animate-spin text-[#ff6b4a]" size={32} />
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              
              {/* === DASHBOARD OVERVIEW === */}
              {activeTab === 'dashboard' && (
                  <div className="space-y-8">
                      {/* STATS CARDS */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="p-6 bg-[#111] rounded-2xl border border-[#222] relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff6b4a]/10 rounded-full blur-3xl group-hover:bg-[#ff6b4a]/20 transition-all"></div>
                           <p className="text-white/40 text-sm font-medium mb-1 relative">Événements Actifs</p>
                           <h3 className="text-3xl font-bold text-white relative">{stats?.events ?? '—'}</h3>
                        </div>
                        <div className="p-6 bg-[#111] rounded-2xl border border-[#222] relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-[#d6b37c]/10 rounded-full blur-3xl group-hover:bg-[#d6b37c]/20 transition-all"></div>
                           <p className="text-white/40 text-sm font-medium mb-1 relative">Réservations VIP</p>
                           <h3 className="text-3xl font-bold text-white relative">{stats?.reservations ?? '—'}</h3>
                        </div>
                        <div className="p-6 bg-[#111] rounded-2xl border border-[#222] relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff8a6d]/10 rounded-full blur-3xl group-hover:bg-[#ff8a6d]/20 transition-all"></div>
                           <p className="text-white/40 text-sm font-medium mb-1 relative">Revenus Mensuels</p>
                           <h3 className="text-3xl font-bold text-[#ff6b4a] relative">{stats?.revenue != null ? stats.revenue.toLocaleString('fr-FR') : '—'}€</h3>
                        </div>
                        <div className="p-6 bg-[#111] rounded-2xl border border-[#222] relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all"></div>
                           <p className="text-white/40 text-sm font-medium mb-1 relative">Membres VIP</p>
                           <h3 className="text-3xl font-bold text-white relative">{stats?.users ?? '—'}</h3>
                        </div>
                      </div>

                      {/* CHARTS */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          <div className="lg:col-span-2 p-6 bg-[#111] rounded-2xl border border-[#222]">
                              <div className="flex justify-between items-center mb-6">
                                  <h3 className="font-bold text-lg">Performance des Revenus</h3>
                                  <select className="bg-[#1a1a1a] border border-[#333] text-sm text-white/70 rounded-lg px-3 py-1 outline-none">
                                      <option>7 derniers jours</option>
                                      <option>30 derniers jours</option>
                                  </select>
                              </div>
                              <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height={288} minWidth={0} minHeight={0}>
                                  <AreaChart data={stats?.revenueSeries || []} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                      <linearGradient id="colorRevenus" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ff6b4a" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#ff6b4a" stopOpacity={0}/>
                                      </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                    <XAxis dataKey="name" stroke="#555" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} dy={10} />
                                    <YAxis stroke="#555" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#888'}} />
                                    <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px' }} itemStyle={{ color: '#ff6b4a' }}/>
                                    <Area type="monotone" dataKey="revenus" stroke="#ff6b4a" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenus)" />
                                  </AreaChart>
                                </ResponsiveContainer>
                              </div>
                          </div>
                          <div className="p-6 bg-[#111] rounded-2xl border border-[#222]">
                             <h3 className="font-bold text-lg mb-6">Activité Récente</h3>
                             <div className="space-y-5">
                                {(stats?.recentReservations || []).length === 0 && (
                                  <p className="text-sm text-white/30 text-center py-4">Aucune réservation récente</p>
                                )}
                                {(stats?.recentReservations || []).map((r) => (
                                    <div key={r.id} className="flex gap-4 items-center">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#d6b37c]/10 text-[#d6b37c] flex-shrink-0">
                                            <Ticket size={18} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-white/90 truncate">
                                              {r.user?.name || r.user?.email || 'Client'} — {r.event?.title || 'Événement'}
                                            </p>
                                            <p className="text-xs text-white/40">
                                              {new Date(r.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                              {r.status ? ` · ${r.status?.toUpperCase() ?? '—'}` : ''}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                             </div>
                             <button onClick={() => setActiveTab('reservations')} className="w-full mt-6 py-2 text-sm text-[#ff6b4a] font-medium border border-[#ff6b4a]/20 rounded-lg hover:bg-[#ff6b4a]/10 transition-colors">
                                 Voir toutes les réservations
                             </button>
                          </div>
                      </div>
                  </div>
              )}

              {/* === LIST MANAGER HEADING (EVENTS, GALLERY, ETC) === */}
              {activeTab !== 'dashboard' && (
                  <div className="flex justify-between items-center mb-6">
                      <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
                            Gestion des {sidebarLinks.find(l => l.id === activeTab)?.label}
                        </h2>
                        <p className="text-white/40 mt-1">Gérez et organisez votre contenu VIP.</p>
                      </div>
                      
                      {['events', 'gallery', 'contests'].includes(activeTab) && (
                          <button 
                            onClick={() => openForm(null)}
                            className="bg-[#ff6b4a] text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(255,107,74,0.3)] hover:shadow-[0_0_30px_rgba(255,107,74,0.5)] transition-all hover:-translate-y-0.5"
                          >
                             <Plus size={18} /> Créer
                          </button>
                      )}
                  </div>
              )}

              {/* === EVENTS LIST === */}
              {activeTab === 'events' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                     {data.map(event => (
                         <div key={event.id} className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden hover:border-[#ff6b4a]/50 transition-colors group">
                            <div className="h-48 relative">
                                <img src={event.image_url || 'https://images.pexels.com/photos/11481894/pexels-photo-11481894.jpeg'} alt={event.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent"></div>
                                <div className="absolute top-4 right-4 flex gap-2">
                                  <button onClick={() => openForm(event)} className="p-2 bg-black/50 backdrop-blur-md rounded-lg text-white hover:text-[#ff6b4a] transition"><Edit size={16}/></button>
                                  <button onClick={() => handleDelete(event.id)} className="p-2 bg-black/50 backdrop-blur-md rounded-lg text-white hover:text-red-500 transition"><Trash2 size={16}/></button>
                                </div>
                                <div className="absolute bottom-4 left-4">
                                     <span className="bg-[#ff6b4a]/20 text-[#ff6b4a] px-3 py-1 rounded-full text-xs font-bold border border-[#ff6b4a]/50 uppercase tracking-wide backdrop-blur-md">
                                         {new Date(event.date).toLocaleDateString('fr-FR')}
                                     </span>
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="text-xl font-bold mb-1 truncate">{event.title}</h3>
                                <p className="text-white/50 text-sm mb-4 truncate">{event.location}</p>
                                
                                <div className="flex justify-between items-center pt-4 border-t border-[#222]">
                                    <div className="text-xl font-black text-[#d6b37c]">{event.price}€</div>
                                    <div className="flex gap-2">
                                        {event.has_table_promo && <span className="w-8 h-8 rounded bg-[#222] flex items-center justify-center text-white/50 text-xs" title="Tables Ambassadeur Actives"><Ticket size={14}/></span>}
                                        {event.has_table_vip && <span className="w-8 h-8 rounded bg-[#d6b37c]/10 text-[#d6b37c] flex items-center justify-center text-xs border border-[#d6b37c]/20" title="VIP Tables Actives"><Trophy size={14}/></span>}
                                    </div>
                                </div>
                            </div>
                         </div>
                     ))}
                  </div>
              )}

              {/* === RESERVATIONS LIST === */}
              {activeTab === 'reservations' && (
                  <div className="bg-[#111] rounded-2xl border border-[#222] overflow-hidden">
                      <table className="w-full text-left border-collapse">
                          <thead>
                              <tr className="bg-[#1a1a1a] text-white/50 text-sm">
                                  <th className="p-4 font-medium">Événement</th>
                                  <th className="p-4 font-medium">Client</th>
                                  <th className="p-4 font-medium">Invités</th>
                                  <th className="p-4 font-medium">Statut</th>
                                  <th className="p-4 font-medium text-right">Actions</th>
                              </tr>
                          </thead>
                          <tbody>
                              {data.map(r => (
                                  <tr key={r.id} className="border-t border-[#222] hover:bg-[#1a1a1a]/50 transition-colors">
                                      <td className="p-4 font-bold">{r.event_title}</td>
                                      <td className="p-4 text-white/80">{r.user_name} <br/><span className="text-xs text-white/40">{r.phone}</span></td>
                                      <td className="p-4">{r.guests} pers.</td>
                                      <td className="p-4">
                                         <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                                             r.status === 'confirmed' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                             r.status === 'pending' ? 'bg-[#d6b37c]/10 text-[#d6b37c] border border-[#d6b37c]/20' :
                                             'bg-red-500/10 text-red-500 border border-red-500/20'
                                         }`}>
                                             {r.status?.toUpperCase() ?? '—'}
                                         </span>
                                      </td>
                                      <td className="p-4 text-right">
                                         {r.status === 'pending' && (
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleStatusChange(r.id, 'confirmed')} className="p-2 text-green-500 hover:bg-green-500/20 rounded-lg transition"><Check size={16}/></button>
                                                <button onClick={() => handleStatusChange(r.id, 'cancelled')} className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition"><X size={16}/></button>
                                            </div>
                                         )}
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              )}

              {/* === USERS LIST === */}
              {activeTab === 'users' && (
                  <div className="bg-[#111] rounded-2xl border border-[#222] overflow-hidden shadow-xl">
                      <table className="w-full text-left border-collapse">
                          <thead>
                              <tr className="bg-[#1a1a1a] text-white/50 text-sm uppercase tracking-wider">
                                  <th className="p-5 font-bold">Membre</th>
                                  <th className="p-5 font-bold">Email</th>
                                  <th className="p-5 font-bold text-center">Rôle</th>
                                  <th className="p-5 font-bold text-right">Actions</th>
                              </tr>
                          </thead>
                          <tbody>
                              {data.map(u => (
                                  <tr key={u.id} className="border-t border-[#222] hover:bg-[#ff6b4a]/5 transition-colors group">
                                      <td className="p-5">
                                          <div className="flex items-center gap-4">
                                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff6b4a]/20 to-[#d6b37c]/20 flex items-center justify-center text-[#ff6b4a] text-sm font-black border border-white/5 group-hover:border-[#ff6b4a]/30 transition-colors">
                                                  {u.name?.charAt(0).toUpperCase()}
                                              </div>
                                              <span className="font-bold text-white/90">{u.name}</span>
                                          </div>
                                      </td>
                                      <td className="p-5 text-white/50 text-sm">{u.email}</td>
                                      <td className="p-5 text-center">
                                          <select
                                              value={u.role || 'USER'}
                                              onChange={(e) => handleChangeRole(u.id, e.target.value)}
                                              className={`text-[10px] px-3 py-1 rounded-full font-black tracking-widest outline-none cursor-pointer text-center ${u.role?.toLowerCase() === 'admin' ? 'bg-[#d6b37c]/20 text-[#d6b37c] border border-[#d6b37c]/30' : 'bg-[#1a1a1a] text-white/60 border border-white/10 hover:border-white/30 transition-colors'}`}
                                          >
                                              <option value="USER" className="bg-[#1a1a1a] text-white text-sm">USER</option>
                                              <option value="ADMIN" className="bg-[#1a1a1a] text-white text-sm">ADMIN</option>
                                          </select>
                                      </td>
                                      <td className="p-5 text-right">
                                          <div className="flex justify-end gap-2">
                                              <button onClick={() => handleDelete(u.id)} className="p-2 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all" title="Bannir / Supprimer">
                                                  <Trash2 size={16} />
                                              </button>
                                          </div>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              )}

              {/* === GALLERY GRID === */}
              {activeTab === 'gallery' && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                      {data.map(photo => (
                          <div key={photo.id} className="aspect-[4/5] bg-[#111] border border-[#222] rounded-2xl overflow-hidden relative group hover:border-[#ff6b4a]/50 transition-all hover:-translate-y-1 shadow-lg">
                              <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-between p-4">
                                  <div className="flex justify-end gap-2">
                                      {photo.status === 'pending' && (
                                          <button 
                                            onClick={() => handleStatusChange(photo.id, 'approved')} 
                                            className="p-2 bg-green-500 rounded-xl text-white shadow-lg hover:scale-110 transition-transform"
                                          >
                                              <Check size={16}/>
                                          </button>
                                      )}
                                      <button 
                                        onClick={() => handleDelete(photo.id)} 
                                        className="p-2 bg-red-500 rounded-xl text-white shadow-lg hover:scale-110 transition-transform"
                                      >
                                          <Trash2 size={16}/>
                                      </button>
                                  </div>
                                  <div className="backdrop-blur-md bg-black/40 p-3 rounded-xl border border-white/10">
                                      <p className="text-white font-bold text-sm truncate">{photo.title || 'Action VIP'}</p>
                                      <p className="text-white/50 text-[10px] uppercase font-bold tracking-widest mt-1">Par {photo.user_name || 'Membre'}</p>
                                  </div>
                              </div>
                              {photo.status === 'pending' && (
                                  <div className="absolute top-3 left-3 bg-[#ff6b4a] text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg animate-pulse">En attente</div>
                              )}
                          </div>
                      ))}
                  </div>
              )}

              {/* === CONTESTS LIST === */}
              {activeTab === 'contests' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {data.map(contest => (
                          <div key={contest.id} className="bg-[#111] border border-[#222] rounded-3xl p-8 relative overflow-hidden group hover:border-[#d6b37c]/50 transition-all shadow-xl">
                               <div className="absolute top-0 right-0 w-32 h-32 bg-[#d6b37c]/5 rounded-full blur-3xl group-hover:bg-[#d6b37c]/10 transition-all"></div>
                               
                               <div className="flex justify-between items-start mb-6">
                                   <div>
                                       <h3 className="text-2xl font-black text-white">{contest.title}</h3>
                                       <div className="flex items-center gap-2 mt-2">
                                           <Users size={14} className="text-white/30" />
                                           <p className="text-white/40 text-xs font-bold uppercase tracking-widest">{contest.participants_count || 0} participants</p>
                                       </div>
                                   </div>
                                   <div className="flex gap-2 relative z-10">
                                       <button onClick={() => openForm(contest)} className="p-3 bg-[#1a1a1a] text-white/30 hover:text-[#ff6b4a] hover:bg-[#ff6b4a]/10 rounded-xl transition-all"><Edit size={18}/></button>
                                       <button onClick={() => handleDelete(contest.id)} className="p-3 bg-[#1a1a1a] text-white/30 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"><Trash2 size={18}/></button>
                                   </div>
                               </div>
                               <div className="space-y-4 bg-black/20 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                                   <div className="flex justify-between items-center text-sm">
                                       <span className="text-white/30 font-bold uppercase tracking-widest text-[10px]">Cadeau V.I.P</span>
                                       <div className="flex items-center gap-2">
                                           <Trophy size={14} className="text-[#d6b37c]" />
                                           <span className="text-white font-black">{contest.prize}</span>
                                       </div>
                                   </div>
                                   <div className="flex justify-between items-center text-sm">
                                       <span className="text-white/30 font-bold uppercase tracking-widest text-[10px]">Date Limite</span>
                                       <span className="text-white/80 font-medium">{new Date(contest.end_date).toLocaleDateString('fr-FR')}</span>
                                   </div>
                               </div>
                               <div className={`mt-8 text-center text-[10px] font-black tracking-[0.2em] py-3 rounded-xl border ${contest.is_active ? 'bg-[#ff6b4a]/10 text-[#ff6b4a] border-[#ff6b4a]/20 shadow-[0_0_15px_rgba(255,107,74,0.1)]' : 'bg-white/5 text-white/20 border-white/10'}`}>
                                   {contest.is_active ? 'CONCOURS EN COURS' : 'ÉVÉNEMENT TERMINÉ'}
                               </div>
                          </div>
                      ))}
                   </div>
              )}


              {/* === INSTAGRAM CURATION === */}
              {activeTab === 'instagram' && (
                <InstagramCurationPanel />
              )}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* === MODAL FORM (EVENTS / CONTESTS / GALLERY) === */}
      {showForm && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0a0a0a]/90 backdrop-blur-md" onClick={() => setShowForm(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-[#111] rounded-3xl p-8 border border-[#333] relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8 border-b border-[#222] pb-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-[#ff6b4a] to-[#d6b37c] bg-clip-text text-transparent">
                {editingItem ? 'Modifier' : 'Créer'} {activeTab === 'events' ? 'un événement' : activeTab === 'contests' ? 'un concours' : 'une image'}
              </h3>
              <button onClick={() => setShowForm(false)} className="bg-[#1a1a1a] p-2 rounded-full text-white/50 hover:text-white hover:bg-[#333] transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              
              {/* Common Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Titre *</label>
                  <input type="text" required value={formData.title || formData.name || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-[#1a1a1a] border border-[#333] focus:border-[#ff6b4a] text-white px-4 py-3 rounded-xl outline-none transition-colors" />
                </div>
                
                {activeTab === 'events' && (
                  <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Date *</label>
                    <input type="datetime-local" required value={formData.date ? new Date(formData.date).toISOString().slice(0, 16) : ''} onChange={(e) => setFormData({...formData, date: new Date(e.target.value).toISOString()})} className="w-full bg-[#1a1a1a] border border-[#333] focus:border-[#ff6b4a] text-white px-4 py-3 rounded-xl outline-none transition-colors" />
                  </div>
                )}

                {/* IMAGE INPUT — gallery dual mode */}
                {activeTab === 'gallery' && !editingItem ? (
                  <div className="md:col-span-2 space-y-4">
                    {/* Mode toggle tabs */}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setGalleryUploadMode('file')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                          galleryUploadMode === 'file'
                            ? 'bg-[#ff6b4a] text-white shadow-[0_0_15px_rgba(255,107,74,0.3)]'
                            : 'bg-[#1a1a1a] text-white/50 border border-[#333] hover:border-[#ff6b4a]/50 hover:text-white'
                        }`}
                      >
                        <Upload size={16} />
                        Fichier
                      </button>
                      <button
                        type="button"
                        onClick={() => setGalleryUploadMode('url')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                          galleryUploadMode === 'url'
                            ? 'bg-[#ff6b4a] text-white shadow-[0_0_15px_rgba(255,107,74,0.3)]'
                            : 'bg-[#1a1a1a] text-white/50 border border-[#333] hover:border-[#ff6b4a]/50 hover:text-white'
                        }`}
                      >
                        <Link size={16} />
                        URL
                      </button>
                    </div>

                    {galleryUploadMode === 'file' ? (
                      <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Image (fichier) *</label>
                        <input
                          ref={galleryFileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleGalleryFileChange}
                          className="hidden"
                        />
                        <div
                          onClick={() => galleryFileInputRef.current?.click()}
                          className={`w-full border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all hover:-translate-y-0.5 ${
                            galleryFilePreview
                              ? 'border-[#ff6b4a]/50 bg-[#ff6b4a]/5'
                              : 'border-[#333] hover:border-[#ff6b4a]/30 bg-[#1a1a1a]'
                          }`}
                        >
                          {galleryFilePreview ? (
                            <div className="space-y-3">
                              <img src={galleryFilePreview} alt="Preview" className="max-h-48 mx-auto rounded-xl object-contain shadow-lg" />
                              <p className="text-white/50 text-sm">{galleryFile?.name} — <span className="text-[#ff6b4a]">{(galleryFile?.size / 1024 / 1024).toFixed(2)} MB</span></p>
                              <p className="text-white/30 text-xs">Cliquez pour changer</p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="w-16 h-16 mx-auto rounded-full bg-[#ff6b4a]/10 flex items-center justify-center">
                                <Upload size={28} className="text-[#ff6b4a]" />
                              </div>
                              <p className="text-white/70 font-medium">Cliquez pour sélectionner une image</p>
                              <p className="text-white/30 text-xs">PNG, JPG, WEBP — Max 10 MB</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">URL de l&apos;image *</label>
                        <input
                          type="url"
                          required
                          value={formData.url || ''}
                          onChange={(e) => setFormData({...formData, url: e.target.value})}
                          className="w-full bg-[#1a1a1a] border border-[#333] focus:border-[#ff6b4a] text-white px-4 py-3 rounded-xl outline-none transition-colors"
                          placeholder="https://..."
                        />
                        {formData.url && (
                          <div className="mt-3">
                            <img src={formData.url} alt="Preview" className="max-h-48 rounded-xl object-contain border border-[#222]" onError={(e) => e.target.style.display = 'none'} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : activeTab === 'events' ? (
                  <div className="md:col-span-2 space-y-4">
                    {/* Mode toggle tabs */}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEventUploadMode('file')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                          eventUploadMode === 'file'
                            ? 'bg-[#ff6b4a] text-white shadow-[0_0_15px_rgba(255,107,74,0.3)]'
                            : 'bg-[#1a1a1a] text-white/50 border border-[#333] hover:border-[#ff6b4a]/50 hover:text-white'
                        }`}
                      >
                        <Upload size={16} />
                        Fichier
                      </button>
                      <button
                        type="button"
                        onClick={() => setEventUploadMode('url')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                          eventUploadMode === 'url'
                            ? 'bg-[#ff6b4a] text-white shadow-[0_0_15px_rgba(255,107,74,0.3)]'
                            : 'bg-[#1a1a1a] text-white/50 border border-[#333] hover:border-[#ff6b4a]/50 hover:text-white'
                        }`}
                      >
                        <Link size={16} />
                        URL
                      </button>
                    </div>

                    {eventUploadMode === 'file' ? (
                      <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Image (fichier) {editingItem ? '' : '*'}</label>
                        <input
                          ref={eventFileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleEventFileChange}
                          className="hidden"
                        />
                        <div
                          onClick={() => eventFileInputRef.current?.click()}
                          className={`w-full border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all hover:-translate-y-0.5 ${
                            eventFilePreview
                              ? 'border-[#ff6b4a]/50 bg-[#ff6b4a]/5'
                              : 'border-[#333] hover:border-[#ff6b4a]/30 bg-[#1a1a1a]'
                          }`}
                        >
                          {eventFilePreview ? (
                            <div className="space-y-3">
                              <img src={eventFilePreview} alt="Preview" className="max-h-48 mx-auto rounded-xl object-contain shadow-lg" />
                              <p className="text-white/50 text-sm">{eventFile?.name} — <span className="text-[#ff6b4a]">{(eventFile?.size / 1024 / 1024).toFixed(2)} MB</span></p>
                              <p className="text-white/30 text-xs">Cliquez pour changer</p>
                            </div>
                          ) : editingItem && (formData.image_url || formData.imageUrl) ? (
                            <div className="space-y-3">
                              <img src={formData.image_url || formData.imageUrl} alt="Current event" className="max-h-48 mx-auto rounded-xl object-contain shadow-lg opacity-60" />
                              <p className="text-white/70 font-medium">Cliquer pour remplacer l&apos;image existante</p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="w-16 h-16 mx-auto rounded-full bg-[#ff6b4a]/10 flex items-center justify-center">
                                <Upload size={28} className="text-[#ff6b4a]" />
                              </div>
                              <p className="text-white/70 font-medium">Cliquez pour sélectionner une image</p>
                              <p className="text-white/30 text-xs">PNG, JPG, WEBP — Max 10 MB</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">URL de l&apos;image *</label>
                        <input
                          type="url"
                          required
                          value={formData.image_url || formData.imageUrl || ''}
                          onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                          className="w-full bg-[#1a1a1a] border border-[#333] focus:border-[#ff6b4a] text-white px-4 py-3 rounded-xl outline-none transition-colors"
                          placeholder="https://..."
                        />
                        {(formData.image_url || formData.imageUrl) && (
                          <div className="mt-3">
                            <img src={formData.image_url || formData.imageUrl} alt="Preview" className="max-h-48 rounded-xl object-contain border border-[#222]" onError={(e) => e.target.style.display = 'none'} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : ((activeTab === 'gallery' && editingItem) || activeTab === 'contests') && (
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">URL Image *</label>
                    <input type="url" required value={formData.image_url || formData.url || ''} onChange={(e) => setFormData({...formData, [activeTab === 'gallery' ? 'url' : 'image_url']: e.target.value})} className="w-full bg-[#1a1a1a] border border-[#333] focus:border-[#ff6b4a] text-white px-4 py-3 rounded-xl outline-none transition-colors" placeholder="https://..." />
                  </div>
                )}

                {(activeTab === 'events' || activeTab === 'contests') && (
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Description</label>
                    <textarea rows={3} required value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-[#1a1a1a] border border-[#333] focus:border-[#ff6b4a] text-white px-4 py-3 rounded-xl outline-none transition-colors resize-none" />
                  </div>
                )}

                {activeTab === 'events' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Lieu *</label>
                      <input type="text" required value={formData.location || 'GHF Club, Paris'} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full bg-[#1a1a1a] border border-[#333] focus:border-[#ff6b4a] text-white px-4 py-3 rounded-xl outline-none transition-colors" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Prix (€) *</label>
                        <input type="number" required value={formData.price !== undefined ? formData.price : 0} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full bg-[#1a1a1a] border border-[#333] focus:border-[#ff6b4a] text-white px-4 py-3 rounded-xl outline-none transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Capacité *</label>
                        <input type="number" required value={formData.capacity !== undefined ? formData.capacity : 100} onChange={(e) => setFormData({...formData, capacity: e.target.value})} className="w-full bg-[#1a1a1a] border border-[#333] focus:border-[#ff6b4a] text-white px-4 py-3 rounded-xl outline-none transition-colors" />
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'contests' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Prix à gagner *</label>
                      <input type="text" required value={formData.prize || ''} onChange={(e) => setFormData({...formData, prize: e.target.value})} className="w-full bg-[#1a1a1a] border border-[#333] focus:border-[#ff6b4a] text-white px-4 py-3 rounded-xl outline-none transition-colors" placeholder="Ex: Une bouteille de Champagne" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Date de Fin *</label>
                      <input type="datetime-local" required value={formData.end_date ? new Date(formData.end_date).toISOString().slice(0, 16) : ''} onChange={(e) => setFormData({...formData, end_date: new Date(e.target.value).toISOString()})} className="w-full bg-[#1a1a1a] border border-[#333] focus:border-[#ff6b4a] text-white px-4 py-3 rounded-xl outline-none transition-colors" />
                    </div>
                  </>
                )}
              </div>

              {/* === SPECIFIC FOR VIP AND AMBASSADEUR TABLES (EXTRACTED FROM OLD REACT APP) === */}
              {activeTab === 'events' && (
                  <div className="space-y-6 mt-6 border-t border-[#333] pt-6">
                      
                      {/* Tables Ambassadeur */}
                      <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-[#222]">
                          <label className="flex items-center gap-3 cursor-pointer">
                              <input type="checkbox" checked={formData.has_table_promo || false} onChange={(e) => setFormData({...formData, has_table_promo: e.target.checked})} className="w-5 h-5 rounded accent-[#ff6b4a]" />
                              <span className="text-white font-bold">Activer les Tables Ambassadeur</span>
                          </label>
                          {formData.has_table_promo && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                  <div>
                                      <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Prix Table Ambassadeur (€)</label>
                                      <input type="number" value={formData.table_promo_price || 0} onChange={(e) => setFormData({...formData, table_promo_price: e.target.value})} className="w-full bg-[#111] border border-[#333] focus:border-[#ff6b4a] text-white px-4 py-3 rounded-xl outline-none transition-colors" />
                                  </div>
                                  <div>
                                      <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Capacité (Tables)</label>
                                      <input type="number" value={formData.table_promo_capacity || 0} onChange={(e) => setFormData({...formData, table_promo_capacity: e.target.value})} className="w-full bg-[#111] border border-[#333] focus:border-[#ff6b4a] text-white px-4 py-3 rounded-xl outline-none transition-colors" />
                                  </div>
                              </div>
                          )}
                      </div>

                      {/* Tables VIP */}
                      <div className="bg-[#d6b37c]/5 p-5 rounded-2xl border border-[#d6b37c]/20">
                          <label className="flex items-center gap-3 cursor-pointer">
                              <input type="checkbox" checked={formData.has_table_vip || false} onChange={(e) => setFormData({...formData, has_table_vip: e.target.checked})} className="w-5 h-5 rounded accent-[#d6b37c]" />
                              <span className="text-[#d6b37c] font-bold">Activer les Tables VIP</span>
                          </label>
                          {formData.has_table_vip && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                  <div>
                                      <label className="block text-xs font-bold text-[#d6b37c]/50 uppercase tracking-wider mb-2">Prix Table VIP (€)</label>
                                      <input type="number" value={formData.table_vip_price || 0} onChange={(e) => setFormData({...formData, table_vip_price: e.target.value})} className="w-full bg-[#111] border border-[#d6b37c]/30 focus:border-[#d6b37c] text-white px-4 py-3 rounded-xl outline-none transition-colors" />
                                  </div>
                                  <div>
                                      <label className="block text-xs font-bold text-[#d6b37c]/50 uppercase tracking-wider mb-2">Capacité (Tables VIP)</label>
                                      <input type="number" value={formData.table_vip_capacity || 0} onChange={(e) => setFormData({...formData, table_vip_capacity: e.target.value})} className="w-full bg-[#111] border border-[#d6b37c]/30 focus:border-[#d6b37c] text-white px-4 py-3 rounded-xl outline-none transition-colors" />
                                  </div>
                              </div>
                          )}
                      </div>
                  </div>
              )}

              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-[#222]">
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 font-medium rounded-xl text-white/50 hover:text-white hover:bg-[#1a1a1a] transition-colors">
                  Annuler
                </button>
                <button type="submit" disabled={saving} className="bg-[#ff6b4a] text-white font-bold px-8 py-3 rounded-xl shadow-[0_0_20px_rgba(255,107,74,0.3)] hover:shadow-[0_0_30px_rgba(255,107,74,0.5)] transition-all flex items-center gap-2">
                  {saving && <Loader2 size={18} className="animate-spin" />}
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
