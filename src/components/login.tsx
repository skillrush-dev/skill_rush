// src/components/Login.tsx
import React, { useState } from 'react';
import { loginLocal } from '../auth/offlineAuth';
import { getStudent } from '../utils/db';

export default function Login({ onLogin }: { onLogin: (s:any)=>void }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  async function handleLogin() {
    if (!id || !password) { setMsg('ID and password required'); return; }
    try {
      const ok = await loginLocal(id.trim(), password);
      if (!ok) { setMsg('Invalid credentials'); return; }
      const s = await getStudent(id.trim());
      onLogin({ id: s.id, name: s.name, points: s.points || 0, badges: s.badges || [] });
    } catch (err:any) {
      setMsg('Login error: ' + (err?.message || err));
    }
  }

  return (
    <div className="card p-3" style={{maxWidth:480, margin:'0 auto'}}>
      <h5>Login</h5>
      <input className="form-control mb-2" placeholder="Student ID" value={id} onChange={e=>setId(e.target.value)} />
      <input className="form-control mb-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <div className="d-flex gap-2">
        <button className="btn btn-primary" onClick={handleLogin}>Login</button>
      </div>
      {msg && <div className="mt-2 text-muted">{msg}</div>}
    </div>
  );
}
