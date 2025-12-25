
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WorldClue, GameStatus } from '../types';
import { generateWorldMystery } from '../services/geminiService';
import { Globe, MapPin, AlertTriangle, Play } from 'lucide-react';

export const WorldSeeker: React.FC = () => {
  const [data, setData] = useState<WorldClue | null>(null);
  const [status, setStatus] = useState<GameStatus>(GameStatus.LOADING);
  const [input, setInput] = useState('');
  const [revealedClues, setRevealedClues] = useState(0);

  const initGame = async () => {
    setStatus(GameStatus.LOADING);
    const mystery = await generateWorldMystery();
    setData(mystery);
    setRevealedClues(1);
    setInput('');
    setStatus(GameStatus.PLAYING);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleGuess = () => {
    if (!data) return;
    const normalize = (s: string) => s.toLowerCase().trim();
    if (normalize(input) === normalize(data.country) || normalize(input) === normalize(data.city)) {
      setStatus(GameStatus.SUCCESS);
    } else {
      setStatus(GameStatus.FAILURE);
    }
  };

  const revealClue = () => {
    if (revealedClues < 3) setRevealedClues(c => c + 1);
  };

  if (status === GameStatus.LOADING) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-neon-blue">
         <Globe className="w-24 h-24 animate-pulse mb-6" />
         <h2 className="font-orbitron text-3xl">SEARCHING LOCATION...</h2>
      </div>
    );
  }

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Terminal / Clue Display */}
        <div className="bg-dark-card border border-neon-blue/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,243,255,0.1)] backdrop-blur-md">
          <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
             <AlertTriangle className="text-yellow-400" />
             <h3 className="font-orbitron text-xl text-yellow-400 tracking-widest">MISSION: FIND LOCATION</h3>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-black/40 rounded-lg border-l-4 border-neon-purple">
               <p className="text-gray-400 text-sm font-rajdhani uppercase mb-1">Satellite View</p>
               <p className="text-lg text-white font-rajdhani leading-relaxed italic">"{data?.description}"</p>
            </div>

            <div className="space-y-3">
              {[0, 1, 2].map((idx) => (
                <div key={idx} className={`p-4 rounded-xl border transition-all duration-500 ${idx < revealedClues ? 'bg-neon-blue/10 border-neon-blue text-white' : 'bg-gray-900 border-gray-800 text-gray-700'}`}>
                  {idx < revealedClues ? (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse"></div>
                      <span className="font-orbitron">HINT_0{idx + 1}: {data?.clues[idx]}</span>
                    </div>
                  ) : (
                    <span className="font-orbitron">CLASSIFIED DATA</span>
                  )}
                </div>
              ))}
            </div>

            {revealedClues < 3 && status === GameStatus.PLAYING && (
              <button 
                onClick={revealClue}
                className="w-full py-3 border border-dashed border-gray-600 text-gray-400 font-orbitron hover:bg-white/5 transition"
              >
                NEED MORE CLUES
              </button>
            )}
          </div>
        </div>

        {/* Interaction Panel */}
        <div className="flex flex-col justify-center gap-6">
          <div className="bg-dark-card p-8 rounded-3xl border border-white/10">
            <h2 className="font-orbitron text-4xl text-white mb-2">WHERE IS THIS?</h2>
            <p className="text-gray-400 font-rajdhani mb-8">Enter city or country name.</p>
            
            {status === GameStatus.PLAYING ? (
              <div className="flex gap-4">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="ENTER NAME..."
                  className="flex-1 bg-black/50 border-2 border-neon-blue/50 rounded-xl px-6 py-4 text-2xl text-white font-orbitron focus:outline-none focus:border-neon-blue focus:shadow-[0_0_20px_rgba(0,243,255,0.3)] transition-all uppercase placeholder-gray-700"
                />
                <button 
                  onClick={handleGuess}
                  className="bg-neon-blue text-black font-bold font-orbitron px-8 rounded-xl hover:scale-105 transition-transform"
                >
                  OK
                </button>
              </div>
            ) : (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`p-6 rounded-2xl text-center border-2 ${status === GameStatus.SUCCESS ? 'border-neon-green bg-neon-green/10' : 'border-neon-pink bg-neon-pink/10'}`}
              >
                 <h3 className="text-3xl font-orbitron font-bold mb-2">
                   {status === GameStatus.SUCCESS ? 'CORRECT!' : 'WRONG!'}
                 </h3>
                 <p className="text-xl font-rajdhani mb-6">
                   Answer: <span className="text-white font-bold">{data?.city}, {data?.country}</span>
                 </p>
                 <button 
                   onClick={initGame}
                   className="bg-white text-black px-8 py-3 rounded-full font-orbitron font-bold hover:bg-gray-200"
                 >
                   NEXT MISSION
                 </button>
              </motion.div>
            )}
          </div>
          
          <div className="flex justify-end opacity-50">
             <MapPin className="text-neon-blue w-32 h-32" />
          </div>
        </div>

      </div>
    </div>
  );
};
