import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const from = process.env.EMAIL_FROM ?? 'Workout Tracker <no-reply@mklly.com.br>'

function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

type SendResetPasswordEmailParams = {
  to: string
  name: string
  url: string
}

export async function sendResetPasswordEmail({ to, name, url }: SendResetPasswordEmailParams) {
  const { error } = await resend.emails.send({
    from,
    to,
    subject: 'Redefinição de senha',
    text: [
      `Olá, ${name}!`,
      'Recebemos uma solicitação para redefinir a senha da sua conta.',
      'Acesse o link abaixo para escolher uma nova senha (válido por 1 hora):',
      url,
      'Se você não fez essa solicitação, ignore este e-mail.',
    ].join('\n\n'),
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #111;">
        <p>Olá, ${escapeHtml(name)}!</p>
        <p>Recebemos uma solicitação para redefinir a senha da sua conta.</p>
        <p>
          <a href="${url}" style="display: inline-block; padding: 10px 20px; background: #111; color: #fff; text-decoration: none; border-radius: 6px;">
            Redefinir senha
          </a>
        </p>
        <p style="font-size: 14px; color: #555;">O link é válido por 1 hora. Se você não fez essa solicitação, ignore este e-mail.</p>
      </div>
    `,
  })

  if (error) {
    console.error('Falha ao enviar e-mail de redefinição de senha:', error)
  }
}
