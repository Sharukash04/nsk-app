import { useEffect, useState } from 'react';
import LockScreen from './features/lock/LockScreen';
import AppShell from './layouts/AppShell';
import Dashboard from './features/dashboard/Dashboard';
import Tasks from './features/tasks/Tasks';
import Calendar from './features/calendar/Calendar';
import Finance from './features/finance/Finance';
import Notes from './features/notes/Notes';
import Learning from './features/learning/Learning';
import Health from './features/health/Health';
import Goals from './features/goals/Goals';
import Habits from './features/habits/Habits';
import Sp from './features/sp/Sp';
import Settings from './features/settings/Settings';
import { useNskStore } from './hooks/useNskStore';
import type { PageKey } from './types';

export default function App() {
  const store = useNskStore();
  const [locked, setLocked] = useState(true);
  const [page, setPage] = useState<PageKey>('dashboard');

  useEffect(() => {
    const isDark = store.theme === 'dark' || (store.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);
    document.body.classList.toggle('light', !isDark);
  }, [store.theme]);

  if (locked) {
    return <LockScreen correctPin={store.pin} onUnlock={() => setLocked(false)} />;
  }

  return (
    <AppShell page={page} setPage={setPage} store={store} onLock={() => setLocked(true)}>
      {page === 'dashboard' && <Dashboard store={store} goTo={setPage} />}
      {page === 'tasks' && <Tasks store={store} />}
      {page === 'calendar' && <Calendar store={store} />}
      {page === 'finance' && <Finance store={store} />}
      {page === 'notes' && <Notes store={store} />}
      {page === 'learning' && <Learning store={store} />}
      {page === 'health' && <Health store={store} />}
      {page === 'goals' && <Goals store={store} />}
      {page === 'habits' && <Habits store={store} />}
      {page === 'sp' && <Sp store={store} goTo={setPage} />}
      {page === 'settings' && <Settings store={store} />}
    </AppShell>
  );
}
