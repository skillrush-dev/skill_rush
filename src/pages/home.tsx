// src/pages/Home.tsx
import React from 'react';
import InteractiveButton from '../components/InteractiveButton';

export default function Home({ onOpenLogin, onOpenRegister, onOpenTutorial }:{ onOpenLogin: ()=>void; onOpenRegister: ()=>void; onOpenTutorial?: ()=>void }) {
  return (
    <div className="min-h-[60vh] bg-gradient-to-b from-white to-teal-50 py-8 px-4 rounded-xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-3 py-1 text-teal-700 text-sm font-semibold">
            Offline-first PWA
          </div>

          <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">
            Skill_Rush — Gamified STEM for Kids
          </h1>

          <p className="text-slate-600 max-w-xl">
            Lightweight, installable web app for low-cost phones. Play quick games, collect points & badges, and learn in Odia and English — even without internet.
          </p>

          <div className="flex flex-wrap gap-3">
            <InteractiveButton variant="primary" onClick={onOpenRegister}>Create account</InteractiveButton>
            <InteractiveButton variant="secondary" onClick={onOpenLogin}>Login</InteractiveButton>
            <InteractiveButton variant="ghost" onClick={() => onOpenTutorial ? onOpenTutorial() : alert('Tutorial')}>Show tutorial</InteractiveButton>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-white shadow flex items-center justify-center">
              <svg className="w-6 h-6 text-teal-600" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div className="text-sm text-slate-500">Trusted by local schools</div>
              <div className="text-sm font-semibold text-slate-700">Demo pilot — Odisha district</div>
            </div>
          </div>
        </div>

        {/* right: features */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white shadow-sm hover:shadow-md transition">
              <h4 className="font-semibold text-slate-800">Interactive Games</h4>
              <p className="text-sm text-slate-500 mt-1">Short, fun puzzles for Class 1 children.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white shadow-sm hover:shadow-md transition">
              <h4 className="font-semibold text-slate-800">Offline Support</h4>
              <p className="text-sm text-slate-500 mt-1">Works without internet — progress saved locally.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white shadow-sm hover:shadow-md transition">
              <h4 className="font-semibold text-slate-800">Odia Language</h4>
              <p className="text-sm text-slate-500 mt-1">Localized UI and content for Odisha students.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white shadow-sm hover:shadow-md transition">
              <h4 className="font-semibold text-slate-800">Teacher Dashboard</h4>
              <p className="text-sm text-slate-500 mt-1">Simple analytics and CSV export.</p>
            </div>
          </div>

          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-teal-50 to-white border border-teal-100 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h5 className="text-slate-800 font-semibold">How it works</h5>
                <p className="text-sm text-slate-500 mt-1">Install as PWA → create an account → play offline → sync when online.</p>
              </div>
              <InteractiveButton variant="primary" onClick={() => onOpenTutorial ? onOpenTutorial() : alert('Tutorial')}>Show tutorial</InteractiveButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
