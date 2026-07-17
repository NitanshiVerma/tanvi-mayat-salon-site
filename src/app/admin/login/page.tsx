"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || "Login failed.");
        setLoading(false);
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Could not reach the server.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f8f5f0] px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-sm border border-black/10 p-8 shadow-sm"
      >
        <h1 className="text-xl font-semibold mb-1">Tanvi Mayat Admin</h1>
        <p className="text-sm text-black/50 mb-6">Sign in to view leads and bookings.</p>

        <label htmlFor="password" className="block text-xs font-medium text-black/60 mb-2">
          Admin password
        </label>
        <input
          id="password"
          type="password"
          required
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-black/15 rounded-sm px-3 py-2.5 text-sm mb-4 focus:outline-none focus:border-black/40"
          placeholder="••••••••"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white rounded-sm py-2.5 text-sm font-medium disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
      </form>
    </main>
  );
}
