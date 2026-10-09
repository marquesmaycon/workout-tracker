import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { admin } from 'better-auth/plugins'

import { tanstackStartCookies } from '@/lib/auth-cookies'
import { prisma } from '@/lib/db'
import { sendResetPasswordEmail, sendVerificationEmail } from '@/lib/email'
import { ac, roles } from '@/lib/permissions'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      void sendResetPasswordEmail({ to: user.email, name: user.name, url })
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      void sendVerificationEmail({ to: user.email, name: user.name, url })
    },
  },
  plugins: [admin({ ac, roles }), tanstackStartCookies()],
  advanced: {
    database: {
      joins: true,
    },
  },
})
