# tolgee-poc

A small TanStack Start app that demonstrates [Tolgee](https://tolgee.io/) i18n with English + German.

## Setup

### 1. Start the Tolgee server

```bash
docker compose up -d        # http://localhost:8200
docker exec tolgee cat /data/initial.pwd   # initial admin password
```

Log in at <http://localhost:8200> as `admin`, set a new password.

### 2. Create the project in Tolgee

- **Projects → Add a project** — name `tolgee-poc`, base language **English** (`en`).
- **Languages → Add language** — `German` (`de`).
- **Project settings** — copy the **Project ID** (small integer).
- **API keys → Create new** — give it `admin` scope (or at least `translations.*`, `keys.*`, `languages.view`). Copy the `tgpak_…`.

### 3. Configure the app

```bash
cd app
npm install
```

Edit `app/.tolgeerc.json` — set `projectId` to yours.

Create `app/.env`:

```dotenv
VITE_APP_TOLGEE_API_URL=http://localhost:8200
VITE_APP_TOLGEE_API_KEY=tgpak_xxxxxxxxxxxx
```

### 4. Push the bundled translations to Tolgee

```bash
TOLGEE_API_KEY=tgpak_xxxxxxxxxxxx npm run i18n:push
```

Uploads ~47 keys from `app/src/i18n/{en,de}/*.json`.

> Always use the CLI, not the web Import. Tolgee's web import infers language from the filename, but our JSONs use folder-per-language (`en/dashboard.json`) — the CLI takes language from `.tolgeerc.json` and avoids that ambiguity.

### 5. Run the app

```bash
npm run dev                 # http://localhost:3000
```

Log in with anything. Switch EN ↔ DE in the header. **Hold `Alt` and click any text** to edit translations in place — changes save to the Tolgee server.

## Daily workflow

| Task | Command |
|---|---|
| Push local JSON → Tolgee | `TOLGEE_API_KEY=… npm run i18n:push` |
| Pull Tolgee → local JSON | `TOLGEE_API_KEY=… npm run i18n:pull` |
| Run app | `npm run dev` |

Set `TOLGEE_API_KEY` in your shell profile to skip the prefix.

## Translation files

```
app/src/i18n/
├── en/{app,nav,header,language,common,login,dashboard,users}.json
└── de/(same)
```

Each file owns one top-level namespace, e.g. `dashboard.json`:

```json
{ "dashboard": { "title": "...", "card": { "users": "..." } } }
```

The Vite loader in `app/src/lib/tolgee.ts` discovers files via `import.meta.glob`, so adding a new namespace is just two new JSON files (one per language) — no registry changes.

## Using translations in code

```tsx
import { useTranslate } from '@tolgee/react'

const { t } = useTranslate()
return <h1>{t('dashboard.title')}</h1>
```

Every user-facing string must come from `t()` — see `.claude/rules/layout-styling.md`.

## Adding a new namespace

1. Create `app/src/i18n/en/<name>.json` and `app/src/i18n/de/<name>.json`.
2. Use `t('<name>.someKey')` in components.
3. `npm run i18n:push`.

## Without an API key

If `app/.env` has no `VITE_APP_TOLGEE_API_KEY`, the app still works — it uses the bundled static JSON. DevTools / in-context editing simply turn off.
