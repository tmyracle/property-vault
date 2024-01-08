/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NewDisbursementRequestTemplate } from "~/app/_components/email/new-disbursement-request";
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
    switch (templateType) {
      case "newDisbursementRequest":
        template = NewDisbursementRequestTemplate({
          slug: emailProps.slug as string,
        }) as React.ReactElement;
        break;
      default:
        template = NewDisbursementRequestTemplate({
          slug: emailProps.slug as string,
        }) as React.ReactElement;
        break;
    }

    const data = await resend.emails.send({
      from: "PropertyVault Notifications <notifications@usepropertyvault.com>",
      to: emailAddresses,
      subject: "New disbursement request",
      react: template,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
