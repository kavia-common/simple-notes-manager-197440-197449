"use client";

import React, { useEffect, useRef } from "react";
import NoteCard from "./NoteCard";
import { useNotesList } from "@/hooks/useNotes";
import { debounce } from "@/lib/utils";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";

/**
 * PUBLIC_INTERFACE
 * NoteList
 * Displays a searchable, paginated list of notes with create/delete/favorite actions.
 */
export default function NoteList() {
  const {
    notes,
    loading,
    error,
    search,
    setSearch,
    refresh,
    createOptimistic,
    deleteOptimistic,
    toggleFavoriteOptimistic,
  } = useNotesList();

  // Debounce typing for smooth UX when using in-memory/filter
  const debouncedSet = useRef(
    debounce((v: string) => setSearch(v), 300)
  ).current;

  useEffect(() => {
    return () => debouncedSet.cancel();
  }, [debouncedSet]);

  return (
    <section aria-labelledby="notes-heading" className="w-full">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2
            id="notes-heading"
            className="text-2xl font-semibold text-gray-900"
          >
            Your Notes
          </h2>
          <p className="text-gray-600">Browse and manage your notes.</p>
        </div>

        <div className="flex items-center gap-2">
          <Input
            id="notes-search"
            type="search"
            placeholder="Search notes..."
            defaultValue={search}
            onChange={(e) => debouncedSet(e.target.value)}
            size="md"
            aria-label="Search notes"
            className="w-56 sm:w-64 md:w-72"
            leftAdornment={
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" strokeWidth="2" />
                <path d="m20 20-3.5-3.5" strokeWidth="2" />
              </svg>
            }
          />

          <Button
            type="button"
            onClick={() =>
              createOptimistic({
                title: "New note",
                content: "Start typing...",
                favorite: false,
              })
            }
            variant="primary"
            size="md"
          >
            + New Note
          </Button>
        </div>
      </header>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {loading && (
        <p className="mb-4 text-sm text-gray-500" aria-live="polite">
          Loading notes…
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {notes.map((n) => (
          <NoteCard
            key={n.id}
            note={n}
            onToggleFavorite={(id) => void toggleFavoriteOptimistic(id)}
            onDelete={(id) => void deleteOptimistic(id)}
          />
        ))}
      </div>

      {!loading && notes.length === 0 && (
        <div className="mt-6 rounded-md border border-blue-100 bg-gradient-to-br from-blue-50 to-gray-50 p-4 text-sm text-gray-700">
          No notes found. Try creating a new one or clearing your search.
          <div className="mt-3">
            <Button
              type="button"
              onClick={() => refresh()}
              variant="ghost"
              size="sm"
              className="bg-white text-blue-700 ring-1 ring-inset ring-blue-200 hover:bg-blue-50"
            >
              Refresh
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
