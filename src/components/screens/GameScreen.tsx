import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../../context/GameContext';
import { playSound } from '../../lib/audio';
import { LEVELS, DIFFICULTY_CONFIG } from '../../constants';
import { validateUnsay, getHint } from '../../lib/gemini';
import { DisneyButton } from '../UI';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowLeft, Send, XCircle, Lightbulb, BrainCircuit } from 'lucide-react';
import { cn } from '../../lib/utils';

export function GameScreen() {
  const { state, setState } = useGame();
  const [words, setWords] = useState<{ text: string; deleted: boolean }[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [isGettingHint, setIsGettingHint] = useState(false);
  const [hint, setHint] = useState<{ word?: string; suggestion?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const levelInfo = useMemo(() => {
    if (!state.difficulty) return null;
    return LEVELS[state.difficulty]?.[state.currentLevel - 1] || null;
  }, [state.difficulty, state.currentLevel]);

  useEffect(() => {
    if (levelInfo) {
      setWords(levelInfo.original.split(' ').map(w => ({ text: w, deleted: false })));
      setError(null);
      setHint(null);
      playSound('sparkle');
    }
  }, [levelInfo]);

  const toggleWord = (index: number) => {
    playSound('click');
    setWords(prev => prev.map((w, i) => i === index ? { ...w, deleted: !w.deleted } : w));
  };

  const currentResult = words.filter(w => !w.deleted).map(w => w.text).join(' ');
  const deletedCount = words.filter(w => w.deleted).length;

  const handleHint = async () => {
    if (isGettingHint) return;
    setIsGettingHint(true);
    setError(null);
    playSound('transition');
    try {
      const h = await getHint(levelInfo!.original, levelInfo!.requiredRemovals);
      setHint({
        word: h.wordToReveal,
        suggestion: h.suggestion
      });
      playSound('sparkle');
    } catch (e) {
      setError("The Oracle is momentarily silent.");
    } finally {
      setIsGettingHint(false);
    }
  };

  const handleCheck = async () => {
    if (deletedCount !== levelInfo?.requiredRemovals) {
      setError(`You must UNSAY exactly ${levelInfo?.requiredRemovals} words.`);
      playSound('fail');
      return;
    }

    setIsValidating(true);
    setError(null);
    playSound('transition');

    const result = await validateUnsay(levelInfo!.original, currentResult);
    
    setIsValidating(false);

    const threshold = state.difficulty === 'easy' ? 2 : 3;

    if (result.isLogical && result.meaningShift >= threshold) {
      playSound('success');
      playSound('sparkle');
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f472b6', '#fbbf24', '#ffffff']
      });
      setState(s => ({ ...s, screen: 'result', score: result.meaningShift, feedback: result.feedback }));
    } else {
      playSound('fail');
      setState(s => ({ ...s, screen: 'fail', feedback: result.feedback }));
    }
  };

  if (!levelInfo) return null;

  return (
    <div className="flex-1 flex flex-col p-6 h-full relative">
      {/* Header */}
      <div className="mb-8 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => setState(s => ({ ...s, screen: 'difficulty' }))}
            className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-2xl text-white border border-white/20 shadow-lg hover:bg-white/20 transition-all"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex flex-col items-center">
            <span className="text-xs font-black uppercase tracking-widest text-pink-300">Chapter {state.currentLevel}</span>
            <span className="text-2xl font-black italic text-white uppercase">{state.difficulty}</span>
          </div>
          <button 
            onClick={handleHint}
            disabled={isGettingHint}
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-2 border-white transition-all",
              isGettingHint ? "bg-gray-500 animate-spin" : "bg-yellow-400 hover:bg-yellow-300 active:scale-95"
            )}
          >
            {isGettingHint ? <Sparkles size={24} className="text-white" /> : <Lightbulb size={24} className="text-blue-900" />}
          </button>
        </div>
        
        {/* Progress Indicator */}
        <div className="w-full flex items-center gap-4">
          <div className="flex-1 h-3 bg-black/40 rounded-full border border-white/10 overflow-hidden shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(state.currentLevel / DIFFICULTY_CONFIG[state.difficulty!].levels) * 100}%` }}
              className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400 shadow-[0_0_10px_rgba(236,72,153,0.5)]"
            />
          </div>
          <span className="text-[10px] font-black font-mono text-white/50 w-20 text-right uppercase tracking-tighter">
            {state.currentLevel} / {DIFFICULTY_CONFIG[state.difficulty!].levels}
          </span>
        </div>
      </div>

      {/* Tutorial */}
      <AnimatePresence>
        {(levelInfo.tutorial || levelInfo.requiredRemovals) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mb-8 p-4 bg-white text-blue-950 rounded-full font-bold text-sm shadow-[0_10px_20px_rgba(0,0,0,0.3)] animate-pulse relative z-10 text-center border-2 border-blue-400"
          >
            {levelInfo.tutorial || `Magic Requirement: Unsay exactly ${levelInfo.requiredRemovals} words to succeed.`}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level Contents */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-20">
        <AnimatePresence>
          {hint && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-0 inset-x-20 bg-blue-900/90 backdrop-blur-xl border-2 border-blue-400 p-6 rounded-3xl z-50 shadow-2xl"
            >
              <div className="flex items-start gap-4">
                <div className="bg-blue-400 p-2 rounded-xl text-blue-950">
                  <BrainCircuit size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="text-blue-200 font-black uppercase text-xs tracking-widest mb-1">Oracle's Revelation</h4>
                  <p className="text-white font-bold leading-tight">
                    Try removing <span className="text-yellow-400 italic underline text-xl mx-1">"{hint.word}"</span> ... 
                    Maybe it leads to: <span className="text-pink-300 italic">"{hint.suggestion}"</span>?
                  </p>
                </div>
                <button 
                  onClick={() => setHint(null)}
                  className="text-blue-300 hover:text-white transition-colors"
                >
                  <XCircle size={20} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-wrap gap-8 justify-center items-center leading-relaxed w-full">
          {words.map((word, i) => (
            <motion.div key={i} className="group relative">
              <motion.span
                layout
                whileHover={!word.deleted ? { scale: 1.1, rotate: [-1, 1, -1] } : {}}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleWord(i)}
                className={cn(
                  "text-7xl font-black tracking-tighter cursor-pointer transition-all duration-500 select-none px-2 py-4 inline-block",
                  word.deleted 
                    ? "text-red-500/30 line-through decoration-red-600 decoration-[10px] opacity-20 scale-75 rotate-3 blur-[1px]" 
                    : "text-white drop-shadow-[0_8px_0_rgba(0,0,0,0.5)] hover:text-yellow-400"
                )}
              >
                {word.text}
              </motion.span>
              {word.deleted && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="absolute -top-14 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-black uppercase px-3 py-1.5 rounded-full shadow-[0_4px_0_#991B1B] border-2 border-white pointer-events-none"
                >
                  UNSAID
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
        
        {error && (
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="mt-6 text-red-400 text-sm text-center"
          >
            {error}
          </motion.p>
        )}
      </div>

      {/* Action Footer */}
      <div className="pb-10 pt-4 relative z-10">
        <div className="flex justify-between items-center mb-6 px-10">
           <div className="flex gap-4">
             {Array.from({ length: levelInfo.requiredRemovals }).map((_, i) => (
               <motion.div 
                 key={i}
                 initial={false}
                 animate={{ 
                   scale: i < deletedCount ? [1, 1.2, 1] : 1,
                   backgroundColor: i < deletedCount ? "#ef4444" : "rgba(0,0,0,0.2)"
                 }}
                 className={cn(
                   "w-6 h-6 rounded-full border-2 border-white/50",
                   i < deletedCount ? "shadow-[0_0_15px_#ef4444]" : ""
                 )}
               />
             ))}
           </div>
           <div className="flex flex-col items-end">
             <span className="text-xs font-black uppercase text-pink-300 tracking-[0.2em]">Requirement</span>
             <span className="text-2xl font-black text-white italic">
               {deletedCount} <span className="text-white/30">/</span> {levelInfo.requiredRemovals}
             </span>
           </div>
        </div>

        <div className="bg-black/40 backdrop-blur-md p-6 rounded-3xl border border-white/20 flex flex-col items-center shadow-2xl mb-8">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-300 mb-2">Resulting Truth:</p>
           <p className="text-2xl font-black italic text-white text-center leading-tight">
             {currentResult || "???"}
           </p>
        </div>

        <DisneyButton 
          onClick={handleCheck} 
          className="w-full flex items-center justify-center gap-4 py-8 text-3xl"
          disabled={isValidating}
        >
          {isValidating ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: "linear" }}>
              <Sparkles size={32} />
            </motion.div>
          ) : (
            <>
              <span>UNSAY IT!</span>
            </>
          )}
        </DisneyButton>
      </div>
    </div>
  );
}
