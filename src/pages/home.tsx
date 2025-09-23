// src/pages/Home.tsx
import React from 'react';

export default function Home({ onOpenLogin, onOpenRegister }: { onOpenLogin: ()=>void; onOpenRegister: ()=>void }) {
  return (
    <div className="text-center py-5">
      <h1 className="display-5">skill_rush</h1>
      <p className="lead">Gamified offline-friendly STEM learning for children.</p>
      <div className="d-flex justify-content-center gap-2 mt-3">
        <button className="btn btn-primary" onClick={onOpenLogin}>Login</button>
        <button className="btn btn-success" onClick={onOpenRegister}>Register</button>
      </div>
      <hr />
      <p className="text-muted">Works offline. Supports Odia content. Simple games for class 1.</p>
    </div>
  );
}
