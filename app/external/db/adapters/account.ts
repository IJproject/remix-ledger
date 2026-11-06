import { DataTableDatabaseError, type TableRow } from 'remix/data-table'

import { err, ok, type Result } from '../../../domain/building-blocks.ts'
import type { Account } from '../../../domain/account/model/entity.ts'
import { AccountCode, AccountId, AccountName, CreatedAt, UpdatedAt } from '../../../domain/account/model/primitive.ts'
import type {
  FindAccountPort,
  InsertAccountPort,
  ListAccountsPort,
  ReadAccountError,
  SaveAccountError,
  UpdateAccountPort,
} from '../../../domain/account/port.ts'
import { db } from '../client.ts'
import { accountsTable } from '../tables.ts'

export const listAccountsAdapter: ListAccountsPort = async () => {
  try {
    const rows = await db.findMany(accountsTable, { orderBy: ['code', 'asc'] })
    const accounts: Account[] = []
    for (const row of rows) {
      const account = StoredAccountDto.toDomain(row)
      if (!account.ok) return account
      accounts.push(account.value)
    }
    return ok(accounts)
  } catch (error) {
    return readFailure(error)
  }
}

export const findAccountAdapter: FindAccountPort = async (id) => {
  try {
    const row = await db.find(accountsTable, AccountId.value(id))
    return row === null ? ok(null) : StoredAccountDto.toDomain(row)
  } catch (error) {
    return readFailure(error)
  }
}

export const insertAccountAdapter: InsertAccountPort = async (account) => {
  try {
    const row = await db.create(accountsTable, {
      code: AccountCode.value(account.code),
      name: AccountName.value(account.name),
    }, { returnRow: true })
    return StoredAccountDto.toDomain(row)
  } catch (error) {
    return saveFailure(error)
  }
}

export const updateAccountAdapter: UpdateAccountPort = async (id, account) => {
  try {
    const existing = await db.find(accountsTable, AccountId.value(id))
    if (existing === null) return ok(null)
    const row = await db.update(accountsTable, AccountId.value(id), {
      code: AccountCode.value(account.code),
      name: AccountName.value(account.name),
    })
    return StoredAccountDto.toDomain(row)
  } catch (error) {
    return saveFailure(error)
  }
}

type StoredAccountDto = TableRow<typeof accountsTable>
const StoredAccountDto = {
  toDomain: (dto: StoredAccountDto): Result<Account, 'StoredAccountMalformed'> => {
    const id = AccountId.create(dto.id)
    if (!id.ok) return err('StoredAccountMalformed')
    const code = AccountCode.create(dto.code)
    if (!code.ok) return err('StoredAccountMalformed')
    const name = AccountName.create(dto.name)
    if (!name.ok) return err('StoredAccountMalformed')
    if (!(dto.created_at instanceof Date)) return err('StoredAccountMalformed')
    const createdAt = CreatedAt.create(dto.created_at)
    if (!createdAt.ok) return err('StoredAccountMalformed')
    if (!(dto.updated_at instanceof Date)) return err('StoredAccountMalformed')
    const updatedAt = UpdatedAt.create(dto.updated_at)
    if (!updatedAt.ok) return err('StoredAccountMalformed')
    return ok({ id: id.value, code: code.value, name: name.value, createdAt: createdAt.value, updatedAt: updatedAt.value })
  },
}

function readFailure(error: unknown): Result<never, ReadAccountError> {
  console.error(error)
  return err('StoreUnavailable')
}

function saveFailure(error: unknown): Result<never, SaveAccountError> {
  if (error instanceof DataTableDatabaseError) {
    const cause = error.cause
    if (cause && typeof cause === 'object' && 'code' in cause && cause.code === '23505' && 'constraint' in cause) {
      if (cause.constraint === 'accounts_code_key') return err('AccountCodeAlreadyUsed')
      if (cause.constraint === 'accounts_name_key') return err('AccountNameAlreadyUsed')
    }
  }
  console.error(error)
  return err('StoreUnavailable')
}
