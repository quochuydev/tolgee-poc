# Tolgee branching workflow

Two Git branches, two Tolgee projects. Managers edit copy on `staging`; developers ship code on `main`.

## Table of contents

1. [Overview](#overview)
2. [Environments at a glance](#environments-at-a-glance)
3. [One-time setup (Tolgee admin)](#one-time-setup-tolgee-admin)
4. [For Managers — editing copy on `staging`](#for-managers--editing-copy-on-staging)
   - [Daily flow](#daily-flow)
   - [Things to avoid](#things-to-avoid)
5. [For Developers — working on `main`](#for-developers--working-on-main)
   - [Daily flow](#daily-flow-1)
   - [Adding a new translation key](#adding-a-new-translation-key)
6. [Promoting copy: `staging` → `main`](#promoting-copy-staging--main)
7. [FAQ](#faq)

---

## Overview

| Branch    | Tolgee project   | Who edits   | What they change                          |
| --------- | ---------------- | ----------- | ----------------------------------------- |
| `main`    | **dev** project  | Developers  | Code + translation keys (structure)       |
| `staging` | **staging** project | Manager  | Translation **values** (the copy itself)  |

The two projects are isolated: editing a value on `staging` does **not** affect `main`, and vice versa. The only bridge between them is a deliberate Git merge (see [Promoting copy](#promoting-copy-staging--main)).

Each branch commits its own `app/.tolgeerc.json` with its project's `projectId`, so `npm run i18n:push` / `npm run i18n:pull` always talk to the right project for the branch you have checked out.

## Environments at a glance

```
┌──────────────────────┐         ┌──────────────────────┐
│  Tolgee: dev project │         │ Tolgee: staging proj │
│  (projectId = X)     │         │  (projectId = Y)     │
└──────────┬───────────┘         └──────────┬───────────┘
           │ pull / push                    │ pull / push
           ▼                                ▼
   git branch: main                  git branch: staging
   (developers)                      (manager)
           │                                │
           │   merge staging → main         │
           └────────────────────────────────┘
                  (promote approved copy)
```

## One-time setup (Tolgee admin)

Do this **once**, after the Tolgee server is running (see top-level `README.md`).

1. **Create two projects** in the Tolgee UI at `http://localhost:8200`:
   - `tolgee-poc-dev` — base language English, add German.
   - `tolgee-poc-staging` — base language English, add German.
2. **Issue one API key per project**, scope `admin` (or at minimum `translations.*`, `keys.*`, `languages.view`). Save them — you cannot view a key twice.
3. **Note both project IDs** (small integers shown in *Project settings*).
4. **Commit the project IDs to the branches:**
   - On `main`: set `app/.tolgeerc.json` → `projectId` to the **dev** project ID.
   - On `staging`: set `app/.tolgeerc.json` → `projectId` to the **staging** project ID.
5. **Seed both projects** with the current bundled JSON. From each branch run:
   ```bash
   cd app
   TOLGEE_API_KEY=<key-for-this-branch> npm run i18n:push
   ```

After this, `main` and `staging` each have an independent project that only that branch's `.tolgeerc.json` points at.

## For Managers — editing copy on `staging`

You edit translations through the Tolgee web UI or by `Alt`-clicking text in the running app. You do not need to write code.

### Daily flow

1. **Switch your `.env` to the staging key** (one-time):
   ```dotenv
   VITE_APP_TOLGEE_API_URL=http://localhost:8200
   VITE_APP_TOLGEE_API_KEY=<staging-project-key>
   ```
2. **Check out the staging branch and pull latest:**
   ```bash
   git checkout staging
   git pull
   cd app && npm install
   ```
3. **Run the app:**
   ```bash
   npm run dev          # http://localhost:3000
   ```
4. **Edit copy.** Either:
   - In the running app: hold `Alt` and click any text → edit in place → save. Or
   - In the Tolgee UI at `http://localhost:8200` → project `tolgee-poc-staging`.
5. **Pull your changes back into the repo and commit:**
   ```bash
   TOLGEE_API_KEY=<staging-project-key> npm run i18n:pull
   git add src/i18n
   git commit -m "Update copy: <short description>"
   git push origin staging
   ```
6. Tell the developers / manager that `staging` has new copy ready for review.

### Things to avoid

- **Don't edit on `main`.** That branch's API key talks to the dev project; your changes will land in the wrong place.
- **Don't add or remove keys** (e.g. don't create a brand-new translation entry from the Tolgee UI without a developer adding the matching `t('...')` call). New keys come from developers; managers change values for existing keys.
- **Don't run `i18n:push`** unless you are intentionally overwriting the staging Tolgee project from the local JSON. The normal manager direction is **pull** (Tolgee → repo), not push.

## For Developers — working on `main`

You add features, add translation keys, and merge approved copy from `staging`.

### Daily flow

1. **Use the dev key in your `.env`:**
   ```dotenv
   VITE_APP_TOLGEE_API_URL=http://localhost:8200
   VITE_APP_TOLGEE_API_KEY=<dev-project-key>
   ```
2. **Work on `main`** (or feature branches off `main`). Your `app/.tolgeerc.json` already points at the dev project.
3. **Run the app:**
   ```bash
   cd app && npm run dev
   ```

### Adding a new translation key

1. Add the key to both `app/src/i18n/en/<namespace>.json` and `app/src/i18n/de/<namespace>.json`.
2. Use it in code:
   ```tsx
   const { t } = useTranslate()
   return <h1>{t('dashboard.newSection.title')}</h1>
   ```
3. Push the new key into the **dev** Tolgee project so devtools/in-context editing has it:
   ```bash
   TOLGEE_API_KEY=<dev-project-key> npm run i18n:push
   ```
4. When the feature is ready and merged to `main`, the key will reach `staging` via the next `main → staging` merge (or whichever direction your release process uses). The manager then translates the new key on `staging`.

> **Note on key flow:** structure (which keys exist) flows `main → staging`. Values for a given key flow `staging → main`. If you delete a key on `main`, communicate it — the manager won't see it disappear from the staging Tolgee project until the next sync.

## Promoting copy: `staging` → `main`

When the manager has approved copy on `staging` and you want it live in dev:

```bash
git checkout main
git pull
git merge staging      # or: git cherry-pick <commit>
# Resolve conflicts in app/src/i18n/**/*.json if any.
# Do NOT take staging's app/.tolgeerc.json — keep main's projectId.
git push origin main
```

Then push the merged JSON into the **dev** Tolgee project so devtools reflects the new values:

```bash
cd app
TOLGEE_API_KEY=<dev-project-key> npm run i18n:push
```

Conflict-handling rules of thumb:
- `app/src/i18n/**/*.json` → take `staging`'s version for **values**, take `main`'s version for **keys** (structure).
- `app/.tolgeerc.json` → always keep the branch you merged into (i.e. `main`'s dev `projectId`).
- Code files → `main` wins; `staging` should not contain code changes.

## FAQ

**Q: Can the manager work directly on `main`?**
A: No. The dev API key in `main`'s setup writes to the dev project, which devs use for testing. Manager edits would mix with developer scratch work and could be overwritten by a `i18n:push` from a feature branch.

**Q: What if a developer needs to test how copy *looks* in staging before merging?**
A: Check out `staging`, swap your `.env` to the staging key, run `npm run dev`. Don't push code changes from `staging`.

**Q: Do we need the same `projectId` on both branches?**
A: No — that's the whole point. `main` commits the dev `projectId`; `staging` commits the staging `projectId`. The CLI uses whichever `.tolgeerc.json` exists on the checked-out branch.

**Q: What if I forget to switch `.env` keys?**
A: Worst case you'll push local JSON into the wrong Tolgee project. Recover by checking out the correct branch and running `npm run i18n:push` to overwrite it back. No data loss in the repo — the JSON files are the source of truth.
