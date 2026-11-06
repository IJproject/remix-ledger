import { err, ok, type AsyncResult } from '../../building-blocks.ts'
import type { Account } from '../model/entity.ts'
import type { AccountId } from '../model/primitive.ts'
import type { FindAccountPort, ReadAccountError } from '../port.ts'

export type QueryAccountByIdPorts = { findAccount: FindAccountPort }
export type QueryAccountByIdError = 'AccountNotFound' | ReadAccountError

export const queryAccountById =
  ({ findAccount }: QueryAccountByIdPorts) =>
  async (id: AccountId): AsyncResult<Account, QueryAccountByIdError> => {
    const found = await findAccount(id)
    if (!found.ok) return found
    if (found.value === null) return err('AccountNotFound')
    return ok(found.value)
  }
