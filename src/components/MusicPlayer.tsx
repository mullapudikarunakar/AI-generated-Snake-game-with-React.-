import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'motion/react';

const TRACKS = [
  {
    id: 1,
    title: 'Neon Drive',
    artist: 'AI Synthwave',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '6:12',
  },
  {
    id: 2,
    title: 'Cyber City',
    artist: 'Neural Beats',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '7:05',
  },
  {
    id: 3,
    title: 'Digital Dreams',
    artist: 'Algorithm 808',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: '5:44',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(error => {
        console.error("Audio playback failed:", error);
        setIsPlaying(false);
      });
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration > 0) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnd = () => {
    nextTrack();
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-black/60 backdrop-blur-md border border-neon-purple/50 rounded-xl p-6 shadow-[0_0_30px_rgba(176,38,255,0.2)]">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
        loop={false}
      />
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
          <motion.h3 
            key={currentTrack.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-black text-neon-pink tracking-wider drop-shadow-[0_0_8px_rgba(255,0,255,0.8)]"
          >
            {currentTrack.title}
          </motion.h3>
          <p className="text-neon-cyan/80 font-mono text-sm tracking-widest uppercase">
            {currentTrack.artist}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Visualizer bars */}
          <div className="flex items-end gap-1 h-8 w-12">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                animate={isPlaying ? {
                  height: ['20%', '100%', '40%', '80%', '30%'],
                } : { height: '20%' }}
                transition={{
                  repeat: Infinity,
                  duration: 0.5 + (i * 0.1),
                  ease: "easeInOut",
                  repeatType: "reverse"
                }}
                className="w-2 bg-neon-cyan rounded-t-sm shadow-[0_0_5px_rgba(0,255,255,0.8)]"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-800 rounded-full mb-6 overflow-hidden border border-gray-700">
        <motion.div 
          className="h-full bg-gradient-to-r from-neon-purple to-neon-pink shadow-[0_0_10px_rgba(255,0,255,0.8)]"
          style={{ width: `${progress}%` }}
          layout
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button 
          onClick={toggleMute}
          className="p-2 text-gray-400 hover:text-neon-cyan transition-colors"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        <div className="flex items-center gap-6">
          <button 
            onClick={prevTrack}
            className="p-3 rounded-full bg-gray-900/50 text-neon-cyan border border-neon-cyan/30 hover:border-neon-cyan hover:shadow-[0_0_15px_rgba(0,255,255,0.5)] transition-all"
          >
            <SkipBack size={24} fill="currentColor" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="p-4 rounded-full bg-neon-purple text-white shadow-[0_0_20px_rgba(176,38,255,0.6)] hover:shadow-[0_0_30px_rgba(176,38,255,0.9)] hover:scale-105 transition-all"
          >
            {isPlaying ? (
              <Pause size={32} fill="currentColor" />
            ) : (
              <Play size={32} fill="currentColor" className="ml-1" />
            )}
          </button>
          
          <button 
            onClick={nextTrack}
            className="p-3 rounded-full bg-gray-900/50 text-neon-cyan border border-neon-cyan/30 hover:border-neon-cyan hover:shadow-[0_0_15px_rgba(0,255,255,0.5)] transition-all"
          >
            <SkipForward size={24} fill="currentColor" />
          </button>
        </div>

        <div className="w-9"></div> {/* Spacer for balance */}
      </div>
      
      {/* Track List */}
      <div className="mt-8 space-y-2">
        {TRACKS.map((track, index) => (
          <div 
            key={track.id}
            onClick={() => {
              setCurrentTrackIndex(index);
              setIsPlaying(true);
            }}
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
              currentTrackIndex === index 
                ? 'bg-neon-purple/20 border border-neon-purple/50 shadow-[0_0_10px_rgba(176,38,255,0.2)]' 
                : 'hover:bg-white/5 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`font-mono text-xs ${currentTrackIndex === index ? 'text-neon-pink' : 'text-gray-500'}`}>
                0{index + 1}
              </span>
              <span className={`font-medium ${currentTrackIndex === index ? 'text-white' : 'text-gray-400'}`}>
                {track.title}
              </span>
            </div>
            <span className="text-xs font-mono text-gray-500">{track.duration}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
