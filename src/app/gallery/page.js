"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Plus, Camera, Loader2, Check, Upload, Link, ZoomIn, ChevronLeft, ChevronRight, Images } from 'lucide-react';
import api from '@/lib/api';
import { useApi } from '@/hooks/useApi';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

const ITEMS_PER_PAGE = 12;

export default function GalleryPage() {
  const { isAuthenticated, openAuthModal } = useAuth();

  const { data: initialGallery, loading: initialLoading } = useApi(`/api/gallery?limit=${ITEMS_PER_PAGE}&page=1`);
  const { data: eventsRaw } = useApi('/api/events?limit=50');

  const [items, setItems] = useState([]);
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [filterEvent, setFilterEvent] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadForm, setUploadForm] = useState({ title: '', url: '', event_id: '' });
  const [uploadMode, setUploadMode] = useState('file');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadFilePreview, setUploadFilePreview] = useState(null);
  const fileInputRef = useRef(null);

  const selectedItem = selectedIndex !== null ? items[selectedIndex] : null;

  useEffect(() => {
    if (initialGallery) setItems(initialGallery);
  }, [initialGallery]);

  useEffect(() => {
    if (eventsRaw) setEvents(Array.isArray(eventsRaw) ? eventsRaw : []);
  }, [eventsRaw]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchFiltered(1);
  }, [filterEvent]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (selectedIndex === null) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') setSelectedIndex(null);
      if (e.key === 'ArrowRight') setSelectedIndex(i => Math.min(i + 1, items.length - 1));
      if (e.key === 'ArrowLeft') setSelectedIndex(i => Math.max(i - 1, 0));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedIndex, items.length]);

  const fetchFiltered = async (p = 1) => {
    try {
      const params = new URLSearchParams({ page: p, limit: ITEMS_PER_PAGE });
      if (filterEvent) params.set('eventId', filterEvent);
      const { data } = await api.get(`/api/gallery?${params}`);
      const galleryItems = data?.data || data || [];
      const pagination = data?.pagination;

      if (p === 1) setItems(galleryItems);
      else setItems(prev => [...prev, ...galleryItems]);

      if (pagination) {
        setTotalItems(pagination.total);
        setHasMore(p < pagination.pages);
      } else {
        setHasMore(galleryItems.length >= ITEMS_PER_PAGE);
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
    }
  };

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchFiltered(nextPage);
    setLoadingMore(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Seules les images sont acceptées'); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error('Le fichier ne doit pas dépasser 10 MB'); return; }
    setUploadFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setUploadFilePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmitPhoto = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { openAuthModal(); return; }
    setUploading(true);
    try {
      if (uploadMode === 'file') {
        if (!uploadFile) { toast.error('Veuillez sélectionner un fichier image'); setUploading(false); return; }
        const fd = new FormData();
        fd.append('image', uploadFile);
        if (uploadForm.title) fd.append('caption', uploadForm.title);
        if (uploadForm.event_id) fd.append('eventId', uploadForm.event_id);
        await api.post('/api/gallery/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/api/gallery', { url: uploadForm.url, caption: uploadForm.title, eventId: uploadForm.event_id || null });
      }
      setUploadSuccess(true);
      setUploadForm({ title: '', url: '', event_id: '' });
      setUploadFile(null);
      setUploadFilePreview(null);
      setPage(1);
      fetchFiltered(1);
      setTimeout(() => { setShowUploadModal(false); setUploadSuccess(false); }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.detail || error.response?.data?.error || 'Erreur lors de la soumission');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = (url, title) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = title || 'image';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen pt-24 pb-20" data-testid="gallery-page">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 mb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-neon-gold text-xs uppercase tracking-[0.2em]">Souvenirs</span>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mt-2">
            <div>
              <h1 className="heading-lg text-white">Galerie</h1>
              <p className="text-white/50 mt-3 max-w-xl text-sm leading-relaxed">
                Revivez nos meilleurs moments à travers ces photos exclusives.
              </p>
            </div>
            {totalItems > 0 && (
              <div className="flex items-center gap-2 text-white/30 text-sm shrink-0">
                <Images size={16} />
                <span>{totalItems} photos</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Filters + Upload ───────────────────────────── */}
        <motion.div
          className="mt-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        >
          {/* Event filter chips */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterEvent('')}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                filterEvent === ''
                  ? 'bg-neon-red text-white shadow-[0_0_12px_rgba(255,45,45,0.4)]'
                  : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              Tous
            </button>
            {events.slice(0, 6).map((event) => (
              <button
                key={event.id}
                onClick={() => setFilterEvent(event.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                  filterEvent === event.id
                    ? 'bg-neon-red text-white shadow-[0_0_12px_rgba(255,45,45,0.4)]'
                    : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {event.title}
              </button>
            ))}
          </div>

          <button
            onClick={() => isAuthenticated ? setShowUploadModal(true) : openAuthModal()}
            className="btn-primary px-5 py-2.5 rounded-full flex items-center gap-2 text-sm shrink-0"
            data-testid="upload-photo-btn"
          >
            <Camera size={16} />
            Partager une photo
          </button>
        </motion.div>
      </div>

      {/* ── Gallery Masonry ────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4">
        {initialLoading && items.length === 0 ? (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="skeleton rounded-xl break-inside-avoid mb-3"
                style={{ height: `${[200, 280, 240, 180, 260, 220, 300, 190][i % 8]}px` }}
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <motion.div className="text-center py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Camera size={48} className="mx-auto text-white/10 mb-4" />
            <p className="text-white/40 text-lg">Aucune photo trouvée</p>
          </motion.div>
        ) : (
          <>
            {/* True masonry via CSS columns */}
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-3">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="relative break-inside-avoid mb-3 rounded-xl overflow-hidden cursor-pointer group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.03, 0.3) }}
                  onClick={() => setSelectedIndex(index)}
                  data-testid={`gallery-item-${item.id}`}
                >
                  <Image
                    src={item.url}
                    alt={item.caption || 'Image de la galerie'}
                    width={600}
                    height={0}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                    className="transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    loading={index < 8 ? 'eager' : 'lazy'}
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
                    {/* Zoom icon */}
                    <div className="flex justify-end">
                      <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                        <ZoomIn size={14} className="text-white" />
                      </div>
                    </div>
                    {/* Caption */}
                    {(item.caption || item.event?.title) && (
                      <div>
                        {item.caption && (
                          <p className="text-white text-xs font-medium line-clamp-2">{item.caption}</p>
                        )}
                        {item.event?.title && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-neon-red/70 rounded-full text-white text-[10px] uppercase tracking-wider">
                            {item.event.title}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="btn-secondary px-8 py-3 rounded-full flex items-center gap-2 text-sm"
                  data-testid="load-more-btn"
                >
                  {loadingMore ? (
                    <><Loader2 className="animate-spin" size={18} />Chargement...</>
                  ) : (
                    <><Plus size={18} />Charger plus</>
                  )}
                </button>
              </div>
            )}

            {totalItems > 0 && (
              <p className="text-center text-white/20 text-xs mt-4">
                {items.length} / {totalItems} photos
              </p>
            )}
          </>
        )}
      </div>

      {/* ── Lightbox ───────────────────────────────────────── */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="fixed inset-0 z-[400] flex items-center justify-center bg-black/95 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIndex(null)}
            data-testid="gallery-lightbox"
          >
            {/* Close */}
            <button
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              onClick={() => setSelectedIndex(null)}
              aria-label="Fermer la lightbox"
              data-testid="close-lightbox"
            >
              <X size={20} className="text-white" />
            </button>

            {/* Counter */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/70 text-xs">
              {selectedIndex + 1} / {items.length}
            </div>

            {/* Prev */}
            <button
              className="absolute left-3 sm:left-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors disabled:opacity-20"
              onClick={(e) => { e.stopPropagation(); setSelectedIndex(i => Math.max(i - 1, 0)); }}
              disabled={selectedIndex === 0}
              aria-label="Image précédente"
            >
              <ChevronLeft size={22} className="text-white" />
            </button>

            {/* Next */}
            <button
              className="absolute right-3 sm:right-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors disabled:opacity-20"
              onClick={(e) => { e.stopPropagation(); setSelectedIndex(i => Math.min(i + 1, items.length - 1)); }}
              disabled={selectedIndex === items.length - 1}
              aria-label="Image suivante"
            >
              <ChevronRight size={22} className="text-white" />
            </button>

            {/* Image */}
            <motion.div
              key={selectedItem.id}
              className="relative max-w-5xl w-full mx-12 sm:mx-20"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full" style={{ maxHeight: '80vh' }}>
                <Image
                  src={selectedItem.url}
                  alt={selectedItem.caption || 'Image sélectionnée'}
                  width={1200}
                  height={800}
                  style={{ width: '100%', height: 'auto', maxHeight: '80vh', objectFit: 'contain' }}
                  className="rounded-lg"
                  unoptimized
                />
              </div>

              {/* Bottom bar */}
              <div className="mt-3 flex items-center justify-between px-1">
                <div>
                  {selectedItem.caption && (
                    <p className="text-white font-medium text-sm">{selectedItem.caption}</p>
                  )}
                  {selectedItem.event?.title && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-neon-red/60 rounded-full text-white text-xs uppercase tracking-wider">
                      {selectedItem.event.title}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleDownload(selectedItem.url, selectedItem.caption)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors shrink-0"
                  data-testid="download-image-btn"
                >
                  <Download size={14} />
                  Télécharger
                </button>
              </div>

              {/* Keyboard hint */}
              <p className="text-center text-white/20 text-[10px] mt-3 tracking-widest">
                ← → pour naviguer · ESC pour fermer
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Upload Modal ───────────────────────────────────── */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            className="fixed inset-0 z-[500] flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => !uploading && setShowUploadModal(false)}
            />
            <motion.div
              className="relative bg-[#0F0F13] rounded-xl p-6 w-full max-w-md border border-white/10"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              data-testid="upload-modal"
            >
              {uploadSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                    <Check className="text-green-500" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Photo soumise !</h3>
                  <p className="text-white/60 text-sm">Votre photo sera visible après validation par un administrateur.</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Camera className="text-neon-red" size={22} />
                      Partager une photo
                    </h3>
                    <button
                      onClick={() => setShowUploadModal(false)}
                      className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                      aria-label="Fermer"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <form onSubmit={handleSubmitPhoto} className="space-y-4">
                    <div>
                      <label className="block text-sm text-white/60 mb-2">Titre *</label>
                      <input
                        type="text"
                        value={uploadForm.title}
                        onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                        placeholder="Titre de votre photo"
                        className="form-input w-full px-4 py-3 rounded-lg"
                        required
                        data-testid="photo-title-input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-white/60 mb-2">Source *</label>
                      <div className="flex gap-2">
                        {[{ id: 'file', icon: Upload, label: 'Fichier' }, { id: 'url', icon: Link, label: 'URL' }].map(({ id, icon: Icon, label }) => (
                          <button
                            key={id}
                            type="button"
                            onClick={() => setUploadMode(id)}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                              uploadMode === id
                                ? 'bg-neon-red/20 text-neon-red border border-neon-red/30'
                                : 'bg-white/5 text-white/40 border border-white/10 hover:text-white/70'
                            }`}
                          >
                            <Icon size={15} />
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {uploadMode === 'file' ? (
                      <div>
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className={`w-full border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                            uploadFilePreview
                              ? 'border-neon-red/40 bg-neon-red/5'
                              : 'border-white/10 hover:border-neon-red/20 bg-[#0a0a0f]'
                          }`}
                        >
                          {uploadFilePreview ? (
                            <div className="space-y-2">
                              <img src={uploadFilePreview} alt="Preview" className="max-h-40 mx-auto rounded-lg object-contain" />
                              <p className="text-white/40 text-xs">{uploadFile?.name} — {(uploadFile?.size / 1024 / 1024).toFixed(2)} MB</p>
                              <p className="text-white/25 text-[10px]">Cliquez pour changer</p>
                            </div>
                          ) : (
                            <div className="space-y-2 py-2">
                              <div className="w-12 h-12 mx-auto rounded-full bg-neon-red/10 flex items-center justify-center">
                                <Upload size={20} className="text-neon-red" />
                              </div>
                              <p className="text-white/60 text-sm">Cliquez pour sélectionner</p>
                              <p className="text-white/25 text-xs">PNG, JPG, WEBP — Max 10 MB</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="url"
                          value={uploadForm.url}
                          onChange={(e) => setUploadForm({ ...uploadForm, url: e.target.value })}
                          placeholder="https://..."
                          className="form-input w-full px-4 py-3 rounded-lg"
                          required
                          data-testid="photo-url-input"
                        />
                        {uploadForm.url && (
                          <div className="mt-3 relative w-full h-40 rounded-lg overflow-hidden">
                            <Image src={uploadForm.url} alt="Preview" fill className="object-cover" unoptimized />
                          </div>
                        )}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm text-white/60 mb-2">Événement associé</label>
                      <select
                        value={uploadForm.event_id}
                        onChange={(e) => setUploadForm({ ...uploadForm, event_id: e.target.value })}
                        className="form-input w-full px-4 py-3 rounded-lg"
                        data-testid="photo-event-select"
                      >
                        <option value="">Aucun événement</option>
                        {events.map((event) => (
                          <option key={event.id} value={event.id}>{event.title}</option>
                        ))}
                      </select>
                    </div>

                    <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-xs text-white/50 leading-relaxed">
                      Votre photo sera soumise à validation avant d&apos;apparaître dans la galerie publique.
                    </div>

                    <button
                      type="submit"
                      disabled={uploading}
                      className="btn-primary w-full py-3 rounded-lg flex items-center justify-center gap-2"
                      data-testid="submit-photo-btn"
                    >
                      {uploading ? (
                        <><Loader2 className="animate-spin" size={18} />Envoi en cours...</>
                      ) : (
                        <><Plus size={18} />Soumettre la photo</>
                      )}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
