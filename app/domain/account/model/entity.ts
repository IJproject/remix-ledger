import type { AccountCode, AccountId, AccountName, CreatedAt, UpdatedAt } from './primitive.ts'

export type Account = { id: AccountId; code: AccountCode; name: AccountName; createdAt: CreatedAt; updatedAt: UpdatedAt }
