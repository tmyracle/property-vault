import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { env } from "~/env.mjs";

interface NewDisbursementRequestTemplateProps {
  slug: string;
}

const previewText = `New disbursement request`;

const logoUrl =
  "https://propertyvault.s3.us-east-2.amazonaws.com/public/propertyroom-crop.png";

export const NewDisbursementRequestTemplate: React.FC<
  Readonly<NewDisbursementRequestTemplateProps>
> = ({ slug }) => (
  <Html>
    <Head />
    <Preview>{previewText}</Preview>
    <Tailwind>
      <Body className="mx-auto my-auto bg-white font-sans">
        <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
          <Section className="mt-[32px]">
            <Img
              src={logoUrl}
              alt="PropertyVault"
              width="60"
              height="60"
              className="mx-auto my-0"
            />
          </Section>
          <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
            New disbursement request ready for review
          </Heading>
          <Text className="text-[14px] leading-[24px] text-black">Hello,</Text>
          <Text className="text-[14px] leading-[24px] text-black">
            You have a new disbursement request ready for review on
            PropertyVault. Please review the request using the button below.
          </Text>
          <Section className="mb-[32px] mt-[32px] text-center">
            <Button
              style={{ padding: "12px 20px" }}
              className="rounded bg-[#000000] text-center text-[12px] font-semibold text-white no-underline"
              href={`${env.NEXT_PUBLIC_DOMAIN}/disbursements?id=${slug}`}
            >
              View request
            </Button>
          </Section>
          <Text className="text-[14px] leading-[24px] text-black">
            or copy and paste this URL into your browser:{" "}
            <Link
              href={`${env.NEXT_PUBLIC_DOMAIN}/disbursements?id=${slug}`}
              className="text-blue-600 no-underline"
            >
              {`${env.NEXT_PUBLIC_DOMAIN}/disbursements?id=${slug}`}
            </Link>
          </Text>
          <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
          <Text className="text-[12px] leading-[24px] text-[#666666]">
            You received this email because you are listed as a supervisor in
            PropertyVault. If you were not expecting this invitation, you can
            ignore this email. If you are concerned about your account&apos;s
            safety, please reply to this email to get in touch with us.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
