import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ParticleBurstProps {
  x: number;
  y: number;
  onComplete: () => void;
  targetType?: 'normal' | 'golden' | 'bomb' | 'chain' | 'timeFreeze' | 'multiplier';
}

function ParticleBurst({ x, y, onComplete, targetType = 'normal' }: ParticleBurstProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string; size: number }>>([]);

  useEffect(() => {
    const particleCount = targetType === 'normal' ? 8 : 12;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
      color: getParticleColor(targetType),
      size: Math.random() * 4 + 2
    }));
    
    setParticles(newParticles);

    const timer = setTimeout(() => {
      onComplete();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onComplete, targetType]);

  const getParticleColor = (type: string) => {
    switch (type) {
      case 'golden':
        return '#FCD34D'; // yellow-300
      case 'bomb':
        return '#EF4444'; // red-500
      case 'chain':
        return '#A855F7'; // purple-500
      case 'timeFreeze':
        return '#60A5FA'; // blue-400
      case 'multiplier':
        return '#4ADE80'; // green-400
      default:
        return '#FFFFFF'; // white
    }
  };

  const getParticleAnimation = (type: string) => {
    const baseAnimation = {
      initial: { scale: 0, opacity: 1 },
      animate: { 
        scale: [0, 1, 0], 
        opacity: [1, 1, 0],
        x: (i: number) => [0, particles[i]?.x || 0],
        y: (i: number) => [0, particles[i]?.y || 0]
      },
      exit: { scale: 0, opacity: 0 },
      transition: { duration: 1, ease: "easeOut" }
    };

    switch (type) {
      case 'golden':
        return {
          ...baseAnimation,
          animate: {
            ...baseAnimation.animate,
            rotate: [0, 360],
            scale: [0, 1.5, 0]
          }
        };
      case 'bomb':
        return {
          ...baseAnimation,
          animate: {
            ...baseAnimation.animate,
            scale: [0, 2, 0],
            filter: ['blur(0px)', 'blur(2px)', 'blur(0px)']
          }
        };
      case 'chain':
        return {
          ...baseAnimation,
          animate: {
            ...baseAnimation.animate,
            scale: [0, 1.2, 0],
            rotate: [0, 180]
          }
        };
      case 'timeFreeze':
        return {
          ...baseAnimation,
          animate: {
            ...baseAnimation.animate,
            scale: [0, 1.3, 0],
            filter: ['hue-rotate(0deg)', 'hue-rotate(180deg)', 'hue-rotate(0deg)']
          }
        };
      case 'multiplier':
        return {
          ...baseAnimation,
          animate: {
            ...baseAnimation.animate,
            scale: [0, 1.4, 0],
            rotate: [0, 720]
          }
        };
      default:
        return baseAnimation;
    }
  };

  return (
    <div className="fixed pointer-events-none z-50" style={{ left: x, top: y }}>
      <AnimatePresence>
        {particles.map((particle, index) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: particle.color,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: '-50%',
              top: '-50%'
            }}
            {...getParticleAnimation(targetType)}
            custom={index}
          />
        ))}
      </AnimatePresence>
      
      {/* Special effect for power-up targets */}
      {targetType !== 'normal' && (
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{ 
            scale: [0, 2, 0], 
            opacity: [1, 0.8, 0] 
          }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute w-16 h-16 rounded-full border-2"
          style={{
            borderColor: getParticleColor(targetType),
            left: '-50%',
            top: '-50%'
          }}
        />
      )}
    </div>
  );
}

export default ParticleBurst;