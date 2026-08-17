import { useState } from 'react';
import {
  User, Palette, ShieldCheck, Bell, Languages, DatabaseBackup, Laptop,
  Info, Sun, Moon, MonitorSmartphone, Fingerprint, Download, Upload, RefreshCw, Smartphone, Globe,
} from 'lucide-react';
import type { NskStore } from '../../hooks/useNskStore';
import type { ThemeMode } from '../../types';

const SECTIONS = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'appearance', label: 'Appearance', icon: Palette },
  { key: 'security', label: 'Security', icon: ShieldCheck },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'language', label: 'Language', icon: Languages },
  { key: 'data', label: 'Data & Backup', icon: DatabaseBackup },
  { key: 'devices', label: 'Devices', icon: Laptop },
  { key: 'about', label: 'About NSK', icon: Info },
] as const;

type SectionKey = typeof SECTIONS[number]['key'];

export default function Settings({ store }: { store: NskStore }) {
  const [section, setSection] = useState<SectionKey>('profile');
  const [syncedAt] = useState('Synced just now');

  return (
    <div className="animate-fade-in max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Settings</h1>
        <p className="text-sm text-nsk-muted mt-1">Configure NSK to feel like your own system</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSection(s.key)}
              className={`shrink-0 flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                section === s.key ? 'bg-nsk-crimson/15 text-nsk-ink' : 'text-nsk-muted hover:bg-nsk-surface2'
              }`}
            >
              <s.icon size={15} className={section === s.key ? 'text-nsk-crimson' : ''} />
              {s.label}
            </button>
          ))}
        </div>

        <div className="nsk-card p-6">
          {section === 'profile' && (
            <div className="space-y-4 max-w-sm">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-nsk-crimson/15 grid place-items-center text-xl font-display font-bold text-nsk-crimson">S</div>
                <div>
                  <p className="font-medium">Sharukash</p>
                  <p className="text-xs text-nsk-muted">Personal NSK account</p>
                </div>
              </div>
              <label className="block text-xs text-nsk-muted">Display name</label>
              <input defaultValue="Sharukash" className="nsk-input" />
              <label className="block text-xs text-nsk-muted">Email (local demo only)</label>
              <input defaultValue="sharukash@nsk.local" className="nsk-input" />
            </div>
          )}

          {section === 'appearance' && (
            <div className="space-y-5 max-w-md">
              <p className="text-sm font-medium mb-1">Theme</p>
              <div className="grid grid-cols-3 gap-3">
                {(['dark', 'light', 'system'] as ThemeMode[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => store.setTheme(t)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                      store.theme === t ? 'border-nsk-crimson bg-nsk-crimson/10' : 'border-nsk-border hover:bg-nsk-surface2'
                    }`}
                  >
                    {t === 'dark' && <Moon size={18} />}
                    {t === 'light' && <Sun size={18} />}
                    {t === 'system' && <MonitorSmartphone size={18} />}
                    <span className="text-xs capitalize">{t}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-nsk-muted">Accent color: deep crimson (fixed for NSK identity in this demo).</p>
            </div>
          )}

          {section === 'security' && (
            <div className="space-y-5 max-w-md">
              <div>
                <p className="text-sm font-medium mb-2">App lock PIN</p>
                <input
                  value={store.pin}
                  onChange={(e) => store.setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="nsk-input w-40"
                  placeholder="4-digit PIN"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium flex items-center gap-1.5"><Fingerprint size={14} /> Biometric unlock</p>
                  <p className="text-xs text-nsk-muted">Simulated for this demo</p>
                </div>
                <Toggle checked={store.biometric} onChange={store.setBiometric} />
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Auto-lock timer</p>
                <select value={store.autoLockMin} onChange={(e) => store.setAutoLockMin(Number(e.target.value))} className="nsk-input w-40">
                  <option value={1}>1 minute</option>
                  <option value={5}>5 minutes</option>
                  <option value={15}>15 minutes</option>
                  <option value={0}>Never</option>
                </select>
              </div>
              <div className="pt-4 border-t border-nsk-border">
                <p className="text-sm font-medium mb-1">Two-factor authentication</p>
                <p className="text-xs text-nsk-muted mb-2">Placeholder for the production release.</p>
                <span className="nsk-chip">Coming in production build</span>
              </div>
            </div>
          )}

          {section === 'notifications' && (
            <div className="space-y-4 max-w-md">
              {(['task', 'calendar', 'habit', 'finance', 'sp'] as const).map((t) => (
                <div key={t} className="flex items-center justify-between">
                  <p className="text-sm capitalize">{t} reminders</p>
                  <Toggle checked={true} onChange={() => {}} />
                </div>
              ))}
            </div>
          )}

          {section === 'language' && (
            <div className="max-w-md space-y-3">
              <p className="text-sm font-medium flex items-center gap-1.5 mb-2"><Globe size={14} /> App language</p>
              <select className="nsk-input" defaultValue="en">
                <option value="en">English</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="ja">日本語 (Japanese)</option>
              </select>
            </div>
          )}

          {section === 'data' && (
            <div className="space-y-4 max-w-md">
              <div className="flex items-center justify-between p-3 rounded-xl bg-nsk-surface2">
                <div className="flex items-center gap-2 text-sm"><RefreshCw size={14} className="text-emerald-400" /> {syncedAt}</div>
                <span className="nsk-chip border-emerald-400/30 text-emerald-400">Up to date</span>
              </div>
              <button
                onClick={() => {
                  const blob = new Blob([JSON.stringify(localStorage)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url; a.download = 'nsk-backup.json'; a.click();
                }}
                className="nsk-btn-ghost w-full flex items-center justify-center gap-2 text-sm"
              >
                <Download size={15} /> Export backup
              </button>
              <button className="nsk-btn-ghost w-full flex items-center justify-center gap-2 text-sm">
                <Upload size={15} /> Import backup
              </button>
              <p className="text-xs text-nsk-muted">
                Production NSK will sync via Flutter clients → FastAPI → PostgreSQL with realtime sync. This demo keeps all data on-device.
              </p>
            </div>
          )}

          {section === 'devices' && (
            <div className="space-y-3 max-w-md">
              {[
                { name: 'Android', icon: Smartphone, status: 'Planned' },
                { name: 'Windows', icon: Laptop, status: 'Planned' },
                { name: 'Linux', icon: Laptop, status: 'Planned' },
                { name: 'Web (this device)', icon: Globe, status: 'Active' },
              ].map((d) => (
                <div key={d.name} className="flex items-center justify-between p-3 rounded-xl bg-nsk-surface2">
                  <div className="flex items-center gap-2.5 text-sm"><d.icon size={15} /> {d.name}</div>
                  <span className={`nsk-chip ${d.status === 'Active' ? 'border-emerald-400/30 text-emerald-400' : ''}`}>{d.status}</span>
                </div>
              ))}
            </div>
          )}

          {section === 'about' && (
            <div className="max-w-md space-y-3">
              <p className="font-display text-lg font-semibold">NSK v1.0.0</p>
              <p className="text-sm text-nsk-muted">Demo build — your personal digital ecosystem. Runs locally with mock data only.</p>
              <p className="text-xs text-nsk-muted">Future targets: Android APK, Windows, Linux, and Web, synced through one secure backend.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${checked ? 'bg-nsk-crimson' : 'bg-nsk-surface2 border border-nsk-border'}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${checked ? 'left-5' : 'left-0.5'}`} />
    </button>
  );
}
