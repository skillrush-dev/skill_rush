import React, { useEffect, useMemo, useState } from "react";

/**
 * NumberScramble - Tailwind-only implementation (no external UI libs)
 *
 * Usage:
 *  import NumberScramble from "@/games/NumberScramble";
 *  <NumberScramble onComplete={(score)=>...} onHome={()=>...} />
 */

type NumberItem = { id: string; value: number };

const MAX_LEVEL = 3;
const ROUND_SECONDS = 30;

const createId = (prefix = "") =>
  `${prefix}${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const generateNumbers = (difficulty: number): NumberItem[] => {
  const count = 4 + difficulty; // 5..7 numbers
  const max = difficulty === 1 ? 100 : difficulty === 2 ? 1000 : 10000;
  const numbers: NumberItem[] = [];

  for (let i = 0; i < count; i++) {
    const value = Math.floor(Math.random() * max) + 1;
    numbers.push({ id: createId("n-"), value });
  }

  return numbers;
};

interface Props {
  onComplete?: (score: number) => void;
  onHome?: () => void;
}

export default function NumberScramble({ onComplete, onHome }: Props) {
  const [level, setLevel] = useState<number>(1);
  const [numbers, setNumbers] = useState<NumberItem[]>([]);
  const [userOrder, setUserOrder] = useState<string[]>([]);
  const [correctOrder, setCorrectOrder] = useState<string[]>([]);
  const [gameState, setGameState] = useState<"playing" | "correct" | "wrong">("playing");
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(ROUND_SECONDS);
  const [gameActive, setGameActive] = useState<boolean>(true);

  useEffect(() => {
    startNewRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  useEffect(() => {
    if (!gameActive) return;
    if (timeLeft <= 0) {
      setGameActive(false);
      setGameState("wrong");
      // simple in-UI message (no toast lib)
      setTimeout(() => {
        // show message briefly then allow retry by enabling reset/new
      }, 1000);
      return;
    }

    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, gameActive]);

  function startNewRound() {
    const items = generateNumbers(level);
    const sorted = [...items].sort((a, b) => a.value - b.value).map((it) => it.id);

    setNumbers(items);
    setCorrectOrder(sorted);
    setUserOrder([]);
    setGameState("playing");
    setTimeLeft(ROUND_SECONDS);
    setGameActive(true);
  }

  const handleNumberClick = (id: string) => {
    if (!gameActive || gameState !== "playing") return;
    if (userOrder.includes(id)) {
      setUserOrder((prev) => prev.filter((x) => x !== id));
    } else {
      const newOrder = [...userOrder, id];
      setUserOrder(newOrder);
      if (newOrder.length === numbers.length) {
        checkAnswer(newOrder);
      }
    }
  };

  const checkAnswer = (orderIds: string[]) => {
    const isCorrect = JSON.stringify(orderIds) === JSON.stringify(correctOrder);
    if (isCorrect) {
      setGameState("correct");
      const points = level * 10 + Math.floor(timeLeft / 2);
      setScore((s) => s + points);

      setTimeout(() => {
        if (level < MAX_LEVEL) {
          setLevel((l) => l + 1);
        } else {
          setGameActive(false);
          onComplete?.(score + points);
        }
      }, 900);
    } else {
      setGameState("wrong");
      setTimeout(() => {
        setUserOrder([]);
        setGameState("playing");
      }, 900);
    }
  };

  const resetGame = () => {
    setLevel(1);
    setScore(0);
    startNewRound();
  };

  const clearSelection = () => {
    setUserOrder([]);
    setGameState("playing");
  };

  const percent = useMemo(() => Math.round((level / MAX_LEVEL) * 100), [level]);

  const userOrderValues = userOrder.map((id) => numbers.find((n) => n.id === id)?.value ?? 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* top header card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Level {level}</h2>
              <p className="text-sm text-slate-500">Arrange the numbers from smallest to largest!</p>
            </div>

            <div className="text-right">
              <div className="text-3xl font-bold text-emerald-600">{score}</div>
              <div className="text-xs text-slate-400">Points</div>
            </div>
          </div>

          <div className="mt-4">
            {/* progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="h-3 rounded-full"
                style={{
                  width: `${percent}%`,
                  background: "linear-gradient(90deg,#0ea5a4,#f59e0b)",
                }}
              />
            </div>
          </div>
        </div>

        {/* game card */}
        <div className="bg-white rounded-xl shadow-md p-8 border">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-3">🎯 Click numbers in ascending order</h3>

            <div className="text-sm text-slate-500 mb-6">Time left: <span className="font-semibold text-slate-700">{timeLeft}s</span></div>

            {/* numbers grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-xl mx-auto">
              {numbers.map((item, index) => {
                const selected = userOrder.includes(item.id);
                const badgeIndex = selected ? userOrder.indexOf(item.id) + 1 : null;
                const bg =
                  selected && gameState === "correct"
                    ? "bg-green-100 border-green-300"
                    : selected && gameState === "wrong"
                    ? "bg-red-100 border-red-300"
                    : selected
                    ? "bg-emerald-50 border-emerald-200"
                    : "bg-slate-50 border-slate-200";

                return (
                  <button
                    key={`${item.id}-${index}`}
                    onClick={() => handleNumberClick(item.id)}
                    disabled={!gameActive}
                    className={`relative h-16 rounded-xl border shadow-sm flex items-center justify-center text-xl font-semibold text-slate-900 ${bg} hover:scale-[1.02] transition`}
                  >
                    <span>{item.value}</span>
                    {badgeIndex && (
                      <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                        {badgeIndex}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* user's current order */}
            {userOrder.length > 0 && (
              <div className="mt-6">
                <p className="text-sm text-slate-500 mb-2">Your order:</p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  {userOrderValues.map((v, i) => (
                    <div key={`${v}-${i}`} className="px-3 py-1 bg-slate-100 rounded-full text-slate-800 font-medium">
                      {v}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* messages */}
            <div className="mt-4 min-h-[30px]">
              {gameState === "correct" && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-800 font-semibold">
                  ✓ Correct — moving on...
                </div>
              )}
              {gameState === "wrong" && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-800 font-semibold">
                  ✕ Not quite right — try again
                </div>
              )}
            </div>
          </div>

          {/* actions */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={clearSelection}
              className="px-6 py-2 rounded-full bg-white border shadow-sm hover:bg-slate-50 transition"
            >
              Clear Selection
            </button>

            <button
              onClick={resetGame}
              className="px-6 py-2 rounded-full bg-yellow-400 text-slate-900 font-semibold shadow hover:brightness-95 transition"
            >
              ↻ New Game
            </button>

            <div className="ml-4 text-sm text-slate-500">
              {/* navigation */}
              <button
                onClick={() => {
                  if (level > 1) setLevel((l) => l - 1);
                }}
                disabled={level === 1}
                className={`px-3 py-2 rounded-md mr-2 ${level === 1 ? "text-slate-300" : "text-slate-700 bg-slate-50 border"}`}
              >
                Prev
              </button>

              <button
                onClick={() => {
                  if (!gameActive && level >= MAX_LEVEL) {
                    // finished
                    resetGame();
                  } else if (gameState === "correct") {
                    if (level < MAX_LEVEL) setLevel((l) => l + 1);
                    else {
                      setGameActive(false);
                      onComplete?.(score);
                    }
                  } else {
                    // attempt to check if user selected full length
                    if (userOrder.length === numbers.length) {
                      checkAnswerManually();
                    } else {
                      // try auto-check: do nothing - encourage to finish selection
                    }
                  }
                }}
                className="px-4 py-2 rounded-md bg-emerald-600 text-white font-semibold ml-2"
              >
                {level >= MAX_LEVEL && !gameActive ? "Finish" : "Next"}
              </button>
            </div>
          </div>
        </div>

        {/* final card */}
        {!gameActive && level >= MAX_LEVEL && (
          <div className="bg-white rounded-xl shadow-md p-8 mt-8 text-center border">
            <h3 className="text-2xl font-extrabold mb-2">🎉 Congratulations!</h3>
            <p className="text-slate-600 mb-4">You've completed Number Scramble. Score: <strong className="text-emerald-600">{score}</strong></p>
            <div className="flex items-center justify-center gap-4">
              <button onClick={resetGame} className="px-6 py-2 rounded-full bg-emerald-600 text-white font-semibold">Play Again</button>
              <button onClick={() => onHome?.()} className="px-6 py-2 rounded-full bg-white border">Return Home</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // helpers placed after return to keep main jsx above
  function checkAnswerManually() {
    // same as checkAnswer but internal
    const orderIds = [...userOrder];
    const isCorrect = JSON.stringify(orderIds) === JSON.stringify(correctOrder);
    if (isCorrect) {
      setGameState("correct");
      const points = level * 10 + Math.floor(timeLeft / 2);
      setScore((s) => s + points);
      setTimeout(() => {
        if (level < MAX_LEVEL) setLevel((l) => l + 1);
        else {
          setGameActive(false);
          onComplete?.(score + points);
        }
      }, 900);
    } else {
      setGameState("wrong");
      setTimeout(() => {
        setUserOrder([]);
        setGameState("playing");
      }, 900);
    }
  }
}
