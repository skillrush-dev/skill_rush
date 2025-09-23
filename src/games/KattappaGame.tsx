// src/games/KattappaGame.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { getStudent, saveStudent, enqueueSync } from '../utils/db';

type Props = { studentId: string, onEnd: ()=>void };

type Q = { a:number; b:number; op:'+'|'-'; answer:number; options:number[] };

function makeQuestion(): Q {
  const op: ('+'|'-') = Math.random() < 0.6 ? '+' : '-';
  const a = Math.floor(Math.random()*5) + 1; // 1..5
  const b = Math.floor(Math.random()*5) + 1;
  const answer = op === '+' ? a + b : a - b;
  // build options
  const opts = new Set<number>();
  opts.add(answer);
  while (opts.size < 3) {
    const delta = Math.floor(Math.random()*5) - 2;
    opts.add(Math.max(answer + delta, 0));
  }
  const options = Array.from(opts).sort(()=>Math.random()-0.5);
  return { a, b, op, answer, options };
}

export default function KattappaGame({ studentId, onEnd }: Props) {
  const [questions] = useState<Q[]>(() => Array.from({length:5}, () => makeQuestion()));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const q = questions[index];

  async function finish() {
    // save score to student's record (increment points)
    const st = await getStudent(studentId);
    if (st) {
      st.points = (st.points || 0) + score;
      await saveStudent(st);
      // queue sync event
      await enqueueSync({ type:'gameResult', studentId, game:'kattappa', score, ts: Date.now() });
    }
    onEnd();
  }

  function choose(opt:number) {
    setSelected(opt);
    if (opt === q.answer) setScore(s => s + 1);
    setTimeout(() => {
      setSelected(null);
      if (index + 1 < questions.length) setIndex(i => i + 1);
      else finish();
    }, 600);
  }

  return (
    <div style={{maxWidth:640, margin:'0 auto'}}>
      <div className="card p-3 mb-3">
        <h5>Kattappa vs Bahubali — Math Challenge</h5>
        <p className="text-muted">Help Kattappa stop Bahubali by answering simple questions!</p>
        <div className="mb-3">
          <div style={{fontSize:28}}><strong>Q{index+1}.</strong> {q.a} {q.op} {q.b} = ?</div>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          {q.options.map(opt => (
            <button key={opt}
              className={`btn ${selected===opt ? (opt===q.answer ? 'btn-success' : 'btn-danger') : 'btn-outline-primary'}`}
              onClick={() => choose(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
        <div className="mt-3">
          <small>Score: <strong>{score}</strong> / {questions.length}</small>
        </div>
      </div>
      <div className="text-center">
        <button className="btn btn-link" onClick={finish}>End game and return</button>
      </div>
    </div>
  );
}
