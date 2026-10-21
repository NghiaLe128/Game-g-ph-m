export type ScreenState = 'NICKNAME' | 'MENU' | 'PLAYING' | 'RESULT';

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  accuracy: number;
  correctKeys: number;
  date: string;
}

export interface GameStats {
  score: number;
  correctKeys: number;
  wrongKeys: number;
  accuracy: number;
  highestStreak: number;
  isNewRecord: boolean;
}

// Letter progression for Grade 1 children:
// Level 1: Home row foundation (A, S, D, F, J, K, L)
export const HOME_ROW_KEYS = ['A', 'S', 'D', 'F', 'J', 'K', 'L'];

// Extended keys (gradually mixed in as score increases to gently challenge)
export const TOP_ROW_KEYS = ['E', 'R', 'T', 'U', 'I', 'O', 'P'];
export const BOTTOM_ROW_KEYS = ['B', 'N', 'M', 'C', 'V', 'G', 'H'];

// All friendly uppercase alphabet letters for full keyboard practice
export const ALL_PRACTICE_KEYS = [
  ...HOME_ROW_KEYS,
  ...TOP_ROW_KEYS,
  ...BOTTOM_ROW_KEYS,
  'Q', 'W', 'Y', 'Z', 'X'
];
