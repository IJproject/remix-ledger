# Remix Ledger Agent Guide

This app was scaffolded with `remix new`. Use these conventions when continuing to build it out.

## Commands

```sh
npm i
npm run dev
npm run hmr
npm run start
npm test
npm run typecheck
cp .env.example .env
npm run db:up        # PostgreSQL を起動（localhost:54320）
npm run db:status
npm run db:migrate
npm run db:seed      # 動作確認用の勘定科目を投入（開発用 DB のみ）
npm run db:down
```

Use `npm run hmr` for live server and browser updates; `npm run dev` only watches and restarts the server. `npm run start` runs in production mode without a separate build step.

## Building Features

Refer to ./.agents/skills/remix/SKILL.md for the Remix mental model and how to find guides and API READMEs through `node_modules/remix/INDEX.md`.

## Starter Layout

- `app/routes.ts` defines the shared route contract used by server and browser modules for type-safe hrefs
- `app/router.ts` wires routes to controllers and installs the standard Remix component renderer used by actions
- `app/external/<service>/` holds clients for external services (database, APIs). `app/external/db/` contains the PostgreSQL client, migrations, and Docker init SQL
- `app/external/db/client.ts` connects to PostgreSQL (`DATABASE_URL`, or `TEST_DATABASE_URL` under `NODE_ENV=test`) and runs migrations from `app/external/db/migrations/` at server start
- `app/middleware/database.ts` exposes the shared database to actions as `context.db`
- `compose.yaml` runs PostgreSQL for development and tests (`ledger` / `ledger_test` on port 54320)
- Add schema changes as new numbered migration directories (`app/external/db/migrations/0001_name/up.sql` + `down.sql`); never edit an applied migration
- Put top-level route actions in `app/actions/controller.tsx`; add `app/actions/<route-key>/controller.tsx` for nested route maps. `app/actions/controller.test.ts` is the root controller's router smoke test
- `app/actions/home-page.tsx` and `app/actions/document.tsx` render the route-owned starter UI
- `app/actions/public/` contains the browser runtime entry and interactive prompt button
- `app/assets.ts` owns the server-side asset pipeline used by the asset route and render middleware
- Root `public/` contains static files served unchanged from the app root

This starter intentionally begins small; add directories like `app/data/` and `app/ui/` only when you need them.
