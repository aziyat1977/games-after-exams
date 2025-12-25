import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EmojiPuzzle, GameStatus } from '../types';
import { generateEmojiPuzzle } from '../services/geminiService';
import { Sparkles, BrainCircuit, RefreshCw } from 'lucide-react';

export const EmojiCipher: React.FC = () => {
  const [puzzle, setPuzzle] = useState<EmojiPuzzle | null>(null);
  const [status, setStatus] = useState<GameStatus>(GameStatus.LOADING);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const loadLevel = async () => {
    setStatus(GameStatus.LOADING);
    setSelectedOption(null);
    const newPuzzle = await generateEmojiPuzzle();
    setPuzzle(newPuzzle);
    setStatus(GameStatus.PLAYING);
  };

  useEffect(() => {
    loadLevel();
  }, []);

  const handleGuess = (option: string) => {
    if (status !== GameStatus.PLAYING) return;
    setSelectedOption(option);
    
    if (option === puzzle?.answer) {
      setStatus(GameStatus.SUCCESS);
    } else {
      setStatus(GameStatus.FAILURE);
    }
  };

  if (status === GameStatus.LOADING) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <RefreshCw className="w-20 h-20 text-neon-purple animate-spin mb-6" />
        <h2 className="text-3xl font-orbitron text-white">DECRYPTING DATA STREAMS...</h2>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-8 max-w-6xl mx-auto">
      
      {/* Header Info */}
      <div className="w-full flex justify-between items-center mb-10 border-b border-white/10 pb-4">
         <div className="flex items-center gap-3 text-neon-green">
           <BrainCircuit className="w-8 h-8" />
           <span className="font-orbitron text-xl tracking-widest">CATEGORY: {puzzle?.category.toUpperCase()}</span>
         </div>
         <button onClick={loadLevel} className="text-gray-400 hover:text-white font-rajdhani uppercase tracking-widest">Skip Puzzle &rarr;</button>
      </div>

      {/* The Puzzle Display */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full bg-dark-card border border-neon-purple/30 rounded-3xl p-12 mb-12 flex flex-col items-center shadow-[0_0_50px_rgba(188,19,254,0.15)]"
      >
        <span className="text-gray-400 font-orbitron text-sm mb-4">DECODE THE SEQUENCE</span>
        <div className="text-7xl md:text-9xl tracking-[0.2em] drop-shadow-2xl">
          {puzzle?.emojis}
        </div>
      </motion.div>

      {/* Interaction Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        {puzzle?.options.map((option, idx) => {
          let btnStyle = "bg-white/5 border-white/10 hover:bg-white/10 hover:border-neon-blue";
          
          if (status !== GameStatus.PLAYING) {
            if (option === puzzle.answer) btnStyle = "bg-neon-green/20 border-neon-green shadow-[0_0_30px_rgba(10,255,0,0.3)]";
            else if (option === selectedOption) btnStyle = "bg-neon-pink/20 border-neon-pink opacity-50";
            else btnStyle = "opacity-30 bg-black border-transparent";
          }

          return (
            <motion.button
              key={idx}
              whileTap={status === GameStatus.PLAYING ? { scale: 0.98 } : {}}
              onClick={() => handleGuess(option)}
              className={`p-6 md:p-8 rounded-2xl border-2 text-2xl md:text-3xl font-rajdhani font-bold text-white transition-all duration-300 ${btnStyle}`}
            >
              {option}
            </motion.button>
          );
        })}
      </div>

      {/* Result Overlay / Next Button */}
      {status !== GameStatus.PLAYING && (
        <motion.div 
           initial={{ y: 50, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           className="fixed bottom-10 left-1/2 -translate-x-1/2"
        >
          <button 
            onClick={loadLevel}
            className={`px-12 py-4 rounded-full font-orbitron font-bold text-xl shadow-xl hover:scale-105 transition-transform flex items-center gap-3 ${status === GameStatus.SUCCESS ? 'bg-neon-green text-black' : 'bg-neon-pink text-white'}`}
          >
            {status === GameStatus.SUCCESS ? 'HACK SUCCESSFUL' : 'HACK FAILED'} - NEXT LEVEL <Sparkles className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </div>
  );
};