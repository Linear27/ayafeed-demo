
import React from 'react';
import { motion } from 'framer-motion';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', className = "" }) => {
  const dimensions = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16"
  }[size];

  return (
    <div className={`${dimensions} ${className} relative flex items-center justify-center`}>
      <motion.svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        initial="initial"
        whileHover="hover"
      >
        {/* 灵动之眼轮廓 (The News Eye Silhouette) */}
        <motion.g stroke="#111827" strokeWidth="4" strokeLinecap="round">
          <motion.path 
            d="M10 50 C30 20 70 20 90 50" 
            variants={{ hover: { d: "M10 50 C30 30 70 30 90 50" } }}
          />
          <motion.path 
            d="M10 50 C30 80 70 80 90 50" 
            variants={{ hover: { d: "M10 50 C30 70 70 70 90 50" } }}
          />
        </motion.g>

        {/* 核心虹膜镜头 (Core Iris Lens) */}
        <motion.g
          variants={{
            hover: { scale: 1.1 }
          }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          {/* 镜头外圈 */}
          <circle 
            cx="50" cy="50" r="22" 
            stroke="#DC2626" 
            strokeWidth="2" 
            strokeDasharray="4 2"
          />
          
          {/* 镜头主体 */}
          <circle 
            cx="50" cy="50" r="15" 
            fill="#DC2626" 
          />
          
          {/* 瞳孔/焦点 */}
          <circle cx="50" cy="50" r="5" fill="#111827" />
          
          {/* 灵动高光 */}
          <motion.circle 
            cx="46" cy="46" r="3" 
            fill="white" 
            fillOpacity="0.6"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.g>

        {/* 装饰性速度感 (Decorative Speed) */}
        <motion.path 
          d="M85 20 L95 10" 
          stroke="#DC2626" 
          strokeWidth="2" 
          strokeLinecap="round"
          opacity="0.3"
          variants={{ hover: { x: 5, y: -5, opacity: 0.6 } }}
        />
      </motion.svg>
    </div>
  );
};

export default BrandLogo;
