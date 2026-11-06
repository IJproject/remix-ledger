import { err, ok, type AsyncResult, type NonEmptyArray } from '../../building-blocks.ts'
import type { Account } from '../model/entity.ts'
import type { InsertAccountPort, SaveAccountError } from '../port.ts'
import { validateAccount, type AccountInputError, type UnvalidatedAccount } from './common.ts'

export type RegisterAccountCommand = { input: UnvalidatedAccount }
export type AccountRegistered = { account: Account }
export type RegisterAccountError = AccountInputError | SaveAccountError
export type RegisterAccountWorkflow = (command: RegisterAccountCommand) => AsyncResult<AccountRegistered, NonEmptyArray<RegisterAccountError>>
export type RegisterAccountPorts = { insertAccount: InsertAccountPort }

export const registerAccount =
  ({ insertAccount }: RegisterAccountPorts): RegisterAccountWorkflow =>
  async ({ input }) => {
    const validated = validateAccount(input)
    if (!validated.ok) return validated
    const saved = await insertAccount(validated.value)
    if (!saved.ok) return err([saved.error])
    return ok({ account: saved.value })
  }
