import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { err, ok } from '../../building-blocks.ts'
import type { Department } from '../model/entity.ts'
import { DepartmentCode, DepartmentId, DepartmentName, CreatedAt, UpdatedAt } from '../model/primitive.ts'
import type { FindDepartmentPort } from '../port.ts'
import { queryDepartmentById } from './query-department-by-id.ts'

const id = DepartmentId.create(1)
const code = DepartmentCode.create('200')
const name = DepartmentName.create('営業部')
const createdAt = CreatedAt.create(new Date('2026-11-04T09:00:00Z'))
const updatedAt = UpdatedAt.create(new Date('2026-11-04T09:00:00Z'))
if (!id.ok || !code.ok || !name.ok || !createdAt.ok || !updatedAt.ok) throw new Error('Invalid test fixture')
const DEPARTMENT: Department = { id: id.value, code: code.value, name: name.value, createdAt: createdAt.value, updatedAt: updatedAt.value }

/** @see {@link queryDepartmentById} */
describe('queryDepartmentById', () => {
  it('見つかれば部門を返す', async () => {
    const findDepartment: FindDepartmentPort = async () => ok(DEPARTMENT)
    assert.deepEqual(await queryDepartmentById({ findDepartment })(DEPARTMENT.id), ok(DEPARTMENT))
  })

  it('対象が無ければ DepartmentNotFound を返す', async () => {
    const findDepartment: FindDepartmentPort = async () => ok(null)
    assert.deepEqual(await queryDepartmentById({ findDepartment })(DEPARTMENT.id), err('DepartmentNotFound'))
  })

  it('ポートのエラーをそのまま返す', async () => {
    const findDepartment: FindDepartmentPort = async () => err('StoreUnavailable')
    assert.deepEqual(await queryDepartmentById({ findDepartment })(DEPARTMENT.id), err('StoreUnavailable'))
  })

  it('引数の ID をポートに渡す', async () => {
    let receivedId: DepartmentId | undefined
    const findDepartment: FindDepartmentPort = async (departmentId) => {
      receivedId = departmentId
      return ok(DEPARTMENT)
    }
    await queryDepartmentById({ findDepartment })(DEPARTMENT.id)
    assert.deepEqual(receivedId, DEPARTMENT.id)
  })
})
