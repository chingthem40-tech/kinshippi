import React, { useState, useMemo } from 'react';
import { 
  Search, X, ChevronDown, ChevronUp, CheckCircle2, 
  AlertCircle, Shield, Award, BookOpen, Clock, Heart, 
  FileText, Home, DollarSign, SlidersHorizontal
} from 'lucide-react';
import { SCHOOL_RULES, AWARDS_POLICY } from '../data/schoolData';

export interface RuleCategoryItem {
  id: string;
  ruleNumber: number;
  title: string;
  category: 'Fees' | 'Attendance' | 'Conduct' | 'Discipline' | 'Awards' | 'Hostel' | 'Documentation';
  summary: string;
  icon: React.ElementType;
  keywords: string[];
  renderContent: () => React.ReactNode;
}

export const SchoolRulesSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'rule-1': true, // Rule 1 open by default
  });

  // All 8 authentic rule categories with rich searchable content
  const ruleItems: RuleCategoryItem[] = useMemo(() => [
    {
      id: 'rule-1',
      ruleNumber: 1,
      title: 'Tuition Fees Schedule & Concession Policy',
      category: 'Fees',
      summary: '12 months fee schedule, advance payment on/before 10th, and 4th biological child 100% tuition concession.',
      icon: DollarSign,
      keywords: ['tuition', 'fee', 'fees', 'monthly', 'concession', 'fourth child', '4th child', 'payment', 'discount', 'free', 'cost', 'schedule'],
      renderContent: () => (
        <div className="space-y-3 pt-3 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-700/60 leading-relaxed">
          <p className="flex items-start gap-2">
            <span className="font-bold text-[#c8161d]">•</span>
            <span>School fees are charged for <strong>twelve (12) calendar months</strong> in full.</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="font-bold text-[#c8161d]">•</span>
            <span>Monthly fees must be paid in advance or on/before the <strong>10th of every month</strong>. Fees may be periodically reviewed by the Governing Body.</span>
          </p>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-900 dark:text-emerald-300">
            <strong className="block font-bold text-xs mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Unique Family Concession Policy:</span>
            </strong>
            <p className="text-[11px] leading-relaxed">
              Every <strong>fourth child</strong> of the same biological parent pays <strong>zero (0) monthly tuition fees</strong> throughout their entire student tenure at Kinship High School.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'rule-2',
      ruleNumber: 2,
      title: '90% Mandatory Attendance, Medical Leave & Absence Fines',
      category: 'Attendance',
      summary: 'Strict 90% attendance requirement for final exam promotion, medical certificate protocol, and fine schedule.',
      icon: Clock,
      keywords: ['attendance', 'absent', 'absence', 'fine', 'fines', 'medical', 'leave', 'sick', 'doctor', 'expulsion', 'promotion', 'bunk', 'late', 'regular'],
      renderContent: () => (
        <div className="space-y-3 pt-3 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-700/60 leading-relaxed">
          <ol className="list-decimal pl-5 space-y-1.5">
            <li>A regular student must maintain at least <strong>90% attendance</strong> across instructional school days.</li>
            <li>In case of sickness, submit a written application supported by a medical certificate to the Academic Dean.</li>
            <li><strong>Expulsion rule:</strong> A student absent for 5 consecutive days in a calendar month without approved permission will be struck off the rolls without notice.</li>
            <li>Students falling below 90% attendance cannot sit for the final promotion / board examination.</li>
          </ol>

          <div className="mt-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
            <strong className="block text-slate-900 dark:text-white font-semibold mb-2 text-xs">
              Unexcused Absence Fine Schedule:
            </strong>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
              {SCHOOL_RULES.attendanceFines.map((f, i) => (
                <div key={i} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                  <span className="block text-slate-500 font-sans text-[10px] truncate">{f.tier}</span>
                  <strong className="text-red-600 dark:text-red-400 font-bold">{f.fine}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'rule-3',
      ruleNumber: 3,
      title: 'Code of Conduct: Do’s for Students (9 Core Standards)',
      category: 'Conduct',
      summary: 'Daily English speaking campus, punctual arrival, polished uniforms, classroom cleanliness, and courtesy.',
      icon: CheckCircle2,
      keywords: ['dos', 'conduct', 'cleanliness', 'uniform', 'shoes', 'grooming', 'english', 'speaking', 'respect', 'homework', 'integrity', 'courtesy', 'lights', 'fans'],
      renderContent: () => (
        <div className="pt-3 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-700/60">
          <ol className="list-decimal pl-5 space-y-2">
            {SCHOOL_RULES.dos.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>
      ),
    },
    {
      id: 'rule-4',
      ruleNumber: 4,
      title: 'Prohibitions: Don’ts for Students (Mobiles, Gadgets & Conduct)',
      category: 'Conduct',
      summary: 'Strict ban on smartphones, electronic gadgets, expensive jewellery, paan, fighting, and unauthorized outings.',
      icon: AlertCircle,
      keywords: ['donts', 'mobile', 'phone', 'phones', 'gadget', 'gadgets', 'jewellery', 'gold', 'paan', 'tobacco', 'haircut', 'bullying', 'fighting', 'chewing gum', 'bunking'],
      renderContent: () => (
        <div className="pt-3 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-700/60">
          <ol className="list-decimal pl-5 space-y-2">
            {SCHOOL_RULES.donts.map((item, idx) => (
              <li key={idx} className="leading-relaxed text-red-900/90 dark:text-red-200/90 font-medium">
                {item}
              </li>
            ))}
          </ol>
        </div>
      ),
    },
    {
      id: 'rule-5',
      ruleNumber: 5,
      title: 'Disciplinary Sanctions & Zero-Tolerance Protocols',
      category: 'Discipline',
      summary: 'Zero tolerance toward insubordination, intoxicants, theft, forging signatures, or property damage.',
      icon: Shield,
      keywords: ['discipline', 'suspension', 'expulsion', 'dismissal', 'narcotics', 'alcohol', 'smoking', 'tobacco', 'forgery', 'theft', 'damage', 'vandalism', 'unions'],
      renderContent: () => (
        <div className="pt-3 text-xs text-slate-600 dark:text-slate-300 space-y-2 border-t border-slate-200 dark:border-slate-700/60 leading-relaxed">
          <p className="flex items-start gap-2">
            <span className="text-red-500 font-bold">•</span>
            <span>Insubordination, disrespect toward faculty, communal provocation, or interfering in school governance invites immediate suspension or dismissal.</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-red-500 font-bold">•</span>
            <span><strong>Intoxicant ban:</strong> Alcohol, narcotics, tobacco, smoking, and paan are strictly forbidden anytime, anywhere on or off campus. Action: instant dismissal.</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-red-500 font-bold">•</span>
            <span>Forging signatures, altercations, and theft are severe offences resulting in expulsion without re-admission.</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-red-500 font-bold">•</span>
            <span>Any physical damage to school desks, laboratory equipment, or library books must be compensated in full by the student concerned.</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-red-500 font-bold">•</span>
            <span>Unauthorized unions, collection drives, and unsanctioned class picnics are strictly banned.</span>
          </p>
        </div>
      ),
    },
    {
      id: 'rule-6',
      ruleNumber: 6,
      title: 'Academic Awards, HSLC Cash Prizes & Topper Sponsorships',
      category: 'Awards',
      summary: '₹ 20,000 for State Top 10 in HSLC, ₹ 2,000 letter marks in Math & Science, and 100% tuition sponsorship for class toppers.',
      icon: Award,
      keywords: ['awards', 'cash', 'prize', 'prizes', 'topper', 'scholarship', 'sponsorship', 'hslc', 'bosem', 'merit', 'distinction', 'letter marks', 'incentive', 'money'],
      renderContent: () => (
        <div className="pt-3 text-xs text-slate-600 dark:text-slate-300 space-y-2.5 border-t border-slate-200 dark:border-slate-700/60">
          {AWARDS_POLICY.map((award, i) => (
            <div key={i} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{award.title}</span>
                <p className="text-[11px] text-slate-500 mt-0.5">{award.description}</p>
              </div>
              <span className="px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-mono font-bold text-xs whitespace-nowrap self-start sm:self-auto border border-amber-300/40">
                {award.amount}
              </span>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'rule-7',
      ruleNumber: 7,
      title: 'Comprehensive Boarding & Hostel Regulations (17 Official Rules)',
      category: 'Hostel',
      summary: 'Supervised study hours (6:00-8:30 PM), Sunday chapel, English compound language, warden gate-passes, and visiting hours.',
      icon: Home,
      keywords: ['hostel', 'boarding', 'boarders', 'dorm', 'dormitory', 'chapel', 'prayer', 'mess', 'warden', 'lights out', 'study hours', 'pocket money', 'medical checkup', 'pass', 'visiting', 'saturdays'],
      renderContent: () => (
        <div className="pt-3 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-700/60">
          <div className="mb-3 px-3 py-2 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 rounded-lg text-blue-900 dark:text-blue-200 text-[11px] font-medium">
            Strict adherence to the 17 boarding rules is mandatory for both boys and girls residential wings.
          </div>
          <ol className="list-decimal pl-5 space-y-2">
            {SCHOOL_RULES.hostelRules.map((rule, idx) => (
              <li key={idx} className="leading-relaxed">
                {rule}
              </li>
            ))}
          </ol>
        </div>
      ),
    },
    {
      id: 'rule-8',
      ruleNumber: 8,
      title: 'Transfer Certificate (TC) Issuance Guidelines',
      category: 'Documentation',
      summary: 'Prompt issuance within 1 working day after clearance of dues and ₹ 1,000 processing fee.',
      icon: FileText,
      keywords: ['transfer', 'certificate', 'tc', 'withdrawal', 'leaving', 'clearance', 'library dues', 'working day', 'application'],
      renderContent: () => (
        <div className="pt-3 text-xs text-slate-600 dark:text-slate-300 space-y-2 border-t border-slate-200 dark:border-slate-700/60 leading-relaxed">
          <p className="flex items-start gap-2">
            <span className="font-bold text-[#c8161d]">•</span>
            <span>Transfer certificates are issued <strong>within one (1) working day</strong> following receipt of written requisition from the parent/guardian.</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="font-bold text-[#c8161d]">•</span>
            <span>An administrative processing fee of <strong>₹ 1,000</strong> applies.</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="font-bold text-[#c8161d]">•</span>
            <span>Students withdrawing mid-session must settle all annual tuition dues and return all library books before the TC release.</span>
          </p>
        </div>
      ),
    },
  ], []);

  // Filter items based on user input and category filter
  const filteredRules = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return ruleItems.filter((item) => {
      // Category filter match
      const categoryMatch = selectedCategory === 'All' || item.category === selectedCategory;
      if (!categoryMatch) return false;

      // Text search match
      if (!q) return true;

      const titleMatch = item.title.toLowerCase().includes(q);
      const summaryMatch = item.summary.toLowerCase().includes(q);
      const keywordMatch = item.keywords.some((kw) => kw.toLowerCase().includes(q));

      return titleMatch || summaryMatch || keywordMatch;
    });
  }, [ruleItems, searchQuery, selectedCategory]);

  // Toggle single accordion
  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Expand all or collapse all
  const handleExpandAll = () => {
    const allOpen: Record<string, boolean> = {};
    filteredRules.forEach((item) => {
      allOpen[item.id] = true;
    });
    setOpenItems(allOpen);
  };

  const handleCollapseAll = () => {
    setOpenItems({});
  };

  const categories = ['All', 'Fees', 'Attendance', 'Conduct', 'Discipline', 'Awards', 'Hostel', 'Documentation'];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-[#c8161d]">
          Code of Conduct & Institutional Regulations
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold font-editorial text-[#0c1760] dark:text-white mt-1">
          School Rules, Policies & Awards
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl mx-auto">
          Please read these carefully with your child. Parents and guardians are essential partners in maintaining the school’s high academic and moral standards.
        </p>
      </div>

      {/* Dynamic Search Box */}
      <div className="mb-6 relative">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              const val = e.target.value;
              setSearchQuery(val);
              // When user starts searching, automatically open matching items for instant visibility
              if (val.trim()) {
                const autoOpen: Record<string, boolean> = {};
                ruleItems.forEach((r) => {
                  const q = val.toLowerCase().trim();
                  if (
                    r.title.toLowerCase().includes(q) ||
                    r.summary.toLowerCase().includes(q) ||
                    r.keywords.some((k) => k.toLowerCase().includes(q))
                  ) {
                    autoOpen[r.id] = true;
                  }
                });
                setOpenItems(autoOpen);
              }
            }}
            placeholder="Search school rules (e.g., attendance fines, 17 hostel rules, mobile phones, awards, fees)..."
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm shadow-xs focus:ring-2 focus:ring-[#0c1760] dark:focus:ring-amber-400 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#0c1760] text-amber-300 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Expand / Collapse Actions */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto text-xs">
          <button
            type="button"
            onClick={handleExpandAll}
            className="px-2.5 py-1 text-slate-600 dark:text-slate-400 hover:text-[#0c1760] dark:hover:text-amber-300 font-medium transition-colors"
          >
            Expand All
          </button>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <button
            type="button"
            onClick={handleCollapseAll}
            className="px-2.5 py-1 text-slate-600 dark:text-slate-400 hover:text-[#0c1760] dark:hover:text-amber-300 font-medium transition-colors"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Search Feedback Bar */}
      {(searchQuery.trim() || selectedCategory !== 'All') && (
        <div className="flex items-center justify-between mb-4 px-3 py-2 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          <span>
            Found <strong>{filteredRules.length}</strong> {filteredRules.length === 1 ? 'rule category' : 'rule categories'}
            {searchQuery.trim() && (
              <span> matching "<strong className="text-[#c8161d] dark:text-amber-400">{searchQuery}</strong>"</span>
            )}
            {selectedCategory !== 'All' && <span> in <strong>{selectedCategory}</strong></span>}
          </span>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="text-[11px] font-bold text-[#c8161d] dark:text-amber-400 hover:underline ml-2"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Accordion Items List */}
      <div className="space-y-3">
        {filteredRules.map((rule) => {
          const isOpen = Boolean(openItems[rule.id]);
          const IconComp = rule.icon;

          return (
            <div
              key={rule.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'border-[#0c1760]/40 dark:border-amber-400/40 bg-white dark:bg-slate-800 shadow-md ring-1 ring-[#0c1760]/10 dark:ring-amber-400/10'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {/* Accordion Header */}
              <button
                type="button"
                onClick={() => toggleItem(rule.id)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isOpen
                      ? 'bg-[#0c1760] text-amber-300'
                      : 'bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {rule.category}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                        Rule #{rule.ruleNumber}
                      </span>
                    </div>
                    <h3 className={`font-bold text-sm sm:text-base mt-1 leading-snug transition-colors ${
                      isOpen
                        ? 'text-[#0c1760] dark:text-amber-300'
                        : 'text-slate-900 dark:text-white'
                    }`}>
                      {rule.title}
                    </h3>
                  </div>
                </div>

                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-[#0c1760] dark:text-amber-300' : 'text-slate-400'
                }`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {/* Accordion Content */}
              {isOpen && (
                <div className="px-5 pb-5 pt-1 animate-in fade-in duration-200">
                  {rule.renderContent()}
                </div>
              )}
            </div>
          );
        })}

        {/* Empty State */}
        {filteredRules.length === 0 && (
          <div className="p-10 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h4 className="font-bold text-base text-slate-800 dark:text-white mb-1">
              No school regulations found
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
              We couldn't find any rules matching "<strong>{searchQuery}</strong>". Try checking keywords such as <em>attendance, hostel, fines, cash awards, mobiles, fees</em>, or reset filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 rounded-xl bg-[#0c1760] text-white hover:bg-[#1a288a] text-xs font-bold transition-all shadow-xs"
            >
              View All 8 Rule Categories
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
