import { useEffect, useRef, useState } from 'react';
import { Sparkles, Send, ListChecks, Wallet, CalendarDays, Languages } from 'lucide-react';
import type { NskStore } from '../../hooks/useNskStore';
import type { ChatMessage } from '../../types';
import { uid } from '../../hooks/useLocalStorage';

const SUGGESTED = [
  'What should I focus on today?',
  'What are my unfinished tasks?',
  'Plan my evening.',
  'How much did I spend this month?',
  "Show today's calendar.",
  'Create a Japanese learning task.',
];

function craftReply(prompt: string, store: NskStore): { text: string; action?: { label: string; type: string } } {
  const p = prompt.toLowerCase();
  const unfinished = store.tasks.filter((t) => !t.completed);
  const highPriority = unfinished.find((t) => t.priority === 'high');

  if (p.includes('unfinished') || p.includes('focus')) {
    return {
      text: `I found ${unfinished.length} unfinished tasks. ${
        highPriority ? `I recommend completing "${highPriority.title}" first — it's marked high priority.` : "Nothing urgent is flagged, so pick whatever moves your goals forward."
      }`,
      action: { label: 'Open Tasks', type: 'tasks' },
    };
  }
  if (p.includes('evening')) {
    return {
      text: "Here's a simple evening plan: finish your highest-priority task, do a 10-minute Japanese review, then log today's habits before winding down.",
      action: { label: 'Open Habits', type: 'habits' },
    };
  }
  if (p.includes('spend') || p.includes('expense') || p.includes('budget')) {
    const expense = store.transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { text: `You've spent ₹${expense.toLocaleString('en-IN')} so far this period. Food and Shopping are your top categories.`, action: { label: 'Open Finance', type: 'finance' } };
  }
  if (p.includes('calendar') || p.includes('today')) {
    const todayISO = new Date().toISOString().slice(0, 10);
    const todays = store.events.filter((e) => e.date === todayISO);
    return {
      text: todays.length ? `You have ${todays.length} item(s) today: ${todays.map((e) => e.title).join(', ')}.` : "Your calendar is clear for today — a good day to get ahead.",
      action: { label: 'Open Calendar', type: 'calendar' },
    };
  }
  if (p.includes('japanese') || p.includes('learning task')) {
    return { text: "Done — I've added a Japanese vocabulary review task for today.", action: { label: 'Open Tasks', type: 'tasks' } };
  }
  return {
    text: "I can help plan your day, summarize tasks, check your budget, or review your calendar. Try one of the suggestions below, or ask me anything about NSK.",
  };
}

export default function Sp({ store, goTo }: { store: NskStore; goTo: (p: any) => void }) {
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [store.chat, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: uid('c'), role: 'user', content: text, timestamp: new Date().toISOString() };
    store.setChat([...store.chat, userMsg]);
    setInput('');
    setTyping(true);

    if (text.toLowerCase().includes('japanese learning task')) {
      store.setTasks([
        { id: uid('t'), title: 'Japanese vocabulary review', status: 'planned', priority: 'medium', category: 'Learning', dueDate: new Date().toISOString().slice(0, 10), completed: false, createdAt: new Date().toISOString() },
        ...store.tasks,
      ]);
    }

    setTimeout(() => {
      const reply = craftReply(text, store);
      const aiMsg: ChatMessage = { id: uid('c'), role: 'assistant', content: reply.text, action: reply.action, timestamp: new Date().toISOString() };
      store.setChat((prev) => [...prev, aiMsg]);
      setTyping(false);
    }, 900);
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto flex flex-col h-[calc(100vh-160px)] md:h-[calc(100vh-120px)]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-xl bg-nsk-crimson grid place-items-center shadow-glow">
          <Sparkles size={20} className="text-white" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold">SP</h1>
          <p className="text-xs text-nsk-muted">NSK's personal AI assistant · demo mode</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-1">
        {store.chat.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
              m.role === 'user' ? 'bg-nsk-crimson text-white rounded-br-md' : 'nsk-card rounded-bl-md'
            }`}>
              <p>{m.content}</p>
              {m.action && (
                <button
                  onClick={() => goTo(m.action!.type)}
                  className="mt-2.5 flex items-center gap-1.5 text-xs bg-nsk-surface2 hover:bg-nsk-surface rounded-lg px-2.5 py-1.5 text-nsk-ink border border-nsk-border w-fit"
                >
                  {m.action.type === 'tasks' && <ListChecks size={12} />}
                  {m.action.type === 'finance' && <Wallet size={12} />}
                  {m.action.type === 'calendar' && <CalendarDays size={12} />}
                  {m.action.type === 'habits' && <Languages size={12} />}
                  {m.action.label}
                </button>
              )}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="nsk-card rounded-bl-md px-4 py-3 flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-nsk-muted animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-nsk-muted animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-nsk-muted animate-bounce" />
            </div>
          </div>
        )}
      </div>

      <div className="pt-4">
        <div className="flex gap-2 overflow-x-auto pb-3">
          {SUGGESTED.map((s) => (
            <button key={s} onClick={() => send(s)} className="shrink-0 nsk-chip hover:border-nsk-crimson/50 hover:text-nsk-ink transition-colors">
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 nsk-card px-3 py-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send(input)}
            placeholder="Ask SP anything about NSK…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-nsk-muted"
          />
          <button onClick={() => send(input)} disabled={!input.trim()} className="nsk-btn-primary p-2.5 disabled:opacity-30">
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
