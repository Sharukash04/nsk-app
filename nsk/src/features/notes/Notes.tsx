import { useMemo, useState } from 'react';
import { Plus, Search, Pin, Star, Archive, Trash2, X } from 'lucide-react';
import type { NskStore } from '../../hooks/useNskStore';
import type { Note } from '../../types';
import { uid } from '../../hooks/useLocalStorage';

export default function Notes({ store }: { store: NskStore }) {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'all' | 'favorite' | 'archived'>('all');
  const [editing, setEditing] = useState<Note | null>(null);

  const filtered = useMemo(() => {
    return store.notes
      .filter((n) => (tab === 'favorite' ? n.favorite : tab === 'archived' ? n.archived : !n.archived))
      .filter((n) => !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt.localeCompare(a.updatedAt));
  }, [store.notes, search, tab]);

  const update = (id: string, patch: Partial<Note>) =>
    store.setNotes(store.notes.map((n) => (n.id === id ? { ...n, ...patch, updatedAt: new Date().toISOString() } : n)));
  const remove = (id: string) => store.setNotes(store.notes.filter((n) => n.id !== id));

  const save = (n: Note) => {
    const exists = store.notes.some((x) => x.id === n.id);
    store.setNotes(exists ? store.notes.map((x) => (x.id === n.id ? n : x)) : [n, ...store.notes]);
    setEditing(null);
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Notes</h1>
          <p className="text-sm text-nsk-muted mt-1">Capture ideas, plans, and everything else</p>
        </div>
        <button
          onClick={() => setEditing({ id: uid('n'), title: '', content: '', tags: [], pinned: false, favorite: false, archived: false, updatedAt: new Date().toISOString() })}
          className="nsk-btn-primary flex items-center gap-2 text-sm w-fit"
        >
          <Plus size={16} /> New Note
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-nsk-surface2 border border-nsk-border rounded-xl px-3 py-2.5 flex-1">
          <Search size={15} className="text-nsk-muted" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search notes…" className="bg-transparent text-sm outline-none flex-1 placeholder:text-nsk-muted" />
        </div>
        <div className="flex bg-nsk-surface2 rounded-xl p-1 border border-nsk-border w-fit">
          {(['all', 'favorite', 'archived'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-colors ${tab === t ? 'bg-nsk-crimson text-white' : 'text-nsk-muted hover:text-nsk-ink'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.length === 0 && <p className="text-sm text-nsk-muted col-span-full py-10 text-center">No notes here yet.</p>}
        {filtered.map((n) => (
          <div key={n.id} onClick={() => setEditing(n)} className="nsk-card p-4 cursor-pointer hover:border-nsk-crimson/40 transition-all flex flex-col">
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="font-medium text-sm flex-1">{n.title}</p>
              {n.pinned && <Pin size={13} className="text-nsk-crimson shrink-0" />}
            </div>
            <p className="text-xs text-nsk-muted line-clamp-3 flex-1">{n.content}</p>
            <div className="flex items-center gap-1.5 flex-wrap mt-3">
              {n.tags.map((t) => <span key={t} className="nsk-chip">#{t}</span>)}
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-nsk-border">
              <span className="text-[11px] text-nsk-muted">{n.updatedAt.slice(0, 10)}</span>
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => update(n.id, { pinned: !n.pinned })}><Pin size={13} className={n.pinned ? 'text-nsk-crimson' : 'text-nsk-muted hover:text-nsk-ink'} /></button>
                <button onClick={() => update(n.id, { favorite: !n.favorite })}><Star size={13} className={n.favorite ? 'text-amber-400 fill-amber-400' : 'text-nsk-muted hover:text-nsk-ink'} /></button>
                <button onClick={() => update(n.id, { archived: !n.archived })}><Archive size={13} className="text-nsk-muted hover:text-nsk-ink" /></button>
                <button onClick={() => remove(n.id)}><Trash2 size={13} className="text-nsk-muted hover:text-nsk-crimson2" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && <NoteModal note={editing} onClose={() => setEditing(null)} onSave={save} />}
    </div>
  );
}

function NoteModal({ note, onClose, onSave }: { note: Note; onClose: () => void; onSave: (n: Note) => void }) {
  const [draft, setDraft] = useState(note);
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="nsk-card w-full sm:max-w-lg p-6 rounded-b-none sm:rounded-2xl animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold">{note.title ? 'Edit Note' : 'New Note'}</h3>
          <button onClick={onClose}><X size={18} className="text-nsk-muted" /></button>
        </div>
        <div className="space-y-3">
          <input autoFocus value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Title" className="nsk-input font-medium" />
          <textarea value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} placeholder="Write something…" rows={6} className="nsk-input resize-none" />
          <input
            value={draft.tags.join(', ')}
            onChange={(e) => setDraft({ ...draft, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
            placeholder="Tags, comma separated"
            className="nsk-input"
          />
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="nsk-btn-ghost flex-1 text-sm">Cancel</button>
          <button disabled={!draft.title.trim()} onClick={() => onSave(draft)} className="nsk-btn-primary flex-1 text-sm disabled:opacity-40">Save Note</button>
        </div>
      </div>
    </div>
  );
}
