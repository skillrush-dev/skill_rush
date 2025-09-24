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
  },

 {
    key: "fraction",
    title: "Fraction Bridge",
    description: "Compose fractions to make target values (bridge puzzle).",
    loader: () => import("./FractionGame"),
  },


  {
    key: "number-scramble",
    title: "Number Scramble",
    description: "Arrange numbers in ascending order under a time limit.",
    loader: () => import("./NumberScramble"),
  },

  {
    key: "science",
    title: "Science Quiz",
    loader: () => import("./ScienceGame"),
  }


];
