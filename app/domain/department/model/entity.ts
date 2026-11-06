import type { DepartmentCode, DepartmentId, DepartmentName, CreatedAt, UpdatedAt } from './primitive.ts'

export type Department = { id: DepartmentId; code: DepartmentCode; name: DepartmentName; createdAt: CreatedAt; updatedAt: UpdatedAt }
