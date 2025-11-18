"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useNoteDetail } from "@/hooks/useNotes";
import { classNames } from "@/lib/utils";

/**
 * PUBLIC_INTERFACE
 * NoteEditor
 * Provides an editor for a specific note id, including optimistic save,
 * delete, favorite toggle, and a11y-friendly form controls.
 */
export default function NoteEditor({ id }: { id: string }) {
  const {
    note,
    loading,
    error,
    updateOptimistic,
    deleteOptimistic,
    toggleFavoriteOptimistic,
  } = useNoteDetail(id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Sync local state when note changes
  useEffect(() => {
    if (note) {
      setTitle(note.title ?? "");
      setContent(note.content ?? "");
    }
  }, [note]);

  const canSave = useMemo(() => {
    if (!note) return false;
    return title !== note.title || content !== note.content;
  }, [note, title, content]);

  return (
    <main className="min-h-[60vh]">
      <nav className="mb-4">
        <Link
          href="/notes"
          className="inline-flex items-center text-sm font-medium text-blue-700 hover:text-blue-800 focus-visible:outline-none"
        >
          ← Back to notes
        </Link>
      </nav>

      <header className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Edit Note</h1>
          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!note}
            aria-pressed={note?.favorite ? "true" : "false"}
            aria-label={note?.favorite ? "Unfavorite note" : "Favorite note"}
            onClick={() => void toggleFavoriteOptimistic()}
            className={classNames(
              "inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm transition focus-visible:outline-none",
              note?.favorite
                ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
                : "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            )}
          >
            <svg
              className={classNames(
                "h-4 w-4",
                note?.favorite ? "fill-current" : "stroke-current"
              )}
              viewBox="0 0 24 24"
              fill={note?.favorite ? "currentColor" : "none"}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeWidth="1.5"
                d="M11.48 3.499a4.5 4.5 0 0 0-6.364 6.364L12 16.748l6.884-6.885a4.5 4.5 0 1 0-6.364-6.364l-.754.755-.754-.755Z"
              />
            </svg>
            {note?.favorite ? "Favorited" : "Favorite"}
          </button>
          <button
            type="button"
            disabled={!note}
            onClick={async () => {
              const ok = await deleteOptimistic();
              if (ok) {
                // navigate back after deletion
                window.location.assign("/notes");
              }
            }}
            className="rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-none disabled:opacity-60"
          >
            Delete
          </button>
          <button
            type="button"
            disabled={!canSave}
            onClick={() =>
              updateOptimistic({
                title,
                content,
              })
            }
            className={classNames(
              "rounded-md px-3 py-2 text-sm font-medium text-white shadow-sm focus-visible:outline-none disabled:opacity-50",
              canSave ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-400"
            )}
          >
            Save
          </button>
        </div>
      </header>

      <form
        className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
        onSubmit={(e) => {
          e.preventDefault();
          if (canSave) {
            void updateOptimistic({ title, content });
          }
        }}
      >
        <div className="mb-4">
          <label
            htmlFor="note-title"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            id="note-title"
            name="title"
            type="text"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading || !note}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:opacity-60"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="note-content"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Content
          </label>
          <textarea
            id="note-content"
            name="content"
            rows={10}
            placeholder="Write your note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading || !note}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:opacity-60"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={!canSave}
            className={classNames(
              "rounded-md px-3 py-2 text-sm font-medium text-white shadow-sm focus-visible:outline-none disabled:opacity-50",
              canSave ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-400"
            )}
          >
            Save changes
          </button>

          <button
            type="button"
            onClick={() => {
              setTitle(note?.title ?? "");
              setContent(note?.content ?? "");
            }}
            disabled={!note}
            className="rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-none disabled:opacity-60"
          >
            Reset
          </button>
        </div>
      </form>
    </main>
  );
}
