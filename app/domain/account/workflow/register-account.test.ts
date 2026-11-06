import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { err, ok } from '../../building-blocks.ts'
import type { Account } from '../model/entity.ts'
import { AccountCode, AccountId, AccountName, CreatedAt, UpdatedAt } from '../model/primitive.ts'
import type { InsertAccountPort } from '../port.ts'
import { registerAccount } from './register-account.ts'

const id = AccountId.create(1)
const code = AccountCode.create('1110')
const name = AccountName.create('現金')
const createdAt = CreatedAt.create(new Date('2026-11-04T09:00:00Z'))
const updatedAt = UpdatedAt.create(new Date('2026-11-04T09:00:00Z'))
if (!id.ok || !code.ok || !name.ok || !createdAt.ok || !updatedAt.ok) throw new Error('Invalid test fixture')
const ACCOUNT: Account = { id: id.value, code: code.value, name: name.value, createdAt: createdAt.value, updatedAt: updatedAt.value }

/** @see {@link registerAccount} */
describe('registerAccount', () => {
  it('追加した勘定科目をイベントで返す', async () => {
    const insertAccount: InsertAccountPort = async () => ok(ACCOUNT)
    assert.deepEqual(await registerAccount({ insertAccount })({ input: { code: '1110', name: '現金' } }), ok({ account: ACCOUNT }))
  })

  it('入力が不正ならポートを呼ばない', async () => {
    let called = false
    const insertAccount: InsertAccountPort = async () => { called = true; return ok(ACCOUNT) }
    assert.deepEqual(await registerAccount({ insertAccount })({ input: { code: '', name: '' } }), err(['AccountCodeEmpty', 'AccountNameEmpty']))
    assert.equal(called, false)
  })

  it('保存エラーを配列で返す', async () => {
    const insertAccount: InsertAccountPort = async () => err('AccountCodeAlreadyUsed')
    assert.deepEqual(await registerAccount({ insertAccount })({ input: { code: '1110', name: '現金' } }), err(['AccountCodeAlreadyUsed']))
  })
})
