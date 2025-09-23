// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { getStudent, saveStudent } from '../utils/db';
import InteractiveButton from '../components/InteractiveButton';

export default function Dashboard({ student, onPlay }: { student: any, onPlay: ()=>void }) {
  const [profile, setProfile] = useState<any | null>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    async function load() {
      const s = await getStudent(student.id);
      setProfile(s || student);
      setName(s?.name || student.name);
    }
    load();
  }, [student]);

  async function saveName() {
    if (!profile) return;
    const updated = { ...profile, name: name.trim() || profile.id };
    await saveStudent(updated);
    setProfile(updated);
    setEditing(false);
  }

  if (!profile) return <div>Loading...</div>;

  const points = profile.points || 0;
  const level = Math.floor(points / 10) + 1;
  const progress = Math.min((points % 10) * 10, 100);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="flex flex-col items-center gap-4">
          {profile.avatar ? (
            <img src={profile.avatar} alt="avatar" className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-sm" />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-teal-400 to-cyan-400 text-white flex items-center justify-center text-3xl font-bold">
              {String(profile.name || profile.id).charAt(0).toUpperCase()}
            </div>
          )}
          <div className="text-center">
            {!editing ? (
              <div className="text-lg font-semibold text-slate-800">{profile.name}</div>
            ) : (
              <div className="flex items-center gap-2">
                <input value={name} onChange={e=>setName(e.target.value)} className="rounded-md border px-2 py-1" />
                <button className="px-3 py-1 rounded-md bg-teal-600 text-white" onClick={saveName}>Save</button>
              </div>
            )}
            <div className="text-xs text-slate-500 mt-1">Student ID: {profile.id}</div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm text-slate-500">Points</div>
              <div className="text-3xl font-bold text-teal-600">{points}</div>
            </div>

            <div className="flex-1">
              <div className="text-sm text-slate-500 mb-2">Progress to next level</div>
              <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                <div className="h-4 bg-gradient-to-r from-teal-400 to-cyan-400" style={{width: `${progress}%`, transition:'width 500ms'}} />
              </div>
              <div className="text-xs text-slate-500 mt-2">Level {level} • {progress}%</div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <InteractiveButton variant="primary" onClick={onPlay}>Play Game</InteractiveButton>
              <InteractiveButton variant="ghost" onClick={()=>setEditing(true)}>Edit name</InteractiveButton>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl">
              <div className="text-xs text-slate-500">Badges</div>
              <div className="mt-2 font-semibold">{(profile.badges || []).join(', ') || 'No badges yet'}</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <div className="text-xs text-slate-500">Games played</div>
              <div className="mt-2 font-semibold">—</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <div className="text-xs text-slate-500">Last sync</div>
              <div className="mt-2 font-semibold">{profile.lastSync ? new Date(profile.lastSync).toLocaleString() : 'Not synced'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
