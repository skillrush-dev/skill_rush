// src/games/index.ts
export type GameMeta = {
  key: string;
  title: string;
  description?: string;
  loader: () => Promise<{ default: React.ComponentType<any> }>;
};

// Add your games here. Use the exact filenames in your /src/games folder
export const GAMES: GameMeta[] = [
  {
    key: 'science',
    title: 'Science Quiz',
    description: 'Short science MCQs (EVS/Science).',
    loader: () => import('./ScienceGame') // ./ScienceGame.tsx
  },
  // add more mappings as you implement games:
  // { key: 'math', title: 'Math Game', loader: () => import('./MathGame') },

  {
  key: 'hindi',
  title: 'Hindi Quiz',
  description: 'Basic Hindi grammar and vocabulary quiz.',
  loader: () => import('./hindi.tsx') // ensure filename matches exactly (HindiGame.tsx)
}

];
