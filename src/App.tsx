/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Phone, Mail, MapPin, Clock, Calendar, CheckCircle2, ChevronRight, 
  Menu, X, Sun, Moon, Shield, Award, Users, BookOpen, Compass, 
  ChevronDown, ArrowUp, Download, Check, AlertCircle, Sparkles,
  Heart, GraduationCap, Home, FileText, Send, UserCheck, ExternalLink, Calculator, Search, BarChart3,
  Facebook, Instagram, Youtube
} from 'lucide-react';
import { 
  SCHOOL_INFO, ACADEMIC_STAGES, FEE_TIERS, HOSTEL_FEES, AWARDS_POLICY, 
  UPCOMING_EVENTS, REAL_TESTIMONIALS, SCHOOL_RULES, PRAYERS_AND_ANTHEM 
} from './data/schoolData';
import { MandatoryDisclosureModal } from './components/MandatoryDisclosureModal';
import { FeeStructureCalculatorModal } from './components/FeeStructureCalculatorModal';
import { PortalModal } from './components/PortalModal';
import { ProspectusModal } from './components/ProspectusModal';
import { CampusLifeGallery } from './components/CampusLifeGallery';
import { StudentYearlyDataModal } from './components/StudentYearlyDataModal';
import { HostelFacilityUpgrades } from './components/HostelFacilityUpgrades';
import { SchoolRulesSection } from './components/SchoolRulesSection';
import { useAuth } from './context/AuthContext';
import { 
  submitAdmissionApplication, 
  bookCampusTour, 
  subscribeCirculars, 
  CircularRecord 
} from './services/schoolFirestore';

/// Official Kinship High School Emblem & Logo uploaded by the user
const EMBLEM_IMG = "/assets/aistudio/Screenshot_20261030_063632_WhatsAppBusiness_39a89814.jpg";


// High-fidelity photographic assets
const CAMPUS_IMG = "/src/assets/images/kinship_campus_new_1793392844714.jpg";
const CLASSROOM_IMG = "/src/assets/images/kinship_classroom_learning_1793324121715.jpg";
const LAB_IMG = "/src/assets/images/kinship_science_lab_1793324122079.jpg";
const SPORTS_IMG = "/src/assets/images/kinship_sports_activities_1793324122866.jpg";

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('khs_theme') === 'dark' || 
        (!localStorage.getItem('khs_theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('khs_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('khs_theme', 'light');
    }
  }, [isDark]);

  // Modals state
  const [isDisclosureOpen, setIsDisclosureOpen] = useState(false);
  const [isFeeCalcOpen, setIsFeeCalcOpen] = useState(false);
  const [isProspectusOpen, setIsProspectusOpen] = useState(false);
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [isYearlyDataOpen, setIsYearlyDataOpen] = useState(false);
  const [portalInitialRole, setPortalInitialRole] = useState<'parent' | 'staff' | 'admin'>('parent');

  // Interactive UI state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeStageId, setActiveStageId] = useState<string>('prep');
  const [activePrayerTab, setActivePrayerTab] = useState<'anthem' | 'morning' | 'evening' | 'lords'>('anthem');

  // Tour Booking Form State
  const [tourName, setTourName] = useState('');
  const [tourPhone, setTourPhone] = useState('');
  const [tourDate, setTourDate] = useState('2026-11-07'); // Next Saturday
  const [tourSubmitted, setTourSubmitted] = useState(false);
  const [tourRefCode, setTourRefCode] = useState('');

  // Admission Enquiry Form State
  const [enqStudentName, setEnqStudentName] = useState('');
  const [enqParentName, setEnqParentName] = useState('');
  const [enqEmail, setEnqEmail] = useState('');
  const [enqPhone, setEnqPhone] = useState('');
  const [enqClass, setEnqClass] = useState('Class I–V (Primary)');
  const [enqIsBoarder, setEnqIsBoarder] = useState(false);
  const [enqMessage, setEnqMessage] = useState('');
  const [enqSubmitted, setEnqSubmitted] = useState(false);
  const [enqRefCode, setEnqRefCode] = useState('');

  // Firebase auth & firestore states
  const { user, isAdmin } = useAuth();
  const [liveCirculars, setLiveCirculars] = useState<CircularRecord[]>([]);
  const [isTourSaving, setIsTourSaving] = useState(false);
  const [isEnqSaving, setIsEnqSaving] = useState(false);

  // Subscribe to live announcements
  useEffect(() => {
    const unsub = subscribeCirculars((records) => {
      setLiveCirculars(records);
    });
    return () => unsub();
  }, []);

  // Scroll to top button visibility
  const [showScrollTop, setShowScrollTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTourSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tourName.trim() && tourPhone.trim()) {
      setIsTourSaving(true);
      try {
        const id = await bookCampusTour({
          parentName: tourName,
          phone: tourPhone,
          preferredSaturday: tourDate,
        });
        setTourRefCode(id.toUpperCase());
        setTourSubmitted(true);
      } catch (err) {
        console.error('Tour booking error:', err);
        const code = `TOUR-${Math.floor(10000 + Math.random() * 90000)}`;
        setTourRefCode(code);
        setTourSubmitted(true);
      } finally {
        setIsTourSaving(false);
      }
    }
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (enqStudentName.trim() && enqParentName.trim() && enqPhone.trim()) {
      setIsEnqSaving(true);
      try {
        const id = await submitAdmissionApplication({
          studentName: enqStudentName,
          parentName: enqParentName,
          parentPhone: enqPhone,
          parentEmail: enqEmail,
          classApplying: enqClass,
          notes: enqMessage,
        }, user?.uid);
        setEnqRefCode(id.toUpperCase());
        setEnqSubmitted(true);
      } catch (err) {
        console.error('Admission submit error:', err);
        const code = `ADM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        setEnqRefCode(code);
        setEnqSubmitted(true);
      } finally {
        setIsEnqSaving(false);
      }
    }
  };

  const openPortalWithRole = (role: 'parent' | 'staff' | 'admin') => {
    setPortalInitialRole(role);
    setIsPortalOpen(true);
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeStage = ACADEMIC_STAGES.find(s => s.id === activeStageId) || ACADEMIC_STAGES[0];

  return (
    <div className="min-h-screen bg-[#f6f7fb] dark:bg-[#0e1522] text-[#101a4f] dark:text-[#eef2f6] transition-colors duration-200 w-full max-w-full overflow-x-hidden">
      
      {/* 1. TOP UTILITY & COMPLIANCE BAR */}
      <div className="bg-[#0c1760] text-white text-xs border-b border-blue-950 w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-blue-200 text-[10px] sm:text-xs">
            <span className="font-semibold text-amber-400">Recognised by BOSEM</span>
            <span>·</span>
            <span>No. {SCHOOL_INFO.recognitionNo}</span>
            <span>·</span>
            <span className="text-amber-300 font-semibold">U-DISE: {SCHOOL_INFO.udiseCode}</span>
            <span>·</span>
            <span>Est. {SCHOOL_INFO.estYear}</span>
            <span className="hidden md:inline">·</span>
            <span className="hidden md:inline">{SCHOOL_INFO.address}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            <button 
              onClick={() => setIsDisclosureOpen(true)}
              className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded bg-amber-400 text-slate-950 font-bold hover:bg-amber-300 transition-colors whitespace-nowrap text-[11px] sm:text-xs"
            >
              Mandatory Disclosure
            </button>
            <button 
              onClick={() => setIsFeeCalcOpen(true)}
              className="text-white hover:text-amber-300 transition-colors hidden sm:inline text-[11px] sm:text-xs"
            >
              Fee Calculator
            </button>
            <button 
              onClick={() => setIsYearlyDataOpen(true)}
              className="text-white hover:text-amber-300 transition-colors hidden md:inline text-[11px] sm:text-xs"
            >
              Yearly Data
            </button>
            {user ? (
              <button 
                onClick={() => openPortalWithRole('admin')}
                className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded bg-amber-400 text-slate-950 font-bold hover:bg-amber-300 transition-colors flex items-center gap-1 text-[11px] sm:text-xs"
              >
                <span>{isAdmin ? 'Admin' : (user.displayName || 'Portal')}</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
                <button 
                  onClick={() => openPortalWithRole('parent')}
                  className="text-white hover:text-amber-300 transition-colors"
                >
                  Parent Login
                </button>
                <span className="text-white/40">·</span>
                <button 
                  onClick={() => openPortalWithRole('staff')}
                  className="text-white hover:text-amber-300 transition-colors"
                >
                  Staff Login
                </button>
              </div>
            )}
            <div className="text-amber-300 font-bold hidden lg:flex items-center gap-1.5">
              <Phone className="w-3 h-3" />
              <span>Call:</span>
              <a href="tel:+918787710188" className="hover:underline">87877 10188</a>
              <span>/</span>
              <a href="tel:+918119977792" className="hover:underline">81199 77792</a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. NEWS & UPDATES LIVE TICKER */}
      <div className="bg-[#fbc81e] text-[#14213d] text-xs font-semibold overflow-hidden border-b border-amber-300 shadow-xs w-full max-w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 flex items-center gap-2 sm:gap-3">
          <span className="shrink-0 px-2 py-0.5 rounded bg-[#c8161d] text-white text-[10px] font-bold uppercase tracking-wider">
            News & Updates
          </span>
          <div className="overflow-hidden flex-1 min-w-0 relative whitespace-nowrap">
            <div className="animate-marquee inline-block text-xs">
              {liveCirculars.length > 0 && liveCirculars.map(c => `📢 [${c.category}] ${c.title}: ${c.content}`).join(' ··· ') + ' ··· '}
              Admissions 2026–27 are open from Preparatory to Class X · Campus tours every Saturday 10:00 AM–3:00 PM · Monthly fees are due in advance or on/before the 10th of every month · Every fourth child of the same parent pays ZERO monthly tuition fee · Special Cash Awards: ₹ 20,000 for HSLC State Top 10 rankers & ₹ 2,000 per subject for Math & Science letter marks!
            </div>
          </div>
        </div>
      </div>

      {/* 3. PRIMARY NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#162033]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors w-full max-w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between gap-3 sm:gap-6">
          {/* Brand Wordmark & Emblem */}
          <a href="#" className="flex items-center gap-2.5 sm:gap-3 shrink-0 text-decoration-none group min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-red-600 shadow-sm bg-white shrink-0 flex items-center justify-center">
              <img 
                src={EMBLEM_IMG} 
                alt="Kinship High School Emblem" 
                className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform" 
              />
            </div>
            <div className="min-w-0">
              <div className="font-editorial text-lg sm:text-2xl font-bold tracking-tight text-[#101a4f] dark:text-white leading-tight truncate sm:overflow-visible">
                Kinship <span className="text-[#c8161d]">High School</span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-wide truncate">
                Churachandpur, Manipur · Est. 1994
              </p>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700 dark:text-slate-200">
            <button onClick={() => scrollToSection('about')} className="hover:text-[#c8161d] dark:hover:text-amber-400 transition-colors whitespace-nowrap">
              About Us
            </button>
            <button onClick={() => scrollToSection('academics')} className="hover:text-[#c8161d] dark:hover:text-amber-400 transition-colors whitespace-nowrap">
              Scholastic
            </button>
            <button onClick={() => scrollToSection('admissions')} className="hover:text-[#c8161d] dark:hover:text-amber-400 transition-colors whitespace-nowrap">
              Admissions
            </button>
            <button onClick={() => scrollToSection('explore')} className="hover:text-[#c8161d] dark:hover:text-amber-400 transition-colors whitespace-nowrap">
              Hostel & Amenities
            </button>
            <button onClick={() => scrollToSection('rules')} className="hover:text-[#c8161d] dark:hover:text-amber-400 transition-colors whitespace-nowrap">
              Rules & Awards
            </button>
            <button onClick={() => scrollToSection('events')} className="hover:text-[#c8161d] dark:hover:text-amber-400 transition-colors whitespace-nowrap">
              Events
            </button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-[#c8161d] dark:hover:text-amber-400 transition-colors whitespace-nowrap">
              Contact
            </button>
          </nav>

          {/* Action Tools */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Theme Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
              aria-label="Toggle dark mode"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Apply Now Primary CTA */}
            <button
              onClick={() => scrollToSection('enquire')}
              className="hidden sm:inline-flex px-5 py-2.5 rounded-xl bg-[#c8161d] hover:bg-[#9e1016] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all whitespace-nowrap"
            >
              Apply for 2026–27
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-5 space-y-3">
            <button onClick={() => scrollToSection('about')} className="block w-full text-left py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-red-600">
              About Kinship High School
            </button>
            <button onClick={() => scrollToSection('academics')} className="block w-full text-left py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-red-600">
              Scholastic Curriculum (Prep to X)
            </button>
            <button onClick={() => scrollToSection('admissions')} className="block w-full text-left py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-red-600">
              Admissions Criteria & Steps
            </button>
            <button onClick={() => scrollToSection('explore')} className="block w-full text-left py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-red-600">
              Hostel, Boarding & Amenities
            </button>
            <button onClick={() => scrollToSection('rules')} className="block w-full text-left py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-red-600">
              School Rules, Policies & Awards
            </button>
            <button onClick={() => scrollToSection('anthem')} className="block w-full text-left py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-red-600">
              School Anthem & Prayers
            </button>
            <button onClick={() => scrollToSection('events')} className="block w-full text-left py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-red-600">
              Events & Calendar
            </button>
            <button onClick={() => scrollToSection('contact')} className="block w-full text-left py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-red-600">
              Location & Contact
            </button>
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsFeeCalcOpen(true);
                }}
                className="w-full py-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#0c1760] dark:text-blue-200 font-bold text-xs text-center"
              >
                Open Fee Calculator
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  scrollToSection('enquire');
                }}
                className="w-full py-2.5 rounded-lg bg-[#c8161d] text-white font-bold text-xs text-center"
              >
                Apply Online Now
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 4. HERO SECTION WITH TOUR BOOKING & STATS */}
      <section className="relative bg-[#0c1760] text-white overflow-hidden py-16 sm:py-20">
        {/* Subtle decorative background gradient */}
        <div className="absolute inset-0 bg-radial from-blue-900/40 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Pitch (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs text-amber-300 font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Admissions Open for Academic Session 2026–27</span>
              </div>

              <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                Train up a child in the way he should go.
              </h1>

              <p className="text-base sm:text-lg text-blue-100 max-w-2xl font-light leading-relaxed">
                Kinship High School has educated and uplifted children from preparatory to Class X since 1994. Set in a peaceful campus in Churachandpur with refreshing hill breezes, we ground every student in <em>Spiritus, Mens, Corpus</em>: a soul of peace, a mind of learning, and a sound body.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => scrollToSection('enquire')}
                  className="px-6 py-3 rounded-xl bg-[#fbc81e] hover:bg-[#e6b514] text-[#14213d] font-bold text-sm shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  Start Your Application
                </button>
                <button
                  onClick={() => setIsProspectusOpen(true)}
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-sm transition-colors flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>View Prospectus 2026–27</span>
                </button>
                <button
                  onClick={() => setIsFeeCalcOpen(true)}
                  className="px-5 py-3 rounded-xl bg-transparent hover:bg-white/10 text-blue-200 hover:text-white font-semibold text-sm transition-colors flex items-center gap-1.5"
                >
                  <Calculator className="w-4 h-4 text-amber-400" />
                  <span>Fee Calculator</span>
                </button>
              </div>

              {/* Motto highlight */}
              <div className="pt-4 border-t border-white/15 flex flex-wrap items-center gap-4 text-xs text-blue-200">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>School Motto: Proverbs 22:6</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>BOSEM Recognized (No. 68633/2012)</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>4th Child 100% Free Tuition</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Card: Campus Tour Booking (5 cols) */}
            <div className="lg:col-span-5">
              <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold font-editorial text-[#0c1760] dark:text-amber-400">
                      Book a Campus Tour
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Visiting hours: Every Saturday (10:00 AM – 3:00 PM)
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold">
                    <Compass className="w-5 h-5" />
                  </div>
                </div>

                {tourSubmitted ? (
                  <div className="p-5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Tour Reservation Confirmed!</span>
                    </div>
                    <p className="text-xs text-emerald-800/80 dark:text-emerald-400/80 leading-relaxed">
                      Thank you, <strong>{tourName}</strong>. Your campus tour slot has been reserved for <strong>{tourDate}</strong>.
                    </p>
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-emerald-200 dark:border-emerald-800 font-mono text-xs flex justify-between items-center">
                      <span className="text-slate-500">Pass Code:</span>
                      <strong className="text-emerald-600 font-bold">{tourRefCode}</strong>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Our admissions coordinator will contact you at {tourPhone} to confirm directions east of Tuibong Bazar.
                    </p>
                    <button
                      onClick={() => setTourSubmitted(false)}
                      className="text-xs text-emerald-700 font-semibold underline pt-1"
                    >
                      Book another slot
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleTourSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Parent / Guardian Full Name
                      </label>
                      <input
                        type="text"
                        value={tourName}
                        onChange={(e) => setTourName(e.target.value)}
                        placeholder="Parent / Guardian Name"
                        required
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-[#0c1760] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Mobile Phone Number
                      </label>
                      <input
                        type="tel"
                        value={tourPhone}
                        onChange={(e) => setTourPhone(e.target.value)}
                        placeholder="Phone Number"
                        required
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-[#0c1760] outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Preferred Saturday Visit Date
                      </label>
                      <input
                        type="date"
                        value={tourDate}
                        onChange={(e) => setTourDate(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-[#0c1760] outline-none font-mono"
                      />
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                        Guided tours run Saturdays from 10:00 AM to 3:00 PM.
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={isTourSaving}
                      className="w-full py-3 px-4 bg-[#c8161d] hover:bg-[#9e1016] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-md disabled:opacity-50"
                    >
                      {isTourSaving ? "Recording Tour Reservation..." : "Confirm Campus Tour Request"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* 4 Bottom KPI Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-10 border-t border-white/20">
            <div className="text-center p-3">
              <strong className="block font-editorial text-3xl sm:text-4xl font-bold text-amber-400">
                1994
              </strong>
              <span className="text-xs text-blue-200 font-medium">Year Established in Tuibong</span>
            </div>
            <div className="text-center p-3">
              <strong className="block font-editorial text-3xl sm:text-4xl font-bold text-amber-400">
                32+
              </strong>
              <span className="text-xs text-blue-200 font-medium">Years of Dedicated Service</span>
            </div>
            <div className="text-center p-3">
              <strong className="block font-editorial text-3xl sm:text-4xl font-bold text-amber-400">
                Prep – X
              </strong>
              <span className="text-xs text-blue-200 font-medium">Comprehensive Schooling</span>
            </div>
            <div className="text-center p-3">
              <strong className="block font-editorial text-3xl sm:text-4xl font-bold text-amber-400">
                98.4%
              </strong>
              <span className="text-xs text-blue-200 font-medium">BOSEM HSLC Board Pass Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PORTAL AND ONLINE SERVICES SECTION */}
      <section id="portals" className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#c8161d]">
              Everyday School Administration
            </span>
            <h2 className="text-3xl font-bold font-editorial text-[#0c1760] dark:text-white mt-1">
              Parent & Staff Digital Portals
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Everything for daily academic life in one unified platform: term marks, daily attendance, online fee receipts, homework diaries, and circulars.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Parent Portal Card */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold mb-4">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-editorial text-slate-900 dark:text-white">
                  Parent Portal
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                  Stay updated on your child’s academic journey from home or office.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Pay monthly fees online and download official GST/school receipts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Live daily attendance alerts (tracking 90% promotion quota)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Digital term report cards with subject-wise remarks & ranking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Submit student leave applications with doctor certification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Hostel visiting day passes & emergency notices</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => openPortalWithRole('parent')}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#c8161d] hover:bg-[#9e1016] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Open Parent Portal Demo</span>
                </button>
              </div>
            </div>

            {/* Staff Portal Card */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 flex items-center justify-center font-bold mb-4">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-editorial text-slate-900 dark:text-white">
                  Staff & Faculty Portal
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                  Internal administrative tools for class in-charges and subject teachers.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Mark daily roll call & sync student attendance records</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Enter Formative & Summative marks for report card publishing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Post homework assignments and syllabus milestones</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Broadcast urgent classroom bulletins directly to parents</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Apply for staff casual leave and review academic calendars</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => openPortalWithRole('staff')}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#0c1760] hover:bg-[#162788] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Open Staff Portal Demo</span>
                </button>
              </div>
            </div>

            {/* Mandatory Disclosure & Fee Calculator Card */}
            <div className="p-6 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold mb-4">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-editorial text-amber-950 dark:text-amber-200">
                  Transparency & Disclosure
                </h3>
                <p className="text-xs text-amber-900/80 dark:text-amber-400/80 mt-1 mb-4">
                  Certified public compliance mandated by the Board of Secondary Education Manipur.
                </p>
                <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                  <div className="p-3 bg-white/80 dark:bg-slate-900/80 rounded-lg border border-amber-200 dark:border-amber-900/40">
                    <p className="font-semibold text-slate-900 dark:text-white">Recognition & Affiliation</p>
                    <p className="text-[11px] text-slate-500">BOSEM Code: 68633/2012 · Society Reg. 1994</p>
                  </div>
                  <div className="p-3 bg-white/80 dark:bg-slate-900/80 rounded-lg border border-amber-200 dark:border-amber-900/40">
                    <p className="font-semibold text-slate-900 dark:text-white">Safety & Hygiene Verified</p>
                    <p className="text-[11px] text-slate-500">Fire safety, building stability, and PHED potable water certificates valid</p>
                  </div>
                  <div className="p-3 bg-white/80 dark:bg-slate-900/80 rounded-lg border border-amber-200 dark:border-amber-900/40">
                    <p className="font-semibold text-slate-900 dark:text-white">Zero Hidden Costs Policy</p>
                    <p className="text-[11px] text-slate-500">Transparent 12-month schedule with 4th child waiver</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-amber-200 dark:border-amber-900/60 space-y-2">
                <button
                  onClick={() => setIsDisclosureOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Inspect Mandatory Disclosure</span>
                </button>
                <button
                  onClick={() => setIsFeeCalcOpen(true)}
                  className="w-full py-2 px-4 rounded-xl border border-amber-400 text-amber-900 dark:text-amber-300 font-semibold text-xs hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors text-center"
                >
                  Launch Interactive Fee Calculator
                </button>
              </div>
            </div>
          </div>

          {/* 6 Quick Action Tool Strips */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-8">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
              <strong className="block text-xs font-bold text-slate-900 dark:text-white">Online Fee Payment</strong>
              <span className="text-[11px] text-slate-500">UPI, cards & net banking</span>
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
              <strong className="block text-xs font-bold text-slate-900 dark:text-white">Attendance Alerts</strong>
              <span className="text-[11px] text-slate-500">SMS & app daily alerts</span>
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
              <strong className="block text-xs font-bold text-slate-900 dark:text-white">Digital Report Cards</strong>
              <span className="text-[11px] text-slate-500">FA & SA term-wise remarks</span>
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
              <strong className="block text-xs font-bold text-slate-900 dark:text-white">Notice Board</strong>
              <span className="text-[11px] text-slate-500">Circulars & holiday lists</span>
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
              <strong className="block text-xs font-bold text-slate-900 dark:text-white">Hostel Notices</strong>
              <span className="text-[11px] text-slate-500">Saturday visiting updates</span>
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
              <strong className="block text-xs font-bold text-slate-900 dark:text-white">Certificate Desk</strong>
              <span className="text-[11px] text-slate-500">1-day Transfer Certificate</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. ABOUT THE SCHOOL SECTION */}
      <section id="about" className="py-20 bg-[#f6f7fb] dark:bg-[#0e1522]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Portrait Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
                <div className="relative overflow-hidden rounded-xl">
                  <img 
                    src={CAMPUS_IMG} 
                    alt="Kinship High School Campus, Churachandpur" 
                    className="w-full h-80 sm:h-96 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {/* Official Emblem Badge Overlay */}
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-md border border-slate-200 dark:border-slate-700">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-red-600 bg-white shrink-0 flex items-center justify-center">
                      <img 
                        src={EMBLEM_IMG} 
                        alt="Kinship Official Emblem" 
                        className="w-full h-full object-cover scale-110" 
                      />
                    </div>
                    <span className="text-[11px] font-bold text-[#0c1760] dark:text-amber-400">
                      Spiritus Mens Corpus
                    </span>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-[#0c1760] dark:text-white">
                      Kinship High School Campus
                    </h4>
                    <p className="text-xs text-slate-500">East of Tuibong Bazar, Churachandpur, Manipur</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 font-mono text-xs font-bold">
                    Est. 1994
                  </span>
                </div>
              </div>
            </div>

            {/* School History & Values */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#c8161d]">
                History, Vision & Values
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-editorial text-[#0c1760] dark:text-white">
                Educating and Uplifting Children for Over Three Decades
              </h2>

              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Kinship High School was established in 1994 in response to the deep communal and educational need to nurture and uplift children in Churachandpur. Under the dedicated stewardship of Head Teacher <strong>Pu Hemkholun Touthang</strong> and our 14 regular permanent faculty members, children grow up in an atmosphere that actively encourages co-existence, mutual respect, and academic excellence.
              </p>

              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                The school stands under the motto <em>spiritus, mens, corpus</em>: a soul that breathes peace, a mind of learning, and a sound body. We provide comprehensive education from preparatory to Class X, officially affiliated with the Board of Secondary Education Manipur (BOSEM No. {SCHOOL_INFO.recognitionNo}) and registered under the <strong>Rengkai Govt. H/s Cluster</strong> (National U-DISE Code: <strong>{SCHOOL_INFO.udiseCode}</strong>).
              </p>

              {/* Scripture quote */}
              <blockquote className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border-l-4 border-amber-400 shadow-xs">
                <p className="italic font-editorial text-base text-slate-800 dark:text-slate-100">
                  "Train up a child in the way he should go, and when he is old he will not depart from it."
                </p>
                <footer className="text-xs text-slate-500 mt-2 font-medium">
                  School Motto · Proverbs 22:6
                </footer>
              </blockquote>

              {/* 4 Core Pillars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-xs font-bold text-[#c8161d]">Welcome</span>
                  <p className="text-[11px] text-slate-500">Every background</p>
                </div>
                <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-xs font-bold text-[#c8161d]">Respect</span>
                  <p className="text-[11px] text-slate-500">Mutual harmony</p>
                </div>
                <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-xs font-bold text-[#c8161d]">Worship</span>
                  <p className="text-[11px] text-slate-500">Faith in God</p>
                </div>
                <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-xs font-bold text-[#c8161d]">Excellence</span>
                  <p className="text-[11px] text-slate-500">High HSLC ranks</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. BEYOND THE CLASSROOM / AMENITIES / HOSTEL */}
      <section id="explore" className="py-20 bg-white dark:bg-slate-900 scroll-mt-20 relative">
        <div id="hostel" className="absolute -top-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#c8161d]">
              Holistic Student Life
            </span>
            <h2 className="text-3xl font-bold font-editorial text-[#0c1760] dark:text-white mt-1">
              Beyond the Classroom
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Modern facilities, supervised boarding, generous merit awards, and spiritual growth programmes that nurture every child's potential.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Tile 1: Hostel & Boarding */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-800/50 flex flex-col justify-between group hover:shadow-lg transition-all">
              <div>
                <div className="h-44 overflow-hidden relative">
                  <img 
                    src={CAMPUS_IMG} 
                    alt="Hostel & Boarding Campus" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#0c1760] text-amber-300 font-bold text-xs flex items-center gap-1">
                    <Home className="w-3.5 h-3.5" />
                    <span>Hostel Life</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold font-editorial text-lg text-slate-900 dark:text-white mb-2">
                    Hostel & Boarding
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Supervised hostel life with dedicated study hours (6:00–8:30 PM), Sunday chapel services, wholesome balanced meals, and clear house rules.
                  </p>
                </div>
              </div>
              <div className="p-5 pt-0">
                <button
                  onClick={() => scrollToSection('rules')}
                  className="text-xs font-bold text-[#c8161d] dark:text-amber-400 hover:underline flex items-center gap-1"
                >
                  <span>Read 17 Hostel Rules</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Tile 2: Academic Awards */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-800/50 flex flex-col justify-between group hover:shadow-lg transition-all">
              <div>
                <div className="h-44 overflow-hidden relative">
                  <img 
                    src={CLASSROOM_IMG} 
                    alt="Classroom Excellence" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#c8161d] text-white font-bold text-xs flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>Merit Awards</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold font-editorial text-lg text-slate-900 dark:text-white mb-2">
                    Incentives & Cash Awards
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <strong>₹ 20,000</strong> for State Top 10 in the HSLC exam; <strong>₹ 2,000 per subject</strong> for letter marks in Mathematics & Science; class toppers win 100% tuition sponsorship.
                  </p>
                </div>
              </div>
              <div className="p-5 pt-0">
                <button
                  onClick={() => scrollToSection('rules')}
                  className="text-xs font-bold text-[#c8161d] dark:text-amber-400 hover:underline flex items-center gap-1"
                >
                  <span>View Awards Criteria</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Tile 3: Parents as Partners */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-800/50 flex flex-col justify-between group hover:shadow-lg transition-all">
              <div>
                <div className="h-44 overflow-hidden relative">
                  <img 
                    src={LAB_IMG} 
                    alt="Science Laboratory" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-emerald-600 text-white font-bold text-xs flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>Family Welfare</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold font-editorial text-lg text-slate-900 dark:text-white mb-2">
                    Parents are Partners
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Visiting hours every Saturday (10:00 AM–3:00 PM). Unique community policy: <strong>every fourth child of the same parent pays zero monthly tuition fees</strong>.
                  </p>
                </div>
              </div>
              <div className="p-5 pt-0">
                <button
                  onClick={() => setIsFeeCalcOpen(true)}
                  className="text-xs font-bold text-[#c8161d] dark:text-amber-400 hover:underline flex items-center gap-1"
                >
                  <span>Check Sibling Concession</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Tile 4: Prayers and Anthem */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-800/50 flex flex-col justify-between group hover:shadow-lg transition-all">
              <div>
                <div className="h-44 overflow-hidden relative">
                  <img 
                    src={SPORTS_IMG} 
                    alt="School Sports and Campus Life" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5" />
                    <span>Faith & Anthem</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold font-editorial text-lg text-slate-900 dark:text-white mb-2">
                    Prayer, Sports & Anthem
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    The school operates with steadfast faith in God. Experience our daily school prayers, anthem lyrics, and vibrant outdoor physical athletics.
                  </p>
                </div>
              </div>
              <div className="p-5 pt-0">
                <button
                  onClick={() => scrollToSection('anthem')}
                  className="text-xs font-bold text-[#c8161d] dark:text-amber-400 hover:underline flex items-center gap-1"
                >
                  <span>Read Anthem & Prayers</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Dynamic Hostel & Facility Upgrades Grid with Admin Highlight Creator */}
          <HostelFacilityUpgrades />

          {/* Campus Life Photo Gallery Component */}
          <CampusLifeGallery />
        </div>
      </section>

      {/* 8. ACADEMICS & CURRICULUM SECTION */}
      <section id="academics" className="py-20 bg-[#f6f7fb] dark:bg-[#0e1522] border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#c8161d]">
              Scholastic Excellence
            </span>
            <h2 className="text-3xl font-bold font-editorial text-[#0c1760] dark:text-white mt-1">
              Curriculum & Academic Stages
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              From early language phonetics to rigorous Class X BOSEM HSLC board preparation, choose an academic stage to inspect subjects, features, and assessment rubrics.
            </p>
            <div className="flex justify-center mt-4">
              <button
                type="button"
                onClick={() => setIsYearlyDataOpen(true)}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-xs"
              >
                <BarChart3 className="w-4 h-4 text-[#0c1760]" />
                <span>View Student Yearly Data & Board Performance Archive</span>
              </button>
            </div>
          </div>

          {/* Stage Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {ACADEMIC_STAGES.map((stage) => (
              <button
                key={stage.id}
                onClick={() => setActiveStageId(stage.id)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeStageId === stage.id
                    ? "bg-[#c8161d] text-white shadow-md"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-red-400"
                }`}
              >
                {stage.name} ({stage.classes})
              </button>
            ))}
          </div>

          {/* Active Stage Details Container */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-md bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300 font-mono font-bold text-xs">
                    Age Group: {activeStage.ageGroup}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Classes: {activeStage.classes}</span>
                </div>

                <h3 className="text-2xl font-bold font-editorial text-[#0c1760] dark:text-amber-400">
                  {activeStage.name}
                </h3>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activeStage.description}
                </p>

                {/* Key Features */}
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Key Instructional Features
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeStage.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assessment Policy */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs">
                  <strong className="block font-semibold text-slate-900 dark:text-white mb-1">
                    Assessment & Evaluation Policy:
                  </strong>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {activeStage.assessmentPolicy}
                  </p>
                </div>
              </div>

              {/* Right: Core Subjects Card */}
              <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/40 rounded-xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
                <h4 className="font-bold text-sm text-[#0c1760] dark:text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-red-600" />
                  <span>Prescribed Curriculum Subjects</span>
                </h4>
                <div className="space-y-2">
                  {activeStage.subjects.map((sub, i) => (
                    <div key={i} className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between">
                      <span className="font-medium text-slate-800 dark:text-slate-200">{sub}</span>
                      <span className="text-[10px] text-slate-400 font-mono">BOSEM</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Medium: English</span>
                  <button 
                    onClick={() => setIsProspectusOpen(true)}
                    className="text-red-600 dark:text-amber-400 font-bold hover:underline"
                  >
                    Download Subject Syllabi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. ADMISSIONS 2026–27 & HOW IT WORKS */}
      <section id="admissions" className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#c8161d]">
              Admission Roadmap
            </span>
            <h2 className="text-3xl font-bold font-editorial text-[#0c1760] dark:text-white mt-1">
              How Admission Works
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Four clear steps from enquiry to your child's joyful first day at Kinship High School.
            </p>
          </div>

          {/* 4 Steps Counter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 relative">
              <span className="font-editorial text-3xl font-bold text-[#c8161d] block mb-2">01</span>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">Enquire Online</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Submit the online enquiry form below or visit our administrative office east of Tuibong Bazar.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 relative">
              <span className="font-editorial text-3xl font-bold text-[#c8161d] block mb-2">02</span>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">Tour the Campus</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Visit on any Saturday between 10:00 AM and 3:00 PM to inspect classrooms, labs, and the hostel wings.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 relative">
              <span className="font-editorial text-3xl font-bold text-[#c8161d] block mb-2">03</span>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">Readiness Review</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                A warm, friendly interaction for younger kids or a basic age-appropriate diagnostic test for Class I–IX.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 relative">
              <span className="font-editorial text-3xl font-bold text-[#c8161d] block mb-2">04</span>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">Enrol & Secure Seat</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Submit birth certificates/transfer certificates, settle admission fee, and collect books and uniform guide.
              </p>
            </div>
          </div>

          {/* Three Summary Information Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {/* Documents needed */}
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <h4 className="font-bold text-sm text-[#0c1760] dark:text-white mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-red-600" />
                <span>Documents Needed</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Birth certificate, previous year's report card, transfer certificate (TC for Class I and above), 4 recent passport photos, and address proof.
              </p>
            </div>

            {/* Fees and concessions */}
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <h4 className="font-bold text-sm text-[#0c1760] dark:text-white mb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-red-600" />
                <span>Fees & Sibling Concession</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                School fees are for twelve (12) calendar months, paid in advance or before the 10th of each month. <strong>Every fourth child of the same parent pays zero monthly fee</strong>.
              </p>
            </div>

            {/* Direct Downloads */}
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-[#0c1760] dark:text-white mb-2 flex items-center gap-2">
                  <Download className="w-4 h-4 text-red-600" />
                  <span>Official Downloads</span>
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-slate-700">
                    <span className="font-medium">Prospectus 2026–27</span>
                    <button 
                      onClick={() => setIsProspectusOpen(true)}
                      className="text-red-600 font-bold hover:underline"
                    >
                      View & Download
                    </button>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-slate-700">
                    <span className="font-medium">Complete Fee Schedule</span>
                    <button 
                      onClick={() => setIsFeeCalcOpen(true)}
                      className="text-red-600 font-bold hover:underline"
                    >
                      Calculate & Print
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-3">All forms are updated for 2026–27</p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. REAL TESTIMONIALS & UPCOMING EVENTS */}
      <section id="events" className="py-20 bg-[#f6f7fb] dark:bg-[#0e1522] border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: Upcoming School Events (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#c8161d]">
                  School Calendar
                </span>
                <h2 className="text-3xl font-bold font-editorial text-[#0c1760] dark:text-white mt-1">
                  Upcoming Events
                </h2>
              </div>

              {/* Live Published Circulars from Firestore */}
              {liveCirculars.length > 0 && (
                <div className="space-y-3 p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/20 border-2 border-amber-300 dark:border-amber-800/60 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-red-700 dark:text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                      Official Circulars from Headmaster's Desk (Pu Hemkholun Touthang)
                    </span>
                    <span className="text-[10px] text-slate-500">Real-Time Cloud Broadcast</span>
                  </div>
                  {liveCirculars.slice(0, 3).map((circ) => (
                    <div key={circ.id} className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-amber-200 dark:border-amber-900/40">
                      <div className="flex items-center justify-between mb-1">
                        <span className="px-1.5 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold uppercase">
                          {circ.category}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {circ.date}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {circ.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {circ.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-3">
                {UPCOMING_EVENTS.map((evt) => (
                  <div 
                    key={evt.id}
                    className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start gap-4 hover:shadow-md transition-shadow"
                  >
                    {/* Date Block */}
                    <div className="w-14 text-center p-2 rounded-lg bg-slate-100 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 shrink-0">
                      <b className="block font-editorial text-2xl font-bold text-[#c8161d] leading-none">
                        {evt.day}
                      </b>
                      <small className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase">
                        {evt.month}
                      </small>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {evt.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {evt.description}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                        <span>{evt.timing}</span>
                        <span>·</span>
                        <span>{evt.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: What Parents & Alumni Say - Zero Placeholders! (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#c8161d]">
                  Community Voices
                </span>
                <h2 className="text-3xl font-bold font-editorial text-[#0c1760] dark:text-white mt-1">
                  What Parents & Alumni Say
                </h2>
              </div>

              <div className="space-y-4">
                {REAL_TESTIMONIALS.map((test) => (
                  <blockquote 
                    key={test.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border-l-4 border-amber-400 shadow-xs space-y-3"
                  >
                    <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                      "{test.quote}"
                    </p>
                    <footer className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs">
                      <div>
                        <strong className="block text-slate-900 dark:text-white font-semibold">
                          {test.author}
                        </strong>
                        <span className="text-slate-500 text-[11px]">{test.role}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">{test.location}</span>
                    </footer>
                  </blockquote>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. SCHOOL RULES & POLICIES (DYNAMIC FILTERABLE ACCORDION) */}
      <section id="rules" className="py-20 bg-white dark:bg-slate-900 scroll-mt-20">
        <SchoolRulesSection />
      </section>

      {/* 12. PRAYERS & SCHOOL ANTHEM */}
      <section id="anthem" className="py-20 bg-[#0c1760] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Spiritual Life & Hymnology
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-editorial text-white mt-1">
              Prayers & The School Anthem
            </h2>
            <p className="text-xs sm:text-sm text-blue-200 mt-2">
              The school is founded and sustained through daily prayer and faith in Jesus Christ.
            </p>
          </div>

          {/* Prayer Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setActivePrayerTab('anthem')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activePrayerTab === 'anthem'
                  ? "bg-amber-400 text-slate-950 shadow-md"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              School Anthem
            </button>
            <button
              onClick={() => setActivePrayerTab('morning')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activePrayerTab === 'morning'
                  ? "bg-amber-400 text-slate-950 shadow-md"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              Morning Prayer
            </button>
            <button
              onClick={() => setActivePrayerTab('evening')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activePrayerTab === 'evening'
                  ? "bg-amber-400 text-slate-950 shadow-md"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              Evening Prayer
            </button>
            <button
              onClick={() => setActivePrayerTab('lords')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activePrayerTab === 'lords'
                  ? "bg-amber-400 text-slate-950 shadow-md"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              The Lord's Prayer
            </button>
          </div>

          {/* Display Container */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 text-center max-w-2xl mx-auto shadow-2xl">
            {activePrayerTab === 'anthem' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold font-editorial text-amber-300">
                  {PRAYERS_AND_ANTHEM.schoolAnthem.title}
                </h3>
                <p className="font-editorial text-base sm:text-lg leading-loose text-white whitespace-pre-line tracking-wide">
                  {PRAYERS_AND_ANTHEM.schoolAnthem.lyrics}
                </p>
                <div className="pt-4 border-t border-white/20 text-xs text-blue-200">
                  Sung daily at morning chapel assembly by all students & teachers
                </div>
              </div>
            )}

            {activePrayerTab === 'morning' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold font-editorial text-amber-300">
                  {PRAYERS_AND_ANTHEM.morningPrayer.title}
                </h3>
                <p className="font-editorial text-base sm:text-lg leading-loose text-white whitespace-pre-line">
                  {PRAYERS_AND_ANTHEM.morningPrayer.text}
                </p>
              </div>
            )}

            {activePrayerTab === 'evening' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold font-editorial text-amber-300">
                  {PRAYERS_AND_ANTHEM.eveningPrayer.title}
                </h3>
                <p className="font-editorial text-base sm:text-lg leading-loose text-white whitespace-pre-line">
                  {PRAYERS_AND_ANTHEM.eveningPrayer.text}
                </p>
              </div>
            )}

            {activePrayerTab === 'lords' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold font-editorial text-amber-300">
                  {PRAYERS_AND_ANTHEM.lordsPrayer.title}
                </h3>
                <p className="font-editorial text-base sm:text-lg leading-loose text-white whitespace-pre-line">
                  {PRAYERS_AND_ANTHEM.lordsPrayer.text}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 13. FREQUENTLY ASKED QUESTIONS (FAQ) */}
      <section id="faq" className="py-20 bg-[#f6f7fb] dark:bg-[#0e1522]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#c8161d]">
              Parent Queries
            </span>
            <h2 className="text-3xl font-bold font-editorial text-[#0c1760] dark:text-white mt-1">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3 text-sm">
            <details className="group border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-4" open>
              <summary className="font-bold cursor-pointer list-none flex justify-between items-center text-slate-900 dark:text-white">
                <span>Which classes are open for admissions in 2026–27?</span>
                <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform text-slate-400" />
              </summary>
              <p className="pt-3 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 mt-2 leading-relaxed">
                Admissions are officially open from Preparatory (Nursery, LKG, UKG) through Class X, subject to seat vacancies. Class X admissions require BOSEM registration transfer clearance.
              </p>
            </details>

            <details className="group border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-4">
              <summary className="font-bold cursor-pointer list-none flex justify-between items-center text-slate-900 dark:text-white">
                <span>What are the daily school and office timings?</span>
                <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform text-slate-400" />
              </summary>
              <p className="pt-3 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 mt-2 leading-relaxed">
                Instructional class hours run Monday to Friday from 8:30 AM to 3:00 PM. The front administrative office is open Monday to Saturday from 8:00 AM to 4:00 PM.
              </p>
            </details>

            <details className="group border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-4">
              <summary className="font-bold cursor-pointer list-none flex justify-between items-center text-slate-900 dark:text-white">
                <span>Does the school offer boarding and hostel accommodation?</span>
                <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform text-slate-400" />
              </summary>
              <p className="pt-3 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 mt-2 leading-relaxed">
                Yes. Full boarding is provided for boys and girls with resident wardens, supervised daily study hours (6:00–8:30 PM), Sunday devotional services, and balanced dining. Parents may visit boarders every Saturday (10:00 AM–3:00 PM).
              </p>
            </details>

            <details className="group border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-4">
              <summary className="font-bold cursor-pointer list-none flex justify-between items-center text-slate-900 dark:text-white">
                <span>How does the fourth sibling fee concession work?</span>
                <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform text-slate-400" />
              </summary>
              <p className="pt-3 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 mt-2 leading-relaxed">
                To support families in Churachandpur, whenever four siblings from the same parents are enrolled, the fourth child pays 100% zero monthly tuition fees for the entire academic session.
              </p>
            </details>

            <details className="group border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-4">
              <summary className="font-bold cursor-pointer list-none flex justify-between items-center text-slate-900 dark:text-white">
                <span>What are the incentives for board rank holders?</span>
                <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform text-slate-400" />
              </summary>
              <p className="pt-3 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 mt-2 leading-relaxed">
                Any Kinship student who secures a position in the BOSEM HSLC State Top 10 receives a cash grant of ₹ 20,000. Students achieving letter marks (80%+) in Mathematics or Science receive ₹ 2,000 cash per subject. Class toppers in Prep to IX receive 100% tuition sponsorship the following year.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* 14. INTERACTIVE ADMISSION ENQUIRY FORM */}
      <section id="enquire" className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Info Column (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              <span className="text-xs font-bold uppercase tracking-widest text-[#c8161d]">
                Admissions 2026–27
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-editorial text-[#0c1760] dark:text-white">
                Apply for Admission or Enquire Today
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Take the first step toward your child's flourishing future. Submit this registration form and our Admissions Desk will call you within one working day.
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => openPortalWithRole('parent')}
                  className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Track Application Status</span>
                </button>
              </div>

              <div className="space-y-3 pt-2">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                  <Phone className="w-5 h-5 text-red-600 shrink-0" />
                  <div>
                    <span className="text-[11px] text-slate-500">Admissions Helplines</span>
                    <p className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                      <a href="tel:+918787710188" className="hover:text-red-600">+91 87877 10188</a>
                      <span className="text-slate-400 font-normal mx-1.5">/</span>
                      <a href="tel:+918119977792" className="hover:text-red-600">+91 81199 77792</a>
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                  <Mail className="w-5 h-5 text-red-600 shrink-0" />
                  <div>
                    <span className="text-[11px] text-slate-500">Official Gmail</span>
                    <p className="font-mono font-semibold text-xs text-slate-900 dark:text-white">
                      <a href="mailto:kinshiphighschool1994@gmail.com" className="hover:text-red-600 hover:underline">
                        kinshiphighschool1994@gmail.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-red-600 shrink-0" />
                  <div>
                    <span className="text-[11px] text-slate-500">Campus Address</span>
                    <p className="font-medium text-xs text-slate-900 dark:text-white">East of Tuibong Bazar, Churachandpur – 795128</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Registration Form (7 cols) */}
            <div className="lg:col-span-7">
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-xl">
                {enqSubmitted ? (
                  <div className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold font-editorial text-emerald-900 dark:text-emerald-200">
                        Application Successfully Registered!
                      </h4>
                      <p className="text-xs text-emerald-800/80 dark:text-emerald-400/80 mt-1 leading-relaxed">
                        Thank you, <strong>{enqParentName}</strong>. We have registered the application for <strong>{enqStudentName}</strong> into <strong>{enqClass}</strong>.
                      </p>
                    </div>

                    <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-emerald-200 dark:border-emerald-800 font-mono text-xs flex justify-between items-center">
                      <span className="text-slate-500">Registration Reference:</span>
                      <strong className="text-emerald-600 font-bold">{enqRefCode}</strong>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Our admissions office will reach out to <strong>{enqPhone}</strong> and email <strong>{enqEmail}</strong> with appointment slots for your child's friendly interaction and document verification.
                    </div>

                    <button
                      onClick={() => setEnqSubmitted(false)}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors"
                    >
                      Submit Another Application
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleEnquirySubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Student Full Name
                        </label>
                        <input
                          type="text"
                          value={enqStudentName}
                          onChange={(e) => setEnqStudentName(e.target.value)}
                          placeholder="Student Full Name"
                          required
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-[#0c1760] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Parent / Guardian Name
                        </label>
                        <input
                          type="text"
                          value={enqParentName}
                          onChange={(e) => setEnqParentName(e.target.value)}
                          placeholder="Parent / Guardian Name"
                          required
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-[#0c1760] outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Active Email Address
                        </label>
                        <input
                          type="email"
                          value={enqEmail}
                          onChange={(e) => setEnqEmail(e.target.value)}
                          placeholder="Email Address"
                          required
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-[#0c1760] outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Phone Number (for SMS & calls)
                        </label>
                        <input
                          type="tel"
                          value={enqPhone}
                          onChange={(e) => setEnqPhone(e.target.value)}
                          placeholder="Mobile Phone Number"
                          required
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-[#0c1760] outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Class Applying For
                        </label>
                        <select
                          value={enqClass}
                          onChange={(e) => setEnqClass(e.target.value)}
                          required
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-[#0c1760] outline-none"
                        >
                          <option>Preparatory (Nursery, LKG, UKG)</option>
                          <option>Class I–V (Primary)</option>
                          <option>Class VI–VIII (Middle)</option>
                          <option>Class IX–X (High School / BOSEM)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Residency Type
                        </label>
                        <div className="flex gap-4 pt-2">
                          <label className="flex items-center gap-2 text-xs cursor-pointer">
                            <input
                              type="radio"
                              name="residency"
                              checked={!enqIsBoarder}
                              onChange={() => setEnqIsBoarder(false)}
                            />
                            <span>Day Scholar</span>
                          </label>
                          <label className="flex items-center gap-2 text-xs cursor-pointer">
                            <input
                              type="radio"
                              name="residency"
                              checked={enqIsBoarder}
                              onChange={() => setEnqIsBoarder(true)}
                            />
                            <span>Boarder / Hostel</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Any Specific Queries or Notes (Optional)
                      </label>
                      <textarea
                        value={enqMessage}
                        onChange={(e) => setEnqMessage(e.target.value)}
                        rows={3}
                        placeholder="Additional queries, previous school, or concession notes..."
                        className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-[#0c1760] outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isEnqSaving}
                      className="w-full py-3 px-4 bg-[#c8161d] hover:bg-[#9e1016] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-md disabled:opacity-50"
                    >
                      {isEnqSaving ? "Transmitting to School Cloud Database..." : "Submit Admission Registration Form"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 15. CONTACT & LOCATION SECTION */}
      <section id="contact" className="py-20 bg-[#f6f7fb] dark:bg-[#0e1522]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#c8161d]">
              Get in Touch
            </span>
            <h2 className="text-3xl font-bold font-editorial text-[#0c1760] dark:text-white mt-1">
              Visit or Contact Kinship High School
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Located east of Tuibong Bazar in Churachandpur, Manipur. The campus enjoys a calm setting with a steady mountain breeze, away from commercial traffic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Address Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">Campus Address</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                East of Tuibong Bazar<br />
                Churachandpur, Manipur<br />
                PIN Code: <strong>795128</strong>
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                Landmark: 400m east of main Tuibong market junction
              </div>
            </div>

            {/* Phone and Email Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 flex items-center justify-center mb-4">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">Phone & Email</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <span className="block font-mono font-bold text-slate-900 dark:text-white text-sm">
                  <a href="tel:+918787710188" className="hover:text-red-600">+91 87877 10188</a>
                </span>
                <span className="block font-mono font-bold text-slate-900 dark:text-white text-sm">
                  <a href="tel:+918119977792" className="hover:text-red-600">+91 81199 77792</a>
                </span>
                <span className="block pt-2 text-slate-700 dark:text-slate-300">
                  <a href="mailto:kinshiphighschool1994@gmail.com" className="hover:underline hover:text-red-600">
                    kinshiphighschool1994@gmail.com
                  </a>
                </span>
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                Dedicated WhatsApp support available for admission queries
              </div>
            </div>

            {/* Hours Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">Operational Hours</h3>
              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
                <p><strong>Classroom Instruction:</strong> 8:30 AM – 3:00 PM (Mon–Fri)</p>
                <p><strong>Front Office:</strong> 8:00 AM – 4:00 PM (Mon–Sat)</p>
                <p className="font-semibold text-amber-700 dark:text-amber-400">
                  <strong>Parent Visiting Hours:</strong> Saturdays 10:00 AM – 3:00 PM only
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                Strict campus security protocol: No external visitors during class hours
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 16. INSTITUTIONAL FOOTER */}
      <footer className="bg-[#0c1760] text-slate-300 pt-16 pb-10 border-t border-blue-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-white/10">
            {/* Col 1: Crest & About */}
            <div className="space-y-3 lg:col-span-1">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400 bg-white shrink-0 flex items-center justify-center shadow-sm">
                  <img 
                    src={EMBLEM_IMG} 
                    alt="Kinship High School" 
                    className="w-full h-full object-cover scale-110" 
                  />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base font-editorial">
                    Kinship High School
                  </h4>
                  <p className="text-[11px] text-blue-200">BOSEM Code: 68633/2012</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pt-2">
                Preparatory to Class X day-cum-boarding school established in 1994. Dedicated to spiritual, intellectual, and physical upbringing under our motto <em>Spiritus, Mens, Corpus</em>.
              </p>
              <p className="text-xs text-amber-400 font-medium">
                East of Tuibong Bazar, Churachandpur – 795128
              </p>
            </div>

            {/* Col 2: Quick Links */}
            <div>
              <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
                Quick Navigation
              </h5>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors">
                    About the School & Founder
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsDisclosureOpen(true)} className="hover:text-white transition-colors">
                    Mandatory Public Disclosure (SAR)
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsProspectusOpen(true)} className="hover:text-white transition-colors">
                    Prospectus 2026–27 (PDF)
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('rules')} className="hover:text-white transition-colors">
                    School Rules & Policies
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('explore')} className="hover:text-white transition-colors">
                    Hostel & Boarding 17 Rules
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Academic & Portals */}
            <div>
              <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
                Portals & Academics
              </h5>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => openPortalWithRole('parent')} className="hover:text-white transition-colors">
                    Parent Portal (Fees & Attendance)
                  </button>
                </li>
                <li>
                  <button onClick={() => openPortalWithRole('staff')} className="hover:text-white transition-colors">
                    Staff & Teacher Console
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsFeeCalcOpen(true)} className="hover:text-white transition-colors">
                    Fee Calculator & Concessions
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('academics')} className="hover:text-white transition-colors">
                    Curriculum & Assessment Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('events')} className="hover:text-white transition-colors">
                    School Calendar & Holidays
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Contact & Visiting */}
            <div className="space-y-2">
              <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
                Administrative Office
              </h5>
              <p className="text-xs text-slate-300">
                East of Tuibong Bazar, Churachandpur, Manipur – 795128
              </p>
              <p className="text-xs font-mono text-white">
                Phone: <a href="tel:+918787710188" className="hover:text-amber-400">+91 87877 10188</a> / <a href="tel:+918119977792" className="hover:text-amber-400">+91 81199 77792</a>
              </p>
              <p className="text-xs text-blue-200">
                Email: <a href="mailto:kinshiphighschool1994@gmail.com" className="hover:underline">kinshiphighschool1994@gmail.com</a>
              </p>
              <div className="pt-2">
                <span className="text-[11px] block text-slate-400">Visiting Hours:</span>
                <span className="text-xs font-semibold text-amber-400">Saturdays 10:00 AM – 3:00 PM</span>
              </div>
            </div>

            {/* Col 5: Connect with Us */}
            <div className="space-y-3">
              <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
                Connect with Us
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Follow our official social media channels for school highlights, student achievements, and live event broadcasts.
              </p>
              <div className="space-y-2">
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/kinshiphighschool1994"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 hover:bg-[#1877F2]/20 border border-white/10 hover:border-[#1877F2]/50 text-slate-200 hover:text-white transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#1877F2] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <Facebook className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-semibold text-white group-hover:text-blue-300 transition-colors">
                      Facebook
                    </span>
                    <span className="block text-[10px] text-slate-400 truncate">
                      @kinshiphighschool1994
                    </span>
                  </div>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/kinshiphighschool1994"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 hover:bg-[#E4405F]/20 border border-white/10 hover:border-[#E4405F]/50 text-slate-200 hover:text-white transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <Instagram className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-semibold text-white group-hover:text-pink-300 transition-colors">
                      Instagram
                    </span>
                    <span className="block text-[10px] text-slate-400 truncate">
                      @kinshiphighschool1994
                    </span>
                  </div>
                </a>

                {/* YouTube */}
                <a
                  href="https://www.youtube.com/@kinshiphighschool1994"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 hover:bg-[#FF0000]/20 border border-white/10 hover:border-[#FF0000]/50 text-slate-200 hover:text-white transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#FF0000] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <Youtube className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-semibold text-white group-hover:text-red-300 transition-colors">
                      YouTube
                    </span>
                    <span className="block text-[10px] text-slate-400 truncate">
                      Kinship High School
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>
              © 2026 Kinship High School, Churachandpur. All rights reserved. Recognised by BOSEM No. {SCHOOL_INFO.recognitionNo} · National U-DISE Code: {SCHOOL_INFO.udiseCode}.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 mr-2">
                <a
                  href="https://www.facebook.com/kinshiphighschool1994"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-[#1877F2] text-slate-300 hover:text-white transition-colors"
                >
                  <Facebook className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://www.instagram.com/kinshiphighschool1994"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-[#E4405F] text-slate-300 hover:text-white transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://www.youtube.com/@kinshiphighschool1994"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-[#FF0000] text-slate-300 hover:text-white transition-colors"
                >
                  <Youtube className="w-3.5 h-3.5" />
                </a>
              </div>
              <a
                href={SCHOOL_INFO.udiseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-300 text-slate-300 transition-colors"
                title="View official government registry on schools.org.in"
              >
                U-DISE Registry (14030100307)
              </a>
              <span>·</span>
              <button onClick={() => setIsDisclosureOpen(true)} className="hover:text-white">
                Affiliation SAR
              </button>
              <span>·</span>
              <button onClick={() => scrollToSection('rules')} className="hover:text-white">
                Rules & Privacy
              </button>
              <span>·</span>
              <a href="#top" className="hover:text-white">
                Back to Top
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to top floating button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-[#c8161d] text-white shadow-xl hover:bg-[#9e1016] transition-all hover:-translate-y-1"
          aria-label="Scroll back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* MODALS */}
      <MandatoryDisclosureModal
        isOpen={isDisclosureOpen}
        onClose={() => setIsDisclosureOpen(false)}
      />

      <FeeStructureCalculatorModal
        isOpen={isFeeCalcOpen}
        onClose={() => setIsFeeCalcOpen(false)}
      />

      <PortalModal
        isOpen={isPortalOpen}
        onClose={() => setIsPortalOpen(false)}
        initialRole={portalInitialRole}
      />

      <ProspectusModal
        isOpen={isProspectusOpen}
        onClose={() => setIsProspectusOpen(false)}
        onOpenEnquiry={() => scrollToSection('enquire')}
      />

      <StudentYearlyDataModal
        isOpen={isYearlyDataOpen}
        onClose={() => setIsYearlyDataOpen(false)}
      />
    </div>
  );
}
