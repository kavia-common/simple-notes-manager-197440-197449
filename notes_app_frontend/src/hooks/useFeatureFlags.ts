"use client";

import { useMemo } from "react";

// Ambient declarations must be at top level
declare global {
  // eslint-disable-next-line no-var
  var __NEXT_PUBLIC_FEATURE_FLAGS__: unknown | undefined;
  // eslint-disable-next-line no-var
  // Augment window for environments that provide it
  interface Window {}
}

/**
 * Internal: Safely parse a string as JSON, returning undefined on failure.
 */
function safeJsonParse<T = unknown>(value: string | undefined): T | undefined {
  if (!value) return undefined;
  try {
    return JSON.parse(value) as T;
  } catch {
    return undefined;
  }
}

/**
 * Internal: Parse CSV string "a,b,c" into { a: true, b: true, c: true }
 */
function parseCsvFlags(csv: string | undefined): Record<string, boolean> {
  if (!csv) return {};
  return csv
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .reduce<Record<string, boolean>>((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
}

/**
 * Internal: Normalize parsed JSON into a { [key]: boolean } map.
 * Accepts:
 * - object: { favorites: true, beta: "1", disabled: 0 }
 * - array: ["favorites","beta"]
 * - string/number: coerced to boolean and mapped under "default"
 */
function normalizeJsonFlags(input: unknown): Record<string, boolean> {
  if (!input) return {};
  const out: Record<string, boolean> = {};

  if (Array.isArray(input)) {
    for (const item of input) {
      if (typeof item === "string" && item.trim()) {
        out[item.trim()] = true;
      }
    }
    return out;
  }

  if (typeof input === "object") {
    for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
      const key = k.trim();
      if (!key) continue;
      out[key] = coerceToBoolean(v);
    }
    return out;
  }

  // Fallback: single primitive -> default
  out.default = coerceToBoolean(input);
  return out;
}

/**
 * Internal: Coerce various values to boolean.
 * Truthy strings like "1","true","on","yes","enabled" become true.
 * Numbers != 0 become true.
 */
function coerceToBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const val = value.trim().toLowerCase();
    return ["1", "true", "on", "yes", "y", "enabled", "enable"].includes(val);
  }
  return Boolean(value);
}

/**
 * PUBLIC_INTERFACE
 * useFeatureFlags
 * A React hook to read feature flags from NEXT_PUBLIC_FEATURE_FLAGS.
 *
 * Supports:
 * - JSON: {"favorites": true, "beta": "1"} or ["favorites","beta"]
 * - CSV: "favorites,beta"
 *
 * Returns a memoized object with:
 * - flags: Record<string, boolean>
 * - isEnabled: (flagName: string) => boolean
 */
export function useFeatureFlags() {
  /** This is a public function. */

  const raw =
    typeof window !== "undefined"
      ? (process.env.NEXT_PUBLIC_FEATURE_FLAGS ??
          (typeof globalThis !== "undefined" &&
          typeof (globalThis as { __NEXT_PUBLIC_FEATURE_FLAGS__?: unknown })
            .__NEXT_PUBLIC_FEATURE_FLAGS__ === "string"
            ? ((globalThis as {
                __NEXT_PUBLIC_FEATURE_FLAGS__?: unknown;
              }).__NEXT_PUBLIC_FEATURE_FLAGS__ as string)
            : undefined))
      : process.env.NEXT_PUBLIC_FEATURE_FLAGS;

  const flags = useMemo<Record<string, boolean>>(() => {
    // Try JSON first
    const json = safeJsonParse<unknown>(raw);
    if (json !== undefined) {
      return normalizeJsonFlags(json);
    }
    // Fallback to CSV
    return parseCsvFlags(raw);
  }, [raw]);

  // PUBLIC_INTERFACE
  const isEnabled = (name: string): boolean => {
    /** Returns true when the named flag evaluates to enabled. */
    if (!name) return false;
    return Boolean(flags[name]);
  };

  return { flags, isEnabled };
}

export default useFeatureFlags;
