// src/pages/Register.tsx
import React, { useState } from 'react';
import { signupLocal } from '../auth/offlineAuth';
import { getStudent } from '../utils/db';

export default function RegisterPage({ onRegistered }: { onRegistered: (s:any)=>void }) {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  async function handleCreate() {
    if (!id || !password) { setMsg('ID and password required'); return; }
    try {
      await signupLocal(id.trim(), name.trim() || id.trim(), password);
      const created = await getStudent(id.trim());
      setMsg('Account created (offline). Logging you in...');
      onRegistered({ id: created.id, name: created.name, points: created.points || 0, badges: created.badges || [] });
    } catch (err:any) {
      setMsg('Error creating account: ' + (err?.message || err));
    }
  }

  return (
    <div className="card p-3" style={{maxWidth:480, margin:'0 auto'}}>
      <h5>Create account</h5>
      <input className="form-control mb-2" placeholder="Student ID" value={id} onChange={e=>setId(e.target.value)} />
      <input className="form-control mb-2" placeholder="Name (optional)" value={name} onChange={e=>setName(e.target.value)} />
      <input className="form-control mb-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <div className="d-flex gap-2">
        <button className="btn btn-success" onClick={handleCreate}>Create</button>
      </div>
      {msg && <div className="mt-2 text-muted">{msg}</div>}
    </div>
  );
}
