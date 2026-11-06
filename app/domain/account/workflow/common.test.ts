import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { err, ok } from '../../building-blocks.ts'
import type { Account } from '../model/entity.ts'
import type { InsertAccountPort } from '../port.ts'
import { validateAccount, type ValidatedAccount } from './common.ts'
import type { RegisterAccountWorkflow } from './register-account.ts'

/** @see {@link validateAccount} */
describe('validateAccount', () => {
  const TEST_CASES = [
    { title: '前後の空白を除いて検証する', input: { code: ' 1110 ', name: ' 現金 ' }, expected: ok({ code: '1110', name: '現金' }) },
    { title: '両方不正なら両方のエラーを返す', input: { code: '', name: '' }, expected: err(['AccountCodeEmpty', 'AccountNameEmpty']) },
    { title: '一方だけ不正ならそのエラーを返す', input: { code: '11a0', name: '現金' }, expected: err(['AccountCodeNotDigits']) },
  ]

  for (const testCase of TEST_CASES) {
    it(testCase.title, () => assert.deepEqual(validateAccount(testCase.input), testCase.expected))
  }
})

// === 型の保証（npm run typecheck で検証する） ===
declare const account: Account
declare const insertAccount: InsertAccountPort
const typeAssertions = () => {
  // @ts-expect-error 保存済みの Account は検証済みの入力ではない
  insertAccount(account)
  // @ts-expect-error 検証済みはオブジェクトリテラルで作れない
  const forged: ValidatedAccount = { code: account.code, name: account.name }
  // @ts-expect-error 理由のない失敗は返せない
  const noReason: RegisterAccountWorkflow = async () => err([])
  return { forged, noReason }
}
void typeAssertions
