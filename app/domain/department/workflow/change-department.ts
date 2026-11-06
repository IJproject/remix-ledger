import { err, ok, type AsyncResult, type NonEmptyArray } from '../../building-blocks.ts'
import type { Department } from '../model/entity.ts'
import type { DepartmentId } from '../model/primitive.ts'
import type { UpdateDepartmentPort, SaveDepartmentError } from '../port.ts'
import { validateDepartment, type DepartmentInputError, type UnvalidatedDepartment } from './common.ts'

export type ChangeDepartmentCommand = { id: DepartmentId; input: UnvalidatedDepartment }
export type DepartmentChanged = { department: Department }
export type ChangeDepartmentError = DepartmentInputError | SaveDepartmentError | 'DepartmentNotFound'
export type ChangeDepartmentWorkflow = (command: ChangeDepartmentCommand) => AsyncResult<DepartmentChanged, NonEmptyArray<ChangeDepartmentError>>
export type ChangeDepartmentPorts = { updateDepartment: UpdateDepartmentPort }

export const changeDepartment =
  ({ updateDepartment }: ChangeDepartmentPorts): ChangeDepartmentWorkflow =>
  async ({ id, input }) => {
    const validated = validateDepartment(input)
    if (!validated.ok) return validated
    const saved = await updateDepartment(id, validated.value)
    if (!saved.ok) return err([saved.error])
    if (saved.value === null) return err(['DepartmentNotFound'])
    return ok({ department: saved.value })
  }
