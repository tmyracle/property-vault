/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NewDisbursementRequestTemplate } from "~/app/_components/email/new-disbursement-request";
import { RequestReviewedTemplate } from "~/app/_components/email/request-reviewed";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { env } from "~/env.mjs";

const resend = new Resend(env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const emailAddresses: string[] = body.emails;
    const emailProps: Record<string, unknown> = body.emailProps;
    const templateType: string = body.templateType;

    let template = null;
    let subject = null;
    switch (templateType) {
      case "newDisbursementRequest":
        subject = "New disbursement request";
        template = NewDisbursementRequestTemplate({
          slug: emailProps.slug as string,
        }) as React.ReactElement;
        break;
      case "disbursementRequestReviewed":
        subject = "Disbursement request reviewed";
        template = RequestReviewedTemplate({
          slug: emailProps.slug as string,
          status: emailProps.status as string,
          caseNumber: emailProps.caseNumber as string,
        }) as React.ReactElement;
        break;
      default:
        subject = "New disbursement request";
        template = NewDisbursementRequestTemplate({
          slug: emailProps.slug as string,
        }) as React.ReactElement;
        break;
    }

    const data = await resend.emails.send({
      from: "PropertyVault Notifications <notifications@usepropertyvault.com>",
      to: emailAddresses,
      subject: subject,
      react: template,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
