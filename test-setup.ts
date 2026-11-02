import { db, migrateDatabase } from './app/external/db/client.ts'

export async function globalSetup() {
  await migrateDatabase()
}

export async function globalTeardown() {
  await db.close()
}
