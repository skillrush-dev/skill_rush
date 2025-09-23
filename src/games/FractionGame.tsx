// src/games/FractionGame.tsx
import React, { useMemo, useState } from "react";

type Piece = { value: number; label: string };

type Level = {
  id: string;
  title?: string;
  targetValue: number;
  pieces: Piece[];
  xpReward?: number;
};

const STORAGE_XP = "userXP";
const STORAGE_HIGH_MARKS = "fraction_highest_marks";

const LEVELS: Level[] = [
  {
    id: "lvl-1",
    title: "Bridge to Quarter Creek",
    targetValue: 1 / 2,
    xpReward: 50,
    pieces: [
      { value: 1 / 4, label: "1/4" },
      { value: 1 / 4, label: "1/4" },
      { value: 1 / 8, label: "1/8" },
      { value: 1 / 8, label: "1/8" },
      { value: 1 / 8, label: "1/8" },
      { value: 1 / 8, label: "1/8" },
    ],
  },
  {
    id: "lvl-2",
    title: "The Halfway Pond",
    targetValue: 3 / 4,
    xpReward: 60,
    pieces: [
      { value: 1 / 2, label: "1/2" },
      { value: 1 / 4, label: "1/4" },
      { value: 1 / 8, label: "1/8" },
      { value: 1 / 8, label: "1/8" },
      { value: 1 / 16, label: "1/16" },
      { value: 1 / 16, label: "1/16" },
    ],
  },
  {
    id: "lvl-3",
    title: "The Three-Quarter Bridge",
    targetValue: 2 / 3,
    xpReward: 70,
    pieces: [
      { value: 1 / 3, label: "1/3" },
      { value: 1 / 3, label: "1/3" },
      { value: 1 / 6, label: "1/6" },
      { value: 1 / 6, label: "1/6" },
      { value: 1 / 12, label: "1/12" },
    ],
  },
  {
    id: "lvl-4",
    title: "Bridge of Fifths",
    targetValue: 3 / 5,
    xpReward: 80,
    pieces: [
      { value: 1 / 5, label: "1/5" },
      { value: 1 / 5, label: "1/5" },
      { value: 1 / 5, label: "1/5" },
      { value: 1 / 10, label: "1/10" },
      { value: 1 / 10, label: "1/10" },
    ],
  },
  {
    id: "lvl-5",
    title: "Equally Split River",
    targetValue: 7 / 8,
    xpReward: 90,
    pieces: [
      { value: 1 / 2, label: "1/2" },
      { value: 1 / 4, label: "1/4" },
      { value: 1 / 8, label: "1/8" },
      { value: 1 / 16, label: "1/16" },
    ],
  },
  {
    id: "lvl-6",
    title: "Mixed Fraction Crossing",
    targetValue: 5 / 6,
    xpReward: 100,
    pieces: [
      { value: 1 / 2, label: "1/2" },
      { value: 1 / 3, label: "1/3" },
      { value: 1 / 6, label: "1/6" },
      { value: 1 / 12, label: "1/12" },
    ],
  },
];

function readInt(key: string, fallback = 0): number {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : fallback;
}

export default function FractionGame(): JSX.Element {
  const [levelIndex, setLevelIndex] = useState<number>(0);
  const level = LEVELS[levelIndex];

  const [placedPieces, setPlacedPieces] = useState<Piece[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [completed, setCompleted] = useState<boolean>(false);

  // XP and highest marks
  const initialXp = readInt(STORAGE_XP, 0);
  const [totalXp, setTotalXp] = useState<number>(initialXp);
  const highestMarksInitial = readInt(STORAGE_HIGH_MARKS, 0);
  const [highestMarks, setHighestMarks] = useState<number>(highestMarksInitial);

  const placedSum = useMemo(() => placedPieces.reduce((s, p) => s + p.value, 0), [placedPieces]);
  const tolerance = 0.001;
  const MARKS_PER_LEVEL = 10;
  const TOTAL_MARKS = LEVELS.length * MARKS_PER_LEVEL;

  // place a piece
  const handlePlace = (piece: Piece) => {
    if (completed) return;
    setPlacedPieces((prev) => [...prev, piece]);
    setStatusMessage("");
  };

  const undoLast = () => {
    setPlacedPieces((prev) => prev.slice(0, -1));
    setStatusMessage("");
  };

  const resetLevel = () => {
    setPlacedPieces([]);
    setStatusMessage("");
    setCompleted(false);
  };

  const checkSolution = () => {
    if (Math.abs(placedSum - level.targetValue) < tolerance) {
      setCompleted(true);
      setStatusMessage("Successfully completed!");

      // award XP
      const reward = level.xpReward ?? 50;
      const newXp = totalXp + reward;
      setTotalXp(newXp);
      localStorage.setItem(STORAGE_XP, String(newXp));

      // compute marks achieved so far (levels completed count)
      const marksAchieved = (levelIndex + 1) * MARKS_PER_LEVEL;
      if (marksAchieved > highestMarks) {
        setHighestMarks(marksAchieved);
        localStorage.setItem(STORAGE_HIGH_MARKS, String(marksAchieved));
      }
    } else {
      setStatusMessage("That's not quite right. Keep trying!");
    }
  };

  const goNext = () => {
    if (!completed && levelIndex + 1 < LEVELS.length) {
      // prevent going next without completing
      setStatusMessage("Finish the current level before moving on.");
      return;
    }
    if (levelIndex + 1 >= LEVELS.length) {
      setStatusMessage("All levels completed — great job!");
      setCompleted(true);
      setPlacedPieces([]);
      return;
    }
    setLevelIndex((i) => i + 1);
    setPlacedPieces([]);
    setStatusMessage("");
    setCompleted(false);
  };

  const goPrev = () => {
    if (levelIndex === 0) return;
    setLevelIndex((i) => i - 1);
    setPlacedPieces([]);
    setStatusMessage("");
    setCompleted(false);
  };

  const restartAll = () => {
    setLevelIndex(0);
    setPlacedPieces([]);
    setStatusMessage("");
    setCompleted(false);
  };

  const isLastLevel = levelIndex + 1 >= LEVELS.length;

  return (
    <div style={styles.gameContainer}>
      <header style={styles.header}>
        <div style={{ textAlign: "left" }}>
          <h1 style={{ margin: 0 }}>{level.title ?? "Fraction Puzzle"}</h1>
          <div style={{ color: "#555", marginTop: 6 }}>
            Target: <strong>{level.targetValue}</strong>
          </div>
        </div>

        <div style={styles.topRight}>
          <div style={{ textAlign: "right", marginBottom: 8 }}>
            <div style={{ fontSize: 12, color: "#666" }}>Best (marks)</div>
            <div style={{ fontWeight: 700, color: "#4f46e5", fontSize: 18 }}>
              {highestMarks} / {TOTAL_MARKS}
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, color: "#666" }}>Level</div>
            <div style={{ fontWeight: 700, color: "#0f172a" }}>
              {levelIndex + 1}/{LEVELS.length}
            </div>
          </div>
        </div>
      </header>

      <p style={{ marginTop: 8, color: "#333" }}>
        Use the tiles below and place pieces so their sum equals{" "}
        <strong>{level.targetValue}</strong>.
      </p>

      <div style={styles.bridgeBlueprint} aria-label="Bridge blueprint">
        {placedPieces.length === 0 ? (
          <div style={{ color: "#888", alignSelf: "center" }}>Place pieces here</div>
        ) : (
          placedPieces.map((piece, index) => (
            <div key={`${piece.label}-${index}`} style={styles.piece}>
              {piece.label}
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: 8, color: "#333" }}>
        <strong>Placed sum:</strong>{" "}
        {placedSum.toFixed(4).replace(/\.?0+$/, "")}{" "}
        <span style={{ color: Math.abs(placedSum - level.targetValue) < tolerance ? "green" : "#666" }}>
          {Math.abs(placedSum - level.targetValue) < tolerance ? "✓ correct" : ""}
        </span>
      </div>

      <div style={styles.fractionPieces}>
        {level.pieces.map((piece, index) => (
          <div
            key={`${piece.label}-${index}`}
            style={styles.piece}
            onClick={() => handlePlace(piece)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") handlePlace(piece);
            }}
            aria-label={`Place piece ${piece.label}`}
          >
            {piece.label}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 18, alignItems: "center" }}>
        <button onClick={checkSolution} style={styles.primaryButton}>
          Check Bridge
        </button>

        <button onClick={undoLast} style={styles.visibleButton}>
          Undo
        </button>

        <button onClick={resetLevel} style={styles.visibleButton}>
          Reset
        </button>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button
            onClick={goPrev}
            style={{
              ...styles.navButton,
              color: levelIndex === 0 ? "#9ca3af" : styles.navButton.color,
              cursor: levelIndex === 0 ? "not-allowed" : "pointer",
              opacity: levelIndex === 0 ? 0.65 : 1,
            }}
            disabled={levelIndex === 0}
            aria-disabled={levelIndex === 0}
          >
            Prev
          </button>

          <button
            onClick={goNext}
            style={{
              ...styles.primaryButton,
              opacity: completed ? 1 : 0.6,
              cursor: completed ? "pointer" : "not-allowed",
            }}
            disabled={!completed && !isLastLevel}
          >
            {isLastLevel ? "Finish" : "Next"}
          </button>
        </div>
      </div>

      <div style={{ marginTop: 12, width: "100%", maxWidth: 920 }}>
        <div
          style={{
            ...styles.statusMessage,
            color:
              statusMessage.toLowerCase().includes("success") || statusMessage.toLowerCase().includes("completed")
                ? "green"
                : "#d9534f",
          }}
        >
          {statusMessage}
        </div>

        <div style={styles.xpRow}>
          <div style={{ fontWeight: 600 }}>Total XP: {totalXp}</div>
          <div style={{ fontSize: 13, color: "#666" }}>Reward for this level: {level.xpReward ?? 0} XP</div>
        </div>

        {isLastLevel && completed && (
          <div style={{ marginTop: 14, textAlign: "center" }}>
            <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>All levels completed — well done!</div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={restartAll} style={styles.primaryButton}>
                Replay Levels
              </button>
              <button onClick={() => {}} style={styles.visibleButton}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  gameContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    alignItems: "stretch",
    textAlign: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    boxShadow: "0 6px 18px rgba(15, 23, 42, 0.06)",
    fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    maxWidth: 920,
    margin: "0 auto",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  topRight: {
    display: "flex",
    gap: 12,
    alignItems: "flex-end",
  },
  bridgeBlueprint: {
    width: "100%",
    minHeight: 72,
    border: "2px dashed #42a5f5",
    margin: "8px auto",
    display: "flex",
    gap: 8,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f8fbff",
    flexWrap: "wrap",
  },
  fractionPieces: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 12,
  },
  piece: {
    minWidth: 60,
    height: 44,
    padding: "0 10px",
    backgroundColor: "#81c784",
    border: "1px solid #388e3c",
    borderRadius: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    color: "#052e14",
    fontWeight: 700,
    userSelect: "none",
  },
  primaryButton: {
    padding: "10px 18px",
    fontSize: 15,
    cursor: "pointer",
    borderRadius: 10,
    backgroundColor: "#0ea5a4",
    color: "white",
    border: "none",
    fontWeight: 700,
  },
  visibleButton: {
    padding: "10px 16px",
    fontSize: 15,
    cursor: "pointer",
    borderRadius: 10,
    backgroundColor: "#e6eef0",
    color: "#0f172a",
    border: "1px solid #cbd5e1",
    fontWeight: 600,
  },
  navButton: {
    padding: "8px 12px",
    fontSize: 14,
    cursor: "pointer",
    borderRadius: 8,
    backgroundColor: "#f8fafc",
    border: "1px solid #cbd5e1",
    color: "#0f172a",
  },
  statusMessage: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 700,
    minHeight: 22,
  },
  xpRow: {
    marginTop: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTop: "1px solid #f1f5f9",
  },
};
