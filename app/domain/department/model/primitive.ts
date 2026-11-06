import { err, ok, type Primitive, type Result } from '../../building-blocks.ts'

export type DepartmentId = Primitive<'DepartmentId', number>
export type DepartmentIdError = 'DepartmentIdNotInteger' | 'DepartmentIdNotPositive'
export const DepartmentId = {
  create: (input: number): Result<DepartmentId, DepartmentIdError> => {
    if (!Number.isInteger(input)) return err('DepartmentIdNotInteger')
    if (input < 1) return err('DepartmentIdNotPositive')
    return ok(input as DepartmentId)
  },
  value: (id: DepartmentId): number => id,
}

export type DepartmentCode = Primitive<'DepartmentCode', string>
export type DepartmentCodeError =
  | 'DepartmentCodeEmpty'
  | 'DepartmentCodeNotDigits'
  | 'DepartmentCodeTooLong'
const DEPARTMENT_CODE_MAX_LENGTH = 10
export const DepartmentCode = {
  create: (input: string): Result<DepartmentCode, DepartmentCodeError> => {
    const trimmed = input.trim()
    if (trimmed === '') return err('DepartmentCodeEmpty')
    if (!/^[0-9]+$/.test(trimmed)) return err('DepartmentCodeNotDigits')
    if (trimmed.length > DEPARTMENT_CODE_MAX_LENGTH) return err('DepartmentCodeTooLong')
    return ok(trimmed as DepartmentCode)
  },
  value: (code: DepartmentCode): string => code,
}

export type DepartmentName = Primitive<'DepartmentName', string>
export type DepartmentNameError = 'DepartmentNameEmpty' | 'DepartmentNameTooLong'
const DEPARTMENT_NAME_MAX_LENGTH = 50
export const DepartmentName = {
  create: (input: string): Result<DepartmentName, DepartmentNameError> => {
    const trimmed = input.trim()
    if (trimmed === '') return err('DepartmentNameEmpty')
    if ([...trimmed].length > DEPARTMENT_NAME_MAX_LENGTH) return err('DepartmentNameTooLong')
    return ok(trimmed as DepartmentName)
  },
  value: (name: DepartmentName): string => name,
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
