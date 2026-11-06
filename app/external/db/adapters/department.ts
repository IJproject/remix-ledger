import { DataTableDatabaseError, type TableRow } from 'remix/data-table'

import { err, ok, type Result } from '../../../domain/building-blocks.ts'
import type { Department } from '../../../domain/department/model/entity.ts'
import { DepartmentCode, DepartmentId, DepartmentName, CreatedAt, UpdatedAt } from '../../../domain/department/model/primitive.ts'
import type {
  FindDepartmentPort,
  InsertDepartmentPort,
  ListDepartmentsPort,
  ReadDepartmentError,
  SaveDepartmentError,
  UpdateDepartmentPort,
} from '../../../domain/department/port.ts'
import { db } from '../client.ts'
import { departmentsTable } from '../tables.ts'

export const listDepartmentsAdapter: ListDepartmentsPort = async () => {
  try {
    const rows = await db.findMany(departmentsTable, { orderBy: ['code', 'asc'] })
    const departments: Department[] = []
    for (const row of rows) {
      const department = StoredDepartmentDto.toDomain(row)
      if (!department.ok) return department
      departments.push(department.value)
    }
    return ok(departments)
  } catch (error) {
    return readFailure(error)
  }
}

export const findDepartmentAdapter: FindDepartmentPort = async (id) => {
  try {
    const row = await db.find(departmentsTable, DepartmentId.value(id))
    return row === null ? ok(null) : StoredDepartmentDto.toDomain(row)
  } catch (error) {
    return readFailure(error)
  }
}

export const insertDepartmentAdapter: InsertDepartmentPort = async (department) => {
  try {
    const row = await db.create(departmentsTable, {
      code: DepartmentCode.value(department.code),
      name: DepartmentName.value(department.name),
    }, { returnRow: true })
    return StoredDepartmentDto.toDomain(row)
  } catch (error) {
    return saveFailure(error)
  }
}

export const updateDepartmentAdapter: UpdateDepartmentPort = async (id, department) => {
  try {
    const existing = await db.find(departmentsTable, DepartmentId.value(id))
    if (existing === null) return ok(null)
    const row = await db.update(departmentsTable, DepartmentId.value(id), {
      code: DepartmentCode.value(department.code),
      name: DepartmentName.value(department.name),
    })
    return StoredDepartmentDto.toDomain(row)
  } catch (error) {
    return saveFailure(error)
  }
}

type StoredDepartmentDto = TableRow<typeof departmentsTable>
const StoredDepartmentDto = {
  toDomain: (dto: StoredDepartmentDto): Result<Department, 'StoredDepartmentMalformed'> => {
    const id = DepartmentId.create(dto.id)
    if (!id.ok) return err('StoredDepartmentMalformed')
    const code = DepartmentCode.create(dto.code)
    if (!code.ok) return err('StoredDepartmentMalformed')
    const name = DepartmentName.create(dto.name)
    if (!name.ok) return err('StoredDepartmentMalformed')
    if (!(dto.created_at instanceof Date)) return err('StoredDepartmentMalformed')
    const createdAt = CreatedAt.create(dto.created_at)
    if (!createdAt.ok) return err('StoredDepartmentMalformed')
    if (!(dto.updated_at instanceof Date)) return err('StoredDepartmentMalformed')
    const updatedAt = UpdatedAt.create(dto.updated_at)
    if (!updatedAt.ok) return err('StoredDepartmentMalformed')
    return ok({ id: id.value, code: code.value, name: name.value, createdAt: createdAt.value, updatedAt: updatedAt.value })
  },
}

function readFailure(error: unknown): Result<never, ReadDepartmentError> {
  console.error(error)
  return err('StoreUnavailable')
}

function saveFailure(error: unknown): Result<never, SaveDepartmentError> {
  if (error instanceof DataTableDatabaseError) {
    const cause = error.cause
    if (cause && typeof cause === 'object' && 'code' in cause && cause.code === '23505' && 'constraint' in cause) {
      if (cause.constraint === 'departments_code_key') return err('DepartmentCodeAlreadyUsed')
      if (cause.constraint === 'departments_name_key') return err('DepartmentNameAlreadyUsed')
    }
  }
  console.error(error)
  return err('StoreUnavailable')
}
