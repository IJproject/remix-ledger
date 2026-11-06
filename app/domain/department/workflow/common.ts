/** 部門の複数のワークフローで共有する状態（未検証→検証済み）と、それを進めるステップ。1つのワークフローでしか使わないものはここに置かない。 */
import { err, ok, type NonEmptyArray, type Result, type State } from '../../building-blocks.ts'
import { DepartmentCode, type DepartmentCodeError, DepartmentName, type DepartmentNameError } from '../model/primitive.ts'

export type UnvalidatedDepartment = { readonly code: string; readonly name: string }
export type ValidatedDepartment = State<'ValidatedDepartment', { readonly code: DepartmentCode; readonly name: DepartmentName }>
export type DepartmentInputError = DepartmentCodeError | DepartmentNameError

export const validateDepartment = (input: UnvalidatedDepartment): Result<ValidatedDepartment, NonEmptyArray<DepartmentInputError>> => {
  const code = DepartmentCode.create(input.code)
  const name = DepartmentName.create(input.name)
  if (!code.ok && !name.ok) return err([code.error, name.error])
  if (!code.ok) return err([code.error])
  if (!name.ok) return err([name.error])
  return ok({ code: code.value, name: name.value } as ValidatedDepartment)
}
