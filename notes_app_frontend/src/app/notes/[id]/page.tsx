import Link from "next/link";
// Import the generated PageProps type for this route to match Next's expectations
import type { PageProps } from "../../../../.next/types/app/notes/[id]/page";

/**
 * PUBLIC_INTERFACE
 * generateStaticParams
 * Provides a minimal set of placeholder IDs so that static export can succeed.
 */
export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}

/**
 * PUBLIC_INTERFACE
 * NoteDetailsPage
 * Placeholder page showing details for a specific note id.
 * Displays the note id from the route and provides basic layout for future editing.
 */
export default async function NoteDetailsPage(props: PageProps) {
  const params = props.params;
  const resolvedParams = params instanceof Promise ? await params : params;
  const id = (resolvedParams as { id: string } | undefined)?.id;

  return (
    <main className="min-h-[70vh] p-6">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-4">
          <Link
            href="/notes"
            className="inline-flex items-center text-sm font-medium text-blue-700 hover:text-blue-800"
          >
            ← Back to notes
          </Link>
        </nav>

        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Note Details
          </h1>
          <p className="text-gray-600">Viewing note with id: {id}</p>
        </header>

        <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              disabled
              value={`Sample Note ${id}`}
              className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-800 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:opacity-70"
            />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              disabled
              rows={8}
              value={`This is a placeholder for the note content of note ${id}. In a future iteration, this will be editable and persisted to the backend service.`}
              className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-800 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:opacity-70"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              disabled
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60"
            >
              Save
            </button>
            <button
              disabled
              className="rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none disabled:opacity-60"
            >
              Delete
            </button>
          </div>
        </article>

        <div className="mt-8 rounded-md border border-blue-100 bg-gradient-to-br from-blue-50 to-gray-50 p-4 text-sm text-gray-700">
          This is a placeholder detail view. In a later step, this page will
          fetch the specific note by id and allow editing/saving to the API
          configured via environment variables.
        </div>
      </div>
    </main>
  );
}
