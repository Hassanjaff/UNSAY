import React from 'react';
import { motion } from 'motion/react';
import { useGame } from '../../context/GameContext';
import { DisneyButton } from '../UI';
import { DIFFICULTY_CONFIG } from '../../constants';
import { Difficulty } from '../../types';
import { playSound } from '../../lib/audio';
import { Star } from 'lucide-react';

export function DifficultySelect() {
  const { setState } = useGame();

  const select = (diff: Difficulty) => {
    playSound('transition');
    setState(s => ({ 
      ...s, 
      difficulty: diff, 
      screen: 'game',
      currentLevel: s.unlockedLevels[diff] 
    }));
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12">
      <motion.h2
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-7xl font-black italic text-white mb-20 text-center drop-shadow-lg"
      >
        PICK YOUR <span className="text-yellow-400">QUEST</span>
      </motion.h2>
      
      <div className="flex flex-row gap-8 w-full max-w-6xl justify-center">
        {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((diff, i) => (
          <motion.div
            key={diff}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="flex-1"
          >
            <DisneyButton
              onClick={() => select(diff)}
              className="w-full h-80 relative flex flex-col items-center justify-center gap-6"
              variant={diff === 'easy' ? 'primary' : 'secondary'}
            >
              <div className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center text-blue-900 border-4 border-white shadow-2xl">
                <Star size={40} fill="currentColor" />
              </div>
              <div className="text-center">
                <span className="block text-4xl font-black italic mb-2">{DIFFICULTY_CONFIG[diff].label}</span>
                <span className="text-sm font-black opacity-60 uppercase tracking-tighter bg-black/20 px-4 py-1.5 rounded-full">
                  {DIFFICULTY_CONFIG[diff].levels} Chapters
                </span>
              </div>
            </DisneyButton>
          </motion.div>
        ))}
      </div>

      <button 
        onClick={() => setState(s => ({ ...s, screen: 'menu' }))}
        className="mt-12 text-pink-300 font-black uppercase tracking-[0.3em] text-xs hover:text-white transition-colors"
      >
        ← Return to Library
      </button>
    </div>
  );
}
