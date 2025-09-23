import bcrypt from 'bcryptjs';
import { saveStudent, getStudent } from '../utils/db';

export async function signupLocal(id: string, name: string, password: string) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  const student = { id, name, passwordHash: hash, createdAt: Date.now(), points: 0, badges: [] };
  await saveStudent(student);
  return student;
}

export async function loginLocal(id: string, password: string) {
  const s = await getStudent(id);
  if (!s) return false;
  return bcrypt.compareSync(password, s.passwordHash);
}
