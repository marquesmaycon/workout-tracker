import { setCookie } from '@tanstack/react-start/server'
import type { BetterAuthPlugin } from 'better-auth'
import { createAuthMiddleware } from 'better-auth/api'
import { parseSetCookieHeader, toCookieOptions } from 'better-auth/cookies'

// Local copy of `tanstackStartCookies` from 'better-auth/tanstack-start'.
// The upstream plugin does `await import('@tanstack/react-start/server')`, and
// that dynamic import makes rolldown emit a broken SSR chunk in the production
// build ("Export 'ssr_exports' is not defined in module"). A static import avoids it.
export const tanstackStartCookies = () =>
  ({
    id: 'tanstack-start-cookies',
    hooks: {
      after: [
        {
          matcher: () => true,
          handler: createAuthMiddleware(async (ctx) => {
            if ('_flag' in ctx && ctx._flag === 'router') return
            const returned = ctx.context.responseHeaders
            if (!(returned instanceof Headers)) return
            const setCookies = returned.get('set-cookie')
            if (!setCookies) return
            parseSetCookieHeader(setCookies).forEach((value, key) => {
              if (!key) return
              try {
                setCookie(key, value.value, toCookieOptions(value))
              } catch {
                // not inside a TanStack Start request context
              }
            })
          }),
        },
      ],
    },
  }) satisfies BetterAuthPlugin
