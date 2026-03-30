import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Background Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.2) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: 'perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
          transformOrigin: 'top center',
        }}
      />
      
      {/* Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-cyan/20 rounded-full blur-[100px] pointer-events-none" />

      <header className="mb-8 text-center z-10">
        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink drop-shadow-[0_0_15px_rgba(176,38,255,0.8)] tracking-tighter">
          NEON SNAKE
        </h1>
        <p className="text-neon-cyan/70 font-mono tracking-[0.3em] mt-2 text-sm">
          SYNTHWAVE EDITION
        </p>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 z-10 items-start">
        {/* Game Section */}
        <div className="lg:col-span-7 xl:col-span-8 flex justify-center">
          <SnakeGame onScoreUpdate={setScore} />
        </div>

        {/* Music Player Section */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
          <MusicPlayer />
          
          {/* Stats Panel */}
          <div className="bg-black/60 backdrop-blur-md border border-neon-cyan/30 rounded-xl p-6 shadow-[0_0_20px_rgba(0,255,255,0.1)]">
            <h3 className="text-neon-cyan font-mono text-sm tracking-widest mb-4 border-b border-neon-cyan/20 pb-2">
              SESSION STATS
            </h3>
            <div className="flex justify-between items-end">
              <span className="text-gray-400 font-mono text-xs">CURRENT SCORE</span>
              <span className="text-3xl font-black text-neon-pink drop-shadow-[0_0_10px_rgba(255,0,255,0.6)]">
                {score.toString().padStart(4, '0')}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
