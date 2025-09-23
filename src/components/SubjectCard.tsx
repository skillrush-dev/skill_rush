// src/components/SubjectCard.tsx
import React from "react";

type Props = {
  key?: string;
  subjectKey: string;
  title: string;
  className?: string;
  teacher: string;
  cover?: string; // image src (optional)
  onNotes?: (subjectKey: string) => void;
  onVideos?: (subjectKey: string) => void;
  onOpen?: (subjectKey: string) => void;
};

export default function SubjectCard({
  subjectKey,
  title,
  className,
  teacher,
  cover,
  onNotes,
  onVideos,
  onOpen,
}: Props) {
  // fallback cover if none provided
  const fallback =
    cover ||
    `https://source.unsplash.com/collection/190727/600x800?sig=${encodeURIComponent(
      title
    )}`;

  return (
    <div
      className={`group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transform transition-transform duration-300 ease-out hover:-translate-y-3 hover:scale-105 ${className ?? ""
        }`}
      role="button"
      onClick={() => onOpen?.(subjectKey)}
      aria-label={`Open ${title}`}
    >
      {/* cover */}
      <div className="h-44 w-full overflow-hidden">
        <img
          src={fallback}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
      </div>

      {/* body */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-lg font-semibold text-slate-800">{title}</h4>
            <div className="text-xs text-slate-500 mt-1">Class 6</div>
          </div>

          {/* small pill teacher on desktop - shown at top right */}
          <div className="hidden sm:flex flex-col items-end text-right">
            <div className="text-xs text-slate-500">Teacher</div>
            <div className="text-sm font-medium text-slate-700">{teacher}</div>
          </div>
        </div>

        {/* hover overlay area that appears from bottom */}
        <div
          className="mt-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 ease-out"
          aria-hidden={!true}
        >
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNotes?.(subjectKey);
              }}
              className="px-3 py-1 rounded-lg bg-white border text-slate-700 text-sm hover:bg-slate-50"
            >
              Notes
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onVideos?.(subjectKey);
              }}
              className="px-3 py-1 rounded-lg bg-teal-600 text-white text-sm hover:bg-teal-700"
            >
              Videos
            </button>
          </div>

          <div className="sm:hidden text-xs text-slate-500">{teacher}</div>
        </div>
      </div>
    </div>
  );
}
