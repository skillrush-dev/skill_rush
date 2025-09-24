// src/components/TutorialOverlay.tsx
import React, { useEffect, useState } from "react";

type Step = { selector: string; message: string; placement?: "top" | "bottom" | "left" | "right" };

export default function TutorialOverlay({
  steps,
  onClose,
  autoplay = true,
  delay = 1600,
}: {
  steps: Step[];
  onClose?: () => void;
  autoplay?: boolean;
  delay?: number;
}) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!autoplay) return;
    const t = setInterval(() => {
      setIdx((i) => {
        if (i + 1 >= steps.length) {
          clearInterval(t);
          return i;
        }
        return i + 1;
      });
    }, delay);
    return () => clearInterval(t);
  }, [autoplay, delay, steps.length]);

  const step = steps[idx];
  if (!step) return null;

  // find element bounds
  const el = document.querySelector(step.selector) as HTMLElement | null;
  const rect = el?.getBoundingClientRect();

  const bubbleStyle: React.CSSProperties = rect
    ? {
        position: "fixed",
        left: rect.left + rect.width / 2,
        top: rect.top - 10,
        transform: "translate(-50%, -100%)",
        zIndex: 9999,
      }
    : { position: "fixed", left: "50%", top: "20%", transform: "translate(-50%,-50%)", zIndex: 9999 };

  // highlight style
  const highlightStyle: React.CSSProperties = rect
    ? {
        position: "fixed",
        left: rect.left - 6,
        top: rect.top - 6,
        width: rect.width + 12,
        height: rect.height + 12,
        borderRadius: 8,
        boxShadow: "0 0 0 9999px rgba(0,0,0,0.45), 0 6px 20px rgba(0,0,0,0.35)",
        zIndex: 9998,
        pointerEvents: "none",
      }
    : {};

  return (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 9990 }} onClick={onClose} />
      {rect && <div style={highlightStyle} aria-hidden />}
      <div style={bubbleStyle} className="max-w-xs">
        <div className="bg-white p-3 rounded-lg shadow-lg text-sm">
          <div className="font-semibold mb-1">Tutorial</div>
          <div className="mb-2">{step.message}</div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIdx((i) => Math.max(0, i - 1))}
              className="px-2 py-1 text-xs border rounded"
              disabled={idx === 0}
            >
              Prev
            </button>
            {idx + 1 < steps.length ? (
              <button onClick={() => setIdx((i) => Math.min(steps.length - 1, i + 1))} className="px-2 py-1 text-xs bg-blue-600 text-white rounded">
                Next
              </button>
            ) : (
              <button onClick={onClose} className="px-2 py-1 text-xs bg-green-600 text-white rounded">
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
