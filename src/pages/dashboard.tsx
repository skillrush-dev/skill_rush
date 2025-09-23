// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { getStudent, saveStudent } from '../utils/db';

export default function Dashboard({ student, onPlay }: { student: any, onPlay: ()=>void }) {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const s = await getStudent(student.id);
      setProfile(s || student);
    }
    load();
  }, [student]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h3>Welcome, {profile.name}</h3>
      <div className="card mb-3 p-3" style={{maxWidth:480}}>
        <p><strong>Points:</strong> <span className="badge bg-success">{profile.points || 0}</span></p>
        <p><strong>Badges:</strong> {(profile.badges || []).join(', ') || '—'}</p>
        <div className="d-flex gap-2 mt-2">
          <button className="btn btn-primary" onClick={onPlay}>Play Game</button>
        </div>
      </div>
      <small className="text-muted">Your progress is saved locally and will sync when online.</small>
    </div>
  );
}
