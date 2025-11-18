import React from "react";
import NoteEditorWrapper from "@/components/Notes/NoteEditorWrapper";
import { listNotes } from "@/lib/api/notes";

type PageProps = {
  params: {
    id: string;
  };
};

/**
 * PUBLIC_INTERFACE
 * generateStaticParams
 * Pre-generates static params for /notes/[id] to enable static export.
 * Uses the in-memory fallback or configured API (if available at build time).
 */
export async function generateStaticParams() {
  try {
    const notes = await listNotes({ page: 1, pageSize: 20 });
    return (notes || []).map((n) => ({ id: n.id }));
  } catch {
    // Fallback to a minimal set to satisfy export in absence of data.
    return [{ id: "1" }, { id: "2" }, { id: "3" }];
  }
}

/**
 * PUBLIC_INTERFACE
 * NoteDetailsPage
 * Server component that renders a client NoteEditor via wrapper for a specific note id.
 */
export default function NoteDetailsPage({ params }: PageProps) {
  return (
    <div className="mx-auto max-w-3xl">
      <NoteEditorWrapper id={params.id} />
    </div>
  );
}
