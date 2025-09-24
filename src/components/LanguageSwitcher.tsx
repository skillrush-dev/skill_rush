// src/components/LanguageSwitcher.tsx
import React, { useEffect, useRef, useState } from "react";
import i18n from "../i18n"; // relative import (adjust path if needed)

const LANGS = [
  { code: "en", label: "English" },
  { code: "od", label: "Odia" },
  { code: "ta", label: "Tamil" },
];

export default function LanguageSwitcher({ onChange }: { onChange?: (lang: string) => void }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(i18n.language || localStorage.getItem("skill_rush_lang") || "en");
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const lang = localStorage.getItem("skill_rush_lang") || current;
    if (lang && i18n.language !== lang) i18n.changeLanguage(lang);
    setCurrent(lang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function change(lang: string) {
    i18n.changeLanguage(lang);
    localStorage.setItem("skill_rush_lang", lang);
    setCurrent(lang);
    setOpen(false);
    onChange?.(lang);
  }

  return (
    <div ref={rootRef} className="relative inline-block text-left">
      <button
        onClick={() => setOpen((s) => !s)}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white border border-slate-200 text-slate-800 text-sm shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-300"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="font-medium">{LANGS.find((l) => l.code === current)?.label ?? "Language"}</span>
        <span className="text-slate-400">▾</span>
      </button>

      {open && (
        <ul className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-md shadow-lg z-50 overflow-hidden">
          {LANGS.map((l) => (
            <li key={l.code}>
              <button
                onClick={() => change(l.code)}
                className={
                  "w-full text-left px-4 py-2 text-sm hover:bg-teal-50 hover:text-teal-700 " +
                  (l.code === current ? "bg-teal-50 text-teal-800 font-semibold" : "text-slate-700")
                }
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
