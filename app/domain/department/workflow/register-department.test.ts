import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { err, ok } from '../../building-blocks.ts'
import type { Department } from '../model/entity.ts'
import { DepartmentCode, DepartmentId, DepartmentName, CreatedAt, UpdatedAt } from '../model/primitive.ts'
import type { InsertDepartmentPort } from '../port.ts'
import { registerDepartment } from './register-department.ts'

const id = DepartmentId.create(1)
const code = DepartmentCode.create('200')
const name = DepartmentName.create('営業部')
const createdAt = CreatedAt.create(new Date('2026-11-04T09:00:00Z'))
const updatedAt = UpdatedAt.create(new Date('2026-11-04T09:00:00Z'))
if (!id.ok || !code.ok || !name.ok || !createdAt.ok || !updatedAt.ok) throw new Error('Invalid test fixture')
const DEPARTMENT: Department = { id: id.value, code: code.value, name: name.value, createdAt: createdAt.value, updatedAt: updatedAt.value }

/** @see {@link registerDepartment} */
describe('registerDepartment', () => {
  it('追加した部門をイベントで返す', async () => {
    const insertDepartment: InsertDepartmentPort = async () => ok(DEPARTMENT)
    assert.deepEqual(await registerDepartment({ insertDepartment })({ input: { code: '200', name: '営業部' } }), ok({ department: DEPARTMENT }))
  })

  it('入力が不正ならポートを呼ばない', async () => {
    let called = false
    const insertDepartment: InsertDepartmentPort = async () => { called = true; return ok(DEPARTMENT) }
    assert.deepEqual(await registerDepartment({ insertDepartment })({ input: { code: '', name: '' } }), err(['DepartmentCodeEmpty', 'DepartmentNameEmpty']))
    assert.equal(called, false)
  })

  it('保存エラーを配列で返す', async () => {
    const insertDepartment: InsertDepartmentPort = async () => err('DepartmentCodeAlreadyUsed')
    assert.deepEqual(await registerDepartment({ insertDepartment })({ input: { code: '200', name: '営業部' } }), err(['DepartmentCodeAlreadyUsed']))
  })
})
