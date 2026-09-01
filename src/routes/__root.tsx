import type { QueryClient } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  HeadContent,
  Link,
} from '@tanstack/react-router'

import { Providers } from '@/components/providers'

import appCss from '../styles.css?url'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
})

function NotFound() {
  return (
    <main className="page-wrap flex min-h-screen items-center justify-center py-12">
      <section className="max-w-md text-center">
        <p className="island-kicker">404</p>
        <h1 className="display-title mt-3 text-3xl font-bold text-[var(--sea-ink)]">
          Page not found
        </h1>
        <p className="mt-3 text-sm text-[var(--sea-ink-soft)]">
          The page you are looking for does not exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium text-white"
        >
          Go home
        </Link>
      </section>
    </main>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-svh flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
