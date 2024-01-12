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

interface RequestReviewedTemplateProps {
  slug: string;
  status: string;
  caseNumber: string;
}

const logoUrl =
  "https://propertyvault.s3.us-east-2.amazonaws.com/public/propertyroom-crop.png";

export const RequestReviewedTemplate: React.FC<
  Readonly<RequestReviewedTemplateProps>
> = ({ slug, status, caseNumber }) => (
  <Html>
    <Head />
    <Preview>{`Your disbursement request was ${status} for case ${caseNumber}`}</Preview>
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
            Your disbursement request was {status} for case {caseNumber}
          </Heading>
          <Text className="text-[14px] leading-[24px] text-black">Hello,</Text>
          <Text className="text-[14px] leading-[24px] text-black">
            Your disbursement request was {status} for case {caseNumber}. You
            can access the finalized request from by clicking the button below.
          </Text>
          <Section className="mb-[32px] mt-[32px] text-center">
            <Button
              style={{ padding: "12px 20px" }}
              className="rounded bg-[#000000] text-center text-[12px] font-semibold text-white no-underline"
              href={`${env.NEXT_PUBLIC_APP_DOMAIN}/disbursements?id=${slug}`}
            >
              View request
            </Button>
          </Section>
          <Text className="text-[14px] leading-[24px] text-black">
            or copy and paste this URL into your browser:{" "}
            <Link
              href={`${env.NEXT_PUBLIC_APP_DOMAIN}/disbursements?id=${slug}`}
              className="text-blue-600 no-underline"
            >
              {`${env.NEXT_PUBLIC_APP_DOMAIN}/disbursements?id=${slug}`}
            </Link>
          </Text>
          <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
          <Text className="text-[12px] leading-[24px] text-[#666666]">
            You received this email because you initiated a disbursement request
            in PropertyVault. If you were not expecting this update, you can
            ignore this email. If you are concerned about your account&apos;s
            safety, please reply to this email to get in touch with us.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
