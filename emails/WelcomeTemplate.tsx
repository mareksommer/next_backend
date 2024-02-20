import {
  Html,
  Body,
  Text,
  Link,
  Preview,
  Container,
  Tailwind,
} from "@react-email/components";

function WelcomeTemplate({ name }: { name: string }) {
  return (
    <Html>
      <Preview>Welcome aboard!</Preview>
      <Tailwind>
        <Body className="bg-white">
          <Container>
            <Text className="font-bold text-3xl">
              Hello {name}, <br/><Link href="https://example.com/login">Log in</Link>{" "}
              to get started.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default WelcomeTemplate;
