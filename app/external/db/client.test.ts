import * as assert from 'remix/assert'
import { sql } from 'remix/data-table'
import { describe, it } from 'remix/test'

import { db } from './client.ts'

describe('database', () => {
  it('executes a PostgreSQL query', async () => {
    const result = await db.exec(sql`select 1 as value`)

    assert.equal(result.rows?.[0]?.value, 1)
  })
})
