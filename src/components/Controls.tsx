import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Square, Home } from 'lucide-react';
import { GameState } from '../App';

interface ControlsProps {
  gameState: GameState;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
}

function Controls({ gameState, onStart, onPause, onResume, onRestart }: ControlsProps) {
  const buttonClass = "flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg";

  const goHome = () => {
    window.location.reload();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
    >
      <h3 className="text-lg font-bold text-white mb-4">Game Controls</h3>
      
      <div className="space-y-3">
        {gameState === 'start' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className={`${buttonClass} bg-green-500 hover:bg-green-400 text-white w-full`}
          >
            <Play className="w-5 h-5" />
            Start Game
          </motion.button>
        )}

        {gameState === 'playing' && (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPause}
              className={`${buttonClass} bg-yellow-500 hover:bg-yellow-400 text-white w-full`}
            >
              <Pause className="w-5 h-5" />
              Pause
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRestart}
              className={`${buttonClass} bg-red-500 hover:bg-red-400 text-white w-full`}
            >
              <RotateCcw className="w-5 h-5" />
              Restart
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goHome}
              className={`${buttonClass} bg-gray-500 hover:bg-gray-400 text-white w-full`}
            >
              <Home className="w-5 h-5" />
              Go Home
            </motion.button>
          </>
        )}

        {gameState === 'paused' && (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onResume}
              className={`${buttonClass} bg-blue-500 hover:bg-blue-400 text-white w-full`}
            >
              <Play className="w-5 h-5" />
              Resume
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRestart}
              className={`${buttonClass} bg-red-500 hover:bg-red-400 text-white w-full`}
            >
              <RotateCcw className="w-5 h-5" />
              Restart
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goHome}
              className={`${buttonClass} bg-gray-500 hover:bg-gray-400 text-white w-full`}
            >
              <Home className="w-5 h-5" />
              Go Home
            </motion.button>
          </>
        )}

        {gameState === 'gameOver' && (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStart}
              className={`${buttonClass} bg-green-500 hover:bg-green-400 text-white w-full`}
            >
              <Play className="w-5 h-5" />
              Play Again
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goHome}
              className={`${buttonClass} bg-gray-500 hover:bg-gray-400 text-white w-full`}
            >
              <Home className="w-5 h-5" />
              Go Home
            </motion.button>
          </>
        )}
      </div>

      {/* Game tips */}
      <div className="mt-6 p-4 bg-black/20 rounded-lg">
        <h4 className="text-sm font-semibold text-white mb-2">💡 Tips</h4>
        <ul className="text-xs text-gray-300 space-y-1">
          <li>• Click targets quickly to build combos</li>
          <li>• 3+ combo gives bonus points</li>
          <li>• Game speeds up as you score more</li>
          <li>• Don't miss more than 5 targets!</li>
          <li>• Use Go Home to change game modes</li>
        </ul>
      </div>
    </motion.div>
  );
}

export default Controls;