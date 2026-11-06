import type { Handle } from 'remix/component'
import { css } from 'remix/component'

import type { Department } from '../../../domain/department/model/entity.ts'
import { DepartmentCode, DepartmentId, DepartmentName } from '../../../domain/department/model/primitive.ts'
import { routes } from '../../../routes.ts'
import { SettingsLayout } from '../settings-layout.tsx'

export function DepartmentListPage(handle: Handle<{ departments: Department[] }>) {
  return () => {
    const { departments } = handle.props
    return (
      <SettingsLayout title="部門" current="departments">
        <h2>部門</h2>
        <p><a href={routes.settings.departments.new.href()}>追加</a></p>
        {departments.length === 0 ? (
          <p>部門が登録されていません</p>
        ) : (
          <table mix={css({ width: '100%', borderCollapse: 'collapse', '& th, & td': { borderBottom: '1px solid #999', padding: '8px', textAlign: 'left' } })}>
            <thead><tr><th scope="col">部門コード</th><th scope="col">部門名</th><th scope="col">操作</th></tr></thead>
            <tbody>
              {departments.map((department) => (
                <tr key={DepartmentId.value(department.id)}>
                  <td>{DepartmentCode.value(department.code)}</td>
                  <td>{DepartmentName.value(department.name)}</td>
                  <td><a href={routes.settings.departments.edit.href({ id: String(DepartmentId.value(department.id)) })}>編集</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </SettingsLayout>
    )
  }
}
