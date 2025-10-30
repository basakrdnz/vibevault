"use client";
import { useEffect, useState } from 'react';

type Settings = {
  isProfilePrivate: boolean;
  shareViewingHistory: boolean;
  shareEmotionalResponses: boolean;
};

export default function SocialSettingsForm() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/user/social-settings');
      const data = await res.json();
      setSettings({
        isProfilePrivate: !!data.isProfilePrivate,
        shareViewingHistory: !!data.shareViewingHistory,
        shareEmotionalResponses: !!data.shareEmotionalResponses,
      });
    })();
  }, []);

  async function save() {
    if (!settings) return;
    setSaving(true);
    await fetch('/api/user/social-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    setSaving(false);
  }

  if (!settings) return <div>Ayarlar yükleniyor...</div>;

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={settings.isProfilePrivate}
          onChange={(e) => setSettings({ ...settings, isProfilePrivate: e.target.checked })}
        />
        <span>Profili gizli yap</span>
      </label>
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={settings.shareViewingHistory}
          onChange={(e) => setSettings({ ...settings, shareViewingHistory: e.target.checked })}
        />
        <span>İzleme geçmişini arkadaşlarla paylaş</span>
      </label>
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={settings.shareEmotionalResponses}
          onChange={(e) => setSettings({ ...settings, shareEmotionalResponses: e.target.checked })}
        />
        <span>Duygusal notları arkadaşlarla paylaş</span>
      </label>
      <button onClick={save} disabled={saving} className="px-3 py-2 rounded bg-white/10 hover:bg-white/20">
        {saving ? 'Kaydediliyor...' : 'Kaydet'}
      </button>
    </div>
  );
}


