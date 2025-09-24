// src/games/NumberScramble.tsx
import React, { useEffect, useMemo, useState } from "react";
import TutorialOverlay from "../components/TutorialOverlay";
import { useTranslation } from "react-i18next";

type NumberItem = { id: string; value: number };

const MAX_LEVEL = 3;
const ROUND_SECONDS = 30;
const createId = (prefix = "") => `${prefix}${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const generateNumbers = (difficulty: number): NumberItem[] => {
  const count = 4 + difficulty;
  const max = difficulty === 1 ? 100 : difficulty === 2 ? 1000 : 10000;
  const numbers: NumberItem[] = [];
  for (let i = 0; i < count; i++) {
    const value = Math.floor(Math.random() * max) + 1;
    numbers.push({ id: createId("n-"), value });
  }
  return numbers;
};

export default function NumberScramble({
  onComplete,
  onHome,
  onLearn,
}: {
  onComplete?: (score: number) => void;
  onHome?: () => void;
  onLearn?: () => void;
}) {
  const { t, i18n } = useTranslation();
  const [level, setLevel] = useState<number>(1);
  const [numbers, setNumbers] = useState<NumberItem[]>([]);
  const [userOrder, setUserOrder] = useState<string[]>([]);
  const [correctOrder, setCorrectOrder] = useState<string[]>([]);
  const [gameState, setGameState] = useState<"playing" | "correct" | "wrong">("playing");
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(ROUND_SECONDS);
  const [gameActive, setGameActive] = useState<boolean>(true);

  // tutorial state
  const [tutorialOpen, setTutorialOpen] = useState(false);

  useEffect(() => {
    startNewRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  useEffect(() => {
    if (!gameActive) return;
    if (timeLeft <= 0) {
      setGameActive(false);
      setGameState("wrong");
      return;
    }
    const tmr = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(tmr);
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

  // tutorial steps reference selectors used in this component
  const tutorialSteps = [
    { selector: ".number-grid", message: t("numberScramble.help") },
    { selector: ".clear-btn", message: t("numberScramble.startTutorial") },
    { selector: ".learn-btn", message: t("numberScramble.learnTopic") },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-world-numbers/10 to-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={onHome} className="px-3 py-1 bg-white border rounded">Home</button>
            <h1 className="text-3xl font-bold text-primary">{t("numberScramble.title")}</h1>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setTutorialOpen(true)} className="px-3 py-1 bg-white border rounded">
              {t("tutorial")}
            </button>

            <button onClick={() => onLearn?.()} className="px-3 py-1 bg-yellow-400 rounded text-slate-900 learn-btn">
              {t("learn")}
            </button>

            <div className="px-3 py-1 bg-white border rounded">{timeLeft}s</div>
            <div className="px-3 py-1 bg-white border rounded">Score: {score}</div>
          </div>
        </div>

        {/* Info card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold mb-2">Level {level}</h2>
              <p className="text-muted-foreground">{t("numberScramble.help")}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-world-numbers mb-1">{score}</div>
              <div className="text-sm text-muted-foreground">Points</div>
            </div>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div style={{ width: `${percent}%` }} className="h-3 rounded-full" />
          </div>
        </div>

        {/* Main game card */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8 border">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">{t("numberScramble.help")}</h3>

            {/* Numbers Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-md mx-auto mb-8 number-grid">
              {numbers.map((item, index) => {
                const selected = userOrder.includes(item.id);
                const badge = selected ? userOrder.indexOf(item.id) + 1 : null;
                const bg = selected ? "bg-emerald-100" : "bg-slate-50";
                return (
                  <button
                    key={`${item.id}-${index}`}
                    onClick={() => handleNumberClick(item.id)}
                    disabled={!gameActive}
                    className={`h-16 rounded-xl border shadow-sm flex items-center justify-center text-xl font-semibold ${bg}`}
                  >
                    <span>{item.value}</span>
                    {badge && <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">{badge}</span>}
                  </button>
                );
              })}
            </div>

            {/* user's current order */}
            {userOrder.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">Your order:</p>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {userOrderValues.map((v, i) => (
                    <div key={`${v}-${i}`} className="px-3 py-1 bg-slate-100 rounded-full text-slate-800 font-medium">{v}</div>
                  ))}
                </div>
              </div>
            )}

            {/* messages */}
            <div className="mt-4 min-h-[30px]">
              {gameState === "correct" && <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-800 font-semibold">✓ Correct — moving on...</div>}
              {gameState === "wrong" && <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-800 font-semibold">✕ Not quite right — try again</div>}
            </div>
          </div>

          {/* actions */}
          <div className="flex items-center justify-center gap-4">
            <button onClick={clearSelection} className="px-6 py-2 rounded-full bg-white border shadow-sm clear-btn">Clear Selection</button>
            <button onClick={resetGame} className="px-6 py-2 rounded-full bg-yellow-400 text-slate-900">↻ New Game</button>
          </div>
        </div>

        {/* final */}
        {!gameActive && level >= MAX_LEVEL && (
          <div className="bg-white rounded-xl shadow-md p-8 mt-8 text-center border">
            <h3 className="text-2xl font-extrabold mb-2">🎉 Congratulations!</h3>
            <p className="text-slate-600 mb-4">You've completed Number Scramble — Score: <strong>{score}</strong></p>
            <div className="flex items-center justify-center gap-4">
              <button onClick={resetGame} className="px-6 py-2 rounded-full bg-emerald-600 text-white">Play Again</button>
              <button onClick={() => onHome?.()} className="px-6 py-2 rounded-full bg-white border">Return Home</button>
            </div>
          </div>
        )}
      </div>

      {tutorialOpen && (
        <TutorialOverlay
          steps={tutorialSteps}
          onClose={() => setTutorialOpen(false)}
          autoplay={false}
        />
      )}
    </div>
  );
}
