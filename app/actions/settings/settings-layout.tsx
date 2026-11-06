import type { Handle, RemixNode } from 'remix/component'
import { css } from 'remix/component'

import { routes } from '../../routes.ts'
import { Document } from '../document.tsx'

interface SettingsLayoutProps {
  title: string
  current: 'accounts'
  children: RemixNode
}

export function SettingsLayout(handle: Handle<SettingsLayoutProps>) {
  return () => {
    const { title, current, children } = handle.props
    return (
      <Document title={title}>
        <main mix={css({ maxWidth: '800px', margin: '0 auto', padding: '32px 20px', fontFamily: 'sans-serif' })}>
          <header>
            <h1>設定</h1>
            <nav aria-label="設定">
              <a href={routes.settings.accounts.index.href()} aria-current={current === 'accounts' ? 'page' : undefined}>勘定科目</a>
            </nav>
          </header>
          <div mix={css({ marginTop: '32px' })}>{children}</div>
        </main>
      </Document>
    )
  }
}
