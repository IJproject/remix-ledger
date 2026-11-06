import type { AsyncResult } from '../../building-blocks.ts'
import type { Account } from '../model/entity.ts'
import type { ListAccountsPort, ReadAccountError } from '../port.ts'

export type QueryAccountsPorts = { listAccounts: ListAccountsPort }
export type QueryAccountsError = ReadAccountError

export const queryAccounts =
  ({ listAccounts }: QueryAccountsPorts) =>
  async (): AsyncResult<Account[], QueryAccountsError> => listAccounts()
