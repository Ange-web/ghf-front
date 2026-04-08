"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Filter, Plus, Camera, Loader2, Check, Clock, Upload, Link } from 'lucide-react';
import api from '@/lib/api';
import { useApi } from '@/hooks/useApi';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

const ITEMS_PER_PAGE = 12;

export default function GalleryPage() {
  const { isAuthenticated, openAuthModal } = useAuth();

  // Initial data via cache hook
  const { data: initialGallery, loading: initialLoading } = useApi(`/api/gallery?limit=${ITEMS_PER_PAGE}&page=1`);
  const { data: eventsRaw } = useApi('/api/events?limit=50');

  const [items, setItems] = useState([]);
  const [events, setEvents] = useState([]);
  const [myPhotos, setMyPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterEvent, setFilterEvent] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadForm, setUploadForm] = useState({ title: '', url: '', event_id: '' });
  const [uploadMode, setUploadMode] = useState('file');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadFilePreview, setUploadFilePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Sync initial data from cache hook
  useEffect(() => {
    if (initialGallery) {
      // initialGallery could be the raw array or have pagination info
      const galleryItems = Array.isArray(initialGallery) ? initialGallery : initialGallery;
      setItems(galleryItems);
    }
  }, [initialGallery]);

  useEffect(() => {
    if (eventsRaw) {
      setEvents(Array.isArray(eventsRaw) ? eventsRaw : []);
    }
  }, [eventsRaw]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyPhotos();
    }
  }, [isAuthenticated]);

  // Reset when filter changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchFiltered(1);
  }, [filterEvent]);

  const fetchFiltered = async (p = 1) => {
    try {
      const params = new URLSearchParams({ page: p, limit: ITEMS_PER_PAGE });
      if (filterEvent) params.set('eventId', filterEvent);
      const { data } = await api.get(`/api/gallery?${params}`);
      const galleryItems = data?.data || data || [];
      const pagination = data?.pagination;

      if (p === 1) {
        setItems(galleryItems);
      } else {
        setItems(prev => [...prev, ...galleryItems]);
      }

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

  const fetchMyPhotos = async () => {
    try {
      const { data } = await api.get('/api/gallery/my');
      setMyPhotos(data?.data || data || []);
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error('Error fetching my photos:', error);
      }
    }
  };

  const handleFileChange = (e) => {
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
      setUploadFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setUploadFilePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPhoto = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    setUploading(true);
    try {
      if (uploadMode === 'file') {
        if (!uploadFile) {
          toast.error('Veuillez sélectionner un fichier image');
          setUploading(false);
          return;
        }
        const fd = new FormData();
        fd.append('image', uploadFile);
        if (uploadForm.title) fd.append('caption', uploadForm.title);
        if (uploadForm.event_id) fd.append('eventId', uploadForm.event_id);
        await api.post('/api/gallery/upload', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/api/gallery', {
          url: uploadForm.url,
          caption: uploadForm.title,
          eventId: uploadForm.event_id || null,
        });
      }
      setUploadSuccess(true);
      setUploadForm({ title: '', url: '', event_id: '' });
      setUploadFile(null);
      setUploadFilePreview(null);
      fetchMyPhotos();
      // Reset gallery to page 1
      setPage(1);
      fetchFiltered(1);
      setTimeout(() => {
        setShowUploadModal(false);
        setUploadSuccess(false);
      }, 2000);
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
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-neon-gold text-xs uppercase tracking-[0.2em]">
            Souvenirs
          </span>
          <h1 className="heading-lg text-white mt-2">Galerie</h1>
          <p className="text-white/60 mt-4 max-w-xl">
            Revivez nos meilleurs moments à travers ces photos et vidéos exclusives.
          </p>
        </motion.div>

        {/* Filter */}
        <motion.div
          className="mt-8 flex flex-wrap gap-4 items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <select
              value={filterEvent}
              onChange={(e) => setFilterEvent(e.target.value)}
              className="form-input pl-12 pr-8 py-3 rounded-lg appearance-none cursor-pointer min-w-[220px]"
              data-testid="gallery-filter"
            >
              <option value="">Tous les événements</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
          </div>
          
          {/* Upload Button */}
          <button
            onClick={() => isAuthenticated ? setShowUploadModal(true) : openAuthModal()}
            className="btn-primary px-4 py-3 rounded-lg flex items-center gap-2"
            data-testid="upload-photo-btn"
          >
            <Camera size={18} />
            Partager une photo
          </button>
        </motion.div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4">
        {initialLoading && items.length === 0 ? (
          <div className="masonry-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="skeleton h-64 rounded-xl" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-white/50 text-lg">Aucune photo trouvée</p>
          </motion.div>
        ) : (
          <>
            <div className="masonry-grid">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="gallery-item rounded-xl overflow-hidden cursor-pointer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Math.min(index * 0.03, 0.3) }}
                  onClick={() => setSelectedItem(item)}
                  data-testid={`gallery-item-${item.id}`}
                >
                  <div style={{ aspectRatio: index % 3 === 0 ? '1/1' : index % 3 === 1 ? '4/3' : '3/4' }} className="relative w-full">
                    <Image
                      src={item.url}
                      alt={item.caption || 'Image de la galerie'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      loading={index < 6 ? 'eager' : 'lazy'}
                    />
                  </div>
                  <div className="gallery-overlay">
                    <div>
                      <p className="text-white font-medium">{item.caption}</p>
                      {item.event?.title && (
                        <p className="text-white/60 text-sm">{item.event.title}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="btn-secondary px-8 py-3 rounded-full flex items-center gap-2 text-sm"
                  data-testid="load-more-btn"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Chargement...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Charger plus de photos
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Item count */}
            {totalItems > 0 && (
              <p className="text-center text-white/30 text-xs mt-4">
                {items.length} / {totalItems} photos
              </p>
            )}
          </>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            data-testid="gallery-lightbox"
          >
            <button
              className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
              onClick={() => setSelectedItem(null)}
              data-testid="close-lightbox"
            >
              <X size={32} />
            </button>

            <motion.div
              className="relative max-w-5xl max-h-[90vh]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-[90vw] h-[80vh] max-w-5xl">
                <Image
                  src={selectedItem.url}
                  alt={selectedItem.caption || 'Image sélectionnée'}
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{selectedItem.caption}</p>
                    {selectedItem.event?.title && (
                      <p className="text-white/60 text-sm">{selectedItem.event.title}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDownload(selectedItem.url, selectedItem.caption)}
                    className="btn-secondary px-4 py-2 rounded-full flex items-center gap-2 text-sm"
                    data-testid="download-image-btn"
                  >
                    <Download size={16} />
                    Télécharger
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            className="fixed inset-0 z-[500] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
                  <p className="text-white/60 text-sm">
                    Votre photo sera visible après validation par un administrateur.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Camera className="text-neon-red" size={24} />
                      Partager une photo
                    </h3>
                    <button
                      onClick={() => setShowUploadModal(false)}
                      className="text-white/50 hover:text-white"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  
                  <form onSubmit={handleSubmitPhoto} className="space-y-4">
                    <div>
                      <label className="block text-sm text-white/70 mb-2">Titre *</label>
                      <input
                        type="text"
                        value={uploadForm.title}
                        onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                        placeholder="Titre de votre photo"
                        className="form-input w-full px-4 py-3 rounded-lg"
                        required
                        data-testid="photo-title-input"
                      />
                    </div>

                    {/* Mode toggle */}
                    <div>
                      <label className="block text-sm text-white/70 mb-2">Source de l&apos;image *</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setUploadMode('file')}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                            uploadMode === 'file'
                              ? 'bg-neon-red/20 text-neon-red border border-neon-red/30'
                              : 'bg-[#1a1a1a] text-white/40 border border-white/10 hover:text-white/70'
                          }`}
                        >
                          <Upload size={16} />
                          Fichier
                        </button>
                        <button
                          type="button"
                          onClick={() => setUploadMode('url')}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                            uploadMode === 'url'
                              ? 'bg-neon-red/20 text-neon-red border border-neon-red/30'
                              : 'bg-[#1a1a1a] text-white/40 border border-white/10 hover:text-white/70'
                          }`}
                        >
                          <Link size={16} />
                          URL
                        </button>
                      </div>
                    </div>

                    {uploadMode === 'file' ? (
                      <div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className={`w-full border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all hover:scale-[1.01] ${
                            uploadFilePreview
                              ? 'border-neon-red/40 bg-neon-red/5'
                              : 'border-white/10 hover:border-neon-red/20 bg-[#0a0a0f]'
                          }`}
                        >
                          {uploadFilePreview ? (
                            <div className="space-y-2">
                              <img src={uploadFilePreview} alt="Preview" className="max-h-40 mx-auto rounded-lg object-contain" />
                              <p className="text-white/50 text-xs">{uploadFile?.name} — {(uploadFile?.size / 1024 / 1024).toFixed(2)} MB</p>
                              <p className="text-white/30 text-[10px]">Cliquez pour changer</p>
                            </div>
                          ) : (
                            <div className="space-y-2 py-2">
                              <div className="w-12 h-12 mx-auto rounded-full bg-neon-red/10 flex items-center justify-center">
                                <Upload size={22} className="text-neon-red" />
                              </div>
                              <p className="text-white/60 text-sm font-medium">Cliquez pour sélectionner</p>
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
                          onChange={(e) => setUploadForm({...uploadForm, url: e.target.value})}
                          placeholder="https://..."
                          className="form-input w-full px-4 py-3 rounded-lg"
                          required
                          data-testid="photo-url-input"
                        />
                        <p className="text-xs text-white/40 mt-1">
                          Collez le lien direct vers votre image (Imgur, Google Photos, etc.)
                        </p>
                        {uploadForm.url && (
                          <div className="mt-3 relative w-full h-40">
                            <Image
                              src={uploadForm.url}
                              alt="Preview"
                              fill
                              className="object-cover rounded-lg"
                              unoptimized
                            />
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm text-white/70 mb-2">Événement associé</label>
                      <select
                        value={uploadForm.event_id}
                        onChange={(e) => setUploadForm({...uploadForm, event_id: e.target.value})}
                        className="form-input w-full px-4 py-3 rounded-lg"
                        data-testid="photo-event-select"
                      >
                        <option value="">Aucun événement</option>
                        {events.map((event) => (
                          <option key={event.id} value={event.id}>
                            {event.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="p-3 bg-neon-red/10 rounded-lg border border-neon-red/20 text-sm text-white/70">
                      <p>Votre photo sera soumise à validation par un administrateur avant d&apos;apparaître dans la galerie publique.</p>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={uploading}
                      className="btn-primary w-full py-3 rounded-lg flex items-center justify-center gap-2"
                      data-testid="submit-photo-btn"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Plus size={18} />
                          Soumettre la photo
                        </>
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
