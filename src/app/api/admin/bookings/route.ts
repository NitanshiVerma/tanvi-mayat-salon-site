import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "@/lib/auth";
import { listBookings, updateBookingStatus, Booking } from "@/lib/db";

const VALID_STATUSES: Booking["status"][] = ["pending", "confirmed", "cancelled", "completed"];

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ bookings: await listBookings() });
}

export async function PATCH(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const id = Number(b.id);
  const status = b.status;

  if (!Number.isFinite(id) || typeof status !== "string" || !VALID_STATUSES.includes(status as Booking["status"])) {
    return NextResponse.json({ error: "id and a valid status are required." }, { status: 400 });
  }

  const updated = await updateBookingStatus(id, status as Booking["status"]);
  if (!updated) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, booking: updated });
}
