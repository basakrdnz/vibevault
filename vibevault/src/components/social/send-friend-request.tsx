"use client";
import { useState } from 'react';

export default function SendFriendRequest() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch('/api/social/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Error');
      setStatus('İstek gönderildi');
      setEmail('');
    } catch (err) {
      setStatus((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2 items-center">
      <input
        type="email"
        placeholder="Arkadaş email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border rounded px-3 py-2 w-64 bg-transparent"
      />
      <button disabled={loading} className="px-3 py-2 rounded bg-white/10 hover:bg-white/20">
        {loading ? 'Gönderiliyor...' : 'İstek Gönder'}
      </button>
      {status && <span className="text-sm opacity-80">{status}</span>}
    </form>
  );
}


