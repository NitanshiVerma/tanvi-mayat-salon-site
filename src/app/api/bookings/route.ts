import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { insertBooking, updateBookingEmailSent } from "@/lib/db";
import { sendNotificationEmail } from "@/lib/mailer";
import { services } from "@/lib/config";

// =============================================================================
// BOOKINGS API ROUTE — POST /api/bookings
// -----------------------------------------------------------------------------
// Saves an appointment request to the SQLite `bookings` table and responds
// immediately. The email notification is sent afterwards via `after()`, so a
// slow SMTP connection can never delay the response or get killed by the
// platform's execution time limit. Bookings start in "pending" status —
// confirm them manually via the admin dashboard (call the client to lock in
// the exact slot).
// =============================================================================

type BookingPayload = {
  name: string;
  phone: string;
  email?: string;
  serviceId: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
};

function isValidPayload(body: unknown): body is BookingPayload {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.name === "string" &&
    b.name.trim().length > 0 &&
    typeof b.phone === "string" &&
    b.phone.trim().length > 0 &&
    typeof b.serviceId === "string" &&
    b.serviceId.trim().length > 0 &&
    typeof b.preferredDate === "string" &&
    b.preferredDate.trim().length > 0 &&
    typeof b.preferredTime === "string" &&
    b.preferredTime.trim().length > 0 &&
    (b.email === undefined || typeof b.email === "string") &&
    (b.notes === undefined || typeof b.notes === "string")
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
      { error: "Missing required fields: name, phone, service, date, and time are required." },
      { status: 400 }
    );
  }

  const service = services.find((s) => s.id === body.serviceId);
  if (!service) {
    return NextResponse.json({ error: "Unknown service selected." }, { status: 400 });
  }

  const name = body.name.trim();
  const phone = body.phone.trim();
  const email = body.email?.trim() || "";
  const preferredDate = body.preferredDate.trim();
  const preferredTime = body.preferredTime.trim();
  const notes = body.notes?.trim() || "";

  const booking = await insertBooking({
    name,
    phone,
    email,
    serviceId: service.id,
    serviceName: service.name,
    preferredDate,
    preferredTime,
    notes,
    emailSent: false,
  });

  after(async () => {
    const sent = await sendNotificationEmail({
      subject: `New booking request — ${service.name} — Tanvi Mayat website`,
      replyTo: email || undefined,
      text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email || "(not provided)"}\nService: ${service.name}\nPreferred date: ${preferredDate}\nPreferred time: ${preferredTime}\nNotes: ${notes || "(none)"}`,
      html: `
        <div style="font-family: sans-serif; font-size: 14px; color: #1a1a1a;">
          <h2 style="margin-bottom: 12px;">New booking request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Email:</strong> ${email || "(not provided)"}</p>
          <p><strong>Service:</strong> ${service.name}</p>
          <p><strong>Preferred date:</strong> ${preferredDate}</p>
          <p><strong>Preferred time:</strong> ${preferredTime}</p>
          <p><strong>Notes:</strong></p>
          <p style="white-space: pre-wrap;">${notes || "(none)"}</p>
        </div>
      `,
    });
    if (sent) {
      await updateBookingEmailSent(booking.id);
    }
  });

  return NextResponse.json({ ok: true, id: booking.id }, { status: 200 });
}