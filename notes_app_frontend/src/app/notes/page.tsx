"use client";

import NoteList from "@/components/Notes/NoteList";

/**
 * PUBLIC_INTERFACE
 * NotesListPage
 * Lists notes using the NoteList component.
 */
export default function NotesListPage() {
  return (
    <div className="min-h-[60vh]">
      <NoteList />
    </div>
  );
}
