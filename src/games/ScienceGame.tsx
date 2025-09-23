// src/games/ScienceGame.tsx
import React, { useState } from "react";
import { getStudent, saveStudent, enqueueSync } from "../utils/db";
import './ScienceGame.css';

type Props = { studentId: string; onEnd: () => void };

type Question = {
  question: string;
  options: string[];
  answer: string;
};

const questions: Question[] = [
  { question: "Which part of the plant makes food?", options: ["Root", "Stem", "Leaf", "Flower"], answer: "Leaf" },
  { question: "Which animal is known as the ‘Ship of the Desert’?", options: ["Camel", "Elephant", "Horse", "Donkey"], answer: "Camel" },
  { question: "In which season do we wear woolen clothes?", options: ["Summer", "Winter", "Rainy", "Spring"], answer: "Winter" },
  { question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], answer: "Mars" },
  { question: "What do humans need to breathe?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Helium"], answer: "Oxygen" },
];

export default function ScienceGame({ studentId, onEnd }: Props) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const q = questions[index];

  async function finish() {
    const st = await getStudent(studentId);
    if (st) {
      st.points = (st.points || 0) + score;
      await saveStudent(st);

      await enqueueSync({
        type: "gameResult",
        studentId,
        game: "science",
        score,
        ts: Date.now(),
      });
    }
    onEnd();
  }

  function choose(opt: string) {
    setSelected(opt);
    if (opt === q.answer) setScore((s) => s + 1);

    setTimeout(() => {
      setSelected(null);
      if (index + 1 < questions.length) setIndex((i) => i + 1);
      else finish();
    }, 600);
  }

  return (
    <div className="scienceGameContainer">
      <div className="scienceGameCard">
        <h2 className="mb-3">🔬 Science Quiz</h2>
        <p className="text-muted mb-4">Answer the questions to test your knowledge!</p>

        <div className="scienceQuestion mb-4">
          <strong>Q{index + 1}.</strong> {q.question}
        </div>

        <div className="d-flex gap-2 flex-wrap">
          {q.options.map((opt) => (
            <button
              key={opt}
              className={`scienceOptionBtn btn ${
                selected === opt
                  ? opt === q.answer
                    ? "correct"
                    : "wrong"
                  : "btn-outline-primary"
              }`}
              onClick={() => choose(opt)}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="scienceScore mt-4">
          Score: <strong>{score}</strong> / {questions.length}
        </div>
      </div>

      <div className="text-center">
        <button className="scienceEndBtn btn btn-link mt-3" onClick={finish}>
          End game and return
        </button>
      </div>
    </div>
  );
}
