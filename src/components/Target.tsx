import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target as TargetType, GameMode } from '../App';
import ParticleBurst from './ParticleBurst';
import { Crown, Bomb, Zap, Snowflake, Star } from 'lucide-react';

interface TargetProps {
  target: TargetType;
  onHit: (targetId: string) => void;
  gameMode?: GameMode;
}

function Target({ target, onHit, gameMode = 'classic' }: TargetProps) {
  const [showParticles, setShowParticles] = useState(false);
  const [particlePosition, setParticlePosition] = useState({ x: 0, y: 0 });

  const handleClick = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    setParticlePosition({ x: centerX, y: centerY });
    setShowParticles(true);
    onHit(target.id);
  };

  const getTargetSize = () => {
    if (gameMode === 'precision') {
      return 'w-8 h-8 md:w-12 md:h-12'; // Smaller targets for precision mode
    }
    return 'w-12 h-12 md:w-16 md:h-16'; // Normal size for other modes
  };

  const getShapeClasses = () => {
    let baseClasses = `absolute cursor-pointer shadow-lg ${getTargetSize()}`;
    
    // Add special styling for power-up targets
    switch (target.type) {
      case 'golden':
        baseClasses += ' bg-gradient-to-br from-yellow-300 to-yellow-600 animate-pulse';
        break;
      case 'bomb':
        baseClasses += ' bg-gradient-to-br from-red-500 to-red-800 animate-bounce';
        break;
      case 'chain':
        baseClasses += ' bg-gradient-to-br from-purple-500 to-purple-800 animate-pulse';
        break;
      case 'timeFreeze':
        baseClasses += ' bg-gradient-to-br from-blue-400 to-blue-700 animate-pulse';
        break;
      case 'multiplier':
        baseClasses += ' bg-gradient-to-br from-green-400 to-green-700 animate-pulse';
        break;
      default:
        baseClasses += ` ${target.color}`;
    }
    
    switch (target.shape) {
      case 'circle':
        return `${baseClasses} rounded-full`;
      case 'square':
        return `${baseClasses} rounded-lg`;
      case 'triangle':
        return `${baseClasses} rounded-lg transform rotate-45`;
      default:
        return `${baseClasses} rounded-full`;
    }
  };

  const getPowerUpIcon = () => {
    const iconSize = gameMode === 'precision' ? "w-4 h-4 md:w-6 md:h-6" : "w-6 h-6 md:w-8 md:h-8";
    const iconColor = "text-white drop-shadow-lg";
    
    switch (target.type) {
      case 'golden':
        return <Crown className={`${iconSize} ${iconColor} text-yellow-200`} />;
      case 'bomb':
        return <Bomb className={`${iconSize} ${iconColor} text-red-200`} />;
      case 'chain':
        return <Zap className={`${iconSize} ${iconColor} text-purple-200`} />;
      case 'timeFreeze':
        return <Snowflake className={`${iconSize} ${iconColor} text-blue-200`} />;
      case 'multiplier':
        return <Star className={`${iconSize} ${iconColor} text-green-200`} />;
      default:
        return null;
    }
  };

  const getGlowEffect = () => {
    switch (target.type) {
      case 'golden':
        return 'shadow-[0_0_20px_rgba(255,215,0,0.8)]';
      case 'bomb':
        return 'shadow-[0_0_20px_rgba(239,68,68,0.8)]';
      case 'chain':
        return 'shadow-[0_0_20px_rgba(147,51,234,0.8)]';
      case 'timeFreeze':
        return 'shadow-[0_0_20px_rgba(59,130,246,0.8)]';
      case 'multiplier':
        return 'shadow-[0_0_20px_rgba(34,197,94,0.8)]';
      default:
        return '';
    }
  };

  return (
    <>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`${getShapeClasses()} ${getGlowEffect()}`}
        style={{
          left: `${target.x}%`,
          top: `${target.y}%`,
          transform: target.shape === 'triangle' 
            ? `translate(-50%, -50%) rotate(45deg)` 
            : 'translate(-50%, -50%)'
        }}
        onClick={handleClick}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
      >
        {/* Power-up icon overlay */}
        {target.type !== 'normal' && (
          <div className="absolute inset-0 flex items-center justify-center">
            {getPowerUpIcon()}
          </div>
        )}
      </motion.div>
      
      {showParticles && (
        <ParticleBurst
          x={particlePosition.x}
          y={particlePosition.y}
          onComplete={() => setShowParticles(false)}
          targetType={target.type}
        />
      )}
    </>
  );
}

export default Target;