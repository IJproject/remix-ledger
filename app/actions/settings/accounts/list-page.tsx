import type { Handle } from 'remix/component'
import { css } from 'remix/component'

import type { Account } from '../../../domain/account/model/entity.ts'
import { AccountCode, AccountId, AccountName } from '../../../domain/account/model/primitive.ts'
import { routes } from '../../../routes.ts'
import { SettingsLayout } from '../settings-layout.tsx'

export function AccountListPage(handle: Handle<{ accounts: Account[] }>) {
  return () => {
    const { accounts } = handle.props
    return (
      <SettingsLayout title="勘定科目" current="accounts">
        <h2>勘定科目</h2>
        <p><a href={routes.settings.accounts.new.href()}>追加</a></p>
        {accounts.length === 0 ? (
          <p>勘定科目が登録されていません</p>
        ) : (
          <table mix={css({ width: '100%', borderCollapse: 'collapse', '& th, & td': { borderBottom: '1px solid #999', padding: '8px', textAlign: 'left' } })}>
            <thead><tr><th scope="col">科目コード</th><th scope="col">科目名</th><th scope="col">操作</th></tr></thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={AccountId.value(account.id)}>
                  <td>{AccountCode.value(account.code)}</td>
                  <td>{AccountName.value(account.name)}</td>
                  <td><a href={routes.settings.accounts.edit.href({ id: String(AccountId.value(account.id)) })}>編集</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </SettingsLayout>
    )
  }
}
