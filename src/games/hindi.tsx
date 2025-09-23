// src/games/hindi.tsx
import React, { useMemo, useState } from "react";
import { getStudent, saveStudent, enqueueSync } from "../utils/db";

/**
 * Hindi mini-game: Sentence Jumble
 * - Uses accessible color palette consistent with the rest of the app
 * - No framer-motion dependency (keeps bundle small)
 * - Provides explicit Exit buttons and a completion modal with an Exit action
 *
 * Props:
 *  - studentId: string (used to save points)
 *  - onEnd?: () => void  (optional callback the host app can use to leave the game)
 */

type Props = {
  studentId?: string;
  onEnd?: () => void;
};

const SAMPLE_QUESTIONS = [
  { words: ["हैं", "बच्चे", "खेल", "रहे"], correct: "बच्चे खेल रहे हैं" },
  { words: ["खाया", "मैंने", "आम"], correct: "मैंने आम खाया" },
  { words: ["पढ़", "रही", "सीमा", "है"], correct: "सीमा पढ़ रही है" },
];

function CompletionModal({ open, score, total, onClose, onExit } : { open: boolean; score:number; total:number; onClose: ()=>void; onExit?: ()=>void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-md z-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">🎉 Level Complete</h2>
        <p className="text-slate-600 mb-4">Excellent! Your score: <span className="font-semibold text-teal-600">{score}</span> / {total}</p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          >
            Continue
          </button>

          <button
            onClick={() => { if (onExit) onExit(); else window.history.back(); }}
            className="px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700"
          >
            Exit game
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HindiGamesPage({ studentId, onEnd }: Props): JSX.Element {
  // ensure questions are shuffled per load
  const questions = useMemo(() => {
    const arr = SAMPLE_QUESTIONS.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<Record<number,string[]>>({});
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const current = questions[index];

  function chooseWord(w: string) {
    setAnswer(prev => [...prev, w]);
  }

  function removeLastWord() {
    setAnswer(prev => prev.slice(0, prev.length - 1));
  }

  async function submit() {
    const formed = answer.join(" ").trim();
    const correct = formed === current.correct;
    if (correct) setScore(s => s + 1);

    // save answers for this index (for review, if desired)
    setSelectedWords(sw => ({ ...sw, [index]: answer.slice() }));

    if (index + 1 < questions.length) {
      setIndex(i => i + 1);
      setAnswer([]);
    } else {
      // final score
      setCompleted(true);
      setShowModal(true);

      // persist score increment to student's record if studentId provided
      if (studentId) {
        try {
          const st = await getStudent(studentId);
          if (st) {
            st.points = (st.points || 0) + (correct ? 1 : 0) + score; // include previously accumulated corrects
            await saveStudent(st);
            await enqueueSync({ type: 'gameResult', game: 'hindi_sentence', studentId, score: (score + (correct ? 1 : 0)), ts: Date.now() });
          }
        } catch (err) {
          console.error('Failed to save game result', err);
        }
      }
    }
  }

  function skipAndExit() {
    // Optionally persist zero / partial score and leave
    setShowModal(false);
    setCompleted(true);
    if (onEnd) onEnd();
    else window.history.back();
  }

  // Exit handler used by modal: calls parent onEnd or falls back
  function handleExit() {
    setShowModal(false);
    if (onEnd) onEnd();
    else window.history.back();
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">हिंदी क्लच — Sentence Jumble</h1>
            <p className="text-sm text-slate-600">Arrange words to form a correct Hindi sentence.</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-sm text-slate-500 text-right">
              <div>Question <span className="font-semibold text-slate-800">{index + 1}</span> / {questions.length}</div>
              <div className="mt-1 text-teal-600 font-bold text-lg">{score}</div>
            </div>
            <button
              onClick={() => { if (confirm('Leave the game? Your current progress will be lost.')) skipAndExit(); }}
              className="ml-4 px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            >
              Exit
            </button>
          </div>
        </div>

        {/* card */}
        <div className="bg-white rounded-2xl shadow p-6">
          {!completed ? (
            <>
              <div className="mb-4 text-slate-700 font-medium">{current.words.length > 0 ? 'Arrange the words:' : ''}</div>

              <div className="flex flex-wrap gap-3 mb-4">
                {current.words.map((w) => {
                  const disabled = answer.includes(w);
                  return (
                    <button
                      key={w}
                      onClick={() => chooseWord(w)}
                      disabled={disabled}
                      className={`px-3 py-2 rounded-md border transition ${disabled ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'}`}
                    >
                      {w}
                    </button>
                  );
                })}
              </div>

              <div className="min-h-[44px] border border-slate-200 rounded p-3 mb-4 bg-slate-50 flex items-center justify-between">
                <div className="text-slate-700">{answer.length ? answer.join(' ') : <span className="text-slate-400">Your sentence will appear here</span>}</div>
                <div className="flex items-center gap-2">
                  <button onClick={removeLastWord} disabled={!answer.length} className="px-2 py-1 rounded-md bg-white border text-slate-700 hover:bg-slate-50">Undo</button>
                  <button onClick={() => { setAnswer([]); }} disabled={!answer.length} className="px-2 py-1 rounded-md bg-white border text-slate-700 hover:bg-slate-50">Clear</button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={submit} className="px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700">Submit</button>
                <button onClick={() => { if (confirm('Skip and finish the game?')) {
                  // finalize without scoring remaining questions
                  setShowModal(true);
                  setCompleted(true);
                }}} className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50">Skip & Finish</button>
              </div>
            </>
          ) : (
            // Completed view (keeps consistent colors)
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Game complete</h2>
              <p className="text-slate-600 mb-4">Your final score is <span className="font-bold text-teal-600">{score}</span> / {questions.length}</p>
              <div className="flex justify-center gap-3">
                <button onClick={() => { setCompleted(false); setIndex(0); setAnswer([]); setScore(0); setSelectedWords({}); }} className="px-4 py-2 rounded-lg border bg-white text-slate-700 hover:bg-slate-50">Play again</button>
                <button onClick={handleExit} className="px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700">Exit</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <CompletionModal open={showModal} score={score} total={questions.length} onClose={() => setShowModal(false)} onExit={handleExit} />
    </div>
  );
}
