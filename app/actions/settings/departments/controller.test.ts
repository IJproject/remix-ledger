import * as assert from 'remix/assert'
import { sql } from 'remix/data-table'
import { beforeEach, describe, it } from 'remix/test'

import { db } from '../../../external/db/client.ts'
import { departmentsTable } from '../../../external/db/tables.ts'
import { router } from '../../../router.ts'
import { routes } from '../../../routes.ts'

const ORIGIN = 'http://localhost'

beforeEach(async () => {
  await db.exec(sql`delete from departments`)
})

function request(path: string, fields?: Record<string, string>): Request {
  if (!fields) return new Request(new URL(path, ORIGIN))
  const body = new FormData()
  for (const [name, value] of Object.entries(fields)) body.set(name, value)
  return new Request(new URL(path, ORIGIN), { method: 'POST', body })
}

async function insert(code: string, name: string) {
  return db.create(departmentsTable, { code, name }, { returnRow: true })
}

describe('settings departments controller', () => {
  it('表示と送信の URL が同じ', () => {
    assert.equal(routes.settings.departments.create.href(), routes.settings.departments.new.href())
    assert.equal(routes.settings.departments.update.href({ id: '1' }), routes.settings.departments.edit.href({ id: '1' }))
  })

  it('GET 一覧に登録済みの部門を表示する', async () => {
    assert.equal(routes.settings.departments.index.href(), '/settings/departments')
    await insert('200', '営業部')
    const response = await router.fetch(request(routes.settings.departments.index.href()))
    assert.equal(response.status, 200)
    assert.match(await response.text(), /営業部/)
  })

  it('GET new は追加フォームを返す', async () => {
    const response = await router.fetch(request(routes.settings.departments.new.href()))
    assert.equal(response.status, 200)
  })

  it('POST create で追加して一覧へリダイレクトする', async () => {
    const response = await router.fetch(request(routes.settings.departments.create.href(), { code: '200', name: '営業部' }))
    assert.equal(response.status, 303)
    assert.equal(response.headers.get('Location'), routes.settings.departments.index.href())
    const rows = await db.findMany(departmentsTable)
    assert.equal(rows.length, 1)
  })

  it('POST create のコード空は 400 で保存しない', async () => {
    const response = await router.fetch(request(routes.settings.departments.create.href(), { code: '', name: '営業部' }))
    assert.equal(response.status, 400)
    assert.equal((await db.findMany(departmentsTable)).length, 0)
  })

  it('POST create のコード重複は 400 でエラーを表示する', async () => {
    await insert('200', '営業部')
    const response = await router.fetch(request(routes.settings.departments.create.href(), { code: '200', name: '管理部' }))
    assert.equal(response.status, 400)
    assert.match(await response.text(), /この部門コードは既に使われています/)
  })

  it('GET edit に既存値を表示する', async () => {
    const department = await insert('200', '営業部')
    const response = await router.fetch(request(routes.settings.departments.edit.href({ id: String(department.id) })))
    assert.equal(response.status, 200)
    const html = await response.text()
    assert.match(html, /営業部/)
    assert.match(html, /200/)
  })

  it('GET edit の存在しない ID と不正な ID は 404', async () => {
    for (const id of ['9999', 'abc']) {
      const response = await router.fetch(request(routes.settings.departments.edit.href({ id })))
      assert.equal(response.status, 404)
    }
  })

  it('POST update で更新して一覧へリダイレクトする', async () => {
    const department = await insert('200', '営業部')
    const response = await router.fetch(request(routes.settings.departments.update.href({ id: String(department.id) }), { code: '200', name: '営業本部' }))
    assert.equal(response.status, 303)
    assert.equal(response.headers.get('Location'), routes.settings.departments.index.href())
    const updated = await db.find(departmentsTable, department.id)
    assert.equal(updated?.name, '営業本部')
    assert.ok(updated && updated.updated_at instanceof Date && updated.created_at instanceof Date && updated.updated_at >= updated.created_at)
  })

  it('POST update の名前重複は 400', async () => {
    const department = await insert('200', '営業部')
    await insert('400', '管理部')
    const response = await router.fetch(request(routes.settings.departments.update.href({ id: String(department.id) }), { code: '200', name: '管理部' }))
    assert.equal(response.status, 400)
  })

  it('POST update の存在しない ID は 404', async () => {
    const response = await router.fetch(request(routes.settings.departments.update.href({ id: '9999' }), { code: '200', name: '営業部' }))
    assert.equal(response.status, 404)
  })
})
