// src/games/GameLoader.tsx
import React, { useEffect, useState } from 'react';

type Props = {
  loader: () => Promise<{ default: React.ComponentType<any> }>;
  gameProps?: Record<string, any>;
};

export default function GameLoader({ loader, gameProps = {} }: Props) {
  const [Comp, setComp] = useState<React.ComponentType<any> | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setErr(null);
    loader()
      .then(mod => {
        if (!mounted) return;
        setComp(() => mod.default);
      })
      .catch(e => {
        console.error('game import error', e);
        setErr(String(e || 'Failed to load game'));
      });
    return () => { mounted = false; };
  }, [loader]);

  if (err) return <div className="p-4 text-red-600">Error loading game: {err}</div>;
  if (!Comp) return <div className="p-6 text-center">Loading game…</div>;

  return <Comp {...gameProps} />;
}
