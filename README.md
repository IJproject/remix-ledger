# Remix Ledger

A minimal Remix application starter with a home page.

ref: https://docs.remix.run/

## Starter Shape

- `app/actions/controller.tsx` owns the top-level route actions.
- `app/actions/home-page.tsx` and `app/actions/document.tsx` render the route-owned starter UI.
- `app/actions/public/` contains the browser runtime entry and interactive prompt button.
- `app/routes.ts` defines the shared route contract used by server and browser modules for type-safe hrefs.
- `app/router.ts` wires routes to handlers and installs the standard Remix component renderer used by actions.
- `app/external/<service>/` holds clients for external services (database, APIs). `app/external/db/` contains the PostgreSQL client, migrations, and Docker init SQL.
- `app/external/db/client.ts` connects to PostgreSQL (`DATABASE_URL`, or `TEST_DATABASE_URL` under `NODE_ENV=test`) and runs migrations from `app/external/db/migrations/` at server start.
- `app/middleware/database.ts` exposes the shared database to actions as `context.db`.
- `compose.yaml` runs PostgreSQL for development and tests (`ledger` / `ledger_test` on port 54320).
- Add schema changes as new numbered migration directories (`app/external/db/migrations/0001_name/up.sql` + `down.sql`); never edit an applied migration.
- `app/assets.ts` owns the server-side asset pipeline used by the asset route and render middleware.
- Root `public/` contains static files served unchanged from the app root.

## Growing The App

- Put top-level route actions in `app/actions/controller.tsx`.
- Add `app/actions/<route-key>/controller.tsx` when a nested route map needs its own actions or middleware.
- Add directories like `app/data/` when the app actually needs them.
- Move shared UI into `app/ui/` once more than one route needs it.

## Commands

```sh
npm i
npm run dev
npm run css:watch    # Tailwind の CSS を監視して作り直す（dev / hmr が一緒に起動する）
npm run css:build    # Tailwind の CSS を1回生成する（start の前に自動で実行される）
npm run hmr
npm run start
npm test
npm run typecheck
cp .env.example .env
npm run db:up        # PostgreSQL を起動（localhost:54320）
npm run db:status
npm run db:migrate
npm run db:seed      # 動作確認用の勘定科目・部門を投入（開発用 DB のみ）
npm run db:down
```
