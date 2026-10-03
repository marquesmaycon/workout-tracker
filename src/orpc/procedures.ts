import { ORPCError, os } from '@orpc/server'

import { auth } from '@/lib/auth'
import type { Permissions } from '@/lib/permissions'
import { hasPermission } from '@/lib/permissions'

type ORPCContext = {
  headers: Headers
}

export const publicProcedure = os.$context<ORPCContext>()

export const authProcedure = publicProcedure.use(
  async ({ context: { headers }, next }) => {
    const session = await auth.api.getSession({ headers })

    if (!session) {
      throw new ORPCError('UNAUTHORIZED')
    }

    return next({
      context: { session, user: session.user },
    })
  },
)

export const permissionProcedure = (permissions: Permissions) =>
  authProcedure.use(({ context: { user }, next }) => {
    if (!hasPermission(user.role, permissions)) {
      throw new ORPCError('FORBIDDEN')
    }

    return next()
  })
