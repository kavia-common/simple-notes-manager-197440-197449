import NoteEditorWrapper from "@/components/Notes/NoteEditorWrapper";

/**
 * PUBLIC_INTERFACE
 * NoteDetailsPage
 * Server component that renders a client NoteEditor via wrapper.
 */
export default function NoteDetailsPage() {
  // Avoid async component; at runtime, Next will provide resolved params.
  // We defensively read from window.location as a fallback in dev/export.
  let id = "";
  if (typeof window !== "undefined") {
    const parts = window.location.pathname.split("/").filter(Boolean);
    id = parts[parts.length - 1] || "";
  }

  return (
    <div className="mx-auto max-w-3xl">
      <NoteEditorWrapper id={id} />
    </div>
  );
}
