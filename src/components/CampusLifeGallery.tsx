import React, { useState } from 'react';
import { Sparkles, ZoomIn, X, Trophy, Microscope, BookOpen, Building, CheckCircle2 } from 'lucide-react';

export interface GalleryItem {
  id: string;
  title: string;
  category: 'all' | 'sports' | 'lab' | 'classrooms' | 'campus';
  categoryLabel: string;
  imgUrl: string;
  aspectClass: string;
  caption: string;
  highlight: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'sports-meet',
    title: 'Inter-House Athletics & Sports Meet',
    category: 'sports',
    categoryLabel: 'Sports & Athletics',
    imgUrl: '/src/assets/images/kinship_sports_activities_1793324122866.jpg',
    aspectClass: 'aspect-[4/5]',
    caption: 'Students competing with discipline and teamwork in track events, mass drills, and team games on the campus sports grounds.',
    highlight: 'Annual Athletic Meet & Inter-House Championship',
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
  },
  {
    id: 'classroom-learning',
    title: 'Interactive Academic Classrooms',
    category: 'classrooms',
    categoryLabel: 'Classrooms',
    imgUrl: '/src/assets/images/kinship_classroom_learning_1793324121715.jpg',
    aspectClass: 'aspect-[4/3]',
    caption: 'Engaged discussion and concept-driven instruction from Preparatory to Class X with strict English language campus immersion.',
    highlight: '18:1 Student to Teacher Mentorship Ratio',
  },
  {
    id: 'campus-exterior',
    title: 'Tuibong Peaceful Hillside Campus',
    category: 'campus',
    categoryLabel: 'Campus & Hostel',
    imgUrl: '/src/assets/images/kinship_campus_new_1793392844714.jpg',
    aspectClass: 'aspect-[16/10]',
    caption: 'Set east of Tuibong Bazar in a calm, breeze-filled environment insulated from municipal traffic, conducive to deep learning.',
    highlight: '2.85 Acres Pucca Campus & Supervised Hostels',
  },
  {
    id: 'lab-demonstrations',
    title: 'Microscopy & Experimental Research',
    category: 'lab',
    categoryLabel: 'Science Laboratory',
    imgUrl: '/src/assets/images/kinship_science_lab_1793324122079.jpg',
    aspectClass: 'aspect-[1/1]',
    caption: 'Scientific curiosity stimulated through microscopic specimen study, reagent tests, and analytical mathematics.',
    highlight: 'Letter Marks Distinction Preparation',
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
  },
];

export const CampusLifeGallery: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'sports' | 'lab' | 'classrooms' | 'campus'>('all');
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  const filteredItems = selectedFilter === 'all' 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.category === selectedFilter);

  return (
    <div className="mt-16 pt-16 border-t border-slate-200 dark:border-slate-800">
      {/* Header */}
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
            A glimpse into everyday life at Kinship High School — exploring our modern science laboratories, energetic athletics on the sports fields, and engaging classrooms.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedFilter === 'all'
                ? 'bg-[#0c1760] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Moments
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

      {/* Masonry Grid Layout */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActivePhoto(item)}
            className="break-inside-avoid relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 group cursor-pointer transition-all duration-300 hover:-translate-y-1"
          >
            {/* Image */}
            <div className={`relative w-full ${item.aspectClass} overflow-hidden bg-slate-100 dark:bg-slate-900`}>
              <img
                src={item.imgUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
                loading="lazy"
                referrerPolicy="no-referrer"
              />

              {/* Top Category Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 backdrop-blur-md shadow-xs flex items-center gap-1.5 border border-slate-200/50 dark:border-slate-700/50">
                  {item.category === 'sports' && <Trophy className="w-3 h-3 text-amber-500" />}
                  {item.category === 'lab' && <Microscope className="w-3 h-3 text-blue-500" />}
                  {item.category === 'classrooms' && <BookOpen className="w-3 h-3 text-red-500" />}
                  {item.category === 'campus' && <Building className="w-3 h-3 text-emerald-500" />}
                  <span>{item.categoryLabel}</span>
                </span>
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
                <div className="pt-2 mt-2 border-t border-white/20 text-[10px] font-medium text-amber-400 flex items-center gap-1">
                  <span>Click to view full photograph</span>
                  <span>→</span>
                </div>
              </div>
            </div>

            {/* Static Bottom Caption for Mobile Accessibility / Non-hover */}
            <div className="p-4 bg-white dark:bg-slate-800/90 sm:hidden">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                {item.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {item.caption}
              </p>
            </div>
          </div>
        ))}
      </div>

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
