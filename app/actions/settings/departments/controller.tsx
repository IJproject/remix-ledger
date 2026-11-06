import { createController } from 'remix/router'
import { redirect } from 'remix/response/redirect'

import { DepartmentCode, DepartmentId, DepartmentName } from '../../../domain/department/model/primitive.ts'
import { queryDepartmentById } from '../../../domain/department/query/query-department-by-id.ts'
import { queryDepartments } from '../../../domain/department/query/query-departments.ts'
import { changeDepartment } from '../../../domain/department/workflow/change-department.ts'
import { registerDepartment } from '../../../domain/department/workflow/register-department.ts'
import { findDepartmentAdapter, insertDepartmentAdapter, listDepartmentsAdapter, updateDepartmentAdapter } from '../../../external/db/adapters/department.ts'
import { routes } from '../../../routes.ts'
import { DepartmentFormPage } from './form-page.tsx'
import { DepartmentListPage } from './list-page.tsx'

const listDepartments = queryDepartments({ listDepartments: listDepartmentsAdapter })
const findDepartment = queryDepartmentById({ findDepartment: findDepartmentAdapter })
const register = registerDepartment({ insertDepartment: insertDepartmentAdapter })
const change = changeDepartment({ updateDepartment: updateDepartmentAdapter })

export default createController(routes.settings.departments, {
  actions: {
    async index(context) {
      const result = await listDepartments()
      if (!result.ok) return new Response('Internal Server Error', { status: 500 })
      return context.render(<DepartmentListPage departments={result.value} />)
    },
    new(context) {
      return context.render(<DepartmentFormPage mode="create" values={{ code: '', name: '' }} />)
    },
    async create(context) {
      const input = { code: readText(context.formData, 'code'), name: readText(context.formData, 'name') }
      const result = await register({ input })
      if (result.ok) return redirect(routes.settings.departments.index.href(), 303)
      if (hasStoreError(result.error)) return new Response('Internal Server Error', { status: 500 })
      return context.render(<DepartmentFormPage mode="create" values={input} errors={result.error} />, { status: 400 })
    },
    async edit(context) {
      const id = DepartmentId.create(Number(context.params.id))
      if (!id.ok) return new Response('Not Found', { status: 404 })
      const result = await findDepartment(id.value)
      if (!result.ok && result.error === 'DepartmentNotFound') return new Response('Not Found', { status: 404 })
      if (!result.ok) return new Response('Internal Server Error', { status: 500 })
      const department = result.value
      return context.render(<DepartmentFormPage mode="edit" departmentId={DepartmentId.value(department.id)} values={{ code: DepartmentCode.value(department.code), name: DepartmentName.value(department.name) }} />)
    },
    async update(context) {
      const id = DepartmentId.create(Number(context.params.id))
      if (!id.ok) return new Response('Not Found', { status: 404 })
      const input = { code: readText(context.formData, 'code'), name: readText(context.formData, 'name') }
      const result = await change({ id: id.value, input })
      if (result.ok) return redirect(routes.settings.departments.index.href(), 303)
      if (result.error.includes('DepartmentNotFound')) return new Response('Not Found', { status: 404 })
      if (hasStoreError(result.error)) return new Response('Internal Server Error', { status: 500 })
      return context.render(<DepartmentFormPage mode="edit" departmentId={DepartmentId.value(id.value)} values={input} errors={result.error} />, { status: 400 })
    },
  },
})

function readText(formData: FormData, name: string): string {
  const value = formData.get(name)
  return typeof value === 'string' ? value : ''
}

function hasStoreError(errors: readonly string[]): boolean {
  return errors.includes('StoreUnavailable') || errors.includes('StoredDepartmentMalformed')
}
