import Link from "next/link";

/**
 * PUBLIC_INTERFACE
 * Home
 * Minimal landing that routes users to the Notes area.
 */
export default function Home() {
  return (
    <main className="min-h-[70vh] p-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-2xl font-semibold text-gray-900">
          Simple Notes Manager
        </h1>
        <p className="mb-6 text-gray-600">
          Welcome! Head over to your notes to get started.
        </p>
        <Link
          href="/notes"
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Go to Notes →
        </Link>
      </div>
    </main>
  );
}
