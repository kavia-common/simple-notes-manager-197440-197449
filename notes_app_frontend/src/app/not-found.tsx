import React from "react";
import Link from "next/link";

/**
 * PUBLIC_INTERFACE
 * NotFound Page
 * Renders a themed 404 page using the Ocean Professional style with a link back to /notes.
 *
 * Accessibility:
 * - Uses semantic landmarks and aria-live for the alert section header.
 * - Clear headings and focusable links for navigation.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500/10 to-gray-50 flex items-center justify-center px-6">
      <main className="max-w-lg w-full">
        <section
          className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-10 border border-blue-100"
          role="alert"
          aria-live="assertive"
        >
          <header className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 border border-blue-100 shadow-sm">
              <span className="text-2xl font-semibold text-blue-600">404</span>
            </div>
            <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
              Page not found
            </h1>
            <p className="mt-3 text-base text-gray-600">
              The page you’re looking for doesn’t exist or has been moved. Try going back to your notes.
            </p>
            <nav className="mt-8 flex items-center justify-center gap-3" aria-label="Primary">
              <Link
                href="/notes"
                className="inline-flex items-center px-5 py-2.5 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Back to Notes
              </Link>
              <Link
                href="/"
                className="inline-flex items-center px-5 py-2.5 rounded-lg text-blue-700 bg-white border border-blue-200 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Home
              </Link>
            </nav>
          </header>
        </section>

        <p className="mt-6 text-center text-sm text-gray-500">
          Ocean Professional theme • Subtle gradient • Clean and modern aesthetic
        </p>
      </main>
    </div>
  );
}
