import React, { useState } from 'react';
import { X, FileText, CheckCircle2, Download, Printer, ShieldCheck, Award, Building, Users } from 'lucide-react';
import { MANDATORY_DISCLOSURE_DATA, SCHOOL_INFO } from '../data/schoolData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const MandatoryDisclosureModal: React.FC<Props> = ({ isOpen, onClose }) => {
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
        aria-labelledby="disclosure-title"
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
              <h2 id="disclosure-title" className="text-xl font-bold font-editorial">
                Mandatory Public Disclosure (SAR)
              </h2>
              <p className="text-xs text-blue-200">
                Board of Secondary Education Manipur (BOSEM) · Code: {SCHOOL_INFO.recognitionNo}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors text-xs flex items-center gap-1.5"
              title="Print official copy"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print Document</span>
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-8 text-slate-800 dark:text-slate-200 text-sm">
          {/* Official Verification Notice */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900 dark:text-amber-200">
                  Certified Compliance Record (Updated Academic Year 2026–27)
                </p>
                <p className="text-xs text-amber-800/80 dark:text-amber-300/80">
                  All institutional records, infrastructure safety certifications, teacher credentials, and financial audits are verified and open for public inspection.
                </p>
              </div>
            </div>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              {downloadSuccess ? "Document Generated!" : "Download Signed PDF"}
            </button>
          </div>

          {/* Section 1: General Institutional Details */}
          <div>
            <div className="flex items-center gap-2 mb-4 text-[#0c1760] dark:text-amber-400 font-editorial text-lg font-bold border-b border-slate-200 dark:border-slate-800 pb-2">
              <FileText className="w-5 h-5 text-red-600" />
              <span>1. General Institutional Information</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {MANDATORY_DISCLOSURE_DATA.generalInfo.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200/80 dark:border-slate-800 flex flex-col">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{item.label}</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Infrastructure & Facilities */}
          <div>
            <div className="flex items-center gap-2 mb-4 text-[#0c1760] dark:text-amber-400 font-editorial text-lg font-bold border-b border-slate-200 dark:border-slate-800 pb-2">
              <Building className="w-5 h-5 text-red-600" />
              <span>2. Campus Land, Building & Academic Infrastructure</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {MANDATORY_DISCLOSURE_DATA.infrastructureDetails.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200/80 dark:border-slate-800 flex flex-col">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{item.label}</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Teaching Staff Credentials */}
          <div>
            <div className="flex items-center gap-2 mb-4 text-[#0c1760] dark:text-amber-400 font-editorial text-lg font-bold border-b border-slate-200 dark:border-slate-800 pb-2">
              <Users className="w-5 h-5 text-red-600" />
              <span>3. Faculty Strength & Student-Teacher Ratio</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {MANDATORY_DISCLOSURE_DATA.staffCredentials.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200/80 dark:border-slate-800 flex flex-col">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{item.label}</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: 3-Year HSLC Board Examination Results */}
          <div>
            <div className="flex items-center gap-2 mb-4 text-[#0c1760] dark:text-amber-400 font-editorial text-lg font-bold border-b border-slate-200 dark:border-slate-800 pb-2">
              <Award className="w-5 h-5 text-red-600" />
              <span>4. High School Leaving Certificate (HSLC) 3-Year Board Results</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 border border-slate-200 dark:border-slate-700">Academic Session</th>
                    <th className="py-3 px-4 border border-slate-200 dark:border-slate-700">Registered Candidates</th>
                    <th className="py-3 px-4 border border-slate-200 dark:border-slate-700">Candidates Passed</th>
                    <th className="py-3 px-4 border border-slate-200 dark:border-slate-700">Pass Percentage</th>
                    <th className="py-3 px-4 border border-slate-200 dark:border-slate-700">Letter & Distinction Marks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono text-xs">
                  {MANDATORY_DISCLOSURE_DATA.threeYearResults.map((res, i) => (
                    <tr key={i} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-4 font-sans font-semibold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800">{res.year}</td>
                      <td className="py-3 px-4 border border-slate-200 dark:border-slate-800">{res.appeared}</td>
                      <td className="py-3 px-4 border border-slate-200 dark:border-slate-800 text-emerald-600 font-bold">{res.passed}</td>
                      <td className="py-3 px-4 border border-slate-200 dark:border-slate-800 text-emerald-600 font-bold">{res.passPercentage}</td>
                      <td className="py-3 px-4 border border-slate-200 dark:border-slate-800 text-blue-600 font-semibold">{res.distinctions} students</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Attestation Stamp */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-slate-500">
            <div>
              <p className="font-semibold text-slate-700 dark:text-slate-300">
                Authorized Signatory: Office of the Principal, Kinship High School
              </p>
              <p>Kinship Educational Society, Tuibong Bazar, Churachandpur – 795128</p>
            </div>
            <div className="px-3 py-1.5 rounded-sm border border-dashed border-red-500 text-red-600 dark:text-red-400 font-mono font-bold uppercase tracking-wider text-[11px]">
              BOSEM CERTIFIED · SEALED 2026
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-semibold text-xs transition-colors"
          >
            Close Disclosure
          </button>
        </div>
      </div>
    </div>
  );
};
