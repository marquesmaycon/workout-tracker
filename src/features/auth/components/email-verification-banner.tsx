import { getRouteApi } from '@tanstack/react-router'
import { MailWarningIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'

const dashboardRoute = getRouteApi('/(private)/_dashboard')

export function EmailVerificationBanner() {
  const { user } = dashboardRoute.useRouteContext()
  const [isSending, setIsSending] = useState(false)

  if (user.emailVerified) return null

  async function handleResend() {
    setIsSending(true)
    await authClient.sendVerificationEmail(
      { email: user.email, callbackURL: '/verify-email' },
      {
        onSuccess: () => {
          toast.success('Enviamos um novo link de confirmação para o seu e-mail.')
        },
        onError: ({ error }) => {
          toast.error(error.message)
        },
      },
    )
    setIsSending(false)
  }

  return (
    <div className="bg-muted/60 flex flex-col gap-3 rounded-lg border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3 text-sm">
        <MailWarningIcon aria-hidden="true" className="text-primary mt-0.5 size-4 shrink-0" />
        <p>
          Confirme seu e-mail <span className="font-medium">{user.email}</span> para garantir o acesso à sua conta.
        </p>
      </div>
      <Button size="sm" variant="outline" disabled={isSending} onClick={handleResend}>
        {isSending ? 'Enviando...' : 'Reenviar e-mail'}
      </Button>
    </div>
  )
}
