import React, { useState, useEffect } from 'react';
import { 
  Sun, Zap, Droplets, ShieldCheck, HeartPulse, Sparkles, 
  Wifi, Utensils, Bed, BookOpen, Clock, Award, Coffee, 
  BatteryCharging, Radio, Dumbbell, Plus, Trash2, CheckCircle2,
  AlertCircle, Lock, Layers, RefreshCw, X, Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  subscribeFacilityUpgrades, 
  addFacilityUpgrade, 
  deleteFacilityUpgrade, 
  FacilityUpgradeRecord 
} from '../services/schoolFirestore';

// Icon catalog mapping string to Lucide component
export const ICON_CATALOG: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  Sun: { label: 'Solar / Warmth', icon: Sun, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-950/60' },
  Zap: { label: 'Power & Generator', icon: Zap, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-950/60' },
  Droplets: { label: 'RO Water / Pure', icon: Droplets, color: 'text-cyan-500', bg: 'bg-cyan-100 dark:bg-cyan-950/60' },
  ShieldCheck: { label: 'Safety & CCTV', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-950/60' },
  HeartPulse: { label: 'Infirmary / Health', icon: HeartPulse, color: 'text-rose-500', bg: 'bg-rose-100 dark:bg-rose-950/60' },
  Sparkles: { label: 'Modern Upgrade', icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-950/60' },
  Wifi: { label: 'Digital Wi-Fi', icon: Wifi, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-950/60' },
  Utensils: { label: 'Mess / Nutrition', icon: Utensils, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-950/60' },
  Bed: { label: 'Dormitory / Bunk', icon: Bed, color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-950/60' },
  BookOpen: { label: 'Study Wing / Reading', icon: BookOpen, color: 'text-teal-500', bg: 'bg-teal-100 dark:bg-teal-950/60' },
  Clock: { label: 'Routine / Supervised', icon: Clock, color: 'text-sky-500', bg: 'bg-sky-100 dark:bg-sky-950/60' },
  Award: { label: 'Excellence / Standard', icon: Award, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-950/60' },
  Coffee: { label: 'Snack / Evening Tea', icon: Coffee, color: 'text-amber-700', bg: 'bg-amber-100 dark:bg-amber-950/60' },
  BatteryCharging: { label: 'Inverter Back-up', icon: BatteryCharging, color: 'text-lime-600', bg: 'bg-lime-100 dark:bg-lime-950/60' },
  Radio: { label: 'Public Address & Chime', icon: Radio, color: 'text-violet-500', bg: 'bg-violet-100 dark:bg-violet-950/60' },
  Dumbbell: { label: 'Fitness & Physical', icon: Dumbbell, color: 'text-pink-500', bg: 'bg-pink-100 dark:bg-pink-950/60' },
};

// Initial default facility upgrades representing Kinship High School campus standards
const DEFAULT_UPGRADES: Omit<FacilityUpgradeRecord, 'id'>[] = [
  {
    title: 'Solar-Powered Continuous Hot Water',
    category: 'Hostel Wing',
    description: 'Rooftop solar thermal heating panels supplying clean, hot water daily to all boys and girls residential bathroom blocks.',
    iconName: 'Sun',
    badgeText: 'Eco-Friendly 2026',
    authorEmail: 'boichung094@gmail.com'
  },
  {
    title: 'Dedicated Study Hall & 100% Inverter Backup',
    category: 'Study & Tech',
    description: 'Evening supervised prep sessions (6:00 PM – 8:30 PM) with uninterrupted LED illumination and silent study carrels.',
    iconName: 'Zap',
    badgeText: '24/7 Power',
    authorEmail: 'boichung094@gmail.com'
  },
  {
    title: 'Multi-Stage RO Pure Drinking Water Stations',
    category: 'Hygiene & Dining',
    description: 'Industrial reverse-osmosis purifiers with regular certified water testing stations installed across dining and hostel floors.',
    iconName: 'Droplets',
    badgeText: 'Pure & Certified',
    authorEmail: 'boichung094@gmail.com'
  },
  {
    title: 'Campus Perimeter CCTV & Biometric Dorm Gates',
    category: 'Safety & Health',
    description: '24/7 security recording across dorm gates and entrances with residential warden supervision and strict visitor pass verification.',
    iconName: 'ShieldCheck',
    badgeText: 'High Security',
    authorEmail: 'boichung094@gmail.com'
  },
  {
    title: 'Campus First-Aid Infirmary & Doctor On-Call',
    category: 'Safety & Health',
    description: 'Equipped medical rest room for unwell boarders with essential medicine stocks, emergency vehicle readiness, and doctor tie-up.',
    iconName: 'HeartPulse',
    badgeText: 'Nurse On-Site',
    authorEmail: 'boichung094@gmail.com'
  },
  {
    title: 'Indoor Table Tennis & Recreation Hall',
    category: 'Sports & Rec',
    description: 'Post-class recreation space featuring table tennis, carrom boards, chess, and outdoor badminton courts for weekend unwinding.',
    iconName: 'Dumbbell',
    badgeText: 'New Facility',
    authorEmail: 'boichung094@gmail.com'
  }
];

export function HostelFacilityUpgrades() {
  const { user, isAdmin } = useAuth();
  const [upgrades, setUpgrades] = useState<FacilityUpgradeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Modal State for Admin
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<FacilityUpgradeRecord['category']>('Hostel Wing');
  const [formDescription, setFormDescription] = useState('');
  const [formIconName, setFormIconName] = useState('Sun');
  const [formBadgeText, setFormBadgeText] = useState('New 2026');

  // Real-time subscription to Firestore
  useEffect(() => {
    const unsubscribe = subscribeFacilityUpgrades((items) => {
      setUpgrades(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleCreateUpgrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim()) {
      setErrorMsg('Please enter both title and description.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await addFacilityUpgrade({
        title: formTitle.trim(),
        category: formCategory,
        description: formDescription.trim(),
        iconName: formIconName,
        badgeText: formBadgeText.trim() || undefined,
        authorEmail: user?.email || 'admin@kinship',
      });

      setSuccessMsg('Facility upgrade highlight successfully published to the live grid!');
      setFormTitle('');
      setFormDescription('');
      setFormBadgeText('New 2026');
      setTimeout(() => {
        setIsAddModalOpen(false);
        setSuccessMsg(null);
      }, 1200);
    } catch (err: any) {
      console.error('Error adding facility upgrade:', err);
      setErrorMsg(err.message || 'Failed to save highlight to Firestore.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to remove "${title}" from the facility highlights?`)) {
      return;
    }
    try {
      await deleteFacilityUpgrade(id);
    } catch (err: any) {
      alert(`Failed to delete highlight: ${err.message}`);
    }
  };

  const handleSeedDefaults = async () => {
    if (!isAdmin) return;
    if (!window.confirm('Sync recommended campus facility upgrades to the live Firestore collection?')) return;
    setIsSubmitting(true);
    try {
      for (const item of DEFAULT_UPGRADES) {
        await addFacilityUpgrade({
          title: item.title,
          category: item.category,
          description: item.description,
          iconName: item.iconName,
          badgeText: item.badgeText,
          authorEmail: user?.email || 'admin@kinship',
        });
      }
      alert('Default facility highlights successfully saved to Firestore!');
    } catch (err: any) {
      alert(`Error initializing highlights: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine items to display: If live collection has items, use them; otherwise show default showcase
  const displayItems = upgrades.length > 0 
    ? upgrades 
    : DEFAULT_UPGRADES.map((d, idx) => ({ ...d, id: `default-${idx}` }));

  const categories = ['All', 'Hostel Wing', 'Hygiene & Dining', 'Study & Tech', 'Sports & Rec', 'Safety & Health'];

  const filteredItems = selectedCategory === 'All'
    ? displayItems
    : displayItems.filter(item => item.category === selectedCategory);

  return (
    <div className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-[#c8161d] dark:text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Facility Upgrades & Amenities</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold font-editorial text-[#0c1760] dark:text-white">
            Hostel & Campus Living Upgrades
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Continuously upgraded amenities ensuring boarding students thrive in safety, comfort, academic discipline, and wholesome community life.
          </p>
        </div>

        {/* Admin Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {isAdmin ? (
            <>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-[#c8161d] hover:bg-[#a51218] text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Add Feature Highlight</span>
              </button>
              {upgrades.length === 0 && (
                <button
                  type="button"
                  onClick={handleSeedDefaults}
                  disabled={isSubmitting}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-amber-500 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  title="Initialize sample upgrades into database"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-amber-500 ${isSubmitting ? 'animate-spin' : ''}`} />
                  <span>Sync Defaults to DB</span>
                </button>
              )}
            </>
          ) : (
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Admin login allows real-time facility additions</span>
            </div>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-8 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-[#0c1760] text-amber-300 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
        <span className="text-xs text-slate-400 ml-auto hidden sm:inline">
          Showing {filteredItems.length} {filteredItems.length === 1 ? 'amenity' : 'amenities'}
        </span>
      </div>

      {/* Dynamic Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const iconMeta = ICON_CATALOG[item.iconName] || ICON_CATALOG['Sparkles'];
          const IconComp = iconMeta.icon;
          const isLiveItem = !item.id.startsWith('default-');

          return (
            <div
              key={item.id}
              className="group relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 p-6 flex flex-col justify-between hover:shadow-xl hover:border-amber-400/60 dark:hover:border-amber-400/40 transition-all duration-300"
            >
              <div>
                {/* Card Top: Icon, Category & Badge */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconMeta.bg} ${iconMeta.color} shadow-xs group-hover:scale-105 transition-transform`}>
                    <IconComp className="w-6 h-6" />
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    {item.badgeText && (
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300/40">
                        {item.badgeText}
                      </span>
                    )}
                    <span className="text-[11px] font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h4 className="text-lg font-bold font-editorial text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-[#c8161d] dark:group-hover:text-amber-300 transition-colors">
                  {item.title}
                </h4>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              {/* Card Footer: Live Tag & Admin Delete */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{isLiveItem ? 'Live Verified Facility' : 'Verified Standard'}</span>
                </span>

                {isAdmin && isLiveItem && (
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.title)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                    title="Remove this feature highlight"
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
          <Layers className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No feature highlights in this category yet.</p>
          <button
            onClick={() => setSelectedCategory('All')}
            className="mt-3 text-xs font-bold text-[#c8161d] hover:underline"
          >
            Show All Amenities
          </button>
        </div>
      )}

      {/* Admin Feature Highlight Creation Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#c8161d] text-white flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    Add Facility Upgrade Highlight
                  </h3>
                  <p className="text-xs text-slate-500">
                    Showcase newly added amenities, hostel upgrades, or tech infrastructure
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
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

            <form onSubmit={handleCreateUpgrade} className="space-y-4 mt-4">
              {/* Feature Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Feature Title *
                </label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Solar Water Heating System, Fiber Wi-Fi Study Hub"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c8161d]"
                />
              </div>

              {/* Category & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as FacilityUpgradeRecord['category'])}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c8161d]"
                  >
                    <option value="Hostel Wing">Hostel Wing</option>
                    <option value="Hygiene & Dining">Hygiene & Dining</option>
                    <option value="Study & Tech">Study & Tech</option>
                    <option value="Sports & Rec">Sports & Rec</option>
                    <option value="Safety & Health">Safety & Health</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Highlight Badge Text (Optional)
                  </label>
                  <input
                    type="text"
                    maxLength={40}
                    value={formBadgeText}
                    onChange={(e) => setFormBadgeText(e.target.value)}
                    placeholder="e.g. Newly Added 2026, 24/7 Available"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c8161d]"
                  />
                </div>
              </div>

              {/* Icon Selector with Preview */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Select Visual Icon *
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 max-h-48 overflow-y-auto">
                  {Object.entries(ICON_CATALOG).map(([key, item]) => {
                    const Icon = item.icon;
                    const isSelected = formIconName === key;
                    return (
                      <button
                        type="button"
                        key={key}
                        onClick={() => setFormIconName(key)}
                        title={item.label}
                        className={`p-2.5 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                          isSelected
                            ? 'bg-[#0c1760] text-amber-300 ring-2 ring-amber-400 scale-105 shadow-md'
                            : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-[9px] truncate w-full text-center">{key}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Facility Details & Student Benefit *
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {formDescription.length}/500 chars
                  </span>
                </div>
                <textarea
                  required
                  rows={3}
                  maxLength={500}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Explain what was upgraded and how it enhances the daily life or safety of students..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c8161d]"
                />
              </div>

              {/* Live Preview Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
                  Grid Card Live Preview
                </span>
                <div className="flex items-start gap-3">
                  {(() => {
                    const activeMeta = ICON_CATALOG[formIconName] || ICON_CATALOG['Sparkles'];
                    const ActiveIcon = activeMeta.icon;
                    return (
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${activeMeta.bg} ${activeMeta.color}`}>
                        <ActiveIcon className="w-5 h-5" />
                      </div>
                    );
                  })()}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h5 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {formTitle || 'Sample Facility Title'}
                      </h5>
                      {formBadgeText && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                          {formBadgeText}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {formDescription || 'Preview of student benefit and amenity details...'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#c8161d] hover:bg-[#a51218] text-white text-xs font-bold shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving Highlight...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Publish Highlight to Grid</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
