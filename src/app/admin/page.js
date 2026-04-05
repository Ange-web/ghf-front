"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Shield, Users, Calendar, Image, Trophy, Ticket,
  Plus, Edit, Trash2, Check, X, Loader2, ChevronDown,
  Eye, EyeOff, BarChart3, Settings
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

const tabs = [
  { id: 'events', label: 'Événements', icon: Calendar },
  { id: 'reservations', label: 'Réservations', icon: Ticket },
  { id: 'gallery', label: 'Galerie', icon: Image },
  { id: 'contests', label: 'Concours', icon: Trophy },
  { id: 'users', label: 'Utilisateurs', icon: Users },
  { id: 'stats', label: 'Statistiques', icon: BarChart3 },
];

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('events');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [stats, setStats] = useState(null);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

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
        case 'events':
          endpoint = '/api/admin/events';
          break;
        case 'reservations':
          endpoint = '/api/admin/reservations';
          break;
        case 'gallery':
          endpoint = '/api/admin/gallery';
          break;
        case 'contests':
          endpoint = '/api/admin/contests';
          break;
        case 'users':
          endpoint = '/api/admin/users';
          break;
        case 'stats':
          endpoint = '/api/admin/stats';
          break;
        default:
          return;
      }
      
      const { data: result } = await api.get(endpoint);
      
      if (activeTab === 'stats') {
        setStats(result);
      } else {
        setData(result);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setItemToDelete(id);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      let endpoint = '';
      switch (activeTab) {
        case 'events': endpoint = `/api/admin/events/${itemToDelete}`; break;
        case 'gallery': endpoint = `/api/admin/gallery/${itemToDelete}`; break;
        case 'contests': endpoint = `/api/admin/contests/${itemToDelete}`; break;
        default: return;
      }
      
      await api.delete(endpoint);
      fetchData();
      toast.success('Élément supprimé');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de la suppression');
    } finally {
      setItemToDelete(null);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let endpoint = '';
      switch (activeTab) {
        case 'events': endpoint = '/api/admin/events'; break;
        case 'gallery': endpoint = '/api/admin/gallery'; break;
        case 'contests': endpoint = '/api/admin/contests'; break;
        default: return;
      }
      
      if (editingItem) {
        await api.put(`${endpoint}/${editingItem.id}`, formData);
        toast.success('Élément modifié avec succès');
      } else {
        await api.post(endpoint, formData);
        toast.success('Élément créé avec succès');
      }
      
      setShowForm(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      let endpoint = '';
      switch (activeTab) {
        case 'reservations':
          endpoint = `/api/admin/reservations/${id}`;
          break;
        case 'gallery':
          endpoint = `/api/admin/gallery/${id}/status`;
          break;
        default: return;
      }
      
      await api.patch(endpoint, { status });
      fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="animate-spin text-neon-red" size={40} />
      </div>
    );
  }

  if (!isAdmin) return null;

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton h-16 rounded-xl" />
          ))}
        </div>
      );
    }

    if (activeTab === 'stats' && stats) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-neon-dark/80 backdrop-blur-md rounded-xl p-6 border border-neon-red/20">
            <p className="text-white/50 text-sm">Total événements</p>
            <p className="text-3xl font-bold text-white mt-2">{stats.total_events || 0}</p>
          </div>
          <div className="bg-neon-dark/80 backdrop-blur-md rounded-xl p-6 border border-neon-red/20">
            <p className="text-white/50 text-sm">Réservations</p>
            <p className="text-3xl font-bold text-neon-red mt-2">{stats.total_reservations || 0}</p>
          </div>
          <div className="bg-neon-dark/80 backdrop-blur-md rounded-xl p-6 border border-neon-red/20">
            <p className="text-white/50 text-sm">Utilisateurs</p>
            <p className="text-3xl font-bold text-neon-gold mt-2">{stats.total_users || 0}</p>
          </div>
          <div className="bg-neon-dark/80 backdrop-blur-md rounded-xl p-6 border border-neon-red/20">
            <p className="text-white/50 text-sm">Photos galerie</p>
            <p className="text-3xl font-bold text-green-400 mt-2">{stats.total_gallery || 0}</p>
          </div>
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div className="text-center py-16 bg-neon-dark/50 rounded-xl border border-neon-red/10">
          <p className="text-white/50">Aucun élément trouvé</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {data.map((item) => (
          <div
            key={item.id}
            className="bg-neon-dark/80 rounded-xl p-4 border border-neon-red/10 hover:border-neon-red/40 transition-colors shadow-lg"
            data-testid={`admin-item-${item.id}`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium truncate">
                  {item.title || item.name || item.event_title || `#${item.id}`}
                </h4>
                <p className="text-white/50 text-sm truncate mt-1">
                  {item.email || item.description || item.location || ''}
                </p>
                {item.date && (
                  <p className="text-white/40 text-xs mt-1">
                    {new Date(item.date || item.event_date || item.created_at).toLocaleDateString('fr-FR')}
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Status badge */}
                {item.status && (
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    item.status === 'confirmed' || item.status === 'approved' || item.status === 'active'
                      ? 'bg-green-500/20 text-green-500'
                      : item.status === 'pending'
                      ? 'bg-yellow-500/20 text-yellow-500'
                      : 'bg-red-500/20 text-red-500'
                  }`}>
                    {item.status}
                  </span>
                )}
                
                {/* Status Actions */}
                {(activeTab === 'reservations' || activeTab === 'gallery') && item.status === 'pending' && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleStatusChange(item.id, activeTab === 'reservations' ? 'confirmed' : 'approved')}
                      className="p-1.5 bg-green-500/20 text-green-500 rounded hover:bg-green-500/30 transition-colors"
                      title="Approuver"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={() => handleStatusChange(item.id, activeTab === 'reservations' ? 'cancelled' : 'rejected')}
                      className="p-1.5 bg-red-500/20 text-red-500 rounded hover:bg-red-500/30 transition-colors"
                      title="Refuser"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                
                {/* Edit & Delete */}
                {['events', 'gallery', 'contests'].includes(activeTab) && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => { setEditingItem(item); setFormData(item); setShowForm(true); }}
                      className="p-1.5 text-white/30 hover:text-white transition-colors"
                      title="Modifier"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-white/30 hover:text-red-400 transition-colors"
                      title="Supprimer"
                      data-testid={`delete-${item.id}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-20" data-testid="admin-page">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Shield className="text-neon-gold" size={28} />
            <h1 className="heading-lg text-white">Administration</h1>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <p className="text-white/60">
              Gérez les événements, réservations, galerie et plus encore.
            </p>
            {['events', 'gallery', 'contests'].includes(activeTab) && (
              <button 
                onClick={() => { setEditingItem(null); setFormData({}); setShowForm(true); }}
                className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus size={16} /> Nouveau
              </button>
            )}
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="flex flex-wrap gap-2 mb-8 p-1 bg-neon-dark/80 rounded-xl border border-neon-red/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-neon-red text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
                data-testid={`tab-${tab.id}`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setItemToDelete(null)} />
          <div className="bg-neon-dark rounded-2xl p-6 border border-neon-red/30 relative z-10 max-w-sm w-full text-center shadow-[0_0_30px_rgba(255,45,45,0.2)]">
            <h3 className="text-xl font-bold text-white mb-2">Confirmer la suppression</h3>
            <p className="text-white/60 mb-6">Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.</p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setItemToDelete(null)} 
                className="px-4 py-2 rounded-lg text-white/60 hover:text-white transition-colors"
                data-testid="cancel-delete-btn"
              >
                Annuler
              </button>
              <button 
                onClick={confirmDelete} 
                className="px-4 py-2 bg-red-500/20 text-red-500 hover:bg-red-500/30 rounded-lg transition-colors"
                data-testid="confirm-delete-btn"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <motion.div 
            className="bg-neon-dark rounded-2xl p-6 border border-neon-red/30 relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingItem ? 'Modifier' : 'Ajouter'} {activeTab === 'events' ? 'un événement' : activeTab === 'gallery' ? 'une image' : 'un concours'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-white/50 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm text-white/70">Titre</label>
                  <input
                    type="text"
                    required
                    value={formData.title || formData.name || formData.event_title || ''}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="form-input w-full px-4 py-2 rounded-lg"
                    placeholder="Titre"
                  />
                </div>

                {activeTab === 'events' && (
                  <div className="space-y-1">
                    <label className="text-sm text-white/70">Date</label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.date ? new Date(formData.date).toISOString().slice(0, 16) : ''}
                      onChange={(e) => setFormData({...formData, date: new Date(e.target.value).toISOString()})}
                      className="form-input w-full px-4 py-2 rounded-lg"
                    />
                  </div>
                )}

                {activeTab === 'events' && (
                  <>
                    <div className="space-y-1">
                      <label className="text-sm text-white/70">Prix (€)</label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={formData.price !== undefined ? formData.price : 0}
                        onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                        className="form-input w-full px-4 py-2 rounded-lg"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-white/70">Lieu</label>
                      <input
                        type="text"
                        required
                        value={formData.location || 'GHF Club, Paris'}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="form-input w-full px-4 py-2 rounded-lg"
                      />
                    </div>
                  </>
                )}

                {(activeTab === 'events' || activeTab === 'gallery' || activeTab === 'contests') && (
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-sm text-white/70">URL de l'image</label>
                    <input
                      type="url"
                      required
                      value={formData.image_url || formData.url || ''}
                      onChange={(e) => setFormData({...formData, [activeTab === 'gallery' ? 'url' : 'image_url']: e.target.value})}
                      className="form-input w-full px-4 py-2 rounded-lg"
                      placeholder="https://..."
                    />
                  </div>
                )}

                {(activeTab === 'events' || activeTab === 'contests') && (
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-sm text-white/70">Description</label>
                    <textarea
                      rows={3}
                      required
                      value={formData.description || ''}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="form-input w-full px-4 py-2 rounded-lg resize-none"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 rounded-lg text-white/60 hover:text-white transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary px-6 py-2 rounded-lg flex items-center gap-2"
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

