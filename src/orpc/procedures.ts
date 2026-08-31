import { ORPCError, os } from '@orpc/server'

import { auth } from '@/lib/auth'

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
