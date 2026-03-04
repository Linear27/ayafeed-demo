
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', className = "" }) => {
  const shouldReduceMotion = useReducedMotion();
  const dimensions = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16"
  }[size];

  const spring = { type: "spring", stiffness: 320, damping: 18, mass: 0.45 } as const;

  return (
    <div className={`${dimensions} ${className} relative flex items-center justify-center`}>
      <motion.svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        initial="initial"
        animate="idle"
        whileHover="hover"
        variants={{
          initial: { rotate: 0, y: 0 },
          idle: shouldReduceMotion
            ? { rotate: 0, y: 0 }
            : {
                rotate: [0, -0.7, 0.7, 0],
                y: [0, -0.6, 0],
                transition: { duration: 3.4, ease: "easeInOut", repeat: Infinity }
              },
          hover: shouldReduceMotion
            ? { rotate: 0, y: 0, scale: 1.01, transition: { duration: 0.14, ease: "easeOut" } }
            : { rotate: -1, y: -1.4, scale: 1.03, transition: spring }
        }}
      >
        {/* The Messenger / 急速羽翼 */}
        <motion.path 
          d="M20 80C20 80 40 20 80 20"
          stroke="var(--paper-text)"
          strokeWidth="8"
          strokeLinecap="round"
          variants={{
            initial: { x: 0, y: 0 },
            hover: shouldReduceMotion ? { x: 0, y: 0 } : { x: -2.2, y: -4.2, transition: spring }
          }}
        />
        <motion.path
          d="M35 80C35 80 50 40 80 40"
          stroke="var(--paper-text)"
          strokeWidth="8"
          strokeLinecap="round"
          variants={{
            initial: { x: 0, y: 0 },
            hover: shouldReduceMotion ? { x: 0, y: 0 } : { x: -1.1, y: -2.6, transition: spring }
          }}
        />
        <motion.path
          d="M50 80C50 80 60 60 80 60"
          stroke="var(--paper-accent)"
          strokeWidth="8"
          strokeLinecap="round"
          variants={{
            initial: { x: 0, y: 0, scale: 1 },
            hover: shouldReduceMotion
              ? { x: 0, y: 0, scale: 1.01, transition: { duration: 0.12, ease: "easeOut" } }
              : { x: 0, y: -1.3, scale: 1.06, transition: spring }
          }}
        />
      </motion.svg>
    </div>
  );
};

export default BrandLogo;
