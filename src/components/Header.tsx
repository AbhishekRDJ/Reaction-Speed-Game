import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, BookOpen, Gamepad2, Trophy, Menu, X, Info } from 'lucide-react';
import { GameMode } from '../App';

interface HeaderProps {
  currentMode: GameMode;
  onShowRules: () => void;
  onShowModes: () => void;
  onShowLeaderboard: () => void;
}

function Header({ currentMode, onShowRules, onShowModes, onShowLeaderboard }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getModeIcon = () => {
    switch (currentMode) {
      case 'survival':
        return <span className="text-red-400">❤️</span>;
      case 'speed':
        return <span className="text-yellow-400">⚡</span>;
      case 'precision':
        return <span className="text-green-400">👁️</span>;
      case 'nightmare':
        return <span className="text-purple-400">👑</span>;
      case 'zen':
        return <span className="text-teal-400">🕐</span>;
      default:
        return <span className="text-blue-400">🎯</span>;
    }
  };

  const getModeName = () => {
    switch (currentMode) {
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

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="top-0 z-50 sticky bg-white/10 backdrop-blur-md p-3 border-white/20 border-b">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="flex justify-center items-center bg-gradient-to-br from-purple-500 to-pink-500 mt-2 mb-2 rounded-xl w-16 h-16">
              {/* <Target className="w-6 h-6 text-white" /
              > */}
              <img
                src="assets/logo.png"
                alt="Reaction Speed Logo"
                onClick={() => window.location.reload()}
                width={220}
              />
            </div>
            <div>




              <h1 className="font-bold text-white text-xl">Reaction Speed</h1>
              <p className="text-purple-200 text-xs">Test your reflexes!</p>
            </div>
          </motion.div>

          {/* Current Mode Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden md:flex items-center gap-2 bg-white/10 px-4 py-2 border border-white/20 rounded-full"
          >
            <span className="text-lg">{getModeIcon()}</span>
            <span className="font-medium text-white text-sm">{getModeName()} Mode</span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onShowRules}
              className="flex items-center gap-2 hover:bg-white/10 px-4 py-2 rounded-lg text-white hover:text-purple-200 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span className="font-medium text-sm">Rules</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onShowModes}
              className="flex items-center gap-2 hover:bg-white/10 px-4 py-2 rounded-lg text-white hover:text-purple-200 transition-colors"
            >
              <Gamepad2 className="w-4 h-4" />
              <span className="font-medium text-sm">Modes</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onShowLeaderboard}
              className="flex items-center gap-2 hover:bg-white/10 px-4 py-2 rounded-lg text-white hover:text-purple-200 transition-colors"
            >
              <Trophy className="w-4 h-4" />
              <span className="font-medium text-sm">Leaderboard</span>
            </motion.button>
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMenu}
            className="md:hidden bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </motion.button>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-white/20 border-t"
            >
              <div className="space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { onShowRules(); setIsMenuOpen(false); }}
                  className="flex items-center gap-3 hover:bg-white/10 px-4 py-3 rounded-lg w-full text-white hover:text-purple-200 transition-colors"
                >
                  <BookOpen className="w-5 h-5" />
                  <span className="font-medium">Game Rules</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { onShowModes(); setIsMenuOpen(false); }}
                  className="flex items-center gap-3 hover:bg-white/10 px-4 py-3 rounded-lg w-full text-white hover:text-purple-200 transition-colors"
                >
                  <Gamepad2 className="w-5 h-5" />
                  <span className="font-medium">Game Modes</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { onShowLeaderboard(); setIsMenuOpen(false); }}
                  className="flex items-center gap-3 hover:bg-white/10 px-4 py-3 rounded-lg w-full text-white hover:text-purple-200 transition-colors"
                >
                  <Trophy className="w-5 h-5" />
                  <span className="font-medium">Leaderboard</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

export default Header;
