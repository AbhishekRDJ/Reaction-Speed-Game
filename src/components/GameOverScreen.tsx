import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, RefreshCw, Home, Target, Heart, Zap, Eye, Crown, Clock } from 'lucide-react';
import { GameMode } from '../App';

interface GameOverScreenProps {
  score: number;
  bestScore: number;
  onRestart: () => void;
  onStartOver: () => void;
  gameMode: GameMode;
}

function GameOverScreen({ score, bestScore, onRestart, onStartOver, gameMode }: GameOverScreenProps) {
  const getModeIcon = () => {
    switch (gameMode) {
      case 'survival':
        return <Heart className="w-16 h-16 text-red-400" />;
      case 'speed':
        return <Zap className="w-16 h-16 text-yellow-400" />;
      case 'precision':
        return <Eye className="w-16 h-16 text-green-400" />;
      case 'nightmare':
        return <Crown className="w-16 h-16 text-purple-400" />;
      case 'zen':
        return <Clock className="w-16 h-16 text-teal-400" />;
      default:
        return <Target className="w-16 h-16 text-blue-400" />;
    }
  };

  const getModeName = () => {
    switch (gameMode) {
      case 'survival':
        return 'Survival Mode';
      case 'speed':
        return 'Speed Mode';
      case 'precision':
        return 'Precision Mode';
      case 'nightmare':
        return 'Nightmare Mode';
      case 'zen':
        return 'Zen Mode';
      default:
        return 'Classic Mode';
    }
  };

  const getModeDescription = () => {
    switch (gameMode) {
      case 'survival':
        return 'You survived the challenge!';
      case 'speed':
        return 'Speed demon! How fast can you go?';
      case 'precision':
        return 'Precision master! Every shot counts!';
      case 'nightmare':
        return 'Nightmare conquered! Moving targets defeated!';
      case 'zen':
        return 'Zen achieved! Peaceful gaming complete!';
      default:
        return 'Classic challenge completed!';
    }
  };

  const isNewRecord = score > bestScore;
  const scorePercentage = bestScore > 0 ? (score / bestScore) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-full flex flex-col items-center justify-center p-8 text-center"
    >
      {/* Game Mode Display */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          {getModeIcon()}
          <h2 className="text-3xl md:text-4xl font-bold text-white">{getModeName()}</h2>
        </div>
        <p className="text-purple-200 text-lg">{getModeDescription()}</p>
      </motion.div>

      {/* Score Display */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8 max-w-md w-full"
      >
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">Final Score</h3>
          <motion.div
            key={score}
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"
          >
            {score}
          </motion.div>
        </div>

        {/* Best Score Comparison */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Best Score</span>
            <span className="text-xl font-semibold text-yellow-400">{bestScore}</span>
          </div>
          
          {bestScore > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Performance</span>
                <span className="text-white">{scorePercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(scorePercentage, 100)}%` }}
                  transition={{ duration: 1, delay: 0.6 }}
                />
              </div>
            </div>
          )}
        </div>

        {/* New Record Celebration */}
        {isNewRecord && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
            className="mt-6 p-4 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-xl border border-yellow-400/30"
          >
            <div className="flex items-center justify-center gap-2 text-yellow-400">
              <Trophy className="w-6 h-6" />
              <span className="font-bold text-lg">NEW RECORD! 🎉</span>
              <Trophy className="w-6 h-6" />
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRestart}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Play Again
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartOver}
          className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-full border border-white/20 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
        >
          <Home className="w-5 h-5" />
          Main Menu
        </motion.button>
      </motion.div>

      {/* Encouragement Message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-purple-200 text-sm mt-6"
      >
        {isNewRecord 
          ? "Incredible! You're getting better every time! 🚀" 
          : "Great effort! Keep practicing to beat your best! 💪"
        }
      </motion.p>
    </motion.div>
  );
}

export default GameOverScreen;