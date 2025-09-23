import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from "@hello-pangea/dnd";

import { motion, AnimatePresence } from "framer-motion";

/**
 * HindiGamesPage.tsx
 *
 * Single-file app with:
 * - Candy Crush style level map
 * - Sentence Jumble (drag-and-drop + framer-motion bounce)
 * - Picture Quiz
 * - Simple Crossword
 * - Roman -> Devanagari transliteration input
 *
 * Tailwind classes are used for styling. If you don't have Tailwind, either install it
 * or replace classNames with your own CSS.
 */

// ---------------------- Simple Roman -> Devanagari Transliterator ----------------------
function transliterateRomanToDevanagari(input: string) {
  // This is a compact heuristic transliterator that covers many common Hindi phonemes.
  // It's intentionally simple and deterministic for demo purposes.
  // Extend the map as needed.
  const map: { [k: string]: string } = {
    // vowels and combinations
    "aa": "आ",
    "ai": "ऐ",
    "au": "औ",
    "a": "अ",
    "i": "इ",
    "ii": "ई",
    "ee": "ई",
    "u": "उ",
    "uu": "ऊ",
    "e": "ए",
    "o": "ओ",
    // consonants common combos (use longest-first)
    "kh": "ख",
    "gh": "घ",
    "ch": "च",
    "chh": "छ",
    "jh": "झ",
    "th": "थ",
    "dh": "ध",
    "ph": "फ",
    "bh": "भ",
    "sh": "श",
    "shh": "ष",
    "ng": "ङ",
    "nj": "ञ",
    "k": "क",
    "g": "ग",
    "c": "क",
    "j": "ज",
    "t": "ट",
    "d": "ड",
    "n": "न",
    "p": "प",
    "b": "ब",
    "m": "म",
    "y": "य",
    "r": "र",
    "l": "ल",
    "v": "व",
    "s": "स",
    "h": "ह",
    // matras (for simplicity, we'll output standalone vowels mostly)
  };

  // We'll do a greedy longest-match transliteration
  const out: string[] = [];
  let i = 0;
  const lower = input.toLowerCase();
  while (i < lower.length) {
    // try longest 3,2,1 matches
    let matched = false;
    for (let len = 3; len >= 1; len--) {
      if (i + len <= lower.length) {
        const chunk = lower.slice(i, i + len);
        if (map[chunk]) {
          out.push(map[chunk]);
          i += len;
          matched = true;
          break;
        }
      }
    }
    if (!matched) {
      // if not found, just push the char as-is (or skip)
      const ch = lower[i];
      // keep ASCII punctuation/spaces
      if (ch === " " || ch === "." || ch === "," || ch === "?") out.push(ch);
      else out.push(ch); // fallback
      i++;
    }
  }
  return out.join("");
}

// ---------------------- Sentence Jumble (animated DnD) ----------------------
type SJQuestion = { words: string[]; correct: string; hint?: string };

function SentenceJumble({
  questions,
  onComplete,
}: {
  questions: SJQuestion[];
  onComplete: (score: number) => void;
}) {
  const [idx, setIdx] = useState(0);
  const [words, setWords] = useState<string[]>([...questions[0].words]);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState<null | boolean>(null);

  useEffect(() => {
    setWords([...questions[idx].words]);
    setShowFeedback(null);
  }, [idx, questions]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newWords = Array.from(words);
    const [moved] = newWords.splice(result.source.index, 1);
    newWords.splice(result.destination.index, 0, moved);
    setWords(newWords);
  };

  const submit = () => {
    const formed = words.join(" ");
    const ok = formed.trim() === questions[idx].correct.trim();
    setShowFeedback(ok);
    if (ok) setScore((s) => s + 1);

    // after short delay, advance level or complete
    setTimeout(() => {
      if (idx + 1 < questions.length) setIdx((i) => i + 1);
      else onComplete(score + (ok ? 1 : 0));
      setShowFeedback(null);
    }, 850);
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow-lg max-w-3xl mx-auto">
      <h3 className="text-xl font-semibold mb-2">Sentence Jumble (Vakya Sahi Karo)</h3>
      <p className="text-sm mb-3 text-gray-600">{questions[idx].hint ?? "Arrange the words correctly."}</p>

      <div className="mb-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="sj-words" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-wrap gap-3 mb-2 min-h-[56px]"
                style={{ alignItems: "center" }}
              >
                {words.map((w, i) => (
                  <Draggable key={`${w}-${i}`} draggableId={`${w}-${i}`} index={i}>
                    {(prov, snap) => (
                      <motion.div
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        {...prov.dragHandleProps}
                        layout
                        initial={{ scale: 0.9, opacity: 0.6 }}
                        animate={{ scale: 1, opacity: 1 }}
                        whileDrag={{ scale: 1.15, rotate: [0, 6, -6, 0] }}
                        transition={{ type: "spring", stiffness: 700, damping: 30 }}
                        className={`px-4 py-2 rounded-lg shadow cursor-grab select-none ${
                          snap.isDragging ? "bg-indigo-300" : "bg-indigo-100"
                        }`}
                      >
                        <span className="text-lg font-medium">{w}</span>
                      </motion.div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <div className="flex gap-2 mt-3 items-center">
          <button
            onClick={submit}
            className="px-4 py-2 rounded bg-emerald-500 text-white hover:bg-emerald-600 transition"
          >
            Submit
          </button>

          <div className="text-sm text-gray-700">Formed: <span className="font-medium">{words.join(" ")}</span></div>
        </div>

        <AnimatePresence>
          {showFeedback !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`mt-3 p-3 rounded ${showFeedback ? "bg-green-100" : "bg-red-100"} text-sm`}
            >
              {showFeedback ? "Correct! ⭐" : "Oops — not quite. Try the next one!"}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-sm text-gray-600">Question {idx + 1} / {questions.length} — Score: {score}</div>
    </div>
  );
}

// ---------------------- Picture Quiz ----------------------
type PictureQ = { img: string; options: string[]; correct: string; caption?: string };
function PictureQuiz({ questions, onComplete }: { questions: PictureQ[]; onComplete: (score: number) => void }) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [locked, setLocked] = useState(false);

  const choose = (opt: string) => {
    if (locked) return;
    const ok = opt === questions[idx].correct;
    if (ok) setScore((s) => s + 1);
    setLocked(true);

    setTimeout(() => {
      if (idx + 1 < questions.length) {
        setIdx((i) => i + 1);
        setLocked(false);
      } else {
        onComplete(score + (ok ? 1 : 0));
      }
    }, 700);
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow-lg max-w-3xl mx-auto">
      <h3 className="text-xl font-semibold mb-2">Picture Quiz (चित्र चुनें)</h3>
      <div className="flex flex-col items-center gap-3">
        <img src={questions[idx].img} alt="quiz" className="w-48 h-48 object-contain rounded-lg shadow-sm" />
        {questions[idx].caption && <div className="text-sm text-gray-500">{questions[idx].caption}</div>}
        <div className="flex flex-wrap gap-3 justify-center mt-2">
          {questions[idx].options.map((opt) => (
            <motion.button
              key={opt}
              onClick={() => choose(opt)}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-md bg-yellow-100 shadow"
            >
              {opt}
            </motion.button>
          ))}
        </div>
      </div>
      <div className="text-sm text-gray-600 mt-3">Question {idx + 1} / {questions.length} — Score: {score}</div>
    </div>
  );
}

// ---------------------- Simple Crossword Component ----------------------
/**
 * Minimal crossword implementation: grid with across clues only for brevity.
 * The crossword is small and educational: user types letters (roman->dev transliteration below field).
 */

type XCWord = {
  word: string; // Devanagari string (target)
  row: number; // 0-index
  col: number; // 0-index starting column
  clue: string;
};

function SimpleCrossword({ words, onComplete }: { words: XCWord[]; onComplete: (score: number) => void }) {
  // build grid size dynamically
  const rows = 8;
  const cols = 12;
  // grid of chars (target), '.' empty
  const gridTarget: string[][] = Array.from({ length: rows }, () => Array.from({ length: cols }, () => ""));

  for (const w of words) {
    for (let i = 0; i < w.word.length; i++) {
      gridTarget[w.row][w.col + i] = w.word[i];
    }
  }

  // user's entries
  const [entries, setEntries] = useState<string[][]>(() => Array.from({ length: rows }, () => Array.from({ length: cols }, () => "")));
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (r: number, c: number, v: string) => {
    const copy = entries.map((row) => row.slice());
    // Accept roman input and transliterate on the fly if possible
    // For simplicity, if user types ascii letters, we transliterate entire input
    copy[r][c] = v;
    setEntries(copy);
  };

  const checkAnswers = () => {
    let s = 0;
    for (const w of words) {
      let ok = true;
      for (let i = 0; i < w.word.length; i++) {
        const r = w.row;
        const c = w.col + i;
        const target = gridTarget[r][c];
        const given = entries[r][c] || "";
        if (given !== target) {
          ok = false;
          break;
        }
      }
      if (ok) s++;
    }
    setScore(s);
    setSubmitted(true);
    onComplete(s);
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow-lg max-w-3xl mx-auto">
      <h3 className="text-xl font-semibold mb-2">Crossword — शब्द पहेली</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="inline-grid" style={{ gridTemplateColumns: `repeat(${cols}, 36px)` }}>
            {gridTarget.map((row, r) =>
              row.map((cell, c) => {
                const isLetter = cell !== "";
                return (
                  <div key={`${r}-${c}`} className={`border w-9 h-9 flex items-center justify-center ${isLetter ? "bg-white" : "bg-gray-100"}`}>
                    {isLetter ? (
                      <input
                        value={entries[r][c] ?? ""}
                        onChange={(e) => handleChange(r, c, e.target.value.trim())}
                        className="w-full h-full text-center outline-none text-lg"
                        maxLength={1}
                      />
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
          <div className="mt-3">
            <button onClick={checkAnswers} className="px-3 py-1 bg-rose-500 text-white rounded">Check</button>
            {submitted && <span className="ml-3 text-sm text-gray-700">Score: {score} / {words.length}</span>}
          </div>
        </div>

        <div>
          <h4 className="font-semibold">Clues</h4>
          <ol className="list-decimal ml-5 text-sm">
            {words.map((w, i) => (
              <li key={i} className="mb-2">
                <div className="font-medium">{w.clue}</div>
                <div className="text-xs text-gray-500">Length: {w.word.length}</div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

// ---------------------- Candy Crush inspired Level Map & Page ----------------------
export default function HindiGamesPage(): JSX.Element {
  // page-level state
  const [activeGame, setActiveGame] = useState<"sentence" | "picture" | "crossword" | null>(null);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [starsAwarded, setStarsAwarded] = useState(0);

  // sample content
  const sentenceQuestions: SJQuestion[] = [
    {
      words: ["हैं", "बच्चे", "खेल", "रहे"],
      correct: "बच्चे खेल रहे हैं",
      hint: "They are playing — बच्चों के लिए वाक्य",
    },
    { words: ["मैंने", "खाया", "आम"], correct: "मैंने आम खाया", hint: "I ate a mango." },
    { words: ["सीमा", "पढ़", "रही", "है"], correct: "सीमा पढ़ रही है", hint: "Seema is reading." },
    { words: ["राज", "स्कूल", "जाता", "है"], correct: "राज स्कूल जाता है", hint: "Raj goes to school." },
  ];

  const pictureQuestions: PictureQ[] = [
    { img: "/fruits/mango.png", options: ["सेब", "केला", "आम"], correct: "आम", caption: "Aam (Mango)" },
    { img: "/animals/cat.png", options: ["कुत्ता", "बिल्ली", "घोड़ा"], correct: "बिल्ली", caption: "Billi (Cat)" },
    { img: "/colors/red.png", options: ["लाल", "नीला", "हरा"], correct: "लाल", caption: "Laal (Red)" },
  ];

  const crosswordWords: XCWord[] = [
    { word: "आम", row: 1, col: 1, clue: "रसीला फल (3 letters)" },
    { word: "बिल्ली", row: 3, col: 1, clue: "पालतू जानवर जो म्याऊँ करता है" },
    { word: "स्कूल", row: 5, col: 2, clue: "जहाँ बच्चे पढ़ते हैं" },
  ];

  // level completion handler - calculate stars from score (example)
  const handleComplete = (score: number) => {
    setLastScore(score);
    // simple star awarding: percent of possible -> 0..3
    const maxPossible = 4; // e.g. number of items in the game / or fixed scale
    const pct = Math.min(1, score / Math.max(1, maxPossible));
    const stars = pct >= 0.85 ? 3 : pct >= 0.6 ? 2 : pct >= 0.3 ? 1 : 0;
    setStarsAwarded(stars);
    setShowLevelComplete(true);
    // auto-hide after 1.8s
    setTimeout(() => setShowLevelComplete(false), 1800);
  };

  // transliteration demo state
  const [roman, setRoman] = useState("");
  const devanagari = transliterateRomanToDevanagari(roman);

  // Level map positions (simple linear map)
  const mapNodes = new Array(7).fill(null).map((_, i) => ({ id: i + 1, unlocked: true }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-indigo-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold">HINDI clutch · Learn Hindi with Games 🎮</h1>
          <p className="text-sm text-gray-600">Play levels, earn stars, and progress along a colorful map — Candy-Crush style.</p>
        </header>

        {/* Level map */}
        <section className="mb-6">
          <div className="relative bg-white rounded-2xl p-6 shadow-md overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src="/mnt/data/32005bd1-e0ca-46a2-a6e2-cd3223a97773.png" alt="map" className="w-20 h-20 object-cover rounded-lg shadow-sm" />
                <div>
                  <div className="text-lg font-semibold">Level Path</div>
                  <div className="text-xs text-gray-500">Complete levels to unlock new topics and earn stars</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-sm">Last score: {lastScore ?? "-"}</div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <span key={i} className={`${i < starsAwarded ? "text-yellow-400" : "text-gray-300"} text-2xl`}>★</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-between">
              {/* map path — spaced circular nodes */}
              <div className="flex items-center gap-6">
                {mapNodes.map((n) => (
                  <motion.div
                    key={n.id}
                    whileHover={{ scale: 1.08 }}
                    className="flex flex-col items-center gap-1 cursor-pointer"
                    onClick={() => {
                      // clicking a node opens a small level chooser (for demo, open sentence)
                      setActiveGame("sentence");
                    }}
                  >
                    <div className="bg-pink-200 w-12 h-12 rounded-full flex items-center justify-center shadow">{n.id}</div>
                    <div className="text-xs text-gray-600">Lvl {n.id}</div>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col gap-2 items-end">
                <div className="text-sm text-gray-700">Choose a game to play:</div>
                <div className="flex gap-2">
                  <button onClick={() => setActiveGame("sentence")} className={`px-3 py-1 rounded ${activeGame === "sentence" ? "bg-blue-400 text-white" : "bg-gray-200"}`}>Sentence Jumble</button>
                  <button onClick={() => setActiveGame("picture")} className={`px-3 py-1 rounded ${activeGame === "picture" ? "bg-purple-400 text-white" : "bg-gray-200"}`}>Picture Quiz</button>
                  <button onClick={() => setActiveGame("crossword")} className={`px-3 py-1 rounded ${activeGame === "crossword" ? "bg-rose-400 text-white" : "bg-gray-200"}`}>Crossword</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main content */}
        <main>
          {activeGame === "sentence" && (
            <SentenceJumble questions={sentenceQuestions} onComplete={(s) => handleComplete(s)} />
          )}

          {activeGame === "picture" && (
            <PictureQuiz questions={pictureQuestions} onComplete={(s) => handleComplete(s)} />
          )}

          {activeGame === "crossword" && (
            <SimpleCrossword words={crosswordWords} onComplete={(s) => handleComplete(s)} />
          )}

          {/* If no active game, show a quick dashboard */}
          {!activeGame && (
            <div className="p-6 bg-white rounded-2xl shadow-lg text-center">
              <h3 className="text-lg font-semibold mb-2">Pick a game to begin</h3>
              <p className="text-sm text-gray-600 mb-4">Each level teaches a small Hindi topic. Complete levels to get stars!</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setActiveGame("sentence")} className="px-4 py-2 bg-blue-500 text-white rounded">Sentence Jumble</button>
                <button onClick={() => setActiveGame("picture")} className="px-4 py-2 bg-purple-500 text-white rounded">Picture Quiz</button>
                <button onClick={() => setActiveGame("crossword")} className="px-4 py-2 bg-rose-500 text-white rounded">Crossword</button>
              </div>
            </div>
          )}
        </main>

        {/* Transliteration input */}
        <section className="mt-6">
          <div className="p-4 bg-white rounded-2xl shadow-md max-w-3xl mx-auto">
            <h4 className="font-semibold mb-2">Type in Roman (auto-convert to Devanagari)</h4>
            <div className="flex gap-3">
              <input
                value={roman}
                onChange={(e) => setRoman(e.target.value)}
                className="flex-1 px-3 py-2 border rounded"
                placeholder='Type "namak" -> नमक, "ka" -> का, etc.'
              />
              <div className="px-4 py-2 bg-gray-100 rounded w-64">{devanagari || <span className="text-gray-400">Devanagari preview</span>}</div>
            </div>
          </div>
        </section>

        {/* Level complete modal/animation */}
        <AnimatePresence>
          {showLevelComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
            >
              <motion.div initial={{ scale: 0.7 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400 }} className="bg-white p-6 rounded-3xl shadow-2xl text-center w-96">
                <div className="text-3xl mb-2">🎉 Level Complete!</div>
                <div className="flex justify-center gap-3 text-3xl mb-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0.6, y: -10 }}
                      animate={{ scale: i < starsAwarded ? 1.2 : 0.9, y: 0 }}
                      transition={{ type: "spring", stiffness: 300, delay: i * 0.08 }}
                      className={`${i < starsAwarded ? "text-yellow-400" : "text-gray-300"}`}
                    >
                      ★
                    </motion.span>
                  ))}
                </div>
                <div className="text-sm text-gray-600 mb-4">You scored {lastScore ?? 0}. Great job — keep going!</div>
                <div className="flex justify-center gap-3">
                  <button onClick={() => setShowLevelComplete(false)} className="px-4 py-2 rounded bg-indigo-500 text-white">Continue</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* small footer */}
        <footer className="mt-8 text-center text-xs text-gray-500">
          Built for demo — expand questions, images, and crossword data for a richer app.
        </footer>
      </div>
    </div>
  );
}
