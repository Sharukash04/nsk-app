import { useMemo, useState } from 'react';
import { Plus, X, TrendingUp, TrendingDown, PiggyBank, Wallet } from 'lucide-react';
import type { NskStore } from '../../hooks/useNskStore';
import type { Transaction, TxCategory, TxType } from '../../types';
import { uid } from '../../hooks/useLocalStorage';

const CATEGORIES: TxCategory[] = ['Food', 'Transport', 'Education', 'Shopping', 'Bills', 'Entertainment', 'Salary', 'Other'];
const CAT_COLORS: Record<string, string> = {
  Food: '#9b8dfa', Transport: '#f59e0b', Education: '#38bdf8', Shopping: '#4f8cff',
  Bills: '#34d399', Entertainment: '#fb923c', Salary: '#4ade80', Other: '#94a3b8',
};

const BUDGET = 20000;

export default function Finance({ store }: { store: NskStore }) {
  const [showModal, setShowModal] = useState(false);

  const income = useMemo(() => store.transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0), [store.transactions]);
  const expense = useMemo(() => store.transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0), [store.transactions]);
  const balance = income - expense;
  const savings = Math.max(income - expense, 0);
  const budgetPct = Math.min(100, Math.round((expense / BUDGET) * 100));

  const byCategory = useMemo(() => {
    const map: Record<string, number> = {};
    store.transactions.filter((t) => t.type === 'expense').forEach((t) => { map[t.category] = (map[t.category] ?? 0) + t.amount; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [store.transactions]);
  const maxCat = byCategory[0]?.[1] ?? 1;

  const recent = useMemo(() => [...store.transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8), [store.transactions]);

  const addTx = (tx: Transaction) => {
    store.setTransactions([tx, ...store.transactions]);
    setShowModal(false);
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Finance</h1>
          <p className="text-sm text-nsk-muted mt-1">Mock ledger — no real banking data</p>
        </div>
        <button onClick={() => setShowModal(true)} className="nsk-btn-primary flex items-center gap-2 text-sm w-fit">
          <Plus size={16} /> Add Transaction
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="nsk-card p-5">
          <p className="text-xs text-nsk-muted flex items-center gap-1.5 mb-2"><Wallet size={13} /> Balance</p>
          <p className="text-xl font-display font-bold">₹{balance.toLocaleString('en-IN')}</p>
        </div>
        <div className="nsk-card p-5">
          <p className="text-xs text-nsk-muted flex items-center gap-1.5 mb-2"><TrendingUp size={13} className="text-emerald-400" /> Income</p>
          <p className="text-xl font-display font-bold text-emerald-400">₹{income.toLocaleString('en-IN')}</p>
        </div>
        <div className="nsk-card p-5">
          <p className="text-xs text-nsk-muted flex items-center gap-1.5 mb-2"><TrendingDown size={13} className="text-nsk-crimson2" /> Expenses</p>
          <p className="text-xl font-display font-bold text-nsk-crimson2">₹{expense.toLocaleString('en-IN')}</p>
        </div>
        <div className="nsk-card p-5">
          <p className="text-xs text-nsk-muted flex items-center gap-1.5 mb-2"><PiggyBank size={13} /> Savings</p>
          <p className="text-xl font-display font-bold">₹{savings.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="nsk-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold">Spending by category</h2>
            <span className="text-xs text-nsk-muted">this period</span>
          </div>
          <div className="space-y-3">
            {byCategory.map(([cat, amt]) => (
              <div key={cat}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{cat}</span>
                  <span className="text-nsk-muted">₹{amt.toLocaleString('en-IN')}</span>
                </div>
                <div className="h-2 rounded-full bg-nsk-surface2 overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${(amt / maxCat) * 100}%`, background: CAT_COLORS[cat] }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-nsk-border">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-nsk-muted">Monthly budget</span>
              <span className="font-medium">{budgetPct}% used</span>
            </div>
            <div className="h-2.5 rounded-full bg-nsk-surface2 overflow-hidden">
              <div className={`h-full rounded-full transition-all ${budgetPct > 85 ? 'bg-nsk-crimson' : 'bg-emerald-400'}`} style={{ width: `${budgetPct}%` }} />
            </div>
          </div>
        </div>

        <div className="nsk-card p-5">
          <h2 className="font-display font-semibold mb-4">Recent transactions</h2>
          <div className="space-y-1">
            {recent.map((t) => (
              <div key={t.id} className="flex items-center gap-3 py-2 border-b border-nsk-border last:border-0">
                <span className="w-8 h-8 rounded-lg grid place-items-center shrink-0" style={{ background: `${CAT_COLORS[t.category]}22` }}>
                  {t.type === 'income' ? <TrendingUp size={13} style={{ color: CAT_COLORS[t.category] }} /> : <TrendingDown size={13} style={{ color: CAT_COLORS[t.category] }} />}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{t.description}</p>
                  <p className="text-[11px] text-nsk-muted">{t.category} · {t.date.slice(5)}</p>
                </div>
                <p className={`text-xs font-semibold ${t.type === 'income' ? 'text-emerald-400' : 'text-nsk-crimson2'}`}>
                  {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && <TxModal onClose={() => setShowModal(false)} onSave={addTx} />}
    </div>
  );
}

function TxModal({ onClose, onSave }: { onClose: () => void; onSave: (t: Transaction) => void }) {
  const [type, setType] = useState<TxType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<TxCategory>('Food');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState('');

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="nsk-card w-full sm:max-w-md p-6 rounded-b-none sm:rounded-2xl animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold">Add Transaction</h3>
          <button onClick={onClose}><X size={18} className="text-nsk-muted" /></button>
        </div>
        <div className="space-y-3">
          <div className="flex bg-nsk-surface2 rounded-xl p-1 border border-nsk-border">
            {(['expense', 'income'] as TxType[]).map((t) => (
              <button key={t} onClick={() => setType(t)} className={`flex-1 py-2 rounded-lg text-sm capitalize transition-colors ${type === t ? 'bg-nsk-crimson text-white' : 'text-nsk-muted'}`}>
                {t}
              </button>
            ))}
          </div>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount (₹)" className="nsk-input" />
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="nsk-input" />
          <div className="grid grid-cols-2 gap-3">
            <select value={category} onChange={(e) => setCategory(e.target.value as TxCategory)} className="nsk-input">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="nsk-input" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="nsk-btn-ghost flex-1 text-sm">Cancel</button>
          <button
            disabled={!amount || !description.trim()}
            onClick={() => onSave({ id: uid('x'), type, amount: Number(amount), category, date, description })}
            className="nsk-btn-primary flex-1 text-sm disabled:opacity-40"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
