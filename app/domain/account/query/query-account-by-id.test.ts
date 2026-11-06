import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { err, ok } from '../../building-blocks.ts'
import type { Account } from '../model/entity.ts'
import { AccountCode, AccountId, AccountName, CreatedAt, UpdatedAt } from '../model/primitive.ts'
import type { FindAccountPort } from '../port.ts'
import { queryAccountById } from './query-account-by-id.ts'

const id = AccountId.create(1)
const code = AccountCode.create('1110')
const name = AccountName.create('現金')
const createdAt = CreatedAt.create(new Date('2026-11-04T09:00:00Z'))
const updatedAt = UpdatedAt.create(new Date('2026-11-04T09:00:00Z'))
if (!id.ok || !code.ok || !name.ok || !createdAt.ok || !updatedAt.ok) throw new Error('Invalid test fixture')
const ACCOUNT: Account = { id: id.value, code: code.value, name: name.value, createdAt: createdAt.value, updatedAt: updatedAt.value }

/** @see {@link queryAccountById} */
describe('queryAccountById', () => {
  it('見つかれば勘定科目を返す', async () => {
    const findAccount: FindAccountPort = async () => ok(ACCOUNT)
    assert.deepEqual(await queryAccountById({ findAccount })(ACCOUNT.id), ok(ACCOUNT))
  })

  it('対象が無ければ AccountNotFound を返す', async () => {
    const findAccount: FindAccountPort = async () => ok(null)
    assert.deepEqual(await queryAccountById({ findAccount })(ACCOUNT.id), err('AccountNotFound'))
  })

  it('ポートのエラーをそのまま返す', async () => {
    const findAccount: FindAccountPort = async () => err('StoreUnavailable')
    assert.deepEqual(await queryAccountById({ findAccount })(ACCOUNT.id), err('StoreUnavailable'))
  })

  it('引数の ID をポートに渡す', async () => {
    let receivedId: AccountId | undefined
    const findAccount: FindAccountPort = async (accountId) => {
      receivedId = accountId
      return ok(ACCOUNT)
    }
    await queryAccountById({ findAccount })(ACCOUNT.id)
    assert.deepEqual(receivedId, ACCOUNT.id)
  })
})
