import React, { createContext, useContext, useState, useEffect } from 'react';
import { GameState, Difficulty } from '../types';
import { sounds, playSound } from '../lib/audio';

const GameContext = createContext<{
  state: GameState;
  setState: React.Dispatch<React.SetStateAction<GameState>>;
} | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>({
    screen: 'loading',
    difficulty: null,
    currentLevel: 1,
    score: 0,
    unlockedLevels: {
      easy: 1,
      medium: 1,
      hard: 1
    }
  });

  return (
    <GameContext.Provider value={{ state, setState }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within GameProvider");
  return context;
}
