import type { AsyncResult } from '../building-blocks.ts'
import type { Account } from './model/entity.ts'
import type { AccountId } from './model/primitive.ts'
import type { ValidatedAccount } from './workflow/common.ts'

export type ReadAccountError = 'StoreUnavailable' | 'StoredAccountMalformed'
/** コードの昇順で返す。 */
export type ListAccountsPort = () => AsyncResult<Account[], ReadAccountError>
export type FindAccountPort = (id: AccountId) => AsyncResult<Account | null, ReadAccountError>

export type SaveAccountError =
  | 'AccountCodeAlreadyUsed'
  | 'AccountNameAlreadyUsed'
  | 'StoreUnavailable'
  | 'StoredAccountMalformed'
export type InsertAccountPort = (account: ValidatedAccount) => AsyncResult<Account, SaveAccountError>
/** 更新対象の ID が無ければ null を返す。 */
export type UpdateAccountPort = (id: AccountId, account: ValidatedAccount) => AsyncResult<Account | null, SaveAccountError>
