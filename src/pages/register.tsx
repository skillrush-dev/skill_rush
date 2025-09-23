// src/pages/Register.tsx
import React, { useState } from 'react';
import InteractiveButton from '../components/InteractiveButton';
import { signupLocal } from '../auth/offlineAuth';
import { saveStudent, getStudent } from '../utils/db';

export default function RegisterPage({ onRegistered }: { onRegistered: (s:any)=>void }) {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [studentClass, setStudentClass] = useState('6'); // default Class 6
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [preview, setPreview] = useState<string|null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (!file) { setPreview(null); return; }
    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result));
    reader.readAsDataURL(file);
  }

  async function handleCreate() {
    if (!id.trim() || !password) { setMsg('ID and password required'); return; }
    setMsg('');
    try {
      // create auth record and ensure saved student record
      const created = await signupLocal(id.trim(), name.trim() || id.trim(), password);

      // Build final student record (ensure class stored)
      const studentRec = {
        id: created.id || id.trim(),
        name: created.name || (name.trim() || id.trim()),
        class: studentClass,
        passwordHash: created.passwordHash || (created as any).passwordHash,
        createdAt: Date.now(),
        points: created.points || 0,
        badges: created.badges || [],
        avatar: preview || null
      };

      // Save into IndexedDB - ensure db.saveStudent exists and works
      await saveStudent(studentRec);

      // read back and call callback
      const st = await getStudent(studentRec.id);
      setMsg('Account created (offline).');
      onRegistered({ id: st.id, name: st.name, points: st.points || 0, badges: st.badges || [], avatar: st.avatar || null, class: st.class });
    } catch (err:any) {
      setMsg('Error: ' + (err?.message || err));
      console.error('register error', err);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-3">Create an account</h3>
        <p className="text-sm text-slate-500 mb-4">Register a student account (works offline).</p>

        <label className="block text-sm text-slate-600">Student ID</label>
        <input className="w-full rounded-md border border-slate-200 p-2 mb-3" value={id} onChange={e=>setId(e.target.value)} />

        <label className="block text-sm text-slate-600">Name (optional)</label>
        <input className="w-full rounded-md border border-slate-200 p-2 mb-3" value={name} onChange={e=>setName(e.target.value)} />

        <label className="block text-sm text-slate-600">Class (6–12)</label>
        <select className="w-full rounded-md border border-slate-200 p-2 mb-3" value={studentClass} onChange={e=>setStudentClass(e.target.value)}>
          <option>6</option><option>7</option><option>8</option><option>9</option><option>10</option><option>11</option><option>12</option>
        </select>

        <label className="block text-sm text-slate-600">Password</label>
        <input type="password" className="w-full rounded-md border border-slate-200 p-2 mb-3" value={password} onChange={e=>setPassword(e.target.value)} />

        <label className="block text-sm text-slate-600">Profile picture (optional)</label>
        <div className="flex items-center gap-3 mb-4">
          <input type="file" accept="image/*" onChange={handleFile} />
          <div className="w-16 h-16 rounded-full overflow-hidden border">
            {preview ? <img src={preview} alt="preview" className="object-cover w-full h-full" /> : <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">No</div>}
          </div>
        </div>

        <div className="flex gap-3">
          <InteractiveButton variant="primary" onClick={handleCreate}>Create account</InteractiveButton>
          <button className="px-4 py-2 rounded-2xl border" onClick={()=>{ setId(''); setName(''); setPassword(''); setPreview(null); setMsg('');}}>Reset</button>
        </div>

        {msg && <div className="mt-3 text-sm text-slate-500">{msg}</div>}
      </div>
    </div>
  );
}
