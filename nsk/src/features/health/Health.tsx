import { Droplet, Footprints, Moon, Dumbbell, Scale, Smile } from 'lucide-react';
import type { NskStore } from '../../hooks/useNskStore';

const MOODS = ['great', 'good', 'okay', 'low', 'bad'] as const;
const MOOD_EMOJI: Record<string, string> = { great: '🤩', good: '🙂', okay: '😐', low: '😕', bad: '😔' };

export default function Health({ store }: { store: NskStore }) {
  const h = store.health;
  const score = Math.round(
    (Math.min(h.sleepHours / 8, 1) * 25) +
    (Math.min(h.waterMl / h.waterGoalMl, 1) * 25) +
    (Math.min(h.steps / h.stepsGoal, 1) * 30) +
    (Math.min(h.exerciseMin / 30, 1) * 20)
  );

  const update = (patch: Partial<typeof h>) => store.setHealth({ ...h, ...patch });

  const metrics = [
    { icon: Moon, label: 'Sleep', value: `${h.sleepHours}h`, pct: Math.min(100, (h.sleepHours / 8) * 100), color: '#a78bfa' },
    { icon: Droplet, label: 'Water', value: `${(h.waterMl / 1000).toFixed(1)}L / ${(h.waterGoalMl / 1000).toFixed(1)}L`, pct: Math.min(100, (h.waterMl / h.waterGoalMl) * 100), color: '#38bdf8' },
    { icon: Footprints, label: 'Steps', value: `${h.steps.toLocaleString()} / ${h.stepsGoal.toLocaleString()}`, pct: Math.min(100, (h.steps / h.stepsGoal) * 100), color: '#4ade80' },
    { icon: Dumbbell, label: 'Exercise', value: `${h.exerciseMin} min`, pct: Math.min(100, (h.exerciseMin / 30) * 100), color: '#7c6cf6' },
  ];

  return (
    <div className="animate-fade-in max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Health</h1>
        <p className="text-sm text-nsk-muted mt-1">Wellness tracking — not a medical diagnosis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="nsk-card p-6 flex flex-col items-center justify-center lg:col-span-1">
          <div className="relative w-32 h-32 grid place-items-center">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#26222b" strokeWidth="10" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="#7c6cf6" strokeWidth="10" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 42} strokeDashoffset={2 * Math.PI * 42 * (1 - score / 100)} />
            </svg>
            <div className="text-center">
              <p className="text-2xl font-display font-bold">{score}</p>
              <p className="text-[10px] text-nsk-muted">wellness score</p>
            </div>
          </div>
          <p className="text-sm text-nsk-muted mt-4 text-center">Daily wellness score, based on sleep, water, steps, and exercise.</p>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {metrics.map((m) => (
            <div key={m.label} className="nsk-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 rounded-lg grid place-items-center" style={{ background: `${m.color}22` }}>
                  <m.icon size={15} style={{ color: m.color }} />
                </span>
                <p className="text-sm font-medium">{m.label}</p>
              </div>
              <p className="text-lg font-display font-semibold mb-2">{m.value}</p>
              <div className="h-2 rounded-full bg-nsk-surface2 overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${m.pct}%`, background: m.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="nsk-card p-5">
          <p className="text-xs text-nsk-muted flex items-center gap-1.5 mb-3"><Scale size={13} /> Weight</p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              step="0.1"
              value={h.weightKg}
              onChange={(e) => update({ weightKg: Number(e.target.value) })}
              className="nsk-input w-28"
            />
            <span className="text-sm text-nsk-muted">kg</span>
          </div>
        </div>

        <div className="nsk-card p-5">
          <p className="text-xs text-nsk-muted flex items-center gap-1.5 mb-3"><Smile size={13} /> Mood today</p>
          <div className="flex gap-2">
            {MOODS.map((m) => (
              <button
                key={m}
                onClick={() => update({ mood: m })}
                className={`flex-1 aspect-square rounded-xl text-xl grid place-items-center border transition-all ${
                  h.mood === m ? 'border-nsk-crimson bg-nsk-crimson/10' : 'border-nsk-border hover:bg-nsk-surface2'
                }`}
              >
                {MOOD_EMOJI[m]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
