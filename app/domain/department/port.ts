import type { AsyncResult } from '../building-blocks.ts'
import type { Department } from './model/entity.ts'
import type { DepartmentId } from './model/primitive.ts'
import type { ValidatedDepartment } from './workflow/common.ts'

export type ReadDepartmentError = 'StoreUnavailable' | 'StoredDepartmentMalformed'
/** コードの昇順で返す。 */
export type ListDepartmentsPort = () => AsyncResult<Department[], ReadDepartmentError>
export type FindDepartmentPort = (id: DepartmentId) => AsyncResult<Department | null, ReadDepartmentError>

export type SaveDepartmentError =
  | 'DepartmentCodeAlreadyUsed'
  | 'DepartmentNameAlreadyUsed'
  | 'StoreUnavailable'
  | 'StoredDepartmentMalformed'
export type InsertDepartmentPort = (department: ValidatedDepartment) => AsyncResult<Department, SaveDepartmentError>
/** 更新対象の ID が無ければ null を返す。 */
export type UpdateDepartmentPort = (id: DepartmentId, department: ValidatedDepartment) => AsyncResult<Department | null, SaveDepartmentError>
