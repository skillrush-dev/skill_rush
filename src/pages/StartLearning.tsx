// src/pages/StartLearning.tsx
import React from "react";
import { useTranslation } from "react-i18next";

type Note = {
  id: string;
  title: Record<string, string> | string;
  files: Record<string, string>; // files per language code
  teacher?: string;
  summary?: Record<string, string> | string;
};

type Props = {
  subjectKey: string;
  language?: string; // e.g. "en", "od", "ta"
  onClose?: () => void;
};

// notes mapping uses files per-language
const NOTES_BY_SUBJECT: Record<string, Note[]> = {
  maths: [
    {
      id: "m1",
      title: { en: "Chapter 1 — Numbers", od: "ଅଧ୍ୟାୟ 1 — ସଂଖ୍ୟା", ta: "பகுதி 1 — எண்கள்" },
      files: { en: "/notes/maths/en/chapter1.pdf", od: "/notes/maths/od/chapter1.pdf", ta: "/notes/maths/ta/chapter1.pdf" },
      teacher: "Ms. N. Das",
      summary: { en: "Basic number concepts and place value.", od: "ମୂଳ ଧାରଣା ଓ ସ୍ଥାନମୂଲ୍ୟ", ta: "அடிப்படை எண் கொள்கைகள் மற்றும் இட மதிப்பு" },
    },
    {
      id: "m2",
      title: { en: "Chapter 2 — Fractions", od: "ଅଧ୍ୟାୟ 2 — ଭାଗ", ta: "பகுதி 2 — பாகங்கள்" },
      files: { en: "/notes/maths/en/chapter2.pdf", od: "/notes/maths/od/chapter2.pdf", ta: "/notes/maths/ta/chapter2.pdf" },
      teacher: "Mr. S. Rao",
      summary: { en: "Introduction to fractions and operations.", od: "ଭାଗର ପରିଚୟ", ta: "பகுதிகளின் அறிமுகம்" },
    },
    {
      id: "m3",
      title: { en: "Chapter 3 — Geometry", od: "ଅଧ୍ୟାୟ 3 — ଭୂମିତି", ta: "பகுதி 3 — ஜியோமெட்ரி" },
      files: { en: "/notes/maths/en/chapter3.pdf", od: "/notes/maths/od/chapter3.pdf", ta: "/notes/maths/ta/chapter3.pdf" },
      teacher: "Ms. P. Mishra",
      summary: { en: "Shapes, angles and simple constructions.", od: "ଆକୃତି, କୋଣ ଓ ଗଠନ", ta: "ஆக்டுகள், கோணம் மற்றும் கட்டமைப்புகள்" },
    },
  ],
};

function chooseFile(note: Note, language?: string) {
  // try language first, then fallback to en, then first available
  if (language && note.files[language]) return note.files[language];
  if (note.files["en"]) return note.files["en"];
  return Object.values(note.files)[0];
}

export default function StartLearning({ subjectKey, language, onClose }: Props) {
  const { t } = useTranslation();
  const notes = NOTES_BY_SUBJECT[subjectKey] ?? [];

  const openNote = (fileUrl: string) => {
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  const downloadNote = async (fileUrl: string) => {
    try {
      const res = await fetch(fileUrl);
      if (!res.ok) throw new Error("File not found");
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileUrl.split("/").pop() || "note.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
    } catch (err) {
      alert(t("Could not download file. Please check availability."));
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-emerald-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {t("startLearning")} — {subjectKey.charAt(0).toUpperCase() + subjectKey.slice(1)}
            </h1>
            <p className="text-sm text-slate-500 mt-1">{t("openFirstChapter")}</p>
          </div>

          <div className="flex items-center gap-3">
            {onClose && (
              <button onClick={onClose} className="px-4 py-2 rounded-md bg-white border shadow-sm text-slate-700 hover:bg-slate-50">
                {t("back")}
              </button>
            )}
            {notes.length > 0 && (
              <button onClick={() => openNote(chooseFile(notes[0], language))} className="px-4 py-2 rounded-md bg-emerald-600 text-white font-semibold shadow hover:brightness-95">
                {t("openFirstChapter")}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((n) => (
            <article key={n.id} className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition-shadow border">
              <div className="h-40 w-full rounded-md overflow-hidden mb-4 bg-gradient-to-br from-emerald-50 to-sky-50 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl text-emerald-600 font-bold">📄</div>
                  <div className="text-xs mt-2 text-slate-500">{chooseFile(n, language).split("/").pop()}</div>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-slate-900 mb-1">{typeof n.title === "string" ? n.title : (n.title[language || "en"] || n.title["en"])}</h3>
              <div className="text-sm text-slate-500 mb-3">{typeof n.summary === "string" ? n.summary : (n.summary[language || "en"] || n.summary["en"])}</div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-500">Teacher</div>
                <div className="text-sm font-medium text-slate-700">{n.teacher}</div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button onClick={() => openNote(chooseFile(n, language))} className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600 text-white font-semibold hover:brightness-95">
                  {t("openPdf")}
                </button>

                <button onClick={() => downloadNote(chooseFile(n, language))} className="px-3 py-2 rounded-full bg-white border text-slate-700 hover:bg-slate-50">
                  {t("download")}
                </button>
              </div>
            </article>
          ))}

          {notes.length === 0 && (
            <div className="col-span-full bg-white rounded-2xl p-8 text-center shadow-sm border">
              <p className="text-slate-600">{t("No notes found for this subject yet.")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
