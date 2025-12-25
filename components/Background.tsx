import React from 'react';

export const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Dark Gradient Base */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1a1a2e_0%,#050505_100%)]" />
      
      {/* Moving Grid */}
      <div className="absolute inset-[-100%] w-[300%] h-[300%] animate-grid-flow opacity-20"
           style={{
             backgroundImage: `
               linear-gradient(rgba(0, 243, 255, 0.3) 1px, transparent 1px),
               linear-gradient(90deg, rgba(0, 243, 255, 0.3) 1px, transparent 1px)
             `,
             backgroundSize: '80px 80px',
           }}
      />
      
      {/* Ambient Glow Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-neon-purple rounded-full mix-blend-screen filter blur-[150px] opacity-10 animate-pulse-fast" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-neon-blue rounded-full mix-blend-screen filter blur-[150px] opacity-10 animate-pulse-fast" />
    </div>
  );
};