# Remix Ledger Agent Guide

This app was scaffolded with `remix new`. Use these conventions when continuing to build it out.

## Commands

Setup steps are in `README.md`. See the `scripts` in `package.json` for all commands (`npm test`, `npm run typecheck`, `npm run db:*`, ...).

Use `npm run hmr` for live server and browser updates; `npm run dev` only watches and restarts the server. Both also run the Tailwind CSS watcher (`css:watch`) through `concurrently`. `npm run start` builds the CSS once (`prestart`) and runs in production mode without any other build step.

## Architecture

Read `docs/architecture.md` before adding or moving code. It defines the layers (`app/domain/`, `app/external/`, `app/actions/`), which layer may import which, the directory layout, and the steps for adding a feature. Use the account master (`app/domain/account/`, `app/external/db/adapters/account.ts`, `app/actions/settings/accounts/`) as the reference implementation.

## Building Features

Refer to ./.agents/skills/remix/SKILL.md for the Remix mental model and how to find guides and API READMEs through `node_modules/remix/INDEX.md`.
