
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendItem, GameStatus } from '../types';
import { generateTrendPair } from '../services/geminiService';
import { ArrowUp, ArrowDown, RefreshCw, Trophy } from 'lucide-react';

export const TrendWar: React.FC = () => {
  const [items, setItems] = useState<TrendItem[]>([]);
  const [status, setStatus] = useState<GameStatus>(GameStatus.LOADING);
  const [score, setScore] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const loadRound = async () => {
    setStatus(GameStatus.LOADING);
    setRevealed(false);
    const newItems = await generateTrendPair();
    setItems(newItems);
    setStatus(GameStatus.PLAYING);
  };

  useEffect(() => {
    loadRound();
  }, []);

  const handleGuess = (guess: 'higher' | 'lower') => {
    if (status !== GameStatus.PLAYING) return;
    
    setRevealed(true);
    const isHigher = items[1].volume >= items[0].volume;
    const correct = (guess === 'higher' && isHigher) || (guess === 'lower' && !isHigher);

    if (correct) {
      setScore(s => s + 1);
      setStatus(GameStatus.SUCCESS);
    } else {
      setStatus(GameStatus.FAILURE);
    }
  };

  if (status === GameStatus.LOADING && items.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-neon-blue">
        <RefreshCw className="w-16 h-16 animate-spin mb-4" />
        <p className="font-orbitron text-2xl tracking-widest">LOADING TRENDS...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4 flex items-center gap-2 bg-dark-card border border-neon-blue px-6 py-2 rounded-full">
        <Trophy className="text-yellow-400 w-6 h-6" />
        <span className="font-orbitron text-2xl text-white">SCORE: {score}</span>
      </div>

      <div className="flex w-full max-w-6xl gap-8 items-stretch h-[60vh]">
        {/* Left Item (Base) */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex-1 bg-dark-card border-2 border-neon-purple/50 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <h2 className="text-4xl md:text-5xl font-rajdhani font-bold text-center mb-4 text-white">{items[0]?.name}</h2>
          <div className="text-6xl font-orbitron text-neon-purple drop-shadow-[0_0_10px_rgba(188,19,254,0.5)]">
            {items[0]?.volume.toLocaleString()}
          </div>
          <p className="text-gray-400 mt-2 font-rajdhani uppercase tracking-widest">Monthly Searches</p>
        </motion.div>

        {/* VS Badge */}
        <div className="flex items-center justify-center">
          <div className="bg-white text-black font-orbitron font-black text-3xl p-4 rounded-full shadow-[0_0_20px_white]">VS</div>
        </div>

        {/* Right Item (Target) */}
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex-1 bg-dark-card border-2 border-neon-blue/50 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden"
        >
          <h2 className="text-4xl md:text-5xl font-rajdhani font-bold text-center mb-8 text-white">{items[1]?.name}</h2>
          
          {!revealed ? (
             <div className="flex flex-col gap-4 w-full max-w-xs z-10">
               <button 
                 onClick={() => handleGuess('higher')}
                 className="group bg-neon-green/10 hover:bg-neon-green/30 border-2 border-neon-green text-neon-green p-6 rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-4"
               >
                 <ArrowUp className="w-8 h-8 group-hover:-translate-y-1 transition-transform" />
                 <span className="font-orbitron text-2xl font-bold">HIGHER</span>
               </button>
               <button 
                 onClick={() => handleGuess('lower')}
                 className="group bg-neon-pink/10 hover:bg-neon-pink/30 border-2 border-neon-pink text-neon-pink p-6 rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-4"
               >
                 <ArrowDown className="w-8 h-8 group-hover:translate-y-1 transition-transform" />
                 <span className="font-orbitron text-2xl font-bold">LOWER</span>
               </button>
             </div>
          ) : (
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center"
            >
              <div className={`text-6xl font-orbitron mb-2 ${status === GameStatus.SUCCESS ? 'text-neon-green' : 'text-neon-pink'}`}>
                {items[1]?.volume.toLocaleString()}
              </div>
              <p className="text-gray-400 font-rajdhani uppercase tracking-widest mb-6">Monthly Searches</p>
              
              <div className="text-3xl font-orbitron mb-8">
                {status === GameStatus.SUCCESS ? 'CORRECT!' : 'WRONG...'}
              </div>

              <button 
                onClick={() => {
                   if (status === GameStatus.FAILURE) setScore(0);
                   loadRound();
                }}
                className="bg-white text-black font-orbitron font-bold px-8 py-3 rounded-full hover:scale-110 transition-transform"
              >
                {status === GameStatus.FAILURE ? 'RESTART' : 'NEXT ROUND'}
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
