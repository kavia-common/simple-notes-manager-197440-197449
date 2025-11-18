"use client";

import React from "react";
import NoteEditor from "./NoteEditor";

/**
 * PUBLIC_INTERFACE
 * NoteEditorWrapper
 * A tiny client component that renders NoteEditor with the provided id.
 */
export default function NoteEditorWrapper({ id }: { id: string }) {
  return <NoteEditor id={id} />;
}
