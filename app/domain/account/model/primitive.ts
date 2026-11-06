import { err, ok, type Primitive, type Result } from '../../building-blocks.ts'

export type AccountId = Primitive<'AccountId', number>
export type AccountIdError = 'AccountIdNotInteger' | 'AccountIdNotPositive'
export const AccountId = {
  create: (input: number): Result<AccountId, AccountIdError> => {
    if (!Number.isInteger(input)) return err('AccountIdNotInteger')
    if (input < 1) return err('AccountIdNotPositive')
    return ok(input as AccountId)
  },
  value: (id: AccountId): number => id,
}

export type AccountCode = Primitive<'AccountCode', string>
export type AccountCodeError =
  | 'AccountCodeEmpty'
  | 'AccountCodeNotDigits'
  | 'AccountCodeTooLong'
const ACCOUNT_CODE_MAX_LENGTH = 10
export const AccountCode = {
  create: (input: string): Result<AccountCode, AccountCodeError> => {
    const trimmed = input.trim()
    if (trimmed === '') return err('AccountCodeEmpty')
    if (!/^[0-9]+$/.test(trimmed)) return err('AccountCodeNotDigits')
    if (trimmed.length > ACCOUNT_CODE_MAX_LENGTH) return err('AccountCodeTooLong')
    return ok(trimmed as AccountCode)
  },
  value: (code: AccountCode): string => code,
}

export type AccountName = Primitive<'AccountName', string>
export type AccountNameError = 'AccountNameEmpty' | 'AccountNameTooLong'
const ACCOUNT_NAME_MAX_LENGTH = 50
export const AccountName = {
  create: (input: string): Result<AccountName, AccountNameError> => {
    const trimmed = input.trim()
    if (trimmed === '') return err('AccountNameEmpty')
    if ([...trimmed].length > ACCOUNT_NAME_MAX_LENGTH) return err('AccountNameTooLong')
    return ok(trimmed as AccountName)
  },
  value: (name: AccountName): string => name,
}

export type CreatedAt = Primitive<'CreatedAt', Date>
export type CreatedAtError = 'CreatedAtInvalid'
export const CreatedAt = {
  create: (input: Date): Result<CreatedAt, CreatedAtError> => {
    if (Number.isNaN(input.getTime())) return err('CreatedAtInvalid')
    return ok(input as CreatedAt)
  },
  value: (createdAt: CreatedAt): Date => createdAt,
}

export type UpdatedAt = Primitive<'UpdatedAt', Date>
export type UpdatedAtError = 'UpdatedAtInvalid'
export const UpdatedAt = {
  create: (input: Date): Result<UpdatedAt, UpdatedAtError> => {
    if (Number.isNaN(input.getTime())) return err('UpdatedAtInvalid')
    return ok(input as UpdatedAt)
  },
  value: (updatedAt: UpdatedAt): Date => updatedAt,
}
