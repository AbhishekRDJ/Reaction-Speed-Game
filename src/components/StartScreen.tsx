import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Crown, Bomb, Zap, Snowflake, Star, Target, Clock, Zap as ZapIcon, Eye, Heart } from 'lucide-react';
import { GameMode } from '../App';

interface StartScreenProps {
  onStart: (mode: GameMode) => void;
}

function StartScreen({ onStart }: StartScreenProps) {
  const [selectedMode, setSelectedMode] = useState<GameMode>('classic');

  const gameModes = [
    {
      id: 'classic' as GameMode,
      name: 'Classic Mode',
      description: 'Classic 30-second challenge with power-ups',
      icon: Target,
      color: 'from-blue-500 to-purple-500',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-400/30'
    },
    {
      id: 'survival' as GameMode,
      name: 'Survival Mode',
      description: 'No time limit, only missed targets matter',
      icon: Heart,
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-400/30'
    },
    {
      id: 'speed' as GameMode,
      name: 'Speed Mode',
      description: 'Targets appear faster and faster',
      icon: ZapIcon,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-400/30'
    },
    {
      id: 'precision' as GameMode,
      name: 'Precision Mode',
      description: 'Smaller targets, higher points',
      icon: Eye,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-400/30'
    },
    {
      id: 'nightmare' as GameMode,
      name: 'Nightmare Mode',
      description: 'Targets move around the screen',
      icon: Crown,
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-400/30'
    },
    {
      id: 'zen' as GameMode,
      name: 'Zen Mode',
      description: 'Relaxed gameplay with no pressure',
      icon: Clock,
      color: 'from-teal-500 to-cyan-500',
      bgColor: 'bg-teal-500/20',
      borderColor: 'border-teal-400/30'
    }
  ];

  const powerUps = [
    { icon: Crown, name: 'Golden Target', description: '5x points!', color: 'text-yellow-400' },
    { icon: Bomb, name: 'Bomb Target', description: 'Explodes nearby targets', color: 'text-red-400' },
    { icon: Zap, name: 'Chain Target', description: 'Cascading explosions', color: 'text-purple-400' },
    { icon: Snowflake, name: 'Time Freeze', description: 'Pauses timer for 5s', color: 'text-blue-400' },
    { icon: Star, name: 'Multiplier', description: 'Doubles combo for 10s', color: 'text-green-400' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-full flex flex-col items-center justify-center p-8 text-center overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Welcome to Reaction Speed!
        </h2>
        <p className="text-purple-200 text-lg mb-6">
          Choose your game mode and test your reflexes!
        </p>
      </motion.div>

      {/* Game Mode Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8 max-w-4xl w-full"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center justify-center gap-2">
          <Target className="w-5 h-5 text-purple-400" />
          Select Game Mode
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gameModes.map((mode, index) => (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                selectedMode === mode.id
                  ? `${mode.bgColor} ${mode.borderColor} ring-2 ring-white/50`
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
              onClick={() => setSelectedMode(mode.id)}
            >
              <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br ${mode.color} flex items-center justify-center`}>
                <mode.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-white font-bold text-lg mb-2">{mode.name}</h4>
              <p className="text-gray-300 text-sm">{mode.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Power-ups Guide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-8 max-w-2xl"
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-center gap-2">
          <Target className="w-5 h-5 text-purple-400" />
          Special Targets & Power-ups
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {powerUps.map((powerUp, index) => (
            <motion.div
              key={powerUp.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
              className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
            >
              <powerUp.icon className={`w-6 h-6 ${powerUp.color}`} />
              <div className="text-left">
                <div className="text-white font-semibold text-sm">{powerUp.name}</div>
                <div className="text-gray-300 text-xs">{powerUp.description}</div>
              </div>
            </motion.div>
          ))}
        </div>
        <p className="text-blue-200 text-sm mt-4">
          💡 Power-ups appear randomly and make the game more exciting!
        </p>
      </motion.div>

      {/* Start Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
        onClick={() => onStart(selectedMode)}
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
      >
        <Play className="w-6 h-6" />
        Start {gameModes.find(m => m.id === selectedMode)?.name}
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="text-purple-200 text-sm mt-4"
      >
        Ready to test your reflexes? 🚀
      </motion.p>
    </motion.div>
  );
}

export default StartScreen;