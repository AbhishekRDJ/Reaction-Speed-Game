import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Clock, Zap, Snowflake, Star, Heart, Eye, Crown } from 'lucide-react';
import { GameMode } from '../App';

interface ScoreBoardProps {
  score: number;
  bestScore: number;
  timeLeft: number;
  maxTime: number;
  missedTargets: number;
  maxMissed: number;
  combo: number;
  comboMultiplier: number;
  isTimeFrozen: boolean;
  gameMode: GameMode;
}

function ScoreBoard({ 
  score, 
  bestScore, 
  timeLeft, 
  maxTime, 
  missedTargets, 
  maxMissed, 
  combo,
  comboMultiplier,
  isTimeFrozen,
  gameMode
}: ScoreBoardProps) {
  const timePercentage = maxTime === Infinity ? 100 : (timeLeft / maxTime) * 100;
  const missedPercentage = (missedTargets / maxMissed) * 100;

  const getModeIcon = () => {
    switch (gameMode) {
      case 'survival':
        return <Heart className="w-5 h-5 text-red-400" />;
      case 'speed':
        return <Zap className="w-5 h-5 text-yellow-400" />;
      case 'precision':
        return <Eye className="w-5 h-5 text-green-400" />;
      case 'nightmare':
        return <Crown className="w-5 h-5 text-purple-400" />;
      case 'zen':
        return <Clock className="w-5 h-5 text-teal-400" />;
      default:
        return <Target className="w-5 h-5 text-blue-400" />;
    }
  };

  const getModeName = () => {
    switch (gameMode) {
      case 'survival':
        return 'Survival';
      case 'speed':
        return 'Speed';
      case 'precision':
        return 'Precision';
      case 'nightmare':
        return 'Nightmare';
      case 'zen':
        return 'Zen';
      default:
        return 'Classic';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
    >
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-400" />
        Score Board
      </h2>

      {/* Game Mode Display */}
      <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-gray-300 text-sm">Mode</span>
          <div className="flex items-center gap-2">
            {getModeIcon()}
            <span className="text-white font-semibold">{getModeName()}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Current Score */}
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Current Score</span>
          <motion.span
            key={score}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-2xl font-bold text-white"
          >
            {score}
          </motion.span>
        </div>

        {/* Best Score */}
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Best Score</span>
          <span className="text-xl font-semibold text-yellow-400">{bestScore}</span>
        </div>

        {/* Combo */}
        {combo > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex justify-between items-center"
          >
            <span className="text-gray-300 flex items-center gap-1">
              <Zap className="w-4 h-4 text-yellow-400" />
              Combo
            </span>
            <span className="text-lg font-bold text-orange-400">
              {combo}x {combo >= 3 && '🔥'}
            </span>
          </motion.div>
        )}

        {/* Combo Multiplier */}
        {comboMultiplier > 1 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex justify-between items-center bg-green-500/20 p-2 rounded-lg border border-green-400/30"
          >
            <span className="text-gray-300 flex items-center gap-1">
              <Star className="w-4 h-4 text-green-400" />
              Multiplier
              </span>
            <span className="text-lg font-bold text-green-400">
              {comboMultiplier}x
            </span>
          </motion.div>
        )}

        {/* Timer */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-300 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {gameMode === 'survival' ? 'Time' : 'Time Left'}
            </span>
            <span className="text-lg font-bold text-white">
              {gameMode === 'survival' ? (
                <span className="flex items-center gap-1">
                  <span className="text-lg">∞</span>
                </span>
              ) : (
                `${timeLeft}s`
              )}
            </span>
          </div>
          {gameMode !== 'survival' && (
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <motion.div
                className={`h-full ${isTimeFrozen ? 'bg-blue-400' : 'bg-gradient-to-r from-green-400 via-yellow-400 to-red-400'}`}
                initial={{ width: '100%' }}
                animate={{ width: `${timePercentage}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}
          {isTimeFrozen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-1 text-blue-300 text-sm"
            >
              <Snowflake className="w-3 h-3" />
              Time Frozen!
            </motion.div>
          )}
        </div>

        {/* Missed Targets */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-300 flex items-center gap-1">
              <Target className="w-4 h-4" />
              Missed
            </span>
            <span className="text-lg font-bold text-red-400">
              {missedTargets}/{maxMissed}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-red-500"
              animate={{ width: `${missedPercentage}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ScoreBoard;