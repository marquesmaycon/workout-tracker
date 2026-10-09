import { Link } from '@tanstack/react-router'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldDescription } from '@/components/ui/field'

type VerifyEmailResultProps = {
  error?: string
}

export function VerifyEmailResult({ error }: VerifyEmailResultProps) {
  if (error) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Link inválido</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldDescription className="text-center">
            O link de confirmação é inválido ou expirou. Você pode solicitar um novo link pelo painel.{' '}
            <Link to="/dashboard">Ir para o painel</Link>
          </FieldDescription>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">E-mail confirmado</CardTitle>
      </CardHeader>
      <CardContent>
        <FieldDescription className="text-center">
          Seu e-mail foi confirmado com sucesso. <Link to="/dashboard">Ir para o painel</Link>
        </FieldDescription>
      </CardContent>
    </Card>
  )
}
