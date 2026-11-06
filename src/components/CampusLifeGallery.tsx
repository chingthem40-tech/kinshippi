import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, ZoomIn, X, Trophy, Microscope, BookOpen, 
  Building, CheckCircle2, Upload, Plus, Trash2, AlertCircle, 
  RefreshCw, Image as ImageIcon, Lock, Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  subscribeGalleryPhotos, 
  uploadGalleryImage, 
  addGalleryPhoto, 
  deleteGalleryPhoto, 
  GalleryPhotoRecord 
} from '../services/schoolFirestore';

export interface GalleryItem {
  id: string;
  title: string;
  category: 'all' | 'sports' | 'lab' | 'classrooms' | 'campus';
  categoryLabel: string;
  imgUrl: string;
  aspectClass: string;
  caption: string;
  highlight: string;
  isLive?: boolean;
}

// Built-in foundational moments representing official Kinship High School facilities
const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'sports-meet',
    title: 'Inter-House Athletics & Sports Meet',
    category: 'sports',
    categoryLabel: 'Sports & Athletics',
    imgUrl: '/src/assets/images/kinship_sports_activities_1793324122866.jpg',
    aspectClass: 'aspect-[4/5]',
    caption: 'Students competing with discipline and teamwork in track events, mass drills, and team games on the campus sports grounds.',
    highlight: 'Annual Athletic Meet & Inter-House Championship',
    isLive: false,
  },
  {
    id: 'science-lab',
    title: 'Hands-on Science Practical Experiments',
    category: 'lab',
    categoryLabel: 'Science Laboratory',
    imgUrl: '/src/assets/images/kinship_science_lab_1793324122079.jpg',
    aspectClass: 'aspect-[16/11]',
    caption: 'Class IX and X students carrying out practicals in Physics, Chemistry, and Biology under qualified laboratory supervision.',
    highlight: 'BOSEM Affiliated Composite Science Lab',
    isLive: false,
  },
  {
    id: 'classroom-learning',
    title: 'Interactive Academic Classrooms',
    category: 'classrooms',
    categoryLabel: 'Classrooms',
    imgUrl: '/src/assets/images/kinship_classroom_learning_1793324121715.jpg',
    aspectClass: 'aspect-[4/3]',
    caption: 'Engaged discussion and concept-driven instruction from Preparatory to Class X with strict English language campus immersion.',
    highlight: '14:1 Student to Teacher Mentorship Ratio',
    isLive: false,
  },
  {
    id: 'campus-exterior',
    title: 'Tuibong Peaceful Hillside Campus',
    category: 'campus',
    categoryLabel: 'Campus & Hostel',
    imgUrl: '/src/assets/images/kinship_campus_new_1793392844714.jpg',
    aspectClass: 'aspect-[16/10]',
    caption: 'Set east of Tuibong Bazar in a calm, breeze-filled environment insulated from municipal traffic, conducive to deep learning.',
    highlight: 'Tuibuang Campus & Supervised Hostels',
    isLive: false,
  },
  {
    id: 'lab-demonstrations',
    title: 'Science Practical Demonstrations',
    category: 'lab',
    categoryLabel: 'Science Laboratory',
    imgUrl: '/src/assets/images/kinship_science_lab_1793324122079.jpg',
    aspectClass: 'aspect-[1/1]',
    caption: 'Scientific curiosity stimulated through microscope specimen study, basic chemistry experiments, and practical demonstration for BOSEM exams.',
    highlight: 'Letter Marks Distinction Preparation',
    isLive: false,
  },
  {
    id: 'classrooms-library',
    title: 'Guided Reading & Peer Collaboration',
    category: 'classrooms',
    categoryLabel: 'Classrooms',
    imgUrl: '/src/assets/images/kinship_classroom_learning_1793324121715.jpg',
    aspectClass: 'aspect-[3/4]',
    caption: 'Dedicated reading sessions, debate preparation, and moral value discussions anchored in Proverbs 22:6.',
    highlight: 'Continuous Comprehensive Assessment',
    isLive: false,
  },
  {
    id: 'sports-football',
    title: 'Physical Education & House Competitions',
    category: 'sports',
    categoryLabel: 'Sports & Athletics',
    imgUrl: '/src/assets/images/kinship_sports_activities_1793324122866.jpg',
    aspectClass: 'aspect-[16/10]',
    caption: 'Daily physical training (P.T.) for boarders and structured sports coaching that builds bodily strength, character, and agility.',
    highlight: 'Spiritus, Mens, Corpus in Action',
    isLive: false,
  },
];

export const CampusLifeGallery: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'sports' | 'lab' | 'classrooms' | 'campus'>('all');
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);
  
  // Real-time Firestore uploaded photos
  const [livePhotos, setLivePhotos] = useState<GalleryPhotoRecord[]>([]);
  
  // Admin Upload Modal State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState<'sports' | 'lab' | 'classrooms' | 'campus'>('sports');
  const [uploadHighlight, setUploadHighlight] = useState('');
  const [uploadAspectClass, setUploadAspectClass] = useState('aspect-[16/10]');
  const [uploadCaption, setUploadCaption] = useState('');
  
  // Status states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatusText, setUploadStatusText] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Staggered entrance animation and image load tracking
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [isInView, setIsInView] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: '80px' }
    );

    if (galleryRef.current) {
      observer.observe(galleryRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Subscribe to live Firestore gallery photos
  useEffect(() => {
    const unsub = subscribeGalleryPhotos((photos) => {
      setLivePhotos(photos);
    });
    return () => unsub();
  }, []);

  // Combine live uploaded photos (shown first) with default verified items
  const combinedItems: GalleryItem[] = [
    ...livePhotos.map((p) => ({
      id: p.id,
      title: p.title,
      category: p.category,
      categoryLabel: p.categoryLabel,
      imgUrl: p.imgUrl,
      aspectClass: p.aspectClass || 'aspect-[16/10]',
      caption: p.caption,
      highlight: p.highlight,
      isLive: true,
    })),
    ...DEFAULT_GALLERY_ITEMS,
  ];

  const filteredItems = selectedFilter === 'all' 
    ? combinedItems 
    : combinedItems.filter(item => item.category === selectedFilter);

  // Handle local file selection and preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Please select a valid image file (JPEG, PNG, WebP).');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg('Image size must be less than 10MB.');
        return;
      }
      setSelectedFile(file);
      setErrorMsg(null);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Auto-suggest title if empty
      if (!uploadTitle) {
        const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        const cleanName = nameWithoutExt.replace(/[-_]/g, ' ');
        setUploadTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg('Please select an image file to upload.');
      return;
    }
    if (!uploadTitle.trim() || !uploadCaption.trim() || !uploadHighlight.trim()) {
      setErrorMsg('Please fill in title, badge highlight, and caption.');
      return;
    }

    setIsUploading(true);
    setErrorMsg(null);
    setUploadStatusText('Uploading image to Firebase Storage...');

    try {
      // 1. Upload file to Firebase Storage
      const storageUrl = await uploadGalleryImage(selectedFile);
      setUploadStatusText('Saving photo record to Firestore live collection...');

      // Map category to label
      const categoryLabels: Record<string, string> = {
        sports: 'Sports & Athletics',
        lab: 'Science Laboratory',
        classrooms: 'Classrooms',
        campus: 'Campus & Hostel',
      };

      // 2. Add metadata record to Firestore
      await addGalleryPhoto({
        title: uploadTitle.trim(),
        category: uploadCategory,
        categoryLabel: categoryLabels[uploadCategory] || 'Campus Moment',
        imgUrl: storageUrl,
        caption: uploadCaption.trim(),
        highlight: uploadHighlight.trim(),
        aspectClass: uploadAspectClass,
        authorEmail: user?.email || 'boichung094@gmail.com',
      });

      setSuccessMsg('Photo uploaded and published live to Campus Life Gallery!');
      setUploadStatusText('');
      
      // Reset form
      setTimeout(() => {
        setIsUploadOpen(false);
        setSelectedFile(null);
        setPreviewUrl(null);
        setUploadTitle('');
        setUploadCaption('');
        setUploadHighlight('');
        setSuccessMsg(null);
        setIsUploading(false);
      }, 1200);
    } catch (err: any) {
      console.error('Gallery upload error:', err);
      setErrorMsg(err.message || 'Failed to complete photo upload.');
      setIsUploading(false);
      setUploadStatusText('');
    }
  };

  const handleDeletePhoto = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to remove "${title}" from the live gallery?`)) {
      return;
    }
    try {
      await deleteGalleryPhoto(id);
    } catch (err: any) {
      alert(`Failed to delete photo: ${err.message}`);
    }
  };

  return (
    <div className="mt-16 pt-16 border-t border-slate-200 dark:border-slate-800">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-[#c8161d] dark:text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Campus Life in Action</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold font-editorial text-[#0c1760] dark:text-white">
            Campus Life Photo Gallery
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
            A real-time glimpse into everyday life at Kinship High School — exploring our modern science laboratories, energetic athletics on the sports fields, and engaging classrooms.
          </p>
        </div>

        {/* Admin Upload Action & Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {isAdmin ? (
            <button
              type="button"
              onClick={() => setIsUploadOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#c8161d] hover:bg-[#a51218] text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>Upload New Photo</span>
            </button>
          ) : (
            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Admin photo upload enabled via Portal</span>
            </div>
          )}

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedFilter === 'all'
                  ? 'bg-[#0c1760] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Moments ({combinedItems.length})
            </button>
            <button
              onClick={() => setSelectedFilter('classrooms')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedFilter === 'classrooms'
                  ? 'bg-[#0c1760] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Classrooms
            </button>
            <button
              onClick={() => setSelectedFilter('lab')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedFilter === 'lab'
                  ? 'bg-[#0c1760] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Science Lab
            </button>
            <button
              onClick={() => setSelectedFilter('sports')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedFilter === 'sports'
                  ? 'bg-[#0c1760] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sports & Athletics
            </button>
            <button
              onClick={() => setSelectedFilter('campus')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedFilter === 'campus'
                  ? 'bg-[#0c1760] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Campus & Hostel
            </button>
          </div>
        </div>
      </div>

      {/* Masonry Grid Layout with Staggered Entrance */}
      <div 
        ref={galleryRef}
        className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5"
      >
        {filteredItems.map((item, index) => {
          const isImgLoaded = !!loadedImages[item.id];
          return (
            <div
              key={`${selectedFilter}-${item.id}`}
              style={{
                animationDelay: isInView ? `${Math.min(index * 65, 650)}ms` : '0ms',
              }}
              className={`break-inside-avoid relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 group transition-all duration-300 hover:-translate-y-1 ${
                isInView ? 'gallery-stagger-card' : 'opacity-0'
              }`}
            >
              {/* Image Container */}
              <div 
                onClick={() => setActivePhoto(item)}
                className={`relative w-full ${item.aspectClass} overflow-hidden bg-slate-100 dark:bg-slate-900 cursor-pointer`}
              >
                {/* Skeleton shimmer while loading */}
                {!isImgLoaded && (
                  <div className="absolute inset-0 z-0 gallery-skeleton-shimmer flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500 select-none">
                      <ImageIcon className="w-7 h-7 animate-pulse opacity-60" />
                      <span className="text-[10px] font-semibold tracking-wider uppercase opacity-75">Kinship Moments</span>
                    </div>
                  </div>
                )}

                <img
                  src={item.imgUrl}
                  alt={item.title}
                  onLoad={() => {
                    setLoadedImages((prev) => ({ ...prev, [item.id]: true }));
                  }}
                  className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-108 ${
                    isImgLoaded 
                      ? 'opacity-100 scale-100 blur-0' 
                      : 'opacity-0 scale-105 blur-[3px]'
                  }`}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />

                {/* Top Category Badge */}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 backdrop-blur-md shadow-xs flex items-center gap-1.5 border border-slate-200/50 dark:border-slate-700/50">
                    {item.category === 'sports' && <Trophy className="w-3 h-3 text-amber-500" />}
                    {item.category === 'lab' && <Microscope className="w-3 h-3 text-blue-500" />}
                    {item.category === 'classrooms' && <BookOpen className="w-3 h-3 text-red-500" />}
                    {item.category === 'campus' && <Building className="w-3 h-3 text-emerald-500" />}
                    <span>{item.categoryLabel}</span>
                  </span>
                  {item.isLive && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 shadow-xs">
                      New Upload
                    </span>
                  )}
                </div>

                {/* Zoom prompt icon */}
                <div className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-4 h-4" />
                </div>

                {/* Hover Caption Overlay (Rich Animated Gradient) */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5 text-white">
                  <span className="text-[11px] font-semibold text-amber-300 flex items-center gap-1 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{item.highlight}</span>
                  </span>
                  <h4 className="font-editorial text-lg font-bold leading-tight mb-1.5">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-200 line-clamp-3 leading-relaxed">
                    {item.caption}
                  </p>
                  <div className="pt-2 mt-2 border-t border-white/20 text-[10px] font-medium text-amber-400 flex items-center justify-between">
                    <span>Click to view full photograph</span>
                    <span>→</span>
                  </div>
                </div>
              </div>

              {/* Static Bottom Row for Mobile & Admin Delete */}
              <div className="p-3.5 bg-white dark:bg-slate-800/90 flex items-center justify-between border-t border-slate-100 dark:border-slate-700/60 text-xs">
                <div className="min-w-0 pr-2">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {item.highlight}
                  </p>
                </div>

                {isAdmin && item.isLive && (
                  <button
                    type="button"
                    onClick={() => handleDeletePhoto(item.id, item.title)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors shrink-0"
                    title="Remove this photo from gallery"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
          <ImageIcon className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No moments in this category yet.</p>
          <button
            onClick={() => setSelectedFilter('all')}
            className="mt-3 text-xs font-bold text-[#c8161d] hover:underline"
          >
            Show All Campus Moments
          </button>
        </div>
      )}

      {/* Admin Photo Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#c8161d] text-white flex items-center justify-center font-bold">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    Upload to Campus Life Gallery
                  </h3>
                  <p className="text-xs text-slate-500">
                    Uploads directly to Firebase Storage with real-time live sync
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="my-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="my-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4 mt-4">
              {/* File Dropzone / Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Select Image File (Firebase Storage) *
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                {previewUrl ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 max-h-56 flex items-center justify-center">
                    <img
                      src={previewUrl}
                      alt="Upload Preview"
                      className="w-full h-auto max-h-56 object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors"
                      title="Choose another image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer p-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#c8161d] bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center gap-2 transition-all text-center"
                  >
                    <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#c8161d] flex items-center justify-center">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-white">
                        Click to select image or drag & drop here
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        JPEG, PNG, WebP up to 10MB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Photo Title *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={120}
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="e.g. Science Exhibition 2026, Football Finals"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c8161d]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Gallery Category *
                  </label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c8161d]"
                  >
                    <option value="sports">Sports & Athletics</option>
                    <option value="lab">Science Laboratory</option>
                    <option value="classrooms">Classrooms</option>
                    <option value="campus">Campus & Hostel</option>
                  </select>
                </div>
              </div>

              {/* Highlight & Aspect Ratio */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Highlight Badge *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={uploadHighlight}
                    onChange={(e) => setUploadHighlight(e.target.value)}
                    placeholder="e.g. Inter-School Winners, New Lab Equipment"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c8161d]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Display Aspect Ratio
                  </label>
                  <select
                    value={uploadAspectClass}
                    onChange={(e) => setUploadAspectClass(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c8161d]"
                  >
                    <option value="aspect-[16/10]">Wide Landscape (16:10)</option>
                    <option value="aspect-[4/3]">Standard Photo (4:3)</option>
                    <option value="aspect-[1/1]">Square (1:1)</option>
                    <option value="aspect-[4/5]">Portrait / Tall (4:5)</option>
                  </select>
                </div>
              </div>

              {/* Caption */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Caption Description *
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {uploadCaption.length}/500 chars
                  </span>
                </div>
                <textarea
                  required
                  rows={3}
                  maxLength={500}
                  value={uploadCaption}
                  onChange={(e) => setUploadCaption(e.target.value)}
                  placeholder="Describe what students are doing and the learning outcome..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c8161d]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !selectedFile}
                  className="px-5 py-2.5 rounded-xl bg-[#c8161d] hover:bg-[#a51218] text-white text-xs font-bold shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{uploadStatusText || 'Uploading...'}</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Upload & Publish to Gallery</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {activePhoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
          onClick={() => setActivePhoto(null)}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="relative max-w-4xl w-full bg-slate-950 text-white rounded-2xl overflow-hidden shadow-2xl border border-slate-800 my-8 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Area */}
            <div className="relative w-full max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={activePhoto.imgUrl}
                alt={activePhoto.title}
                className="w-full h-auto max-h-[70vh] object-contain"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors"
                aria-label="Close photo"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Details Area */}
            <div className="p-6 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#c8161d] text-white">
                    {activePhoto.categoryLabel}
                  </span>
                  <span className="text-xs text-amber-400 font-semibold">
                    {activePhoto.highlight}
                  </span>
                  {activePhoto.isLive && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950">
                      Live Verified
                    </span>
                  )}
                </div>
                <h3 className="font-editorial text-xl font-bold text-white">
                  {activePhoto.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  {activePhoto.caption}
                </p>
              </div>

              <button
                onClick={() => setActivePhoto(null)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors self-start sm:self-center whitespace-nowrap"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
