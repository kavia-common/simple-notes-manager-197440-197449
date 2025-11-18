# Notes App Frontend (Next.js)

## Project Overview
This is a modern Next.js frontend for a simple notes application, styled with the Ocean Professional theme (blue primary, amber accents, clean surfaces, and minimal shadows). The app allows users to create, edit, favorite, delete, and browse notes with search and pagination. It supports static export via Next.js output: 'export', and performs client-side data fetching to remain compatible with static hosting. When no backend API is configured, the app automatically falls back to an in-memory notes store so you can try the UI without any server.

Key parts:
- Static export enabled in next.config.ts with output: 'export'.
- Client-side hooks for notes: src/hooks/useNotes.ts.
- API layer with in-memory fallback: src/lib/api/notes.ts and a fetch wrapper in src/lib/api/client.ts.
- Configuration via NEXT_PUBLIC_* env vars: src/lib/config.ts.
- Feature flags hook: src/hooks/useFeatureFlags.ts.
- Healthcheck route for dev/monitoring: src/app/api/healthcheck/route.ts.

## How to Run

### Prerequisites
- Node.js 18+ and npm (or yarn/pnpm/bun).
- A terminal that can run scripts.

### Development
- Create a .env.local file (see Environment Variables and Quick Start below).
- Start the dev server:
  - npm run dev
- Open http://localhost:3000

During development the app:
- Uses client-side fetching to load notes.
- Falls back to in-memory notes if NEXT_PUBLIC_API_BASE is not set or empty.
- Exposes a simple healthcheck at /api/healthcheck (local dev only, see healthcheck section).

### Build and Static Export
This project is configured for static export:
- Build: npm run build
- Export output is generated in out/ (already configured via next.config.ts with output: 'export').
- Preview/export locally:
  - npm run start is not used for static export; serve the out/ folder with any static server (e.g., npx serve out)

Important: Because output: 'export' is enabled, server-only features and dynamic routes that require server rendering are not supported at runtime. All data fetching is client-side. See Static Export Constraints below.

## Environment Variables
All variables are read via NEXT_PUBLIC_* keys in src/lib/config.ts. Only variables prefixed with NEXT_PUBLIC_ are exposed on the client.

- NEXT_PUBLIC_API_BASE
  - Absolute base URL for the backend API (e.g., https://api.example.com). If omitted or empty, the app uses an in-memory notes fallback. When set, CRUD calls use:
    - GET {API_BASE}/notes?search=&favorite=&page=&pageSize=
    - GET {API_BASE}/notes/{id}
    - POST {API_BASE}/notes
    - PUT {API_BASE}/notes/{id}
    - DELETE {API_BASE}/notes/{id}
    - PATCH {API_BASE}/notes/{id}/favorite
- NEXT_PUBLIC_BACKEND_URL
  - Alternative legacy key; if NEXT_PUBLIC_API_BASE is empty, config will try this before falling back. Prefer setting NEXT_PUBLIC_API_BASE.
- NEXT_PUBLIC_FRONTEND_URL
  - Optional base URL for the frontend (e.g., https://app.example.com). Useful for external links and redirects.
- NEXT_PUBLIC_WS_URL
  - Optional WebSocket base URL if needed for real-time features (not required for the core app).
- NEXT_PUBLIC_NODE_ENV
  - Effective environment value for the client (development, production, or test). Affects defaults like logging verbosity and source maps.
- NEXT_PUBLIC_NEXT_TELEMETRY_DISABLED
  - "true" or "false". Defaults to true in development. Controls whether Next telemetry is disabled (client-facing toggle in config only).
- NEXT_PUBLIC_ENABLE_SOURCE_MAPS
  - "true" or "false". Defaults: true in development, false in production. Controls enabling source maps in client config context.
- NEXT_PUBLIC_PORT
  - Port for local development (stringified number). Defaults to 3000 in client config context. Note: actual dev port is controlled by Next; this value is used as a config hint only.
- NEXT_PUBLIC_TRUST_PROXY
  - "true" or "false". Defaults to false. Client-visible hint; not used by static export runtime but preserved for consistency if you later run behind a proxy.
- NEXT_PUBLIC_LOG_LEVEL
  - One of: silent, error, warn, info, debug, trace. Defaults to debug in development, warn in production. Controls client-side logging level for the API client wrapper.
- NEXT_PUBLIC_HEALTHCHECK_PATH
  - Healthcheck path used by ping helpers. Defaults to /api/health. The app provides GET /api/healthcheck for development; you can adjust clients/tools to use either path.
- NEXT_PUBLIC_FEATURE_FLAGS
  - Feature flags passed as JSON or CSV (see Feature Flags section). Parsed on the client to enable/disable features.
- NEXT_PUBLIC_EXPERIMENTS_ENABLED
  - "true" or "false". Controls coarse-grained opt-in to experimental code paths if present.

The centralized configuration is defined in:
- src/lib/config.ts, exposing:
  - appConfig with env, apiBase, frontendBase, wsBase, port, trustProxy, logLevel, telemetryDisabled, enableSourceMaps, healthcheckPath, featureFlags, experimentsEnabled.
  - getApiBase(), getFrontendBase(), getWsBase(), isFeatureEnabled(), getLogLevel() helpers.

## Feature Flags

The app parses feature flags on the client via useFeatureFlags() in src/hooks/useFeatureFlags.ts. This hook supports:
- JSON flags
- CSV flags

It normalizes inputs to a { [flagName]: boolean } map and provides an isEnabled(name) helper.

### JSON example
Set NEXT_PUBLIC_FEATURE_FLAGS to a JSON string:
- NEXT_PUBLIC_FEATURE_FLAGS={"favorites": true, "betaEditor": "1", "labs": 0}
This becomes:
- favorites: true
- betaEditor: true (truthy string "1")
- labs: false (0 coerces to false)

Also supports arrays:
- NEXT_PUBLIC_FEATURE_FLAGS=["favorites","betaEditor"]
This becomes:
- favorites: true
- betaEditor: true

### CSV example
Set NEXT_PUBLIC_FEATURE_FLAGS to a comma-separated list:
- NEXT_PUBLIC_FEATURE_FLAGS=favorites,betaEditor,shareLinks
This becomes:
- favorites: true
- betaEditor: true
- shareLinks: true

Usage example in a component:
```tsx
"use client";
import useFeatureFlags from "@/src/hooks/useFeatureFlags";

export default function Example() {
  const { flags, isEnabled } = useFeatureFlags();
  return (
    <div>
      {isEnabled("betaEditor") ? "Beta editor enabled" : "Standard editor"}
    </div>
  );
}
```

## Static Export Constraints
The project is configured for static export via:
- next.config.ts: output: "export"

Implications:
- No server-rendered dynamic data at runtime. All data fetching is performed on the client (hooks useNotes.ts and API modules use fetch).
- Pages that need data fetch do it after hydration. The UI shows loading states and retries as needed.
- Healthcheck route exists under src/app/api/healthcheck/route.ts for dev/monitoring, but static hosts generally do not execute serverless routes when exported. Use it during development or with an environment that supports Next API routes (or enable a real backend endpoint for health checks when deploying statically).

## API Expectations (Notes CRUD)
When NEXT_PUBLIC_API_BASE is set, the app expects the following REST endpoints:

- List notes
  - GET {API_BASE}/notes?search=&favorite=&page=&pageSize=
  - Response: Note[] (array)
- Get note
  - GET {API_BASE}/notes/{id}
  - Response: Note
- Create note
  - POST {API_BASE}/notes
  - Body: { title?: string; content?: string; favorite?: boolean }
  - Response: Note
- Update note
  - PUT {API_BASE}/notes/{id}
  - Body: { title?: string; content?: string; favorite?: boolean }
  - Response: Note
- Delete note
  - DELETE {API_BASE}/notes/{id}
  - Response: { id: string }
- Toggle favorite
  - PATCH {API_BASE}/notes/{id}/favorite
  - Response: Note

Note shape (src/lib/types.ts):
- { id: string; title: string; content: string; favorite: boolean }

Client behavior:
- Optimistic UI updates for create, update, delete, and toggle favorite (see src/hooks/useNotes.ts).
- Proper error fallback and revert on failures.
- Query parameters for search, favorite, page, and pageSize are supported in listNotes.

## In-memory Fallback Behavior
If NEXT_PUBLIC_API_BASE is not set (or empty), the app runs in memory mode:
- A module-scoped in-memory array is used for notes in the browser session (src/lib/api/notes.ts).
- Pre-seeded with a few demo notes.
- All CRUD operations happen instantly (with small simulated latency).
- Data resets on page reload; no persistence beyond the session.
- This allows quick demos and development without provisioning a backend.

To enable real persistence:
- Set NEXT_PUBLIC_API_BASE to your backend URL and ensure it implements the REST endpoints described in API Expectations.

## Healthcheck Route
Local development route:
- GET /api/healthcheck
- Returns: { status: "ok", time: "<ISO timestamp>" }
- Defined in src/app/api/healthcheck/route.ts
- Headers set to prevent caching.

Note:
- In static export hosting, Next.js API routes are not executed. Use this endpoint during local dev with next dev, or provide a real backend healthcheck if deploying statically.

## Quick Start

### 1) Try the app with in-memory fallback (no backend)
Create .env.local at project root with minimal values:
```
NEXT_PUBLIC_NODE_ENV=development
NEXT_PUBLIC_LOG_LEVEL=debug
NEXT_PUBLIC_FEATURE_FLAGS=favorites,betaEditor
NEXT_PUBLIC_HEALTHCHECK_PATH=/api/healthcheck
```
Then:
- npm install
- npm run dev
Open http://localhost:3000 and use the Notes page. All data is in-memory for this session.

### 2) Connect to a real backend API
Assuming your backend is available at https://api.example.com:
```
NEXT_PUBLIC_NODE_ENV=production
NEXT_PUBLIC_API_BASE=https://api.example.com
NEXT_PUBLIC_FRONTEND_URL=https://app.example.com
NEXT_PUBLIC_LOG_LEVEL=info
NEXT_PUBLIC_FEATURE_FLAGS={"favorites": true}
NEXT_PUBLIC_HEALTHCHECK_PATH=/api/healthcheck
NEXT_PUBLIC_NEXT_TELEMETRY_DISABLED=true
NEXT_PUBLIC_ENABLE_SOURCE_MAPS=false
```
Build and export:
- npm run build
Serve statically:
- npx serve out

Now the app will call your backend for all CRUD actions.

## Development Notes
- Hooks perform client-side fetching only to remain compatible with static export.
- API requests go through src/lib/api/client.ts which handles JSON, timeouts, errors, and logging based on NEXT_PUBLIC_LOG_LEVEL.
- Styling follows the Ocean Professional theme with a sidebar navigation and a main content area (see src/styles/theme.css and components under src/components).

## Repository Structure (high level)
- src/app
  - page.tsx: landing page
  - notes/: notes listing and detail pages
  - api/healthcheck/route.ts: local healthcheck
  - not-found.tsx: custom 404 page
  - layout.tsx: app shell with header and sidebar
- src/hooks
  - useNotes.ts: list/detail hooks with optimistic updates
  - useFeatureFlags.ts: client-side feature flags parsing
- src/lib
  - api/client.ts: fetch wrapper and utilities
  - api/notes.ts: notes CRUD with in-memory fallback
  - config.ts: central environment configuration
  - types.ts: shared types
  - utils.ts: utility functions
- src/components
  - Layout/: header and sidebar
  - Notes/: notes UI components
  - common/: UI primitives (Button, Input, TextArea)

## Troubleshooting
- Seeing no data? If NEXT_PUBLIC_API_BASE is not set, the app uses in-memory notes. That is expected. Set NEXT_PUBLIC_API_BASE to a real backend to persist data.
- 404s for API routes after static export: static export does not run API routes. Use a real backend and point NEXT_PUBLIC_API_BASE to it.
- Logging too verbose or too quiet: adjust NEXT_PUBLIC_LOG_LEVEL (silent, error, warn, info, debug, trace).

---
Sources:
- src/lib/config.ts
- src/lib/api/notes.ts
- src/lib/api/client.ts
- src/hooks/useNotes.ts
- src/hooks/useFeatureFlags.ts
- next.config.ts
- src/app/api/healthcheck/route.ts

