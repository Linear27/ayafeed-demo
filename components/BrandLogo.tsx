import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', className = '' }) => {
  const shouldReduceMotion = useReducedMotion();
  const dimensions = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  }[size];

  const spring = { type: 'spring', stiffness: 320, damping: 20, mass: 0.45 } as const;

  return (
    <div className={`${dimensions} ${className} relative flex items-center justify-center`}>
      <motion.svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        initial={false}
        whileHover={shouldReduceMotion ? { scale: 1.01 } : { rotate: -2, y: -1.5, scale: 1.03 }}
        transition={shouldReduceMotion ? { duration: 0.12, ease: 'easeOut' } : spring}
      >
        <motion.path
          d="M20 80C20 80 40 20 80 20"
          stroke="var(--paper-text)"
          strokeWidth="8"
          strokeLinecap="round"
          whileHover={shouldReduceMotion ? undefined : { x: -2.2, y: -4.2 }}
          transition={spring}
        />
        <motion.path
          d="M35 80C35 80 50 40 80 40"
          stroke="var(--paper-text)"
          strokeWidth="8"
          strokeLinecap="round"
          whileHover={shouldReduceMotion ? undefined : { x: -1.2, y: -2.4 }}
          transition={spring}
        />
        <motion.path
          d="M50 80C50 80 60 60 80 60"
          stroke="var(--paper-accent)"
          strokeWidth="8"
          strokeLinecap="round"
          whileHover={shouldReduceMotion ? { scale: 1.01 } : { y: -1.2, scale: 1.05 }}
          transition={spring}
        />
      </motion.svg>
    </div>
  );
};

export default BrandLogo;
