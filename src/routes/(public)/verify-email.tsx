import { createFileRoute, Link } from '@tanstack/react-router'
import z from 'zod'

import { Logo } from '@/components/layout/logo'
import { VerifyEmailResult } from '@/features/auth/components/verify-email-result'

const verifyEmailSearchSchema = z.object({
  error: z.string().optional(),
})

export const Route = createFileRoute('/(public)/verify-email')({
  validateSearch: verifyEmailSearchSchema,
  component: RouteComponent,
})

function RouteComponent() {
  const { error } = Route.useSearch()

  return (
    <div className="bg-background flex min-h-svh flex-col">
      <div className="bg-muted/35 flex flex-1 flex-col items-center justify-center gap-6 p-6 md:p-10">
        <main className="flex w-full max-w-sm flex-col gap-6">
          <Link to="/" className="flex items-center gap-2 self-center font-medium">
            <Logo className="size-7" />
            Workout Tracker
          </Link>

          <VerifyEmailResult error={error} />
        </main>
      </div>
    </div>
  )
}
