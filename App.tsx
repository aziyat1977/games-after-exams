
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Background } from './components/Background';
import { NeonRecall } from './components/NeonRecall';
import { EmojiCipher } from './components/EmojiCipher';
import { SpeedMatch } from './components/SpeedMatch';
import { SyntaxSeeker } from './components/SyntaxSeeker';
import { MemeGlitch } from './components/MemeGlitch';
import { CryptoCross } from './components/CryptoCross';
import { DoodleChaos } from './components/DoodleChaos';
import { ViewState } from './types';
import { Brain, Sparkles, Zap, ChevronLeft, Cpu, Scan, Skull, Hash, Palette } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME);

  const goHome = () => setView(ViewState.HOME);

  const renderContent = () => {
    switch (view) {
      case ViewState.NEON_RECALL: return <NeonRecall />;
      case ViewState.EMOJI_CIPHER: return <EmojiCipher />;
      case ViewState.SPEED_MATCH: return <SpeedMatch />;
      case ViewState.SYNTAX_SEEKER: return <SyntaxSeeker />;
      case ViewState.MEME_GLITCH: return <MemeGlitch />;
      case ViewState.CRYPTO_CROSS: return <CryptoCross />;
      case ViewState.DOODLE_CHAOS: return <DoodleChaos />;
      default: return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl px-8 pb-10">
           <GameCard 
             title="NEON RECALL" 
             icon={<Brain className="w-16 h-16" />} 
             desc="Pattern Memory" 
             color="from-neon-pink to-purple-600"
             onClick={() => setView(ViewState.NEON_RECALL)}
             index={0}
           />
           <GameCard 
             title="SPEED MATCH" 
             icon={<Zap className="w-16 h-16" />} 
             desc="Velocity Pairing" 
             color="from-neon-green to-yellow-600"
             onClick={() => setView(ViewState.SPEED_MATCH)}
             index={1}
           />
           <GameCard 
             title="SYNTAX SEEKER" 
             icon={<Scan className="w-16 h-16" />} 
             desc="Word Search" 
             color="from-blue-500 to-cyan-400"
             onClick={() => setView(ViewState.SYNTAX_SEEKER)}
             index={2}
           />
           <GameCard 
             title="EMOJI CIPHER" 
             icon={<Sparkles className="w-16 h-16" />} 
             desc="Pop Decoder" 
             color="from-purple-500 to-indigo-500"
             onClick={() => setView(ViewState.EMOJI_CIPHER)}
             index={3}
           />
           <GameCard 
             title="MEME GLITCH" 
             icon={<Skull className="w-16 h-16" />} 
             desc="Meme Trivia" 
             color="from-pink-500 to-rose-600"
             onClick={() => setView(ViewState.MEME_GLITCH)}
             index={4}
           />
           <GameCard 
             title="CRYPTO CROSS" 
             icon={<Hash className="w-16 h-16" />} 
             desc="Mini Crossword" 
             color="from-orange-500 to-red-500"
             onClick={() => setView(ViewState.CRYPTO_CROSS)}
             index={5}
           />
           <GameCard 
             title="DOODLE CHAOS" 
             icon={<Palette className="w-16 h-16" />} 
             desc="AI Sketching" 
             color="from-yellow-400 to-orange-500"
             onClick={() => setView(ViewState.DOODLE_CHAOS)}
             index={6}
           />
        </div>
      );
    }
  };

  return (
    <div className="relative min-h-screen text-white font-rajdhani selection:bg-neon-blue selection:text-black overflow-hidden bg-black">
      <Background />

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6 border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <AnimatePresence>
            {view !== ViewState.HOME && (
              <motion.button 
                initial={{ width: 0, opacity: 0, marginRight: 0 }}
                animate={{ width: 'auto', opacity: 1, marginRight: 16 }}
                exit={{ width: 0, opacity: 0, marginRight: 0 }}
                onClick={goHome} 
                className="p-2 hover:bg-white/10 rounded-full transition-colors group overflow-hidden whitespace-nowrap"
              >
                <ChevronLeft className="w-10 h-10 text-neon-blue group-hover:-translate-x-1 transition-transform" />
              </motion.button>
            )}
          </AnimatePresence>
          <div>
            <h1 className="font-orbitron text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-white drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">
              VORTEX<span className="text-neon-purple font-light">OS</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-6">
           <div className="hidden md:flex flex-col items-end">
             <span className="text-xs text-neon-green font-orbitron tracking-widest animate-pulse">SYSTEM ONLINE</span>
             <span className="text-sm text-gray-400 font-rajdhani">ULTIMATE_EDITION v9.0</span>
           </div>
           <Cpu className="text-neon-purple w-8 h-8 animate-spin-slow" />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 h-[calc(100vh-100px)] flex items-center justify-center overflow-y-auto overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ 
              duration: 0.3, 
              ease: "easeInOut"
            }}
            className="w-full h-full flex items-center justify-center py-4"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

// Helper Component for the Menu Cards with Enhanced Animation
const GameCard: React.FC<{ title: string; icon: React.ReactNode; desc: string; color: string; onClick: () => void; index: number }> = ({ title, icon, desc, color, onClick, index }) => (
  <motion.button 
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    whileHover={{ scale: 1.05, y: -10 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="group relative w-full aspect-[4/3] bg-dark-card border border-white/5 rounded-[2rem] overflow-hidden text-left flex flex-col transition-all hover:border-white/40 hover:shadow-[0_0_60px_rgba(0,243,255,0.2)]"
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
    
    <div className={`h-3/5 bg-gradient-to-br ${color} flex items-center justify-center text-white p-6 relative overflow-hidden`}>
      <motion.div 
        className="relative z-10 drop-shadow-2xl"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="transform group-hover:scale-125 transition-transform duration-500">
          {icon}
        </div>
      </motion.div>
      
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      <motion.div 
        className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </div>

    <div className="flex-1 p-6 flex flex-col justify-center backdrop-blur-xl bg-black/60 relative">
      <h3 className="font-orbitron text-2xl font-bold text-white mb-1 group-hover:text-neon-blue transition-colors truncate">{title}</h3>
      <p className="font-rajdhani text-lg text-gray-300 group-hover:text-white transition-colors">{desc}</p>
      
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0">
         <div className="bg-white/10 p-2 rounded-full">
           <ChevronLeft className="w-5 h-5 rotate-180" />
         </div>
      </div>
    </div>
  </motion.button>
);

export default App;
