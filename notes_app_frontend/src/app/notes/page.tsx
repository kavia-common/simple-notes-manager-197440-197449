"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * NotesListPage
 * A placeholder page that will list notes. Currently displays stub content and links to a sample note detail page.
 */
export default function NotesListPage() {
  // Placeholder state to simulate future data loading
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 300); // quick fake load for UX
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="min-h-[70vh] p-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Your Notes</h1>
          <p className="text-gray-600">Browse and manage your notes.</p>
        </header>

        <section className="mb-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {isLoading ? "Loading notes..." : "Showing 0 notes"}
          </div>
          <Link
            href="#"
            onClick={(e) => e.preventDefault()}
            aria-disabled
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60"
          >
            + New Note
          </Link>
        </section>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Placeholder cards */}
          {[1, 2, 3].map((i) => (
            <Link
              key={i}
              href={`/notes/${i}`}
              className="group rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <h3 className="mb-1 line-clamp-1 text-base font-semibold text-gray-900 group-hover:text-blue-700">
                Sample Note {i}
              </h3>
              <p className="line-clamp-2 text-sm text-gray-600">
                This is a placeholder note. Clicking opens the note details page
                for a preview of the layout and navigation flow.
              </p>
              <div className="mt-3 text-xs text-blue-700">Open →</div>
            </Link>
          ))}
        </div>

        <div className="mt-8 rounded-md border border-blue-100 bg-gradient-to-br from-blue-50 to-gray-50 p-4 text-sm text-gray-700">
          This is a placeholder list. In a later step, this page will fetch and
          render actual notes from the API using environment variables:
          NEXT_PUBLIC_API_BASE / NEXT_PUBLIC_BACKEND_URL.
        </div>
      </div>
    </main>
  );
}
