// src/utils/db.ts
import { openDB } from 'idb';

const DB = 'skill_rush_db';
const VERSION = 1;
const STORE_STUDENTS = 'students';
const STORE_SYNC = 'sync';

async function getDb() {
  return openDB(DB, VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_STUDENTS)) {
        db.createObjectStore(STORE_STUDENTS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_SYNC)) {
        db.createObjectStore(STORE_SYNC, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
}

export async function saveStudent(student: any) {
  const d = await getDb();
  await d.put(STORE_STUDENTS, student);
}

export async function updateStudent(id: string, patch: Partial<any>) {
  const d = await getDb();
  const tx = d.transaction(STORE_STUDENTS, 'readwrite');
  const existing = await tx.store.get(id);
  if (!existing) throw new Error('Student not found');
  const merged = { ...existing, ...patch };
  await tx.store.put(merged);
  await tx.done;
  return merged;
}

export async function getStudent(id: string) {
  const d = await getDb();
  return d.get(STORE_STUDENTS, id);
}

export async function enqueueSync(action: any) {
  const d = await getDb();
  return d.add(STORE_SYNC, action);
}

export async function getSyncQueue() {
  const d = await getDb();
  return d.getAll(STORE_SYNC);
}

export async function clearSyncQueue() {
  const d = await getDb();
  const tx = d.transaction(STORE_SYNC, 'readwrite');
  await tx.store.clear();
  await tx.done;
}

/**
 * touchLogin - Called when a student successfully logs in.
 * It updates lastLogin (timestamp) and streak (consecutive days).
 *
 * Logic:
 *  - If lastLogin is from yesterday (UTC date difference == 1), streak += 1
 *  - If lastLogin is today, streak unchanged
 *  - Otherwise (gap >1 days), streak = 1
 *
 * Returns the updated student record.
 */
export async function touchLogin(id: string) {
  const d = await getDb();
  const tx = d.transaction(STORE_STUDENTS, 'readwrite');
  const student = await tx.store.get(id);
  if (!student) throw new Error('Student not found');

  const now = new Date();
  const last = student.lastLogin ? new Date(student.lastLogin) : null;

  // helper to get just the date (year-month-day) for comparison in local time
  const dateOnly = (dt: Date) => new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());

  if (!last) {
    student.streak = 1;
  } else {
    const lastDate = dateOnly(last).getTime();
    const todayDate = dateOnly(now).getTime();
    const dayDiff = Math.round((todayDate - lastDate) / (1000 * 60 * 60 * 24));

    if (dayDiff === 0) {
      // same day - keep streak
      student.streak = student.streak || 1;
    } else if (dayDiff === 1) {
      // consecutive day
      student.streak = (student.streak || 0) + 1;
    } else {
      // break in streak
      student.streak = 1;
    }
  }

  student.lastLogin = now.toISOString();
  // update lastSync? Not here - lastSync reserved for server sync time
  await tx.store.put(student);
  await tx.done;

  // Optionally add to sync queue so teacher/server knows about login (not required)
  await enqueueSync({ type: 'login', studentId: id, ts: Date.now() });

  return student;
}
