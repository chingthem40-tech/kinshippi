import React, { useState, useEffect } from 'react';
import { 
  X, User, GraduationCap, CheckCircle2, Clock, Calendar, 
  CreditCard, AlertTriangle, Send, Download, Check, ShieldCheck, 
  LogOut, Database, Bell, Trash2, Search, MapPin
} from 'lucide-react';
import { SCHOOL_INFO } from '../data/schoolData';
import { useAuth } from '../context/AuthContext';
import { 
  subscribeAdmissions, 
  updateAdmissionStatus, 
  publishCircular, 
  deleteCircular,
  subscribeCirculars,
  subscribeTourBookings,
  updateTourBookingStatus,
  AdmissionRecord, 
  CircularRecord,
  TourBookingRecord
} from '../services/schoolFirestore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: 'parent' | 'staff' | 'admin';
}

interface StudentRow {
  roll: number;
  name: string;
  status: 'P' | 'A' | 'L';
  attendancePct: number;
}

export const PortalModal: React.FC<Props> = ({ isOpen, onClose, initialRole = 'parent' }) => {
  const { user, isAdmin, signInWithGoogle, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'parent' | 'staff' | 'admin'>(
    initialRole === 'admin' || (isAdmin && initialRole === 'staff') ? 'admin' : (initialRole as 'parent' | 'staff')
  );
  
  // Admin sub-view
  const [adminView, setAdminView] = useState<'admissions' | 'tours' | 'circulars'>('admissions');

  // Parent state
  const [parentAdmNo, setParentAdmNo] = useState('KHS-2026-0842');
  const [parentPassword, setParentPassword] = useState('kinship2026');
  const [isParentLoggedIn, setIsParentLoggedIn] = useState(false);
  const [receiptDownloaded, setReceiptDownloaded] = useState(false);
  
  // Direct tracking lookup
  const [searchTrackingId, setSearchTrackingId] = useState('');
  const [trackedRecord, setTrackedRecord] = useState<AdmissionRecord | null>(null);
  const [trackSearched, setTrackSearched] = useState(false);

  // Staff state
  const [staffId, setStaffId] = useState('KHS-FAC-104');
  const [staffPassword, setStaffPassword] = useState('dean@kinship');
  const [isStaffLoggedIn, setIsStaffLoggedIn] = useState(false);
  const [classRolls, setClassRolls] = useState<StudentRow[]>([
    { roll: 1, name: 'Student (Roll 01)', status: 'P', attendancePct: 96 },
    { roll: 2, name: 'Student (Roll 02)', status: 'P', attendancePct: 98 },
    { roll: 3, name: 'Student (Roll 03)', status: 'P', attendancePct: 92 },
    { roll: 4, name: 'Student (Roll 04)', status: 'L', attendancePct: 91 },
    { roll: 5, name: 'Student (Roll 05)', status: 'P', attendancePct: 94 },
    { roll: 6, name: 'Student (Roll 06)', status: 'A', attendancePct: 88 },
  ]);
  const [attendanceSaved, setAttendanceSaved] = useState(false);

  // Admin / Firestore state
  const [admissions, setAdmissions] = useState<AdmissionRecord[]>([]);
  const [tours, setTours] = useState<TourBookingRecord[]>([]);
  const [liveCirculars, setLiveCirculars] = useState<CircularRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isPublishingNotice, setIsPublishingNotice] = useState(false);
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeCategory, setNewNoticeCategory] = useState<CircularRecord['category']>('Academic');
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [newNoticePriority, setNewNoticePriority] = useState<'normal' | 'urgent'>('normal');
  const [noticeFeedback, setNoticeFeedback] = useState<string | null>(null);

  // Real-time Firestore subscriptions
  useEffect(() => {
    if (!isOpen) return;

    // 1. Circulars (Publicly accessible official notices)
    const unsubCirculars = subscribeCirculars((records) => setLiveCirculars(records));

    // 2. Admissions (Admins see all; signed-in parents see their own applications)
    let unsubAdmissions = () => {};
    if (isAdmin || user?.uid) {
      unsubAdmissions = subscribeAdmissions(
        (records) => setAdmissions(records),
        user?.uid,
        isAdmin
      );
    } else {
      setAdmissions([]);
    }

    // 3. Tour bookings (Administrative dashboard only)
    let unsubTours = () => {};
    if (isAdmin) {
      unsubTours = subscribeTourBookings((records) => setTours(records), true);
    } else {
      setTours([]);
    }

    return () => {
      unsubAdmissions();
      unsubCirculars();
      unsubTours();
    };
  }, [isOpen, user?.uid, isAdmin]);

  if (!isOpen) return null;

  const handleParentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (parentAdmNo.trim()) {
      setIsParentLoggedIn(true);
    }
  };

  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (staffId.trim()) {
      setIsStaffLoggedIn(true);
    }
  };

  const toggleStudentStatus = (roll: number) => {
    setClassRolls(prev => prev.map(student => {
      if (student.roll === roll) {
        const nextStatus: Record<'P' | 'A' | 'L', 'P' | 'A' | 'L'> = {
          'P': 'A',
          'A': 'L',
          'L': 'P',
        };
        return { ...student, status: nextStatus[student.status] };
      }
      return student;
    }));
  };

  const saveAttendance = () => {
    setAttendanceSaved(true);
    setTimeout(() => setAttendanceSaved(false), 3000);
  };

  const handlePublishNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle.trim() || !newNoticeContent.trim()) return;
    setIsPublishingNotice(true);
    try {
      const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      await publishCircular({
        title: newNoticeTitle,
        category: newNoticeCategory,
        date: today,
        content: newNoticeContent,
        priority: newNoticePriority,
        authorEmail: user?.email || 'admin@kinshiphighschool.edu.in',
      });
      setNewNoticeTitle('');
      setNewNoticeContent('');
      setNoticeFeedback('Circular published to live database and ticker!');
      setTimeout(() => setNoticeFeedback(null), 3500);
    } catch (err) {
      console.error(err);
      setNoticeFeedback('Failed to publish circular.');
    } finally {
      setIsPublishingNotice(false);
    }
  };

  const handleStatusChange = async (admId: string, nextStatus: AdmissionRecord['status']) => {
    try {
      await updateAdmissionStatus(admId, nextStatus);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTourStatusChange = async (tourId: string, nextStatus: TourBookingRecord['status']) => {
    try {
      await updateTourBookingStatus(tourId, nextStatus);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCircular = async (circId: string) => {
    try {
      await deleteCircular(circId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTrackLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchTrackingId.trim().toLowerCase();
    if (!query) return;
    const match = admissions.find(
      (a) => a.id.toLowerCase() === query || a.parentPhone.replace(/\s+/g, '').includes(query)
    );
    setTrackedRecord(match || null);
    setTrackSearched(true);
  };

  const filteredAdmissions = admissions.filter(adm => {
    if (statusFilter === 'all') return true;
    return adm.status === statusFilter;
  });

  // User's own submitted admissions (if logged in as parent)
  const myApplications = user 
    ? admissions.filter(adm => adm.applicantUid === user.uid || (adm.parentEmail && adm.parentEmail.toLowerCase() === user.email?.toLowerCase()))
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="portal-title"
      >
        {/* Header with Switcher Tabs */}
        <div className="bg-[#0c1760] text-white p-5 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-amber-400 bg-white shrink-0 flex items-center justify-center shadow-md">
              <img 
                src={SCHOOL_INFO.logoUrl} 
                alt="Kinship Crest" 
                className="w-full h-full object-cover scale-110" 
              />
            </div>
            <div>
              <h2 id="portal-title" className="text-xl font-bold font-editorial">
                Kinship School Digital Portals
              </h2>
              <p className="text-xs text-blue-200">
                Connected to Firebase Firestore & Authentication
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switchers */}
            <div className="flex p-1 bg-white/10 rounded-xl">
              <button
                onClick={() => setActiveTab('parent')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'parent'
                    ? "bg-amber-400 text-slate-950 shadow-sm"
                    : "text-white/80 hover:text-white"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Parent Portal</span>
              </button>
              <button
                onClick={() => setActiveTab('staff')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'staff'
                    ? "bg-amber-400 text-slate-950 shadow-sm"
                    : "text-white/80 hover:text-white"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Faculty</span>
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'admin'
                    ? "bg-amber-400 text-slate-950 shadow-sm"
                    : "text-white/80 hover:text-white"
                }`}
              >
                <Database className="w-3.5 h-3.5 text-red-700" />
                <span>Cloud Admin ({admissions.length})</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close Portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Firebase Auth Banner */}
        <div className="bg-slate-100 dark:bg-slate-800/80 px-6 py-2.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-600 dark:text-slate-300 font-medium">
              Firebase Auth:
            </span>
            {user ? (
              <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                {user.email}
                {isAdmin && (
                  <span className="px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 text-[10px] font-bold">
                    Admin
                  </span>
                )}
              </span>
            ) : (
              <span className="text-slate-500">Not signed in</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <button
                onClick={logout}
                className="px-2.5 py-1 rounded bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium flex items-center gap-1 transition-colors"
              >
                <LogOut className="w-3 h-3" />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="px-3 py-1 rounded bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 font-semibold text-slate-800 dark:text-white flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: PARENT PORTAL */}
          {activeTab === 'parent' && (
            <div className="space-y-6">
              {/* Application Tracking Lookup Bar */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Search className="w-4 h-4 text-red-600" />
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                    Track Admission Application
                  </h4>
                </div>
                <form onSubmit={handleTrackLookup} className="flex gap-2">
                  <input
                    type="text"
                    value={searchTrackingId}
                    onChange={(e) => setSearchTrackingId(e.target.value)}
                    placeholder="Enter Application ID (e.g. adm_...) or Contact Phone Number"
                    className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono outline-none focus:ring-2 focus:ring-[#0c1760]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0c1760] hover:bg-[#152583] text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Check Status
                  </button>
                </form>

                {trackSearched && (
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs">
                    {trackedRecord ? (
                      <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-emerald-200 dark:border-emerald-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <strong className="text-sm font-bold text-slate-900 dark:text-white">
                            {trackedRecord.studentName}
                          </strong>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            trackedRecord.status === 'pending'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : trackedRecord.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          }`}>
                            Status: {trackedRecord.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                          Class: <strong>{trackedRecord.classApplying}</strong> · Parent: {trackedRecord.parentName} ({trackedRecord.parentPhone})
                        </p>
                        <p className="text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold">
                          Next Step: Visit Kinship High School campus East of Tuibong Bazar for document verification.
                        </p>
                      </div>
                    ) : (
                      <p className="text-red-600 dark:text-red-400 font-semibold">
                        No application matching "{searchTrackingId}" was found in the database. Please verify the code or phone number.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* My Submitted Applications (for Google Authenticated Parent) */}
              {user && myApplications.length > 0 && (
                <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40">
                  <h4 className="font-bold text-xs text-blue-900 dark:text-blue-300 uppercase tracking-wider mb-2">
                    My Submitted Applications ({myApplications.length})
                  </h4>
                  <div className="space-y-2">
                    {myApplications.map((app) => (
                      <div key={app.id} className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                        <div>
                          <strong className="block text-slate-900 dark:text-white">{app.studentName}</strong>
                          <span className="text-[11px] text-slate-500 font-mono">ID: {app.id} · {app.classApplying}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          app.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!isParentLoggedIn && !user ? (
                /* Login Form */
                <div className="max-w-md mx-auto py-4">
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 flex items-center justify-center mx-auto mb-3">
                      <User className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold font-editorial text-slate-900 dark:text-white">
                      Enrolled Student Record Login
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Sign in with Google or enter your student Admission Number to view term evaluation and attendance.
                    </p>
                  </div>

                  <form onSubmit={handleParentLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Admission Number / Student ID
                      </label>
                      <input
                        type="text"
                        value={parentAdmNo}
                        onChange={(e) => setParentAdmNo(e.target.value)}
                        placeholder="Enter Student Admission Number"
                        required
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono focus:ring-2 focus:ring-[#0c1760] outline-none"
                      />
                      <span className="text-[11px] text-slate-500">Registered Student Admission Number</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Secret Password
                      </label>
                      <input
                        type="password"
                        value={parentPassword}
                        onChange={(e) => setParentPassword(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-[#0c1760] outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 bg-[#c8161d] hover:bg-[#9e1016] text-white font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <span>Log In to Parent Dashboard</span>
                    </button>

                    <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-300 text-center">
                      Need admission credentials? Contact the school front office at <strong className="font-mono">+91 87877 10188 / +91 81199 77792</strong> (East of Tuibong Bazar).
                    </div>
                  </form>
                </div>
              ) : (
                /* Authenticated Parent Dashboard */
                <div className="space-y-6">
                  {/* Student Summary Bar */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#0c1760] text-amber-400 font-bold flex items-center justify-center text-lg">
                        KH
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-base text-slate-900 dark:text-white">
                            {user?.displayName || "Enrolled Student"}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 text-[10px] font-bold">
                            Active Student
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                          Adm No: {parentAdmNo} · Class IX-A (Roll 14) · House: Faith
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setIsParentLoggedIn(false);
                          if (user) logout();
                        }}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>

                  {/* 3 Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-blue-700 dark:text-blue-300 font-semibold">Attendance (Year to Date)</span>
                        <Clock className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                        94.2%
                      </div>
                      <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Compliant with 90% BOSEM rule
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold">Term-1 Board Aggregate</span>
                        <GraduationCap className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                        88.5%
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                        Rank: 4th in Class IX-A (Science Star)
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-amber-800 dark:text-amber-300 font-semibold">Current Tuition Dues</span>
                        <CreditCard className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                        ₹ 0.00
                      </div>
                      <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Cleared through Current Quarter
                      </span>
                    </div>
                  </div>

                  {/* Academic Progress Matrix */}
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 font-semibold text-xs text-slate-800 dark:text-slate-200 flex justify-between items-center">
                      <span>Term Evaluation Marks Breakdown (BOSEM Rubric)</span>
                      <span className="text-[11px] text-slate-500">Grading scale: A1 to D</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs min-w-[500px] sm:min-w-full">
                      <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="py-2.5 px-3">Subject</th>
                          <th className="py-2.5 px-3">Internal (20)</th>
                          <th className="py-2.5 px-3">Term Exam (80)</th>
                          <th className="py-2.5 px-3">Total (100)</th>
                          <th className="py-2.5 px-3">Grade</th>
                          <th className="py-2.5 px-3 text-right">Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        <tr>
                          <td className="py-2.5 px-3 font-semibold">General English</td>
                          <td className="py-2.5 px-3 font-mono">19</td>
                          <td className="py-2.5 px-3 font-mono">72</td>
                          <td className="py-2.5 px-3 font-mono font-bold">91</td>
                          <td className="py-2.5 px-3"><span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 font-bold text-[10px]">A1</span></td>
                          <td className="py-2.5 px-3 text-right text-slate-500">Excellent essay diction</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 font-semibold">Mathematics</td>
                          <td className="py-2.5 px-3 font-mono">18</td>
                          <td className="py-2.5 px-3 font-mono">74</td>
                          <td className="py-2.5 px-3 font-mono font-bold">92</td>
                          <td className="py-2.5 px-3"><span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 font-bold text-[10px]">A1</span></td>
                          <td className="py-2.5 px-3 text-right text-slate-500">Algebraic theorems sound</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 font-semibold">Integrated Science</td>
                          <td className="py-2.5 px-3 font-mono">20</td>
                          <td className="py-2.5 px-3 font-mono">75</td>
                          <td className="py-2.5 px-3 font-mono font-bold">95</td>
                          <td className="py-2.5 px-3"><span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 font-bold text-[10px]">A1</span></td>
                          <td className="py-2.5 px-3 text-right text-slate-500">Highest in class; lab viva 10/10</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 font-semibold">Social Sciences</td>
                          <td className="py-2.5 px-3 font-mono">17</td>
                          <td className="py-2.5 px-3 font-mono">65</td>
                          <td className="py-2.5 px-3 font-mono font-bold">82</td>
                          <td className="py-2.5 px-3"><span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 font-bold text-[10px]">A2</span></td>
                          <td className="py-2.5 px-3 text-right text-slate-500">History timelines need review</td>
                        </tr>
                      </tbody>
                    </table>
                    </div>
                  </div>

                  {/* Fee receipt download */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                        Official Term Fee Statement (Session 2026–27)
                      </h5>
                      <p className="text-[11px] text-slate-500">
                        Signed digital receipt containing school stamp & BOSEM code BOSEM-68633
                      </p>
                    </div>
                    <button
                      onClick={() => setReceiptDownloaded(true)}
                      className="px-4 py-2 bg-[#0c1760] hover:bg-[#162788] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{receiptDownloaded ? "Statement Downloaded!" : "Download PDF Receipt"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: STAFF / FACULTY PORTAL */}
          {activeTab === 'staff' && (
            <div>
              {!isStaffLoggedIn && !isAdmin ? (
                /* Staff Login Form */
                <div className="max-w-md mx-auto py-6">
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 flex items-center justify-center mx-auto mb-3">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold font-editorial text-slate-900 dark:text-white">
                      Faculty & Academic Staff Portal
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Staff ID and Faculty Passcode authentication for attendance and bulletins.
                    </p>
                  </div>

                  <form onSubmit={handleStaffLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Staff Registration ID
                      </label>
                      <input
                        type="text"
                        value={staffId}
                        onChange={(e) => setStaffId(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono focus:ring-2 focus:ring-[#0c1760] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Faculty Passcode
                      </label>
                      <input
                        type="password"
                        value={staffPassword}
                        onChange={(e) => setStaffPassword(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-[#0c1760] outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 bg-[#0c1760] hover:bg-[#162788] text-white font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <span>Log In to Faculty Console</span>
                    </button>
                  </form>
                </div>
              ) : (
                /* Authenticated Staff Console */
                <div className="space-y-6">
                  {/* Faculty Badge Bar */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-red-700 text-white font-bold flex items-center justify-center text-lg">
                        AD
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-base text-slate-900 dark:text-white">
                            Faculty Console
                          </h4>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 text-[10px] font-bold">
                            Active Faculty
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Role: Academic Faculty · Class Incharge: Class IX-A
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsStaffLoggedIn(false)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out Staff</span>
                    </button>
                  </div>

                  {/* Daily Roll Call & Attendance Register */}
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 font-semibold text-xs text-slate-800 dark:text-slate-200 flex flex-wrap justify-between items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span>Daily Roll Call Register · Class IX-A (Click status to toggle P / A / L)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-500">P = Present, A = Absent, L = Leave</span>
                        <button
                          onClick={saveAttendance}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-bold transition-colors"
                        >
                          {attendanceSaved ? "Attendance Committed!" : "Save Roll Call"}
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                          <tr>
                            <th className="py-2.5 px-3">Roll</th>
                            <th className="py-2.5 px-3">Student Name</th>
                            <th className="py-2.5 px-3">Cumulative Attendance</th>
                            <th className="py-2.5 px-3">90% Threshold Alert</th>
                            <th className="py-2.5 px-3 text-right">Today's Marking</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {classRolls.map((row) => (
                            <tr key={row.roll} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                              <td className="py-2.5 px-3 font-mono font-bold">{row.roll}</td>
                              <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white">{row.name}</td>
                              <td className="py-2.5 px-3 font-mono">{row.attendancePct}%</td>
                              <td className="py-2.5 px-3">
                                {row.attendancePct < 90 ? (
                                  <span className="inline-flex items-center gap-1 text-red-600 font-semibold text-[11px]">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    <span>Below 90% (Exam Alert)</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Eligible</span>
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <button
                                  onClick={() => toggleStudentStatus(row.roll)}
                                  className={`w-8 h-8 rounded-lg font-bold text-xs transition-transform active:scale-95 ${
                                    row.status === 'P'
                                      ? "bg-emerald-600 text-white shadow-xs"
                                      : row.status === 'A'
                                      ? "bg-red-600 text-white shadow-xs"
                                      : "bg-amber-500 text-slate-950"
                                  }`}
                                >
                                  {row.status}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LIVE FIRESTORE CLOUD ADMIN */}
          {activeTab === 'admin' && (
            <div className="space-y-6">
              {/* Cloud Database Status Card */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#0c1760] to-[#1e2f97] text-white flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Database className="w-5 h-5 text-amber-400" />
                    <h3 className="font-bold text-base">Headmaster & Administration Dashboard</h3>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-[10px] font-bold">
                      Official Records
                    </span>
                  </div>
                  <p className="text-xs text-blue-200">
                    Real-time online admissions register, campus tour reservations, and official circular dispatcher.
                  </p>
                </div>

                {!user && (
                  <button
                    onClick={signInWithGoogle}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span>Sign in as Admin with Google</span>
                  </button>
                )}
              </div>

              {/* Sub-view navigation */}
              <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-semibold gap-4 pb-2">
                <button
                  onClick={() => setAdminView('admissions')}
                  className={`pb-2 transition-colors border-b-2 flex items-center gap-1.5 ${
                    adminView === 'admissions'
                      ? 'border-[#c8161d] text-[#c8161d] dark:text-red-400 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <span>Admissions Inquiries</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px]">
                    {admissions.length}
                  </span>
                </button>
                <button
                  onClick={() => setAdminView('tours')}
                  className={`pb-2 transition-colors border-b-2 flex items-center gap-1.5 ${
                    adminView === 'tours'
                      ? 'border-[#c8161d] text-[#c8161d] dark:text-red-400 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <span>Saturday Tour Bookings</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px]">
                    {tours.length}
                  </span>
                </button>
                <button
                  onClick={() => setAdminView('circulars')}
                  className={`pb-2 transition-colors border-b-2 flex items-center gap-1.5 ${
                    adminView === 'circulars'
                      ? 'border-[#c8161d] text-[#c8161d] dark:text-red-400 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <span>Noticeboard Bulletins</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px]">
                    {liveCirculars.length}
                  </span>
                </button>
              </div>

              {/* VIEW 1: ADMISSIONS */}
              {adminView === 'admissions' && (
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                        Live Admissions Register ({admissions.length} Submissions)
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Applications submitted via the school admissions form appear here in real time.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500">Filter:</span>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 outline-none"
                      >
                        <option value="all">All Records ({admissions.length})</option>
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>

                  {filteredAdmissions.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-xs">
                      <Database className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
                      <p className="font-semibold">No admission records found matching this filter.</p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Fill out the Admissions form on the website to see applications stream in live!
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                          <tr>
                            <th className="py-2.5 px-3">Student Name</th>
                            <th className="py-2.5 px-3">Parent & Phone</th>
                            <th className="py-2.5 px-3">Class</th>
                            <th className="py-2.5 px-3">Status</th>
                            <th className="py-2.5 px-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {filteredAdmissions.map((adm) => (
                            <tr key={adm.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                              <td className="py-2.5 px-3">
                                <span className="font-bold text-slate-900 dark:text-white block">{adm.studentName}</span>
                                <span className="text-[10px] text-slate-400 font-mono">{adm.id}</span>
                              </td>
                              <td className="py-2.5 px-3">
                                <span className="block text-slate-800 dark:text-slate-200">{adm.parentName}</span>
                                <a href={`tel:${adm.parentPhone}`} className="text-blue-600 dark:text-blue-400 font-mono text-[11px] hover:underline">
                                  {adm.parentPhone}
                                </a>
                              </td>
                              <td className="py-2.5 px-3 font-semibold text-slate-700 dark:text-slate-300">
                                {adm.classApplying}
                              </td>
                              <td className="py-2.5 px-3">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                  adm.status === 'pending'
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                    : adm.status === 'approved'
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                    : adm.status === 'contacted'
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                    : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                                }`}>
                                  {adm.status.replace('_', ' ')}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-right space-x-1.5">
                                {isAdmin && (
                                  <>
                                    <button
                                      onClick={() => handleStatusChange(adm.id, 'contacted')}
                                      className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-semibold hover:bg-blue-100 transition-colors"
                                    >
                                      Contacted
                                    </button>
                                    <button
                                      onClick={() => handleStatusChange(adm.id, 'approved')}
                                      className="px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold hover:bg-emerald-100 transition-colors"
                                    >
                                      Approve
                                    </button>
                                  </>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* VIEW 2: TOURS */}
              {adminView === 'tours' && (
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                      Saturday Campus Tour Bookings ({tours.length} Reservations)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Parents reserving visiting slots east of Tuibong Bazar.
                    </p>
                  </div>

                  {tours.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-xs">
                      <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
                      <p className="font-semibold">No campus tour bookings recorded yet.</p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Reservations from the homepage 'Book a Campus Tour' form will sync here instantly.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                          <tr>
                            <th className="py-2.5 px-3">Parent Name</th>
                            <th className="py-2.5 px-3">Phone</th>
                            <th className="py-2.5 px-3">Scheduled Saturday</th>
                            <th className="py-2.5 px-3">Status</th>
                            <th className="py-2.5 px-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {tours.map((t) => (
                            <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                              <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                                {t.parentName}
                              </td>
                              <td className="py-2.5 px-3 font-mono">
                                <a href={`tel:${t.phone}`} className="text-blue-600 hover:underline">
                                  {t.phone}
                                </a>
                              </td>
                              <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-300">
                                {t.preferredSaturday}
                              </td>
                              <td className="py-2.5 px-3">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                  t.status === 'scheduled'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}>
                                  {t.status}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                {isAdmin && t.status === 'scheduled' && (
                                  <button
                                    onClick={() => handleTourStatusChange(t.id, 'completed')}
                                    className="px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold hover:bg-emerald-100 transition-colors"
                                  >
                                    Mark Visited
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* VIEW 3: CIRCULARS & NOTICES */}
              {adminView === 'circulars' && (
                <div className="space-y-4">
                  {/* Publish Notice Form */}
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Bell className="w-4 h-4 text-red-600" />
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                        Publish Live Announcement to School Notice Board
                      </h4>
                    </div>

                    {noticeFeedback && (
                      <div className="mb-3 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                        {noticeFeedback}
                      </div>
                    )}

                    <form onSubmit={handlePublishNotice} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                            Notice Headline
                          </label>
                          <input
                            type="text"
                            value={newNoticeTitle}
                            onChange={(e) => setNewNoticeTitle(e.target.value)}
                            placeholder="HSLC Pre-Board Examination Timetable"
                            required
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#0c1760]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                            Category
                          </label>
                          <select
                            value={newNoticeCategory}
                            onChange={(e) => setNewNoticeCategory(e.target.value as any)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none"
                          >
                            <option value="Academic">Academic</option>
                            <option value="Examination">Examination</option>
                            <option value="Sports">Sports</option>
                            <option value="Holiday">Holiday</option>
                            <option value="Notice">Notice</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                          Circular Text Content
                        </label>
                        <textarea
                          value={newNoticeContent}
                          onChange={(e) => setNewNoticeContent(e.target.value)}
                          rows={2}
                          placeholder="Enter detailed notice message for parents and students..."
                          required
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#0c1760]"
                        ></textarea>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newNoticePriority === 'urgent'}
                            onChange={(e) => setNewNoticePriority(e.target.checked ? 'urgent' : 'normal')}
                            className="rounded text-red-600"
                          />
                          <span className="font-semibold text-red-600">Mark as High-Priority / Urgent Ticker</span>
                        </label>

                        <button
                          type="submit"
                          disabled={isPublishingNotice}
                          className="px-4 py-2 bg-[#c8161d] hover:bg-[#a01217] text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{isPublishingNotice ? "Broadcasting..." : "Publish to Live Noticeboard"}</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* List of currently active circulars */}
                  {liveCirculars.length > 0 && (
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                        Active Published Bulletins ({liveCirculars.length})
                      </h4>
                      <div className="space-y-2">
                        {liveCirculars.map((c) => (
                          <div key={c.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-between items-start gap-3 text-xs">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 dark:text-white">{c.title}</span>
                                <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 text-[10px] font-semibold">
                                  {c.category}
                                </span>
                              </div>
                              <p className="text-slate-600 dark:text-slate-400 mt-1">{c.content}</p>
                              <span className="text-[10px] text-slate-400 mt-1 block">Date: {c.date}</span>
                            </div>
                            {isAdmin && (
                              <button
                                onClick={() => handleDeleteCircular(c.id)}
                                className="text-red-500 hover:text-red-700 p-1 transition-colors"
                                title="Delete notice"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center shrink-0">
          <span className="text-xs text-slate-500">
            School Office Helpdesk: <strong className="font-mono text-slate-800 dark:text-slate-200">+91 87877 10188 / +91 81199 77792</strong>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-semibold"
          >
            Close Portal
          </button>
        </div>
      </div>
    </div>
  );
};
