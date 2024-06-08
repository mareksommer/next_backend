import { Resend } from "resend";

const resend = new Resend(process.env.SENDGRID_API_KEY);

interface CreateEmailResponse {
  data: { id: string } | null;
  error: ErrorResponse | null;
}

interface EmailOptions {
  from?: string;
  to: string;
  subject: string;
  react: JSX.Element;
}

export async function sendEmail(options: EmailOptions): Promise<CreateEmailResponse> {
  const { from, to, subject, react } = options;

  return await resend.emails.send({
    from: from || process.env.EMAIL_FROM!,
    to: to,
    subject: subject,
    react: react
  });
}