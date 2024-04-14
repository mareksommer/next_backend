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

function PasswordUpdatedEmail({
  name,
}: {
  name: string | null;
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
                "Your password has been updated successfully. If you did not request this change, please contact us immediately."
              )}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default PasswordUpdatedEmail;
