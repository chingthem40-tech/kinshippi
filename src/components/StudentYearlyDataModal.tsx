import React, { useState } from 'react';
import { 
  X, BarChart3, TrendingUp, Users, Award, BookOpen, 
  Calendar, CheckCircle2, Download, Printer, ShieldCheck, ChevronRight 
} from 'lucide-react';
import { 
  SCHOOL_INFO, 
  ANNUAL_STUDENT_ENROLLMENT_HISTORY, 
  STUDENT_YEARLY_ACADEMIC_RECORDS, 
  AcademicYearRecord,
  StudentYearlyArchive
} from '../data/schoolData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const StudentYearlyDataModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'institutional' | 'studentRecord'>('institutional');
  const [selectedYear, setSelectedYear] = useState<AcademicYearRecord>(ANNUAL_STUDENT_ENROLLMENT_HISTORY[0]);
  const [selectedStudentYear, setSelectedStudentYear] = useState<StudentYearlyArchive>(STUDENT_YEARLY_ACADEMIC_RECORDS[0]);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="yearly-data-title"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-[#0c1760] text-white flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-amber-400 bg-white shrink-0 flex items-center justify-center shadow-md">
              <img 
                src={SCHOOL_INFO.logoUrl} 
                alt="Kinship Crest" 
                className="w-full h-full object-cover scale-110" 
              />
            </div>
            <div>
              <h2 id="yearly-data-title" className="text-xl font-bold font-editorial">
                Student Yearly Academic & Enrollment Archive
              </h2>
              <p className="text-xs text-blue-200">
                Annual BOSEM Examination Performance & Class Strength · U-DISE: {SCHOOL_INFO.udiseCode} (1994–2026)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors text-xs flex items-center gap-1.5"
              title="Print document"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print Record</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Switcher Bar */}
        <div className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
          <div className="flex p-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('institutional')}
              className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'institutional'
                  ? 'bg-[#0c1760] text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>School Annual Strength & Board Results</span>
            </button>
            <button
              onClick={() => setActiveTab('studentRecord')}
              className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'studentRecord'
                  ? 'bg-[#0c1760] text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Individual Student Year-by-Year Progress</span>
            </button>
          </div>

          <button
            onClick={handleDownload}
            className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadSuccess ? "Annual Record Exported!" : "Export Annual Report (PDF)"}</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-800 dark:text-slate-200">
          
          {/* TAB 1: INSTITUTIONAL ANNUAL DATA */}
          {activeTab === 'institutional' && (
            <div className="space-y-6">
              {/* Year Selector Tabs */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                  Select Academic Session:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {ANNUAL_STUDENT_ENROLLMENT_HISTORY.map((yr) => (
                    <button
                      key={yr.academicYear}
                      onClick={() => setSelectedYear(yr)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedYear.academicYear === yr.academicYear
                          ? "bg-blue-50 dark:bg-blue-950/40 border-[#0c1760] dark:border-blue-400 shadow-xs"
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-400"
                      }`}
                    >
                      <strong className="block text-xs font-bold text-slate-900 dark:text-white">
                        {yr.academicYear}
                      </strong>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {yr.totalEnrolled} Students
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4 Summary Stat Cards for the Selected Year */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500 block mb-1">Total Enrolled Strength</span>
                  <strong className="text-2xl font-bold font-mono text-[#0c1760] dark:text-amber-400">
                    {selectedYear.totalEnrolled}
                  </strong>
                  <span className="text-[10px] text-emerald-600 block mt-1 font-semibold">
                    Prep to Class X
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500 block mb-1">HSLC Board Pass Rate</span>
                  <strong className="text-2xl font-bold font-mono text-emerald-600">
                    {selectedYear.hslcPerformance.passRate}
                  </strong>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    {selectedYear.hslcPerformance.passed} of {selectedYear.hslcPerformance.appeared} Passed
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500 block mb-1">1st Division Honours</span>
                  <strong className="text-2xl font-bold font-mono text-amber-500">
                    {selectedYear.hslcPerformance.firstDivision}
                  </strong>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    {selectedYear.hslcPerformance.starDistinctions} Star Distinctions
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500 block mb-1">Hostel Boarding Strength</span>
                  <strong className="text-2xl font-bold font-mono text-[#c8161d]">
                    {selectedYear.boardingStudents}
                  </strong>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    {selectedYear.dayScholars} Day Scholars
                  </span>
                </div>
              </div>

              {/* Class-wise Enrollment Breakdown */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                    Stage-Wise Student Strength ({selectedYear.academicYear})
                  </h4>
                  <span className="text-xs text-slate-500 font-mono">
                    Total: {selectedYear.totalEnrolled} Pupils
                  </span>
                </div>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-semibold text-slate-500 block">Preparatory (Nursery–UKG)</span>
                    <strong className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-1 block">
                      {selectedYear.stageDistribution.preparatory}
                    </strong>
                    <span className="text-[10px] text-slate-400">3 sections</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-semibold text-slate-500 block">Primary (Class I–V)</span>
                    <strong className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-1 block">
                      {selectedYear.stageDistribution.primary}
                    </strong>
                    <span className="text-[10px] text-slate-400">5 sections</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-semibold text-slate-500 block">Middle (Class VI–VIII)</span>
                    <strong className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-1 block">
                      {selectedYear.stageDistribution.middle}
                    </strong>
                    <span className="text-[10px] text-slate-400">4 sections</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-semibold text-slate-500 block">High School (Class IX–X)</span>
                    <strong className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-1 block">
                      {selectedYear.stageDistribution.highSchool}
                    </strong>
                    <span className="text-[10px] text-slate-400">BOSEM Pattern</span>
                  </div>
                </div>
              </div>

              {/* Annual Highlights & Milestones */}
              <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-2">
                <span className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider block">
                  Session Milestones & Institutional Accomplishments:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {selectedYear.keyMilestones.map((m, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: INDIVIDUAL STUDENT YEAR-BY-YEAR PROGRESS RECORD */}
          {activeTab === 'studentRecord' && (
            <div className="space-y-6">
              {/* Year Selector for Student Progress */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                  Select Student Academic Session:
                </span>
                <div className="flex gap-2 flex-wrap">
                  {STUDENT_YEARLY_ACADEMIC_RECORDS.map((rec) => (
                    <button
                      key={rec.year}
                      onClick={() => setSelectedStudentYear(rec)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                        selectedStudentYear.year === rec.year
                          ? "bg-[#0c1760] text-white border-[#0c1760] shadow-sm"
                          : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400"
                      }`}
                    >
                      {rec.year} · {rec.grade}
                    </button>
                  ))}
                </div>
              </div>

              {/* Student Header Bar for Selected Year */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-base font-bold text-slate-900 dark:text-white">
                      Enrolled Student Record · {selectedStudentYear.grade}
                    </strong>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
                      {selectedStudentYear.year}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Roll No: {selectedStudentYear.rollNo} · Class Standing: <strong>{selectedStudentYear.rankInClass}</strong> · Conduct: {selectedStudentYear.conduct}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Annual Aggregate</span>
                  <span className="text-2xl font-bold font-mono text-[#0c1760] dark:text-amber-400">
                    {selectedStudentYear.finalAggregate}%
                  </span>
                </div>
              </div>

              {/* Subject Breakdown Table */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                  <strong className="font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Subject Performance ({selectedStudentYear.year})
                  </strong>
                  <span className="text-slate-500 font-mono">
                    Attendance: {selectedStudentYear.attendanceRate}% (Compliant)
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[480px] sm:min-w-full">
                    <thead className="bg-slate-50/60 dark:bg-slate-800/30 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">Subject</th>
                        <th className="py-2.5 px-3 font-mono">Annual Score (100)</th>
                        <th className="py-2.5 px-3">Letter Grade</th>
                        <th className="py-2.5 px-3 text-right">BOSEM Evaluation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {selectedStudentYear.subjects.map((sub, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                          <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                            {sub.subject}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold">
                            {sub.marks}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">
                              {sub.grade}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right text-slate-500">
                            {sub.marks >= 80 ? "Distinction / Letter Mark" : "First Class Mastery"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Promotion Certificate Card */}
              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <strong className="block text-xs font-bold text-emerald-900 dark:text-emerald-200">
                      Annual Promotion Endorsement
                    </strong>
                    <span className="text-[11px] text-emerald-800/80 dark:text-emerald-400">
                      {selectedStudentYear.promotionStatus}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  Certified by Academic Dean
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center shrink-0 text-xs text-slate-500">
          <span>Kinship High School Academic Records Office · Code: {SCHOOL_INFO.recognitionNo}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold"
          >
            Close Archive
          </button>
        </div>
      </div>
    </div>
  );
};
