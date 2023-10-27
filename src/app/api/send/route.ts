/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { EmailTemplate } from "~/app/_components/email/email-template";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { env } from "~/env.mjs";

const resend = new Resend(env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const emailAddresses: string[] = body.emails;
    const slug: string = body.slug;
    const data = await resend.emails.send({
      from: "PropertyVault Notifications <notifications@usepropertyvault.com>",
      to: emailAddresses,
      subject: "New disbursement request",
      react: EmailTemplate({ slug: slug }) as React.ReactElement,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
