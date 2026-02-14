import type { WatchItem } from '../types';

const KEY = 'watchlist.v1';

export const loadWatchlist = (): WatchItem[] => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as WatchItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveWatchlist = (items: WatchItem[]) => {
  localStorage.setItem(KEY, JSON.stringify(items));
};
