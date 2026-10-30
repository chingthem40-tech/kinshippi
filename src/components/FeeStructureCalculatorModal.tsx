import React, { useState } from 'react';
import { X, Calculator, Check, Download, Info, ShieldCheck, Printer } from 'lucide-react';
import { FEE_TIERS, HOSTEL_FEES, SCHOOL_INFO } from '../data/schoolData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const FeeStructureCalculatorModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [selectedTierIdx, setSelectedTierIdx] = useState(1); // Default to Primary Wing (Class I–V)
  const [isBoarder, setIsBoarder] = useState(false);
  const [isFourthChild, setIsFourthChild] = useState(false);
  const [isClassTopper, setIsClassTopper] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  if (!isOpen) return null;

  const currentTier = FEE_TIERS[selectedTierIdx];

  // Base calculations
  const admissionFee = currentTier.admissionFee;
  const annualExam = currentTier.examFeeAnnual;
  const annualLab = currentTier.labLibraryAnnual;

  // Monthly tuition discount calculation
  let tuitionDiscountPercent = 0;
  let concessionReason = "";
  if (isFourthChild) {
    tuitionDiscountPercent = 100;
    concessionReason = "100% 4th Sibling Concession Applied";
  } else if (isClassTopper) {
    tuitionDiscountPercent = 100;
    concessionReason = "100% Class Topper Merit Waiver Applied";
  }

  const effectiveMonthlyTuition = Math.round(currentTier.monthlyTuition * (1 - tuitionDiscountPercent / 100));
  const annualTuition = effectiveMonthlyTuition * 12;

  // Hostel calculations
  const hostelAnnual = isBoarder
    ? (HOSTEL_FEES.admissionDeposit + (HOSTEL_FEES.monthlyBoardingAndLodging * 12) + HOSTEL_FEES.medicalCompulsoryFee + HOSTEL_FEES.studyHoursMaintenance)
    : 0;

  const totalAnnualDue = admissionFee + annualTuition + annualExam + annualLab + hostelAnnual;
  const totalSavings = (currentTier.monthlyTuition * 12) - annualTuition;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="fee-calculator-title"
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
              <h2 id="fee-calculator-title" className="text-xl font-bold font-editorial">
                Official Fee Structure & Calculator 2026–27
              </h2>
              <p className="text-xs text-blue-200">
                Transparent 12-Month Schedule · Recognised by BOSEM
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-800 dark:text-slate-200">
          {/* Important Rule Banner */}
          <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-950 dark:text-blue-200 leading-relaxed">
              <strong>Official School Fee Policy:</strong> School fees are charged for twelve (12) calendar months. Monthly fees are payable in advance or on/before the 10th of every month. Online payment via UPI, cards, and net banking is supported.
            </div>
          </div>

          {/* Controls: Class Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Select Class / Grade Wing
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {FEE_TIERS.map((tier, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedTierIdx(idx)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedTierIdx === idx
                      ? "bg-red-50 dark:bg-red-950/40 border-red-500 text-red-900 dark:text-red-200 font-semibold ring-2 ring-red-500/20"
                      : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                  }`}
                >
                  <p className="text-xs text-slate-500 dark:text-slate-400">{tier.classes}</p>
                  <p className="font-bold text-sm mt-0.5">{tier.category.split('(')[0]}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Toggles: Concessions & Boarding */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Hostel Toggle */}
            <div 
              onClick={() => setIsBoarder(!isBoarder)}
              className={`p-3.5 rounded-xl border cursor-pointer select-none transition-all ${
                isBoarder
                  ? "bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-950 dark:text-amber-200 ring-2 ring-amber-500/20"
                  : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs">Hostel / Boarding</span>
                <span className={`w-4 h-4 rounded-sm flex items-center justify-center text-xs ${isBoarder ? "bg-amber-500 text-slate-950" : "border border-slate-400"}`}>
                  {isBoarder && <Check className="w-3 h-3 stroke-[3]" />}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Lodging, meals, devotional supervision & study hours
              </p>
            </div>

            {/* 4th Child Waiver */}
            <div 
              onClick={() => {
                setIsFourthChild(!isFourthChild);
                if (!isFourthChild) setIsClassTopper(false);
              }}
              className={`p-3.5 rounded-xl border cursor-pointer select-none transition-all ${
                isFourthChild
                  ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/20"
                  : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs">4th Sibling Concession</span>
                <span className={`w-4 h-4 rounded-sm flex items-center justify-center text-xs ${isFourthChild ? "bg-emerald-600 text-white" : "border border-slate-400"}`}>
                  {isFourthChild && <Check className="w-3 h-3 stroke-[3]" />}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                100% Free monthly tuition (School Rule: 4th child waiver)
              </p>
            </div>

            {/* Class Topper Scholarship */}
            <div 
              onClick={() => {
                setIsClassTopper(!isClassTopper);
                if (!isClassTopper) setIsFourthChild(false);
              }}
              className={`p-3.5 rounded-xl border cursor-pointer select-none transition-all ${
                isClassTopper
                  ? "bg-purple-50 dark:bg-purple-950/40 border-purple-500 text-purple-950 dark:text-purple-200 ring-2 ring-purple-500/20"
                  : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs">Class Topper Award</span>
                <span className={`w-4 h-4 rounded-sm flex items-center justify-center text-xs ${isClassTopper ? "bg-purple-600 text-white" : "border border-slate-400"}`}>
                  {isClassTopper && <Check className="w-3 h-3 stroke-[3]" />}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                100% sponsored tuition for 1st rank holder
              </p>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-3 bg-slate-100 dark:bg-slate-800 font-semibold text-xs text-slate-700 dark:text-slate-300 flex justify-between items-center">
              <span>Itemized Fee Schedule Breakdown</span>
              <span>Rate (INR)</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              <div className="p-3 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Annual Admission / Re-registration</p>
                  <p className="text-[11px] text-slate-500">Includes school diary, calendar, identity card & enrolment</p>
                </div>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">₹ {admissionFee.toLocaleString()}</span>
              </div>

              <div className="p-3 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900 dark:text-white">Monthly Tuition Fee (12 Months)</p>
                    {concessionReason && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 text-[10px] font-bold">
                        {concessionReason}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Standard: ₹ {currentTier.monthlyTuition}/month × 12 months
                    {tuitionDiscountPercent > 0 && ` (Waiver: ₹ ${totalSavings.toLocaleString()} saved)`}
                  </p>
                </div>
                <div className="text-right">
                  {tuitionDiscountPercent > 0 ? (
                    <div>
                      <span className="line-through text-slate-400 mr-2">₹ {(currentTier.monthlyTuition * 12).toLocaleString()}</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">₹ 0 (Free)</span>
                    </div>
                  ) : (
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100">₹ {annualTuition.toLocaleString()}</span>
                  )}
                </div>
              </div>

              <div className="p-3 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Annual Examination Charges</p>
                  <p className="text-[11px] text-slate-500">Question papers, answer scripts, term progress reports</p>
                </div>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">₹ {annualExam.toLocaleString()}</span>
              </div>

              <div className="p-3 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Science Lab, Library & Sports Development</p>
                  <p className="text-[11px] text-slate-500">Apparatus, lab reagents, sports gear, library access</p>
                </div>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">₹ {annualLab.toLocaleString()}</span>
              </div>

              {isBoarder && (
                <>
                  <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-amber-900 dark:text-amber-200">Hostel Admission & Security Caution Deposit</p>
                      <p className="text-[11px] text-slate-500">One-time boarding enrollment & bedding allocation</p>
                    </div>
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100">₹ {HOSTEL_FEES.admissionDeposit.toLocaleString()}</span>
                  </div>

                  <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-amber-900 dark:text-amber-200">Hostel Boarding & Lodging (₹ 4,200 × 12 Months)</p>
                      <p className="text-[11px] text-slate-500">Three wholesome meals daily, afternoon tea, hostel amenities</p>
                    </div>
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100">₹ {(HOSTEL_FEES.monthlyBoardingAndLodging * 12).toLocaleString()}</span>
                  </div>

                  <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-amber-900 dark:text-amber-200">Compulsory Medical & Study Maintenance</p>
                      <p className="text-[11px] text-slate-500">First-aid clinic checkup (₹100) + evening study generator lighting (₹500)</p>
                    </div>
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100">₹ {(HOSTEL_FEES.medicalCompulsoryFee + HOSTEL_FEES.studyHoursMaintenance).toLocaleString()}</span>
                  </div>
                </>
              )}
            </div>

            {/* Total Footer */}
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-400">Total Net Annual Commitment (Academic Year 2026–27)</p>
                <p className="text-xs text-amber-400 font-medium">
                  {effectiveMonthlyTuition > 0 
                    ? `Payable monthly: ₹ ${effectiveMonthlyTuition + (isBoarder ? HOSTEL_FEES.monthlyBoardingAndLodging : 0)} / mo`
                    : `Zero monthly tuition fee applied`}
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold font-mono text-amber-400">
                  ₹ {totalAnnualDue.toLocaleString()}
                </span>
                <p className="text-[10px] text-slate-400">For 12 calendar months</p>
              </div>
            </div>
          </div>

          {/* Awards reminder */}
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-900/40 text-xs text-emerald-900 dark:text-emerald-300">
            <strong>Excellence Incentives:</strong> Students scoring letter marks (80%+) in Mathematics & Science in HSLC receive <strong>₹ 2,000 cash per subject</strong>; State Top 10 rankers receive <strong>₹ 20,000 cash</strong> from the Kinship Educational Society.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center shrink-0">
          <div className="text-xs text-slate-500">
            Pay online via UPI: <span className="font-mono font-bold text-slate-800 dark:text-slate-200">kinshiphighschool@sbi</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Schedule</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-[#c8161d] hover:bg-[#9e1016] text-white text-xs font-bold transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
