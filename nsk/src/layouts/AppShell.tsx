import { useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import {
  LayoutDashboard, CheckSquare, CalendarDays, Wallet, StickyNote,
  Languages, HeartPulse, Target, Flame, Sparkles, Settings as SettingsIcon,
  Bell, Search, Sun, Moon, Lock,
} from 'lucide-react';
import NskLogo from '../components/NskLogo';
import type { PageKey } from '../types';
import type { NskStore } from '../hooks/useNskStore';

const NAV: { key: PageKey; label: string; icon: any }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'tasks', label: 'Tasks', icon: CheckSquare },
  { key: 'calendar', label: 'Calendar', icon: CalendarDays },
  { key: 'finance', label: 'Finance', icon: Wallet },
  { key: 'notes', label: 'Notes', icon: StickyNote },
  { key: 'learning', label: 'Learning', icon: Languages },
  { key: 'health', label: 'Health', icon: HeartPulse },
  { key: 'goals', label: 'Goals', icon: Target },
  { key: 'habits', label: 'Habits', icon: Flame },
  { key: 'sp', label: 'SP', icon: Sparkles },
  { key: 'settings', label: 'Settings', icon: SettingsIcon },
];

const MOBILE_NAV: PageKey[] = ['dashboard', 'tasks', 'calendar', 'sp', 'settings'];

interface Props {
  page: PageKey;
  setPage: (p: PageKey) => void;
  store: NskStore;
  onLock: () => void;
  children: ReactNode;
}

export default function AppShell({ page, setPage, store, onLock, children }: Props) {
  const [search, setSearch] = useState('');
  const [showNotif, setShowNotif] = useState(false);
  const unread = useMemo(() => store.notifications.filter((n) => !n.read).length, [store.notifications]);
  const isDark = store.theme === 'dark' || (store.theme === 'system' && true);

  return (
    <div className="min-h-screen bg-nsk-bg bg-nsk-radial flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 shrink-0 border-r border-nsk-border bg-nsk-surface/60 backdrop-blur-sm p-4">
        <div className="flex items-center gap-3 px-2 py-3 mb-4">
          <NskLogo size={38} />
          <div>
            <p className="font-display font-bold tracking-wide leading-none">NSK</p>
            <p className="text-[11px] text-nsk-muted mt-1">Personal OS · v1.0</p>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
          {NAV.map(({ key, label, icon: Icon }) => {
            const active = page === key;
            return (
              <button
                key={key}
                onClick={() => setPage(key)}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all relative ${
                  active
                    ? 'bg-nsk-crimson/15 text-nsk-ink'
                    : 'text-nsk-muted hover:text-nsk-ink hover:bg-nsk-surface2'
                }`}
              >
                {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-nsk-crimson" />}
                <Icon size={17} className={active ? 'text-nsk-crimson' : ''} />
                <span className={active ? 'font-medium' : ''}>{label}</span>
              </button>
            );
          })}
        </nav>

        <button
          onClick={onLock}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-nsk-muted hover:text-nsk-ink hover:bg-nsk-surface2 transition-all mt-2"
        >
          <Lock size={17} />
          Lock NSK
        </button>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-20 border-b border-nsk-border bg-nsk-bg/80 backdrop-blur-md px-4 md:px-8 py-3 flex items-center gap-3">
          <div className="md:hidden flex items-center gap-2 mr-1">
            <NskLogo size={30} />
          </div>
          <div className="hidden sm:flex items-center gap-2 flex-1 max-w-md bg-nsk-surface2 border border-nsk-border rounded-xl px-3 py-2">
            <Search size={15} className="text-nsk-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search NSK…"
              className="bg-transparent text-sm outline-none flex-1 placeholder:text-nsk-muted"
            />
          </div>
          <div className="flex-1 sm:hidden" />
          <button
            onClick={() => store.setTheme(store.theme === 'dark' ? 'light' : 'dark')}
            className="p-2.5 rounded-xl border border-nsk-border hover:bg-nsk-surface2 transition-colors"
          >
            {isDark ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          <div className="relative">
            <button
              onClick={() => setShowNotif((s) => !s)}
              className="p-2.5 rounded-xl border border-nsk-border hover:bg-nsk-surface2 transition-colors relative"
            >
              <Bell size={16} />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-nsk-crimson text-[10px] flex items-center justify-center font-semibold">
                  {unread}
                </span>
              )}
            </button>
            {showNotif && (
              <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto nsk-card p-2 animate-slide-up z-30">
                <div className="flex items-center justify-between px-2 py-1.5">
                  <p className="text-sm font-medium">Notifications</p>
                  <button
                    className="text-xs text-nsk-crimson hover:underline"
                    onClick={() => store.setNotifications(store.notifications.map((n) => ({ ...n, read: true })))}
                  >
                    Mark all read
                  </button>
                </div>
                {store.notifications.length === 0 && (
                  <p className="text-xs text-nsk-muted px-2 py-4 text-center">You're all caught up.</p>
                )}
                {store.notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() =>
                      store.setNotifications(store.notifications.map((x) => (x.id === n.id ? { ...x, read: true } : x)))
                    }
                    className={`w-full text-left px-2.5 py-2.5 rounded-lg mb-1 transition-colors ${
                      n.read ? 'hover:bg-nsk-surface2' : 'bg-nsk-crimson/10 hover:bg-nsk-crimson/15'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-nsk-crimson" />}
                      <p className="text-xs font-medium">{n.title}</p>
                    </div>
                    <p className="text-xs text-nsk-muted mt-0.5 pl-3">{n.body}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-nsk-surface/95 backdrop-blur-md border-t border-nsk-border flex items-center justify-around px-1 py-2">
        {MOBILE_NAV.map((key) => {
          const item = NAV.find((n) => n.key === key)!;
          const active = page === key;
          const Icon = item.icon;
          return (
            <button
              key={key}
              onClick={() => setPage(key)}
              className="flex flex-col items-center gap-1 px-3 py-1 min-w-[52px]"
            >
              <Icon size={19} className={active ? 'text-nsk-crimson' : 'text-nsk-muted'} />
              <span className={`text-[10px] ${active ? 'text-nsk-crimson font-medium' : 'text-nsk-muted'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
