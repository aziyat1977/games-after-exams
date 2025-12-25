import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Background } from './components/Background';
import { NeonRecall } from './components/NeonRecall';
import { EmojiCipher } from './components/EmojiCipher';
import { SpeedMatch } from './components/SpeedMatch';
import { ViewState } from './types';
import { Brain, Sparkles, Zap, ChevronLeft, Cpu } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME);

  const goHome = () => setView(ViewState.HOME);

  const renderContent = () => {
    switch (view) {
      case ViewState.NEON_RECALL: return <NeonRecall />;
      case ViewState.EMOJI_CIPHER: return <EmojiCipher />;
      case ViewState.SPEED_MATCH: return <SpeedMatch />;
      default: return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl h-[60vh] px-8">
           <GameCard 
             title="NEON RECALL" 
             icon={<Brain className="w-20 h-20" />} 
             desc="Cybernetic Pattern Memory" 
             color="from-neon-pink to-purple-600"
             onClick={() => setView(ViewState.NEON_RECALL)}
           />
           <GameCard 
             title="EMOJI CIPHER" 
             icon={<Sparkles className="w-20 h-20" />} 
             desc="Pop Culture Decryption" 
             color="from-neon-blue to-cyan-600"
             onClick={() => setView(ViewState.EMOJI_CIPHER)}
           />
           <GameCard 
             title="SPEED MATCH" 
             icon={<Zap className="w-20 h-20" />} 
             desc="High Velocity Pairing" 
             color="from-neon-green to-yellow-600"
             onClick={() => setView(ViewState.SPEED_MATCH)}
           />
        </div>
      );
    }
  };

  return (
    <div className="relative min-h-screen text-white font-rajdhani selection:bg-neon-blue selection:text-black overflow-hidden">
      <Background />

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6 border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-4">
          {view !== ViewState.HOME && (
            <button onClick={goHome} className="p-2 hover:bg-white/10 rounded-full transition-colors group">
              <ChevronLeft className="w-10 h-10 text-neon-blue group-hover:-translate-x-1 transition-transform" />
            </button>
          )}
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
      <main className="relative z-10 h-[calc(100vh-100px)] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

// Helper Component for the Menu Cards with Enhanced Animation
const GameCard: React.FC<{ title: string; icon: React.ReactNode; desc: string; color: string; onClick: () => void }> = ({ title, icon, desc, color, onClick }) => (
  <motion.button 
    whileHover={{ scale: 1.05, y: -15 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="group relative h-full w-full bg-dark-card border border-white/5 rounded-[2rem] overflow-hidden text-left flex flex-col transition-all hover:border-white/40 hover:shadow-[0_0_60px_rgba(0,243,255,0.2)]"
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
    
    <div className={`h-2/3 bg-gradient-to-br ${color} flex items-center justify-center text-white p-10 relative overflow-hidden`}>
      <motion.div 
        className="relative z-10 drop-shadow-2xl"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="transform group-hover:scale-125 transition-transform duration-500">
          {icon}
        </div>
      </motion.div>
      
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      <motion.div 
        className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </div>

    <div className="flex-1 p-10 flex flex-col justify-center backdrop-blur-xl bg-black/60 relative">
      <h3 className="font-orbitron text-4xl font-bold text-white mb-3 group-hover:text-neon-blue transition-colors">{title}</h3>
      <p className="font-rajdhani text-xl text-gray-300 group-hover:text-white transition-colors">{desc}</p>
      
      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0">
         <div className="bg-white/10 p-2 rounded-full">
           <ChevronLeft className="w-6 h-6 rotate-180" />
         </div>
      </div>
    </div>
  </motion.button>
);

export default App;