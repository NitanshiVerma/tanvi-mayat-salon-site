import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { insertLead, updateLeadEmailSent } from "@/lib/db";
import { sendNotificationEmail } from "@/lib/mailer";

// =============================================================================
// CONTACT FORM API ROUTE — POST /api/contact
// -----------------------------------------------------------------------------
// Every submission is saved to the SQLite `leads` table immediately, and the
// response is sent back to the browser right away. The email notification is
// sent afterwards via `after()`, so a slow SMTP connection (common on a cold
// serverless start) can never delay the response or cause the request to be
// killed by the platform's execution time limit. See .env.example for the
// required SMTP_* and CONTACT_TO_EMAIL variables.
// =============================================================================

type ContactPayload = {
  name: string;
  phone: string;
  email?: string;
  message: string;
};

function isValidPayload(body: unknown): body is ContactPayload {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.name === "string" &&
    b.name.trim().length > 0 &&
    typeof b.phone === "string" &&
    b.phone.trim().length > 0 &&
    typeof b.message === "string" &&
    b.message.trim().length > 0 &&
    (b.email === undefined || typeof b.email === "string")
  );
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!isValidPayload(body)) {
    return NextResponse.json(
      { error: "Missing required fields: name, phone, and message are required." },
      { status: 400 }
    );
  }

  const name = body.name.trim();
  const phone = body.phone.trim();
  const email = body.email?.trim() || "";
  const message = body.message.trim();

  const lead = await insertLead({ name, phone, email, message, emailSent: false });

  after(async () => {
    const sent = await sendNotificationEmail({
      subject: `New enquiry from ${name} — Tanvi Mayat website`,
      replyTo: email || undefined,
      text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email || "(not provided)"}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: sans-serif; font-size: 14px; color: #1a1a1a;">
          <h2 style="margin-bottom: 12px;">New enquiry from the website</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Email:</strong> ${email || "(not provided)"}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });
    if (sent) {
      await updateLeadEmailSent(lead.id);
    }
  });

  return NextResponse.json({ ok: true, id: lead.id }, { status: 200 });
}