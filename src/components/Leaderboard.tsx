import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, Medal, Award, Target, Heart, Zap, Eye, Clock, Filter, List } from 'lucide-react';
import { GameMode, GameScore } from '../App';

interface LeaderboardProps {
  gameMode: GameMode;
}

function Leaderboard({ gameMode }: LeaderboardProps) {
  const [scores, setScores] = useState<GameScore[]>([]);
  const [filteredScores, setFilteredScores] = useState<GameScore[]>([]);
  const [showAllScores, setShowAllScores] = useState(true);

  useEffect(() => {
    // Load scores from localStorage
    const savedScores = localStorage.getItem('reactionGameScores');
    if (savedScores) {
      const parsedScores: GameScore[] = JSON.parse(savedScores);
      setScores(parsedScores);
    }
  }, []);

  useEffect(() => {
    // Filter scores based on toggle state
    let modeScores: GameScore[];
    
    if (showAllScores) {
      // Show all scores from all modes, sorted by score
      modeScores = scores
        .sort((a, b) => b.score - a.score)
        .slice(0, 10); // Show top 10 overall
    } else {
      // Show scores only for current game mode
      modeScores = scores
        .filter(score => score.mode === gameMode)
        .sort((a, b) => b.score - a.score)
        .slice(0, 8); // Show top 8 for current mode
    }
    
    setFilteredScores(modeScores);
  }, [scores, gameMode, showAllScores]);

  const getModeIcon = (mode: GameMode) => {
    switch (mode) {
      case 'survival':
        return <Heart className="w-4 h-4 text-red-400" />;
      case 'speed':
        return <Zap className="w-4 h-4 text-yellow-400" />;
      case 'precision':
        return <Eye className="w-4 h-4 text-green-400" />;
      case 'nightmare':
        return <Crown className="w-4 h-4 text-purple-400" />;
      case 'zen':
        return <Clock className="w-4 h-4 text-teal-400" />;
      default:
        return <Target className="w-4 h-4 text-blue-400" />;
    }
  };

  const getModeName = (mode: GameMode) => {
    switch (mode) {
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

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-300" />;
      case 3:
        return <Award className="w-5 h-5 text-orange-400" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-xs font-bold text-gray-400">#{rank}</span>;
    }
  };

  const getRankColors = (rank: number) => {
    switch (rank) {
      case 1:
        return 'border-yellow-400/30 bg-yellow-400/10';
      case 2:
        return 'border-gray-300/30 bg-gray-300/10';
      case 3:
        return 'border-orange-400/30 bg-orange-400/10';
      default:
        return 'border-white/10 bg-white/5';
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Crown className="w-5 h-5 text-yellow-400" />
          {showAllScores ? 'Global Leaderboard' : `${getModeName(gameMode)} Leaderboard`}
        </h3>
        
        {/* Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAllScores(!showAllScores)}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          title={showAllScores ? 'Show mode-specific scores' : 'Show all scores'}
        >
          {showAllScores ? (
            <Filter className="w-4 h-4 text-white" />
          ) : (
            <List className="w-4 h-4 text-white" />
          )}
        </motion.button>
      </div>

      {filteredScores.length > 0 ? (
        <div className="space-y-2">
          {filteredScores.map((score, index) => (
            <motion.div
              key={score.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-3 rounded-lg border ${getRankColors(index + 1)} hover:bg-white/10 transition-colors`}
            >
              <div className="flex items-center gap-3">
                {getRankIcon(index + 1)}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium text-sm">
                      Score: {score.score}
                    </span>
                    {showAllScores && (
                      <div className="flex items-center gap-1">
                        {getModeIcon(score.mode)}
                        <span className="text-gray-400 text-xs">
                          {getModeName(score.mode)}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-gray-400 text-xs">
                    {formatDate(score.timestamp)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-bold text-sm">
                  {score.score}
                </div>
                {score.combo > 0 && (
                  <div className="text-yellow-400 text-xs">
                    {score.combo}x combo
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🏆</div>
          <p className="text-gray-300 text-sm mb-2">No scores yet!</p>
          <p className="text-gray-400 text-xs">
            {showAllScores 
              ? 'Be the first to set a record in any mode!' 
              : `Be the first to set a record in ${getModeName(gameMode)} mode!`
            }
          </p>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-500/20 rounded-lg border border-blue-400/30">
        <p className="text-xs text-blue-200 text-center">
          {showAllScores 
            ? 'Global leaderboard shows top scores from all modes! 🌍' 
            : `Beat the top scores to become the ${getModeName(gameMode)} Champion! 🏆`
          }
        </p>
      </div>
    </motion.div>
  );
}

export default Leaderboard;