import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  where,
  Unsubscribe,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export interface AdmissionRecord {
  id: string;
  studentName: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  classApplying: string;
  gender?: 'Male' | 'Female' | 'Other';
  previousSchool?: string;
  residentialArea?: string;
  status: 'pending' | 'under_review' | 'contacted' | 'approved' | 'rejected';
  notes?: string;
  applicantUid?: string;
  createdAt?: any;
}

export interface TourBookingRecord {
  id: string;
  parentName: string;
  phone: string;
  email?: string;
  preferredSaturday: string;
  childGrade?: string;
  numberOfAttendees?: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt?: any;
}

export interface CircularRecord {
  id: string;
  title: string;
  category: 'Academic' | 'Examination' | 'Sports' | 'Holiday' | 'Notice';
  date: string;
  content: string;
  priority: 'normal' | 'urgent';
  authorEmail?: string;
  createdAt?: any;
}

/**
 * Submit an admission application to Firestore
 */
export async function submitAdmissionApplication(
  data: Omit<AdmissionRecord, 'id' | 'status' | 'createdAt'>,
  applicantUid?: string
): Promise<string> {
  const collectionPath = 'admissions';
  const customId = `adm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const docRef = doc(db, collectionPath, customId);

  const payload: Record<string, any> = {
    studentName: data.studentName.trim().slice(0, 100),
    parentName: data.parentName.trim().slice(0, 100),
    parentPhone: data.parentPhone.trim().slice(0, 20),
    classApplying: data.classApplying.trim().slice(0, 30),
    status: 'pending',
    createdAt: serverTimestamp(),
  };

  if (data.parentEmail && data.parentEmail.trim()) {
    payload.parentEmail = data.parentEmail.trim().slice(0, 100);
  }
  if (data.gender) {
    payload.gender = data.gender;
  }
  if (data.previousSchool && data.previousSchool.trim()) {
    payload.previousSchool = data.previousSchool.trim().slice(0, 150);
  }
  if (data.residentialArea && data.residentialArea.trim()) {
    payload.residentialArea = data.residentialArea.trim().slice(0, 120);
  }
  if (data.notes && data.notes.trim()) {
    payload.notes = data.notes.trim().slice(0, 300);
  }
  if (applicantUid) {
    payload.applicantUid = applicantUid.slice(0, 128);
  }

  try {
    await setDoc(docRef, payload);
    return customId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${collectionPath}/${customId}`);
  }
}

/**
 * Real-time listener for admissions (Admins or parent applicant)
 */
export function subscribeAdmissions(
  callback: (admissions: AdmissionRecord[]) => void,
  userUid?: string,
  isAdmin: boolean = false
): Unsubscribe {
  const path = 'admissions';
  const colRef = collection(db, path);
  
  let q = query(colRef, orderBy('createdAt', 'desc'));
  if (!isAdmin && userUid) {
    q = query(colRef, where('applicantUid', '==', userUid));
  }

  return onSnapshot(
    q,
    (snapshot) => {
      const records: AdmissionRecord[] = [];
      snapshot.forEach((docSnap) => {
        records.push({
          id: docSnap.id,
          ...(docSnap.data() as Omit<AdmissionRecord, 'id'>),
        });
      });
      callback(records);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

/**
 * Update admission application status (Admin only)
 */
export async function updateAdmissionStatus(
  admissionId: string,
  status: AdmissionRecord['status'],
  notes?: string
): Promise<void> {
  const path = `admissions/${admissionId}`;
  const docRef = doc(db, 'admissions', admissionId);
  try {
    const updateData: Record<string, any> = { status };
    if (notes !== undefined) {
      updateData.notes = notes.slice(0, 300);
    }
    await updateDoc(docRef, updateData);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Book a campus tour on Saturday
 */
export async function bookCampusTour(data: {
  parentName: string;
  phone: string;
  email?: string;
  preferredSaturday: string;
  childGrade?: string;
  numberOfAttendees?: number;
}): Promise<string> {
  const collectionPath = 'tour_bookings';
  const customId = `tour_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const docRef = doc(db, collectionPath, customId);

  const payload: Record<string, any> = {
    parentName: data.parentName.trim().slice(0, 100),
    phone: data.phone.trim().slice(0, 20),
    preferredSaturday: data.preferredSaturday.trim().slice(0, 60),
    status: 'scheduled',
    createdAt: serverTimestamp(),
  };

  if (data.email && data.email.trim()) {
    payload.email = data.email.trim().slice(0, 100);
  }
  if (data.childGrade && data.childGrade.trim()) {
    payload.childGrade = data.childGrade.trim().slice(0, 30);
  }
  if (data.numberOfAttendees) {
    payload.numberOfAttendees = Math.min(Math.max(1, data.numberOfAttendees), 20);
  }

  try {
    await setDoc(docRef, payload);
    return customId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${collectionPath}/${customId}`);
  }
}

/**
 * Real-time listener for official school circulars (Public read)
 */
export function subscribeCirculars(
  callback: (circulars: CircularRecord[]) => void
): Unsubscribe {
  const path = 'circulars';
  const colRef = collection(db, path);
  const q = query(colRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: CircularRecord[] = [];
      snapshot.forEach((docSnap) => {
        items.push({
          id: docSnap.id,
          ...(docSnap.data() as Omit<CircularRecord, 'id'>),
        });
      });
      callback(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

/**
 * Publish an official circular (Admin only)
 */
export async function publishCircular(data: {
  title: string;
  category: CircularRecord['category'];
  date: string;
  content: string;
  priority: 'normal' | 'urgent';
  authorEmail?: string;
}): Promise<string> {
  const collectionPath = 'circulars';
  const customId = `circ_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const docRef = doc(db, collectionPath, customId);

  const payload = {
    title: data.title.trim().slice(0, 150),
    category: data.category,
    date: data.date.trim().slice(0, 50),
    content: data.content.trim().slice(0, 1000),
    priority: data.priority,
    authorEmail: data.authorEmail ? data.authorEmail.slice(0, 100) : 'admin@kinship',
    createdAt: serverTimestamp(),
  };

  try {
    await setDoc(docRef, payload);
    return customId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${collectionPath}/${customId}`);
  }
}

/**
 * Delete a circular (Admin only)
 */
export async function deleteCircular(circularId: string): Promise<void> {
  const path = `circulars/${circularId}`;
  try {
    await deleteDoc(doc(db, 'circulars', circularId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Subscribe to Saturday campus tour bookings (Admin only)
 */
export function subscribeTourBookings(
  callback: (bookings: TourBookingRecord[]) => void
): Unsubscribe {
  const path = 'tour_bookings';
  const colRef = collection(db, path);
  const q = query(colRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: TourBookingRecord[] = [];
      snapshot.forEach((docSnap) => {
        items.push({
          id: docSnap.id,
          ...(docSnap.data() as Omit<TourBookingRecord, 'id'>),
        });
      });
      callback(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

/**
 * Update campus tour booking status (Admin only)
 */
export async function updateTourBookingStatus(
  bookingId: string,
  status: TourBookingRecord['status']
): Promise<void> {
  const path = `tour_bookings/${bookingId}`;
  const docRef = doc(db, 'tour_bookings', bookingId);
  try {
    await updateDoc(docRef, { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export interface FacilityUpgradeRecord {
  id: string;
  title: string;
  category: 'Hostel Wing' | 'Hygiene & Dining' | 'Study & Tech' | 'Sports & Rec' | 'Safety & Health';
  description: string;
  iconName: string;
  badgeText?: string;
  authorEmail?: string;
  createdAt?: any;
}

/**
 * Real-time listener for facility upgrade highlights (Public read)
 */
export function subscribeFacilityUpgrades(
  callback: (upgrades: FacilityUpgradeRecord[]) => void
): Unsubscribe {
  const path = 'facility_upgrades';
  const colRef = collection(db, path);
  const q = query(colRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: FacilityUpgradeRecord[] = [];
      snapshot.forEach((docSnap) => {
        items.push({
          id: docSnap.id,
          ...(docSnap.data() as Omit<FacilityUpgradeRecord, 'id'>),
        });
      });
      callback(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

/**
 * Add a dynamic facility upgrade highlight (Admin only)
 */
export async function addFacilityUpgrade(data: {
  title: string;
  category: FacilityUpgradeRecord['category'];
  description: string;
  iconName: string;
  badgeText?: string;
  authorEmail?: string;
}): Promise<string> {
  const collectionPath = 'facility_upgrades';
  const customId = `upg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const docRef = doc(db, collectionPath, customId);

  const payload: Record<string, any> = {
    title: data.title.trim().slice(0, 100),
    category: data.category,
    description: data.description.trim().slice(0, 500),
    iconName: data.iconName.trim().slice(0, 40),
    createdAt: serverTimestamp(),
  };

  if (data.badgeText && data.badgeText.trim()) {
    payload.badgeText = data.badgeText.trim().slice(0, 40);
  }
  if (data.authorEmail && data.authorEmail.trim()) {
    payload.authorEmail = data.authorEmail.trim().slice(0, 100);
  }

  try {
    await setDoc(docRef, payload);
    return customId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${collectionPath}/${customId}`);
  }
}

/**
 * Delete a facility upgrade highlight (Admin only)
 */
export async function deleteFacilityUpgrade(upgradeId: string): Promise<void> {
  const path = `facility_upgrades/${upgradeId}`;
  try {
    await deleteDoc(doc(db, 'facility_upgrades', upgradeId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}


