# tolgee-poc

A proof-of-concept admin app demoing Tolgee i18n inside a TanStack Start (React 19, Vite, Nitro) project.

## Stack

- **Frontend framework:** TanStack Start (router + SSR)
- **Styling:** Tailwind CSS v4 with design tokens in `app/src/styles/tokens.css`
- **i18n:** `@tolgee/react` (English + German)
- **Charts:** `recharts`
- **Tolgee server:** self-hosted via `docker-compose.yml` (image pinned to `tolgee/tolgee:v3.183.5`)

## Layout / repo structure

```
/                      repo root
├── docker-compose.yml  Tolgee server (port 8085)
├── CLAUDE.md           this file
├── .claude/rules/      project rules picked up by Claude
└── app/                TanStack Start app
    ├── src/
    │   ├── routes/     file-based routes (TanStack Router)
    │   │   ├── __root.tsx
    │   │   ├── index.tsx           redirects to /dashboard or /login
    │   │   ├── login.tsx
    │   │   ├── _admin.tsx          admin pathless layout (sidebar + header)
    │   │   └── _admin/
    │   │       ├── dashboard.tsx
    │   │       └── users.tsx
    │   ├── components/layout/      Sidebar, Header, AdminLayout
    │   ├── components/             LanguageSelector, NotFound, ...
    │   ├── lib/                    tolgee setup, fake auth
    │   ├── i18n/                   one folder per language; one JSON file per top-level namespace
    │   │   ├── en/{app,nav,header,language,common,login,dashboard,users}.json
    │   │   └── de/(same shape)
    │   └── styles/
    │       ├── tokens.css          design tokens — change here to restyle
    │       └── app.css             tailwind entry
```

## How to run

```bash
# 1. Tolgee server (admin: http://localhost:8085 — first password in volume `tolgee-data:/data/initial.pwd`)
docker compose up -d

# 2. App
cd app
cp .env.example .env   # fill VITE_APP_TOLGEE_API_URL / VITE_APP_TOLGEE_API_KEY (optional)
npm install
npm run dev            # http://localhost:3000
```

When `VITE_APP_TOLGEE_API_*` env vars are absent, the app falls back to the static JSON files in `app/src/i18n/<lang>/` — Tolgee DevTools and in-context editing only activate when those vars are set.

Each language is a folder; each JSON file owns one top-level namespace (e.g. `dashboard.json` contains `{ "dashboard": { ... } }`). Adding a new namespace is just a new file in both `en/` and `de/` — `src/lib/tolgee.ts` discovers them via `import.meta.glob` and merges them at load time, so no registry update is needed.

## Auth

Login is a stubbed client-side flag stored in `localStorage` (`tolgee-poc:auth`). No real backend. Any non-empty username/password works.

## Conventions

- See `.claude/rules/layout-styling.md` for the layout/styling intent.
- Translation keys live as nested JSON in `src/i18n/{en,de}.json` and are referenced via `useTranslate()` or the `<T>` component.
