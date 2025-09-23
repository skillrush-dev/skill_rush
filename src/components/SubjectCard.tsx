// src/components/SubjectCard.tsx
import React from "react";

type Props = {
  subjectKey: string;
  title: string;
  className?: string;
  teacher: string;
  cover?: string; // image src (optional)
  showActions?: boolean; // if true show Notes/Videos buttons (for Learning view)
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
  showActions = false,
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

  const handleCardKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen?.(subjectKey);
    }
  };

  return (
    <div
      className={`group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transform transition-transform duration-300 ease-out hover:-translate-y-3 hover:scale-105 ${className ?? ""
        }`}
      role="button"
      tabIndex={0}
      onClick={() => onOpen?.(subjectKey)}
      onKeyDown={handleCardKeyDown}
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
        {/* Show actions only when explicitly requested (Start Learning view). */}
        {showActions ? (
          <div
            className="mt-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 ease-out"
            aria-hidden={!true}
          >
            <div className="flex gap-2">
              {onNotes && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNotes(subjectKey);
                  }}
                  className="px-3 py-1 rounded-lg bg-white border text-slate-700 text-sm hover:bg-slate-50"
                >
                  Notes
                </button>
              )}

              {onVideos && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onVideos(subjectKey);
                  }}
                  className="px-3 py-1 rounded-lg bg-teal-600 text-white text-sm hover:bg-teal-700"
                >
                  Videos
                </button>
              )}
            </div>

            <div className="sm:hidden text-xs text-slate-500">{teacher}</div>
          </div>
        ) : (
          // keep teacher visible on small screens even when actions hidden
          <div className="mt-3 block sm:hidden text-xs text-slate-500">{teacher}</div>
        )}
      </div>
    </div>
  );
}
