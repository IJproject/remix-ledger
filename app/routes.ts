import { get, post, route } from 'remix/routes'

export const routes = route({
  assets: get('/assets/*path'),
  home: '/',
  settings: {
    accounts: route('/settings/accounts', {
      index: get('/'),
      new: get('/new'),
      create: post('/new'),
      edit: get('/:id/edit'),
      update: post('/:id/edit'),
    }),
    departments: route('/settings/departments', {
      index: get('/'),
      new: get('/new'),
      create: post('/new'),
      edit: get('/:id/edit'),
      update: post('/:id/edit'),
    }),
  },
})
