"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * Sidebar provides primary navigation for the notes app.
 * Includes links to All Notes, Favorites, and Trash and a New Note button.
 * Collapses behind a toggle on small screens.
 */
export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const NavItem = ({
    href,
    label,
    icon,
  }: {
    href: string;
    label: string;
    icon: React.ReactNode;
  }) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={[
          "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
          active
            ? "bg-blue-50 text-blue-700"
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
          "focus-visible:outline-none",
        ].join(" ")}
      >
        <span aria-hidden className="text-xl">{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile top bar for toggling sidebar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white/80 backdrop-blur">
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center w-10 h-10 rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none"
          style={{ boxShadow: "var(--shadow-sm)" }}
        >
          <span className="sr-only">Toggle navigation</span>
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            aria-hidden="true"
          >
            {open ? (
              <path strokeWidth="2" strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeWidth="2" strokeLinecap="round" d="M3 6h18M3 12h18M3 18h18" />
            )}
          </svg>
        </button>
        <Link href="/" className="font-semibold text-gray-900">Notes</Link>
        <div className="w-10" />
      </div>

      {/* Sidebar */}
      <aside
        className={[
          "fixed md:static inset-y-0 left-0 z-40 md:z-auto w-72 transform md:transform-none transition-transform",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          "bg-white border-r border-gray-200 md:h-auto h-full",
          "app-sidebar",
        ].join(" ")}
        style={{ boxShadow: "var(--shadow-sm)" }}
      >
        <div className="hidden md:flex items-center gap-2 px-4 h-16 border-b border-gray-200">
          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-blue-500/20 to-blue-600/30" />
          <span className="text-lg font-semibold text-gray-900">Notes</span>
        </div>

        <div className="p-4 flex flex-col gap-2">
          <NavItem href="/" label="All Notes" icon={<span>📝</span>} />
          <NavItem href="/favorites" label="Favorites" icon={<span>⭐</span>} />
          <NavItem href="/trash" label="Trash" icon={<span>🗑️</span>} />
        </div>

        <div className="p-4 mt-auto">
          <button
            type="button"
            className="w-full btn bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none"
            style={{ borderRadius: "var(--radius-md)" }}
            onClick={() => {
              // Placeholder for future "new note" action
              // e.g., router.push('/new'); or open modal
            }}
          >
            + New Note
          </button>
        </div>
      </aside>

      {/* Backdrop on mobile when sidebar is open */}
      {open && (
        <button
          aria-label="Close sidebar backdrop"
          onClick={() => setOpen(false)}
          className="md:hidden fixed inset-0 bg-black/20"
        />
      )}
    </>
  );
}
