export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Level {
  id: number;
  original: string;
  tutorial?: string;
  requiredRemovals: number;
}

export interface GameState {
  screen: 'loading' | 'menu' | 'difficulty' | 'game' | 'result' | 'fail';
  difficulty: Difficulty | null;
  currentLevel: number;
  score: number;
  feedback?: string;
  unlockedLevels: {
    easy: number;
    medium: number;
    hard: number;
  };
}

export interface ValidationResponse {
  isLogical: boolean;
  meaningShift: number; // 0-10
  feedback: string;
}

export interface HintResponse {
  wordToReveal: string;
  suggestion: string;
}
