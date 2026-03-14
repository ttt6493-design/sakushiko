'use client';

import { useState, useEffect } from 'react';

export default function AgeGate() {
  const [verified, setVerified] = useState(true); // Default true to avoid flash

  useEffect(() => {
    const isVerified = localStorage.getItem('age_verified');
    if (!isVerified) {
      setVerified(false);
    }
  }, []);

  const handleConfirm = () => {
    localStorage.setItem('age_verified', 'true');
    setVerified(true);
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
