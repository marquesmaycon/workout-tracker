import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'

import { tanstackStartCookies } from '@/lib/auth-cookies'
import { prisma } from '@/lib/db'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [tanstackStartCookies()],
  advanced: {
    database: {
      joins: true,
    },
  },
})
