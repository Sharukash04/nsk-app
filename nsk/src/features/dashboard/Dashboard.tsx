import { useMemo, useState, useEffect } from 'react';
import {
  ListPlus, CalendarPlus, ReceiptText, NotebookPen, Sparkles,
  Flame, Target, Wallet, HeartPulse, ArrowUpRight, CheckCircle2, Circle,
} from 'lucide-react';
import type { NskStore } from '../../hooks/useNskStore';
import type { PageKey } from '../../types';

export default function Dashboard({ store, goTo }: { store: NskStore; goTo: (p: PageKey) => void }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(t);
  }, []);

  const todayISO = now.toISOString().slice(0, 10);
  const todayTasks = useMemo(() => store.tasks.filter((t) => t.dueDate === todayISO), [store.tasks, todayISO]);
  const doneToday = todayTasks.filter((t) => t.completed).length;
  const completionPct = todayTasks.length ? Math.round((doneToday / todayTasks.length) * 100) : 0;

  const upcoming = useMemo(
    () => store.events.filter((e) => e.date >= todayISO).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4),
    [store.events, todayISO]
  );

  const balance = useMemo(
    () =>
      store.transactions.reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0),
    [store.transactions]
  );
  const monthExpense = useMemo(
    () => store.transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    [store.transactions]
  );

  const topStreak = useMemo(() => [...store.habits].sort((a, b) => b.streak - a.streak)[0], [store.habits]);
  const mainGoal = store.goals.find((g) => g.category === 'long-term');

  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const toggleTask = (id: string) =>
    store.setTasks(store.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed, status: !t.completed ? 'completed' : 'planned' } : t)));

  const quickActions = [
    { label: 'Add Task', icon: ListPlus, page: 'tasks' as PageKey },
    { label: 'Add Event', icon: CalendarPlus, page: 'calendar' as PageKey },
    { label: 'Add Expense', icon: ReceiptText, page: 'finance' as PageKey },
    { label: 'New Note', icon: NotebookPen, page: 'notes' as PageKey },
    { label: 'Ask SP', icon: Sparkles, page: 'sp' as PageKey },
  ];

  return (
    <div className="animate-fade-in space-y-6 max-w-6xl mx-auto">
      {/* Greeting header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">{greeting}, Sharukash 👋</h1>
          <p className="text-nsk-muted text-sm mt-1">
            {now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} ·{' '}
            {now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className="nsk-card px-4 py-3 flex items-center gap-3 w-fit">
          <div className="w-11 h-11 rounded-full grid place-items-center border-2 border-nsk-crimson text-xs font-semibold">
            {completionPct}%
          </div>
          <div>
            <p className="text-sm font-medium">Today's progress</p>
            <p className="text-xs text-nsk-muted">{doneToday}/{todayTasks.length} tasks complete</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {quickActions.map(({ label, icon: Icon, page }) => (
          <button
            key={label}
            onClick={() => goTo(page)}
            className="nsk-card p-4 flex flex-col items-center gap-2 hover:border-nsk-crimson/50 hover:-translate-y-0.5 transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-nsk-crimson/15 grid place-items-center">
              <Icon size={17} className="text-nsk-crimson" />
            </div>
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: today's tasks + SP card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="nsk-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold">Today's tasks</h2>
              <button onClick={() => goTo('tasks')} className="text-xs text-nsk-crimson flex items-center gap-1 hover:underline">
                View all <ArrowUpRight size={12} />
              </button>
            </div>
            <div className="space-y-2">
              {todayTasks.length === 0 && <p className="text-sm text-nsk-muted">Nothing scheduled for today. Enjoy the calm.</p>}
              {todayTasks.map((t) => (
                <button
                  key={t.id}
                  onClick={() => toggleTask(t.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-nsk-surface2 transition-colors text-left"
                >
                  {t.completed ? (
                    <CheckCircle2 size={18} className="text-nsk-crimson shrink-0" />
                  ) : (
                    <Circle size={18} className="text-nsk-muted shrink-0" />
                  )}
                  <span className={`text-sm flex-1 ${t.completed ? 'line-through text-nsk-muted' : ''}`}>{t.title}</span>
                  <span className={`nsk-chip ${t.priority === 'high' ? 'border-nsk-crimson/40 text-nsk-crimson2' : ''}`}>
                    {t.priority}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => goTo('sp')}
            className="w-full text-left nsk-card p-5 bg-gradient-to-br from-nsk-crimson/10 to-transparent hover:border-nsk-crimson/50 transition-all group"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-nsk-crimson grid place-items-center shrink-0 shadow-glow">
                <Sparkles size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="font-display font-semibold flex items-center gap-2">
                  SP <span className="nsk-chip">assistant</span>
                </p>
                <p className="text-sm text-nsk-muted mt-1">
                  "I found {store.tasks.filter((t) => !t.completed).length} unfinished tasks. I recommend completing the high-priority item first."
                </p>
              </div>
              <ArrowUpRight size={16} className="text-nsk-muted group-hover:text-nsk-crimson transition-colors shrink-0" />
            </div>
          </button>
        </div>

        {/* Right: summaries */}
        <div className="space-y-4">
          <button onClick={() => goTo('calendar')} className="w-full text-left nsk-card p-5 hover:border-nsk-crimson/40 transition-all">
            <p className="text-xs text-nsk-muted mb-3 flex items-center justify-between">
              Upcoming events <ArrowUpRight size={12} />
            </p>
            <div className="space-y-2.5">
              {upcoming.map((e) => (
                <div key={e.id} className="flex items-center gap-2.5 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-nsk-crimson shrink-0" />
                  <span className="flex-1 truncate">{e.title}</span>
                  <span className="text-xs text-nsk-muted shrink-0">{e.date === todayISO ? 'Today' : e.date.slice(5)}</span>
                </div>
              ))}
            </div>
          </button>

          <button onClick={() => goTo('finance')} className="w-full text-left nsk-card p-5 hover:border-nsk-crimson/40 transition-all">
            <p className="text-xs text-nsk-muted mb-2 flex items-center gap-1.5"><Wallet size={13} /> Finance</p>
            <p className="text-2xl font-display font-bold">₹{balance.toLocaleString('en-IN')}</p>
            <p className="text-xs text-nsk-muted mt-1">₹{monthExpense.toLocaleString('en-IN')} spent this period</p>
          </button>

          <button onClick={() => goTo('health')} className="w-full text-left nsk-card p-5 hover:border-nsk-crimson/40 transition-all">
            <p className="text-xs text-nsk-muted mb-2 flex items-center gap-1.5"><HeartPulse size={13} /> Health</p>
            <div className="flex items-center gap-4 text-sm">
              <div><p className="font-semibold">{store.health.steps.toLocaleString()}</p><p className="text-xs text-nsk-muted">steps</p></div>
              <div><p className="font-semibold">{store.health.sleepHours}h</p><p className="text-xs text-nsk-muted">sleep</p></div>
              <div><p className="font-semibold capitalize">{store.health.mood}</p><p className="text-xs text-nsk-muted">mood</p></div>
            </div>
          </button>

          <button onClick={() => goTo('habits')} className="w-full text-left nsk-card p-5 hover:border-nsk-crimson/40 transition-all">
            <p className="text-xs text-nsk-muted mb-2 flex items-center gap-1.5"><Flame size={13} /> Best streak</p>
            <p className="text-2xl font-display font-bold">{topStreak?.streak ?? 0} days</p>
            <p className="text-xs text-nsk-muted mt-1">{topStreak?.name}</p>
          </button>

          {mainGoal && (
            <button onClick={() => goTo('goals')} className="w-full text-left nsk-card p-5 hover:border-nsk-crimson/40 transition-all">
              <p className="text-xs text-nsk-muted mb-2 flex items-center gap-1.5"><Target size={13} /> Goal progress</p>
              <p className="text-sm font-medium mb-2">{mainGoal.title}</p>
              <div className="h-2 rounded-full bg-nsk-surface2 overflow-hidden">
                <div className="h-full bg-nsk-crimson rounded-full transition-all" style={{ width: `${mainGoal.progress}%` }} />
              </div>
              <p className="text-xs text-nsk-muted mt-1.5">{mainGoal.progress}% complete</p>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
