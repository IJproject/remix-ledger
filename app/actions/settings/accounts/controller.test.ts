import * as assert from 'remix/assert'
import { sql } from 'remix/data-table'
import { beforeEach, describe, it } from 'remix/test'

import { db } from '../../../external/db/client.ts'
import { accountsTable } from '../../../external/db/tables.ts'
import { router } from '../../../router.ts'
import { routes } from '../../../routes.ts'

const ORIGIN = 'http://localhost'

beforeEach(async () => {
  await db.exec(sql`delete from accounts`)
})

function request(path: string, fields?: Record<string, string>): Request {
  if (!fields) return new Request(new URL(path, ORIGIN))
  const body = new FormData()
  for (const [name, value] of Object.entries(fields)) body.set(name, value)
  return new Request(new URL(path, ORIGIN), { method: 'POST', body })
}

async function insert(code: string, name: string) {
  return db.create(accountsTable, { code, name }, { returnRow: true })
}

describe('settings accounts controller', () => {
  it('表示と送信の URL が同じ', () => {
    assert.equal(routes.settings.accounts.create.href(), routes.settings.accounts.new.href())
    assert.equal(routes.settings.accounts.update.href({ id: '1' }), routes.settings.accounts.edit.href({ id: '1' }))
  })

  it('GET 一覧に登録済みの科目を表示する', async () => {
    assert.equal(routes.settings.accounts.index.href(), '/settings/accounts')
    await insert('1110', '現金')
    const response = await router.fetch(request(routes.settings.accounts.index.href()))
    assert.equal(response.status, 200)
    assert.match(await response.text(), /現金/)
  })

  it('GET new は追加フォームを返す', async () => {
    const response = await router.fetch(request(routes.settings.accounts.new.href()))
    assert.equal(response.status, 200)
  })

  it('POST create で追加して一覧へリダイレクトする', async () => {
    const response = await router.fetch(request(routes.settings.accounts.create.href(), { code: '1110', name: '現金' }))
    assert.equal(response.status, 303)
    assert.equal(response.headers.get('Location'), routes.settings.accounts.index.href())
    const rows = await db.findMany(accountsTable)
    assert.equal(rows.length, 1)
  })

  it('POST create のコード空は 400 で保存しない', async () => {
    const response = await router.fetch(request(routes.settings.accounts.create.href(), { code: '', name: '現金' }))
    assert.equal(response.status, 400)
    assert.equal((await db.findMany(accountsTable)).length, 0)
  })

  it('POST create のコード重複は 400 でエラーを表示する', async () => {
    await insert('1110', '現金')
    const response = await router.fetch(request(routes.settings.accounts.create.href(), { code: '1110', name: '普通預金' }))
    assert.equal(response.status, 400)
    assert.match(await response.text(), /この科目コードは既に使われています/)
  })

  it('GET edit に既存値を表示する', async () => {
    const account = await insert('1110', '現金')
    const response = await router.fetch(request(routes.settings.accounts.edit.href({ id: String(account.id) })))
    assert.equal(response.status, 200)
    const html = await response.text()
    assert.match(html, /現金/)
    assert.match(html, /1110/)
  })

  it('GET edit の存在しない ID と不正な ID は 404', async () => {
    for (const id of ['9999', 'abc']) {
      const response = await router.fetch(request(routes.settings.accounts.edit.href({ id })))
      assert.equal(response.status, 404)
    }
  })

  it('POST update で更新して一覧へリダイレクトする', async () => {
    const account = await insert('1110', '現金')
    const response = await router.fetch(request(routes.settings.accounts.update.href({ id: String(account.id) }), { code: '1110', name: '現金及び預金' }))
    assert.equal(response.status, 303)
    assert.equal(response.headers.get('Location'), routes.settings.accounts.index.href())
    const updated = await db.find(accountsTable, account.id)
    assert.equal(updated?.name, '現金及び預金')
    assert.ok(updated && updated.updated_at instanceof Date && updated.created_at instanceof Date && updated.updated_at >= updated.created_at)
  })

  it('POST update の名前重複は 400', async () => {
    const account = await insert('1110', '現金')
    await insert('1120', '普通預金')
    const response = await router.fetch(request(routes.settings.accounts.update.href({ id: String(account.id) }), { code: '1110', name: '普通預金' }))
    assert.equal(response.status, 400)
  })

  it('POST update の存在しない ID は 404', async () => {
    const response = await router.fetch(request(routes.settings.accounts.update.href({ id: '9999' }), { code: '1110', name: '現金' }))
    assert.equal(response.status, 404)
  })
})
