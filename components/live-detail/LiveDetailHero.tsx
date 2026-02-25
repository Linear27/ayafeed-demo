
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import { Live, Theme } from '../../types';

interface LiveDetailHeroProps {
  live: Live;
  theme: Theme;
}

const LiveDetailHero: React.FC<LiveDetailHeroProps> = ({ live, theme }) => {
  const isNewspaper = theme === 'newspaper';

  return (
    <>
      <div className="relative w-full h-[40vh] sm:h-[50vh] min-h-[300px] overflow-hidden">
        <img 
          src={live.image || null} 
          alt={live.title} 
          className={`w-full h-full object-cover ${isNewspaper ? '' : 'brightness-50'}`} 
        />
        <div className={`absolute inset-0 ${isNewspaper ? 'bg-gradient-to-t from-[#FDFBF7] via-transparent to-transparent opacity-90' : 'bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent'}`}></div>
        
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8">
          {isNewspaper && (
            <div className="mb-4 bg-red-600 text-white px-4 py-1 text-sm font-black uppercase tracking-[0.2em] transform -skew-x-12 border-2 border-white shadow-lg">
              特别报导
            </div>
          )}
          
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-5xl">
            <h1 className={`text-4xl sm:text-6xl md:text-7xl font-black mb-6 leading-[0.9] ${isNewspaper ? 'text-slate-900 font-header drop-shadow-md' : 'text-white'}`}>
              {live.title}
            </h1>
          </motion.div>
        </div>
      </div>

      <div className={`relative z-20 ${isNewspaper ? 'bg-black text-white' : 'bg-slate-900 text-white shadow-xl'}`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/20">
          <div className="flex-1 p-4 flex items-center justify-center gap-3">
            <Calendar size={20} className="text-red-500"/>
            <span className="font-bold text-lg tracking-widest">{live.date}</span>
          </div>
          <div className="flex-1 p-4 flex items-center justify-center gap-6">
            <div className="text-center">
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">开场 (OPEN)</span>
              <span className="font-mono text-xl font-bold">{live.openTime || '待定'}</span>
            </div>
            <div className="h-8 w-px bg-white/20"></div>
            <div className="text-center">
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">开演 (START)</span>
              <span className="font-mono text-xl font-bold">{live.startTime || '待定'}</span>
            </div>
          </div>
          <div className="flex-1 p-4 flex items-center justify-center gap-3">
            <MapPin size={20} className="text-red-500"/>
            <span className="font-bold text-lg">{live.venue}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default LiveDetailHero;
