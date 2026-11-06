import type { Handle } from 'remix/component'
import { css } from 'remix/component'

import type { ChangeDepartmentError } from '../../../domain/department/workflow/change-department.ts'
import type { RegisterDepartmentError } from '../../../domain/department/workflow/register-department.ts'
import { routes } from '../../../routes.ts'
import { SettingsLayout } from '../settings-layout.tsx'

interface DepartmentFormPageProps {
  mode: 'create' | 'edit'
  departmentId?: number
  values: { code: string; name: string }
  errors?: readonly RegisterDepartmentError[] | readonly ChangeDepartmentError[]
}

type FormError = Exclude<RegisterDepartmentError | ChangeDepartmentError, 'StoreUnavailable' | 'StoredDepartmentMalformed' | 'DepartmentNotFound'>
const ERROR_MESSAGES: Record<FormError, { field: 'code' | 'name'; message: string }> = {
  DepartmentCodeEmpty: { field: 'code', message: '部門コードを入力してください' },
  DepartmentCodeNotDigits: { field: 'code', message: '部門コードは半角数字で入力してください' },
  DepartmentCodeTooLong: { field: 'code', message: '部門コードは10文字以内で入力してください' },
  DepartmentCodeAlreadyUsed: { field: 'code', message: 'この部門コードは既に使われています' },
  DepartmentNameEmpty: { field: 'name', message: '部門名を入力してください' },
  DepartmentNameTooLong: { field: 'name', message: '部門名は50文字以内で入力してください' },
  DepartmentNameAlreadyUsed: { field: 'name', message: 'この部門名は既に使われています' },
}

export function DepartmentFormPage(handle: Handle<DepartmentFormPageProps>) {
  return () => {
    const { mode, departmentId, values, errors = [] } = handle.props
    const title = mode === 'create' ? '部門の追加' : '部門の編集'
    const action = mode === 'create'
      ? routes.settings.departments.create.href()
      : routes.settings.departments.update.href({ id: String(departmentId) })
    const messages = errors.flatMap((error) => error in ERROR_MESSAGES ? [ERROR_MESSAGES[error as FormError]] : [])
    const codeMessages = messages.filter((item) => item.field === 'code')
    const nameMessages = messages.filter((item) => item.field === 'name')
    return (
      <SettingsLayout title={title} current="departments">
        <h2>{title}</h2>
        <form method="post" action={action} mix={css({ display: 'grid', gap: '16px', maxWidth: '400px' })}>
          <div>
            <label htmlFor="department-code">部門コード</label><br />
            <input id="department-code" name="code" value={values.code} aria-invalid={codeMessages.length > 0 ? 'true' : undefined} aria-describedby={codeMessages.length > 0 ? 'code-errors' : undefined} />
            {codeMessages.length > 0 && <div id="code-errors">{codeMessages.map((item) => <p key={item.message}>{item.message}</p>)}</div>}
          </div>
          <div>
            <label htmlFor="department-name">部門名</label><br />
            <input id="department-name" name="name" value={values.name} aria-invalid={nameMessages.length > 0 ? 'true' : undefined} aria-describedby={nameMessages.length > 0 ? 'name-errors' : undefined} />
            {nameMessages.length > 0 && <div id="name-errors">{nameMessages.map((item) => <p key={item.message}>{item.message}</p>)}</div>}
          </div>
          <button type="submit">{mode === 'create' ? '登録' : '更新'}</button>
        </form>
        <p><a href={routes.settings.departments.index.href()}>一覧へ戻る</a></p>
      </SettingsLayout>
    )
  }
}
