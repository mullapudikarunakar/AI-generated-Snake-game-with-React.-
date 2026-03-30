import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 120;

type Point = { x: number; y: number };

export default function SnakeGame({ onScoreUpdate }: { onScoreUpdate: (score: number) => void }) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  
  const directionRef = useRef(direction);
  
  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setIsPaused(false);
    setScore(0);
    onScoreUpdate(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (directionRef.current.y === 0) {
            setDirection({ x: 0, y: -1 });
          }
          break;
        case 'ArrowDown':
        case 's':
          if (directionRef.current.y === 0) {
            setDirection({ x: 0, y: 1 });
          }
          break;
        case 'ArrowLeft':
        case 'a':
          if (directionRef.current.x === 0) {
            setDirection({ x: -1, y: 0 });
          }
          break;
        case 'ArrowRight':
        case 'd':
          if (directionRef.current.x === 0) {
            setDirection({ x: 1, y: 0 });
          }
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + direction.x,
          y: head.y + direction.y,
        };

        directionRef.current = direction;

        // Check collision with walls
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check collision with self
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check collision with food
        if (newHead.x === food.x && newHead.y === food.y) {
          setFood(generateFood(newSnake));
          const newScore = score + 10;
          setScore(newScore);
          onScoreUpdate(newScore);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [direction, food, gameOver, isPaused, generateFood, score, onScoreUpdate]);

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-md mx-auto">
      <div className="flex justify-between w-full mb-4 px-2 items-end">
        <div 
          className="text-neon-cyan font-digital text-5xl tracking-widest drop-shadow-[0_0_10px_rgba(0,255,255,0.8)] glitch-text"
          data-text={`SCORE: ${score.toString().padStart(4, '0')}`}
        >
          SCORE: {score.toString().padStart(4, '0')}
        </div>
        <div className="text-neon-pink font-mono text-sm tracking-widest drop-shadow-[0_0_8px_rgba(255,0,255,0.8)] uppercase pb-1">
          {isPaused ? 'PAUSED' : 'PLAYING'}
        </div>
      </div>

      <div 
        className="relative bg-black/80 border-2 border-neon-purple rounded-lg overflow-hidden shadow-[0_0_20px_rgba(176,38,255,0.4)]"
        style={{
          width: '100%',
          aspectRatio: '1/1',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 pointer-events-none" 
             style={{
               backgroundImage: 'linear-gradient(rgba(176, 38, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(176, 38, 255, 0.1) 1px, transparent 1px)',
               backgroundSize: `${100/GRID_SIZE}% ${100/GRID_SIZE}%`
             }}
        />

        {/* Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <motion.div
              key={`${segment.x}-${segment.y}-${index}`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className={`rounded-sm ${isHead ? 'bg-neon-cyan shadow-[0_0_10px_rgba(0,255,255,0.8)] z-10' : 'bg-neon-cyan/80 shadow-[0_0_5px_rgba(0,255,255,0.5)]'}`}
              style={{
                gridColumnStart: segment.x + 1,
                gridRowStart: segment.y + 1,
              }}
            />
          );
        })}

        {/* Food */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="bg-neon-pink rounded-full shadow-[0_0_15px_rgba(255,0,255,1)] z-10"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
          }}
        />

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20">
            <h2 className="text-4xl font-black text-neon-pink mb-4 drop-shadow-[0_0_15px_rgba(255,0,255,0.8)] tracking-widest">
              GAME OVER
            </h2>
            <p className="text-neon-cyan font-mono mb-6 drop-shadow-[0_0_8px_rgba(0,255,255,0.8)] text-lg">
              FINAL SCORE: {score}
            </p>
            <button
              onClick={resetGame}
              className="px-6 py-2 bg-transparent border-2 border-neon-cyan text-neon-cyan font-bold rounded hover:bg-neon-cyan hover:text-black transition-all duration-300 shadow-[0_0_10px_rgba(0,255,255,0.5)] hover:shadow-[0_0_20px_rgba(0,255,255,0.8)]"
            >
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-6 flex gap-4 text-xs font-mono text-gray-400">
        <span className="flex items-center gap-1"><kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-700">WASD</kbd> / <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-700">Arrows</kbd> to move</span>
        <span className="flex items-center gap-1"><kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-700">Space</kbd> to pause</span>
      </div>
    </div>
  );
}
