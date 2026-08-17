import { useMemo, useState } from 'react';
import { Plus, Search, Trash2, Pencil, CheckCircle2, Circle, X, AlertTriangle } from 'lucide-react';
import type { NskStore } from '../../hooks/useNskStore';
import type { Task, TaskStatus, Priority } from '../../types';
import { uid } from '../../hooks/useLocalStorage';

const STATUSES: { key: TaskStatus; label: string }[] = [
  { key: 'inbox', label: 'Inbox' },
  { key: 'planned', label: 'Planned' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
];

const priorityColor: Record<Priority, string> = {
  low: 'text-emerald-400 border-emerald-400/30',
  medium: 'text-amber-400 border-amber-400/30',
  high: 'text-nsk-crimson2 border-nsk-crimson/40',
};

const emptyTask = (): Task => ({
  id: uid('t'),
  title: '',
  status: 'inbox',
  priority: 'medium',
  category: 'Personal',
  completed: false,
  createdAt: new Date().toISOString(),
});

export default function Tasks({ store }: { store: NskStore }) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');
  const [modalTask, setModalTask] = useState<Task | null>(null);

  const filtered = useMemo(() => {
    return store.tasks.filter((t) => {
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterStatus !== 'all' && t.status !== filterStatus) return false;
      if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
      return true;
    });
  }, [store.tasks, search, filterStatus, filterPriority]);

  const todayISO = new Date().toISOString().slice(0, 10);
  const overdue = store.tasks.filter((t) => !t.completed && t.dueDate && t.dueDate < todayISO);
  const total = store.tasks.length;
  const done = store.tasks.filter((t) => t.completed).length;

  const toggleComplete = (t: Task) =>
    store.setTasks(store.tasks.map((x) => (x.id === t.id ? { ...x, completed: !x.completed, status: !x.completed ? 'completed' : 'planned' } : x)));

  const deleteTask = (id: string) => store.setTasks(store.tasks.filter((t) => t.id !== id));

  const saveTask = (t: Task) => {
    const exists = store.tasks.some((x) => x.id === t.id);
    store.setTasks(exists ? store.tasks.map((x) => (x.id === t.id ? t : x)) : [t, ...store.tasks]);
    setModalTask(null);
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Tasks</h1>
          <p className="text-sm text-nsk-muted mt-1">
            {done}/{total} complete
            {overdue.length > 0 && (
              <span className="ml-2 text-nsk-crimson2 inline-flex items-center gap-1">
                <AlertTriangle size={12} /> {overdue.length} overdue
              </span>
            )}
          </p>
        </div>
        <button onClick={() => setModalTask(emptyTask())} className="nsk-btn-primary flex items-center gap-2 text-sm w-fit">
          <Plus size={16} /> Add Task
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-nsk-surface2 border border-nsk-border rounded-xl px-3 py-2.5 flex-1">
          <Search size={15} className="text-nsk-muted" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks…" className="bg-transparent text-sm outline-none flex-1 placeholder:text-nsk-muted" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)} className="nsk-input sm:w-40">
          <option value="all">All statuses</option>
          {STATUSES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value as any)} className="nsk-input sm:w-36">
          <option value="all">All priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATUSES.map((col) => {
          const items = filtered.filter((t) => t.status === col.key);
          return (
            <div key={col.key} className="nsk-card p-3 flex flex-col min-h-[120px]">
              <div className="flex items-center justify-between px-1.5 py-1 mb-2">
                <p className="text-xs font-semibold text-nsk-muted uppercase tracking-wide">{col.label}</p>
                <span className="nsk-chip">{items.length}</span>
              </div>
              <div className="space-y-2 flex-1">
                {items.length === 0 && <p className="text-xs text-nsk-muted px-1.5 py-3">No tasks</p>}
                {items.map((t) => {
                  const isOverdue = !t.completed && t.dueDate && t.dueDate < todayISO;
                  return (
                    <div key={t.id} className="bg-nsk-surface2 rounded-xl p-3 group">
                      <div className="flex items-start gap-2">
                        <button onClick={() => toggleComplete(t)} className="shrink-0 mt-0.5">
                          {t.completed ? <CheckCircle2 size={16} className="text-nsk-crimson" /> : <Circle size={16} className="text-nsk-muted" />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${t.completed ? 'line-through text-nsk-muted' : ''}`}>{t.title}</p>
                          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                            <span className={`nsk-chip ${priorityColor[t.priority]}`}>{t.priority}</span>
                            <span className="nsk-chip">{t.category}</span>
                            {t.dueDate && (
                              <span className={`nsk-chip ${isOverdue ? 'border-nsk-crimson/50 text-nsk-crimson2' : ''}`}>{t.dueDate}</span>
                            )}
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1 shrink-0">
                          <button onClick={() => setModalTask(t)} className="text-nsk-muted hover:text-nsk-ink"><Pencil size={13} /></button>
                          <button onClick={() => deleteTask(t.id)} className="text-nsk-muted hover:text-nsk-crimson2"><Trash2 size={13} /></button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {modalTask && <TaskModal task={modalTask} onClose={() => setModalTask(null)} onSave={saveTask} />}
    </div>
  );
}

function TaskModal({ task, onClose, onSave }: { task: Task; onClose: () => void; onSave: (t: Task) => void }) {
  const [draft, setDraft] = useState<Task>(task);
  const isNew = !draft.title && draft.createdAt;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="nsk-card w-full sm:max-w-md p-6 rounded-b-none sm:rounded-2xl animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold">{isNew ? 'New Task' : 'Edit Task'}</h3>
          <button onClick={onClose}><X size={18} className="text-nsk-muted" /></button>
        </div>
        <div className="space-y-3">
          <input autoFocus value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Task title" className="nsk-input" />
          <textarea value={draft.notes ?? ''} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} placeholder="Notes (optional)" rows={2} className="nsk-input resize-none" />
          <div className="grid grid-cols-2 gap-3">
            <select value={draft.priority} onChange={(e) => setDraft({ ...draft, priority: e.target.value as Priority })} className="nsk-input">
              <option value="low">Low priority</option>
              <option value="medium">Medium priority</option>
              <option value="high">High priority</option>
            </select>
            <select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as TaskStatus })} className="nsk-input">
              {STATUSES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} placeholder="Category" className="nsk-input" />
            <input type="date" value={draft.dueDate ?? ''} onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })} className="nsk-input" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="nsk-btn-ghost flex-1 text-sm">Cancel</button>
          <button
            disabled={!draft.title.trim()}
            onClick={() => onSave({ ...draft, completed: draft.status === 'completed' })}
            className="nsk-btn-primary flex-1 text-sm disabled:opacity-40"
          >
            Save Task
          </button>
        </div>
      </div>
    </div>
  );
}
