# Remix Ledger

Remix 3 で会計システムを作る学習用プロジェクト。

ref: https://docs.remix.run/

## Docs

- [アーキテクチャ](docs/architecture.md) — 層の分け方、ディレクトリ構成、機能を追加するときの手順
- [実装ロードマップ](docs/roadmap.md) — 書籍の章と作る機能の対応

## Setup

```sh
npm i
cp .env.example .env
npm run db:up        # PostgreSQL を Docker で起動（localhost:54320）
npm run db:migrate
npm run db:seed      # 動作確認用のマスタデータを投入（任意）
npm run dev          # http://localhost:44100（Tailwind の CSS の監視も一緒に起動する）
```

## Commands

ほかのコマンドは `package.json` の `scripts` を参照。
