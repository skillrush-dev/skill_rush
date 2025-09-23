// src/games/GameShell.tsx
import React from 'react';

export default function GameShell({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        {title && <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        {children}
      </div>
    </div>
  );
}
