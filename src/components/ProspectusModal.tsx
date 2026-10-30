import React, { useState } from 'react';
import { X, BookOpen, Download, CheckCircle2, Calendar, FileCheck, Award, HeartHandshake, Printer } from 'lucide-react';
import { SCHOOL_INFO, ACADEMIC_STAGES, SCHOOL_RULES } from '../data/schoolData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenEnquiry?: () => void;
}

export const ProspectusModal: React.FC<Props> = ({ isOpen, onClose, onOpenEnquiry }) => {
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="prospectus-title"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-[#0c1760] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-amber-400 bg-white shrink-0 flex items-center justify-center shadow-md">
              <img 
                src={SCHOOL_INFO.logoUrl} 
                alt="Kinship Crest" 
                className="w-full h-full object-cover scale-110" 
              />
            </div>
            <div>
              <h2 id="prospectus-title" className="text-xl font-bold font-editorial">
                Information Prospectus & Admissions Guide 2026–27
              </h2>
              <p className="text-xs text-blue-200">
                Kinship High School, Churachandpur · Established 1994 · Recognised by BOSEM
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close prospectus"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-8 text-sm text-slate-800 dark:text-slate-200">
          {/* Welcome Message from Principal with Crest */}
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-red-600 bg-white shrink-0 mx-auto sm:mx-0 shadow-md flex items-center justify-center">
              <img 
                src={SCHOOL_INFO.logoUrl} 
                alt="Kinship High School Seal" 
                className="w-full h-full object-cover scale-110" 
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold font-editorial text-[#0c1760] dark:text-amber-400 mb-2">
                Message from the Principal's Desk
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                "Dear Parents and Guardians, welcome to Kinship High School. Established in 1994, our solemn calling has been to nurture children in a calm, God-fearing, disciplined atmosphere that promotes peaceful co-existence, mutual respect, and academic excellence. Rooted in our Latin motto <em>Spiritus, Mens, Corpus</em> (A soul that breathes peace, a mind of learning, and a sound body) and Proverbs 22:6, we prepare our students not just for examinations, but for life. We warmly invite your family to join our thriving community."
              </p>
              <div className="text-xs font-semibold text-slate-900 dark:text-white">
                — {SCHOOL_INFO.principal}
              </div>
            </div>
          </div>

          {/* Admission Schedule for 2026–27 */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-[#0c1760] dark:text-amber-400 font-editorial text-lg font-bold">
              <Calendar className="w-5 h-5 text-red-600" />
              <span>Admissions Timeline & Schedule (2026–27)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 font-semibold">Step 1: Registration</span>
                <p className="font-bold text-sm text-slate-900 dark:text-white mt-1">Open Now</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Online form or front office desk</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 font-semibold">Step 2: Campus Tours</span>
                <p className="font-bold text-sm text-slate-900 dark:text-white mt-1">Every Saturday</p>
                <p className="text-[11px] text-slate-500 mt-0.5">10:00 AM – 3:00 PM</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 font-semibold">Step 3: Interaction</span>
                <p className="font-bold text-sm text-slate-900 dark:text-white mt-1">Within 3 Days</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Friendly grade readiness review</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 font-semibold">Step 4: Term Reopens</span>
                <p className="font-bold text-sm text-slate-900 dark:text-white mt-1">First Week of Feb</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Orientation & textbook issuance</p>
              </div>
            </div>
          </div>

          {/* Documents Required Checklist */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-[#0c1760] dark:text-amber-400 font-editorial text-lg font-bold">
              <FileCheck className="w-5 h-5 text-red-600" />
              <span>Mandatory Documents Required for Enrolment</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                "Original & Photocopy of Birth Certificate (issued by Municipal / Registrar)",
                "Official Transfer Certificate (TC) counter-signed by authority for Class I and above",
                "Previous school academic report card / mark sheet",
                "Four (4) recent passport-sized photographs of the student in white background",
                "Photocopy of Parent / Guardian Aadhaar card or official Government ID",
                "Blood group and vaccination record / medical fitness certificate",
              ].map((doc, idx) => (
                <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700 dark:text-slate-300">{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Age Eligibility Criteria */}
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
              Age Criteria for Preparatory & Primary Entry (as of March 31, 2026)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">Nursery</span>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">3+ Years</p>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">LKG</span>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">4+ Years</p>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">UKG</span>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">5+ Years</p>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">Class I</span>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">6+ Years</p>
              </div>
            </div>
          </div>

          {/* Boarding Hostel Highlights */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
            <h4 className="font-bold text-sm text-amber-950 dark:text-amber-200 mb-1">
              Boarding & Hostel Life at Kinship
            </h4>
            <p className="text-xs text-amber-900/80 dark:text-amber-300/80 mb-2 leading-relaxed">
              Supervised boys' and girls' wings located inside the peaceful campus perimeter. Daily routine includes morning physical training, school hours (8:30 AM–2:30 PM), evening supervised study hall (6:00 PM–8:30 PM), chapel devotional service, and healthy balanced dining. Saturday 10:00 AM–3:00 PM is reserved exclusively for visiting parents.
            </p>
            <span className="text-[11px] font-semibold text-amber-900 dark:text-amber-200">
              Personal items to pack: Bible, mosquito net, blanket, trunk box, utensils, uniform sets, bucket, study lamp.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-wrap justify-between items-center gap-3 shrink-0">
          <button
            onClick={handleDownload}
            className="px-4 py-2.5 rounded-lg bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-950 font-bold text-xs flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>{downloaded ? "Prospectus Downloaded!" : "Download Full PDF Brochure"}</span>
          </button>

          <div className="flex gap-2">
            {onOpenEnquiry && (
              <button
                onClick={() => {
                  onClose();
                  onOpenEnquiry();
                }}
                className="px-5 py-2.5 rounded-lg bg-[#c8161d] hover:bg-[#9e1016] text-white font-bold text-xs transition-colors"
              >
                Apply Online Now
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
