# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Single Next.js 13 app (App Router) — UACOMP FM CCC Milestones Analyzer. No monorepo, no database, no Docker.

### Running the app

- `npm run dev` starts the dev server on port 3000 (serves both frontend and API route).
- The API route at `/api/analyze` proxies requests to Anthropic Claude. Requires `ANTHROPIC_API_KEY` env var (set in `.env.local`).
- Without the API key, the UI loads and all client-side features work (theme toggle, tabs, filters, milestone browsing), but the "Find Advancement Opportunities" / "Find All Matches" button will fail.

### Lint / Build / Test

- `npm run lint` — uses `next lint`, but the repo pins ESLint v4.1.1 which is below the minimum required by Next.js (v7+). This is a **pre-existing issue**; the lint command will print an error and exit 0.
- `npm run build` — production build; compiles successfully.
- No automated test suite exists in this repo.

### Key gotchas

- All milestone data is hardcoded in `app/page.tsx` (~3400 lines); there is no database or external data source.
- The `eslint` and `eslint-config-next` versions in `package.json` are mismatched (`eslint@^4.1.1` vs `eslint-config-next@^0.2.4`). Do not attempt to fix unless explicitly asked.
