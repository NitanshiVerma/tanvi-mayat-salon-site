import { createClient, type Client } from "@libsql/client";
import path from "path";
import fs from "fs";

// =============================================================================
// DATABASE — libSQL (SQLite-compatible), works local AND hosted
// -----------------------------------------------------------------------------
// Two modes, controlled entirely by environment variables:
//
// 1. LOCAL FILE (default — no setup needed):
//    Data is stored at data/salon.db. Works great for local dev and for any
//    host with a persistent filesystem (a VPS, Render, Railway, Docker).
//
// 2. HOSTED (Turso) — required for Netlify, Vercel, or any serverless host
//    where the filesystem resets on every deploy:
//    Set DATABASE_URL and DATABASE_AUTH_TOKEN in your environment (see
//    .env.example for how to create a free Turso database in ~2 minutes).
//    When these are set, this file automatically talks to Turso instead of
//    a local file — no code changes needed.
// =============================================================================

function getClient(): Client {
  const url = process.env.DATABASE_URL;
  const authToken = process.env.DATABASE_AUTH_TOKEN;

  if (url) {
    // Hosted mode (Turso or any libSQL-compatible remote).
    return createClient({ url, authToken });
  }

  // Local file mode.
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const dbPath = path.join(dataDir, "salon.db");
  return createClient({ url: `file:${dbPath}` });
}

declare global {
  // eslint-disable-next-line no-var
  var __salonDbClient: Client | undefined;
  // eslint-disable-next-line no-var
  var __salonDbReady: Promise<void> | undefined;
}

const db = global.__salonDbClient ?? getClient();
if (process.env.NODE_ENV !== "production") {
  global.__salonDbClient = db;
}

async function initSchema(): Promise<void> {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      message TEXT NOT NULL,
      email_sent INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      service_id TEXT NOT NULL,
      service_name TEXT NOT NULL,
      preferred_date TEXT NOT NULL,
      preferred_time TEXT NOT NULL,
      notes TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      email_sent INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
}

// Ensure schema exists before any query runs — cached so it only runs once
// per warm server instance (cheap no-op on subsequent calls either way).
function ready(): Promise<void> {
  if (!global.__salonDbReady) {
    global.__salonDbReady = initSchema();
  }
  return global.__salonDbReady;
}

export type Lead = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  email_sent: number;
  created_at: string;
};

export type Booking = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  service_id: string;
  service_name: string;
  preferred_date: string;
  preferred_time: string;
  notes: string | null;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  email_sent: number;
  created_at: string;
};

export async function insertLead(lead: {
  name: string;
  phone: string;
  email?: string;
  message: string;
  emailSent: boolean;
}): Promise<Lead> {
  await ready();
  const result = await db.execute({
    sql: `INSERT INTO leads (name, phone, email, message, email_sent) VALUES (?, ?, ?, ?, ?) RETURNING *`,
    args: [lead.name, lead.phone, lead.email || null, lead.message, lead.emailSent ? 1 : 0],
  });
  return result.rows[0] as unknown as Lead;
}

export async function listLeads(): Promise<Lead[]> {
  await ready();
  const result = await db.execute(`SELECT * FROM leads ORDER BY created_at DESC`);
  return result.rows as unknown as Lead[];
}

export async function insertBooking(booking: {
  name: string;
  phone: string;
  email?: string;
  serviceId: string;
  serviceName: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
  emailSent: boolean;
}): Promise<Booking> {
  await ready();
  const result = await db.execute({
    sql: `INSERT INTO bookings (name, phone, email, service_id, service_name, preferred_date, preferred_time, notes, email_sent)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`,
    args: [
      booking.name,
      booking.phone,
      booking.email || null,
      booking.serviceId,
      booking.serviceName,
      booking.preferredDate,
      booking.preferredTime,
      booking.notes || null,
      booking.emailSent ? 1 : 0,
    ],
  });
  return result.rows[0] as unknown as Booking;
}

export async function listBookings(): Promise<Booking[]> {
  await ready();
  const result = await db.execute(`SELECT * FROM bookings ORDER BY created_at DESC`);
  return result.rows as unknown as Booking[];
}

export async function updateBookingStatus(id: number, status: Booking["status"]): Promise<Booking | undefined> {
  await ready();
  const result = await db.execute({
    sql: `UPDATE bookings SET status = ? WHERE id = ? RETURNING *`,
    args: [status, id],
  });
  return result.rows[0] as unknown as Booking | undefined;
}

export default db;
