import { createRouter, type MiddlewareContext } from 'remix/router'
import { formData } from 'remix/middleware/form-data'
import { render } from 'remix/middleware/render'
import { staticFiles } from 'remix/middleware/static'

import controller from './actions/controller.tsx'
import accountsController from './actions/settings/accounts/controller.tsx'
import { assets } from './assets.ts'
import { loadDatabase } from './middleware/database.ts'
import { routes } from './routes.ts'

const databaseMiddleware = loadDatabase()
const formDataMiddleware = formData()
const renderMiddleware = render({ assets })
type AppContext = MiddlewareContext<[typeof databaseMiddleware, typeof formDataMiddleware, typeof renderMiddleware]>

declare module 'remix' {
  interface RouterTypes {
    context: AppContext
  }
}

export const router = createRouter<AppContext>({
  middleware: [staticFiles('./public', { index: false }), databaseMiddleware, formDataMiddleware, renderMiddleware],
})

router.map(routes, controller)
router.map(routes.settings.accounts, accountsController)
