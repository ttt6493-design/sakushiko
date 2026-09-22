'use client';

import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'age_verified';
const CHANGE_EVENT = 'age-verified-change';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function getSnapshot(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

// On the server (and during hydration) assume verified so the gate never flashes for returning users
function getServerSnapshot(): boolean {
  return true;
}

export default function AgeGate() {
  const verified = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const handleConfirm = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // Storage unavailable (private mode etc.): the gate will just show again next visit
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  };

  if (verified) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6">
      <div className="bg-card rounded-xl p-6 max-w-sm w-full text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-lg font-bold text-foreground mb-2">
          年齢確認 / Age Verification
        </h2>
        <p className="text-sm text-muted mb-2">
          このサイトにはアダルトコンテンツが含まれます。
        </p>
        <p className="text-xs text-muted mb-6">
          This site contains adult content. You must be 18 or older to enter.
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={handleConfirm}
            className="w-full bg-accent hover:bg-accent-hover active:scale-[0.98] text-white font-bold py-3 rounded-lg transition-all text-sm"
          >
            18歳以上です / I am 18+
          </button>
          <a
            href="https://www.google.com"
            className="w-full bg-card border border-border text-muted font-medium py-3 rounded-lg text-sm block hover:text-foreground transition-colors"
          >
            18歳未満です / I am under 18
          </a>
        </div>
      </div>
    </div>
  );
}
