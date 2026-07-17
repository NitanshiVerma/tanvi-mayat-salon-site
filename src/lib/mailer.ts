import nodemailer from "nodemailer";

// =============================================================================
// MAILER — shared SMTP helper for contact + booking notifications
// -----------------------------------------------------------------------------
// Requires SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO_EMAIL in
// your environment (see .env.example). Returns false (never throws) if
// email isn't configured or delivery fails, so callers can degrade gracefully
// — the record is always saved to the database regardless of email outcome.
// =============================================================================

export function isEmailConfigured(): boolean {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO_EMAIL } = process.env;
  return Boolean(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS && CONTACT_TO_EMAIL);
}

export async function sendNotificationEmail(opts: {
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}): Promise<boolean> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO_EMAIL } = process.env;

  if (!isEmailConfigured()) {
    console.error("SMTP env vars are not configured — email was not sent.");
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    await transporter.sendMail({
      from: `"Tanvi Mayat Website" <${SMTP_USER}>`,
      to: CONTACT_TO_EMAIL,
      replyTo: opts.replyTo || undefined,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
    });

    return true;
  } catch (err) {
    console.error("Failed to send notification email:", err);
    return false;
  }
}
