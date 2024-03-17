import { Resend } from "resend";

const resend = new Resend(process.env.SENDGRID_API_KEY);

interface EmailOptions {
  from?: string;
  to: string;
  subject: string;
  react: JSX.Element;
}

export async function send(options: EmailOptions) {
  const { from, to, subject, react } = options;
  resend.emails.send({
    from: from || process.env.EMAIL_FROM!,
    to: to,
    subject: subject,
    react: react
  });
}