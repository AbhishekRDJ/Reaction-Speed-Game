import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Target from './Target';
import { Target as TargetType, GameState, GameMode } from '../App';

interface GameBoardProps {
  targets: TargetType[];
  onTargetHit: (targetId: string) => void;
  gameState: GameState;
  gameMode: GameMode;
}

function GameBoard({ targets, onTargetHit, gameState, gameMode }: GameBoardProps) {
  const getModeDescription = () => {
    switch (gameMode) {
      case 'survival':
        return 'Survive as long as possible! No time limit.';
      case 'speed':
        return 'Speed Mode: Targets appear faster and faster!';
      case 'precision':
        return 'Precision Mode: Smaller targets, higher points!';
      case 'nightmare':
        return 'Nightmare Mode: Moving targets! Good luck!';
      case 'zen':
        return 'Zen Mode: Relaxed gameplay, no pressure.';
      default:
        return 'Classic Mode: 30 seconds to prove your skills!';
    }
  };

  return (
    <div className="relative w-full h-96 md:h-[500px] bg-black/20 rounded-2xl border border-white/10 backdrop-blur-sm overflow-hidden">
      {gameState === 'paused' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/50 flex items-center justify-center z-20"
        >
          <div className="text-white text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-4xl md:text-6xl font-bold mb-4"
            >
              PAUSED
            </motion.div>
            <p className="text-purple-200">Click Resume to continue</p>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {targets.map((target) => (
          <Target
            key={target.id}
            target={target}
            onHit={onTargetHit}
            gameMode={gameMode}
          />
        ))}
      </AnimatePresence>

      {/* Game area instructions */}
      {targets.length === 0 && gameState === 'playing' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-white/60 text-center">
            <div className="text-2xl mb-2">Get Ready!</div>
            <div className="text-sm mb-2">{getModeDescription()}</div>
            <div className="text-xs">Targets will appear soon...</div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default GameBoard;