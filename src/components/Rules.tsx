import React from 'react';
import { motion } from 'framer-motion';
import { X, Target, Crown, Bomb, Zap, Snowflake, Star, Clock, Heart, Eye, Gamepad2, Trophy, Info } from 'lucide-react';
import { GameMode } from '../App';

interface RulesProps {
  onClose: () => void;
}

function Rules({ onClose }: RulesProps) {
  const gameModes = [
    {
      id: 'classic' as GameMode,
      name: 'Classic Mode',
      description: 'Classic 30-second challenge with power-ups',
      icon: Target,
      color: 'from-blue-500 to-purple-500',
      rules: ['30 seconds time limit', '5 missed targets maximum', 'Standard scoring system', 'All power-ups available']
    },
    {
      id: 'survival' as GameMode,
      name: 'Survival Mode',
      description: 'No time limit, only missed targets matter',
      icon: Heart,
      color: 'from-red-500 to-pink-500',
      rules: ['No time limit', '5 missed targets maximum', 'Endless gameplay', 'Focus on accuracy']
    },
    {
      id: 'speed' as GameMode,
      name: 'Speed Mode',
      description: 'Targets appear faster and faster',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      rules: ['30 seconds time limit', '5 missed targets maximum', 'Increasing target speed', 'Fast-paced action']
    },
    {
      id: 'precision' as GameMode,
      name: 'Precision Mode',
      description: 'Smaller targets, higher points',
      icon: Eye,
      color: 'from-green-500 to-emerald-500',
      rules: ['30 seconds time limit', '5 missed targets maximum', 'Smaller target sizes', '3x base points']
    },
    {
      id: 'nightmare' as GameMode,
      name: 'Nightmare Mode',
      description: 'Targets move around the screen',
      icon: Crown,
      color: 'from-purple-500 to-indigo-500',
      rules: ['30 seconds time limit', '5 missed targets maximum', 'Moving targets', 'Bouncing physics']
    },
    {
      id: 'zen' as GameMode,
      name: 'Zen Mode',
      description: 'Relaxed gameplay with no pressure',
      icon: Clock,
      color: 'from-teal-500 to-cyan-500',
      rules: ['60 seconds time limit', '10 missed targets maximum', 'Relaxed pace', '2x base points']
    }
  ];

  const powerUps = [
    {
      icon: Crown,
      name: 'Golden Target',
      description: '5x points!',
      color: 'text-yellow-400',
      details: 'Rare golden targets give 5x the normal points. Perfect for boosting your score quickly!'
    },
    {
      icon: Bomb,
      name: 'Bomb Target',
      description: 'Explodes nearby targets',
      color: 'text-red-400',
      details: 'Clicking a bomb target will destroy all nearby targets within 30% of the screen, giving you bonus points for each destroyed target.'
    },
    {
      icon: Zap,
      name: 'Chain Target',
      description: 'Cascading explosions',
      color: 'text-purple-400',
      details: 'Chain targets create a domino effect, destroying nearby targets which then destroy their neighbors, creating massive chain reactions.'
    },
    {
      icon: Snowflake,
      name: 'Time Freeze',
      description: 'Pauses timer for 5s',
      color: 'text-blue-400',
      details: 'Freezes the game timer for 5 seconds, giving you more time to hit targets without losing precious seconds.'
    },
    {
      icon: Star,
      name: 'Multiplier Target',
      description: 'Doubles combo for 10s',
      color: 'text-green-400',
      details: 'Doubles your combo multiplier for 10 seconds, making every target hit worth twice as many points during this period.'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/5 backdrop-blur-md p-6 border-b border-white/20 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Game Rules & Instructions</h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Basic Rules */}
          <section>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              Basic Gameplay
            </h3>
            <div className="bg-white/5 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                <p className="text-gray-300 text-sm">Click targets before they disappear to score points</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                <p className="text-gray-300 text-sm">Build combos by hitting targets consecutively for bonus points</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                <p className="text-gray-300 text-sm">Don't miss more than the allowed number of targets for your mode</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                <p className="text-gray-300 text-sm">Game ends when time runs out or you miss too many targets</p>
              </div>
            </div>
          </section>

          {/* Game Modes */}
          <section>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-purple-400" />
              Game Modes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gameModes.map((mode, index) => (
                <motion.div
                  key={mode.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border border-white/10 bg-gradient-to-br ${mode.color} bg-opacity-10`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${mode.color} rounded-lg flex items-center justify-center`}>
                      <mode.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold">{mode.name}</h4>
                      <p className="text-gray-300 text-xs">{mode.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-1">
                    {mode.rules.map((rule, ruleIndex) => (
                      <li key={ruleIndex} className="text-gray-300 text-xs flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-white/50 rounded-full mt-1.5 flex-shrink-0"></span>
                        {rule}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Power-ups */}
          <section>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              Power-ups & Special Targets
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {powerUps.map((powerUp, index) => (
                <motion.div
                  key={powerUp.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <powerUp.icon className={`w-6 h-6 ${powerUp.color}`} />
                    <div>
                      <h4 className="text-white font-semibold">{powerUp.name}</h4>
                      <p className="text-gray-300 text-xs">{powerUp.description}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-xs">{powerUp.details}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Scoring System */}
          <section>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Scoring System
            </h3>
            <div className="bg-white/5 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-white font-semibold mb-2">Base Points</h4>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Classic/Survival/Speed/Nightmare: 1 point</li>
                    <li>• Precision: 3 points</li>
                    <li>• Zen: 2 points</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Combo Bonuses</h4>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• 2+ combo: +2 bonus points</li>
                    <li>• 4+ combo: +3 bonus points</li>
                    <li>• Golden targets: 5x multiplier</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Tips */}
          <section>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-400" />
              Pro Tips
            </h3>
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-4 border border-blue-400/30">
              <ul className="space-y-2 text-sm text-blue-200">
                <li>• Focus on accuracy over speed initially</li>
                <li>• Use power-ups strategically to maximize points</li>
                <li>• Practice different modes to improve overall skills</li>
                <li>• Keep your mouse/pointer in the center for better reach</li>
                <li>• Don't panic when targets start moving faster</li>
              </ul>
            </div>
          </section>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Rules;
