import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { err, ok } from '../../building-blocks.ts'
import type { Department } from '../model/entity.ts'
import type { InsertDepartmentPort } from '../port.ts'
import { validateDepartment, type ValidatedDepartment } from './common.ts'
import type { RegisterDepartmentWorkflow } from './register-department.ts'

/** @see {@link validateDepartment} */
describe('validateDepartment', () => {
  const TEST_CASES = [
    { title: '前後の空白を除いて検証する', input: { code: ' 200 ', name: ' 営業部 ' }, expected: ok({ code: '200', name: '営業部' }) },
    { title: '両方不正なら両方のエラーを返す', input: { code: '', name: '' }, expected: err(['DepartmentCodeEmpty', 'DepartmentNameEmpty']) },
    { title: '一方だけ不正ならそのエラーを返す', input: { code: '2a0', name: '営業部' }, expected: err(['DepartmentCodeNotDigits']) },
  ]

  for (const testCase of TEST_CASES) {
    it(testCase.title, () => assert.deepEqual(validateDepartment(testCase.input), testCase.expected))
  }
})

// === 型の保証（npm run typecheck で検証する） ===
declare const department: Department
declare const insertDepartment: InsertDepartmentPort
const typeAssertions = () => {
  // @ts-expect-error 保存済みの Department は検証済みの入力ではない
  insertDepartment(department)
  // @ts-expect-error 検証済みはオブジェクトリテラルで作れない
  const forged: ValidatedDepartment = { code: department.code, name: department.name }
  // @ts-expect-error 理由のない失敗は返せない
  const noReason: RegisterDepartmentWorkflow = async () => err([])
  return { forged, noReason }
}
void typeAssertions
