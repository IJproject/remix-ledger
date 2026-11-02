// 単一プロセス前提で、起動時にマイグレーションを適用する。
// 適用済みは編集せず、0001_xxx/up.sql と down.sql のような新しい番号のディレクトリを追加する。
import { fileURLToPath } from 'node:url'
import { loadMigrations } from 'remix/data-table/migrations/node'
import { createPostgresDatabase } from 'remix/data-table/postgres'

const isTest = process.env.NODE_ENV === 'test'
const variableName = isTest ? 'TEST_DATABASE_URL' : 'DATABASE_URL'
const connectionString = process.env[variableName]

if (!connectionString) {
  throw new Error(`${variableName} is not set. Copy .env.example to .env (see README).`)
}

// テストでは、使い終わった接続がプールに残ってもワーカープロセスが終了できるようにする
export const db = createPostgresDatabase({ connectionString, allowExitOnIdle: isTest })

export async function migrateDatabase(): Promise<void> {
  const migrations = await loadMigrations(fileURLToPath(new URL('./migrations/', import.meta.url)))
  await db.migrate(migrations)
}
