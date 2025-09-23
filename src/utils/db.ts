// quick minimal db.ts (if you don't have the idb-based version)
import { openDB } from 'idb';
const DB = 'skill_rush_db';
const VERSION = 1;
async function db() {
  return openDB(DB, VERSION, {
    upgrade(d) {
      if (!d.objectStoreNames.contains('students')) d.createObjectStore('students', { keyPath: 'id' });
      if (!d.objectStoreNames.contains('sync')) d.createObjectStore('sync', { autoIncrement:true });
    }
  });
}
export async function saveStudent(student: any) {
  const d = await db();
  await d.put('students', student);
}
export async function getStudent(id: string) {
  const d = await db();
  return d.get('students', id);
}
export async function enqueueSync(action: any) {
  const d = await db();
  return d.add('sync', action);
}
