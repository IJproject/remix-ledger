import { createController } from 'remix/router'
import { redirect } from 'remix/response/redirect'

import { AccountCode, AccountId, AccountName } from '../../../domain/account/model/primitive.ts'
import { queryAccountById } from '../../../domain/account/query/query-account-by-id.ts'
import { queryAccounts } from '../../../domain/account/query/query-accounts.ts'
import { changeAccount } from '../../../domain/account/workflow/change-account.ts'
import { registerAccount } from '../../../domain/account/workflow/register-account.ts'
import { findAccountAdapter, insertAccountAdapter, listAccountsAdapter, updateAccountAdapter } from '../../../external/db/adapters/account.ts'
import { routes } from '../../../routes.ts'
import { AccountFormPage } from './form-page.tsx'
import { AccountListPage } from './list-page.tsx'

const listAccounts = queryAccounts({ listAccounts: listAccountsAdapter })
const findAccount = queryAccountById({ findAccount: findAccountAdapter })
const register = registerAccount({ insertAccount: insertAccountAdapter })
const change = changeAccount({ updateAccount: updateAccountAdapter })

export default createController(routes.settings.accounts, {
  actions: {
    async index(context) {
      const result = await listAccounts()
      if (!result.ok) return new Response('Internal Server Error', { status: 500 })
      return context.render(<AccountListPage accounts={result.value} />)
    },
    new(context) {
      return context.render(<AccountFormPage mode="create" values={{ code: '', name: '' }} />)
    },
    async create(context) {
      const input = { code: readText(context.formData, 'code'), name: readText(context.formData, 'name') }
      const result = await register({ input })
      if (result.ok) return redirect(routes.settings.accounts.index.href(), 303)
      if (hasStoreError(result.error)) return new Response('Internal Server Error', { status: 500 })
      return context.render(<AccountFormPage mode="create" values={input} errors={result.error} />, { status: 400 })
    },
    async edit(context) {
      const id = AccountId.create(Number(context.params.id))
      if (!id.ok) return new Response('Not Found', { status: 404 })
      const result = await findAccount(id.value)
      if (!result.ok && result.error === 'AccountNotFound') return new Response('Not Found', { status: 404 })
      if (!result.ok) return new Response('Internal Server Error', { status: 500 })
      const account = result.value
      return context.render(<AccountFormPage mode="edit" accountId={AccountId.value(account.id)} values={{ code: AccountCode.value(account.code), name: AccountName.value(account.name) }} />)
    },
    async update(context) {
      const id = AccountId.create(Number(context.params.id))
      if (!id.ok) return new Response('Not Found', { status: 404 })
      const input = { code: readText(context.formData, 'code'), name: readText(context.formData, 'name') }
      const result = await change({ id: id.value, input })
      if (result.ok) return redirect(routes.settings.accounts.index.href(), 303)
      if (result.error.includes('AccountNotFound')) return new Response('Not Found', { status: 404 })
      if (hasStoreError(result.error)) return new Response('Internal Server Error', { status: 500 })
      return context.render(<AccountFormPage mode="edit" accountId={AccountId.value(id.value)} values={input} errors={result.error} />, { status: 400 })
    },
  },
})

function readText(formData: FormData, name: string): string {
  const value = formData.get(name)
  return typeof value === 'string' ? value : ''
}

function hasStoreError(errors: readonly string[]): boolean {
  return errors.includes('StoreUnavailable') || errors.includes('StoredAccountMalformed')
}
