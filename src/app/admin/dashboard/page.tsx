"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

type Lead = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  email_sent: number;
  created_at: string;
};

type Booking = {
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

const STATUS_STYLES: Record<Booking["status"], string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-blue-100 text-blue-700",
};

function StatusSelect({
  value,
  onChange,
}: {
  value: Booking["status"];
  onChange: (status: Booking["status"]) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Booking["status"])}
      className={`text-xs font-medium rounded-full px-2.5 py-1 border-0 outline-none ${STATUS_STYLES[value]}`}
    >
      <option value="pending">Pending</option>
      <option value="confirmed">Confirmed</option>
      <option value="cancelled">Cancelled</option>
      <option value="completed">Completed</option>
    </select>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"bookings" | "leads">("bookings");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [leadsRes, bookingsRes] = await Promise.all([
        fetch("/api/admin/leads"),
        fetch("/api/admin/bookings"),
      ]);

      if (leadsRes.status === 401 || bookingsRes.status === 401) {
        router.push("/admin/login");
        return;
      }

      const leadsData = await leadsRes.json();
      const bookingsData = await bookingsRes.json();
      setLeads(leadsData.leads || []);
      setBookings(bookingsData.bookings || []);
    } catch {
      setError("Could not load data.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (id: number, status: Booking["status"]) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    try {
      await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
    } catch {
      load(); // revert on failure by reloading real state
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <main className="min-h-screen bg-[#f8f5f0] text-black">
      <header className="border-b border-black/10 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <h1 className="text-base sm:text-lg font-semibold">Tanvi Mayat Admin</h1>
          <button onClick={logout} className="text-sm text-black/60 hover:text-black">
            Log out
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setTab("bookings")}
            className={`shrink-0 px-4 py-2 text-sm rounded-full border ${
              tab === "bookings" ? "bg-black text-white border-black" : "border-black/15 text-black/60"
            }`}
          >
            Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setTab("leads")}
            className={`shrink-0 px-4 py-2 text-sm rounded-full border ${
              tab === "leads" ? "bg-black text-white border-black" : "border-black/15 text-black/60"
            }`}
          >
            Contact leads ({leads.length})
          </button>
        </div>

        {loading && <p className="text-sm text-black/50">Loading...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {!loading && tab === "bookings" && (
          <>
            {/* Mobile: stacked cards */}
            <div className="md:hidden space-y-3">
              {bookings.length === 0 && (
                <div className="bg-white rounded-sm border border-black/10 px-4 py-8 text-center text-black/40 text-sm">
                  No bookings yet.
                </div>
              )}
              {bookings.map((b) => (
                <div key={b.id} className="bg-white rounded-sm border border-black/10 p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="font-medium">{b.name}</div>
                      <div className="text-sm text-black/50">{b.phone}</div>
                      {b.email && <div className="text-sm text-black/40">{b.email}</div>}
                    </div>
                    <StatusSelect value={b.status} onChange={(status) => updateStatus(b.id, status)} />
                  </div>
                  <dl className="text-sm space-y-1.5">
                    <div className="flex justify-between gap-4">
                      <dt className="text-black/40">Service</dt>
                      <dd className="text-right">{b.service_name}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-black/40">Preferred slot</dt>
                      <dd className="text-right">
                        {b.preferred_date} · {b.preferred_time}
                      </dd>
                    </div>
                    {b.notes && (
                      <div className="flex justify-between gap-4">
                        <dt className="text-black/40 shrink-0">Notes</dt>
                        <dd className="text-right text-black/60">{b.notes}</dd>
                      </div>
                    )}
                    <div className="flex justify-between gap-4">
                      <dt className="text-black/40">Requested</dt>
                      <dd className="text-right text-black/50">
                        {new Date(b.created_at).toLocaleString()}
                      </dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden md:block bg-white rounded-sm border border-black/10 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/10 text-left text-black/50">
                    <th className="px-4 py-3 font-medium">When</th>
                    <th className="px-4 py-3 font-medium">Client</th>
                    <th className="px-4 py-3 font-medium">Service</th>
                    <th className="px-4 py-3 font-medium">Preferred slot</th>
                    <th className="px-4 py-3 font-medium">Notes</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-black/40">
                        No bookings yet.
                      </td>
                    </tr>
                  )}
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-b border-black/5 align-top">
                      <td className="px-4 py-3 whitespace-nowrap text-black/50">
                        {new Date(b.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{b.name}</div>
                        <div className="text-black/50">{b.phone}</div>
                        {b.email && <div className="text-black/40">{b.email}</div>}
                      </td>
                      <td className="px-4 py-3">{b.service_name}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {b.preferred_date} · {b.preferred_time}
                      </td>
                      <td className="px-4 py-3 max-w-xs text-black/60">{b.notes || "—"}</td>
                      <td className="px-4 py-3">
                        <StatusSelect value={b.status} onChange={(status) => updateStatus(b.id, status)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {!loading && tab === "leads" && (
          <>
            {/* Mobile: stacked cards */}
            <div className="md:hidden space-y-3">
              {leads.length === 0 && (
                <div className="bg-white rounded-sm border border-black/10 px-4 py-8 text-center text-black/40 text-sm">
                  No leads yet.
                </div>
              )}
              {leads.map((l) => (
                <div key={l.id} className="bg-white rounded-sm border border-black/10 p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="font-medium">{l.name}</div>
                      <div className="text-sm text-black/50">{l.phone}</div>
                      {l.email && <div className="text-sm text-black/40">{l.email}</div>}
                    </div>
                    <span
                      className={`shrink-0 text-xs font-medium rounded-full px-2.5 py-1 ${
                        l.email_sent ? "bg-emerald-100 text-emerald-700" : "bg-black/5 text-black/50"
                      }`}
                    >
                      {l.email_sent ? "Emailed" : "Not emailed"}
                    </span>
                  </div>
                  <p className="text-sm text-black/70 mb-2">{l.message}</p>
                  <p className="text-xs text-black/40">{new Date(l.created_at).toLocaleString()}</p>
                </div>
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden md:block bg-white rounded-sm border border-black/10 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/10 text-left text-black/50">
                    <th className="px-4 py-3 font-medium">When</th>
                    <th className="px-4 py-3 font-medium">Client</th>
                    <th className="px-4 py-3 font-medium">Message</th>
                    <th className="px-4 py-3 font-medium">Emailed</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-black/40">
                        No leads yet.
                      </td>
                    </tr>
                  )}
                  {leads.map((l) => (
                    <tr key={l.id} className="border-b border-black/5 align-top">
                      <td className="px-4 py-3 whitespace-nowrap text-black/50">
                        {new Date(l.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{l.name}</div>
                        <div className="text-black/50">{l.phone}</div>
                        {l.email && <div className="text-black/40">{l.email}</div>}
                      </td>
                      <td className="px-4 py-3 max-w-md text-black/70">{l.message}</td>
                      <td className="px-4 py-3">{l.email_sent ? "Yes" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
