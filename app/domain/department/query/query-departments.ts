import type { AsyncResult } from '../../building-blocks.ts'
import type { Department } from '../model/entity.ts'
import type { ListDepartmentsPort, ReadDepartmentError } from '../port.ts'

export type QueryDepartmentsPorts = { listDepartments: ListDepartmentsPort }
export type QueryDepartmentsError = ReadDepartmentError

export const queryDepartments =
  ({ listDepartments }: QueryDepartmentsPorts) =>
  async (): AsyncResult<Department[], QueryDepartmentsError> => listDepartments()
