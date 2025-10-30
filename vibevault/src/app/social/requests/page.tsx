"use client";
import { useEffect, useState } from 'react';

type RequestItem = {
  id: string;
  sender?: { id: string; email: string; name: string | null };
  receiver?: { id: string; email: string; name: string | null };
};

export default function RequestsPage() {
  const [incoming, setIncoming] = useState<RequestItem[]>([]);
  const [outgoing, setOutgoing] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/social/requests');
    const data = await res.json();
    setIncoming(data.incoming ?? []);
    setOutgoing(data.outgoing ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function respond(id: string, action: 'accept' | 'decline') {
    const res = await fetch('/api/social/respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId: id, action }),
    });
    if (res.ok) load();
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Arkadaşlık İstekleri</h1>
      {loading ? (
        <div>Yükleniyor...</div>
      ) : (
        <div className="grid gap-8">
          <div>
            <h2 className="text-lg font-medium">Gelen İstekler</h2>
            <div className="mt-3 grid gap-3">
              {incoming.length === 0 && <div className="opacity-70">Gelen istek yok</div>}
              {incoming.map((r) => (
                <div key={r.id} className="border rounded p-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{r.sender?.name ?? r.sender?.email}</div>
                    <div className="text-sm opacity-70">{r.sender?.email}</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-2 rounded bg-white/10 hover:bg-white/20" onClick={() => respond(r.id, 'accept')}>Kabul Et</button>
                    <button className="px-3 py-2 rounded bg-white/10 hover:bg-white/20" onClick={() => respond(r.id, 'decline')}>Reddet</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-medium">Gönderilen İstekler</h2>
            <div className="mt-3 grid gap-3">
              {outgoing.length === 0 && <div className="opacity-70">Gönderilen istek yok</div>}
              {outgoing.map((r) => (
                <div key={r.id} className="border rounded p-3">
                  <div className="font-medium">{r.receiver?.name ?? r.receiver?.email}</div>
                  <div className="text-sm opacity-70">{r.receiver?.email}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


