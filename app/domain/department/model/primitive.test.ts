import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { DepartmentCode, DepartmentId, DepartmentName, CreatedAt, UpdatedAt } from './primitive.ts'

/** @see {@link DepartmentId.create} */
describe('DepartmentId.create', () => {
  const TEST_CASES = [
    { title: '1 を受け付ける', input: 1, expected: { ok: true, value: 1 } },
    { title: '0 は受け付けない', input: 0, expected: { ok: false, error: 'DepartmentIdNotPositive' } },
    { title: '負の数は受け付けない', input: -1, expected: { ok: false, error: 'DepartmentIdNotPositive' } },
    { title: '小数は受け付けない', input: 1.5, expected: { ok: false, error: 'DepartmentIdNotInteger' } },
    { title: 'NaN は受け付けない', input: Number.NaN, expected: { ok: false, error: 'DepartmentIdNotInteger' } },
  ]

  for (const testCase of TEST_CASES) {
    it(testCase.title, () => assert.deepEqual(DepartmentId.create(testCase.input), testCase.expected))
  }
})

/** @see {@link DepartmentCode.create} */
describe('DepartmentCode.create', () => {
  const TEST_CASES = [
    { title: '数字を受け付ける', input: '200', expected: { ok: true, value: '200' } },
    { title: '前後の空白を除く', input: ' 200 ', expected: { ok: true, value: '200' } },
    { title: '空文字は受け付けない', input: '', expected: { ok: false, error: 'DepartmentCodeEmpty' } },
    { title: '空白のみは受け付けない', input: '   ', expected: { ok: false, error: 'DepartmentCodeEmpty' } },
    { title: '英字は受け付けない', input: '2a0', expected: { ok: false, error: 'DepartmentCodeNotDigits' } },
    { title: '全角数字は受け付けない', input: '２００', expected: { ok: false, error: 'DepartmentCodeNotDigits' } },
    { title: '10 桁を受け付ける', input: '1234567890', expected: { ok: true, value: '1234567890' } },
    { title: '11 桁は受け付けない', input: '12345678901', expected: { ok: false, error: 'DepartmentCodeTooLong' } },
  ]

  for (const testCase of TEST_CASES) {
    it(testCase.title, () => assert.deepEqual(DepartmentCode.create(testCase.input), testCase.expected))
  }
})

/** @see {@link DepartmentName.create} */
describe('DepartmentName.create', () => {
  const TEST_CASES = [
    { title: '前後の空白を除く', input: ' 営業部 ', expected: { ok: true, value: '営業部' } },
    { title: '空文字は受け付けない', input: '', expected: { ok: false, error: 'DepartmentNameEmpty' } },
    { title: '50 文字を受け付ける', input: 'あ'.repeat(50), expected: { ok: true, value: 'あ'.repeat(50) } },
    { title: '51 文字は受け付けない', input: 'あ'.repeat(51), expected: { ok: false, error: 'DepartmentNameTooLong' } },
    { title: '絵文字を1文字として数える', input: 'あ'.repeat(49) + '😀', expected: { ok: true, value: 'あ'.repeat(49) + '😀' } },
  ]

  for (const testCase of TEST_CASES) {
    it(testCase.title, () => assert.deepEqual(DepartmentName.create(testCase.input), testCase.expected))
  }
})

/** @see {@link CreatedAt.create} */
describe('CreatedAt.create', () => {
  const TEST_CASES = [
    { title: '正しい日時を受け付ける', input: new Date('2026-11-04T09:00:00Z'), expected: { ok: true, value: new Date('2026-11-04T09:00:00Z') } },
    { title: '不正な日時は受け付けない', input: new Date('invalid'), expected: { ok: false, error: 'CreatedAtInvalid' } },
  ]

  for (const testCase of TEST_CASES) {
    it(testCase.title, () => assert.deepEqual(CreatedAt.create(testCase.input), testCase.expected))
  }
})

/** @see {@link UpdatedAt.create} */
describe('UpdatedAt.create', () => {
  const TEST_CASES = [
    { title: '正しい日時を受け付ける', input: new Date('2026-11-04T09:00:00Z'), expected: { ok: true, value: new Date('2026-11-04T09:00:00Z') } },
    { title: '不正な日時は受け付けない', input: new Date('invalid'), expected: { ok: false, error: 'UpdatedAtInvalid' } },
  ]

  for (const testCase of TEST_CASES) {
    it(testCase.title, () => assert.deepEqual(UpdatedAt.create(testCase.input), testCase.expected))
  }
})
