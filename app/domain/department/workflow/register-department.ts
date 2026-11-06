import { err, ok, type AsyncResult, type NonEmptyArray } from '../../building-blocks.ts'
import type { Department } from '../model/entity.ts'
import type { InsertDepartmentPort, SaveDepartmentError } from '../port.ts'
import { validateDepartment, type DepartmentInputError, type UnvalidatedDepartment } from './common.ts'

export type RegisterDepartmentCommand = { input: UnvalidatedDepartment }
export type DepartmentRegistered = { department: Department }
export type RegisterDepartmentError = DepartmentInputError | SaveDepartmentError
export type RegisterDepartmentWorkflow = (command: RegisterDepartmentCommand) => AsyncResult<DepartmentRegistered, NonEmptyArray<RegisterDepartmentError>>
export type RegisterDepartmentPorts = { insertDepartment: InsertDepartmentPort }

export const registerDepartment =
  ({ insertDepartment }: RegisterDepartmentPorts): RegisterDepartmentWorkflow =>
  async ({ input }) => {
    const validated = validateDepartment(input)
    if (!validated.ok) return validated
    const saved = await insertDepartment(validated.value)
    if (!saved.ok) return err([saved.error])
    return ok({ department: saved.value })
  }
