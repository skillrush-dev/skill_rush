// src/utils/storage.ts
// Very simple localStorage wrapper for saving app-wide settings

export type AppState = {
  settings: { locale: string }
};

const KEY = 'skill_rush_state';

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('loadState error', e);
  }
  return { settings: { locale: 'en' } };
}

export function saveState(state: AppState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('saveState error', e);
  }
}
