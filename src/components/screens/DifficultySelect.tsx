import React from 'react';
import { motion } from 'motion/react';
import { useGame } from '../../context/GameContext';
import { DisneyButton } from '../UI';
import { DIFFICULTY_CONFIG } from '../../constants';
import { Difficulty } from '../../types';
import { playSound } from '../../lib/audio';
import { Star, Lock } from 'lucide-react';
import { cn } from '../../lib/utils';

export function DifficultySelect() {
  const { state, setState } = useGame();

  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

  const isLocked = (diff: Difficulty) => {
    const currentIndex = difficulties.indexOf(diff);
    const maxIndex = difficulties.indexOf(state.maxUnlockedDifficulty);
    return currentIndex > maxIndex;
  };

  const select = (diff: Difficulty) => {
    if (isLocked(diff)) return;
    playSound('transition');
    setState(s => ({ 
      ...s, 
      difficulty: diff, 
      screen: 'game',
      currentLevel: s.unlockedLevels[diff] 
    }));
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 w-full max-w-[500px] mx-auto overflow-y-auto">
      <motion.h2
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-[clamp(1.5rem,8vw,4.5rem)] font-black italic text-white mb-6 sm:mb-20 text-center drop-shadow-lg leading-tight lg:-mb-10"
      >
        PICK YOUR <span className="text-yellow-400">QUEST</span>
      </motion.h2>
      
      <div className="flex flex-col gap-4 w-full h-full justify-center">
        {difficulties.map((diff, i) => {
          const locked = isLocked(diff);
          return (
            <motion.div
              key={diff}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="w-full"
            >
              <DisneyButton
                onClick={() => select(diff)}
                className={cn(
                  "w-full h-32 sm:h-40 relative flex flex-row items-center justify-start gap-6 px-8",
                  locked && "opacity-50 grayscale cursor-not-allowed"
                )}
                variant={diff === 'easy' ? 'primary' : 'secondary'}
              >
                <div className={cn(
                  "w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-blue-900 border-2 sm:border-4 border-white shadow-xl flex-shrink-0",
                  locked ? "bg-gray-400" : "bg-yellow-400"
                )}>
                  {locked ? <Lock size={24} /> : <Star size={24} fill="currentColor" />}
                </div>
                <div className="text-left">
                  <span className="block text-2xl sm:text-3xl font-black italic leading-none">{DIFFICULTY_CONFIG[diff].label}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-black opacity-60 uppercase tracking-tighter bg-black/20 px-3 py-1 rounded-full whitespace-nowrap">
                      {DIFFICULTY_CONFIG[diff].levels} Chapters
                    </span>
                    {locked && (
                      <span className="text-[10px] font-black text-red-300 uppercase tracking-widest italic">LOCKED</span>
                    )}
                  </div>
                </div>
                {!locked && (
                  <div className="ml-auto text-xs font-black opacity-40 uppercase tracking-widest">
                    Ch. {state.unlockedLevels[diff]}
                  </div>
                )}
              </DisneyButton>
            </motion.div>
          );
        })}
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
