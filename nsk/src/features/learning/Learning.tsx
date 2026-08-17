import { useMemo, useState } from 'react';
import { Flame, RotateCw, Check, Languages as LangIcon } from 'lucide-react';
import type { NskStore } from '../../hooks/useNskStore';
import type { LanguageCode } from '../../types';

const LANGS: { code: LanguageCode; label: string; flag: string }[] = [
  { code: 'ta', label: 'Tamil', flag: '🇮🇳' },
  { code: 'ml', label: 'Malayalam', flag: '🇮🇳' },
  { code: 'hi', label: 'Hindi', flag: '🇮🇳' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ja', label: 'Japanese', flag: '🇯🇵' },
  { code: 'de', label: 'German', flag: '🇩🇪' },
];

export default function Learning({ store }: { store: NskStore }) {
  const [lang, setLang] = useState<LanguageCode>('ja');
  const [flipped, setFlipped] = useState(false);
  const [cardIdx, setCardIdx] = useState(0);

  const words = useMemo(() => store.vocab.filter((v) => v.lang === lang), [store.vocab, lang]);
  const learnedCount = words.filter((w) => w.learned).length;
  const streak = 12; // demo constant learning streak
  const card = words[cardIdx % Math.max(words.length, 1)];

  const markLearned = (id: string) =>
    store.setVocab(store.vocab.map((v) => (v.id === id ? { ...v, learned: true } : v)));

  const next = () => {
    setFlipped(false);
    setCardIdx((i) => (i + 1) % Math.max(words.length, 1));
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Learning</h1>
        <p className="text-sm text-nsk-muted mt-1">Daily vocabulary and flashcard practice</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {LANGS.map((l) => (
          <button
            key={l.code}
            onClick={() => { setLang(l.code); setCardIdx(0); setFlipped(false); }}
            className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-sm ${
              lang === l.code ? 'bg-nsk-crimson/15 border-nsk-crimson text-nsk-ink' : 'border-nsk-border text-nsk-muted hover:bg-nsk-surface2'
            }`}
          >
            <span>{l.flag}</span> {l.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="nsk-card p-6 flex flex-col items-center">
            <div className="flex items-center gap-2 text-xs text-nsk-muted mb-4">
              <LangIcon size={13} /> Flashcards · {LANGS.find((l) => l.code === lang)?.label}
            </div>
            {card ? (
              <>
                <button
                  onClick={() => setFlipped((f) => !f)}
                  className="w-full max-w-sm aspect-[4/3] rounded-3xl bg-gradient-to-br from-nsk-surface2 to-nsk-surface border border-nsk-border flex flex-col items-center justify-center gap-2 shadow-glow cursor-pointer select-none px-6"
                >
                  {!flipped ? (
                    <>
                      <p className="text-3xl font-display font-bold">{card.word}</p>
                      {card.romanized && <p className="text-nsk-muted text-sm">{card.romanized}</p>}
                    </>
                  ) : (
                    <p className="text-2xl font-display font-semibold text-nsk-crimson2 text-center">{card.meaning}</p>
                  )}
                  <p className="text-[11px] text-nsk-muted mt-4">Tap card to flip</p>
                </button>
                <div className="flex gap-3 mt-5">
                  <button onClick={next} className="nsk-btn-ghost text-sm flex items-center gap-2"><RotateCw size={14} /> Next</button>
                  <button onClick={() => { markLearned(card.id); next(); }} className="nsk-btn-primary text-sm flex items-center gap-2"><Check size={14} /> Mark learned</button>
                </div>
              </>
            ) : (
              <p className="text-sm text-nsk-muted py-10">No vocabulary yet for this language.</p>
            )}
          </div>

          <div className="nsk-card p-5">
            <h2 className="font-display font-semibold mb-3">Recent words</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {words.map((w) => (
                <div key={w.id} className="flex items-center justify-between bg-nsk-surface2 rounded-xl px-3 py-2.5">
                  <div>
                    <p className="text-sm font-medium">{w.word} {w.romanized && <span className="text-nsk-muted text-xs">· {w.romanized}</span>}</p>
                    <p className="text-xs text-nsk-muted">{w.meaning}</p>
                  </div>
                  {w.learned ? <Check size={14} className="text-emerald-400 shrink-0" /> : <span className="nsk-chip shrink-0">new</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="nsk-card p-5">
            <p className="text-xs text-nsk-muted flex items-center gap-1.5 mb-2"><Flame size={13} className="text-nsk-crimson" /> Learning streak</p>
            <p className="text-2xl font-display font-bold">{streak} days</p>
          </div>
          <div className="nsk-card p-5">
            <p className="text-xs text-nsk-muted mb-2">Progress in {LANGS.find((l) => l.code === lang)?.label}</p>
            <div className="h-2.5 rounded-full bg-nsk-surface2 overflow-hidden mb-2">
              <div className="h-full bg-nsk-crimson rounded-full transition-all" style={{ width: `${words.length ? (learnedCount / words.length) * 100 : 0}%` }} />
            </div>
            <p className="text-xs text-nsk-muted">{learnedCount}/{words.length} words learned</p>
          </div>
          <div className="nsk-card p-5">
            <p className="text-xs text-nsk-muted mb-2">Daily vocabulary</p>
            {card && (
              <div className="space-y-1">
                <p className="text-lg font-display font-semibold">{card.word}</p>
                <p className="text-xs text-nsk-muted">{card.romanized ?? ''} {card.romanized ? '·' : ''} {card.meaning}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
