import { column as c, table } from 'remix/data-table'

export const accountsTable = table({
  name: 'accounts',
  columns: {
    id: c.integer(),
    code: c.text(),
    name: c.text(),
    created_at: c.timestamp({ withTimezone: true }),
    updated_at: c.timestamp({ withTimezone: true }),
  },
  primaryKey: 'id',
  timestamps: true,
})

export const departmentsTable = table({
  name: 'departments',
  columns: {
    id: c.integer(),
    code: c.text(),
    name: c.text(),
    created_at: c.timestamp({ withTimezone: true }),
    updated_at: c.timestamp({ withTimezone: true }),
  },
  primaryKey: 'id',
  timestamps: true,
})
