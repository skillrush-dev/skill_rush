// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { getStudent, saveStudent } from "../utils/db";
import SubjectCard from "../components/SubjectCard";
import StartLearning from "./StartLearning";

type Props = {
  student: any;
  onStartGame: (gameKey: string) => void; // expects a game key (can be subjectKey or subgameKey)
};

export default function Dashboard({ student, onStartGame }: Props) {
  const [profile, setProfile] = useState<any | null>(null);
  const [view, setView] = useState<"main" | "subjects" | "learning" | "subgames">("main");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const s = await getStudent(student.id);
      setProfile(s || student);
    }
    load();
  }, [student]);

  if (!profile) return <div className="p-6">Loading...</div>;

  // subjects + optional subgames (maths includes Fraction subgame)
  const subjects = [
    {
      key: "maths",
      title: "Math",
      teacher: "Mr. R. Sahu",
      cover: "/images/math-6.jpg",
      subgames: [
        { key: "fraction", title: "Fraction Bridge" }, // Fraction is a subgame in maths
        { key: "number-scramble", title: "Number Scramble" },
      ],
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

  // increment gamesPlayed and persist profile, then call onStartGame
  async function startGameAndTrack(gameKey: string) {
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

    // finally start the requested game (gameKey should match an entry in your GAMES mapping)
    onStartGame(gameKey);
  }

  // Called when user clicks Play on a subject card from the "subjects" view.
  // If subject has subgames, show subgame chooser, otherwise start the subject-level game.
  function handlePlaySubject(subjectKey: string) {
    const subj = subjects.find((s) => s.key === subjectKey);
    if (!subj) return;
    if (subj.subgames && subj.subgames.length > 0) {
      setSelectedSubject(subjectKey);
      setView("subgames");
    } else {
      // start the subject-level game (if you map subjectKey to a game)
      startGameAndTrack(subjectKey);
    }
  }

  // NEW: open StartLearning for given subject (Notes)
  function handleNotes(subjectKey: string) {
    // set the chosen subject and switch the dashboard to the learning view
    setSelectedSubject(subjectKey);
    setView("learning");
  }

  function handleVideos(subjectKey: string) {
    alert(`Open videos for ${subjectKey} (implement navigation)`);
  }

  // Subgame list for the selected subject
  const selectedSubgames =
    selectedSubject && subjects.find((s) => s.key === selectedSubject)?.subgames
      ? subjects.find((s) => s.key === selectedSubject)!.subgames!
      : [];

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

      {/* SUBJECT PICKER (Play Game) */}
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
                  onOpen={() => handlePlaySubject(s.key)}
                />
              </div>
            ))}
          </div>

          <div className="mt-6">
            <button className="px-4 py-2 bg-slate-500 text-white rounded-lg" onClick={() => setView("main")}>← Back</button>
          </div>
        </div>
      )}

      {/* SUBGAME CHOOSER (when a subject has subgames) */}
      {view === "subgames" && selectedSubject && (
        <div>
          <h3 className="text-xl font-semibold text-slate-800 mb-4">
            {subjects.find(s => s.key === selectedSubject)?.title} — Subgames
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {selectedSubgames.map((sg) => (
              <div key={sg.key} className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
                <h4 className="text-lg font-semibold text-slate-800 mb-2">{sg.title}</h4>
                <p className="text-sm text-slate-500 mb-4">Short interactive mini-game.</p>
                <div className="flex items-center gap-3">
                  <button
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg"
                    onClick={() => startGameAndTrack(sg.key)}
                  >
                    Play Game
                  </button>
                  <button className="px-3 py-2 border rounded text-slate-700 bg-white" onClick={() => alert('Preview / info (implement)')}>Info</button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <button className="px-4 py-2 bg-slate-500 text-white rounded-lg" onClick={() => { setSelectedSubject(null); setView("subjects"); }}>
              ← Back to Subjects
            </button>
          </div>
        </div>
      )}

      {/* START LEARNING: show StartLearning component for selectedSubject */}
      {view === "learning" && (
        <>
          {/* If selectedSubject is null (e.g., user clicked top "Start Learning"), show subject gallery
              If selectedSubject is set (user clicked Notes on a subject) render StartLearning for that subject */}
          {selectedSubject ? (
            <StartLearning
              subjectKey={selectedSubject}
              onClose={() => {
                setSelectedSubject(null);
                setView("main");
              }}
            />
          ) : (
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
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <button className="px-4 py-2 bg-slate-500 text-white rounded-lg" onClick={() => setView("main")}>← Back to Dashboard</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
