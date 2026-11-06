import { err, ok, type AsyncResult } from '../../building-blocks.ts'
import type { Department } from '../model/entity.ts'
import type { DepartmentId } from '../model/primitive.ts'
import type { FindDepartmentPort, ReadDepartmentError } from '../port.ts'

export type QueryDepartmentByIdPorts = { findDepartment: FindDepartmentPort }
export type QueryDepartmentByIdError = 'DepartmentNotFound' | ReadDepartmentError

export const queryDepartmentById =
  ({ findDepartment }: QueryDepartmentByIdPorts) =>
  async (id: DepartmentId): AsyncResult<Department, QueryDepartmentByIdError> => {
    const found = await findDepartment(id)
    if (!found.ok) return found
    if (found.value === null) return err('DepartmentNotFound')
    return ok(found.value)
  }
