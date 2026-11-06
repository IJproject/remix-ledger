/** 勘定科目の複数のワークフローで共有する状態（未検証→検証済み）と、それを進めるステップ。1つのワークフローでしか使わないものはここに置かない。 */
import { err, ok, type NonEmptyArray, type Result, type State } from '../../building-blocks.ts'
import { AccountCode, type AccountCodeError, AccountName, type AccountNameError } from '../model/primitive.ts'

export type UnvalidatedAccount = { readonly code: string; readonly name: string }
export type ValidatedAccount = State<'ValidatedAccount', { readonly code: AccountCode; readonly name: AccountName }>
export type AccountInputError = AccountCodeError | AccountNameError

export const validateAccount = (input: UnvalidatedAccount): Result<ValidatedAccount, NonEmptyArray<AccountInputError>> => {
  const code = AccountCode.create(input.code)
  const name = AccountName.create(input.name)
  if (!code.ok && !name.ok) return err([code.error, name.error])
  if (!code.ok) return err([code.error])
  if (!name.ok) return err([name.error])
  return ok({ code: code.value, name: name.value } as ValidatedAccount)
}
