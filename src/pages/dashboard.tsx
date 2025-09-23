// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { getStudent, saveStudent } from "../utils/db";
import SubjectCard from "../components/SubjectCard";

type Props = {
  student: any;
  onStartGame: (subjectKey: string) => void; // existing game launch hook
};

export default function Dashboard({ student, onStartGame }: Props) {
  const [profile, setProfile] = useState<any | null>(null);
  const [view, setView] = useState<"main" | "subjects" | "learning">("main");

  useEffect(() => {
    async function load() {
      const s = await getStudent(student.id);
      setProfile(s || student);
    }
    load();
  }, [student]);

  if (!profile) return <div className="p-6">Loading...</div>;

  // subjects data for Class 6 (teacher names, optional covers)
  const subjects = [
    {
      key: "maths",
      title: "Math",
      teacher: "Mr. R. Sahu",
      cover: "/images/math-6.jpg",
    },
    {
      key: "science",
      title: "Science",
      teacher: "Ms. P. Mishra",
      cover: "/images/science-6.jpg",
    },
    {
      key: "english",
      title: "English",
      teacher: "Ms. N. Das",
      cover: "/images/english-6.jpg",
    },
    {
      key: "hindi",
      title: "Hindi",
      teacher: "Mr. S. Patnaik",
      cover: "/images/hindi-6.jpg",
    },
    {
      key: "social",
      title: "Social Science",
      teacher: "Ms. S. Routray",
      cover: "/images/social-6.jpg",
    },
  ];

  // helper: increment gamesPlayed & then start game
  async function handleStartGameFromSubject(subjectKey: string) {
    try {
      const updated = {
        ...profile,
        gamesPlayed: (profile.gamesPlayed || 0) + 1,
        lastSync: Date.now(),
      };
      await saveStudent(updated);
      setProfile(updated);
    } catch (err) {
      console.error("Failed to update gamesPlayed", err);
    }
    onStartGame(subjectKey);
  }

  function handleNotes(subjectKey: string) {
    // TODO: navigate to notes page or open modal
    alert(`Open notes for ${subjectKey} (implement navigation)`);
  }

  function handleVideos(subjectKey: string) {
    // TODO: navigate to videos or open player
    alert(`Open videos for ${subjectKey} (implement navigation)`);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Top header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Welcome, {profile.name}</h2>
          <div className="text-sm text-slate-500">Class {profile.class || "—"}</div>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="px-4 py-2 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 transition"
            onClick={() => setView("subjects")}
          >
            Play Game
          </button>

          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
            onClick={() => setView("learning")}
          >
            Start Learning
          </button>

          <button
            className="px-3 py-2 border rounded-md text-slate-700 bg-white hover:bg-slate-50"
            onClick={async () => {
              // quick manual refresh of profile
              const s = await getStudent(profile.id);
              setProfile(s || profile);
            }}
            title="Refresh profile"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* MAIN DASHBOARD */}
      {view === "main" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* profile */}
          <div className="bg-white p-6 rounded-2xl shadow text-center">
            {profile.avatar ? (
              <img src={profile.avatar} alt="avatar" className="mx-auto w-28 h-28 rounded-full object-cover border-2 border-teal-500 mb-4" />
            ) : (
              <div className="mx-auto w-28 h-28 rounded-full bg-teal-500 text-white flex items-center justify-center text-3xl font-bold mb-4">
                {String(profile.name || profile.id).charAt(0).toUpperCase()}
              </div>
            )}

            <h3 className="text-lg font-semibold text-slate-800">Class {profile.class || "-"}</h3>
            <p className="mt-2 text-slate-600">Points: <span className="font-bold text-teal-600">{profile.points || 0}</span></p>
            <p className="text-slate-600">Streak: <span className="font-bold text-pink-600">{profile.streak || 0}</span> days</p>
          </div>

          {/* badges */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h4 className="text-lg font-semibold text-slate-800">Badges</h4>
            <div className="mt-3">
              {profile.badges && profile.badges.length ? (
                <div className="flex flex-wrap gap-2">
                  {profile.badges.map((b: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm">{b}</span>
                  ))}
                </div>
              ) : (
                <div className="text-slate-500">No badges yet</div>
              )}
            </div>
          </div>

          {/* games played */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h4 className="text-lg font-semibold text-slate-800">Games Played</h4>
            <div className="mt-3">
              <div className="text-3xl font-bold text-indigo-600">{profile.gamesPlayed || 0}</div>
              <div className="text-sm text-slate-500 mt-2">Last sync: {profile.lastSync ? new Date(profile.lastSync).toLocaleString() : "Not synced"}</div>
            </div>
          </div>
        </div>
      )}

      {/* SUBJECT PICKER (via Play Game button) */}
      {view === "subjects" && (
        <div>
          <h3 className="text-xl font-semibold text-slate-800 mb-4">Choose a Subject to Play</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {subjects.map((s) => (
              <div key={s.key}>
                <SubjectCard
                  subjectKey={s.key}
                  title={s.title}
                  teacher={s.teacher}
                  cover={s.cover}
                  onOpen={() => handleStartGameFromSubject(s.key)}
                  onNotes={() => handleNotes(s.key)}
                  onVideos={() => handleVideos(s.key)}
                />
              </div>
            ))}
          </div>

          <div className="mt-6">
            <button className="px-4 py-2 bg-slate-500 text-white rounded-lg" onClick={() => setView("main")}>← Back</button>
          </div>
        </div>
      )}

      {/* START LEARNING SUBJECT GRID (covers & teacher info + notes/videos) */}
      {view === "learning" && (
        <div>
          <h3 className="text-xl font-semibold text-slate-800 mb-4">Start Learning — Class 6</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {subjects.map((s) => (
              <div key={s.key} className="text-center">
                <div className="group cursor-pointer inline-block">
                  <div className="w-36 h-48 rounded-xl overflow-hidden shadow-md transform transition duration-300 ease-out group-hover:-translate-y-2 group-hover:scale-105">
                    <img
                      src={s.cover || `https://source.unsplash.com/collection/190727/300x400?sig=${s.key}`}
                      alt={s.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="mt-2">
                    <div className="text-sm font-semibold text-slate-800">{s.title}</div>
                    <div className="text-xs text-slate-500">Class 6</div>
                  </div>

                  <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-250">
                    <div className="text-xs text-slate-600">Teacher</div>
                    <div className="text-sm font-medium text-slate-800">{s.teacher}</div>

                    <div className="mt-3 flex justify-center gap-2">
                      <button
                        onClick={() => handleNotes(s.key)}
                        className="px-3 py-1 rounded-md bg-white border text-slate-700 text-sm hover:bg-slate-50"
                      >
                        Notes
                      </button>
                      <button
                        onClick={() => handleVideos(s.key)}
                        className="px-3 py-1 rounded-md bg-teal-600 text-white text-sm hover:bg-teal-700"
                      >
                        Videos
                      </button>
                    </div>
                  </div>
                </div>
                {/* title below for accessibility when not hovered */}
              </div>
            ))}
          </div>

          <div className="mt-6">
            <button className="px-4 py-2 bg-slate-500 text-white rounded-lg" onClick={() => setView("main")}>← Back to Dashboard</button>
          </div>
        </div>
      )}
    </div>
  );
}
