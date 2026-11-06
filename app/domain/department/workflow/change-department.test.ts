import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { err, ok } from '../../building-blocks.ts'
import type { Department } from '../model/entity.ts'
import { DepartmentCode, DepartmentId, DepartmentName, CreatedAt, UpdatedAt } from '../model/primitive.ts'
import type { UpdateDepartmentPort } from '../port.ts'
import { changeDepartment } from './change-department.ts'

const id = DepartmentId.create(1)
const code = DepartmentCode.create('200')
const name = DepartmentName.create('営業部')
const createdAt = CreatedAt.create(new Date('2026-11-04T09:00:00Z'))
const updatedAt = UpdatedAt.create(new Date('2026-11-04T09:00:00Z'))
if (!id.ok || !code.ok || !name.ok || !createdAt.ok || !updatedAt.ok) throw new Error('Invalid test fixture')
const DEPARTMENT: Department = { id: id.value, code: code.value, name: name.value, createdAt: createdAt.value, updatedAt: updatedAt.value }

/** @see {@link changeDepartment} */
describe('changeDepartment', () => {
  it('変更した部門をイベントで返す', async () => {
    const updateDepartment: UpdateDepartmentPort = async () => ok(DEPARTMENT)
    assert.deepEqual(await changeDepartment({ updateDepartment })({ id: DEPARTMENT.id, input: { code: '200', name: '営業部' } }), ok({ department: DEPARTMENT }))
  })

  it('対象が無ければ DepartmentNotFound を返す', async () => {
    const updateDepartment: UpdateDepartmentPort = async () => ok(null)
    assert.deepEqual(await changeDepartment({ updateDepartment })({ id: DEPARTMENT.id, input: { code: '200', name: '営業部' } }), err(['DepartmentNotFound']))
  })

  it('保存エラーを配列で返す', async () => {
    const updateDepartment: UpdateDepartmentPort = async () => err('DepartmentNameAlreadyUsed')
    assert.deepEqual(await changeDepartment({ updateDepartment })({ id: DEPARTMENT.id, input: { code: '200', name: '営業部' } }), err(['DepartmentNameAlreadyUsed']))
  })
})
