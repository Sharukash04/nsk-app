import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Clock, Bell, CalendarCheck } from 'lucide-react';
import type { NskStore } from '../../hooks/useNskStore';
import type { CalendarEvent } from '../../types';
import { uid } from '../../hooks/useLocalStorage';

const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
type View = 'month' | 'week' | 'day';

function toISO(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function Calendar({ store }: { store: NskStore }) {
  const [view, setView] = useState<View>('month');
  const [cursor, setCursor] = useState(new Date());
  const [selected, setSelected] = useState(toISO(new Date()));
  const [showModal, setShowModal] = useState(false);

  const monthGrid = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const startDow = (first.getDay() + 6) % 7; // Mon=0
    const gridStart = new Date(first);
    gridStart.setDate(first.getDate() - startDow);
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(gridStart);
      d.setDate(gridStart.getDate() + i);
      return d;
    });
  }, [cursor]);

  const weekDays = useMemo(() => {
    const sel = new Date(selected);
    const dow = (sel.getDay() + 6) % 7;
    const start = new Date(sel);
    start.setDate(sel.getDate() - dow);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [selected]);

  const eventsByDate = (iso: string) => store.events.filter((e) => e.date === iso);
  const todayISO = toISO(new Date());

  const shiftMonth = (n: number) => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + n, 1));

  const addEvent = (ev: CalendarEvent) => {
    store.setEvents([...store.events, ev]);
    setShowModal(false);
  };

  const colorDot: Record<string, string> = {
    crimson: 'bg-nsk-crimson', amber: 'bg-amber-400', emerald: 'bg-emerald-400', sky: 'bg-sky-400', violet: 'bg-violet-400',
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Calendar</h1>
          <p className="text-sm text-nsk-muted mt-1">Plans, events & reminders in one place</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-nsk-surface2 rounded-xl p-1 border border-nsk-border">
            {(['month', 'week', 'day'] as View[]).map((v) => (
              <button key={v} onClick={() => setView(v)} className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-colors ${view === v ? 'bg-nsk-crimson text-white' : 'text-nsk-muted hover:text-nsk-ink'}`}>
                {v}
              </button>
            ))}
          </div>
          <button onClick={() => setShowModal(true)} className="nsk-btn-primary flex items-center gap-2 text-sm">
            <Plus size={16} /> New
          </button>
        </div>
      </div>

      {view === 'month' && (
        <div className="nsk-card p-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => shiftMonth(-1)} className="p-2 rounded-lg hover:bg-nsk-surface2"><ChevronLeft size={16} /></button>
            <p className="font-display font-semibold">{cursor.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
            <button onClick={() => shiftMonth(1)} className="p-2 rounded-lg hover:bg-nsk-surface2"><ChevronRight size={16} /></button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {DOW.map((d) => <p key={d} className="text-xs text-nsk-muted font-medium py-1">{d}</p>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {monthGrid.map((d) => {
              const iso = toISO(d);
              const inMonth = d.getMonth() === cursor.getMonth();
              const evs = eventsByDate(iso);
              const isSelected = iso === selected;
              return (
                <button
                  key={iso}
                  onClick={() => { setSelected(iso); }}
                  className={`aspect-square sm:aspect-[4/3] rounded-lg p-1.5 text-left flex flex-col transition-all border ${
                    isSelected ? 'border-nsk-crimson bg-nsk-crimson/10' : 'border-transparent hover:bg-nsk-surface2'
                  } ${!inMonth ? 'opacity-30' : ''}`}
                >
                  <span className={`text-xs ${iso === todayISO ? 'w-5 h-5 rounded-full bg-nsk-crimson text-white grid place-items-center' : ''}`}>
                    {d.getDate()}
                  </span>
                  <div className="flex gap-0.5 mt-auto flex-wrap">
                    {evs.slice(0, 3).map((e) => (
                      <span key={e.id} className={`w-1.5 h-1.5 rounded-full ${colorDot[e.color ?? 'crimson']}`} />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {view === 'week' && (
        <div className="grid grid-cols-1 sm:grid-cols-7 gap-3">
          {weekDays.map((d) => {
            const iso = toISO(d);
            return (
              <button key={iso} onClick={() => setSelected(iso)} className={`nsk-card p-3 text-left ${iso === selected ? 'border-nsk-crimson' : ''}`}>
                <p className="text-xs text-nsk-muted">{d.toLocaleDateString(undefined, { weekday: 'short' })}</p>
                <p className={`text-sm font-medium mb-2 ${iso === todayISO ? 'text-nsk-crimson' : ''}`}>{d.getDate()}</p>
                <div className="space-y-1">
                  {eventsByDate(iso).slice(0, 3).map((e) => (
                    <p key={e.id} className="text-xs truncate bg-nsk-surface2 rounded px-1.5 py-1">{e.title}</p>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {view === 'day' && (
        <div className="nsk-card p-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setSelected(toISO(new Date(new Date(selected).getTime() - 864e5)))} className="p-2 rounded-lg hover:bg-nsk-surface2"><ChevronLeft size={16} /></button>
            <p className="font-display font-semibold">{new Date(selected).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            <button onClick={() => setSelected(toISO(new Date(new Date(selected).getTime() + 864e5)))} className="p-2 rounded-lg hover:bg-nsk-surface2"><ChevronRight size={16} /></button>
          </div>
          <DaySchedule iso={selected} store={store} />
        </div>
      )}

      {view !== 'day' && (
        <div className="nsk-card p-5">
          <h2 className="font-display font-semibold mb-3">
            {selected === todayISO ? 'Today' : new Date(selected).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
          </h2>
          <DaySchedule iso={selected} store={store} />
        </div>
      )}

      {showModal && <EventModal date={selected} onClose={() => setShowModal(false)} onSave={addEvent} />}
    </div>
  );
}

function DaySchedule({ iso, store }: { iso: string; store: NskStore }) {
  const events = store.events.filter((e) => e.date === iso);
  const tasks = store.tasks.filter((t) => t.dueDate === iso);
  if (events.length === 0 && tasks.length === 0) {
    return <p className="text-sm text-nsk-muted">No plans, tasks, or reminders for this day.</p>;
  }
  return (
    <div className="space-y-2">
      {events.map((e) => (
        <div key={e.id} className="flex items-center gap-3 bg-nsk-surface2 rounded-xl px-3 py-2.5">
          {e.type === 'reminder' ? <Bell size={14} className="text-amber-400 shrink-0" /> : <CalendarCheck size={14} className="text-nsk-crimson shrink-0" />}
          <span className="text-sm flex-1">{e.title}</span>
          {e.time && <span className="text-xs text-nsk-muted flex items-center gap-1"><Clock size={11} />{e.time}</span>}
          <span className="nsk-chip capitalize">{e.type}</span>
        </div>
      ))}
      {tasks.map((t) => (
        <div key={t.id} className="flex items-center gap-3 bg-nsk-surface2 rounded-xl px-3 py-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-nsk-muted shrink-0" />
          <span className={`text-sm flex-1 ${t.completed ? 'line-through text-nsk-muted' : ''}`}>{t.title}</span>
          <span className="nsk-chip">task</span>
        </div>
      ))}
    </div>
  );
}

function EventModal({ date, onClose, onSave }: { date: string; onClose: () => void; onSave: (e: CalendarEvent) => void }) {
  const [title, setTitle] = useState('');
  const [d, setD] = useState(date);
  const [time, setTime] = useState('09:00');
  const [type, setType] = useState<CalendarEvent['type']>('event');

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="nsk-card w-full sm:max-w-md p-6 rounded-b-none sm:rounded-2xl animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold">New Plan / Event</h3>
          <button onClick={onClose}><X size={18} className="text-nsk-muted" /></button>
        </div>
        <div className="space-y-3">
          <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="nsk-input" />
          <div className="grid grid-cols-2 gap-3">
            <input type="date" value={d} onChange={(e) => setD(e.target.value)} className="nsk-input" />
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="nsk-input" />
          </div>
          <select value={type} onChange={(e) => setType(e.target.value as any)} className="nsk-input">
            <option value="event">Event</option>
            <option value="plan">Plan</option>
            <option value="reminder">Reminder</option>
          </select>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="nsk-btn-ghost flex-1 text-sm">Cancel</button>
          <button
            disabled={!title.trim()}
            onClick={() => onSave({ id: uid('e'), title, date: d, time, type, color: 'crimson' })}
            className="nsk-btn-primary flex-1 text-sm disabled:opacity-40"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
