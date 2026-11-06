import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { err, ok } from '../../building-blocks.ts'
import type { Account } from '../model/entity.ts'
import { AccountCode, AccountId, AccountName, CreatedAt, UpdatedAt } from '../model/primitive.ts'
import type { ListAccountsPort } from '../port.ts'
import { queryAccounts } from './query-accounts.ts'

const id = AccountId.create(1)
const code = AccountCode.create('1110')
const name = AccountName.create('現金')
const createdAt = CreatedAt.create(new Date('2026-11-04T09:00:00Z'))
const updatedAt = UpdatedAt.create(new Date('2026-11-04T09:00:00Z'))
if (!id.ok || !code.ok || !name.ok || !createdAt.ok || !updatedAt.ok) throw new Error('Invalid test fixture')
const ACCOUNT: Account = { id: id.value, code: code.value, name: name.value, createdAt: createdAt.value, updatedAt: updatedAt.value }

/** @see {@link queryAccounts} */
describe('queryAccounts', () => {
  it('ポートの一覧をそのまま返す', async () => {
    const listAccounts: ListAccountsPort = async () => ok([ACCOUNT])
    assert.deepEqual(await queryAccounts({ listAccounts })(), ok([ACCOUNT]))
  })

  it('ポートのエラーをそのまま返す', async () => {
    const listAccounts: ListAccountsPort = async () => err('StoreUnavailable')
    assert.deepEqual(await queryAccounts({ listAccounts })(), err('StoreUnavailable'))
  })
})
