"use client";

import Link from "next/link";
import React from "react";
import { classNames, formatRelativeTime } from "@/lib/utils";
import type { Note } from "@/lib/types";

/**
 * PUBLIC_INTERFACE
 * NoteCard
 * Renders an accessible, focusable card for a note with actions for favorite and delete.
 */
export default function NoteCard({
  note,
  onToggleFavorite,
  onDelete,
}: {
  note: Note;
  onToggleFavorite?: (id: string) => void;
  onDelete?: (id: string) => void;
}) {
  const handleFav = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite?.(note.id);
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.(note.id);
  };

  return (
    <article
      className="group rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md focus-within:shadow-md"
      style={{ outline: "none" }}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="mb-1 line-clamp-1 text-base font-semibold text-gray-900 group-hover:text-blue-700">
          <Link
            href={`/notes/${note.id}`}
            className="focus-visible:outline-none"
          >
            <span className="absolute inset-0" aria-hidden />
            {note.title || "Untitled"}
          </Link>
        </h3>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-pressed={note.favorite ? "true" : "false"}
            aria-label={note.favorite ? "Unfavorite note" : "Favorite note"}
            title={note.favorite ? "Unfavorite" : "Favorite"}
            onClick={handleFav}
            className={classNames(
              "inline-flex h-8 w-8 items-center justify-center rounded-md transition focus-visible:outline-none",
              note.favorite
                ? "text-amber-500 hover:bg-amber-50"
                : "text-gray-500 hover:bg-gray-100"
            )}
          >
            <svg
              className={classNames(
                "h-5 w-5",
                note.favorite ? "fill-current" : "stroke-current"
              )}
              viewBox="0 0 24 24"
              fill={note.favorite ? "currentColor" : "none"}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeWidth="1.5"
                d="M11.48 3.499a4.5 4.5 0 0 0-6.364 6.364L12 16.748l6.884-6.885a4.5 4.5 0 1 0-6.364-6.364l-.754.755-.754-.755Z"
              />
            </svg>
          </button>

          <button
            type="button"
            aria-label="Delete note"
            title="Delete"
            onClick={handleDelete}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-red-600 transition focus-visible:outline-none"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeWidth="1.5"
                d="M6 7h12M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m1 0v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7h12Z"
              />
              <path strokeWidth="1.5" d="M10 11v6M14 11v6" />
            </svg>
          </button>
        </div>
      </div>

      <p className="line-clamp-3 text-sm text-gray-600">{note.content}</p>

      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <span>Updated {formatRelativeTime(note.updatedAt ?? Date.now())}</span>
        <Link
          href={`/notes/${note.id}`}
          className="text-blue-700 hover:text-blue-800 focus-visible:outline-none"
        >
          Open →
        </Link>
      </div>
    </article>
  );
}
