/**
 * React hooks for managing notes state:
 * - useNotesList: list notes with search, pagination, loading/error states, debounced queries, AbortController cancellation.
 * - useNoteDetail: fetch single note with loading/error.
 * - Optimistic updates for create/update/delete/toggleFavorite synced across list and detail.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  listNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  toggleFavorite,
} from "../lib/api/notes";
import type { Note, NoteInput, NotesQuery } from "../lib/types";

// Hook utility: debounce a value
function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

type UseNotesListOptions = {
  page?: number;
  pageSize?: number;
  favorite?: boolean;
};

type UseNotesListResult = {
  notes: Note[];
  loading: boolean;
  error: string | null;
  search: string;
  setSearch: (q: string) => void;
  page: number;
  setPage: (p: number) => void;
  pageSize: number;
  setPageSize: (ps: number) => void;
  refresh: () => Promise<void>;
  // optimistic actions
  createOptimistic: (input: NoteInput) => Promise<Note | null>;
  updateOptimistic: (id: string, input: NoteInput) => Promise<Note | null>;
  deleteOptimistic: (id: string) => Promise<boolean>;
  toggleFavoriteOptimistic: (id: string) => Promise<Note | null>;
};

/**
 * PUBLIC_INTERFACE
 * useNotesList manages the list of notes with search and pagination.
 */
export function useNotesList(
  options?: UseNotesListOptions
): UseNotesListResult {
  /** React hook that fetches and manages a list of notes */
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(options?.page || 1);
  const [pageSize, setPageSize] = useState(options?.pageSize || 20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebouncedValue(search, 350);
  const abortRef = useRef<AbortController | null>(null);

  const query: NotesQuery = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      favorite:
        typeof options?.favorite === "boolean" ? options.favorite : undefined,
      page,
      pageSize,
    }),
    [debouncedSearch, options?.favorite, page, pageSize]
  );

  const doFetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Cancel any in-flight request
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const data = await listNotes(query, ac.signal);
      setNotes(data);
    } catch (e: unknown) {
      const err = e as Error & { name?: string };
      if (err?.name !== "AbortError") {
        setError(err?.message || "Failed to load notes");
      }
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    // client side fetch only to be compatible with static export
    void doFetch();
    return () => {
      abortRef.current?.abort();
    };
  }, [doFetch]);

  const refresh = useCallback(async () => {
    await doFetch();
  }, [doFetch]);

  // Optimistic create
  const createOptimistic = useCallback(
    async (input: NoteInput) => {
      // Create a temporary note
      const tempId = `tmp_${Math.random().toString(36).slice(2, 8)}`;
      const temp: Note = {
        id: tempId,
        title: input.title || "",
        content: input.content || "",
        favorite: Boolean(input.favorite),
      };
      setNotes((prev) => [temp, ...prev]);

      try {
        const created = await createNote(input);
        // Replace temp with created
        setNotes((prev) =>
          prev.map((n) => (n.id === tempId ? created : n))
        );
        return created;
      } catch (e: unknown) {
        // Revert optimistic insert
        setNotes((prev) => prev.filter((n) => n.id !== tempId));
        const err = e as Error;
        setError(err?.message || "Failed to create note");
        return null;
      }
    },
    []
  );

  // Optimistic update
  const updateOptimistic = useCallback(
    async (id: string, input: NoteInput) => {
      let previous: Note | undefined;
      setNotes((prev) =>
        prev.map((n) => {
          if (n.id === id) {
            previous = n;
            return {
              ...n,
              title: input.title ?? n.title,
              content: input.content ?? n.content,
              favorite:
                typeof input.favorite === "boolean" ? input.favorite : n.favorite,
            };
          }
          return n;
        })
      );

      try {
        const updated = await updateNote(id, input);
        setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
        return updated;
      } catch (e: unknown) {
        // Revert on error
        if (previous) {
          setNotes((prev) => prev.map((n) => (n.id === id ? (previous as Note) : n)));
        }
        const err = e as Error;
        setError(err?.message || "Failed to update note");
        return null;
      }
    },
    []
  );

  // Optimistic delete
  const deleteOptimistic = useCallback(async (id: string) => {
    let snapshot: Note[] = [];
    setNotes((prev) => {
      snapshot = prev;
      return prev.filter((n) => n.id !== id);
    });

    try {
      await deleteNote(id);
      return true;
    } catch (e: unknown) {
      // Revert on error
      setNotes(snapshot);
      const err = e as Error;
      setError(err?.message || "Failed to delete note");
      return false;
    }
  }, []);

  // Optimistic toggle favorite
  const toggleFavoriteOptimistic = useCallback(async (id: string) => {
    let previous: Note | undefined;
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          previous = n;
          return { ...n, favorite: !n.favorite };
        }
        return n;
      })
    );

    try {
      const updated = await toggleFavorite(id);
      setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
      return updated;
    } catch (e: unknown) {
      // Revert on error
      if (previous) {
        setNotes((prev) => prev.map((n) => (n.id === id ? (previous as Note) : n)));
      }
      const err = e as Error;
      setError(err?.message || "Failed to update favorite");
      return null;
    }
  }, []);

  return {
    notes,
    loading,
    error,
    search,
    setSearch,
    page,
    setPage,
    pageSize,
    setPageSize,
    refresh,
    createOptimistic,
    updateOptimistic,
    deleteOptimistic,
    toggleFavoriteOptimistic,
  };
}

type UseNoteDetailResult = {
  note: Note | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  // optimistic actions kept consistent with list
  updateOptimistic: (input: NoteInput) => Promise<Note | null>;
  deleteOptimistic: () => Promise<boolean>;
  toggleFavoriteOptimistic: () => Promise<Note | null>;
};

/**
 * PUBLIC_INTERFACE
 * useNoteDetail fetches and manages a single note by id.
 */
export function useNoteDetail(id: string | undefined): UseNoteDetailResult {
  /** React hook that fetches and manages a single note entity */
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchNote = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    if (abortRef.current) abortRef.current.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const data = await getNote(id, ac.signal);
      setNote(data);
    } catch (e: unknown) {
      const err = e as Error & { name?: string };
      if (err?.name !== "AbortError") {
        setError(err?.message || "Failed to load note");
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // client side fetch only to be compatible with static export
    void fetchNote();
    return () => {
      abortRef.current?.abort();
    };
  }, [fetchNote]);

  const refresh = useCallback(async () => {
    await fetchNote();
  }, [fetchNote]);

  const updateOptimistic = useCallback(
    async (input: NoteInput) => {
      if (!note) return null;
      const prev = note;
      setNote({
        ...note,
        title: input.title ?? note.title,
        content: input.content ?? note.content,
        favorite:
          typeof input.favorite === "boolean" ? input.favorite : note.favorite,
      });

      try {
        const updated = await updateNote(note.id, input);
        setNote(updated);
        return updated;
      } catch (e: unknown) {
        setNote(prev);
        const err = e as Error;
        setError(err?.message || "Failed to update note");
        return null;
      }
    },
    [note]
  );

  const deleteOptimistic = useCallback(async () => {
    if (!note) return false;
    const current = note;
    setNote(null);
    try {
      await deleteNote(current.id);
      return true;
    } catch (e: unknown) {
      setNote(current);
      const err = e as Error;
      setError(err?.message || "Failed to delete note");
      return false;
    }
  }, [note]);

  const toggleFavoriteOptimistic = useCallback(async () => {
    if (!note) return null;
    const prev = note;
    setNote({ ...note, favorite: !note.favorite });
    try {
      const updated = await toggleFavorite(note.id);
      setNote(updated);
      return updated;
    } catch (e: unknown) {
      setNote(prev);
      const err = e as Error;
      setError(err?.message || "Failed to update favorite");
      return null;
    }
  }, [note]);

  return {
    note,
    loading,
    error,
    refresh,
    updateOptimistic,
    deleteOptimistic,
    toggleFavoriteOptimistic,
  };
}
