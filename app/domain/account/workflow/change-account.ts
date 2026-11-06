import { err, ok, type AsyncResult, type NonEmptyArray } from '../../building-blocks.ts'
import type { Account } from '../model/entity.ts'
import type { AccountId } from '../model/primitive.ts'
import type { UpdateAccountPort, SaveAccountError } from '../port.ts'
import { validateAccount, type AccountInputError, type UnvalidatedAccount } from './common.ts'

export type ChangeAccountCommand = { id: AccountId; input: UnvalidatedAccount }
export type AccountChanged = { account: Account }
export type ChangeAccountError = AccountInputError | SaveAccountError | 'AccountNotFound'
export type ChangeAccountWorkflow = (command: ChangeAccountCommand) => AsyncResult<AccountChanged, NonEmptyArray<ChangeAccountError>>
export type ChangeAccountPorts = { updateAccount: UpdateAccountPort }

export const changeAccount =
  ({ updateAccount }: ChangeAccountPorts): ChangeAccountWorkflow =>
  async ({ id, input }) => {
    const validated = validateAccount(input)
    if (!validated.ok) return validated
    const saved = await updateAccount(id, validated.value)
    if (!saved.ok) return err([saved.error])
    if (saved.value === null) return err(['AccountNotFound'])
    return ok({ account: saved.value })
  }
