
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameStatus } from '../types';
import { Play, RotateCcw, Zap } from 'lucide-react';

const GRID_SIZE = 3; // 3x3 grid
const INITIAL_SEQUENCE_LENGTH = 3;

export const NeonRecall: React.FC = () => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [level, setLevel] = useState(1);
  const [activeButton, setActiveButton] = useState<number | null>(null);

  const startGame = () => {
    setStatus(GameStatus.PLAYING);
    setLevel(1);
    startRound(1);
  };

  const startRound = (currentLevel: number) => {
    const length = INITIAL_SEQUENCE_LENGTH + (currentLevel - 1);
    const newSequence = Array.from({ length }, () => Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE)));
    setSequence(newSequence);
    setPlayerSequence([]);
    setIsPlayingSequence(true);
    playSequence(newSequence);
  };

  const playSequence = async (seq: number[]) => {
    await new Promise(r => setTimeout(r, 800));
    
    for (let i = 0; i < seq.length; i++) {
      setActiveButton(seq[i]);
      await new Promise(r => setTimeout(r, 600)); 
      setActiveButton(null);
      await new Promise(r => setTimeout(r, 200)); 
    }
    setIsPlayingSequence(false);
  };

  const handleButtonPress = (index: number) => {
    if (status !== GameStatus.PLAYING || isPlayingSequence) return;

    setActiveButton(index);
    setTimeout(() => setActiveButton(null), 200);

    const nextIndex = playerSequence.length;
    if (index !== sequence[nextIndex]) {
      setStatus(GameStatus.FAILURE);
      return;
    }

    const newPlayerSeq = [...playerSequence, index];
    setPlayerSequence(newPlayerSeq);

    if (newPlayerSeq.length === sequence.length) {
      if (level >= 5) {
        setStatus(GameStatus.SUCCESS);
      } else {
        setTimeout(() => {
          setLevel(l => l + 1);
          startRound(level + 1);
        }, 1000);
      }
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center relative p-6">
      <AnimatePresence>
        {status === GameStatus.IDLE && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
             <h2 className="text-6xl font-orbitron text-neon-blue mb-8 drop-shadow-[0_0_15px_rgba(0,243,255,0.8)]">NEON RECALL</h2>
             <button onClick={startGame} className="bg-white text-black text-2xl font-bold font-orbitron px-12 py-6 rounded-full hover:scale-105 transition-transform flex items-center gap-4 mx-auto">
               <Play fill="black" /> LET'S GO!
             </button>
           </motion.div>
        )}

        {(status === GameStatus.SUCCESS || status === GameStatus.FAILURE) && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="absolute z-50 bg-black/80 backdrop-blur-xl border-2 border-white/20 p-12 rounded-3xl text-center"
          >
            <h2 className={`text-6xl font-orbitron mb-4 ${status === GameStatus.SUCCESS ? 'text-neon-green' : 'text-neon-pink'}`}>
              {status === GameStatus.SUCCESS ? 'SMASHED IT!' : 'GAME OVER'}
            </h2>
            <p className="text-2xl text-gray-400 mb-8 font-rajdhani">LEVEL: {level}</p>
            <button onClick={startGame} className="bg-white/10 border border-white/40 text-white hover:bg-white hover:text-black text-xl font-bold font-orbitron px-10 py-4 rounded-xl transition-all flex items-center gap-3 mx-auto">
              <RotateCcw /> RETRY
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`grid grid-cols-3 gap-4 md:gap-6 p-6 bg-dark-card border border-white/10 rounded-3xl transition-opacity duration-500 ${status === GameStatus.IDLE ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
        {Array.from({ length: 9 }).map((_, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleButtonPress(i)}
            animate={{
              backgroundColor: activeButton === i ? '#00f3ff' : 'rgba(255,255,255,0.05)',
              boxShadow: activeButton === i ? '0 0 30px #00f3ff' : 'none',
              scale: activeButton === i ? 1.05 : 1
            }}
            className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border border-white/10 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
            {activeButton === i && (
              <motion.div 
                layoutId="flash" 
                className="absolute inset-0 bg-white mix-blend-overlay"
                transition={{ duration: 0.1 }} 
              />
            )}
          </motion.button>
        ))}
      </div>
      
      {status === GameStatus.PLAYING && (
        <div className="mt-8 font-orbitron text-xl text-neon-purple tracking-widest animate-pulse">
           {isPlayingSequence ? "WATCH" : "REPEAT"}
        </div>
      )}
    </div>
  );
};
