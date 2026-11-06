import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { err, ok } from '../../building-blocks.ts'
import type { Department } from '../model/entity.ts'
import { DepartmentCode, DepartmentId, DepartmentName, CreatedAt, UpdatedAt } from '../model/primitive.ts'
import type { ListDepartmentsPort } from '../port.ts'
import { queryDepartments } from './query-departments.ts'

const id = DepartmentId.create(1)
const code = DepartmentCode.create('200')
const name = DepartmentName.create('営業部')
const createdAt = CreatedAt.create(new Date('2026-11-04T09:00:00Z'))
const updatedAt = UpdatedAt.create(new Date('2026-11-04T09:00:00Z'))
if (!id.ok || !code.ok || !name.ok || !createdAt.ok || !updatedAt.ok) throw new Error('Invalid test fixture')
const DEPARTMENT: Department = { id: id.value, code: code.value, name: name.value, createdAt: createdAt.value, updatedAt: updatedAt.value }

/** @see {@link queryDepartments} */
describe('queryDepartments', () => {
  it('ポートの一覧をそのまま返す', async () => {
    const listDepartments: ListDepartmentsPort = async () => ok([DEPARTMENT])
    assert.deepEqual(await queryDepartments({ listDepartments })(), ok([DEPARTMENT]))
  })

  it('ポートのエラーをそのまま返す', async () => {
    const listDepartments: ListDepartmentsPort = async () => err('StoreUnavailable')
    assert.deepEqual(await queryDepartments({ listDepartments })(), err('StoreUnavailable'))
  })
})
