import { useState } from 'react';
import { Flame, Plus, X, Languages, Code2, BookOpen, Dumbbell, Sparkles, CheckCircle2, Circle } from 'lucide-react';
import type { NskStore } from '../../hooks/useNskStore';
import type { Habit } from '../../types';
import { uid } from '../../hooks/useLocalStorage';

const ICONS: Record<string, any> = { Languages, Code2, BookOpen, Dumbbell, Sparkles };
const DOW = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function Habits({ store }: { store: NskStore }) {
  const [showModal, setShowModal] = useState(false);
  const todayIdx = (new Date().getDay() + 6) % 7;

  const toggleToday = (h: Habit) => {
    const weekly = [...h.weekly];
    weekly[todayIdx] = !h.completedToday;
    store.setHabits(
      store.habits.map((x) =>
        x.id === h.id
          ? { ...x, completedToday: !h.completedToday, weekly, streak: !h.completedToday ? x.streak + 1 : Math.max(0, x.streak - 1) }
          : x
      )
    );
  };

  const addHabit = (h: Habit) => {
    store.setHabits([h, ...store.habits]);
    setShowModal(false);
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Habits</h1>
          <p className="text-sm text-nsk-muted mt-1">Small daily actions, tracked consistently</p>
        </div>
        <button onClick={() => setShowModal(true)} className="nsk-btn-primary flex items-center gap-2 text-sm w-fit">
          <Plus size={16} /> New Habit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {store.habits.map((h) => {
          const Icon = ICONS[h.icon] ?? Sparkles;
          return (
            <div key={h.id} className="nsk-card p-5">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-xl bg-nsk-crimson/15 grid place-items-center shrink-0">
                  <Icon size={17} className="text-nsk-crimson" />
                </span>
                <div className="flex-1">
                  <p className="font-medium text-sm">{h.name}</p>
                  <p className="text-xs text-nsk-muted flex items-center gap-1"><Flame size={11} className="text-nsk-crimson" /> {h.streak} day streak</p>
                </div>
                <button onClick={() => toggleToday(h)}>
                  {h.completedToday ? <CheckCircle2 size={22} className="text-nsk-crimson" /> : <Circle size={22} className="text-nsk-muted" />}
                </button>
              </div>
              <div className="flex justify-between">
                {h.weekly.map((done, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <span className="text-[10px] text-nsk-muted">{DOW[i]}</span>
                    <span className={`w-6 h-6 rounded-lg grid place-items-center text-[10px] ${
                      i === todayIdx ? 'ring-1 ring-nsk-crimson' : ''
                    } ${done ? 'bg-nsk-crimson text-white' : 'bg-nsk-surface2 text-nsk-muted'}`}>
                      {done ? '✓' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {showModal && <HabitModal onClose={() => setShowModal(false)} onSave={addHabit} />}
    </div>
  );
}

function HabitModal({ onClose, onSave }: { onClose: () => void; onSave: (h: Habit) => void }) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Sparkles');

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="nsk-card w-full sm:max-w-sm p-6 rounded-b-none sm:rounded-2xl animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold">New Habit</h3>
          <button onClick={onClose}><X size={18} className="text-nsk-muted" /></button>
        </div>
        <div className="space-y-3">
          <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Habit name" className="nsk-input" />
          <div className="flex gap-2">
            {Object.keys(ICONS).map((key) => {
              const Icon = ICONS[key];
              return (
                <button key={key} onClick={() => setIcon(key)} className={`w-10 h-10 rounded-xl grid place-items-center border transition-all ${icon === key ? 'border-nsk-crimson bg-nsk-crimson/10' : 'border-nsk-border hover:bg-nsk-surface2'}`}>
                  <Icon size={16} />
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="nsk-btn-ghost flex-1 text-sm">Cancel</button>
          <button
            disabled={!name.trim()}
            onClick={() => onSave({ id: uid('h'), name, icon, streak: 0, weekly: Array(7).fill(false), completedToday: false })}
            className="nsk-btn-primary flex-1 text-sm disabled:opacity-40"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
