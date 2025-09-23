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
    }
  });
}

export async function saveStudent(student: any) {
  const d = await getDb();
  await d.put(STORE_STUDENTS, student);
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
