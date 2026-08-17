import { useMemo, useState } from 'react';
import { Plus, Target, CheckCircle2, Circle, X } from 'lucide-react';
import type { NskStore } from '../../hooks/useNskStore';
import type { Goal } from '../../types';
import { uid } from '../../hooks/useLocalStorage';

const CATS: { key: Goal['category']; label: string }[] = [
  { key: 'long-term', label: 'Long-term' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'weekly', label: 'Weekly' },
];

export default function Goals({ store }: { store: NskStore }) {
  const [tab, setTab] = useState<Goal['category']>('long-term');
  const [showModal, setShowModal] = useState(false);
  const goals = useMemo(() => store.goals.filter((g) => g.category === tab), [store.goals, tab]);

  const toggleMilestone = (goalId: string, msId: string) => {
    store.setGoals(
      store.goals.map((g) => {
        if (g.id !== goalId) return g;
        const milestones = g.milestones.map((m) => (m.id === msId ? { ...m, done: !m.done } : m));
        const progress = Math.round((milestones.filter((m) => m.done).length / milestones.length) * 100);
        return { ...g, milestones, progress };
      })
    );
  };

  const addGoal = (g: Goal) => {
    store.setGoals([g, ...store.goals]);
    setShowModal(false);
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Goals</h1>
          <p className="text-sm text-nsk-muted mt-1">Long-term ambitions, broken into milestones</p>
        </div>
        <button onClick={() => setShowModal(true)} className="nsk-btn-primary flex items-center gap-2 text-sm w-fit">
          <Plus size={16} /> New Goal
        </button>
      </div>

      <div className="flex bg-nsk-surface2 rounded-xl p-1 border border-nsk-border w-fit">
        {CATS.map((c) => (
          <button key={c.key} onClick={() => setTab(c.key)} className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${tab === c.key ? 'bg-nsk-crimson text-white' : 'text-nsk-muted hover:text-nsk-ink'}`}>
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.length === 0 && <p className="text-sm text-nsk-muted py-10 text-center col-span-full">No {tab} goals yet.</p>}
        {goals.map((g) => (
          <div key={g.id} className="nsk-card p-5">
            <div className="flex items-start gap-3 mb-3">
              <span className="w-9 h-9 rounded-xl bg-nsk-crimson/15 grid place-items-center shrink-0">
                <Target size={16} className="text-nsk-crimson" />
              </span>
              <div className="flex-1">
                <p className="font-display font-semibold">{g.title}</p>
                {g.dueDate && <p className="text-xs text-nsk-muted mt-0.5">Due {g.dueDate}</p>}
              </div>
              <span className="text-sm font-semibold text-nsk-crimson2">{g.progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-nsk-surface2 overflow-hidden mb-4">
              <div className="h-full bg-nsk-crimson rounded-full transition-all" style={{ width: `${g.progress}%` }} />
            </div>
            <div className="space-y-1.5">
              {g.milestones.map((m) => (
                <button key={m.id} onClick={() => toggleMilestone(g.id, m.id)} className="w-full flex items-center gap-2.5 text-left px-2 py-1.5 rounded-lg hover:bg-nsk-surface2 transition-colors">
                  {m.done ? <CheckCircle2 size={15} className="text-nsk-crimson shrink-0" /> : <Circle size={15} className="text-nsk-muted shrink-0" />}
                  <span className={`text-sm ${m.done ? 'line-through text-nsk-muted' : ''}`}>{m.title}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && <GoalModal category={tab} onClose={() => setShowModal(false)} onSave={addGoal} />}
    </div>
  );
}

function GoalModal({ category, onClose, onSave }: { category: Goal['category']; onClose: () => void; onSave: (g: Goal) => void }) {
  const [title, setTitle] = useState('');
  const [milestonesText, setMilestonesText] = useState('');
  const [dueDate, setDueDate] = useState('');

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="nsk-card w-full sm:max-w-md p-6 rounded-b-none sm:rounded-2xl animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold">New {category} goal</h3>
          <button onClick={onClose}><X size={18} className="text-nsk-muted" /></button>
        </div>
        <div className="space-y-3">
          <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Goal title" className="nsk-input" />
          <textarea value={milestonesText} onChange={(e) => setMilestonesText(e.target.value)} placeholder={"Milestones, one per line"} rows={4} className="nsk-input resize-none" />
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="nsk-input" />
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="nsk-btn-ghost flex-1 text-sm">Cancel</button>
          <button
            disabled={!title.trim()}
            onClick={() =>
              onSave({
                id: uid('g'),
                title,
                category,
                progress: 0,
                dueDate: dueDate || undefined,
                milestones: milestonesText.split('\n').map((t) => t.trim()).filter(Boolean).map((t) => ({ id: uid('m'), title: t, done: false })),
              })
            }
            className="nsk-btn-primary flex-1 text-sm disabled:opacity-40"
          >
            Create Goal
          </button>
        </div>
      </div>
    </div>
  );
}
