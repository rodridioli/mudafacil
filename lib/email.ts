import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, name: string) {
  await resend.emails.send({
    from: "MudaFácil <noreply@mudafacil.com.br>",
    to: email,
    subject: "Bem-vindo ao MudaFácil! 🚚",
    html: `
      <h1>Olá, ${name}!</h1>
      <p>Sua conta foi criada com sucesso. Você tem <strong>14 dias de trial gratuito</strong> para explorar todos os recursos.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">Acessar minha conta</a></p>
    `,
  });
}
