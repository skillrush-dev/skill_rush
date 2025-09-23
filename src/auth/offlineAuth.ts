// src/auth/offlineAuth.ts
import bcrypt from 'bcryptjs';
import { saveStudent, getStudent } from '../utils/db';

export async function signupLocal(id: string, name: string, password: string) {
  // Prevent duplicate
  const existing = await getStudent(id);
  if (existing) throw new Error('Student ID already exists');

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  const student = {
    id,
    name,
    passwordHash: hash,
    createdAt: Date.now(),
    points: 0,
    badges: [],
    avatar: null
  };

  // save student record to IndexedDB
  await saveStudent(student);

  return student;
}


export async function loginLocal(id: string, password: string) {
  const student = await getStudent(id);
  if (!student) return false;
  return bcrypt.compareSync(password, student.passwordHash);
}
