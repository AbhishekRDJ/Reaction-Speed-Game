import React, { useState, useEffect, useCallback } from 'react';
import GameBoard from './components/GameBoard';
import ScoreBoard from './components/ScoreBoard';
import Controls from './components/Controls';
import Leaderboard from './components/Leaderboard';
import StartScreen from './components/StartScreen';
import GameOverScreen from './components/GameOverScreen';
import Header from './components/Header';
import Rules from './components/Rules';
import { motion, AnimatePresence } from 'framer-motion';

export type GameState = 'start' | 'playing' | 'paused' | 'gameOver';
export type GameMode = 'classic' | 'survival' | 'speed' | 'precision' | 'nightmare' | 'zen';

export interface Target {
  id: string;
  x: number;
  y: number;
  shape: 'circle' | 'square' | 'triangle';
  color: string;
  timeoutId: number;
  type: 'normal' | 'golden' | 'bomb' | 'chain' | 'timeFreeze' | 'multiplier';
  powerLevel?: number;
  // For nightmare mode - moving targets
  velocityX?: number;
  velocityY?: number;
}

export interface GameScore {
  id: string;
  score: number;
  mode: GameMode;
  timestamp: number;
  combo: number;
}

function App() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targets, setTargets] = useState<Target[]>([]);
  const [missedTargets, setMissedTargets] = useState(0);
  const [combo, setCombo] = useState(0);
  const [targetSpeed, setTargetSpeed] = useState(2000);
  const [isTimeFrozen, setIsTimeFrozen] = useState(false);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [gameStartTime, setGameStartTime] = useState(0);

  // Modal states
  const [showRules, setShowRules] = useState(false);
  const [showModes, setShowModes] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const maxMissedTargets = gameMode === 'zen' ? 10 : 5;
  const gameTimer = gameMode === 'survival' ? Infinity : gameMode === 'zen' ? 60 : 30;

  // Load best score for current mode
  useEffect(() => {
    const saved = localStorage.getItem(`reactionGameBestScore_${gameMode}`);
    setBestScore(saved ? parseInt(saved, 10) : 0);
  }, [gameMode]);

  // Save best score to localStorage
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem(`reactionGameBestScore_${gameMode}`, score.toString());
    }
  }, [score, bestScore, gameMode]);

  // Game timer
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0 && !isTimeFrozen && gameMode !== 'survival') {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameMode !== 'survival') {
      endGame();
    }
  }, [gameState, timeLeft, isTimeFrozen, gameMode]);

  // Target spawning
  useEffect(() => {
    if (gameState === 'playing') {
      const spawnInterval = setInterval(() => {
        spawnTarget();
      }, targetSpeed);
      return () => clearInterval(spawnInterval);
    }
  }, [gameState, targetSpeed]);

  // Difficulty scaling based on mode
  useEffect(() => {
    let newSpeed = 2000;

    switch (gameMode) {
      case 'speed':
        newSpeed = Math.max(200, 2000 - (score * 100));
        break;
      case 'precision':
        newSpeed = Math.max(1000, 2500 - (score * 30));
        break;
      case 'nightmare':
        newSpeed = Math.max(800, 1800 - (score * 40));
        break;
      case 'zen':
        newSpeed = Math.max(1500, 2500 - (score * 20));
        break;
      default:
        newSpeed = Math.max(500, 2000 - (score * 50));
    }

    setTargetSpeed(newSpeed);
  }, [score, gameMode]);

  // Update moving targets for nightmare mode
  useEffect(() => {
    if (gameState === 'playing' && gameMode === 'nightmare') {
      const moveInterval = setInterval(() => {
        setTargets(prev => prev.map(target => {
          if (target.velocityX !== undefined && target.velocityY !== undefined) {
            let newX = target.x + target.velocityX;
            let newY = target.y + target.velocityY;

            // Bounce off edges
            if (newX <= 5 || newX >= 95) {
              newX = target.x;
              target.velocityX = -target.velocityX;
            }
            if (newY <= 10 || newY >= 90) {
              newY = target.y;
              target.velocityY = -target.velocityY;
            }

            return { ...target, x: newX, y: newY };
          }
          return target;
        }));
      }, 50);

      return () => clearInterval(moveInterval);
    }
  }, [gameState, gameMode]);

  const spawnTarget = useCallback(() => {
    const shapes: Target['shape'][] = ['circle', 'square', 'triangle'];
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];

    // Determine target type based on probability
    const rand = Math.random();
    let targetType: Target['type'] = 'normal';
    const powerLevel = 1;

    if (rand < 0.05) { // 5% chance for golden target
      targetType = 'golden';
      colors.push('bg-yellow-400');
    } else if (rand < 0.08) { // 3% chance for bomb target
      targetType = 'bomb';
      colors.push('bg-red-600');
    } else if (rand < 0.11) { // 3% chance for chain target
      targetType = 'chain';
      colors.push('bg-purple-600');
    } else if (rand < 0.13) { // 2% chance for time freeze
      targetType = 'timeFreeze';
      colors.push('bg-blue-400');
    } else if (rand < 0.15) { // 2% chance for multiplier
      targetType = 'multiplier';
      colors.push('bg-green-400');
    }

    const newTarget: Target = {
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * 80 + 10, // 10% to 90% of screen width
      y: Math.random() * 70 + 15, // 15% to 85% of screen height
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      timeoutId: 0,
      type: targetType,
      powerLevel
    };

    // Add velocity for nightmare mode
    if (gameMode === 'nightmare') {
      newTarget.velocityX = (Math.random() - 0.5) * 2; // -1 to 1
      newTarget.velocityY = (Math.random() - 0.5) * 2; // -1 to 1
    }

    // Set timeout for target disappearance based on mode
    let timeoutDuration = 1500;
    switch (gameMode) {
      case 'speed':
        timeoutDuration = Math.max(400, 1200 - (score * 15));
        break;
      case 'precision':
        timeoutDuration = Math.max(1200, 2000 - (score * 10));
        break;
      case 'nightmare':
        timeoutDuration = Math.max(600, 1500 - (score * 20));
        break;
      case 'zen':
        timeoutDuration = Math.max(1000, 2000 - (score * 5));
        break;
      default:
        timeoutDuration = Math.max(800, 1500 - (score * 10));
    }

    const timeoutId = window.setTimeout(() => {
      removeTarget(newTarget.id, true);
    }, timeoutDuration);

    newTarget.timeoutId = timeoutId;

    setTargets(prev => [...prev, newTarget]);
  }, [score, gameMode]);

  const removeTarget = useCallback((targetId: string, missed: boolean = false) => {
    setTargets(prev => {
      const target = prev.find(t => t.id === targetId);
      if (target) {
        clearTimeout(target.timeoutId);
      }
      return prev.filter(t => t.id !== targetId);
    });

    if (missed) {
      setMissedTargets(prev => prev + 1);
      setCombo(0);
      if (missedTargets + 1 >= maxMissedTargets) {
        endGame();
      }
    }
  }, [missedTargets, maxMissedTargets]);

  const hitTarget = useCallback((targetId: string) => {
    const target = targets.find(t => t.id === targetId);
    if (!target) return;

    // Handle different target types
    switch (target.type) {
      case 'golden':
        handleGoldenTarget(target);
        break;
      case 'bomb':
        handleBombTarget(target);
        break;
      case 'chain':
        handleChainTarget(target);
        break;
      case 'timeFreeze':
        handleTimeFreezeTarget(target);
        break;
      case 'multiplier':
        handleMultiplierTarget(target);
        break;
      default:
        handleNormalTarget(target);
    }
  }, [targets, combo]);

  const handleNormalTarget = (target: Target) => {
    removeTarget(target.id, false);
    setCombo(prev => prev + 1);

    // Combo bonus - different for each mode
    let basePoints = 1;
    switch (gameMode) {
      case 'precision':
        basePoints = 3; // Higher base points for precision mode
        break;
      case 'zen':
        basePoints = 2; // Moderate points for zen mode
        break;
      default:
        basePoints = 1;
    }

    let points = basePoints * comboMultiplier;
    if (combo >= 2) points += (basePoints + 1) * comboMultiplier;
    if (combo >= 4) points += (basePoints + 2) * comboMultiplier;

    setScore(prev => prev + points);
  };

  const handleGoldenTarget = (target: Target) => {
    removeTarget(target.id, false);
    setCombo(prev => prev + 1);

    // Golden target gives 5x points
    let points = 5 * comboMultiplier;
    if (combo >= 2) points += 10 * comboMultiplier;
    if (combo >= 4) points += 15 * comboMultiplier;

    setScore(prev => prev + points);
  };

  const handleBombTarget = (target: Target) => {
    // Remove the bomb target
    removeTarget(target.id, false);

    // Find nearby targets within 30% of screen distance
    const nearbyTargets = targets.filter(t => {
      if (t.id === target.id) return false;
      const distance = Math.sqrt(
        Math.pow((t.x - target.x) / 100, 2) +
        Math.pow((t.y - target.y) / 100, 2)
      );
      return distance < 0.3; // 30% of screen
    });

    // Remove nearby targets and give points
    nearbyTargets.forEach(t => {
      removeTarget(t.id, false);
      setScore(prev => prev + 2 * comboMultiplier);
    });

    // Bonus points for bomb explosion
    setScore(prev => prev + 3 * comboMultiplier);
    setCombo(prev => prev + nearbyTargets.length);
  };

  const handleChainTarget = (target: Target) => {
    // Remove the chain target
    removeTarget(target.id, false);

    // Create cascading explosion effect
    let chainCount = 0;
    const processChain = (startTarget: Target, depth: number = 0) => {
      if (depth > 3) return; // Limit chain depth

      const nearbyTargets = targets.filter(t => {
        if (t.id === startTarget.id) return false;
        const distance = Math.sqrt(
          Math.pow((t.x - startTarget.x) / 100, 2) +
          Math.pow((t.y - startTarget.y) / 100, 2)
        );
        return distance < 0.25; // 25% of screen
      });

      nearbyTargets.forEach(t => {
        removeTarget(t.id, false);
        setScore(prev => prev + (2 + depth) * comboMultiplier);
        chainCount++;

        // Recursive chain explosion
        setTimeout(() => processChain(t, depth + 1), 100);
      });
    };

    processChain(target);
    setCombo(prev => prev + chainCount);
  };

  const handleTimeFreezeTarget = (target: Target) => {
    removeTarget(target.id, false);
    setCombo(prev => prev + 1);

    // Freeze time for 5 seconds
    setIsTimeFrozen(true);
    setTimeout(() => {
      setIsTimeFrozen(false);
    }, 5000);

    setScore(prev => prev + 2 * comboMultiplier);
  };

  const handleMultiplierTarget = (target: Target) => {
    removeTarget(target.id, false);
    setCombo(prev => prev + 1);

    // Double combo multiplier for 10 seconds
    setComboMultiplier(prev => prev * 2);
    setTimeout(() => {
      setComboMultiplier(prev => Math.max(1, prev / 2));
    }, 10000);

    setScore(prev => prev + 3 * comboMultiplier);
  };

  const startGame = (mode: GameMode = 'classic') => {
    setGameMode(mode);
    setGameState('playing');
    setScore(0);
    setTimeLeft(gameMode === 'survival' ? Infinity : gameMode === 'zen' ? 60 : 30);
    setTargets([]);
    setMissedTargets(0);
    setCombo(0);
    setTargetSpeed(2000);
    setIsTimeFrozen(false);
    setComboMultiplier(1);
    setGameStartTime(Date.now());
  };

  const pauseGame = () => {
    setGameState('paused');
    // Clear all target timeouts
    targets.forEach(target => clearTimeout(target.timeoutId));
  };

  const resumeGame = () => {
    setGameState('playing');
    // Restart timeouts for existing targets
    setTargets(prev => prev.map(target => ({
      ...target,
      timeoutId: window.setTimeout(() => removeTarget(target.id, true), 1000)
    })));
  };

  const endGame = () => {
    setGameState('gameOver');
    // Clear all target timeouts
    targets.forEach(target => clearTimeout(target.timeoutId));
    setTargets([]);
    setIsTimeFrozen(false);
    setComboMultiplier(1);

    // Save score to leaderboard
    if (score > 0) {
      const gameScore: GameScore = {
        id: Date.now().toString(),
        score,
        mode: gameMode,
        timestamp: Date.now(),
        combo: combo
      };

      const existingScores = JSON.parse(localStorage.getItem('reactionGameScores') || '[]');
      existingScores.push(gameScore);

      // Sort by score (descending) and keep top 20
      existingScores.sort((a: GameScore, b: GameScore) => b.score - a.score);
      const topScores = existingScores.slice(0, 20);

      localStorage.setItem('reactionGameScores', JSON.stringify(topScores));
    }
  };

  const restartGame = () => {
    endGame();
    setTimeout(() => startGame(gameMode), 100);
  };

  const getGameModeDescription = (mode: GameMode) => {
    switch (mode) {
      case 'classic':
        return 'Classic 30-second challenge with power-ups';
      case 'survival':
        return 'No time limit, only missed targets matter';
      case 'speed':
        return 'Targets appear faster and faster';
      case 'precision':
        return 'Smaller targets, higher points';
      case 'nightmare':
        return 'Targets move around the screen';
      case 'zen':
        return 'Relaxed gameplay with no pressure';
      default:
        return '';
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 min-h-screen overflow-hidden">
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse" />

      <div className="z-10 relative flex flex-col min-h-screen">
        {/* Header */}
        <Header
          currentMode={gameMode}
          onShowRules={() => setShowRules(true)}
          onShowModes={() => setShowModes(true)}
          onShowLeaderboard={() => setShowLeaderboard(true)}
        />

        {/* Power-up Status Indicators - Responsive */}
        {(isTimeFrozen || comboMultiplier > 1) && (
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-2 sm:mt-4 mb-2 sm:mb-4 px-2">
            {isTimeFrozen && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 sm:gap-2 bg-blue-500/80 px-2 sm:px-4 py-1 sm:py-2 rounded-full text-white text-sm sm:text-base"
              >
                <span className="text-base sm:text-lg">⏸️</span>
                <span className="font-bold">TIME FROZEN!</span>
              </motion.div>
            )}
            {comboMultiplier > 1 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 sm:gap-2 bg-green-500/80 px-2 sm:px-4 py-1 sm:py-2 rounded-full text-white text-sm sm:text-base"
              >
                <span className="text-base sm:text-lg">⚡</span>
                <span className="font-bold">{comboMultiplier}x COMBO!</span>
              </motion.div>
            )}
          </div>
        )}

        {/* Main Game Area - Fully Responsive Layout */}
        <div className="flex flex-1 justify-center items-start px-2 sm:px-4 py-2 sm:py-6">
          <div className="w-full max-w-7xl">
            {/* Mobile-First Layout: Stack vertically on small screens, horizontal on large */}
            <div className="flex xl:flex-row flex-col justify-center items-start gap-3 sm:gap-6">

              {/* Game Board - Responsive sizing */}
              <div className="xl:flex-1 order-1 xl:order-1 xl:mx-auto w-full xl:max-w-4xl">
                {gameState === 'start' && <StartScreen onStart={startGame} />}
                {gameState === 'gameOver' && (
                  <GameOverScreen
                    score={score}
                    bestScore={bestScore}
                    onRestart={restartGame}
                    onStartOver={() => setGameState('start')}
                    gameMode={gameMode}
                  />
                )}
                {(gameState === 'playing' || gameState === 'paused') && (
                  <GameBoard
                    targets={targets}
                    onTargetHit={hitTarget}
                    gameState={gameState}
                    gameMode={gameMode}
                  />
                )}
              </div>

              {/* Sidebar - Responsive width and stacking */}
              <div className="xl:flex-shrink-0 order-1 xl:order-2 w-full xl:w-80">
                {/* Mobile: Horizontal scroll for sidebar items, Desktop: Vertical stack */}
                <div className="flex xl:flex-col gap-3 sm:gap-6 pb-2 xl:pb-0 overflow-x-auto xl:overflow-x-visible">

                  {/* Score Board - Responsive sizing */}
                  <div className="flex-shrink-0 w-72 sm:w-80 xl:w-full">
                    <ScoreBoard
                      score={score}
                      bestScore={bestScore}
                      timeLeft={timeLeft}
                      maxTime={gameMode === 'survival' ? Infinity : gameMode === 'zen' ? 60 : 30}
                      missedTargets={missedTargets}
                      maxMissed={maxMissedTargets}
                      combo={combo}
                      comboMultiplier={comboMultiplier}
                      isTimeFrozen={isTimeFrozen}
                      gameMode={gameMode}
                    />
                  </div>

                  {/* Controls - Responsive sizing */}
                  <div className="flex-shrink-0 w-72 sm:w-80 xl:w-full">
                    <Controls
                      gameState={gameState}
                      onStart={() => startGame(gameMode)}
                      onPause={pauseGame}
                      onResume={resumeGame}
                      onRestart={restartGame}
                    />
                  </div>

                  {/* Leaderboard - Hidden on mobile, shown on tablet+ or in modal */}
                  <div className="hidden sm:block flex-shrink-0 w-72 sm:w-80 xl:w-full">
                    <Leaderboard gameMode={gameMode} />
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals - Responsive sizing */}
      <AnimatePresence>
        {showRules && (
          <Rules onClose={() => setShowRules(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showModes && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="z-50 fixed inset-0 flex justify-center items-center bg-black/80 backdrop-blur-sm p-2 sm:p-4"
            onClick={() => setShowModes(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl w-full max-w-xs sm:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="top-0 sticky bg-white/5 backdrop-blur-md p-3 sm:p-6 border-white/20 border-b rounded-t-xl sm:rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <h2 className="font-bold text-white text-lg sm:text-2xl">Game Modes</h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowModes(false)}
                    className="bg-white/10 hover:bg-white/20 p-1 sm:p-2 rounded-lg transition-colors"
                  >
                    <span className="text-white text-lg sm:text-xl">×</span>
                  </motion.button>
                </div>
              </div>
              <div className="p-3 sm:p-6">
                <StartScreen onStart={(mode) => { startGame(mode); setShowModes(false); }} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLeaderboard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="z-50 fixed inset-0 flex justify-center items-center bg-black/80 backdrop-blur-sm p-2 sm:p-4"
            onClick={() => setShowLeaderboard(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl w-full max-w-xs sm:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="top-0 sticky bg-white/5 backdrop-blur-md p-3 sm:p-6 border-white/20 border-b rounded-t-xl sm:rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <h2 className="font-bold text-white text-lg sm:text-2xl">Global Leaderboard</h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowLeaderboard(false)}
                    className="bg-white/10 hover:bg-white/20 p-1 sm:p-2 rounded-lg transition-colors"
                  >
                    <span className="text-white text-lg sm:text-xl">×</span>
                  </motion.button>
                </div>
              </div>
              <div className="p-3 sm:p-6">
                <Leaderboard gameMode={gameMode} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;