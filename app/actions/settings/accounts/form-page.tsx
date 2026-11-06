import type { Handle } from 'remix/component'
import { css } from 'remix/component'

import type { ChangeAccountError } from '../../../domain/account/workflow/change-account.ts'
import type { RegisterAccountError } from '../../../domain/account/workflow/register-account.ts'
import { routes } from '../../../routes.ts'
import { SettingsLayout } from '../settings-layout.tsx'

interface AccountFormPageProps {
  mode: 'create' | 'edit'
  accountId?: number
  values: { code: string; name: string }
  errors?: readonly RegisterAccountError[] | readonly ChangeAccountError[]
}

type FormError = Exclude<RegisterAccountError | ChangeAccountError, 'StoreUnavailable' | 'StoredAccountMalformed' | 'AccountNotFound'>
const ERROR_MESSAGES: Record<FormError, { field: 'code' | 'name'; message: string }> = {
  AccountCodeEmpty: { field: 'code', message: '科目コードを入力してください' },
  AccountCodeNotDigits: { field: 'code', message: '科目コードは半角数字で入力してください' },
  AccountCodeTooLong: { field: 'code', message: '科目コードは10文字以内で入力してください' },
  AccountCodeAlreadyUsed: { field: 'code', message: 'この科目コードは既に使われています' },
  AccountNameEmpty: { field: 'name', message: '科目名を入力してください' },
  AccountNameTooLong: { field: 'name', message: '科目名は50文字以内で入力してください' },
  AccountNameAlreadyUsed: { field: 'name', message: 'この科目名は既に使われています' },
}

export function AccountFormPage(handle: Handle<AccountFormPageProps>) {
  return () => {
    const { mode, accountId, values, errors = [] } = handle.props
    const title = mode === 'create' ? '勘定科目の追加' : '勘定科目の編集'
    const action = mode === 'create'
      ? routes.settings.accounts.create.href()
      : routes.settings.accounts.update.href({ id: String(accountId) })
    const messages = errors.flatMap((error) => error in ERROR_MESSAGES ? [ERROR_MESSAGES[error as FormError]] : [])
    const codeMessages = messages.filter((item) => item.field === 'code')
    const nameMessages = messages.filter((item) => item.field === 'name')
    return (
      <SettingsLayout title={title} current="accounts">
        <h2>{title}</h2>
        <form method="post" action={action} mix={css({ display: 'grid', gap: '16px', maxWidth: '400px' })}>
          <div>
            <label htmlFor="account-code">科目コード</label><br />
            <input id="account-code" name="code" value={values.code} aria-invalid={codeMessages.length > 0 ? 'true' : undefined} aria-describedby={codeMessages.length > 0 ? 'code-errors' : undefined} />
            {codeMessages.length > 0 && <div id="code-errors">{codeMessages.map((item) => <p key={item.message}>{item.message}</p>)}</div>}
          </div>
          <div>
            <label htmlFor="account-name">科目名</label><br />
            <input id="account-name" name="name" value={values.name} aria-invalid={nameMessages.length > 0 ? 'true' : undefined} aria-describedby={nameMessages.length > 0 ? 'name-errors' : undefined} />
            {nameMessages.length > 0 && <div id="name-errors">{nameMessages.map((item) => <p key={item.message}>{item.message}</p>)}</div>}
          </div>
          <button type="submit">{mode === 'create' ? '登録' : '更新'}</button>
        </form>
        <p><a href={routes.settings.accounts.index.href()}>一覧へ戻る</a></p>
      </SettingsLayout>
    )
  }
}
