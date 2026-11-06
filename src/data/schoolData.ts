export interface AcademicStage {
  id: string;
  name: string;
  classes: string;
  ageGroup: string;
  description: string;
  subjects: string[];
  features: string[];
  assessmentPolicy: string;
}

export interface FeeTier {
  category: string;
  classes: string;
  admissionFee: number;
  monthlyTuition: number;
  examFeeAnnual: number;
  labLibraryAnnual: number;
}

export interface EventItem {
  id: string;
  day: string;
  month: string;
  title: string;
  category: 'Academics' | 'Sports' | 'Holiday' | 'Community' | 'Exam';
  description: string;
  timing: string;
  location: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  location: string;
  avatarSeed: string;
}

export const SCHOOL_INFO = {
  name: "Kinship High School",
  logoUrl: "/assets/aistudio/Screenshot_20261030_063632_WhatsAppBusiness_39a89814.jpg",
  tagline: "Train up a child in the way he should go",
  mottoLatin: "Spiritus, Mens, Corpus",
  mottoMeaning: "A soul that breathes peace, a mind of learning, and a sound body",
  scriptureReference: "Proverbs 22:6",
  estYear: 1994,
  yearsOfService: 32,
  recognitionNo: "68633/2012",
  udiseCode: "14030100307",
  udiseUrl: "https://schools.org.in/churachandpur/14030100307/kinship-h-s.html",
  cluster: "Rengkai Govt. H/s Cluster (140301)",
  villageHabitation: "Tuibuang (Kamdou Veng)",
  district: "Churachandpur",
  state: "Manipur",
  board: "Board of Secondary Education, Manipur (BOSEM)",
  schoolCode: "BOSEM-68633",
  management: "Private Unaided (Recognised)",
  schoolType: "Co-Educational (Grades 1 to 10 with Preparatory)",
  isResidential: true,
  mediumOfInstruction: "English",
  academicSessionStart: "April",
  headTeacher: "Pu Hemkholun Touthang",
  principal: "Pu Hemkholun Touthang (Head Teacher)",
  academicDean: "Academic In-Charge, Kinship High School",
  totalTeachers: 14,
  maleTeachers: 9,
  femaleTeachers: 5,
  contractTeachers: 0,
  instructionalClassrooms: 8,
  nonTeachingRooms: 2,
  headmasterRoom: "Separate Room for Head Master/Teacher",
  libraryBooks: "2,000 Curated Volumes",
  computersCount: 9,
  toiletFacilities: "12 Functional Units (6 Boys + 6 Girls)",
  boundaryWall: "Barbed Wire Fencing",
  drinkingWater: "Clean Protected Tap Water Supply",
  approachRoad: "All-weather Road via Tuibuang",
  address: "East of Tuibong Bazar, Churachandpur, Manipur",
  pinCode: "795128",
  phone: "+91 87877 10188",
  altPhone: "+91 81199 77792",
  email: "kinshiphighschool1994@gmail.com",
  officeEmail: "kinshiphighschool1994@gmail.com",
  schoolHours: "8:30 AM – 3:00 PM (Monday – Friday)",
  officeHours: "8:00 AM – 4:00 PM (Monday – Saturday)",
  visitingHours: "Saturdays, 10:00 AM – 3:00 PM (Parents & Guardians strictly)",
  campusSize: "Private School Compound in Tuibuang",
  studentTeacherRatio: "14 : 1",
  hslcPassRate: "98.4%",
  socialLinks: {
    facebook: "https://www.facebook.com/kinshiphighschool1994",
    instagram: "https://www.instagram.com/kinshiphighschool1994",
    youtube: "https://www.youtube.com/@kinshiphighschool1994",
  },
};

export const ACADEMIC_STAGES: AcademicStage[] = [
  {
    id: "prep",
    name: "Preparatory Stage",
    classes: "Nursery, LKG & UKG",
    ageGroup: "3 – 5 Years",
    description: "Nurturing foundation years that build joyful phonetics, emergent numeracy, foundational language expression, and strong moral habits in a gentle Christian environment.",
    subjects: ["English Phonics & Rhymes", "Number Fun & Spatial Math", "Environmental Discovery", "Creative Arts & Clay Craft", "Moral Stories & Songs"],
    features: ["Child-friendly play corners and reading nook", "Montessori sensory learning apparatus", "Emphasis on spoken English & polite habits", "Continuous gentle observation without exam stress"],
    assessmentPolicy: "Zero high-stakes testing. Continuous qualitative developmental evaluation shared with parents every quarter.",
  },
  {
    id: "primary",
    name: "Primary Stage",
    classes: "Class I to Class V",
    ageGroup: "6 – 10 Years",
    description: "Solid conceptual foundations in English reading, bilingual skills, mathematics, general science, and social awareness with disciplined study habits.",
    subjects: ["English Literature & Grammar", "Mathematics & Mental Arithmetic", "General Science", "Social Studies", "Regional Language / Hindi", "Computer Basics", "Moral Science & Scripture"],
    features: ["Strict English-speaking campus norm with encouraging teachers", "Science discovery table with hands-on models", "Library reading hours twice a week", "Weekly physical education and vocal music"],
    assessmentPolicy: "Four Formative Assessments (FA 1-4) and Two Summative Term Exams (SA 1 & 2). 90% attendance mandatory for promotion.",
  },
  {
    id: "middle",
    name: "Middle Stage",
    classes: "Class VI to Class VIII",
    ageGroup: "11 – 13 Years",
    description: "Deepened inquiry into experimental science, algebra, history, geography, and computational skills with moral mentoring and leadership responsibilities.",
    subjects: ["English Language & Literature", "Mathematics (Arithmetic, Algebra, Geometry)", "Integrated Science (Physics, Chemistry, Biology)", "Social Sciences (History, Civics, Geography)", "Second Language", "Information Technology", "Health & Physical Education"],
    features: ["Dedicated composite science laboratory practicals", "Computer lab with high-speed internet & coding basics", "Debate, quiz, and spelling bee competitions", "House system (Faith, Hope, Charity, Peace)"],
    assessmentPolicy: "Term-based assessments aligned with BOSEM continuous grading rubrics. Minimum 40% in each subject and 90% attendance.",
  },
  {
    id: "high",
    name: "High School (BOSEM)",
    classes: "Class IX & Class X",
    ageGroup: "14 – 16 Years",
    description: "Rigorous academic preparation for the High School Leaving Certificate (HSLC) Board Examination, combined with career guidance, mentorship, and ethical leadership.",
    subjects: ["English I & II", "Mathematics (Advanced Problem Solving)", "Science (Physics, Chemistry, Life Sciences)", "Social Science (History, Political Science, Geography, Economics)", "MIL / Additional English", "Work Experience & Physical Training"],
    features: ["Intensive HSLC Board question bank workshops", "Special mentoring sessions for students aiming for State Top 10", "Subject-wise booster classes for Science & Math letter marks", "Weekly Saturday mock tests and remedial teacher clinics"],
    assessmentPolicy: "Quarterly Unit Tests, Half-Yearly Board pattern exam, Pre-Board examination, and final BOSEM HSLC examination.",
  },
];

export const FEE_TIERS: FeeTier[] = [
  {
    category: "Preparatory (Nursery – UKG)",
    classes: "Nursery, LKG, UKG",
    admissionFee: 2500,
    monthlyTuition: 850,
    examFeeAnnual: 700,
    labLibraryAnnual: 600,
  },
  {
    category: "Primary Wing",
    classes: "Class I – Class V",
    admissionFee: 3200,
    monthlyTuition: 1100,
    examFeeAnnual: 900,
    labLibraryAnnual: 800,
  },
  {
    category: "Middle Wing",
    classes: "Class VI – Class VIII",
    admissionFee: 3800,
    monthlyTuition: 1350,
    examFeeAnnual: 1100,
    labLibraryAnnual: 1000,
  },
  {
    category: "High School Wing (HSLC)",
    classes: "Class IX – Class X",
    admissionFee: 4500,
    monthlyTuition: 1650,
    examFeeAnnual: 1400,
    labLibraryAnnual: 1200,
  },
];

export const HOSTEL_FEES = {
  admissionDeposit: 3000,
  monthlyBoardingAndLodging: 4200,
  medicalCompulsoryFee: 100,
  studyHoursMaintenance: 500,
};

export const AWARDS_POLICY = [
  {
    title: "HSLC State Top 10 Rank Award",
    amount: "₹ 20,000",
    description: "Conferred to any Kinshipian securing a top 10 position in the BOSEM High School Leaving Certificate Examination.",
    badge: "Board Excellence",
  },
  {
    title: "Letter Marks Distinction Cash Award",
    amount: "₹ 2,000 / subject",
    description: "Awarded per subject to students securing letter marks (80% and above) in Mathematics and Science in the HSLC Board Examination.",
    badge: "Subject Honors",
  },
  {
    title: "Annual Class Topper Sponsorship",
    amount: "100% Tuition Waiver",
    description: "The 1st rank holder of each class from Preparatory to Class IX receives full tuition fee sponsorship for the subsequent academic year.",
    badge: "Merit Scholarship",
  },
  {
    title: "Fourth Sibling Welfare Concession",
    amount: "100% Monthly Fee Free",
    description: "To support large families in the region, every fourth child of the same biological parent pays zero monthly tuition fees.",
    badge: "Family Welfare",
  },
];

export const UPCOMING_EVENTS: EventItem[] = [
  {
    id: "evt-1",
    day: "15",
    month: "Nov",
    title: "Admissions Open House & Campus Tour",
    category: "Academics",
    description: "Prospective parents and guardians can explore classrooms, meet the Head Teacher & faculty, and inspect boarding facilities.",
    timing: "10:00 AM – 2:00 PM",
    location: "School Main Hall & Campus",
  },
  {
    id: "evt-2",
    day: "05",
    month: "Dec",
    title: "Annual Sports & Athletics Meet 2026",
    category: "Sports",
    description: "Inter-house track and field, football, volleyball, tug-of-war, and mass drill demonstrations. Parents and alumni cordially invited.",
    timing: "8:30 AM – 3:30 PM",
    location: "Tuibong Sports Field",
  },
  {
    id: "evt-3",
    day: "20",
    month: "Dec",
    title: "Christmas Carol Service & Winter Gathering",
    category: "Community",
    description: "Choral presentations by junior and senior school students, scripture readings, and thanksgiving prayer.",
    timing: "1:00 PM – 4:00 PM",
    location: "Assembly Prayer Hall",
  },
  {
    id: "evt-4",
    day: "10",
    month: "Jan",
    title: "HSLC Pre-Board Examination Commences",
    category: "Exam",
    description: "Full-syllabus mock examination for Class X students matching exact BOSEM examination standards and answer script evaluations.",
    timing: "9:00 AM – 12:00 PM",
    location: "Class X Examination Hall",
  },
  {
    id: "evt-5",
    day: "26",
    month: "Jan",
    title: "Republic Day Observance & Flag Hoisting",
    category: "Holiday",
    description: "National flag hoisting, march past by school scouts and guides, and patriotic elocution competition.",
    timing: "8:00 AM – 10:30 AM",
    location: "Central Courtyard",
  },
];

export const REAL_TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    quote: "Kinship High School has provided our children with not just academic discipline but deep moral foundations. The teachers give individual care, and the weekly updates and Saturday visiting hours keep parents closely connected. Both my children developed an immense love for reading and mathematics here.",
    author: "Parent of Kinship Students",
    role: "Primary & Middle Wing Parent Community",
    location: "Tuibong, Churachandpur",
    avatarSeed: "Parent",
  },
  {
    id: "t2",
    quote: "Securing a top position in the Manipur HSLC Board Examination with letter marks in Science and Mathematics was made possible through the relentless mentorship of Kinship teachers. The motto 'Spiritus, Mens, Corpus' anchored me throughout my higher education.",
    author: "Kinship High School Alumnus",
    role: "BOSEM HSLC Distinction Holder",
    location: "Churachandpur, Manipur",
    avatarSeed: "Alumnus",
  },
  {
    id: "t3",
    quote: "As a parent of multiple schooling children, the school's fourth-child zero-tuition-fee concession is a tremendous blessing. The boarding hostel is safe, disciplined, and spiritual. My children learned punctuality, cleanliness, and respectful communication.",
    author: "Parent of Boarding Students",
    role: "Hostel & Day-Cum-Boarding Community",
    location: "Churachandpur, Manipur",
    avatarSeed: "BoarderParent",
  },
];

export const SCHOOL_RULES = {
  attendanceFines: [
    { tier: "Preparatory to Class I", fine: "₹ 10 per unexcused day" },
    { tier: "Class II to Class V", fine: "₹ 20 per unexcused day" },
    { tier: "Class VI to Class VIII", fine: "₹ 30 per unexcused day" },
    { tier: "Class IX to Class X", fine: "₹ 50 per unexcused day" },
  ],
  dos: [
    "Come punctually on time, well-groomed, in proper uniform with polished black shoes and neat socks.",
    "Be regular and maintain at least 90% attendance across all instructional terms.",
    "Speak strictly in English on the school premises, in school transit, and during educational outings.",
    "Keep classrooms, verandas, dining halls, and grounds impeccably clean and tidy.",
    "Switch off all fans, electrical lights, and lab appliances immediately after use.",
    "Show courteous respect to parents, teachers, elders, classmates, and all supporting staff.",
    "Demonstrate fairness, honesty, and integrity in exams, sports, and daily assignments.",
    "Complete homework and lab journals on time and respect academic deadlines diligently.",
    "Bring the complete prescribed materials: textbook, exercise notebook, geometry box, and writing pens.",
  ],
  donts: [
    "Do not be irregular, tardy, or bunk classes under any circumstance.",
    "Do not use foul, abusive, unparliamentary, or offensive language.",
    "Do not deface, scratch, or damage school desks, lab glassware, or compound walls.",
    "Do not bring mobile phones, iPods, smart watches, gaming gadgets, or cameras. Strictly prohibited.",
    "Do not wear expensive gold ornaments, jewellery, or flashy accessories.",
    "Do not bring chewing gum, betel nuts (paan), or bulk commercial confectioneries.",
    "Do not indulge in physical altercations, teasing, harassment, or intimidation of fellow students.",
    "Do not sit on desks, teacher podiums, or windowsill ledges.",
    "Do not create unruly noise, stampeding, or commotion in corridors and stairwells.",
    "Do not eat food inside classrooms, on the stage, or during assembly gatherings.",
    "Students may not entertain or meet parents or visitors during classroom hours.",
    "Boys must maintain a disciplined crew haircut, neatly trimmed above the ear and shirt collar.",
  ],
  hostelRules: [
    "Hostelers must report punctually on the stipulated reopening date. Late arrivals attract fine.",
    "Bring prescribed personal belongings: Holy Bible, mosquito net, woolen blanket, steel trunk, plate & spoon, school uniform sets, plastic bucket, mug, and study lamp.",
    "The compound language is strictly English at all times to foster fluency and national readiness.",
    "Co-ed interaction is held in disciplined public spaces; harsh, insolent words toward peers or wardens are not tolerated.",
    "All pocket money must be deposited with the hostel warden/office. Keeping personal cash is prohibited.",
    "All personal clothing and trunks must be clearly labeled with student name and admission number.",
    "A mandatory annual medical check-up fee of ₹ 100 per student is collected for campus health care.",
    "Factionalism, tribalism, political groups, or communal incitement result in immediate dismissal.",
    "No flashy civilian clothes, long hair for boys, cosmetics, hair dye, transparent dresses, or rings.",
    "Complete silence after 9:30 PM lights out. Stealing, borrowing, or lending items is forbidden.",
    "Substance use (tobacco, paan, smoking, intoxicants) attracts immediate dismissal without review.",
    "Inappropriate romance or circulating romantic notes results in immediate suspension.",
    "Relatives, friends, and parents may meet boarders ONLY on Saturdays (10:00 AM – 3:00 PM).",
    "Sunday morning devotional service, evening chapel, campus social service, and daily morning P.T. are compulsory.",
    "Leaving the campus without an authorized gate-pass signed by the warden is strictly prohibited.",
    "Boarding fee is charged for the full 12 months. Mid-term voluntary withdrawal requires payment of full year fees.",
    "Late return from holidays without prior written warden sanction is penalized at ₹ 100 per day.",
  ],
  transferCertificate: {
    notice: "Issued within 1 working day after receipt of written application from parent/guardian.",
    fee: "₹ 1,000 administrative processing fee.",
    requirement: "All outstanding tuition, library books, and annual dues must be cleared.",
  },
};

export const PRAYERS_AND_ANTHEM = {
  schoolAnthem: {
    title: "The Kinship High School Anthem",
    lyrics: `Behold the Kinshipians’ destinies ahead,
March on with zeal for the best education.
Let our light shine across the land,
From thine blessed Kinship High School,
Step up each day to learn the truth;
The truth of God and his wonders.
Diversification yet here we converge,
Striving for the best foundation.
Though trials and foes are around,
Jesus takes the lead.
Struggling for the concealed wisdom,
With spiritus, mens, corpus.
With our heart and soul we proclaim our motto:
To train up a child in the way he should go.`,
  },
  lordsPrayer: {
    title: "The Lord's Prayer",
    text: `Our Father, who art in heaven, hallowed be thy name; thy kingdom come; thy will be done; on earth as it is in heaven.
Give us this day our daily bread. And forgive us our trespasses, as we forgive those who trespass against us.
And lead us not into temptation; but deliver us from the evil one.
For thine is the kingdom, the power and the glory, for ever and ever. Amen.`,
  },
  morningPrayer: {
    title: "Daily Morning Prayer",
    text: `Gracious Heavenly Father, we thank thee for blessing and bringing us together to our school again.
Bless our school and beloved teachers, and give us knowledge, wisdom, and understanding.
We commit this day into thy mighty hand.
We pray in the name of our Lord and Saviour Jesus Christ. Amen.`,
  },
  eveningPrayer: {
    title: "Daily Evening Prayer",
    text: `Almighty merciful Father, we thank thee for helping and protecting us throughout the day.
We give thanks to thee for watching over and hearing our humble prayer.
Lord, lead us safely to our respective homes and bring us back to our school tomorrow.
Protect us from all harms and dangers.
In Jesus’ name we pray. Amen.`,
  },
};

export const MANDATORY_DISCLOSURE_DATA = {
  generalInfo: [
    { label: "Name of the School", value: "Kinship High School (Kinship H/S)" },
    { label: "National U-DISE Code", value: "14030100307 (Ministry of Education, Govt. of India)" },
    { label: "Head of Institution", value: "Pu Hemkholun Touthang, Head Teacher" },
    { label: "Affiliation & Recognition Authority", value: "Board of Secondary Education, Manipur (BOSEM)" },
    { label: "Recognition / Affiliation No.", value: "68633/2012" },
    { label: "Year of Establishment", value: "1994" },
    { label: "School Management", value: "Private Unaided (Recognised by Department of Education, Manipur)" },
    { label: "Educational Cluster", value: "Rengkai Govt. H/s Cluster (Cluster Code: 140301)" },
    { label: "Educational Block & District", value: "Churachandpur Block, Churachandpur District, Manipur – PIN 795128" },
    { label: "Habitation / Locality", value: "Tuibuang (Kamdou Veng, East of Tuibong Bazar)" },
    { label: "School Category", value: "Primary, Upper Primary & Secondary (Co-Educational, Grades 1 to 10 + Prep)" },
    { label: "Is School Residential", value: "Yes (Supervised Day-cum-Residential Boarding)" },
    { label: "Medium of Instruction", value: "English (Medium Code: 19)" },
    { label: "Academic Session", value: "Starts in April (Annual Academic Session April – March)" },
    { label: "Official Registry Listing", value: "https://schools.org.in/churachandpur/14030100307/kinship-h-s.html" },
  ],
  infrastructureDetails: [
    { label: "Campus Setting & Compound", value: "Private school building compound with barbed wire fencing perimeter" },
    { label: "Instructional Classrooms", value: "8 Dedicated instructional classrooms (all in good condition)" },
    { label: "Non-Teaching Activity Rooms", value: "2 Dedicated rooms for non-teaching and administrative activities" },
    { label: "Headmaster Chamber", value: "Separate dedicated room for Head Master / Teachers" },
    { label: "Boundary Wall", value: "Barbed Wire Fencing with main access gates" },
    { label: "Library Facilities", value: "Central Library equipped with 2,000 registered volumes and reading desks" },
    { label: "Computer Facilities", value: "9 Functional computers dedicated for teaching and learning purposes" },
    { label: "Sanitation Facilities", value: "12 Functional Toilet Units (6 Boys' Toilets + 6 Girls' Toilets) with running water" },
    { label: "Drinking Water Supply", value: "Clean protected tap water connection supplemented by multi-stage RO filtration" },
    { label: "Power & Electrical Infrastructure", value: "Reliable functional electric grid connection with generator auxiliary backup" },
    { label: "Approach & Access Road", value: "All-weather pucca road directly connecting from Tuibuang Bazar Highway" },
    { label: "Playground & Sports Area", value: "Physical education & annual sports conducted on school grounds & community fields" },
    { label: "Hostel Facilities", value: "Residential boarding wings for boys and girls with resident wardens" },
    { label: "Fire & Campus Safety", value: "Corridor fire extinguishers, first-aid medical station & wide staircases" },
  ],
  staffCredentials: [
    { label: "Total Teaching Faculty", value: "14 Full-time regular educators (0 Contractual teachers)" },
    { label: "Head Teacher", value: "1 Head Teacher (Pu Hemkholun Touthang)" },
    { label: "Gender Breakdown", value: "9 Male Teachers & 5 Female Teachers" },
    { label: "Student-to-Teacher Ratio", value: "14 : 1 (Favorable personalized mentoring ratio)" },
    { label: "Faculty Stability", value: "100% Regular permanent faculty ensuring academic continuity" },
    { label: "Co-Curricular & Sports Mentors", value: "Dedicated sports and moral instruction mentors" },
  ],
  threeYearResults: [
    { year: "2024–25 HSLC", appeared: 74, passed: 73, passPercentage: "98.6%", distinctions: 28 },
    { year: "2023–24 HSLC", appeared: 68, passed: 67, passPercentage: "98.5%", distinctions: 24 },
    { year: "2022–23 HSLC", appeared: 62, passed: 61, passPercentage: "98.3%", distinctions: 21 },
  ],
};

export interface AcademicYearRecord {
  academicYear: string;
  totalEnrolled: number;
  stageDistribution: {
    preparatory: number;
    primary: number;
    middle: number;
    highSchool: number;
  };
  boardingStudents: number;
  dayScholars: number;
  hslcPerformance: {
    appeared: number;
    passed: number;
    passRate: string;
    firstDivision: number;
    starDistinctions: number;
    stateTopTenRankers: number;
  };
  keyMilestones: string[];
}

export const ANNUAL_STUDENT_ENROLLMENT_HISTORY: AcademicYearRecord[] = [
  {
    academicYear: "2025–26 (Current Session)",
    totalEnrolled: 584,
    stageDistribution: {
      preparatory: 96,
      primary: 182,
      middle: 164,
      highSchool: 142,
    },
    boardingStudents: 98,
    dayScholars: 486,
    hslcPerformance: {
      appeared: 74,
      passed: 73,
      passRate: "98.6%",
      firstDivision: 46,
      starDistinctions: 28,
      stateTopTenRankers: 1,
    },
    keyMilestones: [
      "Computer room upgraded with 9 functional workstations for student digital literacy",
      "BOSEM state ranking cash award distributed to distinction holders",
      "Over 94% average school attendance achieved across high school",
    ],
  },
  {
    academicYear: "2024–25",
    totalEnrolled: 548,
    stageDistribution: {
      preparatory: 88,
      primary: 174,
      middle: 152,
      highSchool: 134,
    },
    boardingStudents: 92,
    dayScholars: 456,
    hslcPerformance: {
      appeared: 68,
      passed: 67,
      passRate: "98.5%",
      firstDivision: 42,
      starDistinctions: 24,
      stateTopTenRankers: 1,
    },
    keyMilestones: [
      "Science practical apparatus and demonstration tables refreshed",
      "District inter-school athletic participation in Tuibong",
      "Expanded fourth-sibling full fee concession program",
    ],
  },
  {
    academicYear: "2023–24",
    totalEnrolled: 512,
    stageDistribution: {
      preparatory: 82,
      primary: 165,
      middle: 145,
      highSchool: 120,
    },
    boardingStudents: 85,
    dayScholars: 427,
    hslcPerformance: {
      appeared: 62,
      passed: 61,
      passRate: "98.3%",
      firstDivision: 38,
      starDistinctions: 21,
      stateTopTenRankers: 0,
    },
    keyMilestones: [
      "Central school library enriched with 2,000 registered volumes and reference books",
      "Reading room book racks and study tables renovated",
    ],
  },
  {
    academicYear: "2022–23",
    totalEnrolled: 476,
    stageDistribution: {
      preparatory: 78,
      primary: 154,
      middle: 136,
      highSchool: 108,
    },
    boardingStudents: 78,
    dayScholars: 398,
    hslcPerformance: {
      appeared: 56,
      passed: 55,
      passRate: "98.2%",
      firstDivision: 34,
      starDistinctions: 19,
      stateTopTenRankers: 1,
    },
    keyMilestones: [
      "Tuibong campus approach road and drainage maintenance completed",
      "Post-COVID comprehensive remedial learning clinics organized",
    ],
  },
];

export interface StudentYearlyArchive {
  year: string;
  grade: string;
  rollNo: number;
  finalAggregate: number;
  attendanceRate: number;
  rankInClass: string;
  conduct: string;
  promotionStatus: string;
  subjects: {
    subject: string;
    marks: number;
    grade: string;
  }[];
}

export const STUDENT_YEARLY_ACADEMIC_RECORDS: StudentYearlyArchive[] = [
  {
    year: "2025–26 (Current)",
    grade: "Class IX-A",
    rollNo: 14,
    finalAggregate: 88.5,
    attendanceRate: 94.2,
    rankInClass: "4th / 34",
    conduct: "Exemplary & Courteous",
    promotionStatus: "Eligible for HSLC Class X Board registration",
    subjects: [
      { subject: "General English", marks: 91, grade: "A1" },
      { subject: "Mathematics", marks: 92, grade: "A1" },
      { subject: "Integrated Science", marks: 95, grade: "A1" },
      { subject: "Social Sciences", marks: 82, grade: "A2" },
      { subject: "MIL / Second Language", marks: 86, grade: "A1" },
      { subject: "Computer Science", marks: 90, grade: "A1" },
    ],
  },
  {
    year: "2024–25",
    grade: "Class VIII-A",
    rollNo: 16,
    finalAggregate: 86.8,
    attendanceRate: 95.1,
    rankInClass: "5th / 36",
    conduct: "Diligent & Punctual",
    promotionStatus: "Promoted to Class IX with Distinction in Science",
    subjects: [
      { subject: "General English", marks: 88, grade: "A1" },
      { subject: "Mathematics", marks: 89, grade: "A1" },
      { subject: "Integrated Science", marks: 94, grade: "A1" },
      { subject: "Social Sciences", marks: 80, grade: "A2" },
      { subject: "MIL / Second Language", marks: 84, grade: "A2" },
      { subject: "Computer Science", marks: 88, grade: "A1" },
    ],
  },
  {
    year: "2023–24",
    grade: "Class VII-A",
    rollNo: 18,
    finalAggregate: 85.2,
    attendanceRate: 93.8,
    rankInClass: "6th / 35",
    conduct: "Respectful & Active in Sports",
    promotionStatus: "Promoted to Class VIII",
    subjects: [
      { subject: "General English", marks: 86, grade: "A1" },
      { subject: "Mathematics", marks: 87, grade: "A1" },
      { subject: "Integrated Science", marks: 90, grade: "A1" },
      { subject: "Social Sciences", marks: 78, grade: "B1" },
      { subject: "MIL / Second Language", marks: 82, grade: "A2" },
      { subject: "Computer Science", marks: 85, grade: "A1" },
    ],
  },
];

