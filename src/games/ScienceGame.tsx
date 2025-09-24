// src/games/ScienceGame.tsx
import React, { useEffect, useMemo, useState } from "react";
import { getStudent, saveStudent, enqueueSync } from "../utils/db";

type Props = { studentId: string; onEnd: () => void };

type Question = {
  question: string;
  options: string[];
  answer: string;
};

const QUESTIONS: Question[] = [
  { question: "Which part of the plant makes food?", options: ["Root", "Stem", "Leaf", "Flower"], answer: "Leaf" },
  { question: "Which animal is known as the ‘Ship of the Desert’?", options: ["Camel", "Elephant", "Horse", "Donkey"], answer: "Camel" },
  { question: "In which season do we wear woolen clothes?", options: ["Summer", "Winter", "Rainy", "Spring"], answer: "Winter" },
  { question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], answer: "Mars" },
  { question: "What do humans need to breathe?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Helium"], answer: "Oxygen" },
];

export default function ScienceGame({ studentId, onEnd }: Props) {
  const [index, setIndex] = useState<number>(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [locked, setLocked] = useState<boolean>(false); // lock options while showing feedback
  const q = QUESTIONS[index];

  // Derived values
  const progressPct = useMemo(() => Math.round(((index) / QUESTIONS.length) * 100), [index]);

  useEffect(() => {
    // reset selection when question changes
    setSelected(null);
    setLocked(false);
  }, [index]);

  async function finish() {
    // persist to local DB and enqueue sync
    try {
      const st = await getStudent(studentId);
      if (st) {
        st.points = (st.points || 0) + score;
        st.gamesPlayed = (st.gamesPlayed || 0) + 1;
        st.lastPlayed = Date.now();
        await saveStudent(st);

        await enqueueSync({
          type: "gameResult",
          studentId,
          game: "science",
          score,
          questions: QUESTIONS.length,
          ts: Date.now(),
        });
      }
    } catch (err) {
      // ignore but log so developers can troubleshoot
      // console.error("Failed saving science result", err);
    }
    onEnd();
  }

  function choose(opt: string) {
    if (locked) return;
    setSelected(opt);
    setLocked(true);

    const correct = opt === q.answer;
    if (correct) setScore((s) => s + 1);

    // show feedback for a short time then move next or finish
    setTimeout(() => {
      setLocked(false);
      if (index + 1 < QUESTIONS.length) {
        setIndex((i) => i + 1);
      } else {
        // show final screen briefly then call finish to persist and return
        setShowResult(true);
      }
    }, 700);
  }

  function handlePlayAgain() {
    setIndex(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
  }

  // UI
  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-emerald-50 p-6 flex items-start">
        <div className="max-w-3xl w-full mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center border">
            <h2 className="text-2xl font-extrabold mb-4 text-slate-900">🎉 Well done!</h2>
            <p className="text-slate-600 mb-6">You completed the Science Quiz.</p>

            <div className="inline-flex items-center justify-center gap-6 bg-emerald-50 border border-emerald-100 rounded-lg p-6 mb-6">
              <div className="text-sm text-slate-500">Score</div>
              <div className="text-3xl font-bold text-emerald-700">{score} / {QUESTIONS.length}</div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={handlePlayAgain}
                className="px-6 py-2 rounded-full bg-emerald-600 text-white font-medium hover:brightness-95 transition"
              >
                Play Again
              </button>

              <button
                onClick={() => {
                  // persist results and go back to dashboard
                  finish();
                }}
                className="px-6 py-2 rounded-full bg-white border text-slate-700 hover:bg-slate-50 transition"
              >
                Save & Return
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // main question UI
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-emerald-50 p-6 flex items-start">
      <div className="max-w-3xl w-full mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900">🔬 Science Quiz</h1>
          <div className="text-sm text-slate-500">
            Question <span className="font-medium text-slate-700">{index + 1}</span> / {QUESTIONS.length}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border">
          {/* progress */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
            <div style={{ width: `${progressPct}%` }} className="h-2 rounded-full bg-emerald-400 transition-all" />
          </div>

          {/* question */}
          <div className="mb-4">
            <div className="text-slate-700 text-lg font-semibold mb-2">Q{index + 1}.</div>
            <div className="text-slate-900 text-xl font-bold">{q.question}</div>
          </div>

          {/* options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {q.options.map((opt) => {
              const isSelected = selected === opt;
              const isCorrect = opt === q.answer;
              const base = "w-full text-left px-4 py-3 rounded-lg shadow-sm border transition";
              const stateClass = !selected
                ? "bg-white border-slate-200 hover:scale-[1.02]"
                : isSelected && isCorrect
                ? "bg-emerald-50 border-emerald-300 ring-2 ring-emerald-200"
                : isSelected && !isCorrect
                ? "bg-red-50 border-red-300 ring-2 ring-red-100 line-through"
                : !isSelected && selected && isCorrect
                ? "bg-emerald-100 border-emerald-200"
                : "bg-white border-slate-200 opacity-80";

              return (
                <button
                  key={opt}
                  onClick={() => choose(opt)}
                  disabled={locked}
                  className={`${base} ${stateClass} flex items-center gap-3`}
                >
                  <div className="flex-1">
                    <div className="text-slate-800 font-medium">{opt}</div>
                  </div>

                  {/* small badge when selected */}
                  {isSelected && (
                    <div className="text-xs px-2 py-1 rounded-full bg-slate-100 border text-slate-700">
                      {isCorrect ? "✓" : "✕"}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* footer with score + controls */}
          <div className="mt-6 flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500">Score</div>
              <div className="text-lg font-bold text-emerald-700">{score} / {QUESTIONS.length}</div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  // allow skipping finish early
                  finish();
                }}
                className="px-4 py-2 rounded-full bg-white border text-slate-700 hover:bg-slate-50 transition"
              >
                End & Return
              </button>

              <button
                onClick={() => {
                  // move to next only if current was answered correctly and locked is false (this button acts as "next" if user wants)
                  if (selected && !locked) {
                    // if last question, show result
                    if (index + 1 < QUESTIONS.length) setIndex((i) => i + 1);
                    else setShowResult(true);
                  } else {
                    // if user hasn't chosen, do nothing or encourage selection
                    setSelected(null);
                  }
                }}
                className="px-4 py-2 rounded-full bg-emerald-600 text-white font-medium hover:brightness-95 transition"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
