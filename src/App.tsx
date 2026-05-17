/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { FloatingWordsBackground } from './components/UI';
import { LoadingScreen } from './components/screens/LoadingScreen';
import { MainMenu } from './components/screens/MainMenu';
import { DifficultySelect } from './components/screens/DifficultySelect';
import { GameScreen } from './components/screens/GameScreen';
import { FinalResultScreen } from './components/screens/ResultScreen';
import { sounds, playSound } from './lib/audio';

function GameContent() {
  const { state } = useGame();
  
  const getDiffBg = () => {
    switch (state.difficulty) {
      case 'easy': return 'bg-gradient-to-br from-green-950 via-emerald-900 to-green-900';
      case 'medium': return 'bg-gradient-to-br from-orange-950 via-amber-900 to-orange-900';
      case 'hard': return 'bg-gradient-to-br from-red-950 via-rose-900 to-red-900';
      default: return 'bg-gradient-to-br from-blue-950 via-indigo-950 to-blue-900';
    }
  }

  return (
    <div className={`game-container relative flex flex-col items-center justify-center font-sans transition-colors duration-1000 ${getDiffBg()}`}>
      <FloatingWordsBackground />
      
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center overflow-hidden">
        {state.screen === 'loading' && <LoadingScreen />}
        {state.screen === 'menu' && <MainMenu />}
        {state.screen === 'difficulty' && <DifficultySelect />}
        {state.screen === 'game' && <GameScreen />}
        {state.screen === 'result' && <FinalResultScreen type="win" />}
        {state.screen === 'fail' && <FinalResultScreen type="fail" />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}
