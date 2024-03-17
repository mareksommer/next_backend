import {
  Html,
  Body,
  Text,
  Link,
  Preview,
  Container,
  Tailwind,
} from "@react-email/components";
import { t } from "@/locales/translate";

function ResetPasswordEmail({
  name,
  resetPasswordLink,
}: {
  name: string | null;
  resetPasswordLink: string;
}) {
  return (
    <Html>
      <Preview>{t("Reset Password")}</Preview>
      <Tailwind>
        <Body className="bg-white">
          <Container>
            <Text className="font-bold text-3xl">
              {t("Hello")} {name}, <br />
              {t(
                "You are receiving this email because we received a password reset request for your account."
              )}
              {t("Please follow this link to reset your password")}{" "}
              <Link href={resetPasswordLink}>{resetPasswordLink}</Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default ResetPasswordEmail;
