// src/components/Login.tsx
import React, { useState } from 'react';
import InteractiveButton from './InteractiveButton';
import { loginLocal } from '../auth/offlineAuth';
import { getStudent, touchLogin } from '../utils/db';

export default function Login({ onLogin }: { onLogin: (s:any) => void }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  async function attemptLogin() {
    setMsg('');
    if (!id.trim() || !password) { setMsg('Enter ID and password'); return; }
    try {
      const ok = await loginLocal(id.trim(), password);
      if (!ok) { setMsg('Invalid ID or password'); return; }

      // Update streak & lastLogin
      const updated = await touchLogin(id.trim());

      // Return the updated student profile to the app
      onLogin({
        id: updated.id,
        name: updated.name,
        points: updated.points || 0,
        badges: updated.badges || [],
        avatar: updated.avatar || null,
        class: updated.class || null,
        streak: updated.streak || 0,
        lastLogin: updated.lastLogin || null,
      });
    } catch (err: any) {
      console.error('login error', err);
      setMsg('Login error: ' + (err?.message || err));
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-3">Login</h3>
        <p className="text-sm text-slate-500 mb-4">Enter your student ID and password to continue.</p>

        <label className="block text-sm text-slate-600">Student ID</label>
        <input className="w-full rounded-md border border-slate-200 p-2 mb-3" value={id} onChange={e=>setId(e.target.value)} />

        <label className="block text-sm text-slate-600">Password</label>
        <input type="password" className="w-full rounded-md border border-slate-200 p-2 mb-4" value={password} onChange={e=>setPassword(e.target.value)} />

        <div className="flex items-center justify-between gap-3">
          <InteractiveButton variant="primary" onClick={attemptLogin}>Login</InteractiveButton>
          <button className="text-sm text-slate-500 hover:underline" onClick={()=>alert('Forgot password: please ask your teacher')}>Forgot?</button>
        </div>

        {msg && <div className="mt-4 text-sm text-red-500">{msg}</div>}
      </div>
    </div>
  );
}
