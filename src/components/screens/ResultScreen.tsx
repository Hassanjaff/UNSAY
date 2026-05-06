import React from 'react';
import { motion } from 'motion/react';
import { useGame } from '../../context/GameContext';
import { DisneyButton } from '../UI';
import { playSound } from '../../lib/audio';
import { Trophy, RotateCcw, ArrowRight } from 'lucide-react';
import { DIFFICULTY_CONFIG } from '../../constants';

interface FinalResultScreenProps {
  type: 'win' | 'fail';
}

export function FinalResultScreen({ type }: FinalResultScreenProps) {
  const { state, setState } = useGame();

  const handleNext = () => {
    playSound('transition');
    if (type === 'win') {
      const db = state.difficulty!;
      const nextLevel = state.currentLevel + 1;
      const config = DIFFICULTY_CONFIG[db];
      
      if (nextLevel > config.levels) {
        // Difficulty completed
        setState(s => ({ ...s, screen: 'difficulty' }));
      } else {
        setState(s => ({ 
          ...s, 
          currentLevel: nextLevel, 
          screen: 'game',
          unlockedLevels: {
            ...s.unlockedLevels,
            [db]: Math.max(s.unlockedLevels[db], nextLevel)
          } 
        }));
      }
    } else {
      // Restart level
      setState(s => ({ ...s, screen: 'game' }));
    }
  };

  const handleMenu = () => {
    playSound('transition');
    setState(s => ({ ...s, screen: 'difficulty' }));
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        className="mb-8"
      >
        {type === 'win' ? (
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-yellow-400 flex items-center justify-center shadow-[0_0_50px_rgba(250,204,21,0.6)] border-4 border-white">
              <Trophy size={60} className="text-blue-900" />
            </div>
            <motion.div
               animate={{ opacity: [0, 1, 0], scale: [1, 2, 1] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="absolute -top-4 -right-4 text-4xl"
            >✨</motion.div>
          </div>
        ) : (
          <div className="w-32 h-32 rounded-full bg-red-500 flex items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.4)] border-4 border-white">
            <RotateCcw size={60} className="text-white" />
          </div>
        )}
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-6xl font-black italic text-white mb-6 uppercase tracking-tighter"
      >
        {type === 'win' ? 'PURE MAGIC!' : 'LIES BREAK...'}
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-pink-300 mb-12 text-md font-bold tracking-wide px-10 max-w-lg italic"
      >
        {state.feedback || (type === 'win' 
          ? `SHAPED THE TRUTH perfectly.`
          : "IT DOESN'T HOLD UP.")}
      </motion.p>

      {type === 'win' && (
        <motion.div 
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '100%', opacity: 1 }}
          className="max-w-xs w-full mb-12 bg-black/40 rounded-full h-8 p-1 border border-white/20 overflow-hidden relative"
        >
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <span className="text-[10px] font-black uppercase tracking-widest mix-blend-difference">
              Truth Alteration: {state.score * 10}%
            </span>
          </div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${state.score * 10}%` }}
            className="h-full bg-gradient-to-r from-pink-500 to-yellow-400 rounded-full"
          />
        </motion.div>
      )}

      <div className="space-y-4 w-full">
        <DisneyButton onClick={handleNext} className="w-full py-6 flex items-center justify-center gap-2">
           {type === 'win' ? (
             <>
               <span>Next Level</span>
               <ArrowRight />
             </>
           ) : (
             <>
               <RotateCcw />
               <span>Try Again</span>
             </>
           )}
        </DisneyButton>

        <button 
          onClick={handleMenu}
          className="text-blue-400 uppercase tracking-widest text-xs hover:text-white transition-colors py-4"
        >
          Back to Selection
        </button>
      </div>
    </div>
  );
}
