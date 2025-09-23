// src/components/TutorialModal.tsx
import React from "react";
import InteractiveButton from "./InteractiveButton";

export default function TutorialModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-800">Quick Tutorial — Skill_Rush</h3>
            <p className="text-sm text-slate-500 mt-1">A short guide to get students and teachers started.</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-2 bg-slate-100 hover:bg-slate-200">
            ✕
          </button>
        </div>

        <ol className="mt-4 list-decimal pl-5 space-y-3 text-sm text-slate-600">
          <li><strong>Install:</strong> On Android Chrome, tap menu → Add to Home screen to install the app (optional).</li>
          <li><strong>Create account:</strong> Tap Register → enter Student ID, Name, Class, Password and optional profile picture.</li>
          <li><strong>Play:</strong> From Dashboard press <em>Play Game</em> and complete the short quiz. Points are saved locally.</li>
          <li><strong>Offline:</strong> You can play without internet. Progress is queued locally and will sync later when online.</li>
          <li><strong>Teacher:</strong> Teachers login with role=Teacher and view aggregated student progress on the Teacher Dashboard.</li>
        </ol>

        <div className="mt-6 flex justify-end gap-3">
          <InteractiveButton variant="ghost" onClick={onClose}>Close</InteractiveButton>
        </div>
      </div>
    </div>
  );
}
