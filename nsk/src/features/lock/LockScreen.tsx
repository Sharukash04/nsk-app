import { useState } from 'react';
import { Fingerprint, Delete, ShieldCheck } from 'lucide-react';
import NskLogo from '../../components/NskLogo';

interface Props {
  correctPin: string;
  onUnlock: () => void;
}

export default function LockScreen({ correctPin, onUnlock }: Props) {
  const [entered, setEntered] = useState('');
  const [error, setError] = useState(false);
  const [forgotMsg, setForgotMsg] = useState(false);

  const press = (d: string) => {
    if (entered.length >= 6) return;
    const next = entered + d;
    setEntered(next);
    setError(false);
    if (next.length === correctPin.length) {
      if (next === correctPin) {
        setTimeout(onUnlock, 150);
      } else {
        setError(true);
        setTimeout(() => setEntered(''), 400);
      }
    }
  };

  const backspace = () => setEntered((e) => e.slice(0, -1));

  return (
    <div className="min-h-screen w-full bg-nsk-bg bg-nsk-radial flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 nsk-scanline pointer-events-none" />
      <div className="w-full max-w-sm animate-fade-in relative z-10">
        <div className="flex flex-col items-center mb-10">
          <NskLogo size={64} />
          <h1 className="font-display text-2xl font-bold mt-4 tracking-wide">NSK</h1>
          <p className="text-nsk-muted text-sm mt-1">Your private digital ecosystem</p>
        </div>

        <div className="nsk-card p-8 flex flex-col items-center animate-slide-up">
          <p className="text-sm text-nsk-muted mb-5">Enter your PIN to unlock</p>
          <div className={`flex gap-3 mb-8 transition-transform ${error ? '-translate-x-1' : ''}`}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={`w-3.5 h-3.5 rounded-full border transition-all ${
                  i < entered.length
                    ? error
                      ? 'bg-red-500 border-red-500'
                      : 'bg-nsk-crimson border-nsk-crimson'
                    : 'border-nsk-border'
                }`}
              />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 w-full">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
              <button
                key={d}
                onClick={() => press(d)}
                className="aspect-square rounded-2xl bg-nsk-surface2 border border-nsk-border hover:border-nsk-crimson/50 hover:bg-nsk-crimson/10 text-lg font-medium transition-all active:scale-95"
              >
                {d}
              </button>
            ))}
            <button
              onClick={() => setForgotMsg(true)}
              className="rounded-2xl text-xs text-nsk-muted hover:text-nsk-ink transition-colors"
            >
              Forgot?
            </button>
            <button
              onClick={() => press('0')}
              className="aspect-square rounded-2xl bg-nsk-surface2 border border-nsk-border hover:border-nsk-crimson/50 hover:bg-nsk-crimson/10 text-lg font-medium transition-all active:scale-95"
            >
              0
            </button>
            <button
              onClick={backspace}
              className="rounded-2xl flex items-center justify-center text-nsk-muted hover:text-nsk-ink transition-colors"
            >
              <Delete size={18} />
            </button>
          </div>

          <button
            onClick={onUnlock}
            className="mt-6 flex items-center gap-2 text-sm text-nsk-crimson hover:text-nsk-crimson2 transition-colors"
          >
            <Fingerprint size={18} />
            Use biometric unlock (demo)
          </button>

          {forgotMsg && (
            <p className="mt-4 text-xs text-nsk-muted flex items-center gap-1.5 text-center animate-fade-in">
              <ShieldCheck size={14} className="text-nsk-crimson shrink-0" />
              In production, PIN recovery will use secure device-bound verification. Demo PIN: 1234.
            </p>
          )}
        </div>
        <p className="text-center text-xs text-nsk-muted mt-6">NSK v1.0.0 · Demo build · Local device only</p>
      </div>
    </div>
  );
}
