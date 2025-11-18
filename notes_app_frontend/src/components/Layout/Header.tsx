"use client";

import { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * Header renders the top application bar with title and a search input.
 * Search input is client-side only; no backend integration yet.
 */
export default function Header() {
  const [q, setQ] = useState("");

  return (
    <header className="w-full sticky top-0 z-30 bg-white/70 backdrop-blur border-b border-gray-200">
      <div className="mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="h-8 w-8 rounded-md shadow-sm"
            style={{
              backgroundImage:
                "linear-gradient(to bottom right, rgba(59,130,246,0.15), rgba(37,99,235,0.25))",
            }}
            aria-hidden
          />
          <h1 className="text-base md:text-lg font-semibold text-gray-900">
            Ocean Notes
          </h1>
        </div>

        <div className="flex-1 max-w-xl ml-4">
          <label htmlFor="app-search" className="sr-only">
            Search notes
          </label>
          <div className="relative">
            <input
              id="app-search"
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search notes..."
              className="w-full px-10 py-2 text-sm border border-gray-200 rounded-md bg-white placeholder:text-gray-400 text-gray-900 focus-visible:outline-none transition-shadow"
              style={{ boxShadow: q ? "var(--shadow-sm)" : "none" }}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden>
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="7" strokeWidth="2" />
                <path d="m20 20-3.5-3.5" strokeWidth="2" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
